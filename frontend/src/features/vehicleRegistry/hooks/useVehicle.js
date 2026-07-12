import { useDispatch, useSelector } from "react-redux";
import {
    fetchVehicles,
    addVehicle,
    updateVehicle,
    updateVehicleStatus,
    retireVehicle,
    clearVehicleError,
    clearVehicleSuccess,
    selectVehicles,
    selectVehicleLoading,
    selectVehicleError,
    selectVehicleSuccess,
} from "../vehicle.slice";

export function useVehicle() {
    const dispatch = useDispatch();

    return {
        vehicles: useSelector(selectVehicles),
        loading: useSelector(selectVehicleLoading),
        error: useSelector(selectVehicleError),
        successMessage: useSelector(selectVehicleSuccess),

        fetchAll: (params) => dispatch(fetchVehicles(params)),
        add: (data) => dispatch(addVehicle(data)),
        update: (id, data) => dispatch(updateVehicle({ id, data })),
        updateStatus: (id, status) => dispatch(updateVehicleStatus({ id, status })),
        retire: (id) => dispatch(retireVehicle(id)),
        clearError: () => dispatch(clearVehicleError()),
        clearSuccess: () => dispatch(clearVehicleSuccess()),
    };
}
