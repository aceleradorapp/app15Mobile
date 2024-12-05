import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../services/authService';
import LocalStorageService from '../services/storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setEmail('andryele@gmail.com');
        setPassword('12345678');
    }, []);

    useEffect(() => {
        const loadRegisteredData = async () => {
            const registeredData = await LocalStorageService.getItem('register');
            if (registeredData) {
                setEmail(registeredData.email);
                setPassword(registeredData.password);
            }
        };

        loadRegisteredData();
    }, []);

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);            

            if (data.token) {
                const { token, name, type, photo, nickname, birthDate } = data;

                LocalStorageService.setItem('user', { name, type, token, photo, nickname, birthDate });

                await LocalStorageService.removeItem('register');

                setEmail('');
                setPassword('');

                navigation.navigate('Main');
            } else {
                setError('Credenciais inválidas');
            }
        } catch (error) {
            setError('Erro ao fazer login, tente novamente');
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Bem-vindo de volta!</Text>
                    <Text style={styles.subtitle}>Faça login para continuar</Text>

                    <TextInput
                        label="Email"
                        mode="outlined"
                        left={<TextInput.Icon icon={() => <Icon name="email-outline" size={20} />} />}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />

                    <TextInput
                        label="Senha"
                        mode="outlined"
                        secureTextEntry
                        left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={20} />} />}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Entrar
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Register')}
                        labelStyle={styles.link}
                    >
                        Criar uma conta
                    </Button>
                </View>
                <Image
                    source={require('../../assets/images/logogrande.png')}
                    style={styles.logo}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between', // Para garantir que a imagem fique no final
        padding: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Deixe um pequeno espaço entre o formulário e a imagem
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003f88',
        marginTop: 30,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#0056b3',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
        marginBottom: 10,
    },
    buttonLabel: {
        fontSize: 16,
        color: '#fff',
    },
    link: {
        fontSize: 14,
        color: '#007bff',
        marginTop: 10,
    },
    logo: {
        width: '100%',        
        resizeMode: 'contain',
        marginTop: 20,  // Pequeno espaço entre o formulário e a imagem
        marginBottom: 30, // Deixe a imagem um pouco mais distante da borda da tela
    },
});

export default LoginScreen;
