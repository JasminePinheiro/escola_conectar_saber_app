import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        marginLeft: 8,
    },
    searchBarContainer: {
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1E293B',
    },
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: Colors.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: Colors.black,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: Colors.black,
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.orangeLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 5,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    loader: {
        margin: 20,
    },
});
