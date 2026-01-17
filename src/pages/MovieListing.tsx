import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setMovies, setLoading } from '../features/movies/movieSlice';
import { fetchMovies } from '../api/mockApi';
import MovieCard from '../components/movies/MovieCard';
import { Loader2, Zap } from 'lucide-react';
import gsap from 'gsap';

const MovieListing: React.FC = () => {
    const dispatch = useDispatch();
    const { movies, loading } = useSelector((state: RootState) => state.movies);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            dispatch(setLoading(true));
            const movieData = await fetchMovies();
            dispatch(setMovies(movieData));
            dispatch(setLoading(false));
        };

        if (movies.length === 0) loadData();
    }, [dispatch, movies.length]);

    useEffect(() => {
        if (!loading && movies.length > 0) {
            gsap.fromTo('.movie-card',
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)' }
            );
        }
    }, [loading, movies]);

    const genres = ['All', ...Array.from(new Set(movies.flatMap(m => m.genre)))];

    const filteredMovies = filter === 'All'
        ? movies
        : movies.filter(m => m.genre.includes(filter));

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="animate-spin text-[var(--primary)]" size={64} strokeWidth={3} />
                    <Zap className="absolute inset-0 m-auto text-[var(--primary)] animate-pulse" size={24} />
                </div>
                <p className="text-gray-400 font-black tracking-[0.5em] uppercase italic text-sm">CineScale India</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 px-4 border-l-8 border-[var(--primary)] py-4">
                <div>
                    <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase italic leading-none">Now <span className="text-[var(--primary)]">Showing</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">CineScale PVR • Chennai • Premium Big Screens</p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {genres.map(g => (
                        <button
                            key={g}
                            onClick={() => setFilter(g)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${filter === g
                                    ? 'bg-[var(--primary)] text-black shadow-[0_0_20px_rgba(245,197,24,0.3)]'
                                    : 'bg-white/5 border border-white/10 hover:border-[var(--primary)]/50'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 px-4">
                {filteredMovies.map(movie => (
                    <div key={movie.id} className="movie-card opacity-0">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieListing;
