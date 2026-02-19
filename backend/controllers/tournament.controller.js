import db from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getTournaments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('tournaments')
      .select(
        'tournaments.*',
        db.raw('COUNT(DISTINCT tournament_registrations.id) as registered_count')
      )
      .leftJoin('tournament_registrations', 'tournaments.id', 'tournament_registrations.tournament_id')
      .groupBy('tournaments.id')
      .orderBy('tournaments.start_date', 'desc')
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where('tournaments.status', status);
    }

    const tournaments = await query;

    const [{ total }] = await db('tournaments').count('* as total');

    res.json({
      success: true,
      data: {
        tournaments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTournamentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await db('tournaments')
      .where({ id })
      .first();

    if (!tournament) {
      throw new ApiError(404, 'Tournoi non trouvé');
    }

    const participants = await db('tournament_registrations')
      .join('users', 'tournament_registrations.user_id', 'users.id')
      .where({ tournament_id: id })
      .select(
        'users.id',
        'users.username',
        'users.codm_username',
        'users.level',
        'tournament_registrations.registered_at'
      );

    res.json({
      success: true,
      data: {
        tournament,
        participants
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createTournament = async (req, res, next) => {
  try {
    const { name, description, gameMode, maxParticipants, startDate, endDate, rules } = req.body;

    const [tournamentId] = await db('tournaments').insert({
      name,
      description,
      game_mode: gameMode,
      max_participants: maxParticipants,
      start_date: startDate,
      end_date: endDate,
      rules: JSON.stringify(rules),
      organizer_id: req.user.id,
      status: 'upcoming',
      created_at: db.fn.now()
    });

    const tournament = await db('tournaments').where({ id: tournamentId }).first();

    res.status(201).json({
      success: true,
      message: 'Tournoi créé avec succès',
      data: { tournament }
    });
  } catch (error) {
    next(error);
  }
};

export const registerForTournament = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await db('tournaments').where({ id }).first();
    if (!tournament) {
      throw new ApiError(404, 'Tournoi non trouvé');
    }

    if (tournament.status !== 'upcoming') {
      throw new ApiError(400, 'Les inscriptions pour ce tournoi sont fermées');
    }

    const registeredCount = await db('tournament_registrations')
      .where({ tournament_id: id })
      .count('* as count')
      .first();

    if (registeredCount.count >= tournament.max_participants) {
      throw new ApiError(400, 'Le tournoi est complet');
    }

    const existingRegistration = await db('tournament_registrations')
      .where({ tournament_id: id, user_id: req.user.id })
      .first();

    if (existingRegistration) {
      throw new ApiError(400, 'Vous êtes déjà inscrit à ce tournoi');
    }

    await db('tournament_registrations').insert({
      tournament_id: id,
      user_id: req.user.id,
      registered_at: db.fn.now()
    });

    res.json({
      success: true,
      message: 'Inscription au tournoi réussie'
    });
  } catch (error) {
    next(error);
  }
};

export const unregisterFromTournament = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await db('tournament_registrations')
      .where({ tournament_id: id, user_id: req.user.id })
      .delete();

    if (!deleted) {
      throw new ApiError(404, 'Inscription non trouvée');
    }

    res.json({
      success: true,
      message: 'Désinscription du tournoi réussie'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTournamentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db('tournaments')
      .where({ id })
      .update({ status });

    res.json({
      success: true,
      message: 'Statut du tournoi mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTournament = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await db('tournaments').where({ id }).first();
    if (!tournament) {
      throw new ApiError(404, 'Tournoi non trouvé');
    }

    // Delete related registrations first (cascade)
    await db('tournament_registrations').where({ tournament_id: id }).delete();
    
    // Delete the tournament
    await db('tournaments').where({ id }).delete();

    res.json({
      success: true,
      message: 'Tournoi supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
