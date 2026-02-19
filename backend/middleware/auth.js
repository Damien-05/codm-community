import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token d\'authentification manquant');
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Token expiré');
      }
      throw new ApiError(401, 'Token invalide');
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Non authentifié'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Accès refusé'));
    }

    next();
  };
};

// Middleware optionnel - continue même sans token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Ignore les erreurs de token pour optionalAuth
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Alias pour authenticateToken
export const authenticateToken = authenticate;
