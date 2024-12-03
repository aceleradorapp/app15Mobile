import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Menu = ({ isVisible, onClose, userType, onMenuItemPress }) => {
  // Itens fixos
    const menuItems = [
        { label: 'Perfil', value: 'profile', icon: 'account' },
        { label: 'Conta', value: 'account', icon: 'account-settings' },
        { label: 'Album', value: 'album', icon: 'album' },
        { label: 'Pagamento', value: 'payment', icon: 'credit-card' },        
    ];

    // Itens adicionais para admin ou owner
    if (userType === 'admin' || userType === 'owner') {
        menuItems.push({ label: 'Dashboard', value: 'dashboard', icon: 'view-dashboard' });
    }

    menuItems.push({ label: 'Sair do aplicativo', value: 'logout', icon: 'logout' });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* Parte superior com a imagem */}
            <View style={styles.imageContainer}>
            <Image
                source={require('../../assets/images/logogrande.png')} // Caminho da imagem
                style={styles.logoImage}
                resizeMode="contain"
            />
            </View>
        <View style={styles.overlay}>
            

            {/* Menu */}
            <View style={styles.menuContainer}>
            <View style={styles.header}>
                <Text style={styles.menuTitle}>Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={28} color="#003f88" />
                </TouchableOpacity>
            </View>

            {menuItems.map((item) => (
                <TouchableOpacity
                key={item.value}
                style={styles.menuItem}
                onPress={() => onMenuItemPress(item.value)}
                >
                <Icon name={item.icon} size={24} color="#003f88" style={styles.icon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',  // Alinha o conteúdo ao rodapé da tela
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    imageContainer: {
        width: '100%',
        height: 150,  // Ajuste conforme necessário
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff',  // Fundo branco ou transparente, conforme necessário
    },
    logoImage: {
        width: '80%',  // Ajuste a largura conforme necessário
        height: '100%',
        maxWidth: 300,  // Limite máximo para a largura
    },
    menuContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    menuTitle: {
        fontSize: 22,
        color: '#003f88',
        fontWeight: 'bold',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    menuItemText: {
        fontSize: 18,
        color: '#003f88',
    },
});

export default Menu;
