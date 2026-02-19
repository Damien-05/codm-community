export async function up(knex) {
  await knex.schema.createTable('match_participants', (table) => {
    table.increments('id').primary();
    table.integer('match_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    
    table.foreign('match_id').references('private_matches.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.unique(['match_id', 'user_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('match_participants');
}
