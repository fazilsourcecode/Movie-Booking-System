import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
    toggleSeatSelection,
    initializeSeats,
    updateSeatStatusLocally,
    confirmBooking
} from '../features/booking/bookingSlice';
import type { Seat as SeatType } from '../features/booking/bookingSlice';
import { generateSeats, simulateExternalActivity } from '../api/mockApi';
import Seat from '../components/booking/Seat';
import { Clock, ArrowLeft, CreditCard } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import gsap from 'gsap';

const BookingPage: React.FC = () => {
    const { showId } = useParams<{ showId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const bookingState = useSelector((state: RootState) => state.booking);
    const moviesState = useSelector((state: RootState) => state.movies);
    const { movies, shows } = moviesState;

    const [timeLeft, setTimeLeft] = useState(600);
    const currentShow = shows.find(s => s.id === showId);
    const movie = movies.find(m => m.id === currentShow?.movieId);

    const seats = useMemo((): Record<string, SeatType> => {
        return showId && bookingState.seats[showId] ? bookingState.seats[showId] : {};
    }, [showId, bookingState.seats]);

    const selectedSeats = bookingState.currentSelection;

    useEffect(() => {
        if (showId && !bookingState.seats[showId]) {
            const mockSeats = generateSeats(10, 15);
            dispatch(initializeSeats({ showId, seats: mockSeats }));
        }

        if (showId) {
            const stopSimulation = simulateExternalActivity(
                showId,
                (id) => dispatch(updateSeatStatusLocally({ showId, seatId: id, status: 'locked' })),
                (id) => dispatch(updateSeatStatusLocally({ showId, seatId: id, status: 'available' }))
            );
            return () => stopSimulation();
        }
    }, [showId, dispatch, bookingState.seats]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSeatClick = useCallback((id: string) => {
        if (showId) {
            dispatch(toggleSeatSelection({ showId, seatId: id }));
            gsap.to(`#seat-${id}`, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
        }
    }, [dispatch, showId]);

    const handleConfirm = () => {
        if (!showId || !currentShow || !movie) return;

        const totalPrice = selectedSeats.reduce((acc: number, id: string) => acc + (seats[id]?.price || 190), 0);

        dispatch(confirmBooking({
            id: uuidv4(),
            showId,
            movieTitle: movie.title,
            showTime: `${currentShow.date} | ${currentShow.time}`,
            seats: selectedSeats,
            totalPrice,
            bookingDate: new Date().toISOString()
        }));

        alert(`Success! Tickets booked for ${movie.title}. Redirecting to your tickets...`);
        navigate('/profile');
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const rs = s % 60;
        return `${m}:${rs.toString().padStart(2, '0')}`;
    };

    const rows = 'ABCDEFGHIJ'.split('');
    const cols = Array.from({ length: 15 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-[var(--bg-dark)] px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter">{movie?.title || 'Select Seats'}</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{currentShow?.hall} | Chennai</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="glass px-4 py-2 flex items-center gap-2">
                        <Clock size={16} className="text-[var(--primary)]" />
                        <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                <div className="md:col-span-2">
                    <div className="relative w-full h-8 bg-gradient-to-b from-[var(--primary)]/30 to-transparent rounded-t-[100%] mb-16">
                        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase tracking-widest font-black">All eyes this way</p>
                    </div>

                    <div className="flex flex-col gap-3 items-center overflow-x-auto pb-8">
                        {rows.map(row => (
                            <div key={row} className="flex gap-3 items-center">
                                <span className="w-6 text-[10px] text-gray-500 font-black">{row}</span>
                                {cols.map(col => {
                                    const id = `${row}${col}`;
                                    const seat = seats[id];
                                    return (
                                        <div key={id} id={`seat-${id}`}>
                                            <Seat
                                                id={id}
                                                status={seat?.status || 'available'}
                                                onClick={handleSeatClick}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-8 mt-8 p-6 glass">
                        {['available', 'selected', 'booked', 'locked'].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-sm ${s === 'available' ? 'bg-[#333]' : s === 'selected' ? 'bg-[var(--success)]' : s === 'booked' ? 'bg-red-900 opacity-50' : 'bg-orange-600'
                                    }`} />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-8 sticky top-24 border-t-4 border-[var(--primary)]">
                        <h2 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Bill <span className="text-[var(--primary)]">Details</span></h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 uppercase font-bold tracking-widest text-[10px]">Seats ({selectedSeats.length})</span>
                                <span className="font-black text-[var(--primary)]">{selectedSeats.join(', ') || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 uppercase font-bold tracking-widest text-[10px]">Ticket Price</span>
                                <span className="font-black">₹{selectedSeats.reduce((acc: number, id: string) => acc + (seats[id]?.price || 190), 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 uppercase font-bold tracking-widest text-[10px]">Convenience Fee</span>
                                <span className="font-black">₹{selectedSeats.length > 0 ? 35 : 0}</span>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                                <span className="text-gray-500 uppercase font-bold text-[10px]">Grand Total</span>
                                <span className="text-3xl font-black tracking-tighter text-[var(--primary)]">₹{selectedSeats.reduce((acc: number, id: string) => acc + (seats[id]?.price || 190), 0) + (selectedSeats.length > 0 ? 35 : 0)}</span>
                            </div>
                        </div>

                        <button
                            className="btn-premium w-full flex items-center justify-center gap-2 py-4"
                            disabled={selectedSeats.length === 0}
                            onClick={handleConfirm}
                        >
                            <CreditCard size={20} />
                            Book Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
