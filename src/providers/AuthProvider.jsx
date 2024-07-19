import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import routes from "../routes/routes.js";
import { authenticate } from '../api/api.js';
import {login, logout} from "../api/auth.js";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(import.meta.env.DEV && import.meta.env.VITE_IS_AUTHORIZED === "true" ? {
        "id": 857932226,
        "first_name": "Renat",
        "last_name": "Gubaydullin",
        "username": "belorusstaner",
        "auth_date": 1719389934,
        "hash": "a0d937c1feac78bcea2b9544f6752bffc8f71b105bca25847a8834e26b592714",
        "is_admin": true
    } : null);
    const navigate = useNavigate();
    const { accessToken, refreshToken } = useAuth();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
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
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            await login(data.access_token, data.refresh_token);
            toast.success(`${data.user.first_name}, Вы успешно вошли!`);
            navigate(routes.profile.url);
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            throw new Error("Ошибка аутентификации через Telegram");
        }
    };

    const refreshAccessToken = async (token) => {
        try {
            const data = await refreshToken(token);
            await login(data.access_token, token); // Обновляем access token, используя refresh token
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
            logOut();
        }
    };

    const logOut = async () => {
        toast.error(`${user.first_name}, Вы успешно вышли!`);
        setUser(null);
        localStorage.removeItem("user");
        await logout();
        navigate(routes.profile.url);
    };

    return (
        <AuthContext.Provider value={{ accessToken, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuthContext = () => {
    return useContext(AuthContext);
};
