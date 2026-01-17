import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SeatStatus = 'available' | 'selected' | 'locked' | 'booked';

export interface Seat {
    id: string;
    row: string;
    number: number;
    status: SeatStatus;
    lockedBy?: string | null;
    expiresAt?: number | null;
    price?: number;
}

export interface Booking {
    id: string;
    showId: string;
    movieTitle: string;
    showTime: string;
    seats: string[];
    totalPrice: number;
    bookingDate: string;
}

interface BookingState {
    seats: Record<string, Record<string, Seat>>; // showId -> seatId -> Seat
    currentSelection: string[]; // seatIds for the current active show
    activeShowId: string | null;
    queuePosition: number | null;
    isOffline: boolean;
    myBookings: Booking[];
}

const initialState: BookingState = {
    seats: {},
    currentSelection: [],
    activeShowId: null,
    queuePosition: null,
    isOffline: !navigator.onLine,
    myBookings: [],
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        initializeSeats: (state, action: PayloadAction<{ showId: string; seats: Record<string, Seat> }>) => {
            state.seats[action.payload.showId] = action.payload.seats;
        },
        toggleSeatSelection: (state, action: PayloadAction<{ showId: string; seatId: string }>) => {
            const { showId, seatId } = action.payload;
            const seat = state.seats[showId]?.[seatId];

            if (!seat || seat.status === 'booked' || seat.status === 'locked') return;

            if (seat.status === 'selected') {
                seat.status = 'available';
                state.currentSelection = state.currentSelection.filter(id => id !== seatId);
            } else {
                seat.status = 'selected';
                state.currentSelection.push(seatId);
            }
        },
        lockSeats: (state, action: PayloadAction<{ showId: string; seatIds: string[]; userId: string; expiresAt: number }>) => {
            const { showId, seatIds, userId, expiresAt } = action.payload;
            seatIds.forEach(id => {
                if (state.seats[showId]?.[id]) {
                    state.seats[showId][id].status = 'locked';
                    state.seats[showId][id].lockedBy = userId;
                    state.seats[showId][id].expiresAt = expiresAt;
                }
            });
        },
        confirmBooking: (state, action: PayloadAction<Booking>) => {
            const { showId, seats } = action.payload;
            seats.forEach(id => {
                if (state.seats[showId]?.[id]) {
                    state.seats[showId][id].status = 'booked';
                    state.seats[showId][id].lockedBy = null;
                    state.seats[showId][id].expiresAt = null;
                }
            });
            state.myBookings.unshift(action.payload);
            state.currentSelection = [];
        },
        setQueuePosition: (state, action: PayloadAction<number | null>) => {
            state.queuePosition = action.payload;
        },
        updateSeatStatusLocally: (state, action: PayloadAction<{ showId: string; seatId: string; status: SeatStatus }>) => {
            const { showId, seatId, status } = action.payload;
            if (state.seats[showId]?.[seatId]) {
                state.seats[showId][seatId].status = status;
            }
        }
    },
});

export const {
    initializeSeats,
    toggleSeatSelection,
    lockSeats,
    confirmBooking,
    setQueuePosition,
    updateSeatStatusLocally
} = bookingSlice.actions;
export default bookingSlice.reducer;
