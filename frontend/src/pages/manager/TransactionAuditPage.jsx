import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api/axiosConfig';

const TransactionAuditPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/transactions');
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const columns = [
        { field: '_id', headerName: 'Transaction ID', width: 220 },
        // BULLETPROOF CHECK 1: Safely handle date
        { 
            field: 'createdAt', 
            headerName: 'Date & Time', 
            width: 180, 
            type: 'dateTime', 
            valueGetter: (params) => (params && params.value) ? new Date(params.value) : null 
        },
        // BULLETPROOF CHECK 2: Safely get user name
        { 
            field: 'userName', 
            headerName: 'User Name', 
            width: 150, 
            valueGetter: (params) => (params && params.row && params.row.userId && params.row.userId.name) ? params.row.userId.name : 'System' // 'System' for transactions without a user
        },
        // BULLETPROOF CHECK 3: Safely get account number
        { 
            field: 'userAccount', 
            headerName: 'Account No.', 
            width: 150, 
            valueGetter: (params) => (params && params.row && params.row.userId && params.row.userId.accountNumber) ? params.row.userId.accountNumber : 'N/A' 
        },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 120,
            renderCell: (params) => {
                const type = params.value;
                const color = type === 'transfer' ? 'primary' : type === 'loan' ? 'success' : 'default';
                return <Chip label={type || 'N/A'} color={color} size="small" sx={{textTransform: 'capitalize'}} />;
            }
        },
        // BULLETPROOF CHECK 4: Safely format amount
        { 
            field: 'amount', 
            headerName: 'Amount', 
            type: 'number', 
            width: 130, 
            valueFormatter: (params) => {
                if (params && typeof params.value === 'number') {
                    return `$${params.value.toFixed(2)}`;
                }
                return '$0.00';
            },
            cellClassName: (params) => {
                if (params && typeof params.value === 'number') {
                    return params.value > 0 ? 'amount--positive' : 'amount--negative';
                }
                return '';
            }
        },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200, sortable: false },
    ];

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>System-Wide Transaction Audit</Typography>
            <DataGrid
                rows={transactions}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                sx={{
                    border: 0,
                    '.amount--positive': { color: 'green', fontWeight: '500' },
                    '.amount--negative': { color: 'red', fontWeight: '500' }
                }}
            />
        </Box>
    );
};

export default TransactionAuditPage;