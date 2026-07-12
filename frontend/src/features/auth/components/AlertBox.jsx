const AlertBox = ({ type = "error", message }) => {
    if (!message) return null;

    const icon = type === "error" ? "✕" : "✓";

    return (
        <div className={`auth-alert auth-alert-${type}`}>
            <span>{icon}</span>
            <span>{message}</span>
        </div>
    );
};

export default AlertBox;
