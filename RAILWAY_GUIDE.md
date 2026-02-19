# Railway Deployment - Guide Simple

## 🚂 Configuration Railway - Étape par Étape

### ÉTAPE 1 : Créer le projet MySQL

1. Allez sur https://railway.app
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Provision MySQL"**
4. Attendez que MySQL soit déployé (30 secondes)

### ÉTAPE 2 : Noter les informations MySQL

1. Cliquez sur le service **MySQL** (cube violet)
2. Allez dans l'onglet **"Variables"**
3. **IMPORTANT** : Copiez ces valeurs dans un fichier texte :
   ```
   MYSQLHOST=containers-us-west-xxx.railway.app
   MYSQLPORT=6543
   MYSQLUSER=root
   MYSQLPASSWORD=xxxxxxxxxxxxxxxxxx
   MYSQLDATABASE=railway
   ```

### ÉTAPE 3 : Ajouter le Backend

1. Dans le MÊME projet, cliquez sur **"+ New"** en haut à droite
2. Sélectionnez **"GitHub Repo"**
3. Autorisez Railway à accéder à GitHub (si demandé)
4. Sélectionnez le repo **"codm-community"**
5. Cliquez sur **"Deploy"**

### ÉTAPE 4 : Configurer les Variables d'Environnement

1. Cliquez sur le service **Backend** (celui qui vient d'être créé)
2. Allez dans l'onglet **"Variables"**
3. Cliquez sur **"+ New Variable"** et ajoutez UNE PAR UNE :

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://votre-site.vercel.app

# Copiez depuis MySQL (étape 2)
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=6543
DB_USER=root
DB_PASSWORD=xxxxxxxxxxxxxxxxxx
DB_NAME=railway

# JWT Secrets (générez des valeurs aléatoires)
JWT_SECRET=ChangezMoiAvecUnSecretTresLong32Caracteres
JWT_REFRESH_SECRET=ChangezMoiAvecUnAutreSecretTresLong32
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

4. Cliquez sur **"Add"** ou **"Save"** après chaque variable

### ÉTAPE 5 : Configurer les paramètres de déploiement

1. Toujours dans le service Backend, allez dans **"Settings"**
2. Dans **"Build"**, configurez :
   - **Root Directory** : Laissez vide (ou mettez `/`)
   - **Build Command** : `cd backend && npm install`
   - **Start Command** : `cd backend && npm start`
3. Cliquez sur **"Save"**

### ÉTAPE 6 : Redéployer

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **3 points** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Attendez 2-3 minutes

### ÉTAPE 7 : Exécuter les migrations

1. Dans le service Backend, allez dans l'onglet **"Settings"**
2. Trouvez **"Deploy Trigger"** ou utilisez le Terminal
3. Ouvrez le **Terminal** (onglet en bas)
4. Exécutez :
   ```bash
   cd backend
   npm run migrate:prod
   npm run seed:prod
   ```

### ÉTAPE 8 : Obtenir l'URL du Backend

1. Dans le service Backend, allez dans **"Settings"**
2. Section **"Domains"**
3. Cliquez sur **"Generate Domain"**
4. Copiez l'URL (exemple: `codm-backend.up.railway.app`)

### ÉTAPE 9 : Tester

Ouvrez dans votre navigateur :
```
https://VOTRE_URL.railway.app/api/health
```

Vous devriez voir :
```json
{"status":"OK","message":"Serveur CODM Community en ligne"}
```

## ✅ Checklist

- [ ] MySQL créé
- [ ] Variables MySQL copiées
- [ ] Backend déployé depuis GitHub
- [ ] Variables d'environnement ajoutées (11 variables)
- [ ] Build/Start commands configurés
- [ ] Migrations exécutées
- [ ] URL générée
- [ ] API testée et fonctionne

## 🆘 Problèmes courants

### "Build failed"
➡️ Vérifiez que Build Command = `cd backend && npm install`

### "Application failed to respond"
➡️ Vérifiez que Start Command = `cd backend && npm start`

### "Database connection error"
➡️ Vérifiez que les variables DB_HOST, DB_PORT, etc. sont correctes

### "Port already in use"
➡️ Supprimez la variable PORT ou mettez PORT=8080

## 📞 Besoin d'aide ?

Dites-moi à quelle étape vous êtes bloqué et je vous aiderai !
