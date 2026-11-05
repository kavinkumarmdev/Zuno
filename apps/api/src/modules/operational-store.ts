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

  private static writeData(data: Record<string, StoredRecord[]>): void {
    this.memoryCache = data;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[OperationalDataStore] Failed to write store to disk:', err.message);
    }
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
    const prefix = tableName.replace('tb_', '').substring(0, 4).toUpperCase();
    const title = tableName.replace('tb_', '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const items: StoredRecord[] = [];
    const count = 5;

    for (let i = 1; i <= count; i++) {
      const now = new Date(Date.now() - i * 86400000).toISOString();
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
        created_time: now,
        is_active: true
      });
    }

    return items;
  }
}
