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

const LogIn = ({ switchToSignUp }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // get status from Redux store
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
    const errorMessage = useSelector((state) => state.user.errorMessage)

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const [validationState, setValidationState] = useState({
        username: null,
        password: null
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }));

        const { isValid } = validateField(name, value);
        setValidationState(prevState => ({
            ...prevState,
            [name]: isValid ? '' : 'invalid'
        }));
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
                        } else {
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

    const handleLogIn = (event) => {
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
            const user = users.find(
                (user) => user.username === loginData.username && user.address.street === loginData.password
            );

            if (user) {
                dispatch(login());

                const followingUserId = [];
                for (let i = 1; i <= 3; i++) {
                    let followId = (user.id + i) % 10;
                    if (followId === 0) {
                        followId = 10;
                    }
                    followingUserId.push(followId);
                }

                dispatch(updateProfile({
                    userId: user.id,
                    firstName: user.name.split(' ')[0],
                    lastName: user.name.split(' ')[1],
                    email: user.email,
                    phoneNumber: user.phone,
                    zipcode: user.address.zipcode,
                    username: user.username,
                    status: user.company.catchPhrase,
                    followingUserId: followingUserId
                }));
            }
            else {
                dispatch(setErrorMessage('Invalid username or password'));
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
                        <Button variant='danger' onClick={switchToSignUp}>Sign Up</Button>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default LogIn;