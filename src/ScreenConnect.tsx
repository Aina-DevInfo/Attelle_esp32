import {
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Text,
  View, 
  Platform,
 
} from 'react-native';
import React, { useEffect } from 'react'; 

import Accueil from './composants/Accueil';
import { TemperatureCard } from './composants/TemperatureCard';
import { UsageTimeCard } from './composants/UsageTimeCard';
import { BluetoothCard } from './composants/BluetoothCard';
import { LockStatusCard } from './composants/LockStatusCard';
import { BatterieCard } from './composants/BatterieCard';
import { AlertInfo } from './composants/AlertInfo';

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useBluetooth } from './hooks/useBluetooth';


function ScreenConnect() {

  const isDarkMode = useColorScheme() === 'dark';

const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // ✅ Récupérer les données du contexte Bluetooth
  const { receivedMessage, isConnected } = useBluetooth();




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />


          <Accueil />
          <ScrollView style={styles.receivedMessageBox} nestedScrollEnabled>
            <Text style={styles.receivedMessageText}>
              {receivedMessage || '** En attente de messages...'}
            </Text>
            <Text style={styles.debugText}>
              Connecté: {isConnected ? 'OUI' : 'NON'}
            </Text>
          </ScrollView>
          <AlertInfo numero={1} />
          <View style={styles.row}>
            <TemperatureCard temperature={20} />
            <LockStatusCard isLocked={true} />
          </View>
          <UsageTimeCard hours={2} minutes={30} />
          <BatterieCard level={85} />
          <BluetoothCard isConnected={true} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  debugText: {
    color: '#ffff00',
    fontSize: 12,
    marginTop: 10,
  },
  receivedMessageBox: {
    backgroundColor: '#1e1e1e',
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    maxHeight: 300,
    padding: 15,
  },
  receivedMessageText: {
      color: '#00ff00',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontSize: 14,
      lineHeight: 18,
    },
});

export default ScreenConnect;
