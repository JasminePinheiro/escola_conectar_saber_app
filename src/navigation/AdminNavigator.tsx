import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import PostManagementScreen from '../screens/admin/PostManagementScreen';
import StudentListScreen from '../screens/admin/StudentListScreen';
import TeacherListScreen from '../screens/admin/TeacherListScreen';
import UserFormScreen from '../screens/admin/UserFormScreen';
import CreatePostScreen from '../screens/posts/CreatePostScreen';
import EditPostScreen from '../screens/posts/EditPostScreen';

const Stack = createStackNavigator();

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
            />
            <Stack.Screen
                name="PostManagement"
                component={PostManagementScreen}
            />
            <Stack.Screen
                name="TeacherList"
                component={TeacherListScreen}
            />
            <Stack.Screen
                name="StudentList"
                component={StudentListScreen}
            />
            <Stack.Screen
                name="UserForm"
                component={UserFormScreen}
            />
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
            />
            <Stack.Screen
                name="EditPost"
                component={EditPostScreen}
            />
        </Stack.Navigator>
    );
}
