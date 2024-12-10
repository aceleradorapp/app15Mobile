import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostItemAutorize from '../components/PostItemAutorize';

import FilterPosts from '../components/filter/filterPost';

import LocalStorageService from '../services/storage';
import { getPostsByAuthorPaginated } from '../services/posts';

const AuthorizePostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('user');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [page, setPage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadPostsAsync = async (pageNumber) => {
                try {
                    const dataPosts = await getPostsByAuthorPaginated(pageNumber, 10, authorName);
                    setPosts(dataPosts.posts);
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
        }, [authorName])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);        
        try {
            const dataPosts = await getPostsByAuthorPaginated(0, 10, authorName);
            setPosts(dataPosts.posts);
        } catch (error) {
            console.error('Erro ao atualizar as postagens:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLoadMore = async () => {
        if (isRefreshing) return;
        const pageNumber = parseInt(posts.length);
        console.log('disparou', pageNumber);        

        try {
            const nextPosts = await getPostsByAuthorPaginated(pageNumber, pageNumber+10, authorName);
            setPosts((prevPosts) => [...prevPosts, ...nextPosts.posts]);
        } catch (error) {
            console.error('Erro ao carregar mais postagens:', error);
        }
    };

    return (
        <View style={styles.container}>            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#003f88" style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Autorizar Posts</Text>
            </View>

            <View>

                <FilterPosts
                    onFilter={setAuthorName}
                />

            </View>

            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <PostItemAutorize 
                        post={item} 
                        userType={userType}
                        onHandlerRefresh = {handleRefresh} 
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.postsList}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}  // **Dispara o carregamento de mais postagens quando o usuário chegar no final**
                onEndReachedThreshold={0.5}
                ListFooterComponent={isRefreshing ? <ActivityIndicator size="large" color="#003f88" /> : null}
                initialNumToRender={5} // Renderiza inicialmente 5 itens
                maxToRenderPerBatch={5} // Atualiza em lotes de 5 itens
                windowSize={10} // Mantém 10 itens visíveis na memória
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        color: '#003f88',
        flex: 1,
        textAlign: 'center',
    },
});

export default AuthorizePostsScreen;
