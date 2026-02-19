import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Edit2, Plus, Search, Trash2, User as UserIcon, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { AuthService } from '../../services/authService';
import { User } from '../../types';
import { styles } from './TeacherListScreen.styles';

export default function TeacherListScreen() {
    const [teachers, setTeachers] = useState<User[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

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

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const data = await AuthService.getTeachers();
            setTeachers(data);
            filterTeachers(search, data);
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
            showAlert('Erro', 'Não foi possível carregar a lista de professores.', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterTeachers = (text: string, currentTeachers: User[]) => {
        if (!text) {
            setFilteredTeachers(currentTeachers);
            return;
        }
        const filtered = currentTeachers.filter(teacher =>
            teacher.name.toLowerCase().includes(text.toLowerCase()) ||
            teacher.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredTeachers(filtered);
    };

    useEffect(() => {
        filterTeachers(search, teachers);
    }, [search, teachers]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTeachers();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        loadTeachers();
    };

    const handleDelete = (id: string, name: string) => {
        showAlert(
            'Excluir Professor',
            `Tem certeza que deseja excluir o professor ${name}?`,
            'confirm',
            async () => {
                try {
                    await AuthService.deleteUser(id);
                    loadTeachers();
                } catch (error) {
                    showAlert('Erro', 'Não foi possível excluir o professor.', 'error');
                }
            }
        );
    };

    const renderTeacher = ({ item }: { item: User }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.avatarImage} />
                ) : (
                    <UserIcon size={24} color="#F97316" />
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('UserForm', { userId: item.id, role: 'teacher' })}
                >
                    <Edit2 size={20} color="#F97316" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id, item.name)}
                >
                    <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gerenciar Professores</Text>
                </View>

                <View style={styles.searchBarContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar por nome ou e-mail..."
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#94A3B8"
                        />
                        {search !== '' && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <X size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>

            <FlatList
                data={filteredTeachers}
                keyExtractor={(item) => item.id}
                renderItem={renderTeacher}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {search ? 'Nenhum professor coincide com a busca.' : 'Nenhum professor cadastrado.'}
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={loading ? <ActivityIndicator color="#F97316" style={styles.loader} /> : null}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('UserForm', { role: 'teacher' })}
            >
                <Plus size={30} color="#FFF" />
            </TouchableOpacity>

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


