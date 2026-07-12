import { useDispatch, useSelector } from "react-redux";
import {
    fetchDrivers,
    addDriver,
    updateDriver,
    suspendDriver,
    activateDriver,
    updateSafetyScore,
    clearDriverError,
    clearDriverSuccess,
    selectDrivers,
    selectDriverLoading,
    selectDriverError,
    selectDriverSuccess,
} from "../driver.slice";

export function useDriver() {
    const dispatch = useDispatch();

    return {
        drivers: useSelector(selectDrivers),
        loading: useSelector(selectDriverLoading),
        error: useSelector(selectDriverError),
        successMessage: useSelector(selectDriverSuccess),

        fetchAll: (params) => dispatch(fetchDrivers(params)),
        add: (data) => dispatch(addDriver(data)),
        update: (id, data) => dispatch(updateDriver({ id, data })),
        suspend: (id) => dispatch(suspendDriver(id)),
        activate: (id) => dispatch(activateDriver(id)),
        updateScore: (id, safetyScore) => dispatch(updateSafetyScore({ id, safetyScore })),
        clearError: () => dispatch(clearDriverError()),
        clearSuccess: () => dispatch(clearDriverSuccess()),
    };
}
