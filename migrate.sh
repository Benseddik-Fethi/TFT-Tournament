#!/bin/bash

# Script de migration pour la base de données OAuth accounts
# Exécute la migration SQL et génère le client Prisma

set -e

echo "🔄 Migration de la base de données - OAuth Account Linking"
echo "============================================================"
echo ""

# Vérifier que Docker est lancé
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker n'est pas lancé. Lancez Docker Desktop et réessayez."
    exit 1
fi

# Vérifier que le conteneur PostgreSQL est en cours d'exécution
CONTAINER_NAME="tft-arena-postgres"
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Le conteneur PostgreSQL n'est pas en cours d'exécution."
    echo "   Lancez-le avec : docker-compose up -d"
    exit 1
fi

echo "✅ Conteneur PostgreSQL détecté : $CONTAINER_NAME"
echo ""

# Exécuter la migration SQL
echo "📝 Exécution de la migration SQL..."
docker exec -i $CONTAINER_NAME psql -U tftarena -d tftarena < backend/src/shared/database/prisma/migrations/add_oauth_accounts.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration SQL exécutée avec succès"
else
    echo "❌ Erreur lors de l'exécution de la migration"
    exit 1
fi

echo ""
echo "🔨 Génération du client Prisma..."
cd backend
pnpm db:generate

if [ $? -eq 0 ]; then
    echo "✅ Client Prisma généré avec succès"
else
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

cd ..

echo ""
echo "✅ Migration terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Redémarrez le serveur backend : cd backend && pnpm dev"
echo "   2. Testez la connexion avec différents providers OAuth"
echo ""
