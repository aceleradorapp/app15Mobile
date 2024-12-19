import axios from 'axios';
import LocalStorageService from '../services/storage';
import { API_URL, STORAGE_IMAGE } from '@env';
import { Platform } from 'react-native';

export const getUsers = async (userName=null) => {
    try {
        const user = await LocalStorageService.getItem('user');
        const token = user.token;

        userName = userName

        const response = await axios.get(`${API_URL}/getUserStatus`, {
            params: {
                name:userName
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;  // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};

export const toggleUserActive = async (id) => {
    try {
        const user = await LocalStorageService.getItem('user');
        const token = user.token;

        const response = await axios.patch(
            `${API_URL}/users/${id}/toggle-active`,
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                },
            }
        );

        return response.data;  // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao ativar usuário:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
}
