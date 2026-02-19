export async function up(knex) {
  await knex.schema.createTable('tournaments', (table) => {
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.text('description').nullable();
    table.string('game_mode', 100).notNullable();
    table.integer('max_participants').notNullable();
    table.datetime('start_date').notNullable();
    table.datetime('end_date').nullable();
    table.text('rules').nullable();
    table.integer('organizer_id').unsigned().notNullable();
    table.enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled']).defaultTo('upcoming');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    
    table.foreign('organizer_id').references('users.id').onDelete('CASCADE');
    table.index(['status', 'start_date']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('tournaments');
}
