import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TokenValidator from '../services/TokenValidator';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostsScreen from '../screens/PostsScreen';
import AuthorizePostsScreen from '../screens/AuthorizePostsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        
        const checkToken = async () => {
            try {
                await TokenValidator.validateToken('Login', 'Main', { navigate: (route) => setInitialRoute(route) });
            } catch (error) {
                console.error('Erro ao validar token na inicialização', error);
                setInitialRoute('Login');
            } finally {
                setIsChecked(true); 
            }
        };

        checkToken();
    }, []);

    // Exibe uma tela de carregamento enquanto a validação do token ocorre
    if (!isChecked) {
        return null; // Ou um componente de carregamento, por exemplo
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Main" 
                    component={MainScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Dashboard" 
                    component={DashboardScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Posts" 
                    component={PostsScreen} 
                    options={{ headerShown: false }} 
                /> 
                <Stack.Screen 
                    name="AuthorizePosts" 
                    component={AuthorizePostsScreen} 
                    options={{ headerShown: false }} 
                />                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
