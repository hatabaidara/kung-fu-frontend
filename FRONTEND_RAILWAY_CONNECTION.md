# 🔗 Frontend Vercel + Backend Railway Connection Guide

## ✅ Configuration Effectuée

### 1. API Service mis à jour
```typescript
// src/services/api.ts
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://VOTRE-BACKEND.railway.app/api';
```

### 2. Variables d'environnement
```bash
# .env.example
VITE_API_URL=https://VOTRE-BACKEND.railway.app/api
```

### 3. TypeScript corrigé
- ✅ Headers typés correctement
- ✅ import.meta.env géré
- ✅ Plus d'erreurs TypeScript

## 🚀 Actions Requises

### ÉTAPE 1: Remplacer l'URL Railway
Dans les fichiers ci-dessus, remplacez :
```
https://VOTRE-BACKEND.railway.app
```
Par votre vraie URL Railway :
```
https://votre-produt-backend.railway.app
```

### ÉTAPE 2: Configurer Vercel
Dans votre projet Vercel :
1. Allez dans Settings → Environment Variables
2. Ajoutez : `VITE_API_URL` = `https://votre-backend.railway.app/api`

### ÉTAPE 3: Déployer le frontend
```bash
git add .
git commit -m "Connect frontend to Railway backend"
git push origin main
```

## 🧪 Tests de Connexion

### Test depuis le navigateur
```javascript
// Dans la console du frontend
fetch('https://votre-backend.railway.app/api/health')
  .then(res => res.json())
  .then(data => console.log('API OK:', data))
  .catch(err => console.error('API Error:', err));
```

### Test depuis le frontend
Le fichier `api-test.js` testera automatiquement :
- ✅ Health check
- ✅ CORS headers  
- ✅ Endpoints API

## 🔍 Vérification

Une fois déployé, vérifiez :
1. **Backend Railway** : `https://votre-backend.railway.app/` → "Backend is running 🚀"
2. **Frontend Vercel** : Console navigateur → Pas d'erreurs CORS
3. **Appels API** : Réseau dans DevTools → Status 200

## 🛠️ Dépannage

### CORS bloqué
- Vérifiez `FRONTEND_URL` dans Railway
- Ajoutez votre domaine Vercel exact

### API inaccessible  
- Vérifiez l'URL Railway
- Confirmez que le backend est déployé

### Variables d'environnement
- Redéployez Vercel après avoir ajouté les variables
- Vérifiez les logs Vercel

**Votre frontend est maintenant configuré pour Railway !** 🎉
