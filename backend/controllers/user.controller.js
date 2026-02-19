import db from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'username', 'codm_username', 'role', 'level', 'xp', 'avatar', 'created_at')
      .first();

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, codmUsername, avatar } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (codmUsername) updates.codm_username = codmUsername;
    if (avatar) updates.avatar = avatar;

    await db('users')
      .where({ id: req.user.id })
      .update(updates);

    const updatedUser = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'username', 'codm_username', 'role', 'level', 'xp', 'avatar')
      .first();

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'codm_username', 'level', 'xp')
      .first();

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // Get tournament stats
    const tournaments = await db('tournament_registrations')
      .where({ user_id: userId })
      .count('* as total')
      .first();

    const wins = await db('tournament_registrations')
      .where({ user_id: userId, position: 1 })
      .count('* as total')
      .first();

    // Get match stats
    const matches = await db('match_participants')
      .where({ user_id: userId })
      .count('* as total')
      .first();

    res.json({
      success: true,
      data: {
        user,
        stats: {
          tournamentsPlayed: tournaments.total || 0,
          tournamentsWon: wins.total || 0,
          matchesPlayed: matches.total || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
