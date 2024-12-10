import axios from 'axios';
import LocalStorageService from '../services/storage';
import { Platform } from 'react-native';
import { API_URL } from '@env';

// Método para salvar as informações do perfil (nickname e birthDate)
export const saveProfile = async (nickname, birthDate) => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;
        const response = await axios.post(
            `${API_URL}/profiles`,  // URL para salvar o perfil
            { nickname, birthDate },  // Dados do perfil
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Cabeçalho de autorização com o token
                    'Content-Type': 'application/json',  // Tipo de conteúdo
                },
            }
        );

        return response.data;  // Retorna os dados do perfil salvo
    } catch (error) {
        console.error('Erro ao salvar perfil:', error.response?.data || error.message);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para fazer o upload da foto de perfil
export const uploadProfilePhoto = async (imageUri) => {
    
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Ajuste para utilizar uma URI que funcione bem com o axios
        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1];

        const uriTemp = Platform.OS === 'ios' ? imageUri.replace('file://', ''): imageUri;        

        const formData = new FormData();
        formData.append('image', {
            uri: uriTemp,
            type: 'image/jpeg',  // Tipo MIME da imagem
            name: fileName,  // Nome do arquivo
        });

        const response = await axios.post(
            `${API_URL}/profiles/upload-photo`,  // URL para fazer o upload da foto
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Cabeçalho de autorização com o token
                    'Content-Type': 'multipart/form-data',  // Tipo de conteúdo para upload de arquivo
                },
            }
        );

        return response.data;  // Retorna a resposta da API
    } catch (error) {
        console.error('Erro ao fazer upload da foto de perfil:', error.response?.data || error.message);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para obter o perfil do usuário
export const getProfile = async () => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição GET para obter as informações do perfil
        const response = await axios.get(
            `${API_URL}/profiles`,  // URL para buscar o perfil
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Cabeçalho de autorização com o token
                },
            }
        );

        return response.data;  // Retorna os dados do perfil
    } catch (error) {
        console.error('Erro ao buscar perfil:', error.response?.data || error.message);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};



