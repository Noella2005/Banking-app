import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axiosConfig';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/users/dashboard');
                setUserData(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome back, {user.name}!
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', background: 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)', color: 'white', borderRadius: 4 }}>
                         <Typography component="h2" variant="h6" gutterBottom>
                            Account Summary
                        </Typography>
                        <Typography component="p" variant="h3" sx={{ fontWeight: 'bold' }}>
                            ${userData.balance.toFixed(2)}
                        </Typography>
                        <Typography sx={{ flex: 1, opacity: 0.8 }}>
                            Available Balance
                        </Typography>
                        <Typography sx={{ alignSelf: 'flex-end', opacity: 0.9 }}>
                            Account Number: {userData.accountNumber}
                        </Typography>
                    </Paper>
                </Grid>
                {/* You can add more dashboard widgets here, e.g., a mini transaction history */}
            </Grid>
        </Box>
    );
};

export default Dashboard;