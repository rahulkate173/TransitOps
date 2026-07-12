import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../auth.slice";
import {
    selectCanAccess,
    selectPermissionsLoaded,
    selectPermissionsLoading,
    fetchPermissions,
} from "../permissions.slice";

/**
 * ProtectedRoute
 *
 * 1. Not logged in             → redirect to /auth
 * 2. Permissions still loading → show "Checking access…"
 * 3. Permissions failed        → show retry UI
 * 4. No access for role+module → show AccessDenied
 * 5. All checks pass           → render children
 */
const ProtectedRoute = ({ module, action = "view", children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const permissionsLoaded = useSelector(selectPermissionsLoaded);
    const permissionsLoading = useSelector(selectPermissionsLoading);
    const permissionsError = useSelector((s) => s.permissions.error);

    // 1. Not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // Owner bypasses everything
    if (user?.role === "Owner") {
        return children;
    }

    // 2. Still loading
    if (permissionsLoading && !permissionsLoaded) {
        return <StatusScreen message="Checking access…" />;
    }

    // 3. Not yet started (waiting for usePermissions to trigger the dispatch)
    if (!permissionsLoaded) {
        return null;
    }

    // 4. Fetch failed — show retry
    if (permissionsError && !permissionsLoaded) {
        return (
            <StatusScreen
                message={`Could not load permissions: ${permissionsError}`}
                action={() => dispatch(fetchPermissions())}
                actionLabel="Retry"
            />
        );
    }

    // 5. Check permission via PermissionGate (uses useSelector with selector factory)
    return (
        <PermissionGate role={user?.role} module={module} action={action}>
            {children}
        </PermissionGate>
    );
};

// ─── PermissionGate ───────────────────────────────────────────────────────────
const PermissionGate = ({ role, module, action, children }) => {
    const hasAccess = useSelector(selectCanAccess(role, module, action));
    if (!hasAccess) return <AccessDenied module={module} />;
    return children;
};

// ─── Shared UI States ─────────────────────────────────────────────────────────
const centerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 16,
    fontFamily: "'Courier Prime', monospace",
    padding: 40,
};

const StatusScreen = ({ message, action, actionLabel }) => (
    <div style={centerStyle}>
        <div style={{ fontSize: 13, color: "#555" }}>{message}</div>
        {action && (
            <button
                onClick={action}
                style={{
                    background: "#B8860B",
                    color: "#111",
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "'Courier Prime', monospace",
                    fontWeight: 700,
                    fontSize: 13,
                    padding: "8px 20px",
                    cursor: "pointer",
                }}
            >
                {actionLabel}
            </button>
        )}
    </div>
);

const AccessDenied = ({ module }) => (
    <div style={centerStyle}>
        <div style={{ fontSize: 44 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#F0EDE8" }}>Access Denied</div>
        <div style={{ fontSize: 13, color: "#555", textAlign: "center", maxWidth: 340 }}>
            Your role does not have permission to access{" "}
            <span style={{ color: "#B8860B" }}>{module}</span>.
            Contact your Owner to request access.
        </div>
    </div>
);

export default ProtectedRoute;
