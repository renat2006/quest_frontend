import React, { createContext, useContext, useState } from 'react';

const QuestContext = createContext();

export const QuestProvider = ({ children }) => {
    const [questData, setQuestData] = useState({
        routeName: '',
        routeLanguage: '',
        routeType: '',
        routeDescription: '',
        routeAudioTeaser: null,
        questId: null,
    });

    return (
        <QuestContext.Provider value={{ questData, setQuestData }}>
            {children}
        </QuestContext.Provider>
    );
};

export const useQuest = () => {
    return useContext(QuestContext);
};
