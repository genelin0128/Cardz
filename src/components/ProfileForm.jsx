import React, { useState, useCallback, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {useSelector} from "react-redux";

const ProfileForm = ({ initialData, onSubmit }) => {

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
                    isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]+[a-zA-Z0-9]$/.test(value);
                    errorMessage = 'Please enter a valid email.';
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
                    isValid = /^[a-zA-Z][a-zA-Z0-9._]{2,9}$/.test(value);
                    if (!isValid) {
                        if (value.length < 3) {
                            errorMessage = 'Username must be at least 3 characters long.';
                        }
                        else if (value.length > 10) {
                            errorMessage = 'Username must not exceed 10 characters.';
                        }
                        else {
                            errorMessage = 'Username must start with a letter and can only contain letters, underscores, and periods.';
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
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        const { isValid } = validateField(name, value);
        setValidationState(prevState => ({
            ...prevState,
            [name]: isValid ? 'valid' : 'invalid'
        }));
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

    const handleSubmit = (event) => {
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
                    {validateField('username', formData.username).errorMessage}
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