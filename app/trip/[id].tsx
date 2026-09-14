import { theme } from '@/constants/theme';
import { ratingToStars } from '@/utils/tripUtils';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTrips } from '../context/TripsContext';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTrip, deleteTrip } = useTrips();
  const trip = getTrip(id);

  if (!trip) {
    return <View style={styles.center}><Text style={styles.title}>Trip not found</Text><Pressable onPress={() => router.back()}><Text style={styles.link}>Go back</Text></Pressable></View>;
  }

  const confirmDelete = () => {
    Alert.alert('Delete trip?', `Remove ${trip.title} from your journal?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteTrip(trip.id); await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); router.back(); } },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>TRIP DETAILS</Text>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.stars}>{ratingToStars(trip.rating)}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Date</Text><Text style={styles.value}>{trip.date}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Rating</Text><Text style={styles.value}>{trip.rating} / 5</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Notes</Text><Text style={styles.value}>{trip.notes || 'No notes added.'}</Text>
      </View>

      <Pressable onPress={() => router.push(`/edit-trip/${trip.id}`)} style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
        <Text style={styles.editText}>Edit Trip</Text>
      </Pressable>

      <Pressable onPress={confirmDelete} style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}><Text style={styles.deleteText}>Delete Trip</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: 20, paddingTop: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 34, fontWeight: '800', color: theme.colors.text, marginTop: 6 },
  stars: { fontSize: 20, marginTop: 10, marginBottom: 24 },
  card: { backgroundColor: 'white', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#EAECF0' },
  label: { color: theme.colors.muted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: theme.colors.text, fontSize: 17, marginTop: 5, lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#EAECF0', marginVertical: 18 },
  editButton: { marginTop: 24, backgroundColor: theme.colors.primary, padding: 15, borderRadius: 14, alignItems: 'center' },
  editText: { color: 'white', fontWeight: '700' },
  deleteButton: { marginTop: 12, borderWidth: 1, borderColor: theme.colors.danger, padding: 15, borderRadius: 14, alignItems: 'center' },
  deleteText: { color: theme.colors.danger, fontWeight: '700' },
  link: { color: theme.colors.primary, marginTop: 16 },
  pressed: { opacity: 0.7 },
});
