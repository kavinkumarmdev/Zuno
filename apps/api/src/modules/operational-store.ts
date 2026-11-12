import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface StoredRecord {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description?: string;
  amount?: string;
  status: string;
  currency_code?: string;
  quantity?: string;
  created_time: string;
  updated_time?: string;
  created_by?: string;
  updated_by?: string;
  is_active: boolean;
  [key: string]: any;
}

export class OperationalDataStore {
  private static filePath: string = OperationalDataStore.resolveFilePath();
  private static memoryCache: Record<string, StoredRecord[]> | null = null;

  private static resolveFilePath(): string {
    const primaryPath = path.resolve(process.cwd(), 'apps/api/data/operational-store.json');
    const fallbackPath = path.resolve(process.cwd(), 'data/operational-store.json');
    
    // Choose primary if apps/api exists in cwd, else fallback
    const targetDir = fs.existsSync(path.resolve(process.cwd(), 'apps/api'))
      ? path.resolve(process.cwd(), 'apps/api/data')
      : path.resolve(process.cwd(), 'data');

    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch {}
    }

    return path.join(targetDir, 'operational-store.json');
  }

  private static readData(): Record<string, StoredRecord[]> {
    if (this.memoryCache) return this.memoryCache;

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.memoryCache = JSON.parse(raw);
        return this.memoryCache || {};
      }
    } catch {
      // In case of corrupt file or parse error, fallback to empty
    }

    this.memoryCache = {};
    return this.memoryCache;
  }

  private static backupsDir: string = path.join(path.dirname(OperationalDataStore.filePath), 'backups');
  private static lastBackupTime: number = 0;

  private static writeData(data: Record<string, StoredRecord[]>): void {
    this.memoryCache = data;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');

      // Auto-create snapshot backup if 5 minutes have elapsed or if newly populated
      const now = Date.now();
      if (now - this.lastBackupTime > 5 * 60 * 1000) {
        this.createSnapshotBackup('auto');
        this.lastBackupTime = now;
      }
    } catch (err: any) {
      console.error('[OperationalDataStore] Failed to write store to disk:', err.message);
    }
  }

  /**
   * Create a timestamped backup snapshot to protect against accidental migration drops or schema resets
   */
  static createSnapshotBackup(tag: string = 'manual'): string | null {
    try {
      if (!fs.existsSync(this.backupsDir)) {
        fs.mkdirSync(this.backupsDir, { recursive: true });
      }
      const data = this.readData();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupsDir, `snapshot-${tag}-${timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8');

      // Prune old backups, keeping latest 25
      const files = fs.readdirSync(this.backupsDir)
        .filter((f) => f.startsWith('snapshot-') && f.endsWith('.json'))
        .map((f) => path.join(this.backupsDir, f))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

      if (files.length > 25) {
        for (const fileToDelete of files.slice(25)) {
          try {
            fs.unlinkSync(fileToDelete);
          } catch {}
        }
      }

      console.log(`[OperationalDataStore] Created migration protection snapshot: ${path.basename(backupFile)}`);
      return backupFile;
    } catch (err: any) {
      console.error('[OperationalDataStore] Backup snapshot creation failed:', err.message);
      return null;
    }
  }

  /**
   * Restore store from the most recent backup snapshot
   */
  static restoreLatestBackup(): boolean {
    try {
      if (!fs.existsSync(this.backupsDir)) return false;
      const files = fs.readdirSync(this.backupsDir)
        .filter((f) => f.startsWith('snapshot-') && f.endsWith('.json'))
        .map((f) => path.join(this.backupsDir, f))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

      if (files.length === 0) return false;

      const latest = files[0];
      const raw = fs.readFileSync(latest, 'utf-8');
      const parsed = JSON.parse(raw);
      this.memoryCache = parsed;
      this.writeData(parsed);
      console.log(`[OperationalDataStore] Restored data from snapshot: ${path.basename(latest)}`);
      return true;
    } catch (err: any) {
      console.error('[OperationalDataStore] Failed to restore latest backup:', err.message);
      return false;
    }
  }

  /**
   * Return full map of all stored records across all tenants and tables
   */
  static getAllStoredData(): Record<string, StoredRecord[]> {
    return this.readData();
  }

  private static getStoreKey(tenantId: string, tableName: string): string {
    return `${tenantId || 'global'}:${tableName}`;
  }

  static getRecords(tenantId: string, tableName: string, allowSeed: boolean = true): StoredRecord[] {
    const data = this.readData();
    const key = this.getStoreKey(tenantId, tableName);

    if (!data[key] || data[key].length === 0) {
      if (!allowSeed) return [];
      // Seed realistic initial records on first access
      const initial = this.generateInitialSeed(tableName, tenantId);
      data[key] = initial;
      this.writeData(data);
      return initial;
    }

    // Filter active records
    return data[key].filter((r) => r.is_active !== false);
  }

  static addRecord(tenantId: string, userId: string, tableName: string, payload: any): StoredRecord {
    const data = this.readData();
    const key = this.getStoreKey(tenantId, tableName);
    const existing = data[key] || [];

    const now = new Date().toISOString();
    const prefix = tableName.replace('tb_', '').substring(0, 4).toUpperCase();
    const cleanCode = payload.code
      ? String(payload.code).trim().toUpperCase()
      : `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: StoredRecord = {
      id: payload.id || crypto.randomUUID(),
      tenant_id: tenantId,
      name: payload.name || payload.company_name || payload.product_name || `New ${prefix} Record`,
      code: cleanCode,
      description: payload.description || `Operational record created for ${tableName}`,
      amount: payload.amount ? Number(payload.amount).toFixed(2) : '0.00',
      status: payload.status || 'ACTIVE',
      currency_code: payload.currency_code || 'INR',
      created_time: now,
      updated_time: now,
      created_by: userId,
      is_active: true,
      is_user_record: true,
      ...payload
    };

    // Prepend new record so it appears at top of lists
    const updated = [newRecord, ...existing];
    data[key] = updated;
    this.writeData(data);

    return newRecord;
  }

  static updateRecord(tenantId: string, userId: string, tableName: string, id: string, payload: any): StoredRecord | null {
    const data = this.readData();
    const key = this.getStoreKey(tenantId, tableName);
    const existing = data[key] || [];

    const index = existing.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: StoredRecord = {
      ...existing[index],
      ...payload,
      updated_by: userId,
      updated_time: new Date().toISOString()
    };

    existing[index] = updated;
    data[key] = existing;
    this.writeData(data);

    return updated;
  }

  static deleteRecord(tenantId: string, userId: string, tableName: string, id: string): boolean {
    const data = this.readData();
    const key = this.getStoreKey(tenantId, tableName);
    const existing = data[key] || [];

    const index = existing.findIndex((r) => r.id === id);
    if (index === -1) return false;

    // Soft delete
    existing[index].is_active = false;
    existing[index].status = 'DELETED';
    existing[index].updated_by = userId;
    existing[index].updated_time = new Date().toISOString();

    data[key] = existing;
    this.writeData(data);

    return true;
  }

  private static generateInitialSeed(tableName: string, tenantId: string): StoredRecord[] {
    const now = new Date().toISOString();

    if (tableName === 'tb_department') {
      const depts = [
        { code: 'DEPT-001', name: 'Engineering & Production', head: 'Anand Venkatesh', cost: 'CC-ENG-101' },
        { code: 'DEPT-002', name: 'Operations & Plant Maintenance', head: 'Suresh Babu', cost: 'CC-OPS-102' },
        { code: 'DEPT-003', name: 'Accounts & Financial Control', head: 'Rajesh Iyer', cost: 'CC-ACC-103' },
        { code: 'DEPT-004', name: 'Human Resources & Talent', head: 'Priya Sundaram', cost: 'CC-HR-104' },
        { code: 'DEPT-005', name: 'Quality Assurance & ISO Compliance', head: 'Kavitha Raman', cost: 'CC-QA-105' },
        { code: 'DEPT-006', name: 'Supply Chain & Procurement', head: 'Murugan Pillai', cost: 'CC-SCM-106' },
        { code: 'DEPT-007', name: 'Sales & Client Relations', head: 'Deepak Sharma', cost: 'CC-SLS-107' },
        { code: 'DEPT-008', name: 'Information Technology & Security', head: 'Kavin Kumar', cost: 'CC-IT-108' }
      ];
      return depts.map((d) => ({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        code: d.code,
        name: d.name,
        head_name: d.head,
        cost_center: d.cost,
        description: `Operational department scope for ${d.name}`,
        status: 'ACTIVE',
        created_time: now,
        is_active: true
      }));
    }

    if (tableName === 'tb_designation') {
      const desigs = [
        { code: 'DESIG-001', name: 'Senior Production Engineer', grade: 'Band T1 (Technical)', ctc: '950000.00' },
        { code: 'DESIG-002', name: 'Operations Plant Manager', grade: 'Band M1 (Management)', ctc: '1600000.00' },
        { code: 'DESIG-003', name: 'Senior Accounts Executive', grade: 'Band M1 (Management)', ctc: '850000.00' },
        { code: 'DESIG-004', name: 'HR Business Partner', grade: 'Band M1 (Management)', ctc: '900000.00' },
        { code: 'DESIG-005', name: 'Quality Assurance Lead', grade: 'Band T1 (Technical)', ctc: '1100000.00' },
        { code: 'DESIG-006', name: 'Supply Chain Specialist', grade: 'Band E1 (Executive)', ctc: '750000.00' },
        { code: 'DESIG-007', name: 'Principal Enterprise Architect', grade: 'Band D1 (Director)', ctc: '2400000.00' },
        { code: 'DESIG-008', name: 'Maintenance Technician', grade: 'Band O1 (Operator)', ctc: '480000.00' }
      ];
      return desigs.map((d) => ({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        code: d.code,
        name: d.name,
        grade: d.grade,
        amount: d.ctc,
        description: `Standard responsibilities and grading profile for ${d.name}`,
        status: 'ACTIVE',
        created_time: now,
        is_active: true
      }));
    }

    if (tableName === 'tb_employee_master') {
      const emps = [
        { code: 'EMP-001', name: 'Anand Venkatesh', dept: 'Engineering & Production', desig: 'Senior Production Engineer', email: 'anand.v@zunoerp.com', phone: '9876543210', sal: '79000.00' },
        { code: 'EMP-002', name: 'Priya Sundaram', dept: 'Human Resources & Talent', desig: 'HR Business Partner', email: 'priya.s@zunoerp.com', phone: '9876543211', sal: '75000.00' },
        { code: 'EMP-003', name: 'Rajesh Iyer', dept: 'Accounts & Financial Control', desig: 'Senior Accounts Executive', email: 'rajesh.i@zunoerp.com', phone: '9876543212', sal: '71000.00' },
        { code: 'EMP-004', name: 'Kavitha Raman', dept: 'Quality Assurance & ISO Compliance', desig: 'Quality Assurance Lead', email: 'kavitha.r@zunoerp.com', phone: '9876543213', sal: '92000.00' },
        { code: 'EMP-005', name: 'Suresh Babu', dept: 'Operations & Plant Maintenance', desig: 'Operations Plant Manager', email: 'suresh.b@zunoerp.com', phone: '9876543214', sal: '133000.00' }
      ];
      return emps.map((e) => ({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        code: e.code,
        name: e.name,
        department: e.dept,
        designation: e.desig,
        email: e.email,
        phone: e.phone,
        amount: e.sal,
        date: '2024-03-15',
        description: `Full-time permanent enterprise staff member`,
        status: 'ACTIVE',
        created_time: now,
        is_active: true
      }));
    }

    const prefix = tableName.replace('tb_', '').substring(0, 4).toUpperCase();
    const title = tableName.replace('tb_', '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const items: StoredRecord[] = [];
    const count = 5;

    for (let i = 1; i <= count; i++) {
      const itemTime = new Date(Date.now() - i * 86400000).toISOString();
      items.push({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        code: `${prefix}-${1000 + i}`,
        name: `${title} Item #${i}`,
        description: `Operational business record for ${title} under active fiscal year`,
        document_number: `DOC-2026-${1000 + i}`,
        status: i % 4 === 0 ? 'PENDING' : 'ACTIVE',
        amount: (i * 14500.5).toFixed(2),
        quantity: (i * 12).toFixed(3),
        currency_code: 'INR',
        created_time: itemTime,
        is_active: true
      });
    }

    return items;
  }
}
