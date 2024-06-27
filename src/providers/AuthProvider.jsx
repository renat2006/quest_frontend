import {useContext, createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = import.meta.env.DEV && import.meta.env.VITE_IS_AUTHORIZED === "true" ? useState({
        "id": 857932226,
        "first_name": "Renat",
        "last_name": "Gubaydullin",
        "username": "belorusstaner",
        "auth_date": 1719389934,
        "hash": "a0d937c1feac78bcea2b9544f6752bffc8f71b105bca25847a8834e26b592714",
        "is_admin":true
    }) : useState(null);
    const [token, setToken] = import.meta.env.DEV && import.meta.env.VITE_IS_AUTHORIZED === "true" ? useState("a0d937c1feac78bcea2b9544f6752bffc8f71b105bca25847a8834e26b592714") : useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginAction = async (data) => {
        if (data) {
            setUser(data);
            setToken(data.hash);
            localStorage.setItem("site", data.hash);
            localStorage.setItem("user", JSON.stringify(data));
            toast.success(`${data.first_name}, Вы успешно вошли!`)
            navigate("/profile");
            return;
        }
        throw new Error("Telegram oauth error");
    };

    const logOut = () => {
        toast.error(`${user.first_name}, Вы успешно вышли!`)
        setUser(null);
        setToken("");

        localStorage.removeItem("site");
        localStorage.removeItem("user");

        navigate("/profile");
    };

    return (
        <AuthContext.Provider value={{token, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
