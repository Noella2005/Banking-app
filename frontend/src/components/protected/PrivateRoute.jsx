import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check for token and if the role is 'user'
    return token && user?.role === 'user' ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;