import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentService } from '../services/tournament.service';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Filter, Plus, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TournamentCard from '../components/TournamentCard';
import TournamentCardSkeleton from '../components/Skeletons';
import { toastSuccess, toastError, toastTournamentStart } from '../utils/toast.jsx';

export default function Tournaments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournaments', statusFilter],
    queryFn: () => tournamentService.getTournaments(statusFilter !== 'all' ? { status: statusFilter } : {}),
    staleTime: 30000, // Les données restent fraîches pendant 30 secondes
    cacheTime: 300000, // Cache pendant 5 minutes
    refetchOnWindowFocus: false, // Ne pas recharger automatiquement au focus
  });

  const registerMutation = useMutation({
    mutationFn: (id) => tournamentService.registerForTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tournaments']);
      toastSuccess('Inscription réussie au tournoi !');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur lors de l\'inscription');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => tournamentService.deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tournaments']);
      toastSuccess('Tournoi supprimé avec succès');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });

  const handleDeleteTournament = (tournamentId, tournamentName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le tournoi "${tournamentName}" ? Cette action est irréversible.`)) {
      deleteMutation.mutate(tournamentId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px]">
        <LoadingSpinner size="lg" text="Chargement des tournois..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorMessage 
          message={error.response?.data?.error || "Erreur lors du chargement des tournois. Veuillez vérifier que le serveur backend est démarré."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const tournaments = data?.data?.tournaments || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold font-orbitron text-cod-orange mb-2">Tournois</h1>
          <p className="text-gray-400">Participez aux tournois et montrez vos compétences</p>
        </div>
        {user?.role === 'organizer' || user?.role === 'admin' ? (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Créer un Tournoi
          </button>
        ) : null}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="h-5 w-5 text-cod-orange" />
          <div className="flex gap-2 flex-wrap">
            {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-cod-orange text-black'
                    : 'bg-cod-dark text-gray-300 hover:bg-cod-darkGray'
                }`}
              >
                {status === 'all' ? 'Tous' : status === 'upcoming' ? 'À venir' : status === 'ongoing' ? 'En cours' : 'Terminés'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 card"
        >
          <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucun tournoi disponible pour le moment</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              index={index}
              onRegister={(id) => registerMutation.mutate(id)}
              onDelete={handleDeleteTournament}
              canDelete={user?.role === 'admin' || user?.role === 'organizer'}
              isRegistering={registerMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <CreateTournamentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['tournaments']);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateTournamentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameMode: 'Battle Royale',
    maxParticipants: 100,
    startDate: '',
    endDate: '',
    rules: ['Pas de triche', 'Respect des adversaires', 'Suivre les instructions de l\'organisateur'],
  });

  const [newRule, setNewRule] = useState('');

  const createMutation = useMutation({
    mutationFn: (data) => tournamentService.createTournament(data),
    onSuccess: () => {
      alert('✅ Tournoi créé avec succès !');
      onSuccess();
    },
    onError: (error) => {
      alert(`❌ ${error.response?.data?.error || 'Erreur lors de la création'}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      rules: JSON.stringify(formData.rules),
    });
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData({ ...formData, rules: [...formData.rules, newRule.trim()] });
      setNewRule('');
    }
  };

  const removeRule = (index) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-orbitron text-cod-orange">Créer un Tournoi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom du tournoi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="Championnat d'Hiver 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full"
              placeholder="Décrivez votre tournoi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mode de jeu *</label>
              <select
                value={formData.gameMode}
                onChange={(e) => setFormData({ ...formData, gameMode: e.target.value })}
                className="input w-full"
              >
                <option>Battle Royale</option>
                <option>Team Deathmatch</option>
                <option>Domination</option>
                <option>Search & Destroy</option>
                <option>Hardpoint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Participants max *</label>
              <input
                type="number"
                required
                min="2"
                max="200"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début *</label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de fin *</label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Règles du tournoi</label>
            <div className="space-y-2 mb-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 bg-cod-dark p-2 rounded">
                  <span className="flex-1 text-sm">{index + 1}. {rule}</span>
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                className="input flex-1"
                placeholder="Ajouter une règle..."
              />
              <button
                type="button"
                onClick={addRule}
                className="btn-secondary"
              >
                Ajouter
              </button>
            </div>
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
              {createMutation.isPending ? 'Création...' : 'Créer le Tournoi'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
