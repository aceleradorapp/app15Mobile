import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/header/Header';
import FilterPosts from '../components/filter/filterPost';
import CaseUserActive from '../components/caseUserActive/CaseUserActive';

import LocalStorageService from '../services/storage';
import { STORAGE_IMAGE } from '@env';
import { getUsers, toggleUserActive } from '../services/user';

const ActiveUser = ({ navigation }) => {    
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('user');
    const [userFilter, setUserFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadPostsAsync = async (pageNumber) => {
                try {
                    const dataPosts = await getUsers(userFilter);
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
        }, [userFilter])
    );

    const toggleActiveStatus = async (id) => {
        console.log(`Alterar status do usuário com ID: ${id}`);
        try {
            const updatedUser = await toggleUserActive(id);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, active: updatedUser.user.active } : user
                )
            );
            
        } catch (error) {
            console.error('Erro ao carregar as postagens:', error);
        }
    };
    
    const editUser = (id) => {
        console.log(`Editar usuário com ID: ${id}`);
        // Adicione a lógica para abrir o editor ou a navegação
    };
    

    return (
        <View style={styles.container}> 
            <Header navigation={navigation} title='Usuários' />
            <FilterPosts onFilter={setUserFilter}/>
                        
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CaseUserActive 
                        item={item} 
                        toggleActiveStatus={toggleActiveStatus} 
                        editUser={editUser} 
                    />
                )}
                contentContainerStyle={styles.listContainer}
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
