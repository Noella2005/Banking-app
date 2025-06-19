import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Snackbar, Grid, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosConfig';

const SettingsPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    // Form for profile details
    const profileFormik = useFormik({
        initialValues: { name: user.name || '', email: user.email || '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required.'),
            email: Yup.string().email('Invalid email.').required('Email is required.'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const { data } = await api.put('/users/profile', values);
                localStorage.setItem('user', JSON.stringify({...user, ...data.user})); // Update local storage
                setNotification({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            } catch (error) {
                setNotification({ open: true, message: error.response?.data?.message || 'Update failed.', severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Form for password change
    const passwordFormik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            password: Yup.string().min(6, 'Password must be at least 6 characters.').required('New password is required.'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.').required('Required.'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
             try {
                await api.put('/users/profile', { password: values.password });
                setNotification({ open: true, message: 'Password changed successfully!', severity: 'success' });
                resetForm();
            } catch (error) {
                setNotification({ open: true, message: error.response?.data?.message || 'Update failed.', severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Profile Information</Typography>
                    <form onSubmit={profileFormik.handleSubmit}>
                        <TextField fullWidth margin="normal" name="name" label="Full Name" {...profileFormik.getFieldProps('name')}
                            error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                            helperText={profileFormik.touched.name && profileFormik.errors.name} />
                        <TextField fullWidth margin="normal" name="email" label="Email Address" {...profileFormik.getFieldProps('email')}
                            error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                            helperText={profileFormik.touched.email && profileFormik.errors.email} />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={profileFormik.isSubmitting}>Save Profile</Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>Change Password</Typography>
                    <form onSubmit={passwordFormik.handleSubmit}>
                        <TextField fullWidth margin="normal" name="password" label="New Password" type="password" {...passwordFormik.getFieldProps('password')}
                            error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
                            helperText={passwordFormik.touched.password && passwordFormik.errors.password} />
                        <TextField fullWidth margin="normal" name="confirmPassword" label="Confirm New Password" type="password" {...passwordFormik.getFieldProps('confirmPassword')}
                             error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                             helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword} />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={passwordFormik.isSubmitting}>Change Password</Button>
                    </form>
                </Paper>
            </Grid>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default SettingsPage;