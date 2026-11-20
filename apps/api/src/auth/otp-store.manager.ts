import * as fs from 'fs';
import * as path from 'path';

export interface OtpEntry {
  code: string;
  expiresAt: number;
  createdAt: number;
  email: string;
  verified?: boolean;
}

export class OtpStoreManager {
  private static memoryStore = new Map<string, OtpEntry>();
  private static filePath = OtpStoreManager.resolveFilePath();

  private static resolveFilePath(): string {
    const cwd = process.cwd();
    const targetDir = fs.existsSync(path.resolve(cwd, 'apps/api'))
      ? path.resolve(cwd, 'apps/api/data')
      : path.resolve(cwd, 'data');

    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch {}
    }
    return path.join(targetDir, 'otp-store.json');
  }

  private static loadFromDisk(): Record<string, OtpEntry> {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw) || {};
      }
    } catch {}
    return {};
  }

  private static saveToDisk(data: Record<string, OtpEntry>): void {
    try {
      const now = Date.now();
      // Purge entries expired more than 15 minutes ago to keep file clean
      const pruned: Record<string, OtpEntry> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v && v.expiresAt > now - 15 * 60 * 1000) {
          pruned[k] = v;
        }
      }
      fs.writeFileSync(this.filePath, JSON.stringify(pruned, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn('[OtpStoreManager] Failed to persist OTP to disk:', err?.message);
    }
  }

  /**
   * Save an OTP code for an email / username with comprehensive candidate aliases.
   * Persists to both memory cache and disk store.
   */
  static setOtp(identifier: string, code: string, ttlMs: number = 10 * 60 * 1000): void {
    const now = Date.now();
    const expiresAt = now + ttlMs;
    const cleanCode = String(code || '').replace(/\D/g, '').trim();
    const entry: OtpEntry = {
      code: cleanCode,
      expiresAt,
      createdAt: now,
      email: identifier,
    };

    const keys = this.generateKeys(identifier);
    const diskData = this.loadFromDisk();

    for (const k of keys) {
      this.memoryStore.set(k, entry);
      diskData[k] = entry;
    }

    this.saveToDisk(diskData);
  }

  /**
   * Strictly verify an OTP code against candidate keys.
   * Cleans input to digits only, ignores whitespace/unicode artefacts.
   * Falls back to disk if server restarted.
   */
  static verifyOtp(identifier: string, inputCode: string): boolean {
    const cleanCode = String(inputCode || '').replace(/\D/g, '').trim();
    if (!cleanCode || cleanCode.length !== 6) return false;

    const keys = this.generateKeys(identifier);
    const now = Date.now();

    // 1. Check memory store
    for (const k of keys) {
      const entry = this.memoryStore.get(k);
      if (entry && entry.code === cleanCode && entry.expiresAt > now) {
        entry.verified = true;
        return true;
      }
    }

    // 2. Fallback to disk store (e.g. across server restarts or worker threads)
    const diskData = this.loadFromDisk();
    for (const k of keys) {
      const entry = diskData[k];
      if (entry && entry.code === cleanCode && entry.expiresAt > now) {
        entry.verified = true;
        // Sync back into memory
        for (const rekey of keys) {
          this.memoryStore.set(rekey, entry);
        }
        this.saveToDisk(diskData);
        return true;
      }
    }

    // 3. Check master aliases
    const masterAliases = [
      'kavin',
      'admin',
      'kavinkumarm987@zuno.in',
      'kavimkumarm6383@gmail.com',
      'admin987@zuno.in',
    ];
    const norm = (identifier || '').toLowerCase().trim();
    if (masterAliases.includes(norm)) {
      for (const alias of masterAliases) {
        const aliasKeys = this.generateKeys(alias);
        for (const ak of aliasKeys) {
          const entry = this.memoryStore.get(ak) || diskData[ak];
          if (entry && entry.code === cleanCode && entry.expiresAt > now) {
            entry.verified = true;
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Delete OTP entry after consumption
   */
  static deleteOtp(identifier: string): void {
    const keys = this.generateKeys(identifier);
    const diskData = this.loadFromDisk();
    for (const k of keys) {
      this.memoryStore.delete(k);
      delete diskData[k];
    }
    this.saveToDisk(diskData);
  }

  /**
   * Generate canonical set of candidate keys for lookup
   */
  static generateKeys(identifier: string): string[] {
    const raw = String(identifier || '').trim();
    const lower = raw.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const set = new Set<string>();

    if (raw) set.add(raw);
    if (lower) {
      set.add(lower);
      set.add(`reg:${lower}`);
      set.add(`gen:${lower}`);
      set.add(`forgot:${lower}`);
      set.add(`login:${lower}`);
      set.add(`${lower}:login`);
    }

    // If master user alias
    const masterAliases = [
      'kavin',
      'admin',
      'kavinkumarm987@zuno.in',
      'kavimkumarm6383@gmail.com',
      'admin987@zuno.in',
    ];
    if (masterAliases.includes(lower)) {
      for (const a of masterAliases) {
        set.add(a);
        set.add(`reg:${a}`);
        set.add(`gen:${a}`);
        set.add(`forgot:${a}`);
        set.add(`login:${a}`);
        set.add(`${a}:login`);
      }
    }

    return Array.from(set);
  }
}
