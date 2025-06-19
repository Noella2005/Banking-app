import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ManagerRoute = () => {
    try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            return <Navigate to="/login" />;
        }

        const user = JSON.parse(userString);

        if (user && user.role === 'manager') {
            return <Outlet />;
        } else {
            // This case handles a logged-in user who is NOT a manager trying to access manager routes
            return <Navigate to="/dashboard" />; 
        }

    } catch (error) {
        console.error("Error in ManagerRoute:", error);
        // If there's an error (e.g., malformed JSON), log out and redirect
        localStorage.clear();
        return <Navigate to="/login" />;
    }
};

export default ManagerRoute;