// ===================================
// 📁 BluetoothClassicTerminal.tsx (Main)
// ===================================
import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useBluetooth } from './hooks/useBluetooth';
import { BluetoothUI } from './composants/BluetoothUI';
import { styles } from './styles/bluetoothStyles';

const BluetoothClassicTerminal = () => {
  const {
    paired,
    selectedDevice,
    messageToSend,
    receivedMessage,
    isConnected,
    isScanning,
    setMessageToSend,
    checkBluetoothEnabled,
    startDeviceDiscovery,
    connectToDevice,
    sendMessage,
    disconnect,
  } = useBluetooth();

  useEffect(() => {
    async function requestBluetoothPermission(): Promise<boolean> {
      if (Platform.OS !== 'android') {
        return true; // iOS n'a pas besoin de ces permissions
      }

      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const grantedPermissions = await PermissionsAndroid.requestMultiple(
          permissions,
        );

        const allGranted = permissions.every(
          permission =>
            grantedPermissions[permission] ===
            PermissionsAndroid.RESULTS.GRANTED,
        );

        if (allGranted) {
          console.log('All Bluetooth permissions granted');
          return true;
        } else {
          console.log('Some Bluetooth permissions denied');
          const deniedPermissions = permissions.filter(
            permission =>
              grantedPermissions[permission] !==
              PermissionsAndroid.RESULTS.GRANTED,
          );
          Alert.alert(
            'Permissions requises',
            `Les permissions suivantes sont nécessaires: ${deniedPermissions.join(
              ', ',
            )}`,
          );
          return false;
        }
      } catch (err) {
        console.warn('Error requesting permissions:', err);
        Alert.alert('Erreur', 'Impossible de demander les permissions');
        return false;
      }
    }

    const initializeBluetooth = async () => {
      console.log('Initializing Bluetooth...');
      const permissionsGranted = await requestBluetoothPermission();

      if (permissionsGranted) {
        const bluetoothEnabled = await checkBluetoothEnabled();
        if (bluetoothEnabled) {
          await startDeviceDiscovery();
        }
      }
    };

    initializeBluetooth();
  }, []);

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BluetoothUI
          isConnected={isConnected}
          isScanning={isScanning}
          paired={paired}
          selectedDevice={selectedDevice}
          messageToSend={messageToSend}
          receivedMessage={receivedMessage}
          onScan={startDeviceDiscovery}
          onConnect={connectToDevice}
          onDisconnect={disconnect}
          onSendMessage={sendMessage}
          onMessageChange={setMessageToSend}
        />
      </ScrollView>
    </View>
  );
};

export default BluetoothClassicTerminal;