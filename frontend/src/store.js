import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import vehicleReducer from "./features/vehicleRegistry/vehicle.slice";
import driverReducer from "./features/drivers/driver.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vehicles: vehicleReducer,
        drivers: driverReducer,
    },
});
