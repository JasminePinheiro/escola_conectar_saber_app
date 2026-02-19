import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
    Atom,
    Beaker,
    Book,
    BookOpen,
    Calculator,
    Calendar,
    Dumbbell,
    Globe,
    History,
    Languages,
    LayoutGrid,
    Lightbulb,
    Microscope,
    Palette,
    Pen,
    Search,
    SlidersHorizontal,
    User,
    Users
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { PostService } from '../../services/postService';
import { Post } from '../../types';
import { styles } from './PostListScreen.styles';

const { width } = Dimensions.get('window');

const HIGHLIGHTS = [
    { id: '1', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop' },
    { id: '2', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' },
    { id: '3', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop' },
];

const CATEGORIES = [
    { name: 'Tudo', icon: LayoutGrid },
    { name: 'Português', icon: BookOpen },
    { name: 'Literatura', icon: Book },
    { name: 'Redação', icon: Pen },
    { name: 'Inglês', icon: Languages },
    { name: 'Artes', icon: Palette },
    { name: 'Educação Física', icon: Dumbbell },
    { name: 'Matemática', icon: Calculator },
    { name: 'Física', icon: Atom },
    { name: 'Química', icon: Beaker },
    { name: 'Biologia', icon: Microscope },
    { name: 'História', icon: History },
    { name: 'Geografia', icon: Globe },
    { name: 'Filosofia', icon: Lightbulb },
    { name: 'Sociologia', icon: Users },
];

export default function PostListScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tudo');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [refreshing, setRefreshing] = useState(false);
    const [activeHighlight, setActiveHighlight] = useState(0);
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const isFirstRun = React.useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const handler = setTimeout(() => {
            setSearch(searchText);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchText]);

    async function loadPosts() {
        try {
            if (posts.length === 0) setLoading(true);
            const categoryParam = selectedCategory === 'Tudo' ? undefined : selectedCategory;
            const data = await PostService.getPosts(1, 15, search, categoryParam);

            let sortedData = [...data.data];
            if (sortBy === 'title') {
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
                if (sortOrder === 'DESC') sortedData.reverse();
            } else if (sortBy === 'createdAt') {
                sortedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                if (sortOrder === 'ASC') sortedData.reverse();
            }

            setPosts(sortedData);
        } catch (error) {
            console.error('Failed to load posts', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [search, selectedCategory, sortBy, sortOrder])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadPosts();
    }, []);

    const handleCreatePost = () => {
        navigation.navigate('CreatePost');
    };

    const handleFilterPress = () => {
        setShowFilterModal(true);
    };

    const applyFilter = (type: 'recent' | 'old' | 'alpha' | 'clear') => {
        switch (type) {
            case 'recent':
                setSortBy('createdAt');
                setSortOrder('DESC');
                break;
            case 'old':
                setSortBy('createdAt');
                setSortOrder('ASC');
                break;
            case 'alpha':
                setSortBy('title');
                setSortOrder('ASC');
                break;
            case 'clear':
                setSearch('');
                setSelectedCategory('Tudo');
                setSortBy('createdAt');
                setSortOrder('DESC');
                break;
        }
        setShowFilterModal(false);
    }; const renderHighlight = ({ item }: { item: any }) => (
        <View style={styles.highlightCard}>
            <Image source={{ uri: item.image }} style={styles.highlightImage} />
        </View>
    );

    const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => {
        const Icon = item.icon;
        const isActive = selectedCategory === item.name;
        return (
            <TouchableOpacity
                style={styles.categoryCircleContainer}
                onPress={() => setSelectedCategory(item.name)}
            >
                <View style={[
                    styles.categoryCircle,
                    isActive && styles.categoryCircleActive
                ]}>
                    <Icon size={24} color={isActive ? '#FFF' : '#F97316'} />
                </View>
                <Text style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={styles.postCard}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id } as any)}
        >
            <Text style={styles.postTitle}>{item.title}</Text>

            {item.category ? (
                <View style={styles.postCategoryBadge}>
                    <Text style={styles.postCategoryText}>{item.category}</Text>
                </View>
            ) : null}

            <Text style={styles.postDescription} numberOfLines={4}>
                {item.content}
            </Text>

            {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsRow}>
                    {item.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tagBadge}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.postFooter}>
                <View style={styles.footerItem}>
                    <User size={14} color="#F97316" />
                    <Text style={styles.footerText}>{item.author}</Text>
                </View>
                <View style={styles.footerItem}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.footerText}>
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                </View>
                {(item.status === 'draft' || item.status === 'private') && (
                    <View style={[
                        styles.statusBadgeSmall,
                        item.status === 'draft' ? styles.badgeDraft : styles.badgePrivate
                    ]}>
                        <Text style={[
                            styles.statusTextSmall,
                            item.status === 'draft' ? styles.textDraft : styles.textPrivate
                        ]}>
                            {item.status === 'draft' ? 'Rascunho' : 'Privado'}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.headerBackground}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Text style={styles.brandText}>Escola Conecta Saber</Text>
                        <Text style={styles.headerTitle}>Educação de Qualidade</Text>

                        <View style={styles.searchRow}>
                            <View style={styles.searchBar}>
                                <Search color="#999" size={20} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Buscar posts..."
                                    placeholderTextColor="#999"
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={handleFilterPress}
                            >
                                <SlidersHorizontal color="#FFF" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />
                }
                ListHeaderComponent={
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Destaques</Text>
                        </View>

                        <FlatList
                            data={HIGHLIGHTS}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={renderHighlight}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                setActiveHighlight(index);
                            }}
                            style={styles.carousel}
                        />

                        <View style={styles.pagination}>
                            {HIGHLIGHTS.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        activeHighlight === i ? styles.activeDot : styles.inactiveDot
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Categories Section */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Categorias</Text>

                        </View>

                        <FlatList
                            data={CATEGORIES}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.name}
                            renderItem={renderCategory}
                            contentContainerStyle={styles.categoriesList}
                        />

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Nossas Postagens</Text>
                            <Text style={styles.postCount}>{posts.length} posts</Text>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>Nenhum post encontrado.</Text> : null
                }
                ListFooterComponent={loading ? <ActivityIndicator color="#F97316" style={styles.loader} /> : null}
            />

            {/* Filter Modal for Web and Mobile */}
            <Modal
                visible={showFilterModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowFilterModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrar e Ordenar</Text>

                        <TouchableOpacity style={styles.modalOption} onPress={() => applyFilter('recent')}>
                            <Text style={styles.modalOptionText}>Mais Recentes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => applyFilter('old')}>
                            <Text style={styles.modalOptionText}>Mais Antigas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => applyFilter('alpha')}>
                            <Text style={styles.modalOptionText}>Ordem Alfabética (A-Z)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalOption, styles.modalOptionDestructive]} onPress={() => applyFilter('clear')}>
                            <Text style={styles.modalOptionTextDestructive}>Limpar Tudo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowFilterModal(false)}>
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {user?.role !== 'student' && (
                <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}


