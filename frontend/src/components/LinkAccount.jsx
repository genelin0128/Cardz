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

const LinkAccount = ({ username, thirdPartyAccount, switchToThirdPartySignUp }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get status from Redux store
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
    const errorMessage = useSelector((state) => state.user.errorMessage)

    const [loginData, setLoginData] = useState({
        username: username,
        password: ''
    })

    const [validationState, setValidationState] = useState({
        username: null,
        password: null
    });

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

    const handleLinkAccount = async (event) => {
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/loginAndLinkWithThirdParty`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username: loginData.username,
                        password: loginData.password,
                        thirdPartyAccount: thirdPartyAccount
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
                    return;
                }
            }
            catch (error) {
                dispatch(setErrorMessage('Login failed. Please try again.'));
            }
        }
    }




    return (
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
                            disabled={true}
                        />
                        <Form.Control.Feedback type="invalid" className='my-2 ms-2'>
                            {validateField('username', loginData.username).errorMessage}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="Password" className='mb-2'>
                        <Form.Control
                            type="password"
                            name='password'
                            placeholder="Enter the password to link your account"
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
                        <Button variant='primary' className='m-0' onClick={handleLinkAccount}>Link my account</Button>
                        <Button variant='warning' className='m-0' onClick={switchToThirdPartySignUp}>Not my account</Button>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default LinkAccount;