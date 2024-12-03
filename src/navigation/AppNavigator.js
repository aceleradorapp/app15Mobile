import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TokenValidator from '../services/TokenValidator';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // Para controlar quando a validação for concluída
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        // Função para validar o token
        const checkToken = async () => {
            try {
                await TokenValidator.validateToken('Login', 'Main', { navigate: (route) => setInitialRoute(route) });
            } catch (error) {
                console.error('Erro ao validar token na inicialização', error);
                setInitialRoute('Login'); // Se houver erro, vai para a tela de Login
            } finally {
                setIsChecked(true); // Marca que a validação foi concluída
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
