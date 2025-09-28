# PharmaFlux - Plateforme d'Intérim Pharmaceutique

Une plateforme moderne d'intérim dédiée aux métiers de la pharmacie (pharmaciens, préparateurs, étudiants). Le système utilise React (Vite) avec Supabase pour une solution complète d'intérim tripartite respectant la législation française.

## 🚀 Fonctionnalités

### Version 1.0 (MVP)
- ✅ **Authentification sécurisée** (Supabase Auth)
- ✅ **Gestion des profils** candidats et employeurs
- ✅ **Publication de missions** avec formulaire complet
- ✅ **Matching automatique** basé sur compétences et géolocalisation
- ✅ **Génération de contrats** HTML automatisée
- ✅ **Interface responsive** avec animations
- ✅ **Conformité légale française**

### Version 1.1 (À venir)
- 📧 **Notifications email**
- 💰 **Système de paie** automatisé
- 🏆 **Programme de fidélité**
- 👥 **Parrainage**

## 🛠 Technologies

- **Frontend**: React 18, Vite, TypeScript
- **UI/UX**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Déploiement**: Vercel

## 📦 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configuration Supabase

#### Créer le projet
1. Compte sur [supabase.com](https://supabase.com)
2. Nouveau projet
3. Noter URL et ANON_KEY

#### Exécuter le script SQL
```sql
-- Copier le contenu de supabase/schema.sql
-- dans l'éditeur SQL Supabase
```

### 3. Variables d'environnement
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### 4. Lancer le projet
```bash
npm run dev
```

## 🏗 Architecture

### Base de données
- `profiles`: utilisateurs candidats/employeurs
- `missions`: offres d'intérim
- `applications`: candidatures/propositions
- `contracts`: contrats générés
- `loyalty_points`: système fidélité
- `referrals`: parrainage

### Structure du code
```
src/
├── components/          # Composants React
├── hooks/              # useAuth, etc.
├── services/           # missionService, contractService
├── lib/               # supabase config
└── styles/            # Tailwind
```

## 📋 Utilisation

### Flux Employeur
1. Inscription avec type "employeur"
2. Compléter le profil entreprise
3. Publier une mission
4. Matching automatique
5. Sélection candidat
6. Contrat généré

### Flux Candidat
1. Inscription avec type "candidat"
2. Profil + compétences
3. Réception propositions
4. Accepter/Refuser missions
5. Signature contrat

## 🔒 Conformité légale

### Législation française
- ✅ Intérim tripartite respecté
- ✅ Mentions légales obligatoires
- ✅ Convention collective pharmacie
- ✅ Plafonds horaires (48h/semaine max)
- ✅ URSSAF et TVA

### Sécurité
- 🔐 Authentification Supabase
- 🛡 RLS Policies
- 🔒 HTTPS obligatoire
- 📝 Audit trail

## 🚀 Déploiement

### Vercel
1. Connecter repo à Vercel
2. Variables d'environnement
3. Déploiement automatique

## 📈 Roadmap V1.1

### Fonctionnalités
- [ ] Email transactionnel
- [ ] Paiement automatisé
- [ ] Mobile app React Native
- [ ] API publique
- [ ] Dashboard analytics

### Techniques
- [ ] Tests automatisés
- [ ] CI/CD
- [ ] Monitoring
- [ ] PWA

---

**PharmaFlux** - *Révolutionnons l'intérim pharmaceutique* 💊⚡

## État d'avancement

✅ Architecture Supabase complète
✅ Authentification fonctionnelle
✅ Création et matching de missions
✅ Génération de contrats
✅ Interface utilisateur responsive
✅ Conformité légale française

Le MVP est fonctionnel et déployable !