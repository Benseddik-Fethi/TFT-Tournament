# Guide de Migration - OAuth Account Linking

## 🚀 Migration Rapide

### Option 1 : Script Automatique (Recommandé avec Docker)

Si vous utilisez Docker Compose :

```bash
# Lancer PostgreSQL (si pas déjà fait)
docker-compose up -d

# Exécuter le script de migration
./migrate.sh
```

Le script va :
1. ✅ Vérifier que Docker et PostgreSQL sont lancés
2. ✅ Exécuter la migration SQL
3. ✅ Générer le client Prisma
4. ✅ Afficher les prochaines étapes

---

### Option 2 : Manuel (PostgreSQL Local ou Distant)

Si vous n'utilisez pas Docker ou préférez faire manuellement :

#### Étape 1 : Exécuter la migration SQL

**Avec Docker :**
```bash
docker exec -i tft-arena-postgres psql -U tftarena -d tftarena < backend/src/shared/database/prisma/migrations/add_oauth_accounts.sql
```

**Avec psql local :**
```bash
psql -U tftarena -d tftarena -f backend/src/shared/database/prisma/migrations/add_oauth_accounts.sql
```

**Avec DATABASE_URL :**
```bash
psql "$DATABASE_URL" -f backend/src/shared/database/prisma/migrations/add_oauth_accounts.sql
```

#### Étape 2 : Générer le client Prisma

```bash
cd backend
pnpm db:generate
```

#### Étape 3 : Redémarrer le backend

```bash
pnpm dev
```

---

## ✅ Vérification

Pour vérifier que la migration a fonctionné :

**Avec Docker :**
```bash
docker exec -i tft-arena-postgres psql -U tftarena -d tftarena -c "\dt oauth_accounts"
```

**Avec psql local :**
```bash
psql -U tftarena -d tftarena -c "\dt oauth_accounts"
```

Vous devriez voir la table `oauth_accounts` listée.

Pour vérifier les colonnes :
```bash
# Avec Docker
docker exec -i tft-arena-postgres psql -U tftarena -d tftarena -c "\d oauth_accounts"

# Avec psql local
psql -U tftarena -d tftarena -c "\d oauth_accounts"
```

---

## 🧪 Test du Linking

Après la migration, testez le système :

1. **Connexion initiale** :
   - Allez sur http://localhost:5173/login
   - Connectez-vous avec Google
   - Vérifiez que l'authentification fonctionne

2. **Linking automatique** :
   - Déconnectez-vous
   - Connectez-vous avec Discord (utilisez le même email)
   - ✅ Vous devriez être connecté au même compte

3. **Page profil** :
   - Allez sur http://localhost:5173/profile
   - Vérifiez que vous voyez les 2 comptes liés (Google et Discord)
   - Testez le bouton "Link Twitch"

4. **Unlinking** :
   - Essayez de délier le compte Google (devrait être bloqué car c'est le compte primaire)
   - Déliez le compte Discord (devrait fonctionner)
   - Vérifiez que Discord disparaît de la liste

---

## 🔙 Rollback (En Cas de Problème)

Si vous rencontrez des problèmes, vous pouvez annuler la migration :

```bash
# Avec Docker
docker exec -i tft-arena-postgres psql -U tftarena -d tftarena <<'EOF'
-- Rollback de la migration OAuth accounts

-- Restaurer les colonnes provider et provider_id dans users
ALTER TABLE "users"
  ADD COLUMN "provider" VARCHAR(20),
  ADD COLUMN "provider_id" VARCHAR(255);

-- Migrer les données de retour
UPDATE "users" u
SET
  "provider" = oa.provider,
  "provider_id" = oa.provider_id
FROM (
  SELECT DISTINCT ON (user_id)
    user_id, provider, provider_id
  FROM "oauth_accounts"
  ORDER BY user_id, created_at ASC
) oa
WHERE u.id = oa.user_id;

-- Recréer les contraintes
CREATE UNIQUE INDEX "users_provider_provider_id_key"
  ON "users"("provider", "provider_id");

-- Supprimer la table oauth_accounts
DROP TABLE IF EXISTS "oauth_accounts";

COMMIT;
EOF
```

Puis régénérer le client Prisma avec l'ancien schéma.

---

## 📊 Informations sur la Migration

**Fichiers modifiés** :
- `backend/src/shared/database/prisma/schema.prisma`
- `backend/src/shared/auth/passport.config.ts`
- `backend/src/modules/auth/auth.service.ts`

**Nouvelles tables** :
- `oauth_accounts` (avec relation vers `users`)

**Nouvelles colonnes** :
- Aucune dans `users` (colonnes `provider` et `provider_id` supprimées)

**Données préservées** :
- Tous les utilisateurs existants
- Leurs informations de connexion OAuth
- Leurs relations (tournaments, participations, etc.)

**Breaking changes** :
- La colonne `users.provider` n'existe plus
- Utiliser `user.oauthAccounts` à la place

---

## ❓ Troubleshooting

### Erreur : "relation 'oauth_accounts' already exists"

La table existe déjà. Deux options :
1. Ignorer (la migration a déjà été faite)
2. Supprimer et recréer : `DROP TABLE oauth_accounts CASCADE;`

### Erreur : "could not connect to server"

PostgreSQL n'est pas lancé. Lancez-le :
```bash
docker-compose up -d
```

### Erreur : "FATAL: password authentication failed"

Vérifiez vos identifiants PostgreSQL dans `.env` ou `docker-compose.yml`.

### Erreur : "Prisma schema validation failed"

Assurez-vous d'avoir la dernière version du schéma :
```bash
git pull origin claude/claude-md-mi1fo1d0xnmx00at-01Jky1U18zYLgBQnkoEB8hoJ
```

---

## 📞 Support

Pour plus de détails, consultez :
- `backend/MIGRATION_OAUTH_ACCOUNTS.md` - Guide détaillé de migration
- `OAUTH_LINKING_IMPLEMENTATION.md` - Documentation complète du système

En cas de problème, créez une issue sur GitHub avec les logs d'erreur.
