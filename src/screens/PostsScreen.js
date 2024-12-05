import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../services/posts';

const PostagemScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');

    const handleImageLoad = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {      
      
      if (!title || !content || !image) {
          alert('Por favor, preencha todos os campos antes de postar.');
          return;
      }

      Alert.alert(
        'Atenção',
        'Realmente deseja fazer a postagens?',
        [
          {
            text: 'Sim',
            onPress: async () => {
              try {
                  const newPost = await createPost(title, image, content);
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
                        }
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

                {/* Imagem carregada */}
                <TouchableOpacity onPress={handleImageLoad} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>Toque para carregar uma imagem</Text>
                        </View>
                    )}
                </TouchableOpacity>

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
                    A aprovação é uma medida de segurança para manter a qualidade e a integridade das postagens.
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
        top:10
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        //backgroundColor: '#fff',
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
        //height:'80%',
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
  icon: {
      marginRight: 10,
  },
  infoText: {
      fontSize: 16,
      color: '#003f88',
      flex: 1,
      textAlign: 'left',
  },

});

export default PostagemScreen;
