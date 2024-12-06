import React, { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, login, setErrorMessage } from "../slices/userSlice";
import ThirdPartySignUpForm from "./ThirdPartySignUpForm";
import LinkAccount from "./LinkAccount";

const ThirdPartySignUp = ({ thirdPartyEmail, switchToLogIn, accountStatus, username, setAccountStatusToThirdPartySignUpAtLogIn }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get status from Redux store
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/registerWithThirdParty`, {
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
                    password: formData.password,
                    thirdParty: {
                        google: formData.email
                    },
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
            dispatch(setErrorMessage('Register by third party failed. Please try again.'));
        }
    };

    const initialData = {
        firstName: '',
        lastName: '',
        email: thirdPartyEmail,
        dateOfBirth: '',
        phoneNumber: '',
        zipcode: '',
        username: '',
        password: '',
        passwordConfirmation: ''
    };

    const handleSwitchToThirdPartySignUp = async () => {
        setAccountStatusToThirdPartySignUpAtLogIn();
    }

    return (
        <>
            {accountStatus === 'ThirdPartySignUp' ? (
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

                            <ThirdPartySignUpForm initialData={initialData} onSubmit={handleSubmit} isSignUp={true} />

                            <Stack gap={2}>
                                <Button variant='danger' type='submit' form="profileForm">Sign Up With Third Party</Button>
                                <Button variant='dark' onClick={switchToLogIn}>Back</Button>
                            </Stack>
                        </Col>
                    </Row>
                </Container>
            ) :  (
                <LinkAccount username={username} thirdPartyAccount={thirdPartyEmail} switchToThirdPartySignUp={handleSwitchToThirdPartySignUp} />
            )}
        </>

    );
}

export default ThirdPartySignUp;