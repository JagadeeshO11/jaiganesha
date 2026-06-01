import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About TorchCam</Text>
      <Text style={styles.version}>Version 1.0.0</Text>

      <Text style={styles.sectionTitle}>Privacy & Safety</Text>
      <Text style={styles.text}>
        TorchCam is an offline utility. It does not collect, store, or transmit any user data.
        It does not require internet access.
      </Text>

      <Text style={styles.sectionTitle}>Permissions Used</Text>
      <Text style={styles.text}>• Camera: To control the flashlight LED.</Text>
      <Text style={styles.text}>• Foreground Service: To detect shakes while minimized.</Text>
      <Text style={styles.text}>• Vibration: For tactile feedback.</Text>
      <Text style={styles.text}>• Notifications: To keep the service active and visible.</Text>

      <Text style={styles.sectionTitle}>Developer Info</Text>
      <Text style={styles.text}>Built for safety and utility on Android 13+.</Text>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 TorchCam Project</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  version: { fontSize: 14, color: '#999', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, color: '#444', lineHeight: 24 },
  footer: { marginTop: 40, paddingBottom: 20, alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12 }
});

export default AboutScreen;
