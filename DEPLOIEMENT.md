# 🚀 Guide de Déploiement - CODM Community

## Vue d'ensemble

Ce guide vous explique comment mettre en ligne votre plateforme CODM Community avec un déploiement professionnel et gratuit.

## Architecture de Déploiement

```
Frontend (Vercel)     →  Backend (Railway)  →  Database (Railway MySQL)
http://votre-site.vercel.app    https://votre-api.railway.app    MySQL hébergé
```

---

## 📦 Étape 1 : Préparation du Code

### 1.1 Créer un dépôt GitHub

```bash
cd "c:\Users\Barbe\OneDrive\projet CODM"
git init
git add .
git commit -m "Initial commit - CODM Community Platform"
```

Ensuite :
1. Allez sur https://github.com/new
2. Créez un nouveau repository **public** nommé `codm-community`
3. Suivez les instructions pour pousser votre code :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/codm-community.git
git branch -M main
git push -u origin main
```

### 1.2 Fichiers à ajouter au .gitignore

Vérifiez que votre `.gitignore` contient :

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

## 🗄️ Étape 2 : Déployer la Base de Données (Railway)

### 2.1 Créer un compte Railway
1. Allez sur https://railway.app
2. Inscrivez-vous avec GitHub (gratuit - 500h/mois)

### 2.2 Créer la base MySQL
1. Cliquez sur **"New Project"**
2. Sélectionnez **"Provision MySQL"**
3. Railway créera automatiquement une base de données
4. Cliquez sur votre service MySQL
5. Allez dans l'onglet **"Variables"**
6. Notez les informations de connexion :
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_URL` (URL complète)

### 2.3 Exécuter les migrations

Créez un fichier `knexfile.production.js` :

```javascript
export default {
  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL || {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: 'utf8mb4',
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  },
};
```

En local, connectez-vous à la base Railway et exécutez :

```bash
# Définir les variables d'environnement Railway
export MYSQL_HOST=containers-us-west-xxx.railway.app
export MYSQL_PORT=6543
export MYSQL_USER=root
export MYSQL_PASSWORD=xxxxxxxxxx
export MYSQL_DATABASE=railway

# Exécuter les migrations
cd backend
npx knex migrate:latest --env production
npx knex seed:run --env production
```

---

## 🖥️ Étape 3 : Déployer le Backend (Railway)

### 3.1 Préparer le backend

Créez un `Procfile` dans `/backend` :

```
web: node server.js
```

Ajoutez un script dans `backend/package.json` :

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate:prod": "knex migrate:latest --env production",
    "seed:prod": "knex seed:run --env production"
  }
}
```

### 3.2 Déployer sur Railway

1. Dans Railway, cliquez sur **"New Service" → "GitHub Repo"**
2. Sélectionnez votre repository `codm-community`
3. Railway détecte automatiquement Node.js
4. Configurez les variables d'environnement dans l'onglet **"Variables"** :

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://VOTRE_SITE.vercel.app

# Database (copiez depuis le service MySQL Railway)
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=6543
DB_USER=root
DB_PASSWORD=xxxxxxxxxx
DB_NAME=railway

# JWT Secrets (générez des valeurs aléatoires sécurisées)
JWT_SECRET=VOTRE_SECRET_SUPER_SECURISE_32_CARACTERES_MIN
JWT_REFRESH_SECRET=VOTRE_REFRESH_SECRET_SUPER_SECURISE
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

5. Railway déploiera automatiquement votre backend
6. Notez l'URL générée (ex: `https://codm-backend-production.up.railway.app`)

### 3.3 Configurer le Root Directory

Dans Railway, si votre backend est dans un sous-dossier :
1. Allez dans **Settings → Service Settings**
2. Définissez **Root Directory** : `backend`

---

## 🌐 Étape 4 : Déployer le Frontend (Vercel)

### 4.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Inscrivez-vous avec GitHub (gratuit)

### 4.2 Déployer depuis GitHub

1. Cliquez sur **"New Project"**
2. Importez votre repository `codm-community`
3. Configurez le projet :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

4. Ajoutez les **Environment Variables** :
   ```
   VITE_API_URL=https://VOTRE_BACKEND.railway.app/api
   VITE_SOCKET_URL=https://VOTRE_BACKEND.railway.app
   ```

5. Cliquez sur **"Deploy"**

### 4.3 Configurer le domaine personnalisé (Optionnel)

1. Dans Vercel, allez dans **Settings → Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

---

## 🔧 Étape 5 : Configuration Post-Déploiement

### 5.1 Mettre à jour le CORS Backend

Dans `backend/server.js`, mettez à jour le CORS :

```javascript
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'https://votre-site.vercel.app',
    'http://localhost:5173' // Pour dev local
  ],
  credentials: true,
};
```

### 5.2 Tester la connexion

1. Visitez votre site sur Vercel
2. Essayez de vous connecter avec `player1@codm.fr` / `password123`
3. Vérifiez que le chat fonctionne (Socket.io)
4. Testez la création de tournois

### 5.3 Vérifier les logs

**Backend (Railway)** :
- Allez dans votre service → **Deployments** → Cliquez sur le dernier déploiement
- Consultez les logs en temps réel

**Frontend (Vercel)** :
- Allez dans votre projet → **Deployments**
- Cliquez sur le dernier déploiement → **Functions** (pour les erreurs)

---

## 🔒 Étape 6 : Sécurité en Production

### 6.1 Variables d'environnement sensibles

**IMPORTANT** : Ne committez JAMAIS les fichiers `.env` !

Générez des secrets sécurisés :
```bash
# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou utilisez un site comme https://randomkeygen.com/
```

### 6.2 Configurer HTTPS

- **Vercel** : HTTPS automatique avec certificat SSL gratuit
- **Railway** : HTTPS automatique avec certificat SSL gratuit

### 6.3 Rate Limiting

Le backend a déjà un rate limiter configuré (100 requêtes/15min par IP).

---

## 📊 Étape 7 : Monitoring et Maintenance

### 7.1 Vérifier les performances

**Vercel Analytics** (gratuit) :
1. Dans votre projet Vercel → **Analytics**
2. Activez les analytics pour suivre les performances

**Railway Metrics** :
1. Dans votre service → **Metrics**
2. Surveillez CPU, RAM, requêtes

### 7.2 Logs et Debugging

**Backend** :
```bash
# Via Railway CLI
railway logs
```

**Frontend** :
- Console du navigateur (F12)
- Vercel Dashboard → Deployments → Logs

### 7.3 Mises à jour

Chaque fois que vous poussez du code sur GitHub :
- **Vercel** redéploie automatiquement le frontend
- **Railway** redéploie automatiquement le backend

---

## 🎯 Résumé des URLs

Après déploiement, vous aurez :

| Service | URL Exemple |
|---------|------------|
| **Frontend** | https://codm-community.vercel.app |
| **Backend API** | https://codm-backend-production.up.railway.app/api |
| **Database** | containers-us-west-xxx.railway.app:6543 |

---

## 🐛 Dépannage

### Problème : Frontend ne peut pas se connecter au Backend

**Solution** :
1. Vérifiez les variables `VITE_API_URL` et `VITE_SOCKET_URL` dans Vercel
2. Vérifiez que `CLIENT_URL` dans Railway pointe vers votre site Vercel
3. Vérifiez les logs Railway pour les erreurs CORS

### Problème : Socket.io ne fonctionne pas

**Solution** :
1. Railway doit supporter les WebSockets (c'est le cas par défaut)
2. Vérifiez que `VITE_SOCKET_URL` pointe vers l'URL Railway (sans `/api`)
3. Testez la connexion Socket dans la console du navigateur

### Problème : Erreurs de migration

**Solution** :
```bash
# Réinitialiser et refaire les migrations
npx knex migrate:rollback --all --env production
npx knex migrate:latest --env production
npx knex seed:run --env production
```

### Problème : Build Vercel échoue

**Solution** :
1. Vérifiez que `frontend/package.json` a `"type": "module"`
2. Vérifiez que toutes les dépendances sont dans `dependencies` (pas `devDependencies`)
3. Consultez les logs de build dans Vercel

---

## 💰 Coûts

**Gratuit jusqu'à :**
- **Vercel** : 100 GB bande passante/mois, déploiements illimités
- **Railway** : 500h exécution/mois, 1 GB RAM, 1 GB stockage DB
- **Total** : 0€/mois pour un projet de cette taille

**Si vous dépassez les limites gratuites :**
- Vercel Pro : ~20$/mois
- Railway Hobby : ~5$/mois

---

## 📞 Support

Si vous rencontrez des problèmes :
1. **Vercel** : https://vercel.com/docs
2. **Railway** : https://docs.railway.app
3. **Community Discord** : https://discord.gg/railway (Railway)

---

## ✅ Checklist Finale

Avant de lancer en production :

- [ ] Code poussé sur GitHub
- [ ] Base de données MySQL créée sur Railway
- [ ] Migrations exécutées avec succès
- [ ] Backend déployé sur Railway avec toutes les variables d'env
- [ ] Frontend déployé sur Vercel avec URLs backend correctes
- [ ] CORS configuré pour accepter l'URL Vercel
- [ ] Test de connexion (login/register)
- [ ] Test du chat en temps réel
- [ ] Test de création de tournoi (admin)
- [ ] Secrets JWT régénérés (ne pas utiliser ceux de dev)
- [ ] Monitoring activé (Vercel Analytics + Railway Metrics)

---

**Félicitations ! Votre plateforme CODM Community est maintenant en ligne ! 🎮🏆**
