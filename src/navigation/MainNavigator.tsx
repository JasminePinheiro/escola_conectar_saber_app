import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, User } from 'lucide-react-native';
import React from 'react';
import { useAuth } from '../context/AuthContext';

import ProfileScreen from '../screens/auth/ProfileScreen';
import AdminNavigator from './AdminNavigator';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    const { user } = useAuth();
    const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarActiveTintColor: '#F97316',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeNavigator}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    headerShown: false,
                    title: 'Escola Conecta Saber'
                }}
            />

            {isAdminOrTeacher && (
                <Tab.Screen
                    name="AdminStack"
                    component={AdminNavigator}
                    options={{
                        tabBarLabel: 'Admin',
                        tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                        headerShown: false,
                        title: 'Administração'
                    }}
                />
            )}

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    title: 'Meu Perfil'
                }}
            />
        </Tab.Navigator>
    );
}
