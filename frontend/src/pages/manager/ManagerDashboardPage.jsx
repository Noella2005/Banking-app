import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { PeopleAlt, HourglassTop, MonetizationOn } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const StatCard = ({ title, value, icon }) => (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
            <Typography color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="p">{value}</Typography>
        </Box>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    </Paper>
);

const ManagerDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingLoans: 0, totalValue: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, loansRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/loans/pending')
                ]);
                const totalValue = usersRes.data.reduce((acc, user) => acc + user.balance, 0);
                setStats({
                    totalUsers: usersRes.data.length,
                    pendingLoans: loansRes.data.length,
                    totalValue: totalValue.toFixed(2),
                });
            } catch (err) {
                setError('Failed to fetch dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manager Dashboard</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Welcome, {user.name}!
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Total Customers" value={stats.totalUsers} icon={<PeopleAlt sx={{ fontSize: 40 }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Pending Loan Requests" value={stats.pendingLoans} icon={<HourglassTop sx={{ fontSize: 40 }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Total Value in Accounts" value={`$${stats.totalValue}`} icon={<MonetizationOn sx={{ fontSize: 40 }} />} />
                </Grid>
            </Grid>
            {/* You could add more components here, like charts or recent activity logs */}
        </Box>
    );
};

export default ManagerDashboard;