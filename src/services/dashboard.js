export const fetchDashboardData = async () => {
    // Dados fake para simulação
    return {
        userStats: {
            active: 120,
            inactive: 30,
            total: 150,
        },
        paymentStats: {
            collected: 8500,
            target: 10000,
        },
        topDonors: [
            { name: "Maria Silva", amount: 2000, image: "https://via.placeholder.com/50" },
            { name: "João Santos", amount: 1500, image: "https://via.placeholder.com/50" },
            { name: "Ana Clara", amount: 1200, image: "https://via.placeholder.com/50" },
            { name: "Carlos Oliveira", amount: 800, image: "https://via.placeholder.com/50" },
            { name: "Fernanda Lima", amount: 600, image: "https://via.placeholder.com/50" },
        ],
    };
};
