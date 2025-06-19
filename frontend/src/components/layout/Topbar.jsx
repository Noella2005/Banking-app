import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Badge, List, ListItemText, Divider, ListItemIcon } from '@mui/material';
import { Notifications as NotificationsIcon, CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Topbar = () => {
    const navigate = useNavigate();
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const user = JSON.parse(localStorage.getItem('user'));

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        // Function to fetch notifications
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                // The new backend endpoint now returns the unread count directly
                const { data } = await api.get('/notifications'); 
                setUnreadCount(data.unreadCount); // Use the direct count from the API
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
            }
        };
        fetchNotifications(); // Fetch immediately on component mount

        // Set up polling to check for new notifications every 15 seconds
        const intervalId = setInterval(fetchNotifications, 15000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [user]);

    const handleNotificationClick = async (event) => {
        setNotificationAnchorEl(event.currentTarget);
        // Fetch all recent notifications when the bell is clicked
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleNotificationClose = async () => {
        setNotificationAnchorEl(null);
        // If there are unread notifications, mark them as read
        if (unreadCount > 0) {
            try {
                await api.post('/notifications/read');
                setUnreadCount(0); // Immediately update the UI
            } catch (error) {
                console.error('Failed to mark notifications as read:', error);
            }
        }
    };
    
    const handleNotificationItemClick = (link) => {
        handleNotificationClose();
        if (link) {
            navigate(link);
        }
    };

    // --- PROFILE MENU LOGIC ---
    const handleProfileMenu = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                <span>Your</span>
                <span style={{ color: 'black' }}>Bank</span>
            </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Notification Bell */}
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                       <Badge badgeContent={unreadCount} color="secondary">
                           <NotificationsIcon />
                       </Badge>
                    </IconButton>
                    
                    {/* Profile Icon */}
                    <IconButton onClick={handleProfileMenu} color="inherit" sx={{ p: 0.5 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>

                    {/* Notification Dropdown Menu */}
                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                        PaperProps={{ style: { maxHeight: 400, width: '350px' } }}
                    >
                        <List sx={{ p: 0 }}>
                            <Typography variant="h6" sx={{ p: 2 }}>Notifications</Typography>
                            <Divider />
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <MenuItem key={notif._id} onClick={() => handleNotificationItemClick(notif.link)} sx={{ whiteSpace: 'normal' }}>
                                        <ListItemIcon>
                                            {notif.message.includes('approved') || notif.message.includes('sent you') ? <CheckCircleOutline color="success" /> : <HighlightOff color="error" />}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={notif.message} 
                                            secondary={new Date(notif.createdAt).toLocaleString()} 
                                        />
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No new notifications</MenuItem>
                            )}
                        </List>
                    </Menu>

                    {/* Profile Dropdown Menu */}
                    <Menu
                        id="menu-appbar"
                        anchorEl={profileAnchorEl}
                        open={Boolean(profileAnchorEl)}
                        onClose={handleProfileClose}
                    >
                        <MenuItem onClick={() => { handleProfileClose(); navigate(user.role === 'manager' ? '/admin/dashboard' : '/dashboard/profile'); }}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;