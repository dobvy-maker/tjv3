import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Trip = {
  id: string;
  title: string;
  rating: number;
  date: string;
  notes: string;
};

type NewTrip = Omit<Trip, 'id'>;

type TripsContextType = {
  trips: Trip[];
  isLoading: boolean;
  storageError: string | null;
  addTrip: (trip: NewTrip) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTrip: (id: string) => Trip | undefined;
};

const STORAGE_KEY = '@travel_journal_trips';

const initialTrips: Trip[] = [
  { id: '1', title: 'Paris', rating: 5, date: '12.03.2026', notes: 'Weekend near the Seine and the Louvre.' },
  { id: '2', title: 'Rome', rating: 4, date: '01.05.2026', notes: 'Historic centre, pasta and the Colosseum.' },
  { id: '3', title: 'Tokyo', rating: 5, date: '20.08.2026', notes: 'Shibuya, local food and city views.' },
];

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const savedTrips = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTrips) setTrips(JSON.parse(savedTrips));
      } catch {
        setStorageError('Could not load saved trips.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, []);

  const saveTrips = async (nextTrips: Trip[]) => {
    setTrips(nextTrips);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTrips));
      setStorageError(null);
    } catch {
      setStorageError('Could not save changes on this device.');
    }
  };

  const addTrip = async (trip: NewTrip) => {
    const newTrip: Trip = { ...trip, id: Date.now().toString() };
    await saveTrips([...trips, newTrip]);
  };

  const deleteTrip = async (id: string) => {
    await saveTrips(trips.filter((trip) => trip.id !== id));
  };

  const getTrip = (id: string) => trips.find((trip) => trip.id === id);

  return (
    <TripsContext.Provider value={{ trips, isLoading, storageError, addTrip, deleteTrip, getTrip }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) throw new Error('useTrips must be used inside TripsProvider');
  return context;
}
