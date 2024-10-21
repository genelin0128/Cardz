import React from 'react';
import Container from "react-bootstrap/Container";

const UnauthorizedAccessPage = () => {
    return (
        <Container>
            <h2>Unauthorized Access</h2>
            <p>You must be logged in to access this page.</p>
        </Container>
    );
}

export default UnauthorizedAccessPage;