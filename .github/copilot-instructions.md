# Instructions pour les Agents IA - CODM Community Platform

## Vue d'ensemble du projet

Plateforme communautaire pour joueurs Call of Duty Mobile avec gestion de tournois, système de chat en temps réel, et organisation de parties privées. Architecture full-stack moderne avec thème gaming immersif.

## Architecture et Structure

### Stack Technique Recommandée
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui pour un design gaming moderne
- **Backend**: Node.js + Express + Socket.io pour le chat en temps réel
- **Base de données**: MySQL pour les données relationnelles (utilisateurs, tournois, inscriptions)
- **Authentification**: JWT avec système de rôles (joueur, organisateur, admin)
- **Langue**: Interface 100% en français
- **Déploiement**: Frontend (Vercel/Netlify), Backend (Railway/Render)

### Structure des Dossiers
```
/frontend          # Application React
  /src
    /components    # Composants réutilisables UI
    /pages        # Pages principales (Home, Tournaments, Chat, PrivateMatches)
    /hooks        # Custom hooks React
    /services     # API calls et Socket.io client
    /contexts     # Context providers (Auth, Theme, Socket)
/backend          # API REST et WebSocket
  /routes         # Routes API par fonctionnalité
  /controllers    # Logique métier
  /models         # Schémas de base de données
  /middleware     # Auth, validation, error handling
  /socket         # Gestionnaires Socket.io pour le chat
/database         # Migrations et seeds MySQL
```

## Fonctionnalités Principales

### 1. Système de Tournois
- **Tables DB**: `tournaments`, `tournament_registrations`, `matches`, `teams`
- **Workflow**: Création → Inscription → Bracketing → Résultats → Classement
- **Contraintes**: Vérifier les doublons d'inscription, limites de participants, dates valides
- Utiliser un système de brackets (simple/double élimination) avec bibliothèque comme `brackets-manager`

### 2. Chat en Temps Réel
- **Technologie**: Socket.io pour bidirectionnalité
- **Rooms**: Channels par tournoi, chat général, messages privés
- **Features**: Messages persistants en DB, historique, notifications
- **Events clés**: `message:send`, `message:receive`, `user:typing`, `room:join`

### 3. Parties Privées & Matchmaking
- **Tables DB**: `private_matches`, `match_participants`
- **Filtres**: Mode de jeu, carte, niveau requis, nombre de joueurs
- **Statuts**: Ouvert → En cours → Terminé
- Permettre aux créateurs de définir des règles personnalisées (armes autorisées, etc.)

### 4. Profils Utilisateurs
- **Données**: Pseudo COD Mobile, statistiques, historique tournois, badges
- **Intégration**: Considérer l'import de stats depuis l'API Activision si disponible
- **Gamification**: Système de niveaux, achievements, classement ELO

## Conventions de Code

### Frontend
- Composants en PascalCase (`TournamentCard.jsx`)
- Hooks personnalisés préfixés par `use` (`useTournaments.js`)
- CSS: Classes TailwindCSS + fichiers de thème gaming (`/styles/theme.js`)
- State management: Context API pour l'état global, React Query pour les données serveur

### Backend
- Routes RESTful: `/api/tournaments`, `/api/matches`, `/api/chat`
- Controllers avec gestion d'erreurs async/await + try-catch
- Validation avec `express-validator` ou `joi`
- Responses standardisées: `{ success: boolean, data: any, error?: string }`

### Base de Données
- Migrations versionnées avec `knex` ou `sequelize` pour MySQL
- Relations: FK avec CASCADE DELETE approprié
- Indexes sur: `user_id`, `tournament_id`, `created_at` pour performances
- Soft deletes pour les données sensibles (utilisateurs, tournois)
- Charset: utf8mb4 pour support complet Unicode (emojis dans le chat)
- Collation: utf8mb4_unicode_ci pour tri correct des caractères français

## Workflows Essentiels

### Développement Local
```bash
# Backend
cd backend && npm install
npm run dev  # Lance Express + Socket.io sur port 5000

# Frontend
cd frontend && npm install
npm run dev  # Lance Vite sur port 5173

# Database
docker-compose up -d mysql     # Lance MySQL
npm run migrate:latest         # Applique les migrations
npm run seed:dev              # Charge les données de test (en français)
```

### Tests
- Backend: Jest + Supertest pour routes API
- Frontend: Vitest + React Testing Library
- E2E: Playwright pour flux critiques (inscription tournoi, chat)

## Considérations Spécifiques

### Thème Gaming
- Palette de couleurs: Tons sombres (#0A0E27, #1A1F3A) avec accents néon (#00FF88, #FF006E)
- Typographie: Fonts gaming (Rajdhani, Orbitron) via Google Fonts
- Animations: Framer Motion pour transitions fluides, particules d'arrière-plan
- Assets: Icons de `react-icons` (GiTrophy, FaGamepad, etc.)

### Sécurité
- Rate limiting sur routes sensibles (inscription, création tournoi)
- Sanitization des inputs pour prévenir XSS (utiliser `dompurify` côté client)
- CORS configuré pour domaines autorisés uniquement
- Hash des mots de passe avec bcrypt (rounds: 12)

### Performance
- Pagination pour listes de tournois (20 items/page)
- Lazy loading des composants lourds (chat, brackets viewer)
- Cache Redis pour classements et statistiques fréquemment consultés
- Compression gzip sur réponses API

### Accessibilité
- Labels ARIA sur composants interactifs (en français)
- Navigation au clavier dans formulaires et modals
- Contraste suffisant même avec thème sombre
- Support mobile-first (responsive design)
- Tous les messages d'erreur et de succès en français
- Format de date/heure français (DD/MM/YYYY HH:mm)

## Points d'Intégration

- **API Activision**: Pour importer stats COD Mobile (si clé API disponible)
- **Discord/OAuth**: Connexion sociale pour simplifier l'inscription
- **Stripe/PayPal**: Si tournois avec prix d'entrée (future feature)
- **AWS S3/Cloudinary**: Upload d'avatars et preuves de victoire

## Commandes Utiles

```bash
# Générer un nouveau modèle
npm run generate:model Tournament

# Créer une migration
npm run migrate:make add_tournaments_table

# Lancer tous les tests
npm run test:all

# Build production
npm run build && npm run start
```

## Notes Importantes

- Toujours valider les IDs de tournoi/utilisateur avant opérations DB
- Logger les événements critiques (inscription, résultats) pour audit
- Prévoir modération du chat (ban, mute, filtrage mots-clés)
- Documenter les endpoints API avec Swagger/OpenAPI
- Versionner l'API (`/api/v1/`) pour évolutions futures

---

**Priorité lors du développement**: Commencer par l'authentification et les profils utilisateurs, puis tournois basiques, ensuite chat, et enfin parties privées. Itérer avec des MVP fonctionnels.
