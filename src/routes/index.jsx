//import useContext
import { useContext } from 'react';

//import context
import { AuthContext } from '../context/AuthContext';

//import react router dom
import { Routes, Route, Navigate } from 'react-router-dom';

//import view home
import Home from '../views/home/index.jsx';

//import view register
import Register from '../views/auth/register.jsx';

//import view login
import Login from '../views/auth/login.jsx';

//import view login
import Dashboard from '../views/admin/dashboard/index.jsx';

//import view documents index
import DocumentsIndex from '../views/admin/documents/index.jsx';

export default function AppRoutes() {
    //destructure context "isAuthenticated"
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Routes>
            {/* route "/" */}
            <Route path="/" element={<Home />} />

            {/* route "/register" */}
            <Route path="/register" element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Register />} />

            {/* route "/login" */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />} />

            {/* route "/admin/dashboard" */}
            <Route path="/admin/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />

            {/* route "/admin/documents" */}
            <Route path="/admin/documents" element={isAuthenticated ? <DocumentsIndex /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}
