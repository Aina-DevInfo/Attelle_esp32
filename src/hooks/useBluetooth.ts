// ===================================
// 📁 hooks/useBluetooth.ts
// ===================================
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

export const useBluetooth = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // ✅ Utiliser le type correct pour React Native
  const intervalIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const checkBluetoothEnabled = async (): Promise<boolean> => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        const result = await RNBluetoothClassic.requestBluetoothEnabled();
        return result;
      }
      return true;
    } catch (error) {
      console.error(
        'Bluetooth Classic is not available on this device:',
        error,
      );
      Alert.alert(
        'Erreur',
        'Bluetooth Classic non disponible sur cet appareil',
      );
      return false;
    }
  };

  const startDeviceDiscovery = async () => {
    if (isScanning) return;

    setIsScanning(true);
    console.log('searching for devices...');

    try {
      const bluetoothEnabled = await checkBluetoothEnabled();
      if (!bluetoothEnabled) {
        setIsScanning(false);
        return;
      }

      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded peripherals: ' + paired.length);
      setPaired(paired);

      if (paired.length === 0) {
        Alert.alert(
          'Info',
          "Aucun appareil Bluetooth couplé trouvé. Couplez d'abord vos appareils dans les paramètres système.",
        );
      }
    } catch (error) {
      console.error('Error bonded devices:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les appareils couplés');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      console.log('Connecting to device:', device.name);

      // Vérifier si déjà connecté
      const connection = await device.isConnected();
      if (connection) {
        console.log('Device already connected');
        setSelectedDevice(device);
        setIsConnected(true);
        return;
      }

      console.log('Attempting connection...');
      await device.connect({
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });

      setSelectedDevice(device);
      setIsConnected(true);
      setReceivedMessage(''); // Clear previous messages
      console.log('Connected successfully to:', device.name);

      Alert.alert('Succès', `Connecté à ${device.name || "l'appareil"}`);
    } catch (error) {
      console.error('Error connecting to device:', error);
      setIsConnected(false);
      setSelectedDevice(undefined);
      Alert.alert(
        'Erreur de connexion',
        `Impossible de se connecter à ${device.name || "l'appareil"}`,
      );
    }
  };

  const sendMessage = async () => {
    if (!selectedDevice || !isConnected || !messageToSend.trim()) {
      return;
    }

    try {
      console.log('Sending message:', messageToSend);
      await selectedDevice.write(messageToSend + '\n'); // Add newline
      setMessageToSend(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Erreur', "Impossible d'envoyer le message");
    }
  };

  // ✅ Fonction de lecture avec useCallback pour éviter les closures stales
  const readData = useCallback(async () => {
    if (!selectedDevice || !isConnected || !mountedRef.current) {
      return;
    }

    try {
      // Vérifier si l'appareil est toujours connecté
      const stillConnected = await selectedDevice.isConnected();
      if (!stillConnected) {
        console.log('Device disconnected unexpectedly');
        setIsConnected(false);
        setSelectedDevice(undefined);
        return;
      }

      // Vérifier les données disponibles
      const available = await selectedDevice.available();
      if (available > 0) {
        let message = await selectedDevice.read();
        if (message && message.trim() !== '' && mountedRef.current) {
          console.log('Received:', message.trim());
          setReceivedMessage(prevMessage => {
            let newMessage = message.trim();
            return newMessage;
            {/*
            let newMessage = prevMessage + message.trim() + '\n';
            // Limiter à 500 caractères pour éviter les problèmes de performance
            if (newMessage.length > 500) {
              newMessage = '...\n' + newMessage.slice(-400);
            }
            return newMessage;
            */}
          });
        }
      }
    } catch (error) {
      console.error('Error reading message:', error);
      // En cas d'erreur de lecture, considérer que la connexion est perdue
      if (mountedRef.current) {
        setIsConnected(false);
        setSelectedDevice(undefined);
      }
    }
  }, [selectedDevice, isConnected]);

  // ✅ Gestion des intervals avec cleanup approprié
  useEffect(() => {
    if (isConnected && selectedDevice) {
      console.log('Starting data reading interval');
      intervalIdRef.current = setInterval(readData, 200) as unknown as number;
    } else {
      if (intervalIdRef.current) {
        console.log('Clearing data reading interval');
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isConnected, selectedDevice, readData]);

  const disconnect = async () => {
    if (!selectedDevice) {
      return;
    }

    try {
      console.log('Disconnecting from device');

      // Clear interval first
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      // ✅ Gestion sécuritaire du clear buffer
      try {
        // Vérifier si la méthode clear existe avant de l'appeler
        if (typeof selectedDevice.clear === 'function') {
          await selectedDevice.clear();
          console.log('BT buffer cleared');
        }
      } catch (clearError) {
        console.log('Buffer clear failed (may not be supported):', clearError);
      }

      // Disconnect
      try {
        await selectedDevice.disconnect();
        console.log('Disconnected successfully');
      } catch (disconnectError) {
        console.log('Disconnect failed:', disconnectError);
      }

      // Reset states regardless of disconnect success
      setSelectedDevice(undefined);
      setIsConnected(false);
      setReceivedMessage('');
      setMessageToSend('');

      Alert.alert('Info', 'Déconnexion réussie');
    } catch (error) {
      console.error('Error disconnecting:', error);
      // Force reset even if disconnect failed
      setSelectedDevice(undefined);
      setIsConnected(false);
      setReceivedMessage('');
      setMessageToSend('');
      Alert.alert('Erreur', 'Erreur lors de la déconnexion, état réinitialisé');
    }
  };

  // ✅ Nettoyage à la fermeture du composant
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      // Auto-disconnect si nécessaire
      if (selectedDevice && isConnected) {
        selectedDevice.disconnect().catch(console.error);
      }
    };
  }, []);

  return {
    devices,
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
  };
};

