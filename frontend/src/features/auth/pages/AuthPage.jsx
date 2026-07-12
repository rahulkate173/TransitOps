import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLeft from "../components/AuthLeft";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";
import "../styles/auth.css";

const AuthPage = () => {
    const { isAuthenticated, stage, user } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState("login"); // 'login' | 'register'
    const [registeredEmail, setRegisteredEmail] = useState("");

    // Redirect after login
    if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
        return null;
    }

    // After register → OTP screen
    if (stage === "otp-pending") {
        return (
            <div className="auth-layout">
                <AuthLeft />
                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <OtpForm email={registeredEmail} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-layout">
            <AuthLeft />
            <div className="auth-right">
                <div className="auth-form-wrapper">
                    {view === "login" ? (
                        <LoginForm onSwitchToRegister={() => setView("register")} />
                    ) : (
                        <RegisterForm
                            onSwitchToLogin={() => setView("login")}
                            onRegisterSuccess={(email) => setRegisteredEmail(email)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
