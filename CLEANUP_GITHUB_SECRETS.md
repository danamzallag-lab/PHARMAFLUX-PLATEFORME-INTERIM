# 🚨 PROCÉDURE D'URGENCE - Nettoyage GitHub

## ÉTAPE 1 : Identifier les commits compromis
```bash
# Rechercher tous les commits contenant des secrets
git log --all --full-history -- .env*
git log --all --full-history -p | grep -i "smtp\|password\|secret"
```

## ÉTAPE 2 : Supprimer les secrets de l'historique Git
```bash
# ATTENTION: Ceci réécrit l'historique Git

# Option A : Supprimer complètement les fichiers .env de l'historique
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env .env.local .env.production' \
  --prune-empty --tag-name-filter cat -- --all

# Option B : Alternative avec git-filter-repo (plus moderne)
pip install git-filter-repo
git filter-repo --path .env --path .env.local --invert-paths

# Option C : BFG Cleaner (plus rapide pour gros repos)
# Télécharger: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --delete-files .env.local
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## ÉTAPE 3 : Force push (ATTENTION: collaborateurs)
```bash
# Avertir tous les collaborateurs AVANT
git push --force-with-lease --all
git push --force-with-lease --tags
```

## ÉTAPE 4 : Vérification post-nettoyage
```bash
# Vérifier que les secrets ont disparu
git log --all --full-history -- .env*
git log --oneline --all | head -20
```

## ÉTAPE 5 : Prévenir les futures fuites
```bash
# Mettre à jour .gitignore
echo "# Environment variables" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
echo ".env.*.local" >> .gitignore

# Commit du .gitignore
git add .gitignore
git commit -m "🔒 Add comprehensive .gitignore for environment files"
git push
```