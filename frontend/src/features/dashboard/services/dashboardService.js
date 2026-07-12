import apiClient from "../../../apiClient";

export const dashboardService = {
    getDashboard: () => apiClient.get("/api/dashboard/"),
};
