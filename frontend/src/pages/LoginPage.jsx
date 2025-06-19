import React, { useState } from 'react';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setError('');
            try {
                const response = await api.post('/auth/login', values);

                // This is the most critical part
                const { token, user } = response.data;

                if (token && user) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    // Check the role and navigate
                    if (user.role === 'manager') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                     setError('Invalid response from server.');
                }

            } catch (err) {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus {...formik.getFieldProps('email')} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;