import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const { sensitivity, cooldown } = useContext(AppContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.label}>Shake Sensitivity</Text>
        <Text style={styles.value}>{sensitivity} (Default)</Text>
        <Text style={styles.description}>Lower values make it easier to trigger.</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Cooldown Timer</Text>
        <Text style={styles.value}>{cooldown} Seconds</Text>
        <Text style={styles.description}>Time between actions to prevent spamming.</Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Note: High sensitivity may increase accidental triggers.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  settingItem: { marginBottom: 30 },
  label: { fontSize: 18, fontWeight: '600' },
  value: { fontSize: 16, color: '#007bff', marginVertical: 5 },
  description: { fontSize: 14, color: '#666' },
  warningBox: { padding: 15, backgroundColor: '#fff3cd', borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#ffc107' },
  warningText: { color: '#856404' }
});

export default SettingsScreen;
