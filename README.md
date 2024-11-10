# Discord Remake

Ce projet est une application web de messagerie instantanée inspirée de Discord, développée avec React, TypeScript et Vite. L'application permet aux utilisateurs de s'inscrire, se connecter, envoyer des messages, et gérer des demandes d'amis.

## Fonctionnalités

- **Inscription et Connexion** : Les utilisateurs peuvent créer un compte et se connecter.
- **Envoi de Messages** : Les utilisateurs peuvent envoyer des messages à leurs amis.
- **Gestion des Demandes d'Amis** : Les utilisateurs peuvent envoyer et accepter des demandes d'amis.
- **Notifications** : Les utilisateurs reçoivent des notifications pour les nouveaux messages et les demandes d'amis.

## Technologies Utilisées

- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **TypeScript** : Superset de JavaScript qui ajoute des types statiques.
- **Vite** : Outil de build rapide pour les projets front-end.
- **Zustand** : Bibliothèque de gestion d'état pour React.
- **React Hook Form** : Bibliothèque pour gérer les formulaires dans React.
- **Axios** : Client HTTP pour effectuer des requêtes vers l'API.
- **React Router** : Bibliothèque pour la gestion des routes dans une application React.
- **React Toastify** : Bibliothèque pour afficher des notifications toast.

## Installation

1.Clonez le dépôt :

```bash
git clone https://github.com/votre-utilisateur/frontend-discord.git
cd frontend-discord
```

2.Installez les dépendances :

```bash
npm install
```

3.Créez un fichier `.env` à la racine du projet et ajoutez l'URL de votre API :

```env
VITE_API_BASE_URL=http://localhost:3000
```

4.Lancez l'application en mode développement :

```bash
  npm run dev
```

## Scripts Disponibles

- `npm run dev` : Lance l'application en mode développement.
- `npm run build` : Construit l'application pour la production.
- `npm run lint` : Lint le code source.
- `npm run preview` : Prévisualise l'application construite.

## Structure du Projet

- `src/` : Contient le code source de l'application.
  - `components/` : Composants React réutilisables.
  - `pages/` : Pages de l'application.
  - `utils/` : Fonctions utilitaires et hooks personnalisés.
  - `App.tsx` : Composant principal de l'application.
  - `index.tsx` : Point d'entrée de l'application.

## Configuration TypeScript

Le projet utilise une configuration TypeScript stricte pour garantir la qualité du code. Les options de compilation sont définies dans `tsconfig.app.json`.

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request pour toute amélioration ou correction de bug.
