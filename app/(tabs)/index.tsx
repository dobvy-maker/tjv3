import TripCard from '@/components/TripCard';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTrips } from '../context/TripsContext';

export default function HomeScreen() {
  const { trips, isLoading, storageError } = useTrips();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR MEMORIES</Text>
          <Text style={styles.title}>Travel Journal</Text>
          <Text style={styles.subtitle}>{trips.length} trips saved</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={() => router.push('/add-trip')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {storageError && <Text style={styles.error}>{storageError}</Text>}

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" /><Text style={styles.loading}>Loading trips…</Text></View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TripCard
              title={item.title}
              rating={item.rating}
              date={item.date}
              notes={item.notes}
              onPress={() => router.push(`/trip/${item.id}`)}
            />
          )}
          ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyTitle}>No trips yet</Text><Text style={styles.loading}>Add your first travel memory.</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20, paddingTop: 58 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 },
  eyebrow: { fontSize: 12, fontWeight: '700', color: theme.colors.primary, letterSpacing: 1.2 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.text, marginTop: 4 },
  subtitle: { color: theme.colors.muted, marginTop: 4 },
  addButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  addButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  pressed: { opacity: 0.75 },
  list: { paddingBottom: 30 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loading: { color: theme.colors.muted, marginTop: 10 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  error: { color: theme.colors.danger, marginBottom: 12 },
});
