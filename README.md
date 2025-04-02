# 📝 SiteBlog - Plateforme de Blog Vue.js

## ⚠️ État du Projet
🚧 **Projet en cours de développement** 🚧

Ce projet est actuellement en développement actif. De nouvelles fonctionnalités sont régulièrement ajoutées et des modifications importantes peuvent survenir. La documentation sera mise à jour en conséquence.


## 📋 Description
SiteBlog est une application web de blog moderne construite avec Vue.js et Node.js. Les utilisateurs peuvent créer, gérer et partager des articles, interagir via des commentaires et personnaliser leur profil.

## ⭐ Fonctionnalités Principales
- Authentification utilisateur (connexion/inscription)
- Gestion complète des articles (CRUD)
- Système de catégorisation des articles
- Commentaires sur les articles
- Profils utilisateurs personnalisables
- Interface responsive avec Bootstrap 5

## 🛠️ Technologies
### Frontend
- Vue.js 3
- Vue Router
- Bootstrap 5
- Bootstrap Icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- Bcrypt

## 📦 Installation

### Prérequis
- Node.js (v14+)
- PostgreSQL
- npm

### Étapes d'installation

1. **Cloner le projet**
```sh
git clone [votre-repo]
cd siteblog
```

2. **Installer les dépendances**
```sh
npm install
```

3. **Configuration de la base de données**
- Créer une base de données MySQL nommée "siteblog"
- Importer le fichier SQL fourni : `blogdatabase.sql`

```

4. **Lancer l'application**
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## 🗺️ Structure du Projet
```
siteblog/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── views/         # Pages de l'application
│   ├── server/        # Configuration serveur Express
│   ├── backend/       # Logique base de données
│   └── router/        # Routes Vue
└── public/            # Assets statiques
```

## 📱 Pages Principales
- `/` - Connexion
- `/register` - Inscription
- `/MainMenu` - Accueil
- `/vos-articles` - Articles de l'utilisateur
- `/article/:id` - Vue article
- `/creer-article` - Création d'article
- `/profil` - Profil utilisateur

## 🔒 Sécurité
- Mots de passe hashés avec bcrypt
- Authentification par JWT
- Protection des routes sensibles
- Validation des données entrantes

## 🚀 Démarrage Rapide
1. Connectez-vous ou créez un compte
2. Accédez au menu principal
3. Créez votre premier article
4. Gérez vos articles depuis "Vos Articles"
5. Personnalisez votre profil

## 🤝 Contribution
Les contributions sont bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request


## 📧 Contact
Votre email - [traorekoba036@gmail.com]

Lien du projet: [https://github.com/BaKabo77/SiteBlog]
