import React, { memo } from 'react';
import type { SeatStatus } from '../../features/booking/bookingSlice';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SeatProps {
    id: string;
    status: SeatStatus;
    onClick: (id: string) => void;
}

const Seat: React.FC<SeatProps> = memo(({ id, status, onClick }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'available':
                return 'bg-[#2a2a2a] hover:bg-gray-700 border-[#444] hover:border-[var(--primary)]';
            case 'selected':
                return 'bg-[var(--success)] border-[var(--success)] shadow-[0_0_15px_rgba(0,200,83,0.4)]';
            case 'booked':
                return 'bg-gray-800 border-transparent cursor-not-allowed opacity-30 text-transparent';
            case 'locked':
                return 'bg-orange-600 border-orange-600 animate-pulse';
            default:
                return 'bg-gray-800';
        }
    };

    return (
        <div
            onClick={() => status === 'available' || status === 'selected' ? onClick(id) : null}
            className={cn(
                "w-7 h-8 md:w-9 md:h-10 rounded-t-lg border-b-4 transition-all duration-300 cursor-pointer flex items-center justify-center text-[10px] md:text-[10px] font-black italic",
                getStatusStyles()
            )}
            title={id}
        >
            {status === 'locked' ? '⏳' : status === 'booked' ? '' : id.slice(1)}
        </div>
    );
});

Seat.displayName = 'Seat';

export default Seat;
