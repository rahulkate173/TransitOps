const STATUS_CLASS = {
    "Available": "Available",
    "On Trip": "On-Trip",
    "Off Duty": "Off-Duty",
    "Suspended": "Suspended",
};

const DriverStatusBadge = ({ status }) => (
    <span className={`status-badge ${STATUS_CLASS[status] || ""}`}>
        {status}
    </span>
);

export default DriverStatusBadge;
