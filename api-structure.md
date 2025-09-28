# Structure API Phase 2 - PharmaFlux

Cette documentation décrit la structure des endpoints API pour la Phase 2, quand nous passerons d'une architecture client-only à une architecture hybride avec des endpoints serveur sécurisés.

## 📁 Structure des dossiers

```
/api/
├── missions/
│   ├── index.js            # POST /api/missions (créer mission + matching)
│   ├── [id]/
│   │   ├── match.js        # POST /api/missions/[id]/match (re-run matching)
│   │   └── applications.js # GET /api/missions/[id]/applications (candidatures)
├── contracts/
│   ├── index.js            # POST /api/contracts (générer contrat)
│   ├── [id]/
│   │   ├── pdf.js          # GET /api/contracts/[id]/pdf (télécharger PDF)
│   │   └── sign.js         # POST /api/contracts/[id]/sign (signer contrat)
├── applications/
│   ├── [id]/
│   │   └── status.js       # PUT /api/applications/[id]/status (accepter/refuser)
├── notifications/
│   ├── email.js            # POST /api/notifications/email (envoyer email)
│   └── sms.js              # POST /api/notifications/sms (envoyer SMS)
└── auth/
    └── callback.js         # GET /api/auth/callback (callback signature)
```

## 🔐 Configuration des clés

### Variables d'environnement à ajouter
```env
# Supabase (côté serveur)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Email transactionnel
RESEND_API_KEY=your_resend_api_key

# Signature électronique
YOUSIGN_API_KEY=your_yousign_api_key
YOUSIGN_WEBHOOK_SECRET=your_webhook_secret

# PDF Generation
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## 🎯 Endpoints détaillés

### 1. POST /api/missions
**But**: Créer une mission + matching automatique + notifications

```javascript
// Body
{
  "title": "Remplacement Pharmacien",
  "description": "...",
  "type": "officine",
  "location": "123 Rue de Paris",
  "start_date": "2024-02-15",
  "start_time": "09:00",
  "end_time": "19:00",
  "hourly_rate": 28.50
}

// Réponse
{
  "success": true,
  "mission": { ... },
  "candidates_matched": 3,
  "applications_created": 3
}
```

**Flux interne**:
1. Authentification utilisateur (JWT)
2. Validation profil employeur
3. Géocodage adresse
4. Insert mission (avec SERVICE_ROLE_KEY)
5. RPC `find_matching_candidates(mission_id)`
6. Insert applications pour chaque candidat
7. Envoi emails candidats (Resend)
8. Retour résultat

### 2. POST /api/contracts
**But**: Générer contrat HTML -> PDF + signature électronique

```javascript
// Body
{
  "mission_id": "uuid"
}

// Réponse
{
  "success": true,
  "contract": {
    "id": "uuid",
    "pdf_url": "https://...",
    "signature_url": "https://yousign.app/..."
  }
}
```

**Flux interne**:
1. Récupération mission + candidat + employeur
2. Génération HTML contrat
3. Conversion PDF (Puppeteer)
4. Upload Supabase Storage
5. Création demande signature (Yousign)
6. Insert dans table contracts
7. Envoi emails avec liens signature

### 3. PUT /api/applications/[id]/status
**But**: Accepter/Refuser candidature + actions automatiques

```javascript
// Body
{
  "status": "accepté"
}

// Réponse
{
  "success": true,
  "contract_generated": true,
  "contract_id": "uuid"
}
```

**Flux si accepté**:
1. Update status application
2. Update status mission = 'assignée'
3. Refus automatique autres candidatures
4. Génération contrat automatique
5. Notifications emails

### 4. POST /api/notifications/email
**But**: Envoi d'emails transactionnels via Resend

```javascript
// Body
{
  "template": "mission_invite",
  "to": "candidate@email.com",
  "data": {
    "candidate_name": "Marie",
    "mission": { ... }
  }
}
```

**Templates disponibles**:
- `mission_invite`: Nouvelle mission proposée
- `mission_accepted`: Mission acceptée par candidat
- `contract_ready`: Contrat prêt à signer
- `contract_signed`: Contrat signé par tous

## 🛡️ Sécurité

### Authentification
- **Client**: ANON_KEY + RLS policies
- **Serveur**: SERVICE_ROLE_KEY (bypass RLS)
- **Validation**: JWT token dans headers

### Rate Limiting
```javascript
// middleware rate-limit.js
export const rateLimiter = {
  '/api/missions': '10/hour',
  '/api/contracts': '20/hour',
  '/api/notifications/email': '100/hour'
}
```

### Validation
```javascript
// middleware validate.js
export const schemas = {
  createMission: yup.object({
    title: yup.string().required().max(100),
    hourly_rate: yup.number().positive().max(100),
    start_date: yup.date().min(new Date()),
    // ...
  })
}
```

## 📧 Intégration Resend

### Configuration
```javascript
// lib/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailTemplates = {
  mission_invite: (data) => ({
    from: 'PharmaFlux <missions@pharmaflux.com>',
    to: [data.candidate_email],
    subject: `Nouvelle mission: ${data.mission.title}`,
    html: renderTemplate('mission-invite', data)
  })
};
```

### Templates HTML
```html
<!-- templates/mission-invite.html -->
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1>Nouvelle mission disponible</h1>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
    <h2>{{mission.title}}</h2>
    <p><strong>Type:</strong> {{mission.type}}</p>
    <p><strong>Date:</strong> {{mission.start_date}}</p>
    <p><strong>Taux:</strong> {{mission.hourly_rate}} €/h</p>
    <a href="{{app_url}}/candidate-dashboard" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
      Voir la mission
    </a>
  </div>
</div>
```

## 📄 Génération PDF avec Puppeteer

### Configuration
```javascript
// lib/pdf.js
import puppeteer from 'puppeteer';

export const generateContractPDF = async (htmlContent, options = {}) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
    printBackground: true,
    ...options
  });

  await browser.close();
  return pdf;
};
```

## 🔄 Migration Phase 1 → Phase 2

### Étapes de migration
1. **Déployment API endpoints** (sans casser le client)
2. **Ajout feature flags** pour basculer client/serveur
3. **Tests A/B** sur quelques fonctionnalités
4. **Migration progressive** service par service
5. **Suppression code client** obsolète

### Feature Flags
```javascript
// lib/features.js
export const features = {
  serverSideMissions: process.env.VITE_FEATURE_SERVER_MISSIONS === 'true',
  serverSideEmails: process.env.VITE_FEATURE_SERVER_EMAILS === 'true',
  // ...
};

// Dans missionService.js
if (features.serverSideMissions) {
  return await this.createMissionServer(data);
} else {
  return await this.createMissionClient(data);
}
```

## 📊 Monitoring Phase 2

### Logs structurés
```javascript
// lib/logger.js
export const logger = {
  info: (message, meta) => console.log(JSON.stringify({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    ...meta
  })),
  error: (message, error, meta) => console.error(JSON.stringify({
    level: 'error',
    message,
    error: error.stack,
    timestamp: new Date().toISOString(),
    ...meta
  }))
};
```

### Métriques importantes
- **Temps de matching**: Durée du RPC `find_matching_candidates`
- **Taux de conversion**: missions créées → candidatures → acceptations
- **Performance PDF**: Temps génération contrats
- **Délivrabilité email**: Taux de bounce/ouverture

---

Cette architecture Phase 2 permet:
- ✅ **Sécurité renforcée** (SERVICE_ROLE_KEY côté serveur)
- ✅ **Fonctionnalités avancées** (PDF, emails, signatures)
- ✅ **Performance** (matching serveur, rate limiting)
- ✅ **Observabilité** (logs, métriques, monitoring)
- ✅ **Évolutivité** (APIs séparées, microservices ready)