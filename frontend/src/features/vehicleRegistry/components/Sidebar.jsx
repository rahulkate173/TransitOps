import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Fleet", to: "/fleet" },
    { label: "Drivers", to: "/drivers" },
    { label: "Trips", to: "/trips" },
    { label: "Maintenance", to: "/maintenance" },
    { label: "Fuel & Expenses", to: "/fuel" },
    { label: "Analytics", to: "/analytics" },
    { label: "Settings", to: "/settings" },
];

const Sidebar = () => (
    <aside className="sidebar">
        <div className="sidebar-brand">TransitOps</div>
        <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ label, to }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
                >
                    {label}
                </NavLink>
            ))}
        </nav>
    </aside>
);

export default Sidebar;
