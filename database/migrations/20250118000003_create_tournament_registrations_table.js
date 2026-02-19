export async function up(knex) {
  await knex.schema.createTable('tournament_registrations', (table) => {
    table.increments('id').primary();
    table.integer('tournament_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.integer('position').nullable();
    table.timestamp('registered_at').defaultTo(knex.fn.now());
    
    table.foreign('tournament_id').references('tournaments.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.unique(['tournament_id', 'user_id']);
    table.index(['tournament_id', 'user_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('tournament_registrations');
}
