import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Modal,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './CustomAlert.styles';

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


