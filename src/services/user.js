import axios from 'axios';
import LocalStorageService from '../services/storage';
import { API_URL, STORAGE_IMAGE } from '@env';
import { Platform } from 'react-native';

export const getUsers = async (start=0, end=0) => {
    try {
        const user = await LocalStorageService.getItem('user');
        const token = user.token;

        const response = await axios.get(`${API_URL}/getUserStatus`, {
            params: {
                start: start,
                end: end,
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
