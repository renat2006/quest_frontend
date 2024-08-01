const API_URL = import.meta.env.VITE_API_HOST;

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null, isFormData = false) => {
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
        console.log(config.body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.headers.get('Content-Type')?.includes('application/zip')) {
        const blob = await response.blob();
        return blob;
    }

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
        throw new Error(data.message || 'Unknown error occurred');
    }

    return data;
};

export const authenticate = (telegramData) => apiRequest('/auth', 'POST', telegramData);

export const refreshToken = (refreshToken) => apiRequest('/refresh', 'POST', {refresh_token: refreshToken});

export const saveProgress = (progressData, token) => apiRequest('/save_progress', 'PUT', progressData, token);

export const createQuest = (questData, token) => {

    const formData = new FormData();

    console.log(questData);
    if (questData.audioFile) {
        formData.append('audio', questData.audioFile);
    }
    if (questData.promoImage) {
        formData.append('promo', questData.promoImage);
    }

    const {audioFile, promoImage, ...updatedQuestData} = questData;

    console.log(updatedQuestData);
    formData.append('json', JSON.stringify(updatedQuestData));

    return apiRequest('/save_quest', 'PUT', formData, token, true);
};

export const getUUID = (token, idCount = 1) => apiRequest(`/uuid?cnt=${idCount}`, 'GET', null, token);

export const fetchQuestForEditing = (questId, token) => apiRequest(`/edit_quest?quest_id=${questId}`, 'GET', null, token);
