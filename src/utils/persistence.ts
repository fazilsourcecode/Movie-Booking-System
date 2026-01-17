import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

const DATABASE_NAME = 'cinescale_db';
const STORE_NAME = 'booking_state';

export interface PersistedState {
    showId: string;
    selectedSeats: string[];
    lastUpdated: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB(DATABASE_NAME, 1, {
            upgrade(db) {
                db.createObjectStore(STORE_NAME);
            },
        });
    }
    return dbPromise;
};

export const saveBookingState = async (state: PersistedState) => {
    const db = await getDB();
    await db.put(STORE_NAME, state, 'current_booking');
};

export const loadBookingState = async (): Promise<PersistedState | null> => {
    const db = await getDB();
    return db.get(STORE_NAME, 'current_booking');
};

export const clearBookingState = async () => {
    const db = await getDB();
    await db.delete(STORE_NAME, 'current_booking');
};
