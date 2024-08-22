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

export const fetchAllQuests = (token, offset = 0, limit = 10) => {
    return apiRequest(`/quest_list?offset=${offset}&limit=${limit}`, 'GET', null, token);
};

export const fetchQuestForEditing = (questId, token) => apiRequest(`/edit_quest?quest_id=${questId}`, 'GET', null, token);
export const publishQuest = (questId, token) => {
    return apiRequest('/publish_quest', 'POST', {quest_id: questId}, token);
};
export const fetchUserQuests = (token) => {
    return apiRequest('/user_quests', 'GET', null, token);
};

export const createLocation = (locationId, token) => {
    console.log(locationId);
    return apiRequest('/locations', 'POST', {location_id: locationId}, token);
};

export const updateLocation = (locationId, locationData, token) => {
    const formData = new FormData();
    console.log(locationData)
    if (locationData.promoImage) {
        formData.append('promo', locationData.promoImage);
    }

    if (locationData.mediaFiles && locationData.mediaFiles.length > 0) {
        locationData.mediaFiles.forEach((file) => {
            formData.append('media', file);
        });
    }

    const {promoImage, mediaFiles, ...updatedLocationData} = locationData;
    formData.append('json', JSON.stringify(updatedLocationData));

    return apiRequest(`/locations/${locationId}`, 'PUT', formData, token, true);
};

export const fetchQuestLocations = (questId, token, isDraft = false) => {
    const endpoint = `/quests/${questId}/locations?is_draft=${isDraft}`;
    console.log(endpoint);
    return apiRequest(endpoint, 'GET', null, token);
};

export const fetchUserLocations = (token) => {
    return apiRequest('/users/locations', 'GET', null, token);
};

export const fetchLocationForEditing = (locationId, token, isDraft = true, addAuthor = false) => {
    const endpoint = `/locations/${locationId}?is_draft=${isDraft}&add_author=${addAuthor}`;
    console.log(endpoint);
    return apiRequest(endpoint, 'GET', null, token);
};

export const deleteQuest = (questId, token) => {
    return apiRequest('/delete_quest', 'DELETE', {quest_id: questId}, token);
};

export const publishLocation = (locationId, token) => {
    return apiRequest(`/locations/${locationId}/publish`, 'POST', null, token);
};
export const deleteLocation = (locationId, token) => {
    return apiRequest(`/locations/${locationId}`, 'DELETE', null, token);
};