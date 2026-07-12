import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./features/auth/pages/LandingPage";

import AuthPage from "./features/auth/pages/AuthPage";
import VehicleRegistry from "./features/vehicleRegistry/pages/VehicleRegistry";
import DriversPage from "./features/drivers/pages/DriversPage";
import TripsPage from "./features/trips/pages/TripsPage";
import MaintenancePage from "./features/maintenance/pages/MaintenancePage";
import ExpensesPage from "./features/expenses/pages/ExpensesPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";

// Shell
import Sidebar from "./features/vehicleRegistry/components/Sidebar";
import Topbar from "./features/vehicleRegistry/components/Topbar";

// RBAC
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import usePermissions from "./features/auth/hooks/usePermissions";

// Styles
import "././features/vehicleRegistry/styles/vehicle.css";

// ─── AppShell ─────────────────────────────────────────────────────────────────
// Wraps all protected pages with sidebar + topbar
// Also bootstraps the permissions fetch on first render after login
const AppShell = ({ children }) => {
    const [search, setSearch] = useState("");
    usePermissions(); // auto-fetch role permissions after login

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

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
    return (
        <Routes>

            {/* ── Public ──────────────────────────────────────── */}
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}

            <Route path="/auth" element={<AuthPage />} />

            {/* ── Protected: Fleet ────────────────────────────── */}
            <Route path="/fleet" element={
                <AppShell>
                    <ProtectedRoute module="Fleet" action="view">
                        <VehicleRegistry />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Drivers ──────────────────────────── */}
            <Route path="/drivers" element={
                <AppShell>
                    <ProtectedRoute module="Drivers" action="view">
                        <DriversPage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Trips ────────────────────────────── */}
            <Route path="/trips" element={
                <AppShell>
                    <ProtectedRoute module="Trips" action="view">
                        <TripsPage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Maintenance ──────────────────────── */}
            <Route path="/maintenance" element={
                <AppShell>
                    <ProtectedRoute module="Maintenance" action="view">
                        <MaintenancePage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Expenses ─────────────────────────── */}
            <Route path="/expenses" element={
                <AppShell>
                    <ProtectedRoute module="FuelExpenses" action="view">
                        <ExpensesPage />
                    </ProtectedRoute>
                </AppShell>
            } />
            <Route path="/fuel" element={<Navigate to="/expenses" replace />} />

            {/* ── Protected: Dashboard ────────────────────────── */}
            <Route path="/dashboard" element={
                <AppShell>
                    <ProtectedRoute module="Dashboard" action="view">
                        <DashboardPage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Analytics ────────────────────────── */}
            <Route path="/analytics" element={
                <AppShell>
                    <ProtectedRoute module="Analytics" action="view">
                        <AnalyticsPage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Protected: Settings (Owner only) ────────────── */}
            <Route path="/settings" element={
                <AppShell>
                    <ProtectedRoute module="Settings" action="view">
                        <SettingsPage />
                    </ProtectedRoute>
                </AppShell>
            } />

            {/* ── Defaults ────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/fleet" replace />} />

            {/* Catch-all */}

        </Routes>
    );
};

export default App;
