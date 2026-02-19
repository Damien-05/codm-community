import db from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

// Service pour vérifier et débloquer les achievements
export const checkAndUnlockAchievements = async (userId) => {
  try {
    const user = await db('users').where({ id: userId }).first();
    if (!user) return;

    const allAchievements = await db('achievements').select('*');
    const unlockedAchievementIds = await db('user_achievements')
      .where({ user_id: userId })
      .pluck('achievement_id');

    const newAchievements = [];

    for (const achievement of allAchievements) {
      // Skip si déjà débloqué
      if (unlockedAchievementIds.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.condition_type) {
        case 'account_created':
          shouldUnlock = true;
          break;
        case 'matches_played':
          shouldUnlock = user.matches_played >= achievement.condition_value;
          break;
        case 'matches_won':
          shouldUnlock = user.matches_won >= achievement.condition_value;
          break;
        case 'tournaments_played':
          shouldUnlock = user.tournaments_played >= achievement.condition_value;
          break;
        case 'tournaments_won':
          shouldUnlock = user.tournaments_won >= achievement.condition_value;
          break;
        case 'elo_rating':
          shouldUnlock = user.elo_rating >= achievement.condition_value;
          break;
        case 'user_id':
          shouldUnlock = user.id <= achievement.condition_value;
          break;
      }

      if (shouldUnlock) {
        await db('user_achievements').insert({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: db.fn.now(),
          notified: false,
        });

        await db('users')
          .where({ id: userId })
          .increment('achievement_points', achievement.points);

        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

// Calculer le classement ELO
export const calculateElo = (playerRating, opponentRating, playerWon, kFactor = 32) => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = playerWon ? 1 : 0;
  const newRating = Math.round(playerRating + kFactor * (actualScore - expectedScore));
  return newRating;
};

// Mettre à jour l'ELO après un match
export const updateEloAfterMatch = async (winnerId, loserId, reason = 'match') => {
  try {
    const winner = await db('users').where({ id: winnerId }).first();
    const loser = await db('users').where({ id: loserId }).first();

    if (!winner || !loser) return;

    const winnerOldElo = winner.elo_rating || 1200;
    const loserOldElo = loser.elo_rating || 1200;

    // K-factor: 32 pour nouveaux joueurs, 16 pour expérimentés
    const winnerKFactor = winner.matches_played < 30 ? 32 : 16;
    const loserKFactor = loser.matches_played < 30 ? 32 : 16;

    const winnerNewElo = calculateElo(winnerOldElo, loserOldElo, true, winnerKFactor);
    const loserNewElo = calculateElo(loserOldElo, winnerOldElo, false, loserKFactor);

    // Mettre à jour les ELO
    await db('users').where({ id: winnerId }).update({ elo_rating: winnerNewElo });
    await db('users').where({ id: loserId }).update({ elo_rating: loserNewElo });

    // Enregistrer l'historique
    await db('elo_history').insert([
      {
        user_id: winnerId,
        old_elo: winnerOldElo,
        new_elo: winnerNewElo,
        change: winnerNewElo - winnerOldElo,
        reason,
      },
      {
        user_id: loserId,
        old_elo: loserOldElo,
        new_elo: loserNewElo,
        change: loserNewElo - loserOldElo,
        reason,
      },
    ]);

    return {
      winner: { oldElo: winnerOldElo, newElo: winnerNewElo, change: winnerNewElo - winnerOldElo },
      loser: { oldElo: loserOldElo, newElo: loserNewElo, change: loserNewElo - loserOldElo },
    };
  } catch (error) {
    console.error('Error updating ELO:', error);
    throw error;
  }
};

export const getLeaderboard = async (limit = 100, mode = 'all') => {
  try {
    let query = db('users')
      .select(
        'users.id',
        'users.username',
        'users.codm_username',
        'users.elo_rating',
        'users.level',
        'users.avatar_url',
        'users.matches_played',
        'users.matches_won',
        'users.tournaments_won',
        'users.achievement_points'
      )
      .orderBy('elo_rating', 'desc')
      .limit(limit);

    const leaderboard = await query;

    return leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      winrate: user.matches_played > 0 ? ((user.matches_won / user.matches_played) * 100).toFixed(1) : 0,
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};
