import React, { createContext, useContext, useRef } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
    const mapInstances = useRef({});

    return (
        <MapContext.Provider value={mapInstances}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    return useContext(MapContext);
};