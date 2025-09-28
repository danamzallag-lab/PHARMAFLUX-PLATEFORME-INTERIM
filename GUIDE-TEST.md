# 🧪 Guide de Test - PharmaFlux Phase 1

Ce guide vous permet de tester rapidement le workflow complet de la plateforme PharmaFlux avec Supabase et RLS.

## ⚡ Démarrage rapide

### 1. Configuration Supabase
```sql
-- 1. Exécutez le contenu de `supabase/schema.sql` dans l'éditeur SQL Supabase
-- 2. Vérifiez que les tables sont créées :
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 3. Vérifiez les politiques RLS :
SELECT * FROM pg_policies;
```

### 2. Lancement de l'application
```bash
# Variables déjà configurées dans .env
npm run dev
```

Application disponible sur `http://localhost:3000`

## 🎭 Scénarios de test

### Scénario 1: Workflow Employeur complet

#### Étape 1: Inscription Employeur
1. **Page d'accueil** → Cliquer "Je recrute des talents"
2. **Authentification** → Onglet "Inscription"
   - Type: **Employeur**
   - Email: `employeur-test@pharmaflux.com`
   - Nom: `Pharmacie Test`
   - Mot de passe: `TestPharmacieSecure123`
3. **Validation** → Vérifier l'email Supabase (ou check console)

#### Étape 2: Publication de Mission
1. **Dashboard Employeur** → Clic "Nouvelle mission"
2. **Formulaire mission**:
   ```
   Titre: Remplacement Pharmacien Adjoint Urgent
   Type: Officine
   Description: Recherche pharmacien adjoint pour remplacement week-end.
                Expérience officine requise, préparations magistrales.
   Adresse: 123 Rue de Rivoli, 75001 Paris
   Date début: [Date future, ex: dans 3 jours]
   Heure début: 09:00
   Heure fin: 19:00
   Taux horaire: 28.50
   ```
3. **Publication** → Clic "Publier la mission"

#### Étape 3: Vérification Matching
```sql
-- Vérifiez dans Supabase que la mission est créée
SELECT * FROM missions ORDER BY created_at DESC LIMIT 1;

-- Vérifiez les candidatures générées (si candidats existants)
SELECT * FROM applications WHERE mission_id = 'votre-mission-id';
```

### Scénario 2: Workflow Candidat complet

#### Étape 1: Inscription Candidat
1. **Nouvelle session/onglet** → Ouvrir `http://localhost:3000`
2. **Authentification** → "Je cherche un emploi"
3. **Inscription**:
   - Type: **Candidat**
   - Email: `candidat-test@pharmaflux.com`
   - Prénom: `Marie`
   - Nom: `Dubois`
   - Mot de passe: `TestCandidatSecure123`

#### Étape 2: Configuration Profil
```sql
-- Simuler un profil candidat avec compétences
UPDATE profiles
SET
  competences = ARRAY['officine', 'pharmacien'],
  latitude = 48.8580,
  longitude = 2.3510,
  availabilities = '[
    {"date": "2024-02-15", "startTime": "09:00", "endTime": "19:00"},
    {"date": "2024-02-16", "startTime": "09:00", "endTime": "17:00"}
  ]'::jsonb
WHERE email = 'candidat-test@pharmaflux.com';
```

#### Étape 3: Test Matching Automatique
```sql
-- Déclencher le matching manuellement pour test
SELECT * FROM find_matching_candidates('votre-mission-id');

-- Créer une candidature manuelle si besoin
INSERT INTO applications (candidate_id, mission_id, status)
SELECT
  (SELECT id FROM profiles WHERE email = 'candidat-test@pharmaflux.com'),
  'votre-mission-id',
  'proposé';
```

#### Étape 4: Acceptation Mission
1. **Dashboard Candidat** → Vérifier mission proposée
2. **Action** → Clic "Accepter" sur une mission
3. **Vérification** → Status passe à "accepté"

### Scénario 3: Génération Contrat

#### Test Automatique
```sql
-- Vérifiez qu'un contrat est généré après acceptation
SELECT * FROM contracts WHERE mission_id = 'votre-mission-id';

-- Simuler génération contrat si pas automatique
INSERT INTO contracts (mission_id, contract_pdf_url)
VALUES ('votre-mission-id', 'https://fake-contract-url.pdf');
```

## 🔍 Vérifications importantes

### 1. Politiques RLS actives
```sql
-- Vérifiez que RLS est activé sur toutes les tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'missions', 'applications', 'contracts');
```

### 2. Données de test cohérentes
```sql
-- Vérifiez la cohérence des données
SELECT
  m.title,
  m.status,
  e.name AS employer_name,
  COUNT(a.id) AS applications_count
FROM missions m
JOIN profiles e ON e.id = m.employer_id
LEFT JOIN applications a ON a.mission_id = m.id
GROUP BY m.id, m.title, m.status, e.name
ORDER BY m.created_at DESC;
```

### 3. Authentification fonctionnelle
```sql
-- Vérifiez les utilisateurs créés
SELECT
  au.email,
  p.type,
  p.name,
  p.created_at
FROM auth.users au
JOIN profiles p ON p.auth_uid = au.id
ORDER BY p.created_at DESC;
```

## 🐛 Débogage courant

### Problème: Matching ne fonctionne pas
```sql
-- Debug: Vérifiez la fonction RPC
SELECT * FROM find_matching_candidates('mission-test-id');

-- Debug: Données candidats
SELECT id, email, competences, latitude, longitude
FROM profiles
WHERE type = 'candidat';
```

### Problème: RLS bloque les requêtes
```sql
-- Temporairement désactiver RLS pour test (DEV ONLY!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ... faire vos tests ...
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Problème: Authentification échoue
```javascript
// Dans la console développeur
localStorage.clear(); // Vider le cache auth
// Puis rafraîchir la page
```

## 📊 Dashboard de test

### Mode développement avec mock data
Les dashboards utilisent automatiquement des données de test en mode développement (`VITE_APP_ENV=development`).

**Données mock disponibles**:
- 3 profils (1 employeur, 2 candidats)
- 3 missions types
- Candidatures avec différents statuts
- Statistiques simulées

### Basculer entre mock et vraies données
```javascript
// Dans src/services/mockData.ts
export const isDevelopmentMode = () => {
  return false; // Forcer les vraies données
}
```

## ✅ Checklist de validation

- [ ] **Authentification**: Inscription employeur/candidat
- [ ] **Navigation**: Redirections automatiques selon type utilisateur
- [ ] **Missions**: Création mission via formulaire
- [ ] **Matching**: RPC `find_matching_candidates` fonctionne
- [ ] **Applications**: Candidatures créées automatiquement
- [ ] **Actions**: Accepter/refuser candidatures
- [ ] **Contrats**: Génération automatique après acceptation
- [ ] **RLS**: Chaque utilisateur voit seulement ses données
- [ ] **UI**: Dashboards affichent données correctes
- [ ] **Notifications**: Messages toast fonctionnent

## 🚀 Prochaines étapes (Phase 2)

Une fois la Phase 1 validée:

1. **API Endpoints**: Implémenter `/api/missions`, `/api/contracts`
2. **Emails**: Intégrer Resend pour notifications
3. **PDF**: Puppeteer pour génération contrats
4. **Signature**: Yousign pour signature électronique
5. **Monitoring**: Logs et métriques
6. **Tests**: Suite de tests automatisés

---

**🎯 Objectif Phase 1**: Workflow complet fonctionnel avec Supabase RLS, sans APIs externes.

**🏆 Critère de succès**: Un employeur peut publier une mission, un candidat peut l'accepter, et un contrat HTML est généré automatiquement.