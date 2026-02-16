import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreatePostScreen from '../screens/posts/CreatePostScreen';
import EditPostScreen from '../screens/posts/EditPostScreen';
import PostDetailsScreen from '../screens/posts/PostDetailsScreen';
import PostListScreen from '../screens/posts/PostListScreen';

const Stack = createStackNavigator();

export default function HomeNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PostList"
                component={PostListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PostDetails"
                component={PostDetailsScreen}
                options={{ title: 'Detalhes do Post' }}
            />
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{ title: 'Novo Post' }}
            />
            <Stack.Screen
                name="EditPost"
                component={EditPostScreen}
                options={{ title: 'Editar Post' }}
            />
        </Stack.Navigator>
    );
}
