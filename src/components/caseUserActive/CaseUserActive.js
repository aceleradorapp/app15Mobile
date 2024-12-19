import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { STORAGE_IMAGE } from '@env';

const CaseUserActive = ({ item, toggleActiveStatus, editUser }) => {
    return (
        <View style={styles.listItem}>
            {/* Informações do Usuário */}
            <View style={styles.userInfo}>
                <Image source={{ uri: STORAGE_IMAGE + item.profile.photo }} style={styles.userImage} />
                <Text style={styles.userName}>{item.name}</Text>
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionButtons}>
                {/* Botão de Editar */}
                {/* <TouchableOpacity onPress={() => editUser(item.id)}>
                    <Icon 
                        name="pencil" 
                        size={32} 
                        color="#007bff" 
                    />
                </TouchableOpacity> */}
                {/* Botão de Ativo/Inativo */}
                <TouchableOpacity onPress={() => toggleActiveStatus(item.id)}>
                    <Icon 
                        name={item.active ? "check-circle-outline" : "close-circle-outline"} 
                        size={32} 
                        color={item.active ? "green" : "red"} 
                    />
                </TouchableOpacity>                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 2,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        paddingVertical: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto', // Alinha à direita
        paddingRight: 20, // Espaçamento à direita
        gap: 20, // Espaçamento entre os ícones
    },
});

export default CaseUserActive;
