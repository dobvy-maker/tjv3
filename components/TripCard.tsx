import { theme } from '@/constants/theme';
import { ratingToStars } from '@/utils/tripUtils';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TripCardProps = {
  title: string;
  rating: number;
  date: string;
  notes?: string;
  onPress: () => void;
};

export default function TripCard({ title, rating, date, notes, onPress }: TripCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.rating}>{ratingToStars(rating)}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
      {!!notes && <Text numberOfLines={2} style={styles.notes}>{notes}</Text>}
      <Text style={styles.link}>View details →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, padding: 18, borderRadius: theme.radius.md, marginBottom: 14, borderWidth: 1, borderColor: '#EAECF0' },
  pressed: { opacity: 0.72 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: theme.colors.text },
  rating: { fontSize: 14 },
  date: { color: theme.colors.muted, marginTop: 6 },
  notes: { color: theme.colors.text, marginTop: 10, lineHeight: 20 },
  link: { color: theme.colors.primary, fontWeight: '600', marginTop: 12 },
});
