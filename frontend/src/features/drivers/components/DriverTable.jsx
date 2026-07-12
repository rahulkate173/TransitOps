import DriverStatusBadge from "./DriverStatusBadge";

const getSafetyClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
};

const getExpiryClass = (expiry) => {
    const now = new Date();
    const exp = new Date(expiry);
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (exp <= now) return "expiry-expired";
    if (diffDays <= 90) return "expiry-warning";
    return "expiry-ok";
};

const formatExpiry = (expiry) => {
    const d = new Date(expiry);
    const isExpired = d <= new Date();
    const str = d.toLocaleDateString("en-IN", { month: "2-digit", year: "numeric" });
    return `${str}${isExpired ? " EXPIRED" : ""}`;
};

const DriverTable = ({ drivers, loading, onEdit, onSuspend, onActivate }) => {
    if (loading) return <div className="vr-empty">Loading drivers...</div>;
    if (!drivers.length) return <div className="vr-empty">No drivers found.</div>;

    return (
        <div className="vr-table-wrap">
            <table className="vr-table">
                <thead>
                    <tr>
                        <th>DRIVER</th>
                        <th>LICENSE NO.</th>
                        <th>CATEGORY</th>
                        <th>EXPIRY</th>
                        <th>CONTACT</th>
                        <th>SAFETY</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((d) => (
                        <tr key={d._id}>
                            <td style={{ color: "#F0EDE8", fontWeight: 600 }}>{d.name}</td>
                            <td className="reg-no">{d.licenseNumber}</td>
                            <td>{d.licenseCategory}</td>
                            <td className={getExpiryClass(d.licenseExpiry)}>
                                {formatExpiry(d.licenseExpiry)}
                            </td>
                            <td>{d.contactNumber}</td>
                            <td>
                                <div className="safety-score-wrap">
                                    <div className="safety-score-bar">
                                        <div
                                            className={`safety-score-fill ${getSafetyClass(d.safetyScore)}`}
                                            style={{ width: `${d.safetyScore}%` }}
                                        />
                                    </div>
                                    <span className="safety-score-label">{d.safetyScore}%</span>
                                </div>
                            </td>
                            <td><DriverStatusBadge status={d.status} /></td>
                            <td>
                                <div className="vr-actions">
                                    <button
                                        className="vr-icon-btn"
                                        title="Edit"
                                        onClick={() => onEdit(d)}
                                    >
                                        ✎
                                    </button>
                                    {d.status === "Suspended" ? (
                                        <button
                                            className="vr-icon-btn"
                                            title="Activate"
                                            onClick={() => onActivate(d._id)}
                                            style={{ color: "#2ECC71", borderColor: "#2ECC71" }}
                                        >
                                            ▶
                                        </button>
                                    ) : (
                                        <button
                                            className="vr-icon-btn danger"
                                            title="Suspend"
                                            onClick={() => onSuspend(d._id)}
                                        >
                                            ⏸
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriverTable;
