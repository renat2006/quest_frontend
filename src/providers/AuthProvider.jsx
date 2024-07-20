import {useContext, createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import routes from "../routes/routes.js";
import {authenticate, refreshToken} from '../api/api.js';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(import.meta.env.DEV && import.meta.env.VITE_IS_AUTHORIZED === "true" ? {
        "id": 857932226,
        "first_name": "Renat",
        "last_name": "Gubaydullin",
        "username": "belorusstaner",
        "auth_date": 1719389934,
        "hash": "a0d937c1feac78bcea2b9544f6752bffc8f71b105bca25847a8834e26b592714",
        "is_admin": true
    } : null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser !== undefined && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (refreshToken) {
            const interval = setInterval(() => {
                refreshAccessToken(refreshToken);
            }, 10 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [refreshToken]);

    const loginAction = async (telegramData) => {
        try {

            const data = await authenticate(telegramData);

            if (data.status === "success") {
                setUser(telegramData);
                setAccessToken(data.access_token);
                setRefreshToken(data.refresh_token);
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success(`${data.user.first_name}, Вы успешно вошли!`);
                navigate(routes.profile.url);
            } else {
                toast.error("Не удалось водтвердить валидность данных")
            }

        } catch (error) {
            console.error("Ошибка авторизации:", error);
            throw new Error("Ошибка аутентификации через Telegram");
        }
    };

    const refreshAccessToken = async (token) => {
        try {
            const data = await refreshToken(token);
            setAccessToken(data.access_token);
            localStorage.setItem("accessToken", data.access_token);
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
            logOut();
        }
    };

    const logOut = () => {
        toast.error(`${user.first_name}, Вы успешно вышли!`);
        setUser(null);
        setAccessToken("");
        setRefreshToken("");
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
