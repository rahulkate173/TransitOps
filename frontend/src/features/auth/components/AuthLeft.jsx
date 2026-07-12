import { useNavigate } from "react-router-dom";

// Left decorative panel with logo, roles list, and footer
const AuthLeft = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-left">
            {/* Logo */}
            <div className="auth-logo">
                <div
                    className="auth-logo-icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                    title="Back to home"
                >
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} />
                    ))}
                </div>
                <div
                    className="auth-logo-title"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    TransitOps
                </div>
                <div className="auth-logo-subtitle">Smart Transport Operations Platform</div>
            </div>

            {/* Roles */}
            <div className="auth-roles">
                <p className="auth-roles-title">One login, four roles:</p>
                <ul className="auth-roles-list">
                    <li>Fleet Manager</li>
                    <li>Dispatcher</li>
                    <li>Safety Officer</li>
                    <li>Financial Analyst</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="auth-left-footer">TRANSITOPS © 2026 · RBAC ENA.</div>
        </div>
    );
};

export default AuthLeft;
