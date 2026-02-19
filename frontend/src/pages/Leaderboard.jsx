import { useQuery } from '@tanstack/react-query';
import { achievementService } from '../services/achievement.service';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, User, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => achievementService.getLeaderboard(100),
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  const leaderboard = data?.data?.leaderboard || [];
  const userRank = leaderboard.find((entry) => entry.id === user?.id);

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-cod-gold" />;
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-300" />;
    if (rank === 3) return <Award className="h-8 w-8 text-orange-400" />;
    return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cod-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-cod-orange mb-2">
          🏆 Classement ELO
        </h1>
        <p className="text-gray-400 text-lg">Les meilleurs joueurs de la communauté</p>
      </motion.div>

      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-cod-orange/20 to-cod-gold/20 border-2 border-cod-orange"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getMedalIcon(userRank.rank)}
              <div>
                <p className="text-sm text-gray-400">Votre Classement</p>
                <p className="text-2xl font-bold font-orbitron text-cod-orange">
                  Rang #{userRank.rank}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">ELO</p>
              <p className="text-3xl font-bold text-white">{userRank.elo_rating}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card ${
              index === 0
                ? 'bg-gradient-to-br from-cod-gold/30 to-cod-orange/30 border-cod-gold'
                : index === 1
                ? 'bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-300'
                : 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-400'
            } relative overflow-hidden`}
            style={{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }}
          >
            <div className="text-center">
              <div className="mb-4">{getMedalIcon(index + 1)}</div>
              
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cod-darkGray flex items-center justify-center border-4 border-cod-orange">
                {player.avatar_url ? (
                  <img
                    src={player.avatar_url}
                    alt={player.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-cod-orange" />
                )}
              </div>

              <h3 className="text-xl font-bold font-orbitron mb-1">{player.username}</h3>
              {player.codm_username && (
                <p className="text-sm text-gray-400 mb-3">@{player.codm_username}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">ELO</span>
                  <span className="font-bold text-cod-orange text-lg">{player.elo_rating}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Winrate</span>
                  <span className="font-bold">{player.winrate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Victoires</span>
                  <span className="font-bold">{player.matches_won}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rest of Leaderboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-bold font-orbitron mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-cod-orange" />
          Classement Complet
        </h2>

        <div className="space-y-2">
          {leaderboard.slice(3).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                player.id === user?.id
                  ? 'bg-cod-orange/20 border border-cod-orange'
                  : 'bg-cod-darkGray/50 hover:bg-cod-darkGray'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-xl font-bold text-gray-400 w-12">#{player.rank}</span>
                
                <div className="w-12 h-12 rounded-full bg-cod-dark flex items-center justify-center border-2 border-cod-orange/30">
                  {player.avatar_url ? (
                    <img
                      src={player.avatar_url}
                      alt={player.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-cod-orange" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-bold">{player.username}</p>
                  {player.codm_username && (
                    <p className="text-sm text-gray-400">@{player.codm_username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">ELO</p>
                  <p className="text-lg font-bold text-cod-orange">{player.elo_rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Winrate</p>
                  <p className="text-lg font-bold">{player.winrate}%</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-xs text-gray-400">Victoires</p>
                  <p className="text-lg font-bold">{player.matches_won}/{player.matches_played}</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-xs text-gray-400">Tournois</p>
                  <p className="text-lg font-bold">🏆 {player.tournaments_won}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
