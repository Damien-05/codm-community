import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Gamepad2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    codmUsername: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors ? errors.join(', ') : err.response?.data?.error || 'Erreur d\'inscription'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Gamepad2 className="h-12 w-12 text-cod-orange" />
            <span className="text-3xl font-bold font-orbitron text-cod-orange">
              CODM <span className="text-cod-gold">Community</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-orbitron">Inscription</h2>
          <p className="text-gray-400 mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                  placeholder="votre@email.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pseudo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={20}
                  className="input w-full pl-10"
                  placeholder="VotrePseudo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pseudo COD Mobile</label>
              <div className="relative">
                <Gamepad2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="codmUsername"
                  value={formData.codmUsername}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={20}
                  className="input w-full pl-10"
                  placeholder="VotrePseudoCODM"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input w-full pl-10"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-cod-orange hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
