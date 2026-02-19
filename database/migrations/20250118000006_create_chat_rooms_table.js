export async function up(knex) {
  await knex.schema.createTable('chat_rooms', (table) => {
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.string('type', 50).notNullable(); // 'general', 'tournament', 'private'
    table.integer('reference_id').nullable(); // ID du tournoi ou null pour général
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('chat_rooms');
}
