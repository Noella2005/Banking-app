import React, { useState } from 'react';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [serverMessage, setServerMessage] = useState('');
    const [serverError, setServerError] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setServerMessage('');
            setServerError('');
            try {
                const { name, email, password } = values;
                const response = await api.post('/auth/register', { name, email, password });
                setServerMessage(response.data.message);
                // Redirect to login after a short delay so the user can see the success message
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
                setSubmitting(false);
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
                <Typography component="h1" variant="h5">Sign up</Typography>
                
                {serverMessage && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{serverMessage}</Alert>}
                {serverError && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{serverError}</Alert>}

                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                autoFocus
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                             <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">Already have an account? Sign in</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;