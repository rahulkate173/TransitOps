import { useDispatch, useSelector } from "react-redux";
import {
    registerUser,
    loginUser,
    verifyEmail,
    logoutUser,
    clearError,
    clearSuccess,
    setStage,
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectAuthStage,
    selectAuthSuccess,
    selectRegisteredEmail,
} from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const stage = useSelector(selectAuthStage);
    const successMessage = useSelector(selectAuthSuccess);
    const registeredEmail = useSelector(selectRegisteredEmail);

    return {
        // state
        user,
        isAuthenticated,
        loading,
        error,
        stage,
        successMessage,
        registeredEmail,

        // actions
        register: (data) => dispatch(registerUser(data)),
        login: (data) => dispatch(loginUser(data)),
        verify: (data) => dispatch(verifyEmail(data)),
        logout: () => dispatch(logoutUser()),
        clearError: () => dispatch(clearError()),
        clearSuccess: () => dispatch(clearSuccess()),
        setStage: (s) => dispatch(setStage(s)),
    };
}
