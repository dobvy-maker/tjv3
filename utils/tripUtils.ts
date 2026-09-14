export function isValidDate(value: string) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value.trim());
}

export function isValidRating(value: string) {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function ratingToStars(rating: number) {
  const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
  return '⭐'.repeat(safeRating);
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}
