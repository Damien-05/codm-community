# 🚀 Déploiement Rapide - 5 Minutes

## Option la plus simple : Railway (Backend + DB) + Vercel (Frontend)

### 📝 Prérequis
- Compte GitHub : https://github.com/signup
- Compte Railway : https://railway.app (gratuit)
- Compte Vercel : https://vercel.com (gratuit)

---

## Étape 1️⃣ : GitHub (2 min)

```bash
cd "c:\Users\Barbe\OneDrive\projet CODM"
git init
git add .
git commit -m "CODM Community Platform ready for deployment"
```

Créez un repo sur https://github.com/new puis :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/codm-community.git
git branch -M main
git push -u origin main
```

---

## Étape 2️⃣ : Railway - Base de Données (1 min)

1. Allez sur https://railway.app
2. **Login avec GitHub**
3. **New Project** → **Provision MySQL**
4. Cliquez sur le service MySQL → **Variables** → Copiez :
   - `MYSQL_HOST`
   - `MYSQL_PORT`  
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

---

## Étape 3️⃣ : Railway - Backend (2 min)

1. Dans le même projet Railway : **New Service** → **GitHub Repo**
2. Sélectionnez `codm-community`
3. **Settings** → **Root Directory** : `backend`
4. **Variables** → Ajoutez :

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://VOTRE_SITE.vercel.app

# Copiez depuis MySQL Railway
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=6543
DB_USER=root
DB_PASSWORD=xxxxxxxxxx
DB_NAME=railway

# Générez des secrets sécurisés (32+ caractères)
JWT_SECRET=ChangezMoiAvecUnTresLongSecret32Caracteres
JWT_REFRESH_SECRET=ChangezMoiAvecUnAutreTresLongSecret32
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

5. **Deploy** → Attendez le déploiement
6. Notez l'URL (ex: `codm-backend-production.up.railway.app`)

---

## Étape 4️⃣ : Migrations (1 min)

Dans Railway, ouvrez le **Terminal** de votre service Backend et exécutez :

```bash
npm run migrate:prod
npm run seed:prod
```

Ou en local :

```bash
cd backend
# Définissez les variables Railway
export DB_HOST=containers-us-west-xxx.railway.app
export DB_PORT=6543
export DB_USER=root
export DB_PASSWORD=xxxxxxxxxx
export DB_NAME=railway

npm run migrate:prod
npm run seed:prod
```

---

## Étape 5️⃣ : Vercel - Frontend (1 min)

1. Allez sur https://vercel.com
2. **Login avec GitHub**
3. **New Project** → Importez `codm-community`
4. Configuration :
   - **Framework** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

5. **Environment Variables** :

```
VITE_API_URL=https://VOTRE_BACKEND.railway.app/api
VITE_SOCKET_URL=https://VOTRE_BACKEND.railway.app
```

Remplacez `VOTRE_BACKEND` par l'URL Railway de l'étape 3.

6. **Deploy** → Attendez 1 minute

---

## ✅ C'est Fait !

Votre site est en ligne ! 🎉

**Testez** : Allez sur votre URL Vercel (ex: `codm-community.vercel.app`)

**Connexion test** : 
- Email : `player1@codm.fr`
- Password : `password123`

---

## 🔧 Dernière étape : CORS

Retournez dans Railway → Variables du Backend → Modifiez `CLIENT_URL` :

```
CLIENT_URL=https://VOTRE_SITE.vercel.app
```

(Remplacez par votre vraie URL Vercel)

Railway redéploiera automatiquement. Attendez 30 secondes.

---

## 🎯 URLs à retenir

| Service | URL |
|---------|-----|
| **Site Web** | https://VOTRE_SITE.vercel.app |
| **API Backend** | https://VOTRE_BACKEND.railway.app/api |
| **Admin** | admin@codm.fr / password123 |

---

## ❓ Problèmes ?

**Erreur CORS** : Vérifiez que `CLIENT_URL` dans Railway = URL Vercel exacte

**Chat ne marche pas** : Railway supporte WebSockets par défaut, rechargez la page

**Build failed** : Consultez les logs dans Vercel → Deployments → Logs

---

## 💰 Gratuit ?

✅ Oui ! Railway offre 500h/mois gratuit (suffisant pour ce projet)
✅ Vercel est 100% gratuit pour ce type d'usage

---

## 📱 Domaine personnalisé (optionnel)

**Vercel** : Settings → Domains → Ajoutez votre domaine
Vous pouvez acheter un domaine sur Namecheap (~10€/an)

---

**Félicitations ! Votre plateforme gaming est en ligne ! 🎮**
