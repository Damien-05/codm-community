import express from 'express';
import { 
  getTournaments, 
  getTournamentById, 
  createTournament, 
  registerForTournament,
  unregisterFromTournament,
  updateTournamentStatus,
  deleteTournament
} from '../controllers/tournament.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTournaments);
router.get('/:id', getTournamentById);
router.post('/', authenticate, authorize('organizer', 'admin'), createTournament);
router.post('/:id/register', authenticate, registerForTournament);
router.delete('/:id/register', authenticate, unregisterFromTournament);
router.patch('/:id/status', authenticate, authorize('organizer', 'admin'), updateTournamentStatus);
router.delete('/:id', authenticate, authorize('admin'), deleteTournament);

export default router;
