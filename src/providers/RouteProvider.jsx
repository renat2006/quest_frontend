import React, { createContext, useContext, useState, useEffect } from "react";


const RouteContext = createContext();

export const useRoute = () => useContext(RouteContext);


export const RouteProvider = ({ children }) => {
    const [routeState, setRouteState] = useState(() => {
        const savedState = localStorage.getItem("routeState");
        return savedState ? JSON.parse(savedState) : {};
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem("routeState");
        if (savedState) {
            setRouteState(JSON.parse(savedState));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("routeState", JSON.stringify(routeState));
        }
    }, [routeState, isLoaded]);

    return (
        <RouteContext.Provider value={{ routeState, setRouteState }}>
            {isLoaded ? children : null}
        </RouteContext.Provider>
    );
};
