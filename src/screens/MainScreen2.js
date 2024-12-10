import React, { useEffect, useState, useCallback  } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocalStorageService from '../services/storage';
import Menu from '../components/Menu';
import { STORAGE_IMAGE } from '@env';
import { getPostsPagination, getPosts_Pagination } from '../services/posts';
import PostItem from '../components/PostItem';
import CardPost from '../components/cardPost/Cardpost';

const MainScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('')
    const [hasMessage, setHasMessage] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userType, setUserType] = useState('user'); 
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadPostsAsync = async (pageNumber = 0) => {
                try {
                    const dataPosts = await getPosts_Pagination(pageNumber, 30);
                    // console.log('************************************');
                    // console.log(dataPosts.posts);
                    setPosts(dataPosts.posts) 
                } catch (error) {
                    console.error('Erro ao carregar as postagens:', error);
                }
            };
            
            loadPostsAsync(page)        
    
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
        
        }, [page])
    );

    const handleMessagePress = () => {
        navigation.navigate('Messages'); // Substituir 'Messages' pela screen que será criada no futuro
    };

    const handleMenuPress = () => {
        setIsMenuVisible(true);
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
            //navigation.navigate('Account'); 
        }else if (item === 'authorizePosts') { 
            navigation.navigate('AuthorizePosts'); 
        }
            
    };

    const handlePostRemove = (postId) => {
        // Atualiza o estado dos posts, removendo o post com o id fornecido
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const handleRefresh = async () => {
        setIsRefreshing(true); // Ativa o spinner de carregamento
        try {
            const dataPosts = await getPostsPagination(0, 30); // Recarrega os posts
            setPosts(dataPosts);
        } catch (error) {
            console.error('Erro ao atualizar as postagens:', error);
        } finally {
            setIsRefreshing(false); // Desativa o spinner de carregamento
        }
    };

    const handleLoadMore = async () => {
        if (isRefreshing) return;
        console.log('disparou', posts.length);
        // try {
        //     const nextPosts = await getPostsPagination(posts.length, 4);
        //     setPosts((prevPosts) => [...prevPosts, ...nextPosts]);
        // } catch (error) {
        //     console.error('Erro ao carregar mais postagens:', error);
        // }
    };

    return (
        <View style={styles.container}>
            {/* Perfil do usuário com ícone de menu */}
            <View style={styles.profileHeader}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: userPhoto || 'https://via.placeholder.com/60' }} 
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{(userName+'' || 'Usuário').toString()}</Text>
                </View>

                <View style={styles.iconsContainer}>
                    {/* Ícone de mensagem */}
                    <TouchableOpacity onPress={handleMessagePress}>
                        <Icon
                            name="email"
                            size={28}
                            color={hasMessage ? '#ff0000' : '#003f88'} // Destacar quando houver mensagem
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    {/* Ícone de menu */}
                    <TouchableOpacity onPress={handleMenuPress}>
                        <Icon name="menu" size={28} color="#003f88" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista de postagens */}
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <CardPost item={item} onRemovePost={handlePostRemove} userType={userType}/>
                )}
                keyExtractor={(item) => item.id.toString()} // Certifique-se de usar `.toString()` para evitar erros
                contentContainerStyle={styles.postsList}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}  // **Dispara o carregamento de mais postagens quando o usuário chegar no final**
                onEndReachedThreshold={0.5}  // **Ajuste para o quanto antes ou depois o carregamento será disparado**
                ListFooterComponent={isRefreshing ? <ActivityIndicator size="large" color="#003f88" /> : null}
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
        padding: 10,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 28,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
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

export default MainScreen;
