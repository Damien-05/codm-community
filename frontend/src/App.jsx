import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastProvider';
import ParticlesBackground from './components/ParticlesBackground';

// Lazy loading des pages pour optimiser le chargement initial
const Home = lazy(() => import('./pages/Home'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const TournamentDetail = lazy(() => import('./pages/TournamentDetail'));
const PrivateMatches = lazy(() => import('./pages/PrivateMatches'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Achievements = lazy(() => import('./pages/Achievements'));

// Composant de chargement
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cod-orange mb-4"></div>
      <p className="text-white text-xl font-orbitron">Chargement...</p>
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <ParticlesBackground />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="tournaments/:id" element={<TournamentDetail />} />
          <Route path="matches" element={<PrivateMatches />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="achievements" element={<Achievements />} />
          <Route 
            path="chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Route>
        </Routes>
      </Suspense>
    </ToastProvider>
  );
}

export default App;
