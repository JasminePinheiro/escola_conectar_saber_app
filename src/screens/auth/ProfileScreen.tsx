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
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
    const { user, signOut, updateProfile, deleteAccount } = useAuth();
    const navigation = useNavigation<any>();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [isPassModalVisible, setIsPassModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passLoading, setPassLoading] = useState(false);

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
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Não foi possível selecionar ou salvar a imagem.';
            showAlert('Erro', msg, 'error');
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
                } catch (error: any) {
                    const msg = error.response?.data?.message || 'Não foi possível remover a foto.';
                    showAlert('Erro', msg, 'error');
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
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <UserIcon size={64} color="#A1A1AA" />
                            )}

                            <TouchableOpacity
                                style={styles.cameraBadge}
                                onPress={pickImage}
                                disabled={uploading}
                                activeOpacity={0.8}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Camera size={18} color="#FFF" />
                                )}
                            </TouchableOpacity>

                            {!!avatarUrl && (
                                <TouchableOpacity
                                    style={styles.removeBadge}
                                    onPress={removePhoto}
                                    disabled={uploading}
                                    activeOpacity={0.8}
                                >
                                    <Trash2 size={12} color="#FFF" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.roleText}>
                            {user?.role === 'teacher' ? 'Professor' :
                                user?.role === 'admin' ? 'Administrador' : 'Estudante'}
                        </Text>
                    </View>

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
