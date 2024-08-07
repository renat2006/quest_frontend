import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locationData, setLocationData] = useState({
        locationName: '',
        locationLanguage: '',
        locationCoordinates: [],
        locationDescription: '',
        locationId: localStorage.getItem('locationId') || '',
        associatedQuests: []
    });

    useEffect(() => {
        console.log("LocationProvider useEffect:", locationData);
        if (locationData.locationId) {
            localStorage.setItem('locationId', locationData.locationId);
        }
    }, [locationData]);

    return (
        <LocationContext.Provider value={{ locationData, setLocationData }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationData = () => {
    return useContext(LocationContext);
};
