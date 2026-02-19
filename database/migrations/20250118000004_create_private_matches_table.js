export async function up(knex) {
  await knex.schema.createTable('private_matches', (table) => {
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.string('game_mode', 100).notNullable();
    table.string('map', 100).nullable();
    table.integer('max_players').notNullable();
    table.text('rules').nullable();
    table.string('password', 100).nullable();
    table.integer('host_id').unsigned().notNullable();
    table.enum('status', ['open', 'in_progress', 'completed']).defaultTo('open');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    
    table.foreign('host_id').references('users.id').onDelete('CASCADE');
    table.index(['status', 'game_mode']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('private_matches');
}
