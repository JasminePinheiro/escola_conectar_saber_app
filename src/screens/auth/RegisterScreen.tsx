import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [alert, setAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: 'info' | 'success' | 'error' | 'confirm';
        onConfirm?: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title: string, message: string, type: 'info' | 'success' | 'error' | 'confirm' = 'info', onConfirm?: () => void) => {
        setAlert({ visible: true, title, message, type, onConfirm });
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            showAlert('Erro', 'Preencha todos os campos.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Erro', 'As senhas não coincidem.', 'error');
            return;
        }

        if (password.length < 6) {
            showAlert('Erro', 'A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        try {
            setLoading(true);
            await register(name, email, password, role);
            showAlert('Sucesso', 'Conta criada com sucesso!', 'success');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.';
            showAlert('Erro', msg, 'error');
            console.log('Register failed:', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Cadastre-se</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu nome completo"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tipo de conta</Text>
                            <View style={styles.roleContainer}>
                                {(['student', 'teacher'] as const).map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[
                                            styles.roleButton,
                                            role === r && styles.roleButtonActive
                                        ]}
                                        onPress={() => setRole(r)}
                                    >
                                        <Text style={[
                                            styles.roleButtonText,
                                            role === r && styles.roleButtonTextActive
                                        ]}>
                                            {r === 'student' ? 'Estudante' : 'Professor'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.registerButtonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginLinkText}>
                                Já tem uma conta? <Text style={styles.loginLinkHighlight}>Faça Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ ...alert, visible: false })}
                onConfirm={alert.onConfirm}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 12,
        paddingRight: 15,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    roleButtonActive: {
        borderColor: '#F97316',
        backgroundColor: '#FFF4ED',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    roleButtonTextActive: {
        color: '#F97316',
    },
    registerButton: {
        backgroundColor: '#F97316',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 14,
        color: '#666',
    },
    loginLinkHighlight: {
        color: '#F97316',
        fontWeight: 'bold',
    },
});
