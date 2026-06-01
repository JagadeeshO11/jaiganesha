import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const HomeScreen = () => {
  const { isServiceEnabled, toggleService, isBatteryOptimized, openBatterySettings } = useContext(AppContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>TorchCam</Text>
      
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>
          Shake Detection: {isServiceEnabled ? 'ACTIVE' : 'OFF'}
        </Text>
        <Switch
          value={isServiceEnabled}
          onValueChange={toggleService}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isServiceEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {isBatteryOptimized && isServiceEnabled && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Battery Optimization Active</Text>
          <Text style={styles.warningText}>
            Android may stop the service to save battery. For best results, exempt TorchCam from optimization.
          </Text>
          <TouchableOpacity style={styles.fixButton} onPress={openBatterySettings}>
            <Text style={styles.fixButtonText}>Fix in Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.guide}>
        <Text style={styles.guideTitle}>Quick Gestures</Text>
        <Text style={styles.guideItem}>Double Shake → Toggle Flashlight</Text>
        <Text style={styles.guideItem}>Triple Shake → Open Camera</Text>
      </View>

      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={() => {
          toggleService(false);
          Alert.alert("Stopped", "All gestures and monitoring disabled.");
        }}
      >
        <Text style={styles.emergencyText}>DISABLE ALL GESTURES</Text>
      </TouchableOpacity>

      <Text style={styles.batteryInfo}>
        Battery Usage: Optimized. Sensors active only when detection is ON.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  statusCard: { 
    width: '100%', 
    padding: 20, 
    borderRadius: 15, 
    backgroundColor: '#f8f9fa', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },
  statusText: { fontSize: 18, fontWeight: '600' },
  warningBox: { 
    marginTop: 20, 
    width: '100%', 
    padding: 15, 
    backgroundColor: '#fff3cd', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#ffeeba' 
  },
  warningTitle: { fontWeight: 'bold', color: '#856404', marginBottom: 5 },
  warningText: { color: '#856404', fontSize: 14 },
  fixButton: { marginTop: 10, backgroundColor: '#856404', padding: 8, borderRadius: 5, alignSelf: 'flex-start' },
  fixButtonText: { color: '#fff', fontWeight: 'bold' },
  guide: { marginTop: 40, width: '100%' },
  guideTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  guideItem: { fontSize: 16, marginBottom: 10, color: '#555' },
  emergencyButton: {
    marginTop: 40,
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  emergencyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  batteryInfo: { marginTop: 20, fontSize: 12, color: '#999', textAlign: 'center' }
});

export default HomeScreen;
