import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, updateProfile } from '../slices/userSlice';
import ProfileForm from './ProfileForm';

const SignUp = ({ switchToLogIn }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get status from Redux store
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn)


    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = (formData) => {
        dispatch(updateProfile(formData));
        dispatch(login());
        console.log('SEND DATA TO DATABASE IN THIS BLOCK');
    };

    const initialData = {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        zipcode: '',
        username: '',
        password: '',
        passwordConfirmation: ''
    };

    return (
        <Container style={{height: '60vh', overflow: 'hidden'}}>
            <Row className='justify-content-center'>
                <Col className='py-3' lg={8} style={{
                        height: '60vh',
                        overflowY: 'auto',
                        background: '#c9f5ff',
                        borderRadius: '10px',
                        boxShadow: '0 15px 35px rgba(201, 245, 255)'
                    }}
                >
                    <Col className='text-center'>
                        <Image
                        src='/img/cardz-icon.png'
                        width='120px'
                        height='120px'
                        />
                    </Col>

                    <ProfileForm initialData={initialData} onSubmit={handleSubmit} />

                    <Stack gap={2}>
                        <Button variant='danger' type='submit' form="profileForm">Sign Up</Button>
                        <Button variant='dark' onClick={switchToLogIn}>Back</Button>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUp;