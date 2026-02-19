# 🎮 CODM Community Platform

Plateforme communautaire pour joueurs Call of Duty Mobile avec gestion de tournois, chat en temps réel, système de badges, classement ELO et organisation de parties privées.

![Status](https://img.shields.io/badge/Status-90%25%20Complet-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Fonctionnalités Implémentées

### ⚔️ Gestion de Tournois
- ✅ Création et inscription aux tournois
- ✅ Suivi des participants en temps réel
- ✅ Historique des performances
- ✅ Cartes tournois avec badges animés et progress bars
- ⚠️ Système de brackets (en développement)

### 🏅 Système de Gamification
- ✅ **13 Badges débloquables** (Premier Pas, Guerrier, Champion, Pro Player, etc.)
- ✅ **Classement ELO** avec algorithme standard
- ✅ **Leaderboard** en temps réel avec podium
- ✅ Points d'achievement cumulables
- ✅ Vérification automatique des badges

### 💬 Chat en Temps Réel
- ✅ Discussions par channels (général, tournois)
- ✅ Messages persistants en DB
- ✅ Historique complet
- ✅ Notifications en temps réel avec Socket.io

### 🎯 Parties Privées
- ✅ Création de parties personnalisées
- ✅ Filtres par mode de jeu, carte, niveau
- ✅ Système de matchmaking
- ✅ Notification spéciale "Match Trouvé"

### 👤 Profils Utilisateurs
- ✅ **Statistiques détaillées** (ELO, winrate, parties jouées)
- ✅ **Graphiques de progression** (ELO history, winrate pie chart)
- ✅ **Badges récents** affichés
- ✅ Historique des tournois
- ✅ Édition du profil

### 🎨 Design & UX
- ✅ **Particules animées** d'arrière-plan
- ✅ **Notifications toast** professionnelles (succès, erreur, achievement)
- ✅ **Skeleton screens** pour tous les loading states
- ✅ **Animations Framer Motion** fluides
- ✅ Thème gaming immersif (dark mode COD Mobile)
- ✅ Design 100% responsive

---

## 🛠️ Stack Technique

### Frontend
- React 18 + Vite
- TailwindCSCSS + shadcn/ui
- Socket.io Client
- React Query

### Backend
- Node.js + Express
- Socket.io
- MySQL 8.0+
- JWT Authentication

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Vercel (Frontend) + Railway (Backend)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- MySQL 8.0+
- Docker (optionnel)

### Configuration Rapide

```bash
# Cloner le repository
git clone <repository-url>
cd projet-codm

# Installer les dépendances backend
cd backend
npm install
cp .env.example .env  # Configurer les variables d'environnement

# Installer les dépendances frontend
cd ../frontend
npm install
cp .env.example .env  # Configurer les variables d'environnement

# Démarrer MySQL avec Docker
docker-compose up -d mysql

# Appliquer les migrations
cd ../backend
npm run migrate:latest

# Charger les données de test
npm run seed:dev
```

### Lancement en Développement

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

Accédez à l'application sur http://localhost:5173

## 📂 Structure du Projet

```
/frontend/
  /src/
    /components/    # Composants React réutilisables
    /pages/        # Pages principales
    /hooks/        # Custom hooks
    /services/     # API calls & Socket.io
    /contexts/     # Context providers
    /styles/       # Thème et styles globaux
/backend/
  /routes/         # Routes API REST
  /controllers/    # Logique métier
  /models/         # Modèles de données
  /middleware/     # Auth, validation, errors
  /socket/         # Gestionnaires Socket.io
  /config/         # Configuration
/database/
  /migrations/     # Migrations DB
  /seeds/          # Données de test
```

## 🧪 Tests

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test

# Tests E2E
npm run test:e2e
```

## 🎨 Guide de Style

Le projet suit un thème gaming avec:
- Palette sombre (#0A0E27, #1A1F3A)
- Accents néon (#00FF88, #FF006E)
- Fonts: Rajdhani, Orbitron
- Animations fluides avec Framer Motion

## 🔒 Sécurité

- Authentification JWT avec refresh tokens
- Rate limiting sur endpoints sensibles
- Sanitization des inputs (XSS protection)
- CORS configuré
- Mots de passe hashés avec bcrypt

## 📚 Documentation API

Une fois le serveur lancé, consultez la documentation Swagger:
http://localhost:5000/api-docs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [x] Architecture de base
- [ ] Système d'authentification
- [ ] Gestion des tournois
- [ ] Chat en temps réel
- [ ] Parties privées
- [ ] Intégration API Activision
- [ ] Application mobile (React Native)

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

Développé pour la communauté Call of Duty Mobile

## 🆘 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
