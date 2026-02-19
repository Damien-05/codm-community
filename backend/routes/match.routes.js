import express from 'express';
import { 
  getPrivateMatches, 
  getMatchById, 
  createPrivateMatch,
  joinMatch,
  leaveMatch,
  updateMatchStatus
} from '../controllers/match.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPrivateMatches);
router.get('/:id', getMatchById);
router.post('/', authenticate, createPrivateMatch);
router.post('/:id/join', authenticate, joinMatch);
router.delete('/:id/leave', authenticate, leaveMatch);
router.patch('/:id/status', authenticate, updateMatchStatus);

export default router;
