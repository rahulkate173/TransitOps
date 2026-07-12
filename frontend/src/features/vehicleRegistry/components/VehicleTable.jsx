import StatusBadge from "./StatusBadge";

const COLUMNS = [
    { key: "registrationNumber", label: "REG. NO. / UNIQUE" },
    { key: "vehicleName", label: "NAME / MOD." },
    { key: "type", label: "TYPE" },
    { key: "capacity", label: "CAPACITY" },
    { key: "odometer", label: "ODOMETER" },
    { key: "acquisitionCost", label: "ACQ. COST" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "" },
];

const VehicleTable = ({ vehicles, onEdit, onRetire, onStatusChange, loading }) => {
    if (loading) {
        return <div className="vr-empty">Loading vehicles...</div>;
    }

    if (!vehicles.length) {
        return <div className="vr-empty">No vehicles found.</div>;
    }

    return (
        <div className="vr-table-wrap">
            <table className="vr-table">
                <thead>
                    <tr>
                        {COLUMNS.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((v) => (
                        <tr key={v._id}>
                            <td className="reg-no">{v.registrationNumber}</td>
                            <td>{v.vehicleName}</td>
                            <td>{v.type}</td>
                            <td>
                                {v.capacityUnit === "ton"
                                    ? `${v.maxLoadCapacity} Ton`
                                    : `${v.maxLoadCapacity.toLocaleString("en-IN")} kg`}
                            </td>
                            <td>{v.odometer?.toLocaleString("en-IN")}</td>
                            <td>₹{v.acquisitionCost?.toLocaleString("en-IN")}</td>
                            <td><StatusBadge status={v.status} /></td>
                            <td>
                                <div className="vr-actions">
                                    <button
                                        className="vr-icon-btn"
                                        title="Edit"
                                        onClick={() => onEdit(v)}
                                    >
                                        ✎
                                    </button>
                                    {v.status !== "Retired" && (
                                        <button
                                            className="vr-icon-btn danger"
                                            title="Retire vehicle"
                                            onClick={() => onRetire(v._id)}
                                        >
                                            ✕
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

export default VehicleTable;
