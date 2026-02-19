import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.primary,
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
        color: Colors.white,
        marginLeft: 8,
    },
    backButton: {
        padding: 8,
    },
    form: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.gray800,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray100,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 56,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: Colors.gray800,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    saveButtonDisabled: {
        backgroundColor: Colors.gray300,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: Colors.gray500,
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
