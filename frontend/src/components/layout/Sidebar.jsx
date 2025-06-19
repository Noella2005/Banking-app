import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider } from '@mui/material';
import { Dashboard, SwapHoriz, RequestQuote, History, Person, Settings, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Transfer Funds', icon: <SwapHoriz />, path: '/dashboard/transfer' },
        { text: 'Request Loan', icon: <RequestQuote />, path: '/dashboard/request-loan' },
        { text: 'Transaction History', icon: <History />, path: '/dashboard/history' },
    ];
    
    const secondaryMenuItems = [
        { text: 'Profile', icon: <Person />, path: '/dashboard/profile' },
        { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
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
                <Divider />
                 <List>
                    {secondaryMenuItems.map((item) => (
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
                        <ListItemButton sx={{color: 'secondary.main'}}>
                            <ListItemIcon><Logout color="secondary" /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;