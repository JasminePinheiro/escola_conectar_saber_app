import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, FileText, GraduationCap, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';
import { PostService } from '../../services/postService';

const AdminCard = ({ title, count, icon: Icon, onPress, color, loading }: any) => (
    <TouchableOpacity style={styles.adminCard} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
            <Icon size={24} color={color} />
        </View>
        <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardCount}>
                {loading ? '...' : `${count} cadastrados`}
            </Text>
        </View>
        <ChevronRight size={20} color="#CCC" />
    </TouchableOpacity>
);

export default function AdminDashboardScreen() {
    const { user } = useAuth();
    const navigation = useNavigation<any>();
    const [counts, setCounts] = useState({ posts: 0, teachers: 0, students: 0 });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [postsData, teachersData, studentsData] = await Promise.all([
                PostService.getAllPostsForTeacher(1, 1),
                AuthService.getTeachers(),
                AuthService.getStudents()
            ]);
            setCounts({
                posts: postsData.total || 0,
                teachers: teachersData.length || 0,
                students: studentsData.length || 0
            });
        } catch (error: any) {
            console.error('Erro ao carregar dados do dashboard:', error);
            if (error.response?.status === 401) {
                Alert.alert('Sessão Expirada', 'Sua sessão expirou. Por favor, faça login novamente.');
            } else {
                Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });
        return unsubscribe;
    }, [navigation]);

    const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

    if (!isAdminOrTeacher) {
        return (
            <View style={styles.centered}>
                <Text>Acesso restrito.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContentLine}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Administração</Text>
                    {loading && (
                        <ActivityIndicator color="#FFF" size="small" style={{ marginLeft: 15 }} />
                    )}
                </View>
            </SafeAreaView>

            <View style={styles.content}>
                <AdminCard
                    title="Postagens"
                    count={counts.posts.toString()}
                    icon={FileText}
                    color="#F97316"
                    onPress={() => navigation.navigate('PostManagement')}
                    loading={loading}
                />

                <AdminCard
                    title="Professores"
                    count={counts.teachers.toString()}
                    icon={Users}
                    color="#3B82F6"
                    onPress={() => navigation.navigate('TeacherList')}
                    loading={loading}
                />

                <AdminCard
                    title="Estudantes"
                    count={counts.students.toString()}
                    icon={GraduationCap}
                    color="#10B981"
                    onPress={() => navigation.navigate('StudentList')}
                    loading={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#F97316',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContentLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'left',
        marginLeft: 15,
    },
    backButton: {
        padding: 8,
    },
    content: {
        padding: 20,
    },
    adminCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardCount: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
    mainActionButton: {
        backgroundColor: '#F97316',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    mainActionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
