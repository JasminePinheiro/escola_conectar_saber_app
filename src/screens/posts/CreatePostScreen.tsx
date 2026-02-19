import { useNavigation } from '@react-navigation/native';
import { Activity, ArrowLeft, BookOpen, FileText, Layout, Lock, Send, Tags } from 'lucide-react-native';
import React, { useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { PostService } from '../../services/postService';
import { styles } from './CreatePostScreen.styles';

export default function CreatePostScreen() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [tagsStr, setTagsStr] = useState('');
    const [status, setStatus] = useState<'published' | 'draft' | 'private'>('published');
    const [loading, setLoading] = useState(false);
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    async function handleCreatePost() {
        if (!title || !content || !category) {
            showAlert('Erro', 'Preencha todos os campos obrigatórios (Título, Disciplina e Conteúdo).', 'error');
            return;
        }

        const tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        setLoading(true);
        try {
            await PostService.createPost({
                title,
                content,
                category,
                tags,
                published: status === 'published',
                status: status
            });
            showAlert('Sucesso', 'Postagem publicada com sucesso!', 'success', () => {
                navigation.goBack();
            });
        } catch (error) {
            console.error(error);
            showAlert('Erro', 'Não foi possível publicar. Tente novamente.', 'error');
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
                        <Text style={styles.label}>Título</Text>
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
                        <Text style={styles.label}>Disciplina</Text>
                        <View style={styles.inputWrapper}>
                            <BookOpen size={20} color="#F97316" />
                            <TextInput
                                style={styles.input}
                                placeholder="Português, Matemática, História..."
                                value={category}
                                onChangeText={setCategory}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Conteúdo Detalhado</Text>
                        <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                            <FileText size={20} color="#F97316" style={styles.textAreaIcon} />
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
                                <Send size={20} color="#FFF" style={styles.buttonIcon} />
                                <Text style={styles.publishButtonText}>Publicar Agora</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
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


