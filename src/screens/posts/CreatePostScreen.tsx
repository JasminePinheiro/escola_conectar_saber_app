import { useNavigation } from '@react-navigation/native';
import { Activity, ArrowLeft, FileText, Layout, Lock, Send, Tags } from 'lucide-react-native';
import React, { useLayoutEffect, useState } from 'react';
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
import { PostService } from '../../services/postService';

export default function CreatePostScreen() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsStr, setTagsStr] = useState('');
    const [status, setStatus] = useState<'published' | 'draft' | 'private'>('published');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    // Hide navigator header to avoid double header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    async function handleCreatePost() {
        if (!title || !content) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        // Convert comma-separated string to array
        const tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        setLoading(true);
        try {
            await PostService.createPost({
                title,
                content,
                tags,
                published: status === 'published',
                status: status
            });
            Alert.alert('Sucesso', 'Postagem publicada com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível publicar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nova Postagem</Text>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título da Matéria</Text>
                        <View style={styles.inputWrapper}>
                            <Layout size={20} color="#F97316" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: A importância da Literatura"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Conteúdo Detalhado</Text>
                        <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                            <FileText size={20} color="#F97316" style={{ marginTop: 15 }} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Escreva o conteúdo pedagógico aqui..."
                                value={content}
                                onChangeText={setContent}
                                multiline
                                textAlignVertical="top"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tags (Separadas por vírgula)</Text>
                        <View style={styles.inputWrapper}>
                            <Tags size={20} color="#F97316" />
                            <TextInput
                                style={styles.input}
                                placeholder="Educação, Literatura, Dicas..."
                                value={tagsStr}
                                onChangeText={setTagsStr}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Status da Publicação</Text>
                        <View style={styles.statusContainer}>
                            <TouchableOpacity
                                style={[styles.statusOption, status === 'published' && styles.statusOptionActive]}
                                onPress={() => setStatus('published')}
                            >
                                <Activity size={18} color={status === 'published' ? '#FFF' : '#666'} />
                                <Text style={[styles.statusText, status === 'published' && styles.statusTextActive]}>Público</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusOption, status === 'draft' && styles.statusOptionActive]}
                                onPress={() => setStatus('draft')}
                            >
                                <FileText size={18} color={status === 'draft' ? '#FFF' : '#666'} />
                                <Text style={[styles.statusText, status === 'draft' && styles.statusTextActive]}>Rascunho</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusOption, status === 'private' && styles.statusOptionActive]}
                                onPress={() => setStatus('private')}
                            >
                                <Lock size={18} color={status === 'private' ? '#FFF' : '#666'} />
                                <Text style={[styles.statusText, status === 'private' && styles.statusTextActive]}>Privado</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.publishButton, loading && styles.disabledButton]}
                        onPress={handleCreatePost}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Send size={20} color="#FFF" style={{ marginRight: 10 }} />
                                <Text style={styles.publishButtonText}>Publicar Agora</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
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
    scrollContent: {
        paddingBottom: 40,
    },
    form: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        height: 56,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        height: 180, // Slightly reduced to fit other fields
    },
    textArea: {
        height: 160,
        paddingTop: 15,
    },
    statusContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
    },
    statusOption: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    statusOptionActive: {
        backgroundColor: '#F97316',
        elevation: 2,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginLeft: 8,
    },
    statusTextActive: {
        color: '#FFF',
    },
    publishButton: {
        backgroundColor: '#F97316',
        borderRadius: 16,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: '#F97316',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    disabledButton: {
        backgroundColor: '#CCC',
        elevation: 0,
    },
    publishButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
