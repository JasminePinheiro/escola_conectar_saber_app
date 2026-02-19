import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '../types';
import api from './apiClient';

export const AuthService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            if (!data.accessToken || !data.user) {
                console.error('Dados de autenticação incompletos:', data);
                throw new Error('Resposta do servidor incompleta');
            }

            const { accessToken, refreshToken, user } = data;
            await AsyncStorage.setItem('@auth_token', accessToken);
            if (refreshToken) await AsyncStorage.setItem('@refresh_token', refreshToken);
            await AsyncStorage.setItem('@user', JSON.stringify(user));

            return data;
        } catch (error) {
            console.log('Erro no AuthService.login:', error);
            throw error;
        }
    },

    register: async (name: string, email: string, password: string, role: string = 'student'): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            const data = response.data;

            if (data.accessToken && data.user) {
                const { accessToken, refreshToken, user } = data;
                await AsyncStorage.setItem('@auth_token', accessToken);
                if (refreshToken) await AsyncStorage.setItem('@refresh_token', refreshToken);
                await AsyncStorage.setItem('@user', JSON.stringify(user));
            }

            return data;
        } catch (error) {
            console.log('Erro no AuthService.register:', error);
            throw error;
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@refresh_token');
        await AsyncStorage.removeItem('@user');
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    getLocalUser: async (): Promise<User | null> => {
        try {
            const user = await AsyncStorage.getItem('@user');
            if (!user || user === 'undefined') {
                return null;
            }
            return JSON.parse(user);
        } catch (error) {
            console.error('Erro ao ler usuário local:', error);
            return null;
        }
    },

    getTeachers: async (): Promise<User[]> => {
        const response = await api.get('/auth/teachers');
        return response.data;
    },

    getStudents: async (): Promise<User[]> => {
        const response = await api.get('/auth/students');
        return response.data;
    },

    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/auth/users/${id}`);
        return response.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.patch('/auth/profile', data);
        const updatedUser = response.data;
        await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
        return updatedUser;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.patch('/auth/change-password', { currentPassword, newPassword });
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/auth/users/${id}`);
    }
};
