import React from 'react';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Grid item xs={11} sm={8} md={6}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={6} style={{ padding: '2rem', textAlign: 'center' }}>
                        <Typography variant="h3" gutterBottom color="error">
                            403 - Unauthorized
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            You do not have permission to access this page.
                        </Typography>
                        <Box marginTop={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGoBack}
                                style={{ marginRight: '1rem' }}
                            >
                                Go Back
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/')}
                            >
                                Go to Home
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </Grid>
        </Grid>
    );
};

export default UnauthorizedPage;
