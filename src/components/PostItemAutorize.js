import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment'; // Usado para formatar a data
import { STORAGE_IMAGE } from '@env';

import { togglePostApprove, togglePostActive } from '../services/posts';

const PostItemAutorize = ({ post, userType, onHandlerRefresh }) => {
    const [expanded, setExpanded] = useState(false); // Controle de expansão do texto

    // Função para formatar a data
    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY [às] HH:mm');
    };

    // Função para alternar a expansão do texto
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Função chamada ao clicar no botão "Autorizar"
    const handleApprove = async () => {
        Alert.alert(
            'Atenção',
            'Realmente deseja aprovar a postagens?',
            [
                {
                    text: 'aprovar',
                    onPress: async () => {                        
                        const data = await togglePostApprove(post.id);
                        onHandlerRefresh();                        
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

    // Função chamada ao clicar no botão "Remover"
    const handleRemove = () => {
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

        console.log("Post removido", post.id);        
    };

    return (
        <View style={styles.card}>
            {/* Topo com a imagem do autor e nome */}
            <View style={styles.header}>
                <Image source={{ uri: STORAGE_IMAGE + post.author.profile.photo }} style={styles.authorImage} />
                <Text style={styles.authorName}>{post.author.name}</Text>
            </View>

            {/* Foto do post */}
            <Image source={{ uri: STORAGE_IMAGE + post.image }} style={styles.postImage} />

            {/* Texto do post */}
            <Text style={styles.postText}>
                {expanded ? post.text : `${post.text.substring(0, 100)}...`}
            </Text>
            <TouchableOpacity onPress={toggleExpand}>
                <Text style={styles.expandText}>{expanded ? 'Ver menos' : 'Ver mais'}</Text>
            </TouchableOpacity>

            {/* Data da postagem */}
            <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>

            {/* Botões: Autorizar e Remover */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.approveButton]} 
                    onPress={handleApprove}  // Evento de autorizar
                >
                    <Text style={styles.buttonText}>Autorizar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.removeButton]} 
                    onPress={handleRemove}   // Evento de remover
                >
                    <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    authorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    authorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 10,
    },
    postText: {
        fontSize: 14,
        color: '#333',
    },
    expandText: {
        color: '#003f88',
        fontSize: 14,
        marginVertical: 5,
    },
    postDate: {
        fontSize: 12,
        color: '#999',
        marginVertical: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#28a745',
    },
    removeButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default PostItemAutorize;
