import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image, Alert  } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocalStorageService from '../services/storage';
import * as ImagePicker from "expo-image-picker";
import { STORAGE_IMAGE } from '@env'; // Certifique-se de que STORAGE_IMAGE esteja correto

import { saveProfile, uploadProfilePhoto, getProfile } from '../services/profile';

const ProfileScreen = ({ navigation }) => {
    // Definindo os estados
    const [userPhoto, setUserPhoto] = useState(''); // Estado para foto do usuário
    const [userPhotoInitial, setUserPhotoInitial] = useState(''); // Estado para verificar se a foto foi alterada
    const [userName, setUserName] = useState(''); // Estado para nome do usuário
    const [nickname, setNickname] = useState(''); // Estado para apelido
    const [birthDate, setBirthDate] = useState(''); // Estado para data de nascimento

    useEffect(() => {
        const checkPermissions = async () => {
            // Verificar permissão de galeria
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!galleryPermission.granted) {
                alert("Permissão para acessar a galeria é necessária.");
            }
    
            // Verificar permissão de câmera
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
                alert("Permissão para acessar a câmera é necessária.");
            }
        };
    
        checkPermissions();
    }, []);

    useEffect(() => {                
        const loadUser = async () => {
            const user = await LocalStorageService.getItem('user');
            const name = user?.name?.split(' ')[0] || '';
            const photo = STORAGE_IMAGE + user?.photo || ''; // Certifique-se de que a URL está correta
            const nickname = user?.nickname;
            const birthDate = user?.birthDate;

            // Ajuste para garantir que o photo esteja no formato correto
            setUserPhoto(photo ? photo : ''); // Evite passar um valor indefinido
            setUserPhotoInitial(photo ? photo : '');
            setUserName(name);
            setNickname(nickname);
            setBirthDate(birthDate);
        };

        loadUser();
    }, []);

    // Função para o botão salvar
    const handleSave = async () => {
      
      const result = await saveProfile(nickname, birthDate);    

      if(userPhotoInitial != userPhoto){
        const resultPhoto = await uploadProfilePhoto(userPhoto);
        setUserPhoto(resultPhoto.profile.photo);                
      }

      const getReesult = await getProfile();

      const user = await LocalStorageService.getItem('user');
      const updatedUser = {
        ...user, // Manter os dados existentes
        photo: getReesult.photo,
        nickname:getReesult.nickname,
        birthDate:getReesult.birthDate     
      };

      await LocalStorageService.setItem('user', updatedUser);

      navigation.navigate('Main');
      
    };

    const handleImageLoad = () => {
      Alert.alert(
          'Escolha uma opção',
          'De onde você deseja carregar a imagem?',
          [
              {
                  text: 'Cancelar',
                  style: 'cancel',
              },
              {
                  text: 'Biblioteca',
                  onPress: () => takeLibrary(),
              },
              {
                  text: 'Câmera',
                  onPress: () => takePhoto(),
              },
          ]
      );
  };

    const takeLibrary = () => {

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled) {
          setUserPhoto(result.assets[0].uri);
        }
      };
      pickImage();
    };

    const takePhoto = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setUserPhoto(result.assets[0].uri);
      }
    };

    return (
        <View style={styles.container}>
            {/* Barra superior com ícone de voltar */}
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#003f88" style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Seu Perfil</Text>
            </View>

            {/* Imagem do usuário */}
            <View style={styles.imageContainer}>
                <View style={styles.avatar}>
                    {/* Verifique se userPhoto tem um valor válido */}
                    {userPhoto ? (
                      <TouchableOpacity onPress={handleImageLoad}>
                        <Image 
                            source={{ uri: userPhoto }} // Append the timestamp to avoid caching issues
                            style={styles.avatarImage} 
                        />
                      </TouchableOpacity>
                    ) : (
                        <Icon name="account" size={60} color="#fff" />
                    )}
                    <Icon name="camera" size={30} color="#fff" style={styles.cameraIcon} />
                </View>
            </View>

            {/* Nome do usuário */}
            <Text style={styles.inputLabel}>Nome</Text>
            <Text style={styles.inputValue}>{userName || 'Nome do Usuário'}</Text>

            {/* Apelido */}
            <Text style={styles.inputLabel}>Apelido</Text>
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Digite seu apelido"
            />

            {/* Data de nascimento */}
            <Text style={styles.inputLabel}>Data de Nascimento</Text>
            <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="Digite sua data de nascimento"
                keyboardType="numeric"
            />

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
        top: 30,
        paddingHorizontal: 20,
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
    icon: {
        marginRight: 10,        
    },
    title: {
        fontSize: 24,        
        color: '#003f88',
        flex: 1,
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        right:30,
        bottom:20
    },
    avatarImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#ccc',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#003f88',
    },
    inputValue: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#003f88',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProfileScreen;
