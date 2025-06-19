import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosConfig';

const TransferPage = () => {
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const formik = useFormik({
        initialValues: {
            toAccountNumber: '',
            amount: '',
            description: '',
        },
        validationSchema: Yup.object({
            toAccountNumber: Yup.string().required('Recipient account number is required.'),
            amount: Yup.number().positive('Amount must be positive.').required('Amount is required.'),
            description: Yup.string().max(100, 'Description must be 100 characters or less.').required('Description is required.'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const { data } = await api.post('/transactions/transfer', values);
                setNotification({ open: true, message: data.message, severity: 'success' });
                resetForm();
            } catch (error) {
                setNotification({ open: true, message: error.response?.data?.message || 'Transfer failed.', severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Fund Transfer</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>Securely send money to another YourBank account.</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="toAccountNumber"
                    name="toAccountNumber"
                    label="Recipient's Account Number"
                    value={formik.values.toAccountNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.toAccountNumber && Boolean(formik.errors.toAccountNumber)}
                    helperText={formik.touched.toAccountNumber && formik.errors.toAccountNumber}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    label="Amount ($)"
                    type="number"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description (e.g., Rent, Dinner)"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    margin="normal"
                />
                <Box sx={{ mt: 2, position: 'relative' }}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        disabled={formik.isSubmitting}
                        size="large"
                    >
                        Send Money
                    </Button>
                    {formik.isSubmitting && (
                        <CircularProgress size={24} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px'}}/>
                    )}
                </Box>
            </form>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default TransferPage;