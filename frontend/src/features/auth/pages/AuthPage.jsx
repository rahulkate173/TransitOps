import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLeft from "../components/AuthLeft";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";
import "../styles/auth.css";

const AuthPage = () => {
    const { isAuthenticated, stage, user, registeredEmail: reduxEmail } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState("login"); // 'login' | 'register'
    const [registeredEmail, setRegisteredEmail] = useState("");

    // Redirect after login
    if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
        return null;
    }

    // After OTP verification → show Login with clear instructions
    if (stage === "verified") {
        return (
            <div className="auth-layout">
                <AuthLeft />
                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <div style={{
                            padding: "12px 16px",
                            background: "rgba(46, 204, 113, 0.15)",
                            border: "1px solid rgba(46, 204, 113, 0.4)",
                            borderRadius: "8px",
                            color: "#2ECC71",
                            marginBottom: "16px",
                            fontSize: "14px",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600
                        }}>
                            ✓ Account verified successfully! Please sign in below.
                        </div>
                        <LoginForm onSwitchToRegister={() => {
                            setRegisteredEmail("");
                            setView("register");
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    // After register → OTP screen
    if (stage === "otp-pending" || (registeredEmail && stage !== "verified")) {
        return (
            <div className="auth-layout">
                <AuthLeft />
                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <OtpForm email={reduxEmail || registeredEmail} />
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
