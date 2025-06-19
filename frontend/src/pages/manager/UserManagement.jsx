import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Snackbar, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api/axiosConfig';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            setNotification({ open: true, message: 'Failed to fetch users.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId, action) => {
        // userId here is guaranteed to be the user's _id
        try {
            const endpoint = action === 'approve' ? `/admin/users/${userId}/approve` : `/admin/users/${userId}/freeze`;
            const { data } = await api.put(endpoint);
            
            setNotification({ open: true, message: data.message, severity: 'success' });
            fetchUsers(); // Refresh data from the server to ensure consistency
        } catch (error) {
            setNotification({ open: true, message: error.response?.data?.message || 'Action failed.', severity: 'error' });
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 220 },
        { field: 'accountNumber', headerName: 'Account No.', width: 150 },
        { 
            field: 'balance', 
            headerName: 'Balance', 
            type: 'number', 
            width: 130, 
            valueFormatter: (params) => (typeof params.value === 'number') ? `$${params.value.toFixed(2)}` : '$0.00'
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 120,
            renderCell: (params) => {
                const status = params.value;
                let color;
                if (status === 'pending') color = 'warning';
                else if (status === 'active') color = 'success';
                else if (status === 'frozen') color = 'error';
                else color = 'default';
                return <Chip label={status} color={color} size="small" sx={{textTransform: 'capitalize'}}/>;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250, // Adjusted width
            sortable: false,
            renderCell: (params) => {
                const user = params.row; // Get the full user object for the current row
                
                console.log("Checking user data for row:", user);
                
                return (
                    <Box>
                        {/* The condition to show the 'Approve' button */}
                        {user.status === 'pending' && (
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="small" 
                                sx={{ mr: 1 }} 
                                onClick={() => handleAction(user._id, 'approve')}
                            >
                                Approve
                            </Button>
                        )}
                        
                        {/* The Freeze/Unfreeze button */}
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small" 
                            onClick={() => handleAction(user._id, 'freeze')}
                        >
                            {user.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                        </Button>
                    </Box>
                );
            }
        },
    ];
    
    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>User Management</Typography>
            <DataGrid
                rows={users}
                columns={columns}
                loading={loading}
                getRowId={(row) => row._id}
                sx={{ border: 0 }}
            />
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagementPage;