import React, {useEffect, useState} from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, login, setErrorMessage } from "../slices/userSlice";
import ThirdPartySignUp from './ThirdPartySignUp';

const LogIn = ({ switchToSignUp }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [accountStatus, setAccountStatus] = useState('ThirdPartySignUp')
    const [linkAccountUsername, setLinkAccountUsername] = useState('')

    // get status from Redux store
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
    const errorMessage = useSelector((state) => state.user.errorMessage)
    const [isThirdPartyLogIn, setIsThirdPartyLogIn] = useState(false);

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const [validationState, setValidationState] = useState({
        username: null,
        password: null
    });

    const [clickThirdParty, setClickThirdParty] = useState(false);


    const [thirdPartyEmail, setThirdPartyEmail] = useState(null);

    const processLoginWithThirdParty = async (username) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/loginWithThirdParty`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username
                }),
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
                    password: user.password,
                    salt: user.salt,
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
            dispatch(setErrorMessage('Login failed. Please try again.'));
        }
    }

    const processCheckIfSameEmailExist = async (googleEmail) => {
        try {
            const responseData = await fetch(`${process.env.REACT_APP_API_URL}/auth/thirdParty/checkIfSameEmailExist/${googleEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const emailResponse = await responseData.json();

            if (emailResponse.exist === true) {
                setAccountStatus('LinkAccount');
                setLinkAccountUsername(emailResponse.username);
            }
            else if (emailResponse.exist === false) {
                setAccountStatus('ThirdPartySignUp');
            }
        }
        catch (error) {
            console.error('Error checking if third party account available:', error);
        }
    }

    const checkIfThirdPartyAccountExist = async (googleEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/thirdParty/checkIfThirdPartyAccountExist/${googleEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const thirdPartyResponse = await response.json();

            if (thirdPartyResponse.exist === true) {
                await processLoginWithThirdParty(thirdPartyResponse.username);
            }
            else if (thirdPartyResponse.exist === false) {
                await processCheckIfSameEmailExist(googleEmail);
            }
        }
        catch (error) {
            console.error('Error checking if third party account available:', error);
        }
    }

    useEffect(() => {
        if (clickThirdParty === true) {
            const checkGoogleSession = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/email`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    const data = await response.json();

                    if (response.ok && data.email) {
                        setThirdPartyEmail(data.email);
                        setIsThirdPartyLogIn(true);

                        await checkIfThirdPartyAccountExist(data.email);

                        setClickThirdParty(false);
                    }
                }
                catch (error) {
                    console.error('Error checking Google session:', error);
                }
            };

            const handleMessage = async (event) => {
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.data === 'loginSuccess') {
                    setClickThirdParty(false);
                    await checkGoogleSession();
                }
            };

            checkGoogleSession();

            window.addEventListener('message', handleMessage);

            return () => {
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [dispatch, navigate, clickThirdParty]);
    // }, []);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'username') {
            const lowercaseValue = value.toLowerCase();

            setLoginData(prevData => ({
                ...prevData,
                [name]: lowercaseValue
            }));

            // Trigger validation with lowercase value
            const { isValid } = validateField(name, lowercaseValue);
            setValidationState(prevState => ({
                ...prevState,
                [name]: isValid ? 'valid' : 'invalid'
            }));
        }
        else {
            setLoginData(prevData => ({
                ...prevData,
                [name]: value
            }));

            const { isValid } = validateField(name, value);
            setValidationState(prevState => ({
                ...prevState,
                [name]: isValid ? 'valid' : 'invalid'
            }));
        }
    };

    const validateField = (field, value) => {
        let isValid = false;
        let errorMessage = '';

        switch (field) {
            case 'username':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your username.';
                }
                else {
                    isValid = /^[a-zA-Z][a-zA-Z0-9._]{2,}$/.test(value);
                    if (!isValid) {
                        if (value.length < 3) {
                            errorMessage = 'Username must be at least 3 characters long.';
                        }
                        else {
                            errorMessage = 'Username must start with a letter and can only contain letters, underscores, and periods.';
                        }
                    }
                }
                break;

            case 'password':
                isValid = value.trim().length > 0;
                errorMessage = 'Please enter your password.';
                break;

            default:
                break;
        }

        return { isValid, errorMessage };
    };

    const handleLogIn = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let isFormValid = true;
        const newValidationState = {};

        Object.keys(loginData).forEach(key => {
            const { isValid } = validateField(key, loginData[key]);
            if (!isValid) {
                isFormValid = false;
            }
            newValidationState[key] = isValid ? '' : 'invalid';
        });

        setValidationState(newValidationState);

        if (isFormValid) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(loginData)
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
                        password: user.password,
                        salt: user.salt,
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
                dispatch(setErrorMessage('Login failed. Please try again.'));
            }
        }
    }

    const handleGoogleLogInOrSignUp = async () => {
        try {
            const width = 500;
            const height = 600;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);

            const googleAuthWindow = window.open(
                `${process.env.REACT_APP_API_URL}/auth/google`,
                'Google Authentication',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            // const checkWindowClosed = setInterval(() => {
            //     if (googleAuthWindow.closed) {
            //         setClickThirdParty(true);
            //         clearInterval(checkWindowClosed);
            //         window.location.reload();
            //     }
            // }, 500);

            return new Promise((resolve) => {
                const checkWindowClosed = setInterval(() => {
                    if (googleAuthWindow.closed) {
                        setClickThirdParty(true);
                        clearInterval(checkWindowClosed);
                        resolve();
                    }
                }, 500);
            });
        }
        catch (error) {
            console.error('Google login error:', error);
        }
    }

    const handleSwitchToLogIn = async () => {
        setIsThirdPartyLogIn(false);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/email/clear`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setThirdPartyEmail(null);
                const data = await response.json();
                if (data.message) {
                    console.log(data.message);
                }
            }
        }
        catch (error) {
            console.error('Error checking Google session:', error);
        }
    }

    const handelSetAccountStatusToThirdPartySignUpAtLogIn = () => {
        setAccountStatus('ThirdPartySignUp');
    }

    return (
        <>
            {isThirdPartyLogIn === false ? (
                <Container>
                    <Row className='justify-content-center'>
                        <Col className='py-3' lg={8} style={{
                                overflowY: 'auto',
                                background: '#c9f5ff',
                                borderRadius: '10px',
                                boxShadow: '0 15px 35px rgba(201, 245, 255)'
                            }}>
                            <Col className='text-center'>
                                <Image
                                src='/img/cardz-icon.png'
                                width='120px'
                                height='120px'
                                />
                            </Col>
                            <FloatingLabel controlId="floatingUsername" label="Username" className='mb-2'>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={loginData.username}
                                    onChange={handleInputChange}
                                    isInvalid={validationState.username === 'invalid'}
                                />
                                <Form.Control.Feedback type="invalid" className='my-2 ms-2'>
                                    {validateField('username', loginData.username).errorMessage}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password" className='mb-2'>
                                <Form.Control
                                    type="password"
                                    name='password'
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                    isInvalid={validationState.password === 'invalid'}
                                />
                                <Form.Control.Feedback type="invalid" className='my-2 ms-2'>
                                    {validateField('password', loginData.password).errorMessage}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            {errorMessage && <p style={{ color: 'red'}} className='ms-2 my-2'>{errorMessage}</p>}
                            <Stack gap={2}>
                                <Button variant='primary' className='m-0' onClick={handleLogIn}>Log In</Button>
                                <Button variant='light' className='m-0' onClick={handleGoogleLogInOrSignUp}>
                                    Log In With Google
                                </Button>
                                <Button variant='danger' onClick={switchToSignUp}>Sign Up</Button>
                            </Stack>
                        </Col>
                    </Row>
                </Container>
                ) : (
                    <ThirdPartySignUp thirdPartyEmail={thirdPartyEmail} switchToLogIn={handleSwitchToLogIn} accountStatus={accountStatus} username={linkAccountUsername} setAccountStatusToThirdPartySignUpAtLogIn={handelSetAccountStatusToThirdPartySignUpAtLogIn}/>
                )
            }
        </>
    );
}

export default LogIn;