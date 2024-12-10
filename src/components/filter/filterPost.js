import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Biblioteca de ícones

const FilterPosts = ({ onFilter }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async (text) => {
        setSearchTerm(text);

        if (text === "") return;

        onFilter(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Icon name="search" size={20} color="#aaa" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do usuário"
                    value={searchTerm}
                    onChangeText={handleSearch}
                    placeholderTextColor="#aaa"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
});

export default FilterPosts;
