import {useContext, createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
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

            navigate("/profile");
            return;
        }
        throw new Error("Telegram oauth error");
    };

    const logOut = () => {

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
