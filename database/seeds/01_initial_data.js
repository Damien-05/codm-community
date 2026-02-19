export async function seed(knex) {
  // Clear existing entries
  await knex('chat_messages').del();
  await knex('chat_rooms').del();
  await knex('match_participants').del();
  await knex('private_matches').del();
  await knex('tournament_registrations').del();
  await knex('tournaments').del();
  await knex('users').del();

  // Create users (password = password123, pré-hashé avec bcrypt)
  const hashedPassword = '$2b$12$IIMlodBl.RAGjyteYoaD0.bSKzU4iObjN5wKOucE85K7.dpKppuJ6';
  
  await knex('users').insert([
    {
      id: 1,
      email: 'admin@codm.fr',
      password: hashedPassword,
      username: 'AdminCODM',
      codm_username: 'ADM_Pro',
      role: 'admin',
      level: 50,
      xp: 25000
    },
    {
      id: 2,
      email: 'player1@codm.fr',
      password: hashedPassword,
      username: 'SniperKing',
      codm_username: 'SK_Sniper',
      role: 'player',
      level: 35,
      xp: 15000
    },
    {
      id: 3,
      email: 'player2@codm.fr',
      password: hashedPassword,
      username: 'RushMaster',
      codm_username: 'RM_Rush',
      role: 'player',
      level: 28,
      xp: 12000
    },
    {
      id: 4,
      email: 'organizer@codm.fr',
      password: hashedPassword,
      username: 'TournamentPro',
      codm_username: 'TP_Org',
      role: 'organizer',
      level: 42,
      xp: 20000
    }
  ]);

  // Create tournaments
  await knex('tournaments').insert([
    {
      id: 1,
      name: 'Championnat d\'Hiver 2025',
      description: 'Le plus grand tournoi CODM de la saison !',
      game_mode: 'Battle Royale',
      max_participants: 100,
      start_date: '2025-12-15 14:00:00',
      end_date: '2025-12-15 18:00:00',
      rules: JSON.stringify(['Pas de triche', 'Respect des adversaires']),
      organizer_id: 4,
      status: 'upcoming'
    },
    {
      id: 2,
      name: 'Tournoi TDM Express',
      description: 'Tournoi rapide en mode Team Deathmatch',
      game_mode: 'Team Deathmatch',
      max_participants: 20,
      start_date: '2025-11-25 20:00:00',
      end_date: '2025-11-25 22:00:00',
      rules: JSON.stringify(['Teams de 5', 'Best of 3']),
      organizer_id: 1,
      status: 'upcoming'
    }
  ]);

  // Create tournament registrations
  await knex('tournament_registrations').insert([
    { tournament_id: 1, user_id: 2 },
    { tournament_id: 1, user_id: 3 },
    { tournament_id: 2, user_id: 2 }
  ]);

  // Create private matches
  await knex('private_matches').insert([
    {
      id: 1,
      name: 'Soirée entre amis',
      game_mode: 'Domination',
      map: 'Nuketown',
      max_players: 10,
      rules: JSON.stringify(['Pas de sniper', 'Armes légères uniquement']),
      host_id: 2,
      status: 'open'
    },
    {
      id: 2,
      name: 'Entraînement Pro',
      game_mode: 'Search & Destroy',
      map: 'Crash',
      max_players: 8,
      password: 'pro123',
      rules: JSON.stringify(['Niveau 30+ requis']),
      host_id: 3,
      status: 'open'
    }
  ]);

  // Create match participants
  await knex('match_participants').insert([
    { match_id: 1, user_id: 2 },
    { match_id: 1, user_id: 3 },
    { match_id: 2, user_id: 3 }
  ]);

  // Create chat rooms
  await knex('chat_rooms').insert([
    { id: 1, name: 'Chat Général', type: 'general', reference_id: null },
    { id: 2, name: 'Championnat d\'Hiver 2025', type: 'tournament', reference_id: 1 },
    { id: 3, name: 'Tournoi TDM Express', type: 'tournament', reference_id: 2 }
  ]);

  // Create chat messages
  await knex('chat_messages').insert([
    {
      room_id: 1,
      user_id: 1,
      content: 'Bienvenue sur CODM Community ! 🎮'
    },
    {
      room_id: 1,
      user_id: 2,
      content: 'Salut à tous ! Qui est chaud pour une partie ?'
    },
    {
      room_id: 1,
      user_id: 3,
      content: 'Moi je suis dispo ce soir !'
    },
    {
      room_id: 2,
      user_id: 4,
      content: 'Inscriptions ouvertes pour le Championnat d\'Hiver ! 🏆'
    }
  ]);

  console.log('✅ Données de test insérées avec succès');
}
