import { useQuery } from '@tanstack/react-query';
import { achievementService } from '../services/achievement.service';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Award, Star, Shield, Sword, Crown, Flame,
  Target, Zap, MessageCircle, UserPlus, TrendingUp, Lock
} from 'lucide-react';

const iconMap = {
  Trophy, Medal, Award, Star, Shield, Sword, Crown, Flame,
  Target, Zap, MessageCircle, UserPlus, TrendingUp
};

export default function Achievements() {
  const { user, isAuthenticated } = useAuth();

  const { data: allAchievementsData, isLoading } = useQuery({
    queryKey: ['all-achievements'],
    queryFn: achievementService.getAllAchievements,
    enabled: isAuthenticated,
  });

  const achievements = allAchievementsData?.data?.achievements || [];

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  const categoryNames = {
    tournament: '🏆 Tournois',
    match: '⚔️ Parties',
    social: '💬 Social',
    special: '⭐ Spéciaux',
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

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
          🏅 Badges & Achievements
        </h1>
        <p className="text-gray-400 text-lg">
          Débloquez des badges et gagnez des points en jouant
        </p>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card bg-gradient-to-r from-cod-orange/20 to-cod-gold/20 border-2 border-cod-orange"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Badges Débloqués</p>
            <p className="text-4xl font-bold font-orbitron text-cod-orange">
              {unlockedCount}/{achievements.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Points Totaux</p>
            <p className="text-4xl font-bold font-orbitron text-cod-gold">
              {totalPoints}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Progression</p>
            <div className="mt-2">
              <div className="w-full bg-cod-darkGray rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cod-orange to-cod-gold h-full transition-all duration-500"
                  style={{
                    width: `${(unlockedCount / achievements.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-2xl font-bold font-orbitron text-white mt-2">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements by Category */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements], catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="card"
        >
          <h2 className="text-2xl font-bold font-orbitron mb-6">
            {categoryNames[category] || category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAchievements.map((achievement, index) => {
              const IconComponent = iconMap[achievement.icon] || Award;
              const isUnlocked = achievement.unlocked;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-cod-orange/20 to-cod-gold/20 border-cod-orange hover:shadow-lg hover:shadow-cod-orange/50'
                      : 'bg-cod-darkGray/50 border-cod-darkGray hover:border-cod-orange/30 opacity-60'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                  )}

                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-cod-orange to-cod-gold'
                      : 'bg-cod-darkGray'
                  }`}>
                    <IconComponent className={`h-8 w-8 ${
                      isUnlocked ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>

                  <h3 className={`text-lg font-bold font-orbitron text-center mb-2 ${
                    isUnlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>

                  <p className={`text-sm text-center mb-3 ${
                    isUnlocked ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-cod-darkGray">
                    <span className={`text-sm font-bold ${
                      isUnlocked ? 'text-cod-gold' : 'text-gray-600'
                    }`}>
                      +{achievement.points} pts
                    </span>
                    {isUnlocked && (
                      <span className="text-xs text-gaming-accent font-bold">
                        ✓ DÉBLOQUÉ
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
