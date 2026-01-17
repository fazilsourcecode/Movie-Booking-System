import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { Loader2 } from 'lucide-react';

const MovieListing = lazy(() => import('./pages/MovieListing'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyBookings = lazy(() => import('./pages/MyBookings'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-dark)]">
    <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<MovieListing />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/booking/:showId" element={<BookingPage />} />
              <Route path="/profile" element={<MyBookings />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="mt-20 py-10 px-6 border-t border-white/5 text-center text-gray-500 text-xs uppercase tracking-[0.2em]">
          &copy; 2024 CineScale India - The Premium Experience.
        </footer>
      </div>
    </Router>
  );
}

export default App;
