import apiClient from "../../../apiClient";

const BASE = "/api/trips";

export const tripService = {
    // Core CRUD
    getAll:            (params)     => apiClient.get(`${BASE}/`,              { params }),
    getById:           (id)         => apiClient.get(`${BASE}/${id}`),
    create:            (data)       => apiClient.post(`${BASE}/`,              data),
    update:            (id, data)   => apiClient.put(`${BASE}/${id}`,          data),

    // Status transitions
    dispatch:          (id)         => apiClient.patch(`${BASE}/${id}/dispatch`),
    complete:          (id, data)   => apiClient.patch(`${BASE}/${id}/complete`, data),
    cancel:            (id)         => apiClient.patch(`${BASE}/${id}/cancel`),

    // Board + dropdowns
    getLiveBoard:      ()           => apiClient.get(`${BASE}/live`),
    getAvailableVehicles: ()        => apiClient.get(`${BASE}/available-vehicles`),
    getAvailableDrivers:  ()        => apiClient.get(`${BASE}/available-drivers`),
};
