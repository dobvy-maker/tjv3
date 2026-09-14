import { theme } from '@/constants/theme';
import { isValidDate, normalizeText } from '@/utils/tripUtils';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTrips } from './context/TripsContext';

export default function AddTripScreen() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { addTrip } = useTrips();

  const handleSave = async () => {
    const cleanDestination = normalizeText(destination);
    const cleanDate = date.trim();

    if (!cleanDestination || !cleanDate) {
      setFormError('Destination and date are required.');
      return;
    }

    if (!isValidDate(cleanDate)) {
      setFormError('Use date format DD.MM.YYYY, for example 14.09.2026.');
      return;
    }

    setFormError(null);
    setIsSaving(true);

    try {
      await addTrip({
        title: cleanDestination,
        date: cleanDate,
        rating,
        notes: normalizeText(notes),
      });

      // Haptics is only feedback. A device/browser that does not support it
      // must never prevent the trip from being saved or the screen from closing.
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Ignore unsupported haptics (for example in some browsers).
      }

      router.back();
    } catch (error) {
      console.error('Add trip failed:', error);
      setFormError('The trip could not be saved. Please try again.');
      Alert.alert('Save failed', 'The trip could not be saved. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>New travel memory</Text>
        <Text style={styles.subtitle}>Add a destination, date, rating and optional notes.</Text>

        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Warsaw"
          value={destination}
          onChangeText={setDestination}
          maxLength={50}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="DD.MM.YYYY"
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={`${value} star rating`}
              onPress={() => setRating(value)}
              style={({ pressed }) => [styles.starButton, pressed && styles.pressed]}
            >
              <Text style={[styles.star, value > rating && styles.inactiveStar]}>★</Text>
            </Pressable>
          ))}
          <Text style={styles.ratingValue}>{rating}/5</Text>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="What do you want to remember?"
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={300}
          textAlignVertical="top"
        />
        <Text style={styles.counter}>{notes.length}/300</Text>

        {formError ? <Text style={styles.error}>{formError}</Text> : null}

        <Pressable
          disabled={isSaving}
          onPress={handleSave}
          style={({ pressed }) => [styles.button, (pressed || isSaving) && styles.pressed]}
        >
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
  counter: { textAlign: 'right', color: theme.colors.muted, marginBottom: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  starButton: { paddingVertical: 4, paddingRight: 5 },
  star: { fontSize: 30, color: '#F5A623' },
  inactiveStar: { color: '#D0D5DD' },
  ratingValue: { marginLeft: 8, color: theme.colors.muted, fontWeight: '700' },
  error: { color: theme.colors.danger, marginBottom: 14, lineHeight: 20 },
  button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
