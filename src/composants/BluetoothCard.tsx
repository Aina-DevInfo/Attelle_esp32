import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BluetoothCardProps {
  isConnected: boolean;
  deviceName?: string;
  diviceId?: string;
  onDisconnect?: () => void;
}

export const BluetoothCard: React.FC<BluetoothCardProps> = ({
  isConnected,
  deviceName = 'Appareil',
  diviceId ='00:00:00:00:00:00',
  onDisconnect,

}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📊</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}> {diviceId}</Text>
          <Text style={styles.status}>
            {isConnected ? `${deviceName} connecté` : 'Non connecté'}
          </Text>
        </View>
        <View>
          {isConnected && (
            <TouchableOpacity style={styles.button} onPress={onDisconnect}>
              <Text style={styles.buttonText}>Déconnecter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    justifyContent: 'space-between',
    margin: 16,
    elevation: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: '#141414ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    color: '#8A9596',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#e6dbd5ff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#2A3B3C',
    fontSize: 16,
    fontWeight: '600',
  },
});
