import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AlertBox from "./AlertBox";


const LoginForm = ({ onSwitchToRegister }) => {
    const { login, loading, error, clearError } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleChange = (e) => {
        clearError();
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email: form.email, password: form.password });
    };

    return (
        <>
            <h1 className="auth-form-title">Sign in to your account</h1>
            <p className="auth-form-subtitle">Enter your credentials to continue</p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <AlertBox type="error" message={error} />

                {/* Email */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Raven.k@transitops.in"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="login-password">Password</label>
                    <div className="auth-input-password-wrap">
                        <input
                            id="login-password"
                            className="auth-input"
                            type={showPw ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="auth-toggle-pw"
                            onClick={() => setShowPw((v) => !v)}
                            aria-label="Toggle password visibility"
                        >
                            {showPw ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.39 1 12a10.19 10.19 0 012.26-3.67M6.53 6.53A10 10 0 0112 4c5 0 9.27 3.61 11 8a10.05 10.05 0 01-2.54 3.92M3 3l18 18" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12C2.73 7.61 7 4 12 4s9.27 3.61 11 8c-1.73 4.39-6 8-11 8S2.73 16.39 1 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>


                {/* Remember + Forgot */}
                <div className="auth-row">
                    <label className="auth-remember">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <a href="#" className="auth-forgot">Forgot password?</a>
                </div>

                {/* Submit */}
                <button
                    id="login-submit"
                    className="auth-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <span className="auth-spinner" /> : "Sign In"}
                </button>
            </form>


            {/* Switch to Register */}
            <div className="auth-switch">
                Don&apos;t have an account?
                <button type="button" onClick={onSwitchToRegister}>
                    Create account
                </button>
            </div>
        </>
    );
};

export default LoginForm;
