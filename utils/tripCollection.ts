import type { Trip } from '@/app/context/TripsContext';

export type TripInput = Omit<Trip, 'id'>;

export function appendTrip(
  trips: Trip[],
  input: TripInput,
  id: string,
): Trip[] {
  return [...trips, { ...input, id }];
}

export function updateTripInCollection(
  trips: Trip[],
  id: string,
  changes: TripInput,
): Trip[] {
  return trips.map((trip) => (trip.id === id ? { ...trip, ...changes } : trip));
}

export function removeTripFromCollection(trips: Trip[], id: string): Trip[] {
  return trips.filter((trip) => trip.id !== id);
}

export function findTripById(trips: Trip[], id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}
