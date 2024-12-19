import { verifyToken } from './authService';
import LocalStorageService from './storage';

class TokenValidator {
    static async validateToken(invalidRoute, validRoute = null, navigation) {
        try {
            const user = await LocalStorageService.getItem('user');

            if (user && user.token) {
                const result = await verifyToken(user.token);

                if (validRoute) {
                    navigation.navigate(validRoute);
                }
            } else {
                console.warn('Token ausente ou inválido. Redirecionando...');
                if (invalidRoute) {
                    navigation.navigate(invalidRoute);
                }
            }
        } catch (error) {
            //console.error('Erro ao validar token:', error);

            if (invalidRoute) {
                navigation.navigate(invalidRoute);
            }
        }
    }
}

export default TokenValidator;
