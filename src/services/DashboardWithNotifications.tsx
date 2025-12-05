import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AlertInfo } from './AlertInfo';
import { 
  useAlertNotifications, 
  useNotificationListener,
  requestNotificationPermissions 
} from './NotificationService';

// ===================================
// Exemple: Composant Dashboard avec notifications
// ===================================
interface BraceData {
  temperature: number;
  isLocked: boolean;
  usageTime: string;
  batteryLevel: number;
  alertNumber: number;
}

const DashboardScreen: React.FC = () => {
  const [braceData, setBraceData] = useState<BraceData>({
    temperature: 23.5,
    isLocked: true,
    usageTime: '00:00',
    batteryLevel: 78.0,
    alertNumber: 1,
  });

  // ✅ Hook pour gérer les notifications automatiquement
  const { sendNotification, cancelAllNotifications } = useAlertNotifications(braceData.alertNumber);

  // ✅ Écouter les notifications (optionnel)
  useNotificationListener(
    // Quand une notification est reçue (app ouverte)
    (notification) => {
      console.log('Notification reçue:', notification.request.content.title);
    },
    // Quand l'utilisateur clique sur une notification
    (response) => {
      const alertNumber = response.notification.request.content.data?.alertNumber;
      if (alertNumber) {
        Alert.alert(
          'Alerte',
          `Vous avez cliqué sur l'alerte n°${alertNumber}`,
          [{ text: 'OK' }]
        );
      }
    }
  );

  // ✅ Demander les permissions au démarrage
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // ===================================
  // Simulation: Réception données Bluetooth
  // ===================================
  const parseBluetoothData = (data: string) => {
    // Format: "23.5,True,00:15,78.0,1"
    const parts = data.split(',');
    if (parts.length >= 5) {
      const newData: BraceData = {
        temperature: parseFloat(parts[0]),
        isLocked: parts[1] === 'True',
        usageTime: parts[2],
        batteryLevel: parseFloat(parts[3]),
        alertNumber: parseInt(parts[4]),
      };
      
      setBraceData(newData);
      // La notification est envoyée automatiquement via useAlertNotifications
    }
  };

  // Simuler la réception de données (à remplacer par votre logique Bluetooth)
  useEffect(() => {
    // Exemple: données simulées pour test
    const testData = [
      "25.0,True,00:05,78.0,1",   // Normal
      "40.0,True,00:10,78.0,2",   // Temp anormale
      "25.0,False,00:15,78.0,3",  // Non verrouillée
      "25.0,True,00:20,10.0,4",   // Batterie faible
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < testData.length) {
        parseBluetoothData(testData[index]);
        index++;
      }
    }, 10000); // Toutes les 10 secondes pour test

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attelle Connectée</Text>
      
      {/* Carte d'alerte */}
      <AlertInfo numero={braceData.alertNumber} />
      
      {/* Autres informations */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Température</Text>
          <Text style={styles.infoValue}>{braceData.temperature.toFixed(1)}°C</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Batterie</Text>
          <Text style={styles.infoValue}>{braceData.batteryLevel.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Verrouillée</Text>
          <Text style={styles.infoValue}>{braceData.isLocked ? '✅' : '❌'}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Durée</Text>
          <Text style={styles.infoValue}>{braceData.usageTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '45%',
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8A9596',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen;
