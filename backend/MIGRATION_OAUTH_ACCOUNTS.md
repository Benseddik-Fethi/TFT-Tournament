# Migration: OAuth Accounts

## 📋 Résumé

Cette migration transforme le système d'authentification pour permettre le linking de plusieurs comptes OAuth (Google, Discord, Twitch) à un seul utilisateur.

**Avant** : Un utilisateur = Un provider OAuth
**Après** : Un utilisateur = Plusieurs providers OAuth liés

## ⚠️ Important - À lire avant la migration

Cette migration est **SANS RUPTURE** pour les utilisateurs existants :
- ✅ Les comptes existants continuent de fonctionner
- ✅ Tous les providers (Google, Discord, Twitch) sont maintenant linkables automatiquement
- ✅ La connexion avec un nouveau provider (même email) lie automatiquement le compte

## 🔧 Étapes de migration

### Étape 1 : Exécuter la migration SQL

```bash
cd backend

# Option A : Avec psql
psql $DATABASE_URL -f src/shared/database/prisma/migrations/add_oauth_accounts.sql

# Option B : Avec Docker
docker exec -i <postgres_container> psql -U <username> -d <database> < src/shared/database/prisma/migrations/add_oauth_accounts.sql
```

### Étape 2 : Vérifier la migration

```sql
-- Vérifier que oauth_accounts existe
SELECT COUNT(*) FROM oauth_accounts;

-- Vérifier que les données ont été migrées
SELECT u.email, oa.provider, oa.provider_id
FROM users u
JOIN oauth_accounts oa ON u.id = oa.user_id
LIMIT 5;
```

### Étape 3 : Générer le client Prisma

```bash
pnpm db:generate
```

### Étape 4 : Redémarrer le backend

```bash
pnpm dev
```

## ✅ Vérification post-migration

1. **Connexion existante** : Les utilisateurs existants peuvent se connecter normalement
2. **Nouveau linking** : Connectez-vous avec un autre provider (même email) → Compte automatiquement lié
3. **Vérifier dans la BDD** :

```sql
-- Utilisateurs avec plusieurs comptes liés
SELECT
    u.email,
    COUNT(oa.id) as nb_accounts,
    ARRAY_AGG(oa.provider) as providers
FROM users u
LEFT JOIN oauth_accounts oa ON u.id = oa.user_id
GROUP BY u.id, u.email
HAVING COUNT(oa.id) > 1;
```

## 🎯 Exemple de flow utilisateur

### Scénario : Linking automatique

1. **Jour 1** : Jean se connecte avec Google → Compte créé
   ```
   User: jean@gmail.com
   OAuth Accounts: [Google]
   ```

2. **Jour 2** : Jean se connecte avec Discord (même email) → Compte automatiquement lié !
   ```
   User: jean@gmail.com
   OAuth Accounts: [Google, Discord]
   ```

3. **Jour 3** : Jean peut se connecter avec Google OU Discord → Même compte

## 🔄 Rollback (si nécessaire)

Si vous rencontrez des problèmes :

```sql
-- Restaurer les colonnes provider dans users (ne pas exécuter si tout fonctionne)
ALTER TABLE users ADD COLUMN provider VARCHAR(20);
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);

-- Restaurer les données depuis oauth_accounts
UPDATE users u
SET provider = oa.provider, provider_id = oa.provider_id
FROM (
    SELECT DISTINCT ON (user_id) user_id, provider, provider_id
    FROM oauth_accounts
    ORDER BY user_id, created_at
) oa
WHERE u.id = oa.user_id;

-- Recréer la contrainte unique
CREATE UNIQUE INDEX users_provider_provider_id_key ON users(provider, provider_id);
```

## 📊 Impact sur les endpoints

### Endpoints modifiés

- `POST /api/auth/google/callback` : Linking automatique si email existe
- `POST /api/auth/discord/callback` : Linking automatique si email existe
- `POST /api/auth/twitch/callback` : Linking automatique si email existe
- `GET /api/auth/me` : Retourne maintenant `oauthAccounts[]` au lieu de `provider`

### Nouveaux endpoints

- `GET /api/users/me/oauth-accounts` : Liste les comptes liés
- `DELETE /api/users/me/oauth-accounts/:provider` : Délier un compte (V2)

## 🐛 Troubleshooting

### Erreur : "relation oauth_accounts does not exist"

```bash
# Vérifier que la migration SQL a été exécutée
psql $DATABASE_URL -c "\d oauth_accounts"

# Si la table n'existe pas, exécuter à nouveau le script SQL
```

### Erreur : "Unknown column provider in User"

```bash
# Régénérer le client Prisma
pnpm db:generate

# Redémarrer le serveur
pnpm dev
```

### Les utilisateurs ne peuvent pas se connecter

```sql
-- Vérifier que les oauth_accounts existent
SELECT COUNT(*) FROM oauth_accounts;

-- Si vide, la migration des données n'a pas fonctionné
-- Réexécuter le script SQL
```

## 📝 Notes techniques

- La table `oauth_accounts` utilise `ON DELETE CASCADE` → Supprimer un user supprime automatiquement ses OAuth accounts
- L'index unique sur `(provider, providerId)` empêche les doublons
- Le linking est **automatique** et **transparent** pour l'utilisateur
- Aucune confirmation n'est demandée (comportement standard des plateformes modernes)

## 🎉 Résultat attendu

Après la migration :
- ✅ Tous les utilisateurs existants peuvent toujours se connecter
- ✅ Nouveau login avec un provider différent → Linking automatique
- ✅ Un seul profil utilisateur avec plusieurs moyens de connexion
- ✅ Logs clairs dans la console backend indiquant les linking
