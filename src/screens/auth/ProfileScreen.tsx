import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
    ArrowLeft,
    Camera,
    Lock,
    LogOut,
    Mail,
    Trash2,
    User as UserIcon,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';

export default function ProfileScreen() {
    const { user, signOut, updateProfile, deleteAccount } = useAuth();
    const navigation = useNavigation<any>();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Password Reset Modal States
    const [isPassModalVisible, setIsPassModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passLoading, setPassLoading] = useState(false);

    // Custom Alert State
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
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                showAlert('Permissão necessária', 'Precisamos de acesso às suas fotos para mudar o avatar.', 'error');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
                setAvatarUrl(base64Image);

                setUploading(true);
                await updateProfile({ avatarUrl: base64Image });
                showAlert('Sucesso', 'Foto de perfil atualizada!', 'success');
            }
        } catch (error) {
            showAlert('Erro', 'Não foi possível selecionar ou salvar a imagem.', 'error');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = async () => {
        showAlert(
            'Remover Foto',
            'Tem certeza que deseja remover sua foto de perfil?',
            'confirm',
            async () => {
                try {
                    setUploading(true);
                    await updateProfile({ avatarUrl: '' });
                    setAvatarUrl('');
                    showAlert('Sucesso', 'Foto removida!', 'success');
                } catch (error) {
                    showAlert('Erro', 'Não foi possível remover a foto.', 'error');
                } finally {
                    setUploading(false);
                }
            }
        );
    };

    const handleSave = async () => {
        if (!user) return;
        if (!name || !email) {
            showAlert('Erro', 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        try {
            setLoading(true);
            await updateProfile({ name, email, avatarUrl });
            showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            showAlert('Erro', 'Não foi possível atualizar o perfil.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!currentPassword || !newPassword) {
            showAlert('Erro', 'Preencha as senhas atual e nova.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showAlert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        try {
            setPassLoading(true);
            await AuthService.changePassword(currentPassword, newPassword);
            showAlert('Sucesso', 'Senha alterada com sucesso!', 'success');
            setIsPassModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Não foi possível alterar a senha. Verifique se a senha atual está correta.';
            showAlert('Erro', msg, 'error');
        } finally {
            setPassLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        showAlert(
            'Excluir Conta',
            'Esta ação é IRREVERSÍVEL. Todos os seus dados serão apagados. Tem certeza?',
            'confirm',
            async () => {
                try {
                    setLoading(true);
                    await deleteAccount();
                } catch (error) {
                    showAlert('Erro', 'Não foi possível excluir a conta.', 'error');
                    setLoading(false);
                }
            }
        );
    };

    const handleLogout = () => {
        showAlert(
            'Sair',
            'Tem certeza que deseja sair da sua conta?',
            'confirm',
            signOut
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Avatar Section */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <UserIcon size={64} color="#A1A1AA" />
                            )}

                            <TouchableOpacity style={styles.cameraBadge} onPress={pickImage} disabled={uploading}>
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Camera size={16} color="#FFF" />
                                )}
                            </TouchableOpacity>

                            {avatarUrl ? (
                                <TouchableOpacity
                                    style={styles.removeBadge}
                                    onPress={removePhoto}
                                    disabled={uploading}
                                >
                                    <X size={14} color="#FFF" />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        <Text style={styles.roleText}>
                            {user?.role === 'teacher' ? 'Professor' :
                                user?.role === 'admin' ? 'Administrador' : 'Estudante'}
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome</Text>
                            <View style={styles.inputWrapper}>
                                <UserIcon size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Seu nome"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <View style={styles.inputWrapper}>
                                <Mail size={20} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="seuemail@escola.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Menu Options */}
                    <View style={styles.menu}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setIsPassModalVisible(true)}>
                            <View style={[styles.menuIcon, { backgroundColor: '#FFF4ED' }]}>
                                <Lock size={20} color="#F97316" />
                            </View>
                            <Text style={styles.menuText}>Redefinir senha</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                            <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
                                <Trash2 size={20} color="#EF4444" />
                            </View>
                            <Text style={styles.menuText}>Excluir conta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <View style={[styles.menuIcon, { backgroundColor: '#F3F4F6' }]}>
                                <LogOut size={20} color="#6B7280" />
                            </View>
                            <Text style={styles.menuText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Password Reset Modal */}
            <Modal
                visible={isPassModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsPassModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Redefinir Senha</Text>
                            <TouchableOpacity onPress={() => setIsPassModalVisible(false)}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Senha Atual</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                placeholder="Digite sua senha atual"
                            />

                            <Text style={styles.inputLabel}>Nova Senha</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                placeholder="Digite a nova senha"
                            />

                            <TouchableOpacity
                                style={[styles.modalButton, passLoading && styles.saveButtonDisabled]}
                                onPress={handleResetPassword}
                                disabled={passLoading}
                            >
                                {passLoading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.modalButtonText}>Alterar Senha</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 15,
    },
    content: {
        flex: 1,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    avatarImage: {
        width: 112,
        height: 112,
        borderRadius: 56,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#F97316',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    removeBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#EF4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    roleText: {
        marginTop: 12,
        fontSize: 14,
        color: '#F97316',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    form: {
        paddingHorizontal: 24,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#F97316',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    menu: {
        marginTop: 30,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 15,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {},
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    modalInput: {
        width: '100%',
        height: 50,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#F97316',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
