import { useNavigation } from '@react-navigation/native';
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostService } from '../../services/postService';
import { Post } from '../../types';

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
    const [selectedCategory, setSelectedCategory] = useState('Tudo');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [refreshing, setRefreshing] = useState(false);
    const [activeHighlight, setActiveHighlight] = useState(0);
    const navigation = useNavigation<any>();

    async function loadPosts() {
        try {
            setLoading(true);
            const query = selectedCategory === 'Tudo' ? search : `${search} ${selectedCategory}`.trim();
            const data = await PostService.getPosts(1, 15, query);

            // Client-side sorting as a fallback if needed, or just let backend handle it
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

    useEffect(() => {
        loadPosts();
    }, [search, selectedCategory, sortBy, sortOrder]);

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
                                    value={search}
                                    onChangeText={setSearch}
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
                ListFooterComponent={loading ? <ActivityIndicator color="#F97316" style={{ margin: 20 }} /> : null}
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

            <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerBackground: {
        backgroundColor: '#F97316',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },
    headerContent: {
        marginTop: 10,
    },
    brandText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 100,
    },
    categoriesContainer: {
        marginBottom: 10,
    },
    categoriesList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    categoryCircleContainer: {
        alignItems: 'center',
        marginRight: 20,
        width: 70,
    },
    categoryCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2', // Very light orange/red border
        elevation: 3,
        shadowColor: '#F97316',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    categoryCircleActive: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
    },
    categoryLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    categoryLabelActive: {
        color: '#F97316',
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    seeAllText: {
        color: '#F97316',
        fontWeight: '600',
    },
    postCount: {
        color: '#999',
        fontSize: 14,
    },
    carousel: {
        paddingLeft: 20,
    },
    highlightCard: {
        width: width - 40,
        height: 200,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    highlightImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEE',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#F97316',
    },
    inactiveDot: {
        width: 8,
        backgroundColor: '#DDD',
    },
    postCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 8,
    },
    postDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    tagBadge: {
        backgroundColor: '#FFF4ED',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 15,
    },
    tagText: {
        color: '#F97316',
        fontSize: 12,
        fontWeight: 'bold',
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#777',
        marginLeft: 6,
    },
    statusBadgeSmall: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 'auto',
    },
    statusTextSmall: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    badgeDraft: {
        backgroundColor: '#F3F4F6',
    },
    badgePrivate: {
        backgroundColor: '#FEF2F2',
    },
    textDraft: {
        color: '#6B7280',
    },
    textPrivate: {
        color: '#EF4444',
    },
    postCategoryBadge: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    postCategoryText: {
        color: '#F97316',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#F97316',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    fabText: {
        color: '#FFF',
        fontSize: 30,
        fontWeight: '300',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F97316',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        width: '100%',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    modalOptionDestructive: {
        borderBottomWidth: 0,
        marginTop: 10,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    modalOptionTextDestructive: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
