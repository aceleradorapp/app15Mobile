import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';


//OneSignal.setAppId('a58ae610-f6fb-471f-9eb8-587c55fee779');



export default function App() {   
    
    return <AppNavigator />;
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
