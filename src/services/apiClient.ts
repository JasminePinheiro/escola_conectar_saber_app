import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Use standard localhost for Android emulator (10.0.2.2) and iOS simulator (localhost)
// You can change this to your deployed backend URL.
// const API_URL = 'http://10.0.2.2:3000'; 
const API_URL = 'https://escola-conecta-saber-latest.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // The backend wraps everything in { success: true, data: T, timestamp: string }
        if (response.data && response.data.success === true && response.data.data !== undefined) {
            return {
                ...response,
                data: response.data.data,
            };
        }
        return response;
    },
    async (error) => {
        const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

        if (error.response && error.response.status === 401 && !isAuthRoute) {
            console.log('Sessão expirada. Limpando dados...');
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@refresh_token');
            await AsyncStorage.removeItem('@user');
        }
        return Promise.reject(error);
    }
);

export default api;
