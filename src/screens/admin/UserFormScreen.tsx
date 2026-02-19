import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff, Mail, Shield, User as UserIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { AuthService } from '../../services/authService';
import { styles } from './UserFormScreen.styles';

export default function UserFormScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { userId, role } = route.params || {};
    const isEditing = !!userId;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

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

    useEffect(() => {
        if (isEditing) {
            loadUser();
        }
    }, [userId]);

    const loadUser = async () => {
        try {
            setFetching(true);
            const user = await AuthService.getUserById(userId);
            setName(user.name);
            setEmail(user.email);
        } catch (error) {
            showAlert('Erro', 'Não foi possível carregar os dados do usuário.', 'error', () => {
                navigation.goBack();
            });
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        if (!name || !email || (!isEditing && !password)) {
            showAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!isEditing) {
            if (password.length < 6) {
                showAlert('Erro', 'A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showAlert('Erro', 'As senhas não coincidem.', 'error');
                return;
            }
        }

        try {
            setLoading(true);
            if (isEditing) {
                await AuthService.updateUser(userId, { name, email });
                showAlert('Sucesso', 'Dados atualizados com sucesso!', 'success', () => {
                    navigation.goBack();
                });
            } else {
                await AuthService.register(name, email, password, role, false);
                showAlert('Sucesso', `${role === 'teacher' ? 'Professor' : 'Estudante'} cadastrado com sucesso!`, 'success', () => {
                    navigation.goBack();
                });
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao salvar. Verifique se o e-mail já está em uso.';
            showAlert('Erro', message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {isEditing ? 'Editar' : 'Novo'} {role === 'teacher' ? 'Professor' : 'Estudante'}
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <View style={styles.inputWrapper}>
                        <UserIcon size={20} color="#999" />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o nome"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <View style={styles.inputWrapper}>
                        <Mail size={20} color="#999" />
                        <TextInput
                            style={styles.input}
                            placeholder="email@escola.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                {!isEditing && (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha Inicial</Text>
                            <View style={styles.inputWrapper}>
                                <Shield size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mínimo 6 caracteres"
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
                            <View style={styles.inputWrapper}>
                                <Shield size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ ...alert, visible: false })}
                onConfirm={alert.onConfirm}
            />
        </View>
    );
}


