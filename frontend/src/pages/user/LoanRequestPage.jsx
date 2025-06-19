import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosConfig';

const LoanRequestPage = () => {
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const formik = useFormik({
        initialValues: {
            amount: '',
            reason: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number().positive('Loan amount must be positive.').required('Amount is required.'),
            reason: Yup.string().min(10, 'Please provide a more detailed reason.').required('Reason is required.'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const { data } = await api.post('/loans/request', values);
                setNotification({ open: true, message: data.message, severity: 'success' });
                resetForm();
            } catch (error) {
                setNotification({ open: true, message: error.response?.data?.message || 'Loan request failed.', severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });
    
    const handleCloseNotification = () => setNotification({ ...notification, open: false });

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Request a Loan</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>Submit a loan request for review by our managers.</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    label="Loan Amount ($)"
                    type="number"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    id="reason"
                    name="reason"
                    label="Reason for Loan"
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                    helperText={formik.touched.reason && formik.errors.reason}
                    margin="normal"
                />
                <Box sx={{ mt: 2, position: 'relative' }}>
                    <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting} size="large">
                        Submit Request
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

export default LoanRequestPage;