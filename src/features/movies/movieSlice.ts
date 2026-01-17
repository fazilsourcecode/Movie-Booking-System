import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Movie {
    id: string;
    title: string;
    poster: string;
    rating: number;
    duration: string;
    genre: string[];
    description: string;
}

export interface Show {
    id: string;
    movieId: string;
    time: string;
    date: string;
    hall: string;
    price: number;
}

interface MovieState {
    movies: Movie[];
    shows: Show[];
    loading: boolean;
}

const initialState: MovieState = {
    movies: [],
    shows: [],
    loading: false,
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies: (state, action: PayloadAction<Movie[]>) => {
            state.movies = action.payload;
        },
        setShows: (state, action: PayloadAction<Show[]>) => {
            state.shows = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setMovies, setShows, setLoading } = movieSlice.actions;
export default movieSlice.reducer;
