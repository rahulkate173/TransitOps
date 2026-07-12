import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./features/auth/pages/LandingPage";
import AuthPage from "./features/auth/pages/AuthPage";
import VehicleRegistry from "./features/vehicleRegistry/pages/VehicleRegistry";
import DriversPage from "./features/drivers/pages/DriversPage";
import Sidebar from "./features/vehicleRegistry/components/Sidebar";
import Topbar from "./features/vehicleRegistry/components/Topbar";
import "././features/vehicleRegistry/styles/vehicle.css";

// Shell wraps all protected pages
const AppShell = ({ children }) => {
    const [search, setSearch] = useState("");

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-area">
                <Topbar searchValue={search} onSearchChange={setSearch} />
                {children}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected shell pages */}
            <Route path="/fleet" element={
                <AppShell>
                    <VehicleRegistry />
                </AppShell>
            } />

            {/* Placeholder routes */}
            <Route path="/dashboard" element={
                <AppShell>
                    <div className="page-content" style={{ color: "#666", fontFamily: "Courier Prime, monospace" }}>
                        Dashboard — coming soon
                    </div>
                </AppShell>
            } />
            <Route path="/drivers" element={
                <AppShell>
                    <DriversPage />
                </AppShell>
            } />
            <Route path="/trips" element={
                <AppShell>
                    <div className="page-content" style={{ color: "#666", fontFamily: "Courier Prime, monospace" }}>
                        Trips — coming soon
                    </div>
                </AppShell>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
