import axios from 'axios';
import LocalStorageService from '../services/storage';
import { API_URL, STORAGE_IMAGE } from '@env';

export const getPostsPagination = async (start, end) => {
    try {
        const user = await LocalStorageService.getItem('user');
        const token = user.token;

        // Fazendo a requisição para obter as postagens paginadas
        const response = await axios.get(`${API_URL}/posts/paginated`, {
            params: {
                start: start,
                end: end,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        var data = [];


        for(var i=0; i< response.data.posts.length; i++){
            var object = {
                id: response.data.posts[i].id,
                userName: response.data.posts[i].author.name,
                userImage: STORAGE_IMAGE+response.data.posts[i].author.profile.photo,
                postImage: STORAGE_IMAGE+response.data.posts[i].image,
                postText: response.data.posts[i].text,
                likes: response.data.posts[i].likes.length,
                author: response.data.posts[i].author,
                likesUsers: response.data.posts[i].likes,
                liked: response.data.posts[i].liked,
            };

            data.push(object);
        }


        return data;  // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao buscar postagens paginadas:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};


export const addLike = async (postId) => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;
        const response = await axios.post(
            `${API_URL}/likes`, // Confirme o endpoint correto no backend
            { postId }, // Corpo da requisição
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                },
            }
        );

        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message === "Você já curtiu este post.") {
            //console.log('O usuário já curtiu este post.'); 
            return { message: "Você já curtiu este post." };
        }
        
        // Se for outro erro, mostramos na tela
        console.error('Erro ao adicionar like:', error.response?.data || error.message);
        throw error;
    }
};

// Método para remover o like
export const removeLike = async (postId) => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;
        const response = await axios.delete(
            `${API_URL}/likes`, // Confirme o endpoint correto no backend
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                },
                data: { postId }, // Corpo da requisição (id da postagem)
            }
        );

        if (response.data.message === "Like não encontrado.") {
            return { message: "Like não encontrado." }; // Caso o like não tenha sido encontrado
        }

        return response.data; // Caso o like tenha sido removido com sucesso
    } catch (error) {
        console.error('Erro ao remover like:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para buscar um post específico por ID
export const getPostById = async (postId) => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição GET para obter a postagem por ID
        const response = await axios.get(`${API_URL}/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const post = response.data;

        // Estrutura dos dados retornados
        const postDetails = {
            id: post.id,
            userName: post.author.name,
            userImage: STORAGE_IMAGE + post.author.profile.photo,
            postImage: STORAGE_IMAGE + post.image,
            postText: post.text,
            likes: post.likes.length,
            author: post.author,
            likesUsers: post.likes,
            liked: post.liked,
        };

        return postDetails;  // Retorna os dados do post formatados
    } catch (error) {
        console.error('Erro ao buscar a postagem:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};
