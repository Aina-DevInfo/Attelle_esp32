


// ===================================
// 📱 components/DeviceScanner.tsx
// Style épuré et minimaliste
// ===================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { BluetoothDevice } from 'react-native-bluetooth-classic';

interface DeviceScannerProps {
  isScanning: boolean;
  paired: BluetoothDevice[];
  onScan: () => void;
  onConnect: (device: BluetoothDevice) => void;
}

export const DeviceScanner: React.FC<DeviceScannerProps> = ({
  isScanning,
  paired,
  onScan,
  onConnect,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            <Image
              source={require('../assets/bluetooth.png')} // chemin vers ton fichier PNG
            />
          </Text>
        </View>
        <Text style={styles.headerTitle}>ATTELLE INTELLIGENTE</Text>
        <Text style={styles.headerSubtitle}>Scanner Bluetooth</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.scanCard, isScanning && styles.scanCardActive]}
        onPress={onScan}
        disabled={isScanning}
        activeOpacity={0.7}
      >
        <View style={styles.scanIconContainer}>
          {isScanning ? (
            <ActivityIndicator size="small" color="#4A90E2" />
          ) : (
            <Text style={styles.scanIcon}>📡</Text>
          )}
        </View>
        <Text style={styles.scanLabel}>
          {isScanning ? 'RECHERCHE EN COURS...' : 'LANCER LE SCAN'}
        </Text>
        <Text style={styles.scanHint}>
          {isScanning 
            ? 'Veuillez patienter' 
            : 'Rechercher des appareils à proximité'}
        </Text>
      </TouchableOpacity>

      {/* Devices Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>APPAREILS DISPONIBLES</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{paired.length}</Text>
        </View>
      </View>

      {/* Device List */}
      {paired.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📵</Text>
          </View>
          <Text style={styles.emptyLabel}>AUCUN APPAREIL DÉTECTÉ</Text>
          <Text style={styles.emptyDescription}>
            Assurez-vous que vos appareils sont{'\n'}
            couplés dans les paramètres Bluetooth
          </Text>
        </View>
      ) : (
        paired.map((device: BluetoothDevice, index) => (
          <View key={device.id || index} style={styles.deviceCard}>
            <View style={styles.deviceContent}>
              <View style={styles.deviceIconContainer}>
                <Text style={styles.deviceIcon}>📱</Text>
              </View>
              
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>
                  {device.name || 'Appareil inconnu'}
                </Text>
                <Text style={styles.deviceId}>{device.id}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Disponible</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => onConnect(device)}
                disabled={isScanning}
                activeOpacity={0.7}
              >
                <Text style={styles.connectButtonText}>Connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  
  // Header Card
  headerCard: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    margin: 16,
    elevation: 10,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  headerTitle: {
    color: '#8A9596',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#070707ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Scan Card
  scanCard: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 10,
    padding: 20,
  },
  scanCardActive: {
    backgroundColor: '#e8f4ff',
  },
  scanIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanIcon: {
    fontSize: 24,
  },
  scanLabel: {
    color: '#8A9596',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  scanHint: {
    color: '#070707ff',
    fontSize: 14,
  },
  
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#8A9596',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Device Card
  deviceCard: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 10,
    padding: 16,
  },
  deviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIcon: {
    fontSize: 20,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: '#070707ff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  deviceId: {
    color: '#8A9596',
    fontSize: 11,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '500',
  },
  
  // Connect Button
  connectButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Empty State
  emptyCard: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 10,
    padding: 24,
    alignItems: 'center',
  },
  emptyIconContainer: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyLabel: {
    color: '#8A9596',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptyDescription: {
    color: '#070707ff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});