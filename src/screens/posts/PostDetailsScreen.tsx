import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../context/AuthContext';
import { PostService } from '../../services/postService';
import { Post } from '../../types';

type ParamList = {
    PostDetails: { postId: string };
};

export default function PostDetailsScreen() {
    const route = useRoute<RouteProp<ParamList, 'PostDetails'>>();
    const { postId } = route.params;
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
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

    // Hide navigator header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        loadPost();
    }, [postId]);

    // Refresh when focusing back (in case of edit)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (post) loadPost();
        });
        return unsubscribe;
    }, [navigation, post]);

    async function loadPost() {
        try {
            const data = await PostService.getPost(postId);
            setPost(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        showAlert(
            'Excluir Post',
            'Tem certeza que deseja excluir este post?',
            'confirm',
            async () => {
                try {
                    await PostService.deletePost(postId);
                    showAlert('Sucesso', 'Post excluído.', 'success', () => navigation.goBack());
                } catch (error) {
                    showAlert('Erro', 'Não foi possível excluir o post.', 'error');
                }
            }
        );
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 20 }} />;
    }

    if (!post) {
        return (
            <View style={styles.container}>
                <Text>Post não encontrado.</Text>
            </View>
        );
    }

    const canEdit = user?.role === 'admin' || user?.role === 'teacher'; // Simplified check, ideally check author too if strict

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Post</Text>
                </View>
            </SafeAreaView>

            <ScrollView style={styles.container}>
                <Text style={styles.title}>{post.title}</Text>

                {post.category ? (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{post.category}</Text>
                    </View>
                ) : null}

                <Text style={styles.meta}>Por {post.author} em {new Date(post.createdAt).toLocaleDateString('pt-BR')}</Text>

                <View style={styles.tags}>
                    {post.tags?.map((tag, i) => (
                        <Text key={i} style={styles.tag}>#{tag}</Text>
                    ))}
                </View>

                <Text style={styles.content}>{post.content}</Text>

                <CustomAlert
                    visible={alert.visible}
                    title={alert.title}
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ ...alert, visible: false })}
                    onConfirm={alert.onConfirm}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#F97316',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    meta: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    categoryBadge: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryText: {
        color: '#7E22CE',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tags: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    tag: {
        color: '#2563EB',
        marginRight: 10,
        fontWeight: '500',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 32,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: '#3B82F6',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
