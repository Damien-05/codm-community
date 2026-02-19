import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'codm_community',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: '../database/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: '../database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: 'utf8mb4',
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: '../database/migrations',
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 20
    }
  }
};
