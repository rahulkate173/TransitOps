// ─── Role Constants ───────────────────────────────────────────────────────────
// Single source of truth for all role strings used across the backend.
// Import these instead of writing raw strings in middleware / routes.

export const ROLES = {
    OWNER:             "Owner",
    FLEET_MANAGER:     "Fleet Manager",
    DISPATCHER:        "Dispatcher",
    SAFETY_OFFICER:    "Safety Officer",
    FINANCIAL_ANALYST: "Financial Analyst",
};

// Convenience array of every role (useful for validation)
export const ALL_ROLES = Object.values(ROLES);
