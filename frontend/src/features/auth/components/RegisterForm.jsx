import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import AlertBox from "./AlertBox";

const ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
    const { register, loading, error, successMessage, clearError } = useAuth();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });
    const [showPw, setShowPw] = useState(false);

    const handleChange = (e) => {
        clearError();
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(form);
        if (!res?.error) {
            onRegisterSuccess?.(form.email);
        }
    };

    return (
        <>
            <h1 className="auth-form-title">Create your account</h1>
            <p className="auth-form-subtitle">Join TransitOps with your assigned role</p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <AlertBox type="error" message={error} />
                <AlertBox type="success" message={successMessage} />

                {/* Username */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-username">Username</label>
                    <input
                        id="reg-username"
                        className="auth-input"
                        type="text"
                        name="username"
                        placeholder="raven_k"
                        value={form.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>

                {/* Email */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="raven@transitops.in"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-password">Password</label>
                    <div className="auth-input-password-wrap">
                        <input
                            id="reg-password"
                            className="auth-input"
                            type={showPw ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
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

                {/* Role */}
                <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-role">Role (RBAC)</label>
                    <select
                        id="reg-role"
                        className="auth-select"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="">Select your role</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
                <button
                    id="register-submit"
                    className="auth-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <span className="auth-spinner" /> : "Create Account"}
                </button>
            </form>

            {/* Switch */}
            <div className="auth-switch">
                Already have an account?
                <button type="button" onClick={onSwitchToLogin}>
                    Sign in
                </button>
            </div>
        </>
    );
};

export default RegisterForm;
