// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorageService {
    // Grava dados no AsyncStorage
    static async setItem(key, value) {
        try {
            const valueToStore = JSON.stringify(value);
            await AsyncStorage.setItem(key, valueToStore); // Usando AsyncStorage
        } catch (error) {
            console.error("Erro ao gravar no AsyncStorage", error);
        }
    }

    // Recupera dados do AsyncStorage
    static async getItem(key) {
        try {
            const value = await AsyncStorage.getItem(key); // Usando AsyncStorage
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Erro ao ler do AsyncStorage", error);
            return null;
        }
    }

    // Limpa um item específico do AsyncStorage
    static async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key); // Usando AsyncStorage
        } catch (error) {
            console.error("Erro ao remover do AsyncStorage", error);
        }
    }

    // Limpa todos os itens do AsyncStorage
    static async clear() {
        try {
            await AsyncStorage.clear(); // Usando AsyncStorage
        } catch (error) {
            console.error("Erro ao limpar AsyncStorage", error);
        }
    }
}

export default LocalStorageService;
