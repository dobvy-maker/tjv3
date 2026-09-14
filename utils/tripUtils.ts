export function isValidDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
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
