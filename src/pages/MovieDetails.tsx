import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setShows, setLoading } from '../features/movies/movieSlice';
import { fetchShows } from '../api/mockApi';
import { Star, Clock, ChevronRight, Award, MapPin } from 'lucide-react';

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movies, shows } = useSelector((state: RootState) => state.movies);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const movie = movies.find(m => m.id === id);

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true));
            fetchShows(id).then(data => {
                dispatch(setShows(data));
                if (data.length > 0) setSelectedDate(data[0].date);
                dispatch(setLoading(false));
            });
        }
    }, [id, dispatch]);

    if (!movie) return <div className="p-20 text-center uppercase font-black">Movie not found</div>;

    const uniqueDates = Array.from(new Set(shows.map(s => s.date)));
    const filteredShows = shows.filter(s => s.date === selectedDate);

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative h-[75vh] w-full overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover blur-md scale-110 opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)]/80 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 px-8 pb-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end">
                    <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex-shrink-0 border-4 border-white/5 hidden md:block group">
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-[var(--primary)] text-black font-black text-[10px] rounded uppercase tracking-widest italic">PVR Premium</span>
                            <div className="flex items-center gap-1 text-[var(--primary)] font-black italic">
                                <Star size={16} fill="currentColor" />
                                <span>{movie.rating}</span>
                                <span className="text-gray-500 text-xs ml-1 not-italic font-bold">/ 10</span>
                            </div>
                        </div>
                        <h1 className="text-7xl font-black mb-6 tracking-tighter uppercase italic leading-[0.9]">{movie.title.split(':')[0]} <br /> <span className="text-[var(--primary)]">{movie.title.split(':')[1] || ''}</span></h1>

                        <div className="flex flex-wrap gap-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-8">
                            <span className="flex items-center gap-2 border-r border-white/10 pr-6"><Clock size={14} className="text-[var(--primary)]" /> {movie.duration}</span>
                            <span className="flex items-center gap-2 border-r border-white/10 pr-6"><Award size={14} className="text-[var(--primary)]" /> {movie.genre.join(', ')}</span>
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-[var(--primary)]" /> CineScale PVR, Chennai</span>
                        </div>

                        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed mb-10 italic">
                            {movie.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Showtimes Section */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-8">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Book <span className="text-[var(--primary)]">Tickets</span></h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {uniqueDates.map(date => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedDate === date
                                    ? 'bg-[var(--primary)] text-black shadow-[0_0_20px_rgba(245,197,24,0.4)]'
                                    : 'bg-white/5 border border-white/10 hover:border-[var(--primary)]/50'
                                    }`}
                            >
                                {new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredShows.map(show => (
                        <div
                            key={show.id}
                            onClick={() => navigate(`/booking/${show.id}`)}
                            className="glass p-8 group cursor-pointer hover:bg-[var(--primary)]/10 transition-all border-b-4 border-transparent hover:border-[var(--primary)] relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-3xl font-black group-hover:text-[var(--primary)] transition-colors italic tabular-nums">{show.time}</span>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] bg-white/5 px-2 py-1 rounded">Dolby 7.1</span>
                            </div>
                            <div className="space-y-1 mb-6">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{show.hall}</div>
                                <div className="text-[10px] font-bold text-[var(--success)] uppercase">Available</div>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <span className="text-sm font-black italic tracking-tighter">₹{show.price}</span>
                                <ChevronRight size={18} className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
