import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestContext = createContext();

export const QuestProvider = ({ children }) => {
    const [questData, setQuestData] = useState({
        routeName: '',
        routeLanguage: '',
        routeType: '',
        routeDescription: '',
        routeAudioTeaser: '',
        questId: '',
        promoImage: '',
    });

    const [userId, setUserId] = useState(() => {
        const savedUserId = localStorage.getItem('userId');
        return savedUserId || '';
    });

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, [userId]);

    return (
        <QuestContext.Provider value={{ questData, setQuestData, userId, setUserId }}>
            {children}
        </QuestContext.Provider>
    );
};

export const useQuest = () => {
    return useContext(QuestContext);
};
