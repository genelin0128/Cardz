import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useDispatch, useSelector} from 'react-redux';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {setStatus} from '../slices/userSlice';


const Profile = () => {

    const username = useSelector((state) => state.user.profile.username);

    const avatarImage = useSelector(state => state.user.profile.userAvatar);
    const [showAvatar, setShowAvatar] = useState(false);
    const [statusValidation, setStatusValidation] = useState('valid');

    const handleAvatarOpen = () => {
        setShowAvatar(true);
    }

    const handleAvatarClose = () => {
        setShowAvatar(false);
    }

    const currentStatus = useSelector(state => state.user.profile.status);
    const [temporaryStatus, setTemporaryStatus] = useState(currentStatus);
    const dispatch = useDispatch();
    const [showStatus, setShowStatus] = useState(false);

    const handleInputChange = (event) => {
        const { value } = event.target;
        if (value.length > 50) {
            setStatusValidation('invalid');
        }
        else {
            setStatusValidation('valid');
        }
        setTemporaryStatus(value);
    };

    const handleSaveStatus = async () => {
        if (statusValidation === 'valid') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/headline/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: temporaryStatus })
            });

            if (!response.ok) {
                throw new Error(`Failed to update status`);
            }

            dispatch(setStatus(temporaryStatus));
            handleStatusClose();
        }
    }

    const handleStatusOpen = () => {
        setTemporaryStatus(currentStatus);
        setShowStatus(true);
        setStatusValidation('valid');
    };

    const handleStatusClose = () => {
        setTemporaryStatus(currentStatus);
        setShowStatus(false);
    };

    return (
        <Container className='pt-5 pb-3'>
            <Row className='align-items-center'>
                <div className='d-flex flex-column flex-sm-row align-items-center gap-3'>
                    <Image
                        src={avatarImage}
                        roundedCircle
                        width='180'
                        height='180'
                        className='border'
                        alt='avatar'
                        onClick={handleAvatarOpen}
                    />

                    <Col className='align-items-center w-100 px-2'>
                        {/*<Row className='justify-content-start'>*/}
                        {/*    <Col className='d-flex gap-4'>*/}
                        {/*        <Button variant='outline-primary'>Cardz</Button>*/}
                        {/*        <Button variant='outline-primary'>Followers</Button>*/}
                        {/*        <Button variant='outline-primary'>Following</Button>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        <Row>
                            <p className='fs-2 my-2'><strong>{username}</strong></p>
                        </Row>
                        <Row className="g-0">
                            <Col xs="auto">
                                <div
                                    className="px-2 py-1"
                                    style={{borderRadius: '5px', backgroundColor: '#c9f5ff', cursor: 'pointer',}}
                                    onClick={handleStatusOpen}
                                >
                                    <p className='text-muted fs-5 mb-0'>{currentStatus || 'Enter your status'}</p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </div>
            </Row>

            {/*For avatar*/}
            <Modal
                show={showAvatar}
                onHide={handleAvatarClose}
                centered
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className='align-items-center'>
                            <Image
                                src={avatarImage}
                                className='border'
                                alt='avatar'
                            />
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            {/*For Status*/}
            <Modal
                show={showStatus}
                onHide={handleStatusClose}
                centered
            >
                <Modal.Header closeButton>Status</Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId='floatingStatus' label='Status' className='mb-2'>
                        <Form.Control
                            type='status'
                            name='status'
                            placeholder='Status'
                            value={temporaryStatus}
                            onChange={handleInputChange}
                            isInvalid={statusValidation === 'invalid'}
                        />
                        <Form.Control.Feedback type='invalid' className='my-2 ms-2'>
                            This field can only accept up to 50 characters.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <Form.Text className='text-muted ms-2'>
                        Characters: {temporaryStatus.length}/50
                    </Form.Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleStatusClose}>Cancel</Button>
                    <Button variant='primary' onClick={handleSaveStatus}>Save</Button>
                </Modal.Footer>

            </Modal>
        </Container>
    );
}

export default Profile;