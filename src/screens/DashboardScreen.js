import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ícone de voltar
import { fetchDashboardData } from '../services/dashboard';

const DashboardScreen = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loaderText}>Carregando dados...</Text>
            </View>
        );
    }

    const userChartData = [
        {
            name: "Ativos",
            population: data.userStats.active,
            color: "#4CAF50",
            legendFontColor: "#4CAF50",
            legendFontSize: 14,
        },
        {
            name: "Inativos",
            population: data.userStats.inactive,
            color: "#F44336",
            legendFontColor: "#F44336",
            legendFontSize: 14,
        },
    ];

    const paymentChartData = [
        {
            name: "Coletado",
            population: data.paymentStats.collected,
            color: "#4CAF50",
            legendFontColor: "#4CAF50",
            legendFontSize: 14,
        },
        {
            name: "Meta Restante",
            population: data.paymentStats.target - data.paymentStats.collected,
            color: "#FF9800",
            legendFontColor: "#FF9800",
            legendFontSize: 14,
        },
    ];

    return (
        <View style={styles.container}>
            {/* Barra superior com ícone de voltar */}
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#003f88" style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Dashboard Geral</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Gráfico de Usuários */}
                <Card style={styles.card}>
                    <Card.Title title="Distribuição de Usuários" />
                    <Card.Content>
                        <PieChart
                            data={userChartData}
                            width={Dimensions.get("window").width - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            center={[10, 10]}
                            absolute
                        />
                    </Card.Content>
                </Card>

                {/* Gráfico de Pagamentos */}
                <Card style={styles.card}>
                    <Card.Title title="Progresso de Pagamentos" />
                    <Card.Content>
                        <PieChart
                            data={paymentChartData}
                            width={Dimensions.get("window").width - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            center={[10, 10]}
                            absolute
                        />
                        <Text style={styles.paymentText}>
                            Coletado: R$ {data.paymentStats.collected.toFixed(2)}
                        </Text>
                        <Text style={styles.paymentText}>
                            Meta: R$ {data.paymentStats.target.toFixed(2)}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Top Doadores */}
                <Card style={styles.card}>
                    <Card.Title title="Top 5 Doadores" />
                    <Card.Content>
                        {data.topDonors.map((donor, index) => (
                            <View key={index} style={styles.userRow}>
                                <Avatar.Image size={40} source={{ uri: donor.image }} />
                                <Text style={styles.userName}>
                                    {donor.name} - R$ {donor.amount.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </Card.Content>
                </Card>

                {/* Botões de Navegação */}
                <View style={styles.buttonContainer}>
                    <Text style={styles.sectionTitle}>Usuários</Text>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('UsuariosCadastrados')}>
                        Usuários Cadastrados
                    </Button>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('UsuariosAtivos')}>
                        Usuários Ativos
                    </Button>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('UsuariosInativos')}>
                        Usuários Inativos
                    </Button>

                    <Text style={styles.sectionTitle}>Financeiro</Text>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Pagamentos')}>
                        Pagamentos
                    </Button>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Doacoes')}>
                        Doações
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f9ff',
        top: 30,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003f88',
        flex: 1,
        textAlign: 'center',
    },
    scrollContainer: {
        padding: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    paymentText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        marginLeft: 10,
        fontSize: 16,
        color: '#003f88',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f9ff',
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#0056b3',
    },
    buttonContainer: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003f88',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
        marginBottom: 10,
    },
});

export default DashboardScreen;
