import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Mail, Shield, User as UserIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../services/authService';

export default function UserFormScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { userId, role } = route.params || {};
    const isEditing = !!userId;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

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
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
            navigation.goBack();
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        if (!name || !email || (!isEditing && !password)) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await AuthService.updateUser(userId, { name, email });
                Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
            } else {
                await AuthService.register(name, email, password, role);
                Alert.alert('Sucesso', `${role === 'teacher' ? 'Professor' : 'Estudante'} cadastrado com sucesso!`);
            }
            navigation.goBack();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao salvar. Verifique se o e-mail já está em uso.';
            Alert.alert('Erro', message);
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
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha Inicial</Text>
                        <View style={styles.inputWrapper}>
                            <Shield size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#F97316',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    backButton: {
        padding: 8,
    },
    form: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 56,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#F97316',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: '#F97316',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    saveButtonDisabled: {
        backgroundColor: '#CCC',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
