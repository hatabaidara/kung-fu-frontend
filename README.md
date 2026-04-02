# 🏋️‍♂️ Sport Gym Management - Frontend

## 📋 Description

Frontend de l'application de gestion de gym Sport Gym Management, développé avec React, TypeScript et Material-UI.

## 🚀 Technologies

- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Material-UI (MUI)** - Bibliothèque de composants
- **React Router** - Gestion des routes
- **Axios/Fetch** - Communication avec l'API

## 📱 Fonctionnalités

- 🏋️‍♂️ **Dashboard** avec statistiques et graphiques
- 👥 **Gestion des membres** (CRUD complet)
- 💳 **Système de paiements** et facturation
- 📅 **Suivi des présences** et pointages
- 📢 **Annonces internes** et communications
- 🔐 **Authentification** sécurisée avec JWT
- 📊 **Rapports** et analyses
- 🎨 **Interface responsive** et moderne

## 🛠️ Installation

```bash
# Cloner le repository
git clone git@github.com:hatabaidara/kung-fu-frontend.git
cd kung-fu-frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🌐 Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:3001/api
```

## 📦 Scripts Disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser le build de production
```

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/    # Composants UI réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Context providers
│   │   ├── services/      # Services API
│   │   ├── types/         # Types TypeScript
│   │   └── utils/         # Utilitaires
│   ├── main.tsx           # Point d'entrée
│   └── styles/            # Styles globaux
├── public/                # Assets statiques
├── package.json           # Dépendances et scripts
└── vite.config.ts         # Configuration Vite
```

## 🔗 API Integration

Le frontend communique avec l'backend via l'API REST :

```typescript
// Exemple d'appel API
import { apiService } from './app/services/api';

// Authentification
const login = await apiService.login(username, password);

// Gestion des membres
const members = await apiService.getMembers();
const newMember = await apiService.createMember(memberData);
```

## 🎨 Design System

L'application utilise Material-UI comme design system :
- **Palette de couleurs cohérente**
- **Composants réutilisables**
- **Thème clair/sombre**
- **Design responsive**

## 🔐 Sécurité

- **Tokens JWT** pour l'authentification
- **Stockage sécurisé** dans localStorage
- **Validation des données** côté client
- **Protection CSRF**

## 📱 Responsive Design

L'interface est optimisée pour :
- 📱 **Mobile** (320px+)
- 📱 **Tablette** (768px+)
- 💻 **Desktop** (1024px+)

## 🚀 Déploiement

### **Vercel (Recommandé)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### **Autres plateformes**
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Committer les changements (`git commit -m 'Add amazing feature'`)
4. Pusher la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Material-UI** pour les composants UI
- **Vite** pour le build tool ultra-rapide
- **React** pour le framework JavaScript
- **TypeScript** pour le typage statique

---

## 🎯 Projet Complet

Ce frontend fait partie du projet complet **Sport Gym Management** :

- **Frontend** : Ce repository
- **Backend** : [kung-fu-backend](https://github.com/hatabaidara/kung-fu-backend)
- **Database** : TiDB Cloud

---

**🎊 Développé avec ❤️ pour les passionnés de fitness !**
