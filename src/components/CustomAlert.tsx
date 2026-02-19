import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function CustomAlert({
    visible,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}: CustomAlertProps) {
    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={40} color="#22C55E" />;
            case 'error': return <AlertCircle size={40} color="#EF4444" />;
            case 'confirm': return <Info size={40} color="#F97316" />;
            default: return <Info size={40} color="#3B82F6" />;
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {type === 'confirm' ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={() => {
                                        onConfirm?.();
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.okButton]}
                                onPress={() => {
                                    onConfirm?.();
                                    onClose();
                                }}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
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
        color: '#1F2937',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
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
        backgroundColor: '#F97316',
    },
    okButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#F97316', // Or use destructive colors if needed
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
