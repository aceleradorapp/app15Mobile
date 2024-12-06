// src/components/PostItem.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, FlatList, RefreshControl, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addLike, removeLike, getPostById } from '../services/posts';
import LikesModal from './LikesModal'; // Importando o componente
import { togglePostActive } from '../services/posts';

const PostItem = ({ post, onRemovePost, userType  }) => {
    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes); 
    const [authorPost, setAuthorPost] = useState(post.authorPost);
    const [showFullText, setShowFullText] = useState(false); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [isRefreshing, setIsRefreshing] = useState(false); 
    const [lastTap, setLastTap] = useState(null);
    const [heartPosition, setHeartPosition] = useState(null); // Posição do coração
    const heartAnim = useState(new Animated.Value(0))[0]; // Valor da animação do coração
    const opacityAnim = useState(new Animated.Value(1))[0]; // Controle de opacidade    

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

    const handleDoubleTap = (e) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300; 

        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            handleLike();

            // Captura a posição do toque para exibir o coração
            const { locationX, locationY } = e.nativeEvent;
            setHeartPosition({ x: locationX-40, y: locationY });

            // Inicia a animação
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(heartAnim, {
                        toValue: 2.3,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.7,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(heartAnim, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 1,
                    useNativeDriver: true,
                }),
            ]).start();
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

    const handleRemovePost = async () => {

        Alert.alert(
            'Atenção',
            'Realmente deseja excluir a postagens?',
            [
                {
                    text: 'Remover',
                    onPress: async () => {                        
                        await togglePostActive(post.id);
                        onRemovePost(post.id);                        
                    }
                },
                {
                    text: 'Cancelar',
                    onPress: () => console.log("Postagem cancelada"),
                    style: 'cancel',
                },                        
            ]
        );

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
                    <TouchableOpacity activeOpacity={1} onPress={(e) => handleDoubleTap(e)}>
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
                        {/* Botão para remover o post */}                    
                        {(post.authorPost || userType === 'admin' || userType === 'owner') &&  (
                            <TouchableOpacity onPress={handleRemovePost} style={styles.removeButton}>
                                <Icon name="trash-can-outline" size={24} color="gray" />
                            </TouchableOpacity>
                        )}

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

                    {/* Animação do coração */}
                    {heartPosition && (
                        <Animated.View 
                            style={[styles.heartAnimation, {
                                opacity: opacityAnim,
                                transform: [
                                    { translateX: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [heartPosition.x, heartPosition.x] }) },
                                    { translateY: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [heartPosition.y, heartPosition.y - 50] }) },
                                    { scale: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) },
                                ]
                            }]}
                        >
                            <Icon name="heart" size={50} color="red" />
                        </Animated.View>
                    )}
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
        position: 'relative', // Adicionado para permitir a animação do coração
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
    heartAnimation: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    removeButton: {
        marginLeft: 'auto',
    },

});

export default PostItem;
