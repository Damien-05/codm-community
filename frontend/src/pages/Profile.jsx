import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { achievementService } from '../services/achievement.service';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Trophy, Gamepad2, Star, Edit2, Save, X, Award, TrendingUp, Target } from 'lucide-react';
import { toastSuccess, toastError } from '../utils/toast.jsx';
import { EloHistoryChart, WinRateChart } from '../components/StatsCharts';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    codmUsername: '',
  });
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
  });

  const { data: statsData } = useQuery({
    queryKey: ['user-stats', authUser?.id],
    queryFn: () => userService.getUserStats(authUser?.id),
    enabled: !!authUser?.id,
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['user-achievements', authUser?.id],
    queryFn: () => achievementService.getUserAchievements(authUser?.id),
    enabled: !!authUser?.id,
  });

  const { data: eloHistoryData } = useQuery({
    queryKey: ['elo-history', authUser?.id],
    queryFn: () => achievementService.getEloHistory(authUser?.id, 20),
    enabled: !!authUser?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditing(false);
      toastSuccess('Profil mis à jour avec succès !');
    },
    onError: (error) => {
      toastError(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });

  const user = profileData?.data?.user;
  const stats = statsData?.data?.stats;
  const achievements = achievementsData?.data?.achievements || [];
  const eloHistory = eloHistoryData?.data?.history || [];

  const handleEdit = () => {
    setFormData({
      username: user?.username || '',
      codmUsername: user?.codm_username || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ username: '', codmUsername: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
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
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold font-orbitron text-cod-orange">Mon Profil</h1>
        {!isEditing && (
          <button onClick={handleEdit} className="btn-primary flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Modifier
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 card"
        >
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-cod-orange/20 flex items-center justify-center border-4 border-cod-orange">
              <User className="h-16 w-16 text-cod-orange" />
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-left">Pseudo</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-left">Pseudo COD Mobile</label>
                  <input
                    type="text"
                    required
                    value={formData.codmUsername}
                    onChange={(e) => setFormData({ ...formData, codmUsername: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-orbitron text-cod-orange mb-2">
                  {user?.username}
                </h2>
                <p className="text-gray-400 mb-2">@{user?.codm_username}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-cod-gold/20 text-cod-gold border border-cod-gold/50 mb-4">
                  {user?.role === 'admin' ? '👑 Admin' : user?.role === 'organizer' ? '🏆 Organisateur' : '🎮 Joueur'}
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-cod-dark rounded-lg">
                    <span className="text-gray-400">Niveau</span>
                    <span className="text-cod-orange font-bold text-xl">{user?.level}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cod-dark rounded-lg">
                    <span className="text-gray-400">ELO Rating</span>
                    <span className="text-cod-gold font-bold text-xl">{user?.elo_rating || 1200}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cod-dark rounded-lg">
                    <span className="text-gray-400">Points Achievement</span>
                    <span className="text-gaming-accent font-bold">{user?.achievement_points || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cod-dark rounded-lg">
                    <span className="text-gray-400">Email</span>
                    <span className="text-gray-300 text-sm truncate ml-2">{user?.email}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-2xl font-bold font-orbitron text-white">Statistiques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tournaments Played */}
            <div className="card hover:border-cod-orange/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cod-orange/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-cod-orange" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tournois joués</p>
                  <p className="text-3xl font-bold text-white">{stats?.tournamentsPlayed || 0}</p>
                </div>
              </div>
            </div>

            {/* Tournaments Won */}
            <div className="card hover:border-cod-gold/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cod-gold/20 rounded-lg">
                  <Star className="h-8 w-8 text-cod-gold" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Victoires</p>
                  <p className="text-3xl font-bold text-white">{stats?.tournamentsWon || 0}</p>
                </div>
              </div>
            </div>

            {/* Matches Played */}
            <div className="card hover:border-cod-yellow/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cod-yellow/20 rounded-lg">
                  <Gamepad2 className="h-8 w-8 text-cod-yellow" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Parties jouées</p>
                  <p className="text-3xl font-bold text-white">{stats?.matchesPlayed || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="card">
            <h3 className="text-xl font-bold font-orbitron text-white mb-4">Taux de victoire</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tournois</span>
                  <span className="text-cod-orange font-bold">
                    {stats?.tournamentsPlayed > 0
                      ? `${Math.round((stats.tournamentsWon / stats.tournamentsPlayed) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full h-3 bg-cod-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cod-orange to-cod-gold transition-all duration-500"
                    style={{
                      width: `${
                        stats?.tournamentsPlayed > 0
                          ? (stats.tournamentsWon / stats.tournamentsPlayed) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-xl font-bold font-orbitron text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-cod-orange" />
              Progression ELO
            </h3>
            {eloHistory.length > 0 ? (
              <EloHistoryChart data={eloHistory} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p>Pas encore d'historique ELO</p>
              </div>
            )}
          </div>

          {/* Win Rate Pie Chart */}
          <div className="card">
            <h3 className="text-xl font-bold font-orbitron text-white mb-4">Répartition Victoires/Défaites</h3>
            {(user?.matches_won > 0 || user?.matches_played > 0) ? (
              <WinRateChart 
                wins={user?.matches_won || 0} 
                losses={(user?.matches_played || 0) - (user?.matches_won || 0)} 
              />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Gamepad2 className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p>Aucune partie jouée</p>
              </div>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-orbitron text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-cod-gold" />
                Badges Récents
              </h3>
              <Link to="/achievements" className="text-sm text-cod-orange hover:text-cod-lightOrange">
                Voir tous →
              </Link>
            </div>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 bg-gradient-to-br from-cod-orange/20 to-cod-gold/20 border-2 border-cod-orange rounded-lg text-center"
                  >
                    <div className="text-2xl mb-1">
                      {achievement.icon === 'Trophy' && '🏆'}
                      {achievement.icon === 'Star' && '⭐'}
                      {achievement.icon === 'Award' && '🏅'}
                      {achievement.icon === 'Medal' && '🥇'}
                      {achievement.icon === 'Crown' && '👑'}
                      {achievement.icon === 'Shield' && '🛡️'}
                      {achievement.icon === 'Sword' && '⚔️'}
                      {achievement.icon === 'Flame' && '🔥'}
                      {achievement.icon === 'Target' && '🎯'}
                      {!['Trophy', 'Star', 'Award', 'Medal', 'Crown', 'Shield', 'Sword', 'Flame', 'Target'].includes(achievement.icon) && '🏅'}
                    </div>
                    <p className="text-xs font-bold text-white">{achievement.name}</p>
                    <p className="text-xs text-cod-gold">+{achievement.points}pts</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Award className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p>Aucun badge débloqué</p>
                <Link to="/achievements" className="text-sm text-cod-orange hover:text-cod-lightOrange mt-2 inline-block">
                  Découvrir les badges
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
