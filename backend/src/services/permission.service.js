import RolePermission from "../models/rolePermission.model.js";

// ─── In-Memory Cache ──────────────────────────────────────────────────────────
// Structure: Map<"Role:Module", { permissions, cachedAt }>
// TTL: 5 minutes — avoids DB hit on every request
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const cacheKey = (role, module) => `${role}:${module}`;

const getFromCache = (role, module) => {
    const entry = cache.get(cacheKey(role, module));
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
        cache.delete(cacheKey(role, module));
        return null;
    }
    return entry.permissions;
};

const setInCache = (role, module, permissions) => {
    cache.set(cacheKey(role, module), { permissions, cachedAt: Date.now() });
};

// Invalidate a single role:module entry (call after update)
export const invalidateCache = (role, module) => {
    cache.delete(cacheKey(role, module));
};

// Invalidate every entry for a role (call after reset)
export const invalidateCacheForRole = (role) => {
    for (const key of cache.keys()) {
        if (key.startsWith(`${role}:`)) cache.delete(key);
    }
};

// Flush the whole cache (call after reset-all)
export const flushCache = () => cache.clear();

// ─── Permission Lookup ────────────────────────────────────────────────────────
/**
 * getPermission(role, module)
 * Returns the permissions object { view, create, update, delete }
 * or null if no record exists (treat as no access).
 * Checks in-memory cache first; falls back to DB.
 */
export const getPermission = async (role, module) => {
    // Cache hit
    const cached = getFromCache(role, module);
    if (cached !== null) return cached;

    // DB lookup
    const record = await RolePermission.findOne({ role, module }).lean();
    const permissions = record?.permissions ?? null;

    if (permissions) setInCache(role, module, permissions);
    return permissions;
};

// ─── Default Permissions Seed Data ───────────────────────────────────────────
const DEFAULT_PERMISSIONS = [
    // ── Fleet Manager ─────────────────────────────────────────────────────────
    { role: "Fleet Manager", module: "Fleet",        permissions: { view: true, create: true, update: true, delete: true } },
    { role: "Fleet Manager", module: "Drivers",      permissions: { view: true, create: true, update: true, delete: true } },
    { role: "Fleet Manager", module: "Trips",        permissions: { view: true, create: false, update: false, delete: false } },
    { role: "Fleet Manager", module: "Maintenance",  permissions: { view: true, create: false, update: false, delete: false } },
    { role: "Fleet Manager", module: "FuelExpenses", permissions: { view: true, create: false, update: false, delete: false } },
    { role: "Fleet Manager", module: "Dashboard",    permissions: { view: true, create: false, update: false, delete: false } },
    { role: "Fleet Manager", module: "Analytics",    permissions: { view: true, create: false, update: false, delete: false } },

    // ── Dispatcher ────────────────────────────────────────────────────────────
    { role: "Dispatcher", module: "Fleet",     permissions: { view: true,  create: false, update: false, delete: false } },
    { role: "Dispatcher", module: "Trips",     permissions: { view: true,  create: true,  update: true,  delete: true  } },
    { role: "Dispatcher", module: "Dashboard", permissions: { view: true,  create: false, update: false, delete: false } },

    // ── Safety Officer ────────────────────────────────────────────────────────
    { role: "Safety Officer", module: "Drivers",     permissions: { view: true, create: true, update: true, delete: true } },
    { role: "Safety Officer", module: "Trips",       permissions: { view: true, create: false, update: false, delete: false } },
    { role: "Safety Officer", module: "Maintenance", permissions: { view: true, create: true,  update: true,  delete: true  } },
    { role: "Safety Officer", module: "Dashboard",   permissions: { view: true, create: false, update: false, delete: false } },

    // ── Financial Analyst ─────────────────────────────────────────────────────
    { role: "Financial Analyst", module: "Fleet",        permissions: { view: true,  create: false, update: false, delete: false } },
    { role: "Financial Analyst", module: "FuelExpenses", permissions: { view: true,  create: true,  update: true,  delete: true  } },
    { role: "Financial Analyst", module: "Dashboard",    permissions: { view: true,  create: false, update: false, delete: false } },
    { role: "Financial Analyst", module: "Analytics",    permissions: { view: true,  create: false, update: false, delete: false } },
];

/**
 * seedDefaultPermissions()
 * Upserts every default permission record.
 * Safe to call multiple times — uses updateOne with upsert.
 */
export const seedDefaultPermissions = async () => {
    const ops = DEFAULT_PERMISSIONS.map((p) => ({
        updateOne: {
            filter: { role: p.role, module: p.module },
            update: { $set: { permissions: p.permissions } },
            upsert: true,
        },
    }));

    await RolePermission.bulkWrite(ops);
    flushCache(); // Invalidate cache after seed
    console.log(`[permissions] Seeded ${ops.length} default permission records.`);
};

/**
 * resetToDefaults()
 * Drops all existing permissions and re-seeds from defaults.
 */
export const resetToDefaults = async () => {
    await RolePermission.deleteMany({});
    flushCache();
    await seedDefaultPermissions();
};

/**
 * getAllPermissions()
 * Returns all RolePermission records sorted by role then module.
 */
export const getAllPermissions = async () => {
    return RolePermission.find().sort({ role: 1, module: 1 }).lean();
};

/**
 * updatePermission(role, module, permissions)
 * Updates a single role+module record. Invalidates cache entry.
 */
export const updatePermission = async (role, module, permissions) => {
    const record = await RolePermission.findOneAndUpdate(
        { role, module },
        { $set: { permissions } },
        { new: true, upsert: true, runValidators: true }
    );
    invalidateCache(role, module);
    return record;
};
