import apiClient from "../../../apiClient";

const BASE = "/api/expenses";

export const expenseService = {
    getFuelLogs:      (params)   => apiClient.get(`${BASE}/fuel`, { params }),
    logFuel:          (data)     => apiClient.post(`${BASE}/fuel`, data),
    getOtherExpenses: (params)   => apiClient.get(`${BASE}/other`, { params }),
    addExpense:       (data)     => apiClient.post(`${BASE}/`, data),
    updateExpense:    (id, data) => apiClient.put(`${BASE}/${id}`, data),
    deleteExpense:    (id)       => apiClient.delete(`${BASE}/${id}`),
};
