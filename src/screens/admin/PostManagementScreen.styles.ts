import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
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
        color: Colors.gray800,
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
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.orangeLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titleInfo: {
        flex: 1,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.gray800,
        marginBottom: 2,
    },
    postDate: {
        fontSize: 12,
        color: Colors.gray400,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    badgeDraft: {
        backgroundColor: Colors.gray100,
    },
    badgePrivate: {
        backgroundColor: Colors.redLight,
    },
    badgePublished: {
        backgroundColor: '#F0FDF4',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    textDraft: {
        color: Colors.gray500,
    },
    textPrivate: {
        color: Colors.error,
    },
    textPublished: {
        color: Colors.success,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    authorWrap: {
        flex: 1,
        marginRight: 10,
    },
    authorLabel: {
        fontSize: 10,
        color: Colors.gray400,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    authorName: {
        fontSize: 14,
        color: Colors.gray700,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.orangeLight,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 8,
    },
    btnEditText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.primary,
        marginLeft: 6,
    },
    btnDelete: {
        backgroundColor: Colors.redLight,
        padding: 8,
        borderRadius: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: Colors.gray400,
        fontSize: 16,
    },
});
