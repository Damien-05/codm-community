export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('username', 50).notNullable();
    table.string('codm_username', 50).notNullable();
    table.enum('role', ['player', 'organizer', 'admin']).defaultTo('player');
    table.integer('level').defaultTo(1);
    table.integer('xp').defaultTo(0);
    table.string('avatar', 500).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    table.timestamp('deleted_at').nullable();
    
    table.index(['email', 'deleted_at']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}
