import db from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';
import { checkAndUnlockAchievements, getLeaderboard } from '../services/gamification.service.js';

export const getUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const achievements = await db('user_achievements')
      .join('achievements', 'user_achievements.achievement_id', 'achievements.id')
      .where({ user_id: userId })
      .select(
        'achievements.*',
        'user_achievements.unlocked_at',
        'user_achievements.notified'
      )
      .orderBy('user_achievements.unlocked_at', 'desc');

    res.json({
      success: true,
      data: { achievements },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await db('achievements')
      .select('*')
      .orderBy('points', 'asc');

    // Si l'utilisateur est connecté, marquer lesquels sont débloqués
    if (req.user) {
      const unlockedIds = await db('user_achievements')
        .where({ user_id: req.user.id })
        .pluck('achievement_id');

      const achievementsWithStatus = achievements.map((achievement) => ({
        ...achievement,
        unlocked: unlockedIds.includes(achievement.id),
      }));

      return res.json({
        success: true,
        data: { achievements: achievementsWithStatus },
      });
    }

    res.json({
      success: true,
      data: { achievements },
    });
  } catch (error) {
    next(error);
  }
};

export const checkAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newAchievements = await checkAndUnlockAchievements(userId);

    res.json({
      success: true,
      data: {
        newAchievements,
        count: newAchievements.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboardController = async (req, res, next) => {
  try {
    const { limit = 100, mode = 'all' } = req.query;
    const leaderboard = await getLeaderboard(parseInt(limit), mode);

    res.json({
      success: true,
      data: { leaderboard },
    });
  } catch (error) {
    next(error);
  }
};

export const getEloHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const history = await db('elo_history')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};
