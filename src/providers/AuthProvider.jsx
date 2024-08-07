import {useContext, createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import routes from "../routes/routes.js";
import {authenticate, refreshToken} from '../api/api.js';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(import.meta.env.DEV && import.meta.env.VITE_IS_AUTHORIZED === "true" ? {
        "id": 857932226,
        "first_name": "1",
        "last_name": "1",
        "username": "belorusstaner",
        "auth_date": 1722783414,
        "hash": "40bc6592d40b64088f4ecd5c73e2d5f2621e270b354cccd366bd96be3d738256"

    } : null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
    const [refreshTokenValue, setRefreshTokenValue] = useState(localStorage.getItem("refreshToken") || "");
    const navigate = useNavigate();
    useEffect(() => {
        if (import.meta.env.VITE_IS_AUTHORIZED && !localStorage.getItem("user") && user) {
            loginAction(user)
        }

    }, [import.meta.env.VITE_IS_AUTHORIZED]);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // useEffect(() => {
    //     if (refreshTokenValue) {
    //         const interval = setInterval(() => {
    //             refreshAccessToken(refreshTokenValue);
    //             console.log("updated")
    //         }, 10 * 60 * 1000);
    //
    //         return () => clearInterval(interval);
    //     }
    // }, [refreshTokenValue]);

    const loginAction = async (telegramData) => {
        try {
            const data = await authenticate(telegramData);

            if (data.status === "success") {
                const dataUser = telegramData;
                setUser(dataUser);
                setAccessToken(data.access_token);
                setRefreshTokenValue(data.refresh_token);
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(dataUser));
                toast.success(`${dataUser.first_name}, Вы успешно вошли!`);
                navigate(routes.profile.url);
            } else {
                toast.error("Не удалось водтвердить валидность данных");
            }
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            throw new Error("Ошибка аутентификации через Telegram");
        }
    };

    const refreshAccessToken = async (token) => {
        try {
            const data = await refreshToken(token);
            if (data && data.access_token) {
                setAccessToken(data.access_token);
                localStorage.setItem("accessToken", data.access_token);
            } else {
                throw new Error("Invalid response from refresh token endpoint");
            }
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
            logOut();
        }
    };

    const logOut = () => {
        toast.error(`${user?.first_name || "Пользователь"}, Вы успешно вышли!`);
        setUser(null);
        setAccessToken("");
        setRefreshTokenValue("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate(routes.profile.url);
    };

    return (
        <AuthContext.Provider value={{accessToken, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
