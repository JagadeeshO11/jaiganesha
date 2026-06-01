import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AuditScreen = () => {
  const permissions = [
    { name: 'CAMERA', reason: 'Required to toggle the flashlight LED and launch the camera app.' },
    { name: 'FLASHLIGHT', reason: 'Required for torch control.' },
    { name: 'VIBRATE', reason: 'Provides tactile feedback when a gesture is detected.' },
    { name: 'FOREGROUND_SERVICE', reason: 'Allows the app to detect shakes while in the background.' },
    { name: 'RECEIVE_BOOT_COMPLETED', reason: 'Restores shake detection automatically after a device reboot.' },
    { name: 'POST_NOTIFICATIONS', reason: 'Required on Android 13+ to show the mandatory service notification.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Permissions & Security Audit</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Commitment</Text>
        <Text style={styles.text}>• No Internet Access: The app cannot send or receive data.</Text>
        <Text style={styles.text}>• No Tracking: No analytics, telemetry, or user tracking code exists.</Text>
        <Text style={styles.text}>• No Data Collection: No user information is stored or collected.</Text>
        <Text style={styles.text}>• Offline First: Works 100% offline.</Text>
      </View>

      <Text style={styles.sectionTitle}>Permissions Justification</Text>
      {permissions.map((p, i) => (
        <View key={i} style={styles.permissionItem}>
          <Text style={styles.pName}>{p.name}</Text>
          <Text style={styles.pReason}>{p.reason}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Security Review: PASSED</Text>
        <Text style={styles.footerText}>Version: 1.0.0 (Production Build)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 25, padding: 15, backgroundColor: '#f0f4f8', borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  text: { fontSize: 14, color: '#555', marginBottom: 5 },
  permissionItem: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  pName: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  pReason: { fontSize: 14, color: '#666', marginTop: 2 },
  footer: { marginTop: 20, padding: 20, alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12 }
});

export default AuditScreen;
