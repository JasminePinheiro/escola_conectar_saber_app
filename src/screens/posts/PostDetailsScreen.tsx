import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentText, setEditingCommentText] = useState('');

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

    async function handleAddComment() {
        if (!commentText.trim()) return;

        setSubmittingComment(true);
        try {
            const updatedPost = await PostService.addComment(postId, commentText);
            setPost(updatedPost);
            setCommentText('');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Não foi possível adicionar o comentário.';
            showAlert('Erro', msg, 'error');
        } finally {
            setSubmittingComment(false);
        }
    }

    async function handleUpdateComment() {
        if (!editingCommentText.trim() || !editingCommentId) return;

        setSubmittingComment(true);
        try {
            const updatedPost = await PostService.updateComment(postId, editingCommentId, editingCommentText);
            setPost(updatedPost);
            setEditingCommentId(null);
            setEditingCommentText('');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Não foi possível atualizar o comentário.';
            showAlert('Erro', msg, 'error');
        } finally {
            setSubmittingComment(false);
        }
    }

    async function handleDeleteComment(commentId: string) {
        showAlert(
            'Excluir Comentário',
            'Tem certeza que deseja remover este comentário?',
            'confirm',
            async () => {
                try {
                    const updatedPost = await PostService.deleteComment(postId, commentId);
                    setPost(updatedPost);
                } catch (error: any) {
                    console.error(error);
                    const msg = error.response?.data?.message || 'Não foi possível remover o comentário.';
                    showAlert('Erro', msg, 'error');
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

                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comentários ({post.comments?.length || 0})</Text>

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Escreva um comentário..."
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.commentButton, (!commentText.trim() || submittingComment) && styles.commentButtonDisabled]}
                            onPress={handleAddComment}
                            disabled={!commentText.trim() || submittingComment}
                        >
                            {submittingComment ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.commentButtonText}>Publicar</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, index) => (
                            <View key={index} style={styles.commentCard}>
                                <View style={styles.commentHeader}>
                                    <View>
                                        <Text style={styles.commentAuthor}>{comment.author}</Text>
                                        <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</Text>
                                    </View>
                                    {(user?.id === comment.authorId || user?.role === 'admin' || user?.role === 'teacher') && (
                                        <View style={styles.commentActions}>
                                            {user?.id === comment.authorId && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditingCommentText(comment.content);
                                                    }}
                                                    style={styles.commentActionBtn}
                                                >
                                                    <Pencil size={16} color="#3B82F6" />
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity
                                                onPress={() => handleDeleteComment(comment.id)}
                                                style={styles.commentActionBtn}
                                            >
                                                <Trash2 size={16} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {editingCommentId === comment.id ? (
                                    <View style={styles.editCommentContainer}>
                                        <TextInput
                                            style={styles.editCommentInput}
                                            value={editingCommentText}
                                            onChangeText={setEditingCommentText}
                                            multiline
                                            autoFocus
                                        />
                                        <View style={styles.editCommentActions}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setEditingCommentId(null);
                                                    setEditingCommentText('');
                                                }}
                                                style={[styles.editActionBtn, styles.cancelEditBtn]}
                                            >
                                                <Text style={styles.cancelEditBtnText}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={handleUpdateComment}
                                                disabled={!editingCommentText.trim() || submittingComment}
                                                style={[styles.editActionBtn, styles.saveEditBtn]}
                                            >
                                                {submittingComment ? (
                                                    <ActivityIndicator size="small" color="#FFF" />
                                                ) : (
                                                    <Text style={styles.saveEditBtnText}>Salvar</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.commentContent}>{comment.content}</Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noComments}>Nenhum comentário ainda. Seja o primeiro!</Text>
                    )}
                </View>

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
    commentsSection: {
        marginTop: 20,
        marginBottom: 60,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 20,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    commentInputContainer: {
        marginBottom: 25,
    },
    commentInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 15,
        height: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
    },
    commentButton: {
        backgroundColor: '#F97316',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    commentButtonDisabled: {
        backgroundColor: '#CCC',
    },
    commentButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    commentCard: {
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    commentAuthor: {
        fontWeight: 'bold',
        color: '#F97316',
        fontSize: 13,
    },
    commentDate: {
        color: '#999',
        fontSize: 11,
    },
    commentContent: {
        color: '#444',
        fontSize: 14,
        lineHeight: 20,
    },
    noComments: {
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentActionBtn: {
        padding: 4,
        marginLeft: 8,
    },
    editCommentContainer: {
        marginTop: 10,
    },
    editCommentInput: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    editCommentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    editActionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelEditBtn: {
        backgroundColor: '#F3F4F6',
    },
    cancelEditBtnText: {
        color: '#4B5563',
        fontSize: 12,
        fontWeight: '600',
    },
    saveEditBtn: {
        backgroundColor: '#F97316',
    },
    saveEditBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
