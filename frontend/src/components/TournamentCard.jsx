import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, MapPin, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TournamentCard({ tournament, index, onRegister, onDelete, canDelete, isRegistering }) {
  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { label: 'À venir', class: 'bg-blue-500/20 text-blue-400 border-blue-500/50', emoji: '📅' },
      ongoing: { label: 'EN COURS', class: 'bg-cod-orange/20 text-cod-orange border-cod-orange/50 animate-pulse', emoji: '🔴' },
      completed: { label: 'Terminé', class: 'bg-gray-500/20 text-gray-400 border-gray-500/50', emoji: '✅' },
      cancelled: { label: 'Annulé', class: 'bg-red-500/20 text-red-400 border-red-500/50', emoji: '❌' },
    };
    return badges[status] || badges.upcoming;
  };

  const statusBadge = getStatusBadge(tournament.status);
  const registrationProgress = (tournament.registered_count / tournament.max_participants) * 100;
  const isFull = tournament.registered_count >= tournament.max_participants;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card hover:border-cod-orange/50 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGNkIwMCIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Delete Button for Admins/Organizers */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(tournament.id, tournament.name);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
          title="Supprimer le tournoi"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </button>
      )}

      <div className="relative">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.class}`}>
            <span>{statusBadge.emoji}</span>
            {statusBadge.label}
          </span>
          {tournament.status === 'ongoing' && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-cod-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cod-orange"></span>
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/tournaments/${tournament.id}`}>
          <h3 className="text-2xl font-bold font-orbitron text-white mb-2 group-hover:text-cod-orange transition-colors">
            {tournament.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-400 mb-4 line-clamp-2">{tournament.description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 bg-cod-dark/50 rounded-lg">
            <Trophy className="h-4 w-4 text-cod-orange flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Mode</p>
              <p className="text-sm font-bold truncate">{tournament.game_mode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-cod-dark/50 rounded-lg">
            <Calendar className="h-4 w-4 text-cod-gold flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Date</p>
              <p className="text-sm font-bold truncate">
                {format(new Date(tournament.start_date), 'dd/MM/yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Participants
            </span>
            <span className={`font-bold ${isFull ? 'text-red-400' : 'text-cod-orange'}`}>
              {tournament.registered_count} / {tournament.max_participants}
            </span>
          </div>
          <div className="w-full h-2 bg-cod-dark rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFull
                  ? 'bg-red-500'
                  : registrationProgress > 80
                  ? 'bg-cod-yellow'
                  : 'bg-gradient-to-r from-cod-orange to-cod-gold'
              }`}
              style={{ width: `${Math.min(registrationProgress, 100)}%` }}
            />
          </div>
          {isFull && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Tournoi complet
            </p>
          )}
        </div>

        {/* Action Button */}
        {tournament.status === 'upcoming' && (
          <button
            onClick={() => onRegister(tournament.id)}
            disabled={isRegistering || isFull}
            className={`btn-primary w-full ${
              isFull ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRegistering ? 'Inscription...' : isFull ? 'Complet' : 'S\'inscrire'}
          </button>
        )}

        {tournament.status === 'ongoing' && (
          <Link
            to={`/tournaments/${tournament.id}`}
            className="btn-primary w-full text-center block"
          >
            Voir le Bracket →
          </Link>
        )}

        {tournament.status === 'completed' && (
          <Link
            to={`/tournaments/${tournament.id}`}
            className="btn-secondary w-full text-center block"
          >
            Voir les Résultats
          </Link>
        )}
      </div>
    </motion.div>
  );
}
