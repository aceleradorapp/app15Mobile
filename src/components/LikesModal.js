// src/components/LikesModal.js
import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { STORAGE_IMAGE } from '@env';

//const STORAGE_IMAGE = 'http://192.168.98.107:3535/'

const LikesModal = ({ visible, onClose, likesUsers }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Usuários que curtiram</Text>
                    <FlatList
                        data={likesUsers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userContainer}>
                                <Image source={{ uri: STORAGE_IMAGE + item.user.profile.photo }} style={styles.userImage} />
                                <Text style={styles.userName}>{item.user.name}</Text>
                            </View>
                        )}
                        style={styles.userList}  // Aqui estamos permitindo a rolagem
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 10,
        alignItems: 'center',
        maxHeight: '80%',  // Limita a altura do modal
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
        width: '100%',
    },
    userImage: {
        width: 55,
        height: 55,
        borderRadius: 40,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#f2f2f2',
    },
    userName: {
        fontSize: 18,
        color: '#555',
        fontWeight: '600',
        flexShrink: 1,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#007bff',
        borderRadius: 25,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    userList: {
        maxHeight: '60%', // Limita a altura da lista de usuários
        width: '100%',   // Garante que o FlatList ocupe toda a largura
    },
});

export default LikesModal;
