import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { createPost } from '../services/posts';

const PostagemScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [selectedOption, setSelectedOption] = useState('library'); 
    const [videoUrl, setVideoUrl] = useState('');

    const handleImageLoad = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            //aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            //setImage(result.assets[0].uri);
            const uri = result.assets[0].uri;

        // Reduzir o tamanho da imagem mantendo o aspecto
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [
                // Redimensiona a imagem para 800px de largura (ajuste conforme necessário)
                { resize: { width: 800 } }
            ],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compressão e formato
        );

        setImage(manipulatedImage.uri);
        }
    };

    const handlePost = async () => {
        if (!title || !content || (selectedOption === 'library' && !image) || (selectedOption === 'url' && !videoUrl)) {
            alert('Por favor, preencha todos os campos antes de postar.');
            return;
        }

        Alert.alert(
            'Atenção',
            'Realmente deseja fazer a postagem?',
            [
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            const newPost = await createPost(title, selectedOption === 'library' ? image : videoUrl, content);
                            Alert.alert(
                                'Postagem enviada com sucesso!',
                                'Deseja fazer mais postagens?',
                                [
                                    {
                                        text: 'Sim',
                                        onPress: async () => {
                                            setTitle('');
                                            setContent('');
                                            setImage(null);
                                            setVideoUrl('');
                                        },
                                    },
                                    {
                                        text: 'Não',
                                        onPress: () => navigation.navigate('Main'),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.error('Erro ao criar postagem:', error);
                            alert('Erro ao enviar postagem. Tente novamente.');
                        }
                    },
                },
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Postagem cancelada'),
                    style: 'cancel',
                },
            ]
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.content}>
                {/* Barra superior */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={28} color="#003f88" style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Postagem</Text>
                </View>

                {/* Input para o título */}
                <TextInput
                    style={styles.titleInput}
                    placeholder="Título da postagem"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Radio Buttons */}
                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setSelectedOption('library')}
                    >
                        <Text style={styles.radioText}>Biblioteca</Text>
                        <Icon
                            name={selectedOption === 'library' ? 'radiobox-marked' : 'radiobox-blank'}
                            size={24}
                            color={selectedOption === 'library' ? '#003f88' : '#aaa'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setSelectedOption('url')}
                    >
                        <Text style={styles.radioText}>URL Vídeo</Text>
                        <Icon
                            name={selectedOption === 'url' ? 'radiobox-marked' : 'radiobox-blank'}
                            size={24}
                            color={selectedOption === 'url' ? '#003f88' : '#aaa'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Imagem carregada ou campo de URL */}
                {selectedOption === 'library' ? (
                    <TouchableOpacity onPress={handleImageLoad} style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Text style={styles.placeholderText}>Toque para carregar uma imagem</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        style={styles.urlInput}
                        placeholder="Cole o URL do vídeo"
                        value={videoUrl}
                        onChangeText={setVideoUrl}
                    />
                )}

                {/* Área de texto para o conteúdo da postagem */}
                <TextInput
                    style={styles.textArea}
                    placeholder="Escreva o conteúdo da postagem aqui..."
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <View style={styles.infoContainer}>
                    <Icon name="shield-lock" size={24} color="#003f88" style={styles.icon} />
                    <Text style={styles.infoText}>
                        As postagens feitas por usuários não-administradores serão enviadas para validação por um administrador.
                        Isso garante que todo conteúdo seja adequado e seguro para o nosso grupo.
                    </Text>
                </View>
            </ScrollView>

            {/* Botão de postar */}
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                <Text style={styles.postButtonText}>Postar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
        top: 10,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    titleInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
        fontSize: 16,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioText: {
        fontSize: 16,
        color: '#003f88',
    },
    imageContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        minHeight: 200,
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    placeholderText: {
        color: '#aaa',
        fontSize: 16,
    },
    urlInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
        fontSize: 16,
    },
    textArea: {
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingTop: 10,
        marginTop: 20,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#003f88',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f4f9ff',
        borderRadius: 5,
        borderColor: '#003f88',
        borderWidth: 1,
    },
    infoText: {
        fontSize: 14,
        color: '#003f88',
        marginLeft: 10,
    },
});

export default PostagemScreen;
