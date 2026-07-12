import apiClient from "../../../apiClient";

export const settingsService = {
    getAllPermissions: () => apiClient.get("/api/settings/permissions"),
    updatePermission: (payload) => apiClient.put("/api/settings/permissions", payload),
    resetPermissions: () => apiClient.post("/api/settings/reset"),
};
