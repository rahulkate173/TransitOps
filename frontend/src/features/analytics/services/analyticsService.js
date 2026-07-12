import apiClient from "../../../apiClient";

export const analyticsService = {
    getAnalytics: () => apiClient.get("/api/analytics/"),
};
