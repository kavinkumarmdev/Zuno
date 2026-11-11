/**
 * Zuno ERP - Database Migration Safety & Snapshot CLI
 * Usage:
 *   node apps/api/scripts/backup-db.js backup [optional-label]
 *   node apps/api/scripts/backup-db.js restore [optional-file]
 *   node apps/api/scripts/backup-db.js list
 */
const fs = require('fs');
const path = require('path');

const targetDir = fs.existsSync(path.resolve(process.cwd(), 'apps/api/data'))
  ? path.resolve(process.cwd(), 'apps/api/data')
  : path.resolve(process.cwd(), 'data');

const storePath = path.join(targetDir, 'operational-store.json');
const backupsDir = path.join(targetDir, 'backups');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const action = process.argv[2] || 'backup';
const label = process.argv[3] || 'manual';

if (action === 'backup') {
  if (!fs.existsSync(storePath)) {
    console.log('[Backup] Operational store file does not exist yet. Initializing empty snapshot...');
    fs.writeFileSync(storePath, JSON.stringify({}, null, 2), 'utf-8');
  }

  const raw = fs.readFileSync(storePath, 'utf-8');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupsDir, `snapshot-${label}-${timestamp}.json`);
  fs.writeFileSync(backupFile, raw, 'utf-8');

  const parsed = JSON.parse(raw);
  const tableKeys = Object.keys(parsed);
  let totalRecords = 0;
  for (const k of tableKeys) {
    if (Array.isArray(parsed[k])) totalRecords += parsed[k].length;
  }

  console.log(`✅ [Migration Safety] Snapshot successfully created:`);
  console.log(`   File: ${backupFile}`);
  console.log(`   Tables Protected: ${tableKeys.length}`);
  console.log(`   Total Records Saved: ${totalRecords}`);
  console.log(`   Your data is safe against schema drops and re-migrations.`);
} else if (action === 'restore') {
  const files = fs.readdirSync(backupsDir)
    .filter((f) => f.startsWith('snapshot-') && f.endsWith('.json'))
    .map((f) => path.join(backupsDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (files.length === 0) {
    console.error('❌ [Restore] No snapshot files found in backups directory.');
    process.exit(1);
  }

  const targetFile = label !== 'manual' && fs.existsSync(label) ? label : files[0];
  const raw = fs.readFileSync(targetFile, 'utf-8');
  fs.writeFileSync(storePath, raw, 'utf-8');

  const parsed = JSON.parse(raw);
  const tableKeys = Object.keys(parsed);
  console.log(`✅ [Migration Safety] Successfully restored data from:`);
  console.log(`   ${path.basename(targetFile)}`);
  console.log(`   Restored ${tableKeys.length} tables to operational store.`);
} else if (action === 'list') {
  const files = fs.readdirSync(backupsDir)
    .filter((f) => f.startsWith('snapshot-') && f.endsWith('.json'))
    .map((f) => path.join(backupsDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  console.log(`📁 Available Migration Protection Snapshots (${files.length}):`);
  files.forEach((f, idx) => {
    const stats = fs.statSync(f);
    console.log(`   [${idx + 1}] ${path.basename(f)} (${(stats.size / 1024).toFixed(1)} KB) - ${stats.mtime.toLocaleString()}`);
  });
} else {
  console.log('Commands: backup [label], restore [file], list');
}
