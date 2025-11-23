import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderStatusProps {
  nom?: string; // optionnel, avec valeur par défaut
}

const HeaderStatus: React.FC<HeaderStatusProps> = ({ nom }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}> Attelle Intelligente</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{nom}</Text>
      </View>
    </View>
  );
};

export default HeaderStatus;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    elevation: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e293b',
  },
  statusContainer: {
    backgroundColor: '#e6f4ea',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  statusText: {
    color: '#15803d',
    fontSize: 14,
  },
});
