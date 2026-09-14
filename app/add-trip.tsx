import { theme } from '@/constants/theme';
import { isValidDate, isValidRating, normalizeText } from '@/utils/tripUtils';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useTrips } from './context/TripsContext';

export default function AddTripScreen() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addTrip } = useTrips();

  const handleSave = async () => {
    if (!normalizeText(destination) || !date.trim() || !rating.trim()) {
      Alert.alert('Missing information', 'Destination, date and rating are required.');
      return;
    }
    if (!isValidDate(date)) {
      Alert.alert('Invalid date', 'Use the format DD.MM.YYYY, for example 08.09.2026.');
      return;
    }
    if (!isValidRating(rating)) {
      Alert.alert('Invalid rating', 'Rating must be a whole number from 1 to 5.');
      return;
    }

    try {
      setIsSaving(true);
      await addTrip({ title: normalizeText(destination), date: date.trim(), rating: Number(rating), notes: normalizeText(notes) });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Save failed', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>New travel memory</Text>
        <Text style={styles.subtitle}>Add the basic details now. You can keep your journal simple and useful.</Text>

        <Text style={styles.label}>Destination</Text>
        <TextInput style={styles.input} placeholder="e.g. Warsaw" value={destination} onChangeText={setDestination} maxLength={50} />

        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} placeholder="DD.MM.YYYY" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" maxLength={10} />

        <Text style={styles.label}>Rating (1–5)</Text>
        <TextInput style={styles.input} placeholder="5" value={rating} onChangeText={setRating} keyboardType="number-pad" maxLength={1} />

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.notes]} placeholder="What do you want to remember?" value={notes} onChangeText={setNotes} multiline maxLength={300} textAlignVertical="top" />
        <Text style={styles.counter}>{notes.length}/300</Text>

        <Pressable disabled={isSaving} onPress={handleSave} style={({ pressed }) => [styles.button, (pressed || isSaving) && styles.pressed]}>
          <Text style={styles.buttonText}>{isSaving ? 'Saving…' : 'Save Trip'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: 20, paddingTop: 34, backgroundColor: theme.colors.background },
  title: { fontSize: 30, fontWeight: '800', color: theme.colors.text },
  subtitle: { color: theme.colors.muted, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  label: { color: theme.colors.text, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16, color: theme.colors.text },
  notes: { minHeight: 110, marginBottom: 4 },
  counter: { textAlign: 'right', color: theme.colors.muted, marginBottom: 20 },
  button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
