-- Migration: Add OAuth Accounts table and migrate existing data
-- Date: 2025-01-16
-- Description: Migrate from single provider per user to multiple OAuth accounts per user

-- Step 1: Create oauth_accounts table
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 2: Create unique constraint and indexes
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_accounts_provider_provider_id_key" ON "oauth_accounts"("provider", "provider_id");
CREATE INDEX IF NOT EXISTS "oauth_accounts_user_id_idx" ON "oauth_accounts"("user_id");
CREATE INDEX IF NOT EXISTS "oauth_accounts_provider_idx" ON "oauth_accounts"("provider");

-- Step 3: Migrate existing data from users table to oauth_accounts
-- IMPORTANT: Only run this if you have existing data
-- This will create one OAuth account per existing user
DO $$
BEGIN
    -- Check if provider column still exists in users table
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'provider'
    ) THEN
        -- Migrate existing users to oauth_accounts
        INSERT INTO "oauth_accounts" ("user_id", "provider", "provider_id", "email", "created_at")
        SELECT
            "id",
            "provider",
            "provider_id",
            "email",
            "created_at"
        FROM "users"
        WHERE "provider" IS NOT NULL AND "provider_id" IS NOT NULL
        ON CONFLICT ("provider", "provider_id") DO NOTHING;

        RAISE NOTICE 'Migrated % users to oauth_accounts', (SELECT COUNT(*) FROM "oauth_accounts");

        -- Step 4: Drop unique constraint on users table
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_provider_providerId_key";
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_provider_provider_id_key";

        -- Step 5: Drop provider and provider_id columns from users
        -- COMMENTED OUT FOR SAFETY - Uncomment after verifying migration
        -- ALTER TABLE "users" DROP COLUMN IF EXISTS "provider";
        -- ALTER TABLE "users" DROP COLUMN IF EXISTS "provider_id";

        RAISE NOTICE 'Migration completed. Review oauth_accounts table before dropping provider columns from users.';
    ELSE
        RAISE NOTICE 'provider column not found in users table - migration already completed or not needed';
    END IF;
END $$;
