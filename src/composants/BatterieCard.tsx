import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface BatteryCardProps {
  level: number | 0;
}

export const BatterieCard: React.FC<BatteryCardProps> = ({ level }) => {
  // Fonction pour déterminer la couleur selon le niveau de batterie
  const getBatteryColor = (level: number): string => {
    if (level >= 80) return '#10B981'; // Vert émeraude
    if (level >= 50) return '#22C55E'; // Vert standard
    if (level >= 20) return '#F59E0B'; // Orange ambre
    if (level >= 10) return '#EF4444'; // Rouge orange
    return '#DC2626'; // Rouge critique
  };

  // Fonction pour déterminer l'icône selon le niveau
  const getBatteryIcon = (level: number): string => {
    if (level >= 80) return '🔋';
    if (level >= 50) return '🔋';
    if (level >= 20) return '🪫';
    return '🪫';
  };

  const batteryColor = getBatteryColor(level);
  const batteryIcon = getBatteryIcon(level);

  return (
    <View style={styles.card}>
      <View >

        <View style={styles.row} >
          <View
            style={[
              styles.iconContainer,
              level < 20 && styles.iconContainerAlert, 
            ]}
          >
            <Text style={styles.icon}>{batteryIcon}</Text>
          </View>

          <Text
            style={[
              styles.value,
              { color: level < 20 ? '#EF4444' : '#0e0d0dff' },
            ]}
          >
            {level}%
          </Text>
        </View>



        <Text style={styles.label}>NIVEAU DE BATTERIE ATTELLE</Text>
      </View>
      {/* Message d'alerte si batterie faible */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${level}%`,
              backgroundColor: batteryColor,
            },
          ]}
        />
        {/* Indicateurs de niveau */}
        <View style={styles.levelIndicators}>
          <View style={[styles.indicator, { left: '20%' }]} />
          <View style={[styles.indicator, { left: '40%' }]} />
          <View style={[styles.indicator, { left: '60%' }]} />
          <View style={[styles.indicator, { left: '80%' }]} />
        </View>
      </View>
      {level < 20 && (
        <Text style={styles.alertMessage}>
          {level < 10 ? '⚠️ Batterie critique' : '⚠️ Batterie faible'}
        </Text>
      )}
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
    shadowRadius: 3.84,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#E5E7EB',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainerAlert: {
    backgroundColor: '#FEE2E2', // Fond rouge clair pour alerte
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: '#141414ff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#D1D5DB',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Ajout d'un gradient effect avec shadow

    shadowRadius: 2,
  },
  levelIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  alertMessage: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

// Exemple d'utilisation avec animation (optionnel)
export const AnimatedBatteryCard: React.FC<BatteryCardProps> = ({ level }) => {
  const [animatedValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: level,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [level]);

  return <BatterieCard level={level} />;
};

// Exemples d'utilisation
/*
import { BatteryCard } from './BatteryCard';

// Batterie critique (rouge)
<BatteryCard level={10} />

// Batterie faible (orange)
<BatteryCard level={25} />

// Batterie moyenne (vert standard)
<BatteryCard level={60} />

// Batterie pleine (vert émeraude)
<BatteryCard level={95} />
*/
