import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('username').isLength({ min: 3, max: 20 }).withMessage('Le pseudo doit contenir entre 3 et 20 caractères'),
  body('codmUsername').isLength({ min: 3, max: 20 }).withMessage('Le pseudo COD Mobile doit contenir entre 3 et 20 caractères')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);

export default router;
