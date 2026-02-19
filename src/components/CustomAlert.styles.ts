import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: Colors.black,
        shadowOpacity: 0.25,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.gray800,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.gray500,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    okButton: {
        backgroundColor: Colors.primary,
    },
    okButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: Colors.gray100,
    },
    cancelButtonText: {
        color: Colors.gray600,
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
