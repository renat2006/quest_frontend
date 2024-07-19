import { createAuthProvider } from 'react-token-auth';

const API_URL = import.meta.env.VITE_API_HOST;

const refreshEndpoint = async (refreshToken) => {
    const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Не удалось обновить токен');
    }

    return data.access_token;
};

export const [useAuth, authFetch, login, logout] = createAuthProvider({
    accessTokenKey: 'access_token',
    onUpdateToken: refreshEndpoint,
});
