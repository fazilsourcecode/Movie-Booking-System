import type { Movie, Show } from '../features/movies/movieSlice';
import type { Seat } from '../features/booking/bookingSlice';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMovies = async (): Promise<Movie[]> => {
    await delay(800);
    return [
        {
            id: '1',
            title: 'Leo',
            poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400',
            rating: 8.5,
            duration: '2h 44m',
            genre: ['Action', 'Thriller'],
            description: 'A mild-mannered cafe owner becomes a local hero through an act of violence, but his past comes back to haunt him.'
        },
        {
            id: '2',
            title: 'KGF: Chapter 2',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
            rating: 8.9,
            duration: '2h 48m',
            genre: ['Action', 'Drama'],
            description: 'The blood-soaked land of Kolar Gold Fields has a new overlord now - Rocky, whose name strikes fear in the heart of his foes.'
        },
        {
            id: '3',
            title: 'RRR',
            poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400',
            rating: 8.8,
            duration: '3h 07m',
            genre: ['Action', 'Drama', 'Epic'],
            description: 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.'
        },
        {
            id: '4',
            title: 'Jailer',
            poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400',
            rating: 8.2,
            duration: '2h 48m',
            genre: ['Action', 'Crime'],
            description: 'A retired jailer goes on a hunt to find his son\'s killers and protect his family.'
        }
    ];
};

export const fetchShows = async (movieId: string): Promise<Show[]> => {
    await delay(500);
    const dates = ['2023-12-01', '2023-12-02'];
    const times = ['10:15 AM', '2:30 PM', '6:45 PM', '10:00 PM'];

    return dates.flatMap(date =>
        times.map((time, idx) => ({
            id: `${movieId}-${date}-${idx}`,
            movieId,
            time,
            date,
            hall: `Screen ${idx + 1} - CineScale PVR`,
            price: 190 + idx * 40
        }))
    );
};

export const generateSeats = (rows: number, cols: number): Record<string, Seat> => {
    const seats: Record<string, Seat> = {};
    const rowLabels = 'ABCDEFGHIJ'.split('');

    for (let r = 0; r < rows; r++) {
        for (let c = 1; c <= cols; c++) {
            const id = `${rowLabels[r]}${c}`;
            seats[id] = {
                id,
                row: rowLabels[r],
                number: c,
                status: Math.random() > 0.85 ? 'booked' : 'available',
                price: r < 3 ? 250 : r < 7 ? 190 : 150
            };
        }
    }
    return seats;
};

export const simulateExternalActivity = (
    _showId: string,
    onSeatLock: (seatId: string) => void,
    onSeatRelease: (seatId: string) => void
) => {
    const interval = setInterval(() => {
        if (Math.random() > 0.7) {
            const row = 'ABCDEFGHIJ'[Math.floor(Math.random() * 10)];
            const col = Math.floor(Math.random() * 15) + 1;
            const seatId = `${row}${col}`;

            onSeatLock(seatId);
            setTimeout(() => onSeatRelease(seatId), 10000);
        }
    }, 5000);

    return () => clearInterval(interval);
};
