import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <View style={styles.content}>
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../../assets/images/welcome.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>
                        <Text style={styles.boldText}>Bem-Vindo ao </Text>
                        <Text style={styles.brandText}>Escola Conectar Saber</Text>
                        <Text style={styles.boldText}>. Educação de qualidade para todos!</Text>
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerLinkText}>
                            Não tem uma conta? <Text style={styles.registerLinkHighlight}>Cadastre-se</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    illustration: {
        width: '100%',
        height: 280,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 26,
        color: '#333',
    },
    boldText: {
        fontWeight: 'bold',
    },
    brandText: {
        color: '#F97316',
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'flex-start',
    },
    loginButton: {
        backgroundColor: '#F97316',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 14,
        color: '#666',
    },
    registerLinkHighlight: {
        color: '#F97316',
        fontWeight: 'bold',
    },
});
