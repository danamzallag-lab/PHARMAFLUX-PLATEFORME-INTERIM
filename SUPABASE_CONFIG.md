# 🔧 Configuration Supabase - PharmaFlux

## 📧 **1. Configuration des URLs de redirection**

### Dans votre dashboard Supabase → Authentication → URL Configuration :

**Site URL :**
```
https://votre-domaine.com
```

**Redirect URLs (ajoutez TOUTES ces URLs) :**
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
https://votre-domaine.com
https://www.votre-domaine.com
https://votre-domaine.vercel.app
https://votre-projet.vercel.app
```

---

## 📧 **2. Résoudre le problème des emails**

### Option A : Auto-confirmation (RECOMMANDÉ pour les tests)

Dans Supabase → Authentication → Settings :

1. **Désactiver la confirmation email :**
   - Aller dans **Authentication** → **Settings**
   - Chercher **"Enable email confirmations"**
   - **DÉCOCHER** cette option
   - Sauvegarder

2. **Alternative - Confirmation automatique :**
   ```sql
   -- Exécuter dans SQL Editor de Supabase
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE email_confirmed_at IS NULL;
   ```

### Option B : Configuration SMTP personnalisé

Dans Supabase → Authentication → Settings → SMTP Settings :

**Pour Gmail/Google Workspace :**
```
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: [Mot de passe d'application]
Sender name: PharmaFlux
Sender email: votre-email@gmail.com
```

**Pour Outlook/Hotmail :**
```
Host: smtp-mail.outlook.com
Port: 587
Username: votre-email@outlook.com
Password: [Votre mot de passe]
Sender name: PharmaFlux
Sender email: votre-email@outlook.com
```

---

## 🔐 **3. Configuration DNS (si SMTP personnalisé)**

### Ajouter ces enregistrements dans votre DNS :

**SPF Record :**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

**DKIM :**
- Activer dans Google Admin Console ou votre fournisseur
- Ajouter la clé publique fournie

**DMARC :**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:votre-email@votre-domaine.com
```

---

## ⚡ **4. Tests rapides**

### Test de connexion (après correction du code) :
1. Aller sur votre site
2. Ouvrir la console (F12)
3. Tenter une connexion
4. Vérifier les logs :
   ```
   🚀 Démarrage de la connexion...
   ✅ Connexion réussie pour: email@exemple.com
   🔄 Chargement du profil...
   🎯 Redirection vers dashboard candidat
   ```

### Test d'inscription :
1. S'inscrire avec un nouvel email
2. Si auto-confirmation activée → connexion immédiate
3. Si SMTP configuré → vérifier l'email de confirmation

---

## 🐛 **Dépannage**

### Connexion bloquée :
- Vérifier que les credentials sont corrects
- Vérifier que l'utilisateur existe dans Auth → Users
- Vérifier que le profil existe dans Table Editor → profiles

### Emails non reçus :
- Vérifier SPAM/Courrier indésirable
- Tester avec l'auto-confirmation
- Vérifier la configuration SMTP

### Redirection échoue :
- Vérifier les logs de la console
- Vérifier que le type utilisateur est bien défini
- Forcer une redirection manuelle si nécessaire