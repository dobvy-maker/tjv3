import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

export type Trip = {
  id: string;
  title: string;
  rating: number;
  date: string;
  notes: string;
};

type NewTrip = Omit<Trip, 'id'>;
type TripChanges = Omit<Trip, 'id'>;

type TripsContextType = {
  trips: Trip[];
  isLoading: boolean;
  storageError: string | null;
  addTrip: (trip: NewTrip) => Promise<void>;
  updateTrip: (id: string, changes: TripChanges) => Promise<void>;
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
  const tripsRef = useRef<Trip[]>(initialTrips);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const savedTrips = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTrips) {
          const parsedTrips = JSON.parse(savedTrips) as Trip[];
          tripsRef.current = parsedTrips;
          setTrips(parsedTrips);
        }
        setStorageError(null);
      } catch {
        setStorageError('Could not load saved trips.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

  const saveTrips = async (nextTrips: Trip[]) => {
    // Keep the ref in sync so several quick operations always use the latest list.
    tripsRef.current = nextTrips;
    setTrips(nextTrips);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTrips));
      setStorageError(null);
    } catch (error) {
      console.error('Failed to save trips:', error);
      setStorageError('Could not save changes on this device.');
      throw error;
    }
  };

  const addTrip = async (trip: NewTrip) => {
    const newTrip: Trip = { ...trip, id: Date.now().toString() };
    await saveTrips([...tripsRef.current, newTrip]);
  };

  const updateTrip = async (id: string, changes: TripChanges) => {
    const nextTrips = tripsRef.current.map((trip) =>
      trip.id === id ? { ...trip, ...changes } : trip,
    );
    await saveTrips(nextTrips);
  };

  const deleteTrip = async (id: string) => {
    await saveTrips(tripsRef.current.filter((trip) => trip.id !== id));
  };

  const getTrip = (id: string) => trips.find((trip) => trip.id === id);

  return (
    <TripsContext.Provider
      value={{ trips, isLoading, storageError, addTrip, updateTrip, deleteTrip, getTrip }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) throw new Error('useTrips must be used inside TripsProvider');
  return context;
}
