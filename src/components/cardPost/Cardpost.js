import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, FlatList, RefreshControl, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addLike, removeLike, getPostById, togglePostActive } from '../../services/posts';
import LikesModal from '../LikesModal'; // Importando o componente
//import { togglePostActive } from '../posts';

import { STORAGE_IMAGE } from '@env';

const CardPost = ({ item, onRemovePost, userType  }) => {
    const [aspectRatio, setAspectRatio] = useState(1);
    const [showFullText, setShowFullText] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [liked, setLiked] = useState(item.liked);
    const [likes, setLikes] = useState(item.likes.length);

    // Função para calcular o aspect ratio da imagem
    const getImageDimensions = (uri) => {
        Image.getSize(uri, (width, height) => {
            setAspectRatio(width / height); // Calculando o aspect ratio
        });
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

    const handleLike = async () => {
        try {
            if (liked) {
                const response = await removeLike(item.id);
                if (response.message === 'Like removido com sucesso.') {
                    setLiked(false);
                    setLikes(likes - 1);
                }
            } else {
                const response = await addLike(item.id);
                if (response.message === 'Like adicionado com sucesso.') {
                    setLiked(true);
                    setLikes(likes + 1);
                }
            }

            const responseLikes = await getPostById(item.id);
            console.log(responseLikes)
            item.likesUsers = responseLikes.likesUsers;

        } catch (error) {
            console.error('Erro ao tentar curtir:', error);
            Alert.alert('Erro', 'Não foi possível registrar a curtida. Tente novamente.');
        }
    };

    const handleRemovePost = async () => {

        Alert.alert(
            'Atenção',
            'Realmente deseja excluir a postagens?',
            [
                {
                    text: 'Remover',
                    onPress: async () => {                        
                        await togglePostActive(item.id);
                        onRemovePost(item.id);                        
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
    

    useEffect(() => {
        const imageUri = STORAGE_IMAGE + item.image;
        getImageDimensions(imageUri);
    }, [item.image]);

    return (
        <View style={styles.postContainer}>
            {/* Imagem do usuário */}
            <View style={styles.userInfo}>
                <Image source={{ uri: STORAGE_IMAGE + item.author.profile.photo }} style={styles.userImage} />
                <Text style={styles.userName}>{item.author.name}</Text>
            </View>  
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: STORAGE_IMAGE + item.image }} 
                    style={[styles.postImage, { aspectRatio }]} // Usando o aspectRatio calculado
                />
            </View>

            {/* Botões de curtidas */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                    <Icon name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : '#333'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenLikesModal}>
                    <Text style={styles.likeCount}>{likes} curtidas</Text>
                </TouchableOpacity>
                {/* Botão para remover o post */}                    
                {(item.authorPost || userType === 'admin' || userType === 'owner') &&  (
                    <TouchableOpacity onPress={handleRemovePost} style={styles.removeButton}>
                        <Icon name="trash-can-outline" size={24} color="gray" />
                    </TouchableOpacity>
                )}

            </View>

            {/* Texto do post */}
            <View style={styles.postTextContainer}>
                <Text style={styles.postText}>
                    {showFullText ? item.text : `${item.text.substring(0, 50)}...`}
                </Text>
                {item.text.length > 50 && (
                    <TouchableOpacity onPress={handleToggleText}>
                        <Text style={styles.viewMore}>
                            {showFullText ? 'ver menos' : 'ver mais'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <LikesModal 
                visible={modalVisible} 
                onClose={handleCloseLikesModal} 
                likesUsers={item.likes} 
            />

        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        paddingBottom: 10,
        padding:10,
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
    imageContainer: {
        width: '100%',
        justifyContent: 'center', // Para garantir que a imagem seja centralizada
        alignItems: 'center',     // Para garantir que a imagem seja centralizada
    },
    postImage: {
        width: '100%',
        resizeMode: 'contain',
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

export default CardPost;
