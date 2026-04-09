import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, requireComplete = true }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (requireComplete && !user.profileComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" />;
    }

    return children;
};

export default PrivateRoute;
