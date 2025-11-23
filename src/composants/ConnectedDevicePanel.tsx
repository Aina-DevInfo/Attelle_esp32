// ===================================
// 📁 components/ConnectedDevicePanel.tsx
// Partie 2 : Appareil connecté et messagerie
// ===================================
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { styles } from '../styles/bluetoothStyles';
import { RootStackParamList } from '../types';
import ScreenConnect from '../ScreenConnect';

import Accueil from './Accueil';
import { TemperatureCard } from './TemperatureCard';
import { UsageTimeCard } from './UsageTimeCard';
import { BluetoothCard } from './BluetoothCard';
import { LockStatusCard } from './LockStatusCard';
import { BatterieCard } from './BatterieCard';
import { AlertInfo } from './AlertInfo';

interface ConnectedDevicePanelProps {
  selectedDevice: BluetoothDevice;
  messageToSend: string;
  receivedMessage: string;
  isConnected: boolean;
  onDisconnect: () => void;
  onSendMessage: () => void;
  onMessageChange: (text: string) => void;
}
interface Duree {
  heures: number;
  minutes: number;
}
interface ParsedData {
  temp: number | null;
  ferm: boolean;
  duree: Duree | null;
  bat: number | null;
  alert: number | null;
}

export const ConnectedDevicePanel: React.FC<ConnectedDevicePanelProps> = ({
  selectedDevice,
  messageToSend,
  receivedMessage,
  isConnected,
  onDisconnect,
  onSendMessage,
  onMessageChange,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isDarkMode = useColorScheme() === 'dark';

  const parseCsvLine = (line: string) => {
    // 1. Split avec ',' puis trim chaque valeur
    const values = line.split(',').map(v => v.trim());

    // 2. Remplacer "null" (string) par null (valeur JS) ou undefined
    const cleanedValues = values.map(v =>
      v.toLowerCase() === 'null' ? null : v,
    );

    // 3. Si tu sais que ta ligne doit contenir température, humidité, pression
    // tu peux assigner comme ça (avec fallback null si valeur manquante)
    const temp =
      cleanedValues[0] !== undefined ? Number(cleanedValues[0]) : null;
    //const ferm = cleanedValues[1] !== undefined ? cleanedValues[1] : null;

    const rawValue = cleanedValues[1] !== undefined ? cleanedValues[1] : null;

    let ferm = false;

    if (rawValue !== null) {
      const val = rawValue.toString().toLowerCase();
      ferm = val === 'true' || val === '1';
    }

    const durees = cleanedValues[2] !== undefined ? cleanedValues[2] : null;
    const duree = parseDuree(durees);
    const bat =
      cleanedValues[3] !== undefined ? Number(cleanedValues[3]) : null;
    const alert =
      cleanedValues[4] !== undefined ? Number(cleanedValues[4]) : null;
    return { temp, ferm, duree, bat, alert };
  };
  function parseDuree(dureeStr: string | null | undefined): Duree | null {
    if (!dureeStr) return null;
    const parts = dureeStr.split(':');
    if (parts.length !== 2) return null;
    const heures = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (isNaN(heures) || isNaN(minutes)) return null;
    return { heures, minutes };
  }

  const [data, setData] = useState<ParsedData>({
    temp: null,
    ferm: false,
    duree: null,
    bat: null,
    alert: null,
  });

  useEffect(() => {
    const parsed = parseCsvLine(receivedMessage);
    setData(parsed);
  }, [receivedMessage]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Accueil nom={selectedDevice.name} />
            <AlertInfo numero={data.alert ?? 1} />
            <View style={styles.row}>
              <TemperatureCard temperature={data.temp ?? 0} />
              <LockStatusCard isLocked={data.ferm} />
            </View>
            <UsageTimeCard
              hours={data.duree?.heures ?? 0}
              minutes={data.duree?.minutes ?? 0}
            />
            <BatterieCard level={data.bat ?? 0} />
            <BluetoothCard
              isConnected={true}
              deviceName={selectedDevice.name}
              diviceId={selectedDevice.id}
              onDisconnect={onDisconnect}
            />

            {/* 
              exemple de donne : "23.5,true,01:45,78,2" 
              23.5 → température
              true → verrouillage (fermeture)
              01:45 → durée (1 heure 45 minutes)
              78 → batterie
              2 → alerte
            
            */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
