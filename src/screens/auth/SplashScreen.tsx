import { useNavigation } from '@react-navigation/native';
import { BookOpen } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
    const navigation = useNavigation<any>();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F97316" />
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.logoContainer}>
                    <BookOpen size={80} color="#FFF" strokeWidth={1.5} />
                </View>
                <Text style={styles.title}>Escola Conecta Saber</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
});
