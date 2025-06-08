import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load routes for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 pt-16">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* Add more routes as needed */}
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;