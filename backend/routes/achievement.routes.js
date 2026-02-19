import express from 'express';
import {
  getUserAchievements,
  getAllAchievements,
  checkAchievements,
  getLeaderboardController,
  getEloHistory,
} from '../controllers/achievement.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.get('/all', optionalAuth, getAllAchievements);
router.get('/leaderboard', getLeaderboardController);

// Routes protégées
router.get('/user/:userId', authenticateToken, getUserAchievements);
router.post('/check', authenticateToken, checkAchievements);
router.get('/elo-history/:userId', authenticateToken, getEloHistory);

export default router;
