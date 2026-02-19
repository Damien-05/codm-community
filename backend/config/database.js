import knex from 'knex';
import knexConfig from '../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// Test connection
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Connexion MySQL établie avec succès');
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MySQL:', err.message);
    process.exit(1);
  });

export default db;
