import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Ticket, Calendar, Clock, MapPin } from 'lucide-react';

const MyBookings: React.FC = () => {
    const { myBookings } = useSelector((state: RootState) => state.booking);

    if (myBookings.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <Ticket size={64} className="text-gray-600 mb-6 opacity-20" />
                <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
                <p className="text-gray-400">Your movie tickets will appear here once you book them.</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">My <span className="text-[var(--primary)]">Tickets</span></h1>

            <div className="space-y-6">
                {myBookings.map((booking) => (
                    <div key={booking.id} className="glass overflow-hidden flex flex-col md:flex-row relative">
                        {/* Left Ticket Stub Design */}
                        <div className="bg-[var(--primary)] text-black p-6 md:w-48 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-black uppercase mb-1">CineScale</span>
                            <span className="text-4xl font-black tabular-nums">{booking.seats.length}</span>
                            <span className="text-xs font-bold uppercase">Seats</span>
                            <div className="w-full border-t border-black/20 my-4" />
                            <div className="text-[10px] font-bold leading-tight">VALID ONLY ON<br />{booking.showTime}</div>
                        </div>

                        {/* Right Ticket Info */}
                        <div className="flex-grow p-6 relative">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-black uppercase text-[var(--primary)]">{booking.movieTitle}</h2>
                                <div className="flex items-center gap-1 text-[var(--primary)]">
                                    <span className="text-xs font-bold px-2 py-0.5 border border-[var(--primary)] rounded">PAID</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1"><Calendar size={10} /> Date</div>
                                    <div className="font-bold">{booking.showTime.split('|')[0]}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1"><Clock size={10} /> Time</div>
                                    <div className="font-bold">{booking.showTime.split('|')[1]}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1"><MapPin size={10} /> Cinema</div>
                                    <div className="font-bold truncate">CineScale PVR</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold">Seats</div>
                                    <div className="font-bold text-[var(--primary)]">{booking.seats.join(', ')}</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ORDER ID: {booking.id.split('-')[0]}</div>
                                <div className="text-lg font-black tracking-tighter">TOTAL: ₹{booking.totalPrice}</div>
                            </div>
                        </div>

                        {/* Simulated Perforation */}
                        <div className="absolute left-[192px] top-0 bottom-0 border-l border-dashed border-white/10 hidden md:block" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
