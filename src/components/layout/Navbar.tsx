import React from 'react';
import { Link } from 'react-router-dom';
import { Film, User, Search } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between mx-4 my-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter uppercase italic">
                <Film className="text-[var(--primary)]" size={28} />
                <span>CINE<span className="text-[var(--primary)]">SCALE</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] italic">
                <Link to="/" className="hover:text-[var(--primary)] transition-all">Now Showing</Link>
                <Link to="/profile" className="hover:text-[var(--primary)] transition-all">My Tickets</Link>
                <span className="text-gray-600 px-3 py-1 border border-white/5 rounded-full">Chennai • PVR</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Search size={20} />
                </button>
                <Link to="/profile" className="p-2 bg-[var(--primary)] text-black rounded-full shadow-[0_0_15px_rgba(245,197,24,0.3)] hover:scale-110 transition-transform">
                    <User size={20} />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
