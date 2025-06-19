import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // A professional blue
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;