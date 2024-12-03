import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { registerUser } from '../services/authService';
import LocalStorageService from '../services/storage';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Novo estado para controlar o botão

    // Função para verificar se todos os campos estão preenchidos
    const isFormValid = () => {
        return name && email && phone && password && confirmPassword && accessCode;
    };

    // Atualiza o estado do botão sempre que um campo mudar
    useEffect(() => {
        setIsButtonDisabled(!isFormValid()); // Atualiza o botão com base na validade do formulário
    }, [name, email, phone, password, confirmPassword, accessCode]);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        try {
            const result = await registerUser(name, email, phone, password);

            // Armazena o email e senha no local storage após o registro
            LocalStorageService.setItem('register', { email, password });

            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao registrar usuário:', error.message || error);
            if (error.response) {
                console.log('Detalhes da resposta de erro:', error.response);
            } else {
                console.log('Erro sem resposta:', error);
            }
            throw error;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Preencha os campos abaixo para registrar</Text>

            <TextInput
                label="Nome Completo"
                mode="outlined"
                left={<TextInput.Icon icon={() => <Icon name="account-outline" size={20} />} />}
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                label="Email"
                mode="outlined"
                left={<TextInput.Icon icon={() => <Icon name="email-outline" size={20} />} />}
                value={email}
                onChangeText={text => setEmail(text.toLowerCase())}
                style={styles.input}
            />

            <TextInput
                label="Telefone"
                mode="outlined"
                left={<TextInput.Icon icon={() => <Icon name="phone-outline" size={20} />} />}
                type={'custom'}
                options={{
                    mask: '(99) 99999-9999',  // Máscara do telefone
                }}
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
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

            <TextInput
                label="Confirmar Senha"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon={() => <Icon name="lock-check-outline" size={20} />} />}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <TextInput
                label="Código de Acesso"
                mode="outlined"
                left={<TextInput.Icon icon={() => <Icon name="key-outline" size={20} />} />}
                value={accessCode}
                onChangeText={setAccessCode}
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                disabled={isButtonDisabled}  // O botão agora é controlado pelo estado isButtonDisabled
            >
                Registrar
            </Button>

            <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                labelStyle={styles.link}
            >
                Voltar para Login
            </Button>

            <Image
                source={require('../../assets/images/logogrande.png')}
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f4f9ff',
        top: 20,
    },

    logo: {
        width: '90%',
        height: '200',
        marginTop: 20,
        resizeMode: 'contain',
        marginBottom: 20
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003f88',
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
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#007bff',
        marginTop: 20,
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
});

export default RegisterScreen;
