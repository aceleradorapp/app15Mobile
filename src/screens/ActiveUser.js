import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/header/Header';
import CaseUserActive from '../components/caseUserActive/CaseUserActive';

import LocalStorageService from '../services/storage';
import { STORAGE_IMAGE } from '@env';
import { getUsers } from '../services/user';

const ActiveUser = ({ navigation }) => {    
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('user');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadPostsAsync = async (pageNumber) => {
                try {
                    const dataPosts = await getUsers();
                    console.log(dataPosts);
                    setUsers(dataPosts);
                } catch (error) {
                    console.error('Erro ao carregar as postagens:', error);
                }
            };
            
            loadPostsAsync(page);        

            const loadUser = async () => {
                const user = await LocalStorageService.getItem('user');
                const name = user?.name?.split(' ')[0] || '';
                const photo = user?.photo || '';
    
                setUserName(name);
                setUserType(user?.type || 'user');
            };
            loadUser();
        }, [])
    );

    const toggleActiveStatus = (id) => {
        console.log(`Alterar status do usuário com ID: ${id}`);
        // Adicione a lógica para alternar o status ativo/inativo aqui
    };
    
    const editUser = (id) => {
        console.log(`Editar usuário com ID: ${id}`);
        // Adicione a lógica para abrir o editor ou a navegação
    };
    

    return (
        <View style={styles.container}> 
            <Header navigation={navigation} title='Usuários' />
                        

            <FlatList
                data={users} // Dados da lista
                keyExtractor={(item) => item.id.toString()} // Chave única para cada item
                renderItem={({ item }) => (
                    <CaseUserActive 
                        item={item} 
                        toggleActiveStatus={toggleActiveStatus} 
                        editUser={editUser} 
                    />
                )}
                contentContainerStyle={styles.listContainer} // Estilo da lista
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
        top: 30,
    },
    
    
});

export default ActiveUser;
