import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllOcrEntities } from '../../services/ocrService';
import { toast } from 'react-toastify';

const OcrList = () => {
    const [ocrList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0); // Track the current step
    const navigate = useNavigate();

    // Steps for the navbar workflow
    const steps = ['Upload', 'Analyse', 'Preview', 'Save', 'Check Signature', 'Return to List'];

    // Fetching OCR entries
    const fetchAllOcrEntries = async () => {
        setLoading(true);
        try {
            // No need to assign the response to data if you're not using it
            await getAllOcrEntities();  // Just call the function
            toast.success('OCR entries loaded successfully!');
        } catch (error) {
            toast.error('Failed to load OCR entries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOcrEntries();
    }, []);

    const handleStepClick = (stepIndex) => {
        setActiveStep(stepIndex); // Update the active step

        // Navigate based on step
        switch (stepIndex) {
            case 0:
                navigate('/ocrs/upload');
                break;
            case 1:
                navigate('/ocrs/analyze'); // Assuming you want to navigate to "analyse" step
                break;
            case 2:
                navigate('/ocrs/preview');
                break;
            case 3:
                toast.success('Saving OCR data...');
                // Add save logic here, or navigate to a save route if required
                break;
            case 4:
                navigate('/ocrs/check-signature');
                break;
            case 5:
                navigate('/ocrs');
                break;
            default:
                break;
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            {/* Navigation Bar */}
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        OCR Workflow
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Stepper for Navigation */}
            <Box sx={{ mt: 4 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label} onClick={() => handleStepClick(index)}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* OCR List Content */}
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                    OCR Entries
                </Typography>

                {/* Loading State */}
                {loading ? (
                    <Typography variant="h6" color="textSecondary">
                        Loading OCR entries...
                    </Typography>
                ) : (
                    <Box sx={{ width: '100%' }}>
                        {ocrList.map((ocr, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    mb: 2,
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <Typography variant="h6">
                                    Document Type: {ocr.typeDocument}
                                </Typography>
                                <Typography>
                                    Fraud: {ocr.fraud ? 'Yes' : 'No'}
                                </Typography>
                                <Typography>
                                    Model Used: {ocr.modelUsed || 'N/A'}
                                </Typography>
                                <Typography>
                                    Confidence Score: {ocr.confidenceScore || 'N/A'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default OcrList;
