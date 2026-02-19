/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  // Table des achievements disponibles
  await knex.schema.createTable('achievements', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.string('icon', 50).notNullable(); // Nom de l'icône Lucide
    table.enum('category', ['tournament', 'match', 'social', 'special']).defaultTo('special');
    table.integer('points').defaultTo(10); // Points gagnés en débloquant
    table.string('condition_type', 50).notNullable(); // 'tournament_wins', 'matches_played', etc.
    table.integer('condition_value').notNullable(); // Valeur à atteindre
    table.timestamps(true, true);
  });

  // Table de relation users-achievements
  await knex.schema.createTable('user_achievements', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('achievement_id').unsigned().notNullable();
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.boolean('notified').defaultTo(false);
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('achievement_id').references('achievements.id').onDelete('CASCADE');
    table.unique(['user_id', 'achievement_id']);
  });

  // Table des résultats de matches de tournois
  await knex.schema.createTable('tournament_matches', (table) => {
    table.increments('id').primary();
    table.integer('tournament_id').unsigned().notNullable();
    table.integer('player1_id').unsigned().notNullable();
    table.integer('player2_id').unsigned();
    table.integer('winner_id').unsigned();
    table.integer('round').notNullable(); // Round du bracket
    table.integer('match_number').notNullable(); // Position dans le round
    table.integer('player1_score').defaultTo(0);
    table.integer('player2_score').defaultTo(0);
    table.enum('status', ['pending', 'in_progress', 'completed', 'disputed']).defaultTo('pending');
    table.text('notes');
    table.timestamps(true, true);
    
    table.foreign('tournament_id').references('tournaments.id').onDelete('CASCADE');
    table.foreign('player1_id').references('users.id').onDelete('CASCADE');
    table.foreign('player2_id').references('users.id').onDelete('CASCADE');
    table.foreign('winner_id').references('users.id').onDelete('SET NULL');
  });

  // Table historique ELO
  await knex.schema.createTable('elo_history', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('old_elo').notNullable();
    table.integer('new_elo').notNullable();
    table.integer('change').notNullable();
    table.string('reason', 100).notNullable(); // 'tournament_win', 'match_loss', etc.
    table.integer('related_id').unsigned(); // ID du tournoi ou match
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id', 'created_at']);
  });

  // Ajouter colonnes ELO et achievements points aux users
  await knex.schema.alterTable('users', (table) => {
    table.integer('elo_rating').defaultTo(1200);
    table.integer('achievement_points').defaultTo(0);
    table.string('avatar_url', 255);
    table.text('bio');
    table.string('favorite_mode', 50);
    table.integer('matches_played').defaultTo(0);
    table.integer('matches_won').defaultTo(0);
    table.integer('tournaments_won').defaultTo(0);
    table.integer('tournaments_played').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('elo_rating');
    table.dropColumn('achievement_points');
    table.dropColumn('avatar_url');
    table.dropColumn('bio');
    table.dropColumn('favorite_mode');
    table.dropColumn('matches_played');
    table.dropColumn('matches_won');
    table.dropColumn('tournaments_won');
    table.dropColumn('tournaments_played');
  });
  
  await knex.schema.dropTableIfExists('elo_history');
  await knex.schema.dropTableIfExists('tournament_matches');
  await knex.schema.dropTableIfExists('user_achievements');
  await knex.schema.dropTableIfExists('achievements');
};
