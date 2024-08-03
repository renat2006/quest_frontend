import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestContext = createContext();

export const QuestProvider = ({ children }) => {
    const [questData, setQuestData] = useState({
        routeName: '',
        routeLanguage: '',
        routeType: '',
        routeDescription: '',
        routeAudioTeaser: '',
        questId: localStorage.getItem('questId') || '',
        promoImage: '',
    });

    useEffect(() => {
        console.log("QuestProvider useEffect:", questData.questId);
        if (questData.questId) {
            localStorage.setItem('questId', questData.questId);
        }
    }, [questData.questId]);

    return (
        <QuestContext.Provider value={{ questData, setQuestData }}>
            {children}
        </QuestContext.Provider>
    );
};

export const useQuest = () => {
    return useContext(QuestContext);
};
