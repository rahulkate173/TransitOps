import { useSelector } from "react-redux";
import { selectUser } from "../../auth/auth.slice";

const Topbar = ({ searchValue, onSearchChange }) => {
    const user = useSelector(selectUser);

    return (
        <header className="topbar">
            <input
                id="topbar-search"
                className="topbar-search"
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <div className="topbar-right">
                <span className="topbar-user">{user?.username || "Raven K."}</span>
                <span className="topbar-role-badge">{user?.role || "Dispatcher"}</span>
            </div>
        </header>
    );
};

export default Topbar;
