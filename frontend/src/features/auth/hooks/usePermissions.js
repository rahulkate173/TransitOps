import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions, selectPermissionsLoaded } from "../permissions.slice";
import { selectIsAuthenticated, selectUser } from "../auth.slice";

/**
 * usePermissions
 * Automatically fetches role permissions from the backend once the user
 * is authenticated. Re-fetches if the user changes (e.g., after login).
 * Owner doesn't need to fetch — they always have access.
 */
const usePermissions = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const loaded = useSelector(selectPermissionsLoaded);

    useEffect(() => {
        // Owner bypasses permission checks — no fetch needed
        if (isAuthenticated && user && user.role !== "Owner" && !loaded) {
            dispatch(fetchPermissions());
        }
    }, [isAuthenticated, user, loaded, dispatch]);
};

export default usePermissions;
