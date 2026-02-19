import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
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
        backgroundColor: Colors.error,
    },
    actionText: {
        color: Colors.white,
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
        backgroundColor: Colors.gray100,
        borderRadius: 12,
        padding: 15,
        height: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 10,
    },
    commentButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    commentButtonDisabled: {
        backgroundColor: Colors.gray300,
    },
    commentButtonText: {
        color: Colors.white,
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
        color: Colors.primary,
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
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
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
        backgroundColor: Colors.gray100,
    },
    cancelEditBtnText: {
        color: Colors.gray600,
        fontSize: 12,
        fontWeight: '600',
    },
    saveEditBtn: {
        backgroundColor: Colors.primary,
    },
    saveEditBtnText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 20,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
});
