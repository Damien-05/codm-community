export async function up(knex) {
  await knex.schema.createTable('chat_messages', (table) => {
    table.increments('id').primary();
    table.integer('room_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('room_id').references('chat_rooms.id').onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['room_id', 'created_at']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('chat_messages');
}
