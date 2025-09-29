# 🌐 Configuration DNS optimale - innovapharmconsulting.com

## ÉTAT ACTUEL (à vérifier dans IONOS)

```bash
# Vérifier vos DNS actuels
nslookup innovapharmconsulting.com
dig innovapharmconsulting.com TXT
dig _dmarc.innovapharmconsulting.com TXT
```

## CONFIGURATION RECOMMANDÉE

### 1. Records de base (existants)
```
Type: A
Name: @
Value: [IP de votre serveur/Vercel]

Type: CNAME
Name: www
Value: innovapharmconsulting.com
```

### 2. Google Workspace (existants)
```
Type: MX
Name: @
Value: 1 aspmx.l.google.com
Value: 5 alt1.aspmx.l.google.com
Value: 5 alt2.aspmx.l.google.com
Value: 10 alt3.aspmx.l.google.com
Value: 10 alt4.aspmx.l.google.com
```

### 3. SPF Record (NOUVEAU - Critical)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:sendgrid.net ~all
```

### 4. DKIM Google Workspace (si pas déjà fait)
```
# Dans Google Admin Console → Apps → Google Workspace → Gmail
# Generate DKIM keys → Copy DNS records to IONOS

Type: TXT
Name: google._domainkey
Value: v=DKIM1; k=rsa; p=[clé publique fournie par Google]
```

### 5. DKIM SendGrid (après config SendGrid)
```
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u123456.wl123.sendgrid.net

Type: CNAME
Name: s2._domainkey
Value: s2.domainkey.u123456.wl123.sendgrid.net
```

### 6. DMARC Policy (NOUVEAU - Essential)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@innovapharmconsulting.com; ruf=mailto:admin@innovapharmconsulting.com; sp=none; adkim=r; aspf=r; pct=100; fo=1;
```

### 7. Security Headers (optionnel mais recommandé)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:sendgrid.net ~all

Type: TXT
Name: _mta-sts
Value: v=STSv1; id=20241201T000000Z;

Type: TXT
Name: @
Value: MS=ms123456789 (si vous utilisez Microsoft services)
```

## COMMANDES DE VÉRIFICATION POST-CONFIG

### Vérifier SPF
```bash
dig innovapharmconsulting.com TXT | grep spf
# Résultat attendu: v=spf1 include:_spf.google.com include:sendgrid.net ~all
```

### Vérifier DKIM Google
```bash
dig google._domainkey.innovapharmconsulting.com TXT
# Résultat attendu: v=DKIM1; k=rsa; p=...
```

### Vérifier DKIM SendGrid
```bash
dig s1._domainkey.innovapharmconsulting.com CNAME
dig s2._domainkey.innovapharmconsulting.com CNAME
```

### Vérifier DMARC
```bash
dig _dmarc.innovapharmconsulting.com TXT
# Résultat attendu: v=DMARC1; p=none; rua=...
```

## TESTS DE DÉLIVRABILITÉ

### Outils en ligne gratuits
```
1. https://mxtoolbox.com/domain/innovapharmconsulting.com
2. https://dmarcanalyzer.com/spf/checker/
3. https://dkimvalidator.com/
4. https://www.mail-tester.com/
```

### Test complet email
```
1. Envoyer un email depuis Supabase
2. Analyser avec https://www.mail-tester.com/
3. Score attendu: > 8/10
```

## TIMELINE DE PROPAGATION

```
SPF/DMARC: 1-4 heures
DKIM CNAME: 1-4 heures
MX Records: 4-24 heures
Vérification complète: 24-48 heures
```

## CHECKLIST POST-MIGRATION

```bash
✅ SPF inclut Google + SendGrid
✅ DKIM Google activé et vérifié
✅ DKIM SendGrid configuré
✅ DMARC en mode "none" (monitoring)
✅ Test email Supabase réussi
✅ Score deliverability > 8/10
✅ Monitoring actif (Google Admin + SendGrid)
```

## 🚨 ACTIONS PRIORITAIRES

### IMMÉDIAT (aujourd'hui)
1. Ajouter SPF record avec SendGrid
2. Configurer DMARC en mode monitoring
3. Tester envoi email

### SOUS 48H
1. Vérifier DKIM Google actif
2. Configurer DKIM SendGrid
3. Valider score délivrabilité

### MONITORING CONTINU
1. Dashboard SendGrid Analytics
2. Google Admin Console → Security
3. Rapports DMARC hebdomadaires