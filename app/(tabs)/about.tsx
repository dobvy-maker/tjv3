import { theme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ABOUT THE PROJECT</Text>
      <Text style={styles.title}>Travel Journal</Text>
      <Text style={styles.text}>A small React Native application for keeping travel memories on the device.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Built with</Text>
        <Text style={styles.text}>React Native · Expo · TypeScript · Expo Router · Context API · AsyncStorage</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key features</Text>
        <Text style={styles.text}>Persistent trips, input validation, trip details, delete confirmation, haptic feedback and responsive layouts.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 64, backgroundColor: theme.colors.background },
  eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.text, marginTop: 6, marginBottom: 10 },
  text: { color: theme.colors.muted, fontSize: 16, lineHeight: 23 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 18, marginTop: 18, borderWidth: 1, borderColor: '#EAECF0' },
  cardTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
