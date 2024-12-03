// src/services/authService.js
import axios from 'axios';
import { API_URL } from '@env';

// Função para registrar um novo usuário
export const registerUser = async (name, email, phone, password) => {
    console.log(name, email, phone, password);
    
    try {
        const response = await axios.post(`${API_URL}/users`, {
            name,
            email,
            phone,
            password,
        });  // Certifique-se de que esta vírgula e chaves estão corretas

        return response.data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error; 
    }
};

// Função para fazer o login de um usuário
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });

        if (response.data.token) {
            return response.data;
        } else {
            throw new Error('Login falhou, não foi possível obter o token');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

// Função para verificar se o token é válido
export const verifyToken = async (token) => {
    try {        
        const response = await axios.post(`${API_URL}/auth/verify-token`, { token });
        return {
            message: response.data.message,
            remainingTime: response.data.remainingTime,
        };
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        throw error; 
    }
};
