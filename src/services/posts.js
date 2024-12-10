import axios from 'axios';
import LocalStorageService from '../services/storage';
import { API_URL, STORAGE_IMAGE } from '@env';
import { Platform } from 'react-native';

export const createPost = async (title, imageUri, text) => {
    try {
        // Recupera o token do usuário
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Ajuste para utilizar uma URI que funcione bem com o axios
        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const adjustedUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

        // Configura os dados para envio (multipart/form-data)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', {
            uri: adjustedUri,
            type: 'image/jpeg', // Substitua pelo tipo correto se necessário
            name: fileName, // Usa o nome extraído da URI
        });
        formData.append('text', text);

        // Fazendo a requisição POST para criar a postagem
        const response = await axios.post(`${API_URL}/posts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // Retorna os dados da resposta (postagem criada)
    } catch (error) {
        console.error('Erro ao criar postagem:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};

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
                authorPost:response.data.posts[i].authorPost,
            };

            data.push(object);
        }


        return data;  // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao buscar postagens paginadas:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};

export const getPosts_Pagination = async (start, end) => {
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

        return response.data;  // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao buscar postagens paginadas:', error);
        throw error;  // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para buscar as postagens do usuário com paginação
export const getUserPostsPaginated = async (start) => {
    try {
        // Recupera o token do usuário
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição GET para obter as postagens do usuário paginadas
        const response = await axios.get(`${API_URL}/posts/user/paginated`, {
            params: {
                start: start,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        var data = [];

        // Formata os dados conforme o padrão já usado
        for (var i = 0; i < response.data.posts.length; i++) {
            var object = {
                id: response.data.posts[i].id,
                userName: response.data.posts[i].author.name,
                userImage: STORAGE_IMAGE + response.data.posts[i].author.profile.photo,
                postImage: STORAGE_IMAGE + response.data.posts[i].image,
                postText: response.data.posts[i].text,
                likes: response.data.posts[i].likes.length,
                author: response.data.posts[i].author,
                likesUsers: response.data.posts[i].likes,
                liked: response.data.posts[i].liked,
                authorPost:response.data.posts[i].authorPost,
            };

            data.push(object);
        }

        return data; // Retorna os dados formatados
    } catch (error) {
        console.error('Erro ao buscar postagens do usuário paginadas:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
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

// Método para alternar o estado "ativo" de uma postagem
export const togglePostActive = async (postId) => {
    try {
        // Recupera o token do usuário
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição PATCH para alternar o estado ativo da postagem
        const response = await axios.patch(
            `${API_URL}/posts/${postId}/toggle-active`, // Endpoint para alternar o estado ativo
            {}, // Corpo da requisição (nenhum dado adicional, já que é apenas uma atualização de estado)
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                },
            }
        );

        return response.data; // Retorna os dados da resposta, que podem ser usados para atualizar a UI ou realizar outra ação
    } catch (error) {
        console.error('Erro ao alternar o estado ativo da postagem:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para alternar o estado "ativo" de uma postagem
export const togglePostApprove = async (postId) => {
    try {
        // Recupera o token do usuário
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição PATCH para alternar o estado ativo da postagem
        const response = await axios.patch(
            `${API_URL}/posts/${postId}/toggle-approve`, // Endpoint para alternar o estado ativo
            {}, // Corpo da requisição (nenhum dado adicional, já que é apenas uma atualização de estado)
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização
                },
            }
        );

        return response.data; // Retorna os dados da resposta, que podem ser usados para atualizar a UI ou realizar outra ação
    } catch (error) {
        console.error('Erro ao alternar o estado ativo da postagem:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};

// Método para obter posts não ativos de forma paginada
export const getPaginatedNotActivePosts = async (start, end) => {
    try {
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição GET para obter os posts paginados não ativos
        const response = await axios.get(
            `${API_URL}/posts/paginatedNotActive?start=${start}&end=${end}`, // URL para buscar posts
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Cabeçalho de autorização com o token
                },
            }
        );

        return response.data; // Retorna os dados da resposta da API
    } catch (error) {
        console.error('Erro ao buscar posts paginados não ativos:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};

export const getPostsByAuthorPaginated = async (start, end, authorName) => {
    try {        

        // Recupera o token do usuário
        const user = await LocalStorageService.getItem('user');
        if (!user || !user.token) {
            throw new Error('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        const token = user.token;

        // Fazendo a requisição GET para obter posts paginados por autor
        const response = await axios.get(
            `${API_URL}/posts/paginatedByAuthor`,
            {
                params: {
                    start: start,
                    end: end,
                    authorName: authorName,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );        

        // Mapeia os dados retornados para um formato uniforme
        const data = response.data.posts.map(post => ({
            id: post.id,
            userName: post.author.name,
            userImage: STORAGE_IMAGE + post.author.profile.photo,
            postImage: STORAGE_IMAGE + post.image,
            postText: post.text,            
        }));

        return response.data; // Retorna os posts formatados
    } catch (error) {
        console.error('Erro ao buscar posts paginados por autor:', error.response?.data || error.message);
        throw error; // Lança o erro para ser tratado por quem chamar a função
    }
};
