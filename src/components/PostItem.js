// src/components/PostItem.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addLike, removeLike, getPostById } from '../services/posts';
import LikesModal from './LikesModal'; // Importando o componente

const PostItem = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes); // Estado local para número de curtidas
    const [showFullText, setShowFullText] = useState(false); // Estado para controlar o texto expandido
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const [isRefreshing, setIsRefreshing] = useState(false); // Estado para controlar o carregamento

    // Função para simular a atualização dos dados
    const handleRefresh = async () => {
        setIsRefreshing(true); // Ativa o estado de carregamento

        // Simulação de chamada de API para atualizar os dados
        setTimeout(() => {
            // Aqui você poderia fazer uma chamada real de atualização de dados
            console.log('Atualizando os dados...');
            setIsRefreshing(false); // Desativa o estado de carregamento
        }, 2000); // Simula um atraso de 2 segundos
    };

    const handleLike = async () => {
        try {
            if (liked) {
                // Remover o like se já foi dado
                const response = await removeLike(post.id);
                if (response.message === 'Like removido com sucesso.') {
                    setLiked(false);
                    setLikes(likes - 1);
                }
            } else {
                const response = await addLike(post.id);
                if (response.message === 'Like adicionado com sucesso.') {
                    setLiked(true);
                    setLikes(likes + 1);
                }
            }

            const responseLikes = await getPostById(post.id);
            post.likesUsers = responseLikes.likesUsers;

        } catch (error) {
            console.error('Erro ao tentar curtir:', error);
            Alert.alert('Erro', 'Não foi possível registrar a curtida. Tente novamente.');
        }
    };

    const handleToggleText = () => {
        setShowFullText(!showFullText); // Alterna entre texto completo e reduzido
    };

    const handleOpenLikesModal = () => {
        setModalVisible(true); // Abre o modal
    };

    const handleCloseLikesModal = () => {
        setModalVisible(false); // Fecha o modal
    };

    return (
        <FlatList
            data={[post]} // Passa o post como dado para o FlatList
            renderItem={({ item }) => (
                <View style={styles.postContainer}>
                    {/* Imagem do usuário */}
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.userImage }} style={styles.userImage} />
                        <Text style={styles.userName}>{item.userName}</Text>
                    </View>

                    {/* Imagem do post */}
                    <Image source={{ uri: item.postImage }} style={styles.postImage} />

                    {/* Botões de curtidas */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                            <Icon name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : '#333'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleOpenLikesModal}>
                            <Text style={styles.likeCount}>{likes} curtidas</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Texto do post */}
                    <View style={styles.postTextContainer}>
                        <Text style={styles.postText}>
                            {showFullText ? item.postText : `${item.postText.substring(0, 50)}...`}
                        </Text>
                        {item.postText.length > 50 && (
                            <TouchableOpacity onPress={handleToggleText}>
                                <Text style={styles.viewMore}>
                                    {showFullText ? 'ver menos' : 'ver mais'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Modal de curtidas */}
                    <LikesModal 
                        visible={modalVisible} 
                        onClose={handleCloseLikesModal} 
                        likesUsers={item.likesUsers} 
                    />
                </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh} // Passa a função de atualização para o RefreshControl
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        paddingBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    postTextContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    postText: {
        fontSize: 14,
        color: '#555',
    },
    viewMore: {
        color: '#007bff',
        fontSize: 14,
        marginTop: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    likeButton: {
        marginRight: 10,
    },
    likeCount: {
        fontSize: 14,
        color: '#333',
    },
});

export default PostItem;
