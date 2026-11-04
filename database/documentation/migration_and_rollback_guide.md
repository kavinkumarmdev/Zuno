# ZUNO ERP — Safe Database Migration & Rollback Guide

## 1. Zero-Data-Loss Principles
1. **Never drop columns or tables in production without archiving**: Schema migrations must be additive or transitional.
2. **Pre-Migration Verification**: Before executing any DDL on the Neon Operational database or Supabase History database, verify active connections, pending transactions, and execute a PITR (Point-in-Time-Recovery) backup snapshot.
3. **Idempotent Execution**: All migrations must be wrapped with `IF NOT EXISTS` or managed sequentially with strict version tracking tables (`_prisma_migrations` or `schema_migrations`).

---

## 2. Neon Operational Database Workflow

### Development
```bash
# Apply schema changes locally
npm run db:migrate

# Regenerate Prisma Client
npm run db:generate

# Seed essential master data
npm run db:seed
```

### Production Deployment Procedure
1. Create a Neon Branch / Snapshot:
   ```bash
   neonctl branches create --name pre-migration-backup
   ```
2. Run database migration in dry-run mode:
   ```bash
   npx prisma migrate diff --from-schema-datasource ...
   ```
3. Apply migration with deployment lock:
   ```bash
   npx prisma migrate deploy
   ```
4. Verify application health check `/api/v1/health`.

---

## 3. Supabase History Database Workflow
1. Historical tables use append-only semantics. Mutations to existing archive records are disallowed by database triggers.
2. Migrations to Supabase history tables add metadata columns or new partitioned tables for future fiscal years.

---

## 4. Rollback Protocol
In the event of an unexpected migration abort or regression:
1. Revert the active application container to the previous release tag.
2. If data was corrupted, restore the Neon point-in-time branch timestamp immediately prior to migration execution.
3. Run `npm run db:verify` to confirm foreign key and tenant boundary integrity.

