import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { Dashboard, People, MonetizationOn, Plagiarism, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'User Management', icon: <People />, path: '/admin/users' },
        { text: 'Loan Approvals', icon: <MonetizationOn />, path: '/admin/loans' },
        { text: 'Transaction Audit', icon: <Plagiarism />, path: '/admin/transactions' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding onClick={() => navigate(item.path)}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                 <List sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <ListItem disablePadding onClick={handleLogout}>
                        <ListItemButton>
                            <ListItemIcon><Logout color="secondary" /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default AdminSidebar;