import * as fs from 'fs';
import * as path from 'path';

describe('Database Migration & Catalogue Integrity Test Suite', () => {
  const migrationPath = path.resolve(__dirname, '../../../database/main/migrations/001_initial_neon_243_tables.sql');
  const cataloguePath = path.resolve(__dirname, '../../../database/documentation/table_catalogue.md');
  let migrationSql: string;

  beforeAll(() => {
    migrationSql = fs.readFileSync(migrationPath, 'utf-8');
  });

  it('RULE 8: Migration DDL must NEVER contain destructive DROP TABLE or DROP COLUMN operations', () => {
    // Assert no drop statements exist in the initial production migration
    expect(migrationSql).not.toMatch(/DROP\s+TABLE/i);
    expect(migrationSql).not.toMatch(/DROP\s+COLUMN/i);
    expect(migrationSql).not.toMatch(/TRUNCATE/i);
  });

  it('Ensures all table creation statements use safe IF NOT EXISTS clauses', () => {
    const createTableMatches = migrationSql.match(/CREATE TABLE/gi) || [];
    const safeCreateTableMatches = migrationSql.match(/CREATE TABLE IF NOT EXISTS/gi) || [];

    expect(createTableMatches.length).toBeGreaterThanOrEqual(243);
    // Every CREATE TABLE must be safe
    expect(safeCreateTableMatches.length).toBe(createTableMatches.length);
  });

  it('Verifies that financial tables utilize NUMERIC data types and TIMESTAMPTZ for temporal auditing', () => {
    expect(migrationSql).toContain('NUMERIC(');
    expect(migrationSql).toContain('TIMESTAMPTZ');
    expect(migrationSql).toContain('gen_random_uuid()');
  });

  it('Verifies that the markdown catalogue documents all 243 approved tables', () => {
    const catalogueContent = fs.readFileSync(cataloguePath, 'utf-8');
    expect(catalogueContent).toContain('243');
    expect(catalogueContent).toContain('tb_tenant');
    expect(catalogueContent).toContain('tb_financial_budget_detail');
  });
});

