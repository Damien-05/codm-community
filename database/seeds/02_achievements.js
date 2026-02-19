/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
  // Supprimer les achievements existants
  await knex('achievements').del();
  
  // Seed des achievements de base
  await knex('achievements').insert([
    {
      name: 'Premier Pas',
      description: 'Créez votre compte et rejoignez la communauté',
      icon: 'UserPlus',
      category: 'special',
      points: 5,
      condition_type: 'account_created',
      condition_value: 1
    },
    {
      name: 'Guerrier',
      description: 'Jouez 10 parties privées',
      icon: 'Sword',
      category: 'match',
      points: 15,
      condition_type: 'matches_played',
      condition_value: 10
    },
    {
      name: 'Vétéran',
      description: 'Jouez 50 parties privées',
      icon: 'Shield',
      category: 'match',
      points: 50,
      condition_type: 'matches_played',
      condition_value: 50
    },
    {
      name: 'Légende',
      description: 'Jouez 100 parties privées',
      icon: 'Crown',
      category: 'match',
      points: 100,
      condition_type: 'matches_played',
      condition_value: 100
    },
    {
      name: 'Gagnant',
      description: 'Gagnez 10 parties',
      icon: 'Trophy',
      category: 'match',
      points: 20,
      condition_type: 'matches_won',
      condition_value: 10
    },
    {
      name: 'Invincible',
      description: 'Gagnez 50 parties',
      icon: 'Flame',
      category: 'match',
      points: 75,
      condition_type: 'matches_won',
      condition_value: 50
    },
    {
      name: 'Champion de Tournoi',
      description: 'Gagnez votre premier tournoi',
      icon: 'Medal',
      category: 'tournament',
      points: 100,
      condition_type: 'tournaments_won',
      condition_value: 1
    },
    {
      name: 'Compétiteur',
      description: 'Participez à 5 tournois',
      icon: 'Target',
      category: 'tournament',
      points: 25,
      condition_type: 'tournaments_played',
      condition_value: 5
    },
    {
      name: 'Pro Player',
      description: 'Gagnez 5 tournois',
      icon: 'Star',
      category: 'tournament',
      points: 250,
      condition_type: 'tournaments_won',
      condition_value: 5
    },
    {
      name: 'Top 10',
      description: 'Atteignez le top 10 du classement ELO',
      icon: 'TrendingUp',
      category: 'special',
      points: 150,
      condition_type: 'elo_top_10',
      condition_value: 1
    },
    {
      name: 'Master ELO',
      description: 'Atteignez 1800 ELO',
      icon: 'Zap',
      category: 'special',
      points: 200,
      condition_type: 'elo_rating',
      condition_value: 1800
    },
    {
      name: 'Social',
      description: 'Envoyez 100 messages dans le chat',
      icon: 'MessageCircle',
      category: 'social',
      points: 30,
      condition_type: 'messages_sent',
      condition_value: 100
    },
    {
      name: 'Membre Fondateur',
      description: 'Faites partie des 100 premiers membres',
      icon: 'Award',
      category: 'special',
      points: 500,
      condition_type: 'user_id',
      condition_value: 100
    },
  ]);
};
