import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import vehicleReducer from "./features/vehicleRegistry/vehicle.slice";
import driverReducer from "./features/drivers/driver.slice";
import permissionsReducer from "./features/auth/permissions.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vehicles: vehicleReducer,
        drivers: driverReducer,
        permissions: permissionsReducer,
    },
});
