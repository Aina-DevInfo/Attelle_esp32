import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertCardProps {
  numero: number;
}

interface AlertConfig {
  message: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const AlertInfo: React.FC<AlertCardProps> = ({ numero }) => {
  
  const getAlertConfig = (num: number): AlertConfig => {
    switch (num) {
      case 1: // Normal
        return {
          message: 'Normal',
          color: '#10B981',
          bgColor: '#F0FDF4',
          icon: '✅'
        };
      
      case 2: // Température anormale
        return {
          message: 'Temp. anormale',
          color: '#EF4444',
          bgColor: '#FEF2F2',
          icon: '🌡️'
        };
      
      case 3: // Non verrouillée
        return {
          message: 'Non verrouillée',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          icon: '🔓'
        };
      
      case 4: // Batterie faible
        return {
          message: 'Batterie faible',
          color: '#F59E0B',
          bgColor: '#FED7AA',
          icon: '🪫'
        };
      
      case 5: // URGENCE
        return {
          message: 'URGENCE',
          color: '#DC2626',
          bgColor: '#FCA5A5',
          icon: '🚨'
        };
      
      default: // Par défaut = Normal
        return {
          message: 'Normal',
          color: '#10B981',
          bgColor: '#F0FDF4',
          icon: '✅'
        };
    }
  };

  const config = getAlertConfig(numero);
  const isUrgent = numero === 5 || numero === 2;

  return (
    <View style={[
      styles.card,
      isUrgent && styles.urgentCard
    ]}>
      <Text style={styles.title}>Alerte</Text>
      
      <View style={[
        styles.statusContainer,
        { backgroundColor: config.bgColor }
      ]}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[
          styles.value,
          { color: config.color }
        ]}>
          {config.message}
        </Text>
      </View>
    </View>
  );
};

// Version compacte sans icône
export const AlertCardCompact: React.FC<AlertCardProps> = ({ numero }) => {
  
  const getAlertText = (num: number): { message: string; color: string } => {
    const configs: { [key: number]: { message: string; color: string } } = {
      1: { message: 'Normal', color: '#10B981' },
      2: { message: 'Température anormale', color: '#EF4444' },
      3: { message: 'Non verrouillée', color: '#F59E0B' },
      4: { message: 'Batterie faible', color: '#F59E0B' },
      5: { message: 'URGENCE', color: '#DC2626' }
    };
    
    return configs[num] || configs[1];
  };

  const alert = getAlertText(numero);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Alerte</Text>
      <Text style={[styles.value, { color: alert.color }]}>
        {alert.message}
      </Text>
    </View>
  );
};

// Version avec indicateur de niveau
export const AlertCardWithLevel: React.FC<AlertCardProps> = ({ numero }) => {
  
  const getAlertLevel = (num: number): 'normal' | 'warning' | 'danger' => {
    if (num === 1) return 'normal';
    if (num === 3 || num === 4) return 'warning';
    return 'danger'; // 2 et 5
  };

  const getConfig = (num: number) => {
    const configs: { [key: number]: { message: string; icon: string } } = {
      1: { message: 'Normal', icon: '✅' },
      2: { message: 'Température anormale', icon: '🌡️' },
      3: { message: 'Non verrouillée', icon: '🔓' },
      4: { message: 'Batterie faible', icon: '🪫' },
      5: { message: 'URGENCE', icon: '🚨' }
    };
    return configs[num] || configs[1];
  };

  const level = getAlertLevel(numero);
  const config = getConfig(numero);
  
  const levelColors = {
    normal: { bg: '#F0FDF4', color: '#10B981', border: '#10B981' },
    warning: { bg: '#FFFBEB', color: '#F59E0B', border: '#F59E0B' },
    danger: { bg: '#FEF2F2', color: '#EF4444', border: '#EF4444' }
  };

  const colors = levelColors[level];

  return (
    <View style={[
      styles.card,
      { 
        borderLeftWidth: 4,
        borderLeftColor: colors.border
      }
    ]}>
      <Text style={styles.title}>Alerte</Text>
      <View style={[styles.levelIndicator, { backgroundColor: colors.bg }]}>
        <Text style={styles.levelIcon}>{config.icon}</Text>
      </View>
      <Text style={[styles.value, { color: colors.color }]}>
        {config.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5ff',
    borderRadius: 16,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    padding: 20,
    alignItems: 'center',
    height: 140,
  },
  urgentCard: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  title: {
    color: '#8A9596',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 10,
  },
  icon: {
    fontSize: 24,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  levelIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelIcon: {
    fontSize: 26,
  },
});

// Mapping des numéros d'alertes (pour référence)
export const ALERT_TYPES = {
  NORMAL: 1,           // ✅ Tout va bien
  TEMP_ABNORMAL: 2,    // 🌡️ Température anormale (< 25°C ou > 38°C)
  UNLOCKED: 3,         // 🔓 Attelle non verrouillée
  BATTERY_LOW: 4,      // 🪫 Batterie faible (< 15%)
  EMERGENCY: 5,        // 🚨 Erreur inconnue / Urgence
};

// Exemples d'utilisation
/*
import { AlertInfo, AlertCardCompact, AlertCardWithLevel, ALERT_TYPES } from './AlertInfo';

// Utilisation simple avec numéro
<AlertInfo numero={1} />  // Normal
<AlertInfo numero={2} />  // Température anormale
<AlertInfo numero={3} />  // Non verrouillée
<AlertInfo numero={4} />  // Batterie faible
<AlertInfo numero={5} />  // URGENCE

// Version compacte
<AlertCardCompact numero={1} />

// Version avec niveau
<AlertCardWithLevel numero={2} />

// Utilisation avec constantes
<AlertInfo numero={ALERT_TYPES.NORMAL} />
<AlertInfo numero={ALERT_TYPES.TEMP_ABNORMAL} />
<AlertInfo numero={ALERT_TYPES.UNLOCKED} />
<AlertInfo numero={ALERT_TYPES.BATTERY_LOW} />
<AlertInfo numero={ALERT_TYPES.EMERGENCY} />
*/