import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocalStorageService from '../services/storage';
import Menu from '../components/Menu';
import { STORAGE_IMAGE } from '@env';

const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [hasMessage, setHasMessage] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userType, setUserType] = useState('user');

    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
                const user = await LocalStorageService.getItem('user');
                const name = user?.name?.split(' ')[0] || 'Usuário';
                const photo = STORAGE_IMAGE + (user?.photo || '');

                setUserPhoto(photo);
                setUserName(name);
                setUserType(user?.type || 'user');
            };

            const checkMessages = () => {
                const hasUnreadMessages = Math.random() < 0.5;
                setHasMessage(hasUnreadMessages);
            };

            loadUser();
            checkMessages();
        }, [])
    );

    const handleMessagePress = () => {
        navigation.navigate('Messages');
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
        } else if (item === 'dashboard') {
            navigation.navigate('Dashboard');
        } else if (item === 'profile') {
            navigation.navigate('Profile');
        } else if (item === 'posts') {
            navigation.navigate('Posts');
        }
    };

    return (
        <View style={styles.container}>
            {/* Barra superior */}
            <View style={styles.profileHeader}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: userPhoto || 'https://via.placeholder.com/60' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{userName}</Text>
                </View>

                <View style={styles.iconsContainer}>
                    {/* Ícone de mensagem */}
                    <TouchableOpacity onPress={handleMessagePress}>
                        <Icon
                            name="email"
                            size={28}
                            color={hasMessage ? '#ff0000' : '#003f88'}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    {/* Ícone de menu */}
                    <TouchableOpacity onPress={handleMenuPress}>
                        <Icon name="menu" size={28} color="#003f88" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Componente da lista de posts será adicionado aqui posteriormente */}

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
});

export default HomeScreen;
