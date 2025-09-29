# 🚨 PLAN D'ACTION IMMÉDIAT - Sécurisation SMTP

## 🔥 URGENCE - À faire MAINTENANT (5 minutes)

### 1. Révoquer l'accès Gmail compromis
```bash
https://myaccount.google.com/security
→ Mots de passe d'application
→ SUPPRIMER le mot de passe Supabase
```

### 2. Désactiver temporairement l'envoi d'emails
```bash
Dashboard Supabase → Authentication → Settings
→ Décocher "Enable email confirmations"
→ Save (utilisateurs peuvent s'inscrire sans email)
```

## ⚡ SOLUTION RAPIDE (15 minutes) - Resend

### Étape 1: Créer compte Resend
```
1. https://resend.com
2. S'inscrire avec admin@innovapharmconsulting.com
3. Vérifier email
```

### Étape 2: Ajouter domaine
```
Domain: innovapharmconsulting.com
→ Copier les DNS records
```

### Étape 3: DNS dans IONOS
```
Type: TXT
Name: @
Value: resend-verification=xxxx (fourni par Resend)

Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

### Étape 4: API Key Resend
```
Create API Key → Copy: re_xxxxxxxxxxxxx
```

### Étape 5: Config Supabase
```
Dashboard Supabase → SMTP Settings:
Host: smtp.resend.com
Port: 587
User: resend
Pass: [API Key Resend]
Sender: noreply@innovapharmconsulting.com
```

### Étape 6: Test
```
Supabase → Test SMTP
Inscription test sur votre site
```

## 🛡️ SOLUTION ENTERPRISE (30 minutes) - SendGrid

### Plus robuste pour production, suivre SENDGRID_SETUP.md

## ✅ RÉSULTAT ATTENDU

```
❌ AVANT: "email rate limit exceeded"
✅ APRÈS: 3000 emails/mois sans limite quotidienne

❌ AVANT: Secrets exposés GitHub
✅ APRÈS: API Keys sécurisées et rotables

❌ AVANT: Gmail SMTP peu fiable
✅ APRÈS: Service professionnel dédié
```

## 📊 MÉTRIQUES DE SUCCÈS

```
- Emails délivrés en < 30 secondes
- Score délivrabilité > 8/10
- Zero "rate limit" errors
- Monitoring actif des bounces
```

## 🚨 ROLLBACK SI PROBLÈME

```bash
# Revenir temporairement à Gmail (pour dépannage)
Dashboard Supabase → SMTP:
Host: smtp.gmail.com
Port: 587
User: admin@innovapharmconsulting.com
Pass: [Nouveau mot de passe app]
```

## ⏱️ TIMELINE

```
T+0    : Révoquer Gmail, désactiver emails
T+15   : Resend configuré et testé
T+30   : SPF/DNS propagé
T+1h   : Tests utilisateurs OK
T+24h  : Monitoring délivrabilité
```

## 🎯 OBJECTIF

**Plus jamais de "rate limit exceeded" + Sécurité renforcée**