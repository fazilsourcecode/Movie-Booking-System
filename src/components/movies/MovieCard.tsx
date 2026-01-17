import React from 'react';
import { Star, Clock, Zap } from 'lucide-react';
import type { Movie } from '../../features/movies/movieSlice';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div
            className="group relative bg-[#151515] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
            onClick={() => navigate(`/movie/${movie.id}`)}
        >
            <div className="aspect-[2/3] overflow-hidden relative">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-90" />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
                    <Star className="text-[var(--primary)] fill-[var(--primary)]" size={14} />
                    <span className="text-sm font-black tabular-nums italic text-[var(--primary)]">{movie.rating}</span>
                </div>

                {/* Action Button Over Poster */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-[var(--primary)] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,197,24,0.5)] scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Zap size={24} fill="currentColor" strokeWidth={3} />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 border border-white/5 px-2 py-0.5 rounded-full">BLOCKBUSTER</span>
                </div>
                <h3 className="text-2xl font-black leading-[1.1] mb-4 uppercase italic tracking-tighter group-hover:text-[var(--primary)] transition-colors line-clamp-2">{movie.title}</h3>
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest italic">
                    <div className="flex items-center gap-2">
                        <Clock size={12} className="text-[var(--primary)]" />
                        {movie.duration}
                    </div>
                    <div className="text-[var(--primary)]">₹190 +</div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
