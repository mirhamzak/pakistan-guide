import { firebaseService } from '@/services/firebaseService';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FirebaseTest = () => {
    const [status, setStatus] = useState('Not tested');
    const [isLoading, setIsLoading] = useState(false);

    const testFirebase = async () => {
        setIsLoading(true);
        try {
            const isConnected = await firebaseService.testConnection();
            setStatus(isConnected ? 'Connected ✅' : 'Failed ❌');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Firebase Test</Text>
            <Text style={styles.status}>Status: {status}</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={testFirebase}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : 'Test Firebase Connection'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
