# 🚀 Guide de Démarrage Rapide - CODM Community

## Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **MySQL** 8.0+ ([Télécharger](https://dev.mysql.com/downloads/))
- **Docker** (optionnel) ([Télécharger](https://www.docker.com/))

## Installation Rapide

### 1. Cloner ou Vérifier le Projet

```bash
cd "c:\Users\Barbe\OneDrive\projet CODM"
```

### 2. Configuration de la Base de Données

#### Option A: Avec Docker (Recommandé)

```bash
# Démarrer MySQL et Redis
docker-compose up -d

# Vérifier que les conteneurs fonctionnent
docker-compose ps
```

#### Option B: MySQL Local

Créez la base de données manuellement :
```sql
CREATE DATABASE codm_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos paramètres MySQL si nécessaire
# (Par défaut configuré pour Docker)

# Appliquer les migrations
npm run migrate:latest

# Charger les données de test
npm run seed:dev
```

### 4. Configuration du Frontend

```bash
# Ouvrir un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 5. Démarrer l'Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le backend démarre sur **http://localhost:5000**

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

## 🎮 Comptes de Test

Après avoir exécuté les seeds, vous pouvez vous connecter avec :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@codm.fr | password123 | Admin |
| player1@codm.fr | password123 | Joueur |
| player2@codm.fr | password123 | Joueur |
| organizer@codm.fr | password123 | Organisateur |

## 📝 Commandes Utiles

### Backend

```bash
# Développement avec rechargement automatique
npm run dev

# Production
npm start

# Créer une nouvelle migration
npm run migrate:make nom_de_la_migration

# Rollback de la dernière migration
npm run migrate:rollback

# Tests
npm test

# Tests en mode watch
npm test:watch
```

### Frontend

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

### Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🔧 Dépannage

### Erreur de connexion MySQL

Vérifiez que MySQL fonctionne :
```bash
docker-compose ps
# ou
mysql -u codm_user -p
```

### Port déjà utilisé

Si le port 5000 ou 5173 est occupé :

**Backend (.env):**
```env
PORT=3000
```

**Frontend (vite.config.js):**
```js
server: {
  port: 3001,
}
```

### Problèmes de migrations

Réinitialiser complètement la base :
```bash
cd backend
npm run migrate:rollback
npm run migrate:latest
npm run seed:dev
```

## 🌐 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 📚 Structure du Projet

```
projet CODM/
├── backend/           # API Node.js + Express + Socket.io
│   ├── controllers/   # Logique métier
│   ├── routes/        # Routes API
│   ├── middleware/    # Auth, validation, errors
│   ├── socket/        # Gestionnaires WebSocket
│   └── config/        # Configuration DB
├── frontend/          # React + Vite + TailwindCSS
│   └── src/
│       ├── components/  # Composants réutilisables
│       ├── pages/       # Pages de l'app
│       ├── contexts/    # Context providers
│       └── services/    # API calls
├── database/          # Migrations et seeds MySQL
│   ├── migrations/    # Schéma de base de données
│   └── seeds/         # Données de test
└── docker-compose.yml # Configuration Docker
```

## 🎯 Prochaines Étapes

1. **Tester l'authentification** : Créez un compte ou connectez-vous
2. **Explorer les tournois** : Consultez les tournois disponibles
3. **Créer une partie privée** : Testez le système de matchmaking
4. **Utiliser le chat** : Rejoignez une room et envoyez des messages

## 🤝 Contribution

Pour contribuer au développement :

1. Créez une branche feature
2. Développez votre fonctionnalité
3. Testez localement
4. Soumettez une Pull Request

## 📞 Support

En cas de problème, consultez :
- Les logs du backend dans le terminal
- La console développeur du navigateur (F12)
- Les logs Docker : `docker-compose logs`

---

**Bon développement ! 🎮**
