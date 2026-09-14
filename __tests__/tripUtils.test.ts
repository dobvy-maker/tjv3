import { isValidDate, isValidRating, normalizeText, ratingToStars } from '../utils/tripUtils';

describe('trip utilities', () => {
  test('accepts a date in DD.MM.YYYY format', () => expect(isValidDate('08.09.2026')).toBe(true));
  test('rejects a date with slashes', () => expect(isValidDate('08/09/2026')).toBe(false));
  test('accepts minimum rating 1', () => expect(isValidRating('1')).toBe(true));
  test('accepts maximum rating 5', () => expect(isValidRating('5')).toBe(true));
  test('rejects rating above 5', () => expect(isValidRating('6')).toBe(false));
  test('rejects decimal rating', () => expect(isValidRating('4.5')).toBe(false));
  test('renders the correct number of stars', () => expect(ratingToStars(4)).toBe('⭐⭐⭐⭐'));
  test('clamps star rating to five', () => expect(ratingToStars(10)).toBe('⭐⭐⭐⭐⭐'));
  test('trims text', () => expect(normalizeText('  Paris  ')).toBe('Paris'));
  test('collapses repeated spaces', () => expect(normalizeText('New   York')).toBe('New York'));
});
