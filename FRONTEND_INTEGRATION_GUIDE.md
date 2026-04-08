# 🌐 Frontend Vercel Integration Guide

## 🔗 **Configuration Actuelle**

### Backend URL
```
https://kung-fu-backend.onrender.com
```

### Frontend URL
```
https://kung-fu-frontend.vercel.app
```

### Environment Variables
```env
# frontend/.env.production
VITE_API_URL=https://kung-fu-backend.onrender.com/api
```

---

## 🧪 **Tests d'Intégration**

### 1. **Test Manuel Navigateur**
Ouvrez ces URLs dans votre navigateur :

- **Health Check:** https://kung-fu-backend.onrender.com/api/health
- **API Info:** https://kung-fu-backend.onrender.com/api
- **Test Config:** https://kung-fu-backend.onrender.com/api/test

### 2. **Test avec JavaScript**
```javascript
// Dans la console du navigateur sur https://kung-fu-frontend.vercel.app
fetch('https://kung-fu-backend.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend OK:', data))
  .catch(err => console.error('❌ Backend Error:', err));
```

### 3. **Test Authentification**
```javascript
// Test Register
fetch('https://kung-fu-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'test_user',
    email: 'test@example.com',
    password: 'Test1234!'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Register:', data));

// Test Login
fetch('https://kung-fu-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'test_user',
    password: 'Test1234!'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Login:', data));
```

---

## 📱 **Tests dans l'Application Frontend**

### 1. **Ouvrir l'Application**
```
https://kung-fu-frontend.vercel.app
```

### 2. **Vérifier la Console**
- Ouvrez les outils de développement (F12)
- Regardez l'onglet "Console"
- Cherchez les erreurs de connexion

### 3. **Tester les Fonctionnalités**
- **Page de connexion:** Tentez de vous connecter
- **Inscription:** Créez un nouveau compte
- **Dashboard:** Vérifiez l'affichage des données

---

## 🔍 **Dépannage**

### Si le Frontend ne se connecte pas :

1. **Vérifiez l'URL API:**
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

2. **Testez CORS:**
   ```javascript
   fetch('https://kung-fu-backend.onrender.com/api/health', {
     headers: { 'Origin': 'https://kung-fu-frontend.vercel.app' }
   })
   ```

3. **Vérifiez les erreurs réseau:**
   - Ouvrez l'onglet "Network" dans les outils de développement
   - Regardez les requêtes API
   - Vérifiez les codes de statut

### Erreurs Communes :

**CORS Error:**
```
Access to fetch at 'https://kung-fu-backend.onrender.com/api' from origin 'https://kung-fu-frontend.vercel.app' has been blocked by CORS policy
```
**Solution:** Vérifiez que `FRONTEND_URL=https://kung-fu-frontend.vercel.app` est configuré sur Render.

**Network Error:**
```
Failed to fetch
```
**Solution:** Vérifiez que le backend est accessible et que les routes existent.

---

## 🎯 **Validation Finale**

### ✅ **Checklist Succès:**
- [ ] Backend accessible: `https://kung-fu-backend.onrender.com/api/health`
- [ ] Frontend charge: `https://kung-fu-frontend.vercel.app`
- [ ] Pas d'erreurs CORS dans la console
- [ ] Register/Login fonctionnent
- [ ] Les données s'affichent dans le frontend
- [ ] Les requêtes API apparaissent dans l'onglet Network

### 🎉 **Une fois validé:**
Votre application full-stack est 100% fonctionnelle !
- Backend Render ✅
- Frontend Vercel ✅
- Base de données TiDB ✅
- Authentification ✅
- Communication API ✅

---

## 📞 **Support**

Si vous avez des problèmes :
1. Vérifiez les logs Render
2. Vérifiez la console du navigateur
3. Testez avec les scripts ci-dessus
4. Contactez-moi pour plus d'aide

**Votre application sera bientôt prête pour la production !** 🚀
