const STATUS_CLASS = {
    "Available": "Available",
    "On Trip": "On-Trip",
    "In Shop": "In-Shop",
    "Retired": "Retired",
};

const StatusBadge = ({ status }) => (
    <span className={`status-badge ${STATUS_CLASS[status] || ""}`}>
        {status}
    </span>
);

export default StatusBadge;
