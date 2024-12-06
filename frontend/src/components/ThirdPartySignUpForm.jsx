import React, { useState, useCallback, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useSelector } from "react-redux";

const ThirdPartySignUpForm = ({ initialData, onSubmit }) => {

    const [usernameExistsMessage, setUsernameExistsMessage] = useState('');

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
                if (value.trim() === '') {
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
                if (value.trim() === '') {
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

        if (isFormValid) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/register/checkEmail/${formData.email}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });


                // people who sign up with third party means they own the email for sure, so have the right to clear others email
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.username) {
                        console.log("responseData.username: "+responseData.username)
                        await fetch(`${process.env.REACT_APP_API_URL}/register/clearEmail/${responseData.username}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include'
                        });
                    }
                }
            }
            catch (error) {
                console.error('Email check error:', error);
                newValidationState.email = 'invalid';
                isFormValid = false;
                setUsernameExistsMessage('Error checking email. Please try again.');
            }

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

            <FloatingLabel controlId='floatingEmail' label='Email' className='mb-2'>
                <Form.Control
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    isValid={validationState.email === 'valid'}
                    isInvalid={validationState.email === 'invalid'}
                    disabled={true}
                />
                <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                    {validateField('email', formData.email).errorMessage}
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

export default ThirdPartySignUpForm;