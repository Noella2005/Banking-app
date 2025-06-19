import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import theme from './theme';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route Components
import PrivateRoute from './components/protected/PrivateRoute';
import ManagerRoute from './components/protected/ManagerRoute'; // This now works because you renamed the file

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
// Assuming RegisterPage exists or you will create it
import RegisterPage from './pages/RegisterPage'; // Make sure this page exists in /pages

// User Pages
import Dashboard from './pages/user/Dashboard';
import TransferPage from './pages/user/TransferPage';
import LoanRequestPage from './pages/user/LoanRequestPage';
import HistoryPage from './pages/user/HistoryPage';
import SettingsPage from './pages/user/SettingsPage';

// Manager Pages - WITH CORRECTED PATHS AND NAMES
import ManagerDashboard from './pages/manager/ManagerDashboardPage';
import UserManagementPage from './pages/manager/UserManagement'; // Matching your file name
import LoanApprovalPage from './pages/manager/LoanApprovalPage';
import TransactionAuditPage from './pages/manager/TransactionAuditPage';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* User Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="transfer" element={<TransferPage />} />
                            <Route path="request-loan" element={<LoanRequestPage />} />
                            <Route path="history" element={<HistoryPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="profile" element={<SettingsPage />} />
                        </Route>
                    </Route>

                    {/* Manager Protected Routes */}
                    <Route element={<ManagerRoute />}>
                        <Route path="/admin" element={<DashboardLayout isAdmin />}>
                            <Route path="dashboard" element={<ManagerDashboard />} />
                            <Route path="users" element={<UserManagementPage />} />
                            <Route path="loans" element={<LoanApprovalPage />} />
                            <Route path="transactions" element={<TransactionAuditPage />} />
                        </Route>
                    </Route>
                    
                    <Route path="*" element={<Box sx={{p:4}}> <Typography variant="h4">404 - Page Not Found</Typography> </Box>} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;