import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPostsPagination } from '../services/posts';
import PostItem from '../components/PostItem';
import LocalStorageService from '../services/storage';
import TokenValidator from '../services/TokenValidator';
import Menu from '../components/Menu';
import { STORAGE_IMAGE } from '@env';

//const STORAGE_IMAGE = 'http://192.168.98.107:3535/'

const MainScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('')
    const [hasMessage, setHasMessage] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userType, setUserType] = useState('user');    

    useEffect(() => {        

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
    }, []);

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
        }
            
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
                    <Text style={styles.userName}>{(userName || 'Usuário').toString()}</Text>
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
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={(item) => item.id.toString()} // Certifique-se de usar `.toString()` para evitar erros
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
