import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService } from '../services/tournament.service';
import { motion } from 'framer-motion';
import { Gamepad2, Users, MapPin, Plus, Lock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { toastSuccess, toastError, toastMatchFound } from '../utils/toast.jsx';

export default function PrivateMatches() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['matches'],
    queryFn: () => matchService.getMatches({ status: 'open' }),
    staleTime: 20000, // Les données restent fraîches pendant 20 secondes
    cacheTime: 300000, // Cache pendant 5 minutes
    refetchInterval: 30000, // Rafraîchir automatiquement toutes les 30 secondes
    refetchOnWindowFocus: true, // Recharger au focus pour voir les nouvelles parties
  });

  const joinMutation = useMutation({
    mutationFn: ({ id, password }) => matchService.joinMatch(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries(['matches']);
      toastMatchFound();
      setSelectedMatch(null);
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Impossible de rejoindre la partie');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (id) => matchService.leaveMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['matches']);
      toastSuccess('Vous avez quitté la partie');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur');
    },
  });

  const matches = data?.data?.matches || [];

  const handleJoinMatch = (match) => {
    if (match.password) {
      const password = prompt('Cette partie est protégée. Entrez le mot de passe :');
      if (!password) return;
      joinMutation.mutate({ id: match.id, password });
    } else {
      joinMutation.mutate({ id: match.id, password: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px]">
        <LoadingSpinner size="lg" text="Chargement des parties..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold font-orbitron text-cod-orange mb-2">Parties Privées</h1>
          <p className="text-gray-400">Rejoignez ou créez vos propres parties</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Créer une Partie
          </button>
        )}
      </motion.div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 card"
        >
          <Gamepad2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucune partie disponible</p>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Créer la première partie
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:border-cod-orange/50 transition-all duration-300 group"
            >
              {/* Header avec badge password */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold font-orbitron group-hover:text-cod-orange transition-colors">
                  {match.name}
                </h3>
                {match.password && (
                  <Lock className="h-5 w-5 text-cod-yellow" title="Partie protégée" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Gamepad2 className="h-4 w-4 text-cod-orange" />
                  <span>{match.game_mode}</span>
                </div>
                {match.map && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-cod-orange" />
                    <span>{match.map}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="h-4 w-4 text-cod-orange" />
                  <span>{match.participants_count || 0} / {match.max_players} joueurs</span>
                </div>
                <div className="text-xs text-gray-400">
                  Hôte: {match.host_username}
                </div>
              </div>

              {/* Actions */}
              {isAuthenticated && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinMatch(match)}
                    disabled={joinMutation.isPending}
                    className="btn-primary flex-1 text-sm disabled:opacity-50"
                  >
                    {joinMutation.isPending ? 'En cours...' : 'Rejoindre'}
                  </button>
                  <button
                    onClick={() => leaveMutation.mutate(match.id)}
                    disabled={leaveMutation.isPending}
                    className="btn-secondary text-sm"
                  >
                    Quitter
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Match Modal */}
      {showCreateModal && (
        <CreateMatchModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['matches']);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateMatchModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    gameMode: 'Team Deathmatch',
    map: '',
    maxPlayers: 10,
    password: '',
    rules: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => matchService.createMatch(data),
    onSuccess: () => {
      alert('✅ Partie créée avec succès !');
      onSuccess();
    },
    onError: (error) => {
      alert(`❌ ${error.response?.data?.error || 'Erreur lors de la création'}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-orbitron text-cod-orange">Créer une Partie</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de la partie</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="Ma partie COD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mode de jeu</label>
            <select
              value={formData.gameMode}
              onChange={(e) => setFormData({ ...formData, gameMode: e.target.value })}
              className="input w-full"
            >
              <option>Team Deathmatch</option>
              <option>Domination</option>
              <option>Search & Destroy</option>
              <option>Battle Royale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Carte</label>
            <input
              type="text"
              value={formData.map}
              onChange={(e) => setFormData({ ...formData, map: e.target.value })}
              className="input w-full"
              placeholder="Nuketown, Crash..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nombre max de joueurs</label>
            <input
              type="number"
              required
              min="2"
              max="100"
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe (optionnel)</label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input w-full"
              placeholder="Laisser vide pour une partie ouverte"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Création...' : 'Créer la Partie'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
