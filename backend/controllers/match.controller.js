import db from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getPrivateMatches = async (req, res, next) => {
  try {
    const { gameMode, map, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('private_matches')
      .select(
        'private_matches.*',
        'users.username as host_username',
        db.raw('COUNT(DISTINCT match_participants.id) as participants_count')
      )
      .join('users', 'private_matches.host_id', 'users.id')
      .leftJoin('match_participants', 'private_matches.id', 'match_participants.match_id')
      .groupBy('private_matches.id')
      .orderBy('private_matches.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (gameMode) query = query.where('private_matches.game_mode', gameMode);
    if (map) query = query.where('private_matches.map', map);
    if (status) query = query.where('private_matches.status', status);

    const matches = await query;

    res.json({
      success: true,
      data: { matches }
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await db('private_matches')
      .where({ id })
      .join('users', 'private_matches.host_id', 'users.id')
      .select('private_matches.*', 'users.username as host_username')
      .first();

    if (!match) {
      throw new ApiError(404, 'Partie non trouvée');
    }

    const participants = await db('match_participants')
      .join('users', 'match_participants.user_id', 'users.id')
      .where({ match_id: id })
      .select('users.id', 'users.username', 'users.codm_username', 'match_participants.joined_at');

    res.json({
      success: true,
      data: {
        match,
        participants
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createPrivateMatch = async (req, res, next) => {
  try {
    const { name, gameMode, map, maxPlayers, rules, password } = req.body;

    const [matchId] = await db('private_matches').insert({
      name,
      game_mode: gameMode,
      map,
      max_players: maxPlayers,
      rules: JSON.stringify(rules),
      password,
      host_id: req.user.id,
      status: 'open',
      created_at: db.fn.now()
    });

    // Automatically add host as participant
    await db('match_participants').insert({
      match_id: matchId,
      user_id: req.user.id,
      joined_at: db.fn.now()
    });

    const match = await db('private_matches').where({ id: matchId }).first();

    res.status(201).json({
      success: true,
      message: 'Partie privée créée avec succès',
      data: { match }
    });
  } catch (error) {
    next(error);
  }
};

export const joinMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const match = await db('private_matches').where({ id }).first();
    if (!match) {
      throw new ApiError(404, 'Partie non trouvée');
    }

    if (match.status !== 'open') {
      throw new ApiError(400, 'Cette partie n\'accepte plus de nouveaux joueurs');
    }

    if (match.password && match.password !== password) {
      throw new ApiError(401, 'Mot de passe incorrect');
    }

    const participantsCount = await db('match_participants')
      .where({ match_id: id })
      .count('* as count')
      .first();

    if (participantsCount.count >= match.max_players) {
      throw new ApiError(400, 'La partie est complète');
    }

    const existing = await db('match_participants')
      .where({ match_id: id, user_id: req.user.id })
      .first();

    if (existing) {
      throw new ApiError(400, 'Vous avez déjà rejoint cette partie');
    }

    await db('match_participants').insert({
      match_id: id,
      user_id: req.user.id,
      joined_at: db.fn.now()
    });

    res.json({
      success: true,
      message: 'Vous avez rejoint la partie'
    });
  } catch (error) {
    next(error);
  }
};

export const leaveMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await db('match_participants')
      .where({ match_id: id, user_id: req.user.id })
      .delete();

    if (!deleted) {
      throw new ApiError(404, 'Vous n\'êtes pas dans cette partie');
    }

    res.json({
      success: true,
      message: 'Vous avez quitté la partie'
    });
  } catch (error) {
    next(error);
  }
};

export const updateMatchStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const match = await db('private_matches').where({ id }).first();
    if (match.host_id !== req.user.id) {
      throw new ApiError(403, 'Seul l\'hôte peut modifier le statut de la partie');
    }

    await db('private_matches')
      .where({ id })
      .update({ status });

    res.json({
      success: true,
      message: 'Statut de la partie mis à jour'
    });
  } catch (error) {
    next(error);
  }
};
