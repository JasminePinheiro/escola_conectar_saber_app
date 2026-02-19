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
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.border,
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
        height: 180,
    },
    textArea: {
        height: 160,
        paddingTop: 15,
    },
    statusContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.gray100,
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
        backgroundColor: Colors.primary,
        elevation: 2,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.gray500,
        marginLeft: 8,
    },
    statusTextActive: {
        color: Colors.white,
    },
    publishButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    disabledButton: {
        backgroundColor: Colors.gray300,
        elevation: 0,
    },
    publishButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    textAreaIcon: {
        marginTop: 15,
    },
    buttonIcon: {
        marginRight: 10,
    },
});
