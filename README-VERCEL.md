# 🚀 Déploiement Vercel - PharmaFlux

## Configuration automatique du déploiement

Le projet est configuré pour se déployer automatiquement sur Vercel dès que vous poussez sur GitHub.

## Variables d'environnement à configurer dans Vercel

1. **Accédez au dashboard Vercel** : https://vercel.com/dashboard
2. **Importez le repository GitHub** : `danamzallag-lab/PHARMAFLUX-PLATEFORME-INTERIM`
3. **Configurez les variables d'environnement** :

### Variables requises :

```
VITE_SUPABASE_URL=https://khcnyegvumgzhkjazsaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoY255ZWd2dW1nemhramF6c2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTEzNzIsImV4cCI6MjA3NDM2NzM3Mn0.Y2ncNWLcmwFGtqsia5FY5NvrS_BKRUrB8sTlXLFKTUc
VITE_APP_URL=https://pharmaflux.vercel.app
```

### Variables optionnelles :

```
VITE_APP_NAME=PharmaFlux
VITE_APP_ENV=production
VITE_DEV_MODE=false
```

## 📝 Instructions étape par étape

### 1. Configuration Supabase
- Créez un projet sur [Supabase](https://supabase.com)
- Exécutez le script `supabase_schema_clean.sql` dans l'éditeur SQL
- Récupérez l'URL du projet et la clé anon

### 2. Configuration Vercel
- Connectez-vous sur [Vercel](https://vercel.com)
- Cliquez sur "New Project"
- Importez le repository `danamzallag-lab/PHARMAFLUX-PLATEFORME-INTERIM`
- Configurez les variables d'environnement (voir ci-dessus)
- Déployez !

### 3. Configuration automatique
Le fichier `vercel.json` est déjà configuré avec :
- ✅ Build command : `npm run build`
- ✅ Output directory : `dist`
- ✅ Framework : `vite`
- ✅ SPA rewrites pour le routing client
- ✅ Headers CORS pour les APIs

## 🎯 URLs de déploiement

Une fois déployé, votre application sera accessible sur :
- **Production** : `https://pharmaflux.vercel.app` (ou votre domaine personnalisé)
- **Preview** : URLs générées automatiquement pour chaque PR

## 🔄 Déploiement automatique

Le déploiement se fait automatiquement :
- ✅ **Push sur main** → Déploiement en production
- ✅ **Pull Request** → Déploiement preview
- ✅ **Rollback automatique** en cas d'erreur

## 🛠 Commandes utiles

```bash
# Build local pour tester
npm run build

# Preview du build
npm run preview

# Déploiement manuel (optionnel)
vercel --prod
```

## 📊 Monitoring

Vercel fournit automatiquement :
- Analytics de performance
- Monitoring des erreurs
- Logs de déploiement
- Métriques de vitesse

## 🔧 Dépannage

### Erreur de build
- Vérifiez que toutes les variables d'environnement sont configurées
- Assurez-vous que le script SQL a été exécuté sur Supabase

### Erreur 404 sur les routes
- Le fichier `vercel.json` gère déjà les rewrites SPA
- Vérifiez que le routing dans `App.tsx` fonctionne localement

### Erreur de connexion Supabase
- Vérifiez les URLs et clés dans les variables d'environnement
- Testez la connexion depuis l'interface Supabase

---

**🎉 Le projet est maintenant prêt pour le déploiement automatique sur Vercel !**