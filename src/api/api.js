const API_URL = import.meta.env.VITE_API_HOST;

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'text/plain',

    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        mode: 'no-cors',
        method,
        headers,


    };

    if (body) {
        config.body = JSON.stringify(body);
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
export const refreshToken = (refreshToken) => apiRequest('/refresh', 'POST', null, refreshToken);
export const saveProgress = (progressData, token) => apiRequest('/save_progress', 'PUT', progressData, token);
export const get = () => apiRequest('/uuid', 'GET');
