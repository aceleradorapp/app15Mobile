// src/components/PostItem.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addLike, removeLike, getPostById } from '../services/posts';
import LikesModal from './LikesModal'; // Importando o componente

const PostItem = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes); 
    const [showFullText, setShowFullText] = useState(false); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [isRefreshing, setIsRefreshing] = useState(false); 
    const [lastTap, setLastTap] = useState(null);


    const handleRefresh = async () => {
        setIsRefreshing(true); 

        setTimeout(() => {
            console.log('Atualizando os dados...');
            setIsRefreshing(false); 
        }, 2000); 
    };

    const handleLike = async () => {
        try {
            if (liked) {
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

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300; 

        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            handleLike();
        } else {
            setLastTap(now);
        }
    };

    const handleToggleText = () => {
        setShowFullText(!showFullText); 
    };

    const handleOpenLikesModal = () => {
        setModalVisible(true); 
    };

    const handleCloseLikesModal = () => {
        setModalVisible(false); 
    };

    return (
        <FlatList
            data={[post]} 
            renderItem={({ item }) => (
                <View style={styles.postContainer}>
                    {/* Imagem do usuário */}
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.userImage }} style={styles.userImage} />
                        <Text style={styles.userName}>{item.userName}</Text>
                    </View>
                    
                    {/* **Imagem do post com suporte a toque duplo** */}
                    <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
                        
                            <Image source={{ uri: item.postImage }} style={styles.postImage} />
                        
                    </TouchableOpacity>

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
                    onRefresh={handleRefresh}
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
        height: 300,
        resizeMode: 'cover',//'contain',
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
