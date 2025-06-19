import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                <AccountBalanceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Welcome to Your<span style={{ color: 'blue' }}>Bank</span>
                </Typography>

                <Typography variant="h6" color="text.secondary" paragraph>
                    Your secure, reliable, and user-friendly online banking platform.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Manage your funds, request loans, and view your transaction history with ease.
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ mr: 2, px: 4, py: 1.5 }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{ px: 4, py: 1.5 }}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LandingPage;