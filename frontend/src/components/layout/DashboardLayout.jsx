import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // User sidebar
import AdminSidebar from './AdminSidebar'; // Admin sidebar
import Topbar from './Topbar';

const DashboardLayout = ({ isAdmin = false }) => { // Accept an isAdmin prop
    return (
        <Box sx={{ display: 'flex' }}>
            <Topbar />
            {isAdmin ? <AdminSidebar /> : <Sidebar />} {/* Conditional rendering */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;