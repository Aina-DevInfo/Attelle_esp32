import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface LockStatusCardProps {
  isLocked: boolean;
}

export const LockStatusCard: React.FC<LockStatusCardProps> = ({isLocked}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔒</Text>
      </View>
      <Text style={styles.label}>FERMETURE</Text>
      <Text style={styles.value}>
        {isLocked ? 'Verrouillée' : 'Déverrouillée'}
      </Text>
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
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: '#8A9596',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    color: '#000000ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});