import {
  appendTrip,
  findTripById,
  removeTripFromCollection,
  updateTripInCollection,
} from '../utils/tripCollection';
import type { Trip } from '../app/context/TripsContext';

const sampleTrips: Trip[] = [
  { id: '1', title: 'Paris', rating: 5, date: '12.03.2026', notes: 'Seine' },
  { id: '2', title: 'Rome', rating: 4, date: '01.05.2026', notes: 'Colosseum' },
];

describe('trip collection business logic', () => {
  test('adds a trip without mutating the original array', () => {
    const result = appendTrip(
      sampleTrips,
      { title: 'Berlin', rating: 4, date: '14.09.2026', notes: 'Museum Island' },
      '3',
    );

    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({
      id: '3',
      title: 'Berlin',
      rating: 4,
      date: '14.09.2026',
      notes: 'Museum Island',
    });
    expect(sampleTrips).toHaveLength(2);
  });

  test('updates only the trip with the requested id', () => {
    const result = updateTripInCollection(sampleTrips, '2', {
      title: 'Rome updated',
      rating: 5,
      date: '02.05.2026',
      notes: 'Vatican',
    });

    expect(result[0]).toEqual(sampleTrips[0]);
    expect(result[1].title).toBe('Rome updated');
    expect(result[1].rating).toBe(5);
  });

  test('keeps the array unchanged when update id does not exist', () => {
    const result = updateTripInCollection(sampleTrips, '999', {
      title: 'Unknown',
      rating: 1,
      date: '01.01.2026',
      notes: '',
    });

    expect(result).toEqual(sampleTrips);
  });

  test('deletes only the requested trip', () => {
    const result = removeTripFromCollection(sampleTrips, '1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('does not delete anything when id does not exist', () => {
    expect(removeTripFromCollection(sampleTrips, '999')).toEqual(sampleTrips);
  });

  test('finds a trip by id', () => {
    expect(findTripById(sampleTrips, '2')?.title).toBe('Rome');
  });

  test('returns undefined when a trip is not found', () => {
    expect(findTripById(sampleTrips, '999')).toBeUndefined();
  });
});
