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
        console.log(config.body)
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    console.log(data)
    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const authenticate = (telegramData) => apiRequest('/auth', 'POST', telegramData);

export const refreshToken = (refreshToken) => apiRequest('/refresh', 'POST', { refresh_token: refreshToken });

export const saveProgress = (progressData, token) => apiRequest('/save_progress', 'PUT', progressData, token);

export const createQuest = (questData, token) => {
    const formData = new FormData();
    formData.append('json', JSON.stringify(questData));

    return apiRequest('/save_quest', 'PUT', formData, token, true);
};

export const getUUID = (token) => apiRequest('/uuid', 'GET', null, token);
