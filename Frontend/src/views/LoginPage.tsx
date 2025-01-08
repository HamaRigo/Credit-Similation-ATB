import React from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: (values) => {
            console.log('Form Values:', values);
            // Add login logic here



        }
    });

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Grid item xs={11} sm={8} md={4}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={6} style={{ padding: '2rem' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Login
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    variant="outlined"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Login
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </motion.div>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
