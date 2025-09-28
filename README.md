
# 🚀 PharmaFlux - Plateforme d'Intérim Pharmaceutique

Une application web moderne pour connecter les professionnels de santé pharmaceutique avec les établissements proposant des missions d'intérim.

## 🌟 Fonctionnalités

### Pour les Candidats
- ✨ **Inscription/Connexion sécurisée** avec Supabase Auth
- 📊 **Dashboard personnalisé** avec statistiques et activités
- 🔍 **Recherche de missions** par localisation et type
- 💼 **Gestion des candidatures** en temps réel
- ⭐ **Programme de fidélité** avec points et récompenses

### Pour les Employeurs
- 📝 **Publication de missions** (officines, hôpitaux, cliniques)
- 👥 **Gestion des candidatures** reçues
- 📈 **Tableaux de bord** avec métriques
- 🔄 **Suivi des contrats** et missions

### Fonctionnalités Techniques
- 🎨 **Interface moderne** avec Tailwind CSS et Framer Motion
- 🔐 **Authentification sécurisée** avec Supabase
- 📱 **Design responsive** compatible mobile/desktop
- ⚡ **Performance optimisée** avec Vite
- 🗄️ **Base de données PostgreSQL** avec RLS (Row Level Security)

## 🛠️ Technologies

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Animation:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Build:** Vite
- **UI Components:** Custom components + Shadcn/ui
- **Icons:** Lucide React

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/pharmaflux.git
cd pharmaflux
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
```bash
cp .env.example .env
```

4. **Configurer Supabase**
- Créer un projet sur [Supabase](https://supabase.com)
- Exécuter le script SQL `supabase_schema_clean.sql`
- Mettre à jour les variables dans `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

5. **Lancer l'application**
```bash
npm run dev
```

## 📋 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI réutilisables
│   ├── AuthPage.tsx    # Authentification
│   ├── LandingPage.tsx # Page d'accueil
│   └── ...
├── hooks/              # Hooks personnalisés
├── lib/                # Configuration (Supabase, etc.)
└── main.tsx           # Point d'entrée

supabase/
├── migrations/         # Migrations de base de données
└── functions/         # Edge functions
```

## 🔧 Configuration Supabase

1. **Tables principales:**
   - `profiles` - Profils utilisateurs (candidats/employeurs)
   - `missions` - Offres d'intérim
   - `applications` - Candidatures
   - `contracts` - Contrats générés

2. **Sécurité RLS:**
   - Politique de sécurité au niveau des lignes
   - Authentification Supabase intégrée
   - Permissions granulaires par rôle

## 🚦 Scripts Disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run preview      # Aperçu du build
npm run lint         # Vérification ESLint (si configuré)
```

## 🎯 Démo

L'application est accessible en local sur `http://localhost:3000` après installation.

**Fonctionnalités testées:**
- ✅ Inscription/Connexion
- ✅ Navigation entre pages
- ✅ Dashboard candidat
- ✅ Page missions pharmaceutiques
- ✅ Interface responsive

## 📄 Licence

Ce projet est développé dans un cadre personnel/éducatif.

---

*Développé avec ❤️ pour faciliter l'intérim pharmaceutique*

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  