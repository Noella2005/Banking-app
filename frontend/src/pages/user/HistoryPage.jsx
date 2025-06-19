import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api/axiosConfig';

const HistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/transactions/history');
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transaction history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const columns = [
        { field: 'createdAt', headerName: 'Date', width: 180, type: 'dateTime', valueGetter: (params) => new Date(params.value) },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 120,
            renderCell: (params) => <Chip label={params.value} size="small" sx={{textTransform: 'capitalize'}}/>
        },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            width: 130, 
            type: 'number',
            renderCell: (params) => (
                <Typography color={params.value > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: '500' }}>
                    {params.value > 0 ? `+` : `-`}${(Math.abs(params.value)).toFixed(2)}
                </Typography>
            )
        }
    ];

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Transaction History</Typography>
            <DataGrid
                rows={transactions}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                autoHeight
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'createdAt', sort: 'desc' }],
                    },
                }}
            />
        </Box>
    );
};

export default HistoryPage;