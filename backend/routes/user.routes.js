import express from 'express';
import { getProfile, updateProfile, getUserStats } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/stats/:userId', getUserStats);

export default router;
