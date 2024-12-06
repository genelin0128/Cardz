import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {login, setErrorMessage, updateProfile} from '../slices/userSlice';
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

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    dateOfBirth: formData.dateOfBirth,
                    phoneNumber: formData.phoneNumber,
                    zipcode: formData.zipcode,
                    username: formData.username,
                    password: formData.password
                })
            });

            if (response.ok) {
                const user = await response.json();

                dispatch(login());
                dispatch(updateProfile({
                    userAvatar: user.avatar,
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    phoneNumber: user.phoneNumber,
                    zipcode: user.zipcode,
                    username: user.username,
                    status: user.status,
                    followingUsers: user.followingUsers,
                    thirdParty: user.thirdParty
                }));

                navigate('/home');
            }
            else {
                dispatch(setErrorMessage(await response.text()));
            }
        }
        catch (error) {
            dispatch(setErrorMessage('Register failed. Please try again.'));
        }
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

                    <ProfileForm initialData={initialData} onSubmit={handleSubmit} isSignUp={true} />

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