import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './features/auth/pages/AuthPage'

const App = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            {/* Placeholder for dashboard */}
            <Route path="/dashboard" element={<div style={{ color: '#fff', padding: 40 }}>Dashboard (coming soon)</div>} />
        </Routes>
    )
}

export default App
