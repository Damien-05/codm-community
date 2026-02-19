import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentService } from '../services/tournament.service';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ArrowLeft, User, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { toastSuccess, toastError } from '../utils/toast.jsx';
import { toastSuccess, toastError } from '../utils/toast';

export default function TournamentDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentService.getTournamentById(id),
    staleTime: 30000,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
  });

  const registerMutation = useMutation({
    mutationFn: () => tournamentService.registerForTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament', id]);
      toastSuccess('Inscription réussie au tournoi !');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur lors de l\'inscription');
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: () => tournamentService.unregisterFromTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament', id]);
      toastSuccess('Désinscription réussie');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur lors de la désinscription');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px]">
        <LoadingSpinner size="lg" text="Chargement du tournoi..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorMessage 
          message={error.response?.data?.error || "Tournoi introuvable ou erreur de chargement"}
          onRetry={() => window.location.reload()}
        />
        <Link to="/tournaments" className="inline-flex items-center gap-2 text-cod-orange hover:text-cod-lightOrange mt-4">
          <ArrowLeft className="h-5 w-5" />
          Retour aux tournois
        </Link>
      </div>
    );
  }

  const tournament = data?.data?.tournament;
  const participants = data?.data?.participants || [];
  const rules = tournament?.rules ? JSON.parse(tournament.rules) : [];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-cod-orange transition-colors">
        <ArrowLeft className="h-5 w-5" />
        Retour aux tournois
      </Link>

      {/* Tournament Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-orbitron text-cod-orange mb-4">{tournament?.name}</h1>
            <p className="text-gray-300 mb-6">{tournament?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-cod-orange" />
                <div>
                  <p className="text-xs text-gray-400">Mode de jeu</p>
                  <p className="font-bold">{tournament?.game_mode}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-cod-orange" />
                <div>
                  <p className="text-xs text-gray-400">Participants</p>
                  <p className="font-bold">{participants.length} / {tournament?.max_participants}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-cod-orange" />
                <div>
                  <p className="text-xs text-gray-400">Date de début</p>
                  <p className="font-bold">{tournament?.start_date && format(new Date(tournament.start_date), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
                </div>
              </div>
            </div>
          </div>

          {isAuthenticated && tournament?.status === 'upcoming' && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {registerMutation.isPending ? 'En cours...' : 'S\'inscrire au Tournoi'}
              </button>
              <button
                onClick={() => unregisterMutation.mutate()}
                disabled={unregisterMutation.isPending}
                className="btn-secondary whitespace-nowrap text-sm"
              >
                Se désinscrire
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card"
        >
          <h2 className="text-2xl font-bold font-orbitron mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-cod-orange" />
            Participants ({participants.length})
          </h2>
          
          {participants.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucun participant pour le moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-cod-dark p-4 rounded-lg flex items-center gap-3">
                  <User className="h-10 w-10 text-cod-orange" />
                  <div>
                    <p className="font-bold">{participant.username}</p>
                    <p className="text-sm text-gray-400">COD: {participant.codm_username}</p>
                    <p className="text-xs text-cod-orange">Niveau {participant.level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-bold font-orbitron mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-cod-orange" />
            Règles
          </h2>
          
          {rules.length === 0 ? (
            <p className="text-gray-400">Aucune règle spécifiée</p>
          ) : (
            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cod-orange font-bold">{index + 1}.</span>
                  <span className="text-gray-300">{rule}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
