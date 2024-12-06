import React, { useState, useCallback, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { updateProfile } from "../slices/userSlice";

const ProfileForm = ({ initialData, onSubmit, isSignUp = false }) => {
    const dispatch = useDispatch();
    const [usernameExistsMessage, setUsernameExistsMessage] = useState('');
    const [emailExistsMessage, setEmailExistsMessage] = useState('');
    const currentLoggedInUserEmail = useSelector((state) => state.user.profile.email);

    const thirdPartyEmail = useSelector(state => state.user.profile.thirdParty?.google);

    const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        phoneNumber,
        zipcode,
        username,
        password,
        passwordConfirmation
    } = initialData;

    const [formData, setFormData] = useState({
        firstName,
        lastName,
        email,
        dateOfBirth,
        phoneNumber,
        zipcode,
        username,
        password,
        passwordConfirmation
    });

    const [validationState, setValidationState] = useState({
        firstName: null,
        lastName: null,
        email: null,
        dateOfBirth: null,
        phoneNumber: null,
        zipcode: null,
        username: null,
        password: null,
        passwordConfirmation: null
    });

    const isLoggedIn = useSelector(state => state.user.isLoggedIn)

    const validateField = useCallback((field, value) => {
        let isValid = false;
        let errorMessage = '';

        switch (field) {
            case 'firstName':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your first name.';
                }
                else {
                    isValid = /^[a-zA-Z- ]+$/.test(value)
                    errorMessage = 'Please enter a valid first name.';
                }
                break;

            case 'lastName':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your last name.';
                }
                else {
                    isValid = /^[a-zA-Z]+$/.test(value)
                    errorMessage = 'Please enter a valid last name.';
                }
                break;

            case 'email':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your email.';
                }
                else {
                    isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]+[a-z0-9]$/.test(value);
                    if (!isValid) {
                        errorMessage = 'Please enter a valid email.';
                    }
                }
                break;

            case 'dateOfBirth':
                if (value.trim() === '') {
                    errorMessage = 'Please select your date of birth.';
                }
                else {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                    isValid = dateRegex.test(value);
                    // check format
                    if (!isValid) {
                        errorMessage = 'Please enter a valid date of birth.';
                    }
                    // check valid birthDate
                    else {
                        const today = new Date();
                        const birthDate = new Date(value + 'T00:00:00');
                        const minValidYear = today.getFullYear() - 150;

                        const todayYear = today.getFullYear();
                        const todayMonth = today.getMonth();
                        const todayDay = today.getDate();
                        const birthDateYear = birthDate.getFullYear();
                        const birthDateMonth = birthDate.getMonth();
                        const birthDateDay = birthDate.getDate();

                        if (
                            (birthDateYear > todayYear) ||
                            (birthDateYear === todayYear && birthDateMonth > todayMonth) ||
                            (birthDateYear === todayYear && birthDateMonth === todayMonth && birthDateDay > todayDay)
                        ) {
                            isValid = false;
                            errorMessage = 'Date of birth cannot be in the future.';
                        }
                        else if (birthDate.getFullYear() < minValidYear) {
                            isValid = false;
                            errorMessage = 'Please enter a valid date of birth.';
                        }
                    }
                }
                break;

            case 'phoneNumber':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your phone number.';
                }
                else {
                    isValid = /^[0-9]{10}$/.test(value);
                    errorMessage = 'Please enter a valid phone number (10 digits).';
                }
                break;

            case 'zipcode':
                if (value.trim() === '') {
                    errorMessage = 'Please enter your zipcode.';
                }
                else {
                    isValid = /^[0-9]{5}$/.test(value);
                    errorMessage = 'Please enter a valid ZIP code (5 digits).';
                }
                break;

            case 'username':
                if (!isSignUp) {
                    isValid = true;
                    break;
                }

                if (value.trim() === '') {
                    errorMessage = 'Please enter your username.';
                }
                else {
                    isValid = /^[a-zA-Z][a-z0-9._]{2,14}$/.test(value);
                    if (!isValid) {
                        if (value.length < 3) {
                            errorMessage = 'Username must be at least 3 characters long.';
                        }
                        else if (value.length > 15) {
                            errorMessage = 'Username must not exceed 15 characters.';
                        }
                        else {
                            errorMessage = 'Username must start with a letter and can only contain letters, numbers, underscores, and periods.';
                        }
                    }
                }
                break;

            case 'password':
                if (!isLoggedIn && value.trim() === '') {
                    errorMessage = 'Please enter your password.';
                }
                else if (value && value.trim() !== '') {
                    isValid = value.length >= 8;
                    errorMessage = 'Password must be at least 8 characters long.';
                }
                else if (formData.passwordConfirmation !== '') {
                    if (value.trim() === '') {
                        errorMessage = 'Please enter your password.';
                    }
                }
                else {
                    isValid = true;
                }
                break;

            case 'passwordConfirmation':
                if (!isLoggedIn && value.trim() === '') {
                    errorMessage = 'Please enter your password confirmation.';
                }
                else if (value && value.trim() !== '') {
                    isValid = value === formData.password && value !== '';
                    errorMessage = 'Passwords do not match.';
                }
                else if (formData.password !== '') {
                    if (value.trim() === '') {
                        errorMessage = 'Please enter your password confirmation.';
                    }
                }
                else {
                    isValid = true;
                }
                break;

            default:
                break;
        }

        return { isValid, errorMessage };
    }, [formData.password, formData.passwordConfirmation]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'email' || name === 'username') {
            const lowercaseValue = value.toLowerCase();

            setFormData(prevData => ({
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
            setFormData(prevData => ({
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

    useEffect(() => {
        if (formData.passwordConfirmation !== '') {
            const { isValid } = validateField('passwordConfirmation', formData.passwordConfirmation);
            setValidationState(prevState => ({
                ...prevState,
                passwordConfirmation: isValid ? 'valid' : 'invalid'
            }));
        }
    }, [formData.password, formData.passwordConfirmation, validateField]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let isFormValid = true;
        const newValidationState = {};
        Object.keys(formData).forEach(key => {
            const { isValid } = validateField(key, formData[key]);
            if (!isValid) {
                isFormValid = false;
            }
            newValidationState[key] = isValid ? 'valid' : 'invalid';
        });

        if (isFormValid && formData.email === currentLoggedInUserEmail) {
            // do nothing
        }
        else {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/register/checkEmail/${formData.email}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    newValidationState.email = 'invalid';
                    isFormValid = false;
                    setEmailExistsMessage('Email already exists. Please choose a different one.');
                    setValidationState(prevState => ({
                        ...prevState,
                        email: 'invalid'
                    }));
                }
            }
            catch (error) {
                console.error('Email check error:', error);
                newValidationState.email = 'invalid';
                isFormValid = false;
                setUsernameExistsMessage('Error checking email. Please try again.');
            }
        }

        if (isFormValid && isSignUp) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/register/checkUsername/${formData.username}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    newValidationState.username = 'invalid';
                    isFormValid = false;
                    setUsernameExistsMessage('Username already exists. Please choose a different one.');
                    setValidationState(prevState => ({
                        ...prevState,
                        username: 'invalid'
                    }));
                }
            }
            catch (error) {
                console.error('Username check error:', error);
                newValidationState.username = 'invalid';
                isFormValid = false;
                setUsernameExistsMessage('Error checking username. Please try again.');
            }
        }

        setValidationState(newValidationState);

        if (isFormValid) {
            onSubmit(formData);
        }
    };

    // ---------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------


    const [thirdPartyLinked, setThirdPartyLinked] = useState(false);

    const thirdParty = useSelector((state) => state.user.profile.thirdParty);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profile/thirdParty/checkThirdPartyLinkStatus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch third party link status');
            }
                return response.json();
        })
        .then(data => {
            if (data.thirdPartyLinked === true) {
                setThirdPartyLinked(true);
            }
            else if (data.thirdPartyLinked === false) {
                setThirdPartyLinked(false);
            }
        })
        .catch(error => {
            console.error('Error checking third party link status:', error);
        });
    }, [thirdParty]);



    const [clickLinkThirdParty, setClickLinkThirdParty] = useState(false);

    const processLinkAccount = async (googleEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/thirdParty/linkAccount/${googleEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                setThirdPartyLinked(true);
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

                alert("You have successfully linked your third party account.");
            }
            else {
                const data = await response.json();
                alert(data.message);
            }
        }
        catch (error) {
            console.error('Error linking third party account:', error);
        }
    }

    const checkIfThirdPartyAccountExist = async (googleEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/thirdParty/checkIfThirdPartyAccountExist/${googleEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const checkIfThirdPartyAccountExistResponse = await response.json();

            if (checkIfThirdPartyAccountExistResponse.available === false) {
                alert(checkIfThirdPartyAccountExistResponse.message);        // will show message "This third-party account is already in use. Please try another one."
                return;
            }
            else if (checkIfThirdPartyAccountExistResponse.available === true) {
                await processLinkAccount(googleEmail);
            }
        }
        catch (error) {
            console.error('Error checking if third party account available:', error);
        }

    }

    useEffect(() => {
        if (clickLinkThirdParty === true) {
            const checkGoogleSession = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/email`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    const data = await response.json();

                    if (response.ok && data.email) {
                        await checkIfThirdPartyAccountExist(data.email);
                        setClickLinkThirdParty(false);
                    }
                }
                catch (error) {
                    console.error('Error checking Google session:', error);
                }

            }

            const handleMessage = (event) => {
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.data === 'loginSuccess') {
                    // checkGoogleSession();
                }
            };

            checkGoogleSession();

            window.addEventListener('message', handleMessage);

            return () => {
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [clickLinkThirdParty]);

    const handleLinkToThirdParty = async () => {
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

            return new Promise((resolve) => {
            const checkWindowClosed = setInterval(() => {
                if (googleAuthWindow.closed) {
                    setClickLinkThirdParty(true);
                    clearInterval(checkWindowClosed);
                    resolve();
                }
            }, 500);
        });

        }
        catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleUnlinkFromThirdParty = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/email/clear`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message) {
                    console.log(data.message);
                }
            }
        }
        catch (error) {
            console.error('Error checking Google session:', error);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/thirdParty/unlinkAccount`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                setThirdPartyLinked(false);
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

                alert("You have successfully unlinked your third party account.");
            }
            else {
                const data = await response.json();
                alert(data.message);
            }
        }
        catch (error) {
            console.error('Error unlinking third party account:', error);
        }
    };


    return (
        <Form noValidate onSubmit={handleSubmit} id="profileForm">
            <Row>
                <Col className='pe-1'>
                    <FloatingLabel controlId='floatingFirstName' label='First Name' className='mb-2'>
                        <Form.Control
                            type='text'
                            name='firstName'
                            placeholder='First Name'
                            value={formData.firstName}
                            onChange={handleInputChange}
                            isValid={validationState.firstName === 'valid'}
                            isInvalid={validationState.firstName === 'invalid'}
                        />
                        <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                            {validateField('firstName', formData.firstName).errorMessage}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
                <Col className='ps-1'>
                    <FloatingLabel controlId='floatingLastName' label='Last Name' className='mb-2'>
                        <Form.Control
                            type='text'
                            name='lastName'
                            placeholder='Last Name'
                            value={formData.lastName}
                            onChange={handleInputChange}
                            isValid={validationState.lastName === 'valid'}
                            isInvalid={validationState.lastName === 'invalid'}
                        />
                        <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                            {validateField('lastName', formData.lastName).errorMessage}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
            </Row>

            {isSignUp === false &&
                <Row>
                    <Col xs={10} className='pe-1'>
                        <FloatingLabel controlId='floatingEmail' label='Third Party Email' className='mb-2'>
                            <Form.Control
                                type='email'
                                name='thirdPartyEmail'
                                placeholder='Third Party Email'
                                value={thirdPartyEmail || ''}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col xs={2} className='ps-1 d-flex justify-content-end'>
                        {thirdPartyLinked ? (
                            <Button variant='danger' className='mb-2 w-100' onClick={handleUnlinkFromThirdParty}>
                                Unlink
                            </Button>
                        ) : (
                            <Button variant='primary' className='mb-2 w-100' onClick={handleLinkToThirdParty}>
                                Link
                            </Button>
                        )}
                    </Col>
                </Row>
            }

            <FloatingLabel controlId='floatingEmail' label='Email' className='mb-2'>
                <Form.Control
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    isValid={validationState.email === 'valid'}
                    isInvalid={validationState.email === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('email', formData.email).errorMessage || emailExistsMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingDateOfBirth' label='Date Of Birth' className='mb-2'>
                <Form.Control
                    type='date'
                    name='dateOfBirth'
                    placeholder='Date Of Birth'
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    isValid={validationState.dateOfBirth === 'valid'}
                    isInvalid={validationState.dateOfBirth === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('dateOfBirth', formData.dateOfBirth).errorMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingPhoneNumber' label='Phone Number' className='mb-2'>
                <Form.Control
                    type='text'
                    name='phoneNumber'
                    placeholder='Phone Number'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    isValid={validationState.phoneNumber === 'valid'}
                    isInvalid={validationState.phoneNumber === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('phoneNumber', formData.phoneNumber).errorMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingZipcode' label='Zipcode' className='mb-2'>
                <Form.Control
                    type='text'
                    name='zipcode'
                    placeholder='Zipcode'
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    isValid={validationState.zipcode === 'valid'}
                    isInvalid={validationState.zipcode === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('zipcode', formData.zipcode).errorMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingUsername' label='Username' className='mb-2'>
                <Form.Control
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={formData.username}
                    onChange={handleInputChange}
                    isValid={validationState.username === 'valid'}
                    isInvalid={validationState.username === 'invalid'}
                    disabled={!isSignUp}
                    readOnly={!isSignUp}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('username', formData.username).errorMessage || usernameExistsMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingPassword' label='Password' className='mb-2'>
                <Form.Control
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleInputChange}
                    isValid={validationState.password === 'valid'}
                    isInvalid={validationState.password === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('password', formData.password).errorMessage}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId='floatingPasswordConfirmation' label='Password Confirmation' className='mb-2'>
                <Form.Control
                    type='password'
                    name='passwordConfirmation'
                    placeholder='Password Confirmation'
                    value={formData.passwordConfirmation}
                    onChange={handleInputChange}
                    isValid={validationState.passwordConfirmation === 'valid'}
                    isInvalid={validationState.passwordConfirmation === 'invalid'}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('passwordConfirmation', formData.passwordConfirmation).errorMessage}
                </Form.Control.Feedback>
            </FloatingLabel>
        </Form>
    );
};

export default ProfileForm;