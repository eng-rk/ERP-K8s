const crypto = require('crypto');

class PermissionCache {
  constructor() {
    this.cache = new Map();
    this.defaultTtlMs = 5 * 60 * 1000; // 5 minutes default cache TTL
  }

  _generateKey(userId, version = 1) {
    return `perm_cache:${userId}:v${version}`;
  }

  get(userId, version = 1) {
    const key = this._generateKey(userId, version);
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.permissions;
  }

  set(userId, permissions, version = 1, ttlMs = this.defaultTtlMs) {
    const key = this._generateKey(userId, version);
    this.cache.set(key, {
      permissions,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now()
    });
  }

  invalidate(userId) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`perm_cache:${userId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  calculatePermissionHash(permissions) {
    const sortedKeys = Object.keys(permissions).sort();
    const normalized = sortedKeys.map(key => `${key}:${permissions[key].scope}:${permissions[key].granted ? '1' : '0'}`).join('|');
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }
}

module.exports = new PermissionCache();
