import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Gamepad2, MessageCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', path: '/', icon: Gamepad2 },
    { name: 'Tournois', path: '/tournaments', icon: Trophy },
    { name: 'Parties Privées', path: '/matches', icon: Gamepad2 },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Classement', path: '/leaderboard', icon: Trophy },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      {/* Header */}
      <header className="bg-cod-darkGray border-b border-cod-orange/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-cod-orange" />
              <span className="text-2xl font-bold font-orbitron text-cod-orange">
                CODM <span className="text-cod-gold">Community</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-cod-orange text-black font-bold'
                        : 'text-gray-300 hover:text-cod-orange hover:bg-cod-dark/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-300 hover:text-cod-orange transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cod-darkGray border-t border-cod-orange/20">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-cod-orange text-black font-bold'
                        : 'text-gray-300 hover:bg-cod-dark/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="border-t border-cod-orange/20 pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cod-dark/50"
                    >
                      <User className="h-5 w-5" />
                      <span>{user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cod-dark/50 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary w-full text-center block"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-primary w-full text-center block"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-cod-darkGray border-t border-cod-orange/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p className="font-orbitron">
              &copy; 2025 <span className="text-cod-orange">CODM Community</span>
            </p>
            <p className="text-sm mt-2">Plateforme communautaire Call of Duty Mobile</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
