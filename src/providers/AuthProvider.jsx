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
        "auth_date": 1723639527,
        "hash": "c144415411883b1ada076d5dcf7e95a56e5dafb1453882e7ad6de110be0f1f7e"
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
    useEffect(() => {
        if (accessToken) {
            const interval = setInterval(() => {
                refreshAccessToken(refreshTokenValue);
            }, 9 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [accessToken, refreshTokenValue]);

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
