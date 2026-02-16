import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storedUser = await AuthService.getLocalUser();
            const token = await AsyncStorage.getItem('@auth_token');

            if (storedUser && token) {
                // Optionally validate token with backend here
                setUser(storedUser);
            }
            setLoading(false);
        }

        loadStorageData();
    }, []);

    async function signIn(email: string, password: string) {
        const response = await AuthService.login(email, password);
        setUser(response.user);
    }

    async function signOut() {
        await AuthService.logout();
        setUser(null);
    }

    async function register(name: string, email: string, password: string, role?: string) {
        await AuthService.register(name, email, password, role);
    }

    async function updateProfile(data: Partial<User>) {
        if (!user) return;
        const updatedUser = await AuthService.updateUser(user.id, data);
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
