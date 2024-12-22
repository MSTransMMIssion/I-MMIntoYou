# IMMIntoYou - Guide d'installation et d'utilisation

IMMIntoYou est une application de mise en relation développée avec React et Prisma. Ce guide vous accompagnera dans l'installation, la configuration, et l'utilisation du projet sur votre machine locale.

---

## 🚀 Fonctionnalités principales

- Inscription et connexion des utilisateurs.
- Système de matching basé sur des préférences utilisateurs.
- Gestion de profils utilisateurs avec photos et informations personnelles.
- Interface de chat et messagerie.
- Données pré-remplies pour une démonstration immersive.

---

## 🛠️ Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- Prisma CLI : installez-la globalement avec la commande suivante :

  ```bash
  npm install -g prisma
  ```

---

## ⚙️ Installation

### 1. Cloner le projet

Clonez le repository sur votre machine locale :

```bash
git clone https://github.com/MSTransMMIssion/I-MMIntoYou.git \
  &&
cd I-MMIntoYou
```

### 2. Installer les dépendances

Installez toutes les dépendances nécessaires avec npm :

```bash
npm install
```

### 3. Configurer la base de données

IMMIntoYou utilise une base de données SQLite pour stocker les informations.

- **Créer le fichier SQLite et configurer Prisma :**

  ```bash
  mkdir -p src/app/api/database \
    &&
  touch src/app/api/database/db.sqlite \
    &&
  npx prisma init \
    &&
  npx prisma db push
  ```

- **Optionnel : Modifier le schéma Prisma**  
  Si vous souhaitez personnaliser les modèles de données, modifiez le fichier `prisma/schema.prisma` avant d'exécuter `npx prisma db push`.

### 4. Lancer le projet

Démarrez l'application en mode développement :

```bash
npm run dev
```

### 5. Réinitialiser et peupler la base de données (ordre important)

#### a. Réinitialiser les tables de la base de données

```bash
node prisma/reset.js
```

#### b. Peupler la base de données avec des données factices

Ce script génère :
- Un compte administrateur.
- Des utilisateurs factices avec des interactions pré-remplies (likes, matches et messages vers le compte admin).

```bash
node prisma/seed.js
```

#### c. Lancer l'API Prisma

```bash
node prisma/server.js
```

---

## 🔑 Compte Administrateur

Un compte administrateur est créé par défaut lors de l'exécution du script de peuplement (`seed.js`). Utilisez les identifiants suivants pour vous connecter :

- **Email :** `admin@example.com`
- **Mot de passe :** `securepassword`

---

## 📂 Arborescence du projet

Voici une vue d'ensemble des principaux répertoires et fichiers :

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── database/
│   │   │   │   └── db.sqlite
│   │   │   └── server.js
│   ├── components/
│   ├── pages/
│   │   ├── index.js
│   │   ├── profile.js
│   │   ├── match.js
│   │   └── ...
│   └── ...
├── prisma/
│   ├── schema.prisma
│   ├── reset.js
│   └── seed.js
├── package.json
├── README.md
└── ...
```

---

## 📜 Commandes utiles

### Lancer l'application

```bash
npm run dev
```

### Réinitialiser la base de données

```bash
node prisma/reset.js
```

### Ajouter des données factices

```bash
node prisma/seed.js
```

### Démarrer l'API Prisma

```bash
node prisma/server.js
```

---

## 📄 Licence

Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

---

## 💬 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue ou à contacter l'administrateur du projet.

**Contact Enseignant :** steffy3D@hotmail.com

**Contact Étudiant :** antonin.pamart@etu.univ-grenoble-alpes.fr / paris.gougne@etu.univ-grenoble-alpes.fr

---

**Bon codage et bonne découverte de l'application ! 🚀**
