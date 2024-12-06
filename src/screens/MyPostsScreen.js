import React, { useEffect, useState, useCallback  } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPostsPagination } from '../services/posts';
import PostItem from '../components/PostItem';
import LocalStorageService from '../services/storage';
import Menu from '../components/Menu';
import { STORAGE_IMAGE } from '@env';

//const STORAGE_IMAGE = 'http://192.168.98.107:3535/'

const MyPostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('')
    const [hasMessage, setHasMessage] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userType, setUserType] = useState('user'); 

    useFocusEffect(
        useCallback(() => {
            const loadPostsAsync = async () => {
                try {
                    const dataPosts = await getPostsPagination(0, 10);
    
                    setPosts(dataPosts) 
                } catch (error) {
                    console.error('Erro ao carregar as postagens:', error);
                }
            };
            
            loadPostsAsync();        
    
            const loadUser = async () => {
                const user = await LocalStorageService.getItem('user');
                const name = user?.name?.split(' ')[0] || '';
                const photo = STORAGE_IMAGE+user?.photo || '';
    
                setUserPhoto(photo);
                setUserName(name);
                setUserType(user?.type || 'user');
            };
            loadUser();
    
            // Simular a verificação de mensagens (futuro: substituir por chamada de API)
            const checkMessages = () => {
                // Simular estado de mensagem não lida
                const hasUnreadMessages = Math.random() < 0.5; // Alterne entre true/false aleatoriamente
                setHasMessage(hasUnreadMessages);
            };
    
            checkMessages();
        
        }, [])
    );

    const handleMessagePress = () => {
        navigation.navigate('Messages'); // Substituir 'Messages' pela screen que será criada no futuro
    };

    const handleMenuPress = () => {
        setIsMenuVisible(true);
    };

    const handlePostRemove = (postId) => {
        console.log('handlePostRemove');
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };
    

    const handleMenuItemPress = (item) => {
        console.log(`${item} pressionado`);
        setIsMenuVisible(false); 
        if (item === 'logout') {
            const logout = async () => {
                await LocalStorageService.removeItem('user');  
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }], 
                });              
            };
            logout();
        }else if (item === 'dashboard') { 
            navigation.navigate('Dashboard'); 
        }else if (item === 'profile') { 
            navigation.navigate('Profile'); 
        }else if (item === 'posts') { 
            navigation.navigate('Posts'); 
        }else if (item === 'account') { 
            navigation.navigate('Home'); 
        }
            
    };

    return (
        <View style={styles.container}>
            {/* Perfil do usuário com ícone de menu */}
            <View style={styles.profileHeader}>
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#003f88" style={styles.iconAarrow} />
                </TouchableOpacity>
                <Text style={styles.title}>Minhas postagens</Text>
            </View>
                
            </View>

            {/* Lista de postagens */}
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <PostItem post={item} onRemovePost={handlePostRemove} />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.postsList}
            />
            <Menu
                isVisible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
                userType={userType}
                onMenuItemPress={handleMenuItemPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
        top: 30,
        paddingHorizontal: 5,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    iconAarrow: {
        marginRight: 10,        
    },
    title: {
        fontSize: 24,        
        color: '#003f88',
        flex: 1,
        textAlign: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    userName: {
        fontSize: 20,
        color: '#003f88',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 20,
    },
    menuIcon: {
        padding: 5,
    },
    postsList: {
        paddingBottom: 20,
    },
});

export default MyPostsScreen;
