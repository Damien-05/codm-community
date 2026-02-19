export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur serveur est survenue';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
