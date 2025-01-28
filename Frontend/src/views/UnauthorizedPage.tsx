import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div>Unauthorized</div>
    );
};

export default UnauthorizedPage;
