import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api/axiosConfig';

const LoanApprovalPage = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const fetchPendingLoans = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/loans/pending');
            setLoans(data);
        } catch (error) {
            setNotification({ open: true, message: 'Failed to fetch loan requests.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingLoans();
    }, []);

    const handleLoanAction = async (id, action) => {
        try {
            const { data } = await api.put(`/admin/loans/${id}/action`, { action });
            setNotification({ open: true, message: data.message, severity: 'success' });
            fetchPendingLoans();
        } catch (error) {
            setNotification({ open: true, message: error.response?.data?.message || 'Action failed.', severity: 'error' });
        }
    };

    const columns = [
        // --- THIS IS THE FINAL FIX ---
        { 
            field: 'userName', 
            headerName: 'Customer Name', 
            width: 180, 
            // Add a check for params and params.row
            valueGetter: (params) => (params && params.row && params.row.userId && params.row.userId.name) ? params.row.userId.name : 'N/A' 
        },
        { 
            field: 'userAccount', 
            headerName: 'Account No.', 
            width: 150, 
            // Add a check for params and params.row
            valueGetter: (params) => (params && params.row && params.row.userId && params.row.userId.accountNumber) ? params.row.userId.accountNumber : 'N/A' 
        },
        // -----------------------------
        { 
            field: 'amount', 
            headerName: 'Loan Amount', 
            width: 130, 
            type: 'number', 
            valueFormatter: (params) => {
                if (params && typeof params.value === 'number') {
                    return `$${params.value.toFixed(2)}`;
                }
                return '$0.00';
            } 
        },
        { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 200, sortable: false },
        { 
            field: 'createdAt', 
            headerName: 'Date Requested', 
            width: 180, 
            type: 'dateTime', 
            valueGetter: (params) => (params && params.value) ? new Date(params.value) : null 
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleLoanAction(params.id, 'approve')}>Approve</Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => handleLoanAction(params.id, 'deny')}>Deny</Button>
                </Box>
            ),
        },
    ];

    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Loan Approval Requests</Typography>
            <DataGrid
                rows={loans}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                autoHeight
            />
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoanApprovalPage;