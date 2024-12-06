import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import AvatarInSettingModal from "./AvatarInSettingModal";
import { useDispatch, useSelector } from "react-redux";
import {updateProfile, updateAvatar, setAvatarPreview, login, setErrorMessage} from "../slices/userSlice";
import ProfileForm from "./ProfileForm";
import UpdatedFieldsModal from "./UpdatedFieldsModal";

const SettingModal = ({ show, handleClose }) => {

    const dispatch = useDispatch();
    const userAvatarPreview = useSelector(state => state.user.profile.userAvatarPreview);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const firstName = useSelector(state => state.user.profile.firstName);
    const lastName = useSelector(state => state.user.profile.lastName);
    const email = useSelector(state => state.user.profile.email);
    const dateOfBirth = new Date(useSelector(state => state.user.profile.dateOfBirth)).toISOString().split('T')[0];
    const phoneNumber = useSelector(state => state.user.profile.phoneNumber);
    const zipcode = useSelector(state => state.user.profile.zipcode);
    const username = useSelector(state => state.user.profile.username);

    const [showUpdatedFieldsModal, setShowUpdatedFieldsModal] = useState(false);
    const [changes, setChanges] = useState({});

    const profileData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        phoneNumber,
        zipcode,
        username,
        password: '',
        passwordConfirmation: '',
    };

    const handleSave = async (formData) => {
        const updatedData = { ...formData };
        const changedFields = {};
        setIsSubmitting(true);

        const updateEndpoints = {
            firstName: `${process.env.REACT_APP_API_URL}/firstname/update`,
            lastName: `${process.env.REACT_APP_API_URL}/lastname/update`,
            email: `${process.env.REACT_APP_API_URL}/email/update`,
            dateOfBirth: `${process.env.REACT_APP_API_URL}/dob/update`,
            phoneNumber: `${process.env.REACT_APP_API_URL}/phone/update`,
            zipcode: `${process.env.REACT_APP_API_URL}/zipcode/update`,
            password: `${process.env.REACT_APP_API_URL}/password`
        };

        if (userAvatarPreview) {
            const avatarFormData = new FormData();

            // Convert base64 to File object directly
            const file = await fetch(userAvatarPreview)
            .then(r => r.blob())
            .then(blob => new File([blob], 'avatar.jpg', { type: blob.type }));

            avatarFormData.append('avatar', file);

            const avatarResponse = await fetch(`${process.env.REACT_APP_API_URL}/avatar/update`, {
                method: 'PUT',
                credentials: 'include',
                body: avatarFormData
            });

            if (!avatarResponse.ok) {
                throw new Error('Failed to upload avatar');
            }

            const avatarData = await avatarResponse.json();
            dispatch(updateAvatar(avatarData.avatar));
            changedFields.avatar = {
                oldValue: '',
                newValue: ''
            };
        }

        for (const [key, endpoint] of Object.entries(updateEndpoints)) {
            if (updatedData[key] !== profileData[key] && key !== 'passwordConfirmation') {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ [key]: updatedData[key] })
                });

                if (!response.ok) {
                    throw new Error(`Failed to update ${key}`);
                }

                changedFields[key] = {
                    oldValue: profileData[key],
                    newValue: updatedData[key]
                };
            }
        }

        if (updatedData.password.trim() === '' || updatedData.passwordConfirmation.trim() === '') {
            delete updatedData.password;
            delete updatedData.passwordConfirmation;
        }

        dispatch(updateProfile(updatedData));
        setIsSubmitting(false);
        handleClose();

        // show updated fields only when updates have been made
        if (Object.keys(changedFields).length > 0) {
            setChanges(changedFields);
            setShowUpdatedFieldsModal(true);
        }
    }

    const handleCloseSettingModal = () => {
        dispatch(setAvatarPreview(null));
        handleClose();
    };

    const handleCloseUpdatedFieldsModal = () => {
        setShowUpdatedFieldsModal(false);
        setChanges({});
    }

    return (
        <>
            <Modal
                size="lg"
                show={show}
                onHide={handleCloseSettingModal}
                centered
            >
                <div style={{
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column'}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{flex: 1, overflowY: 'auto'}}>
                        <Container>
                            <Row className='justify-content-center py-3'>
                                <AvatarInSettingModal />
                            </Row>

                            <Row>
                                <Col>
                                    <ProfileForm initialData={profileData} onSubmit={handleSave} />
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleCloseSettingModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            form="profileForm"
                            disabled={isSubmitting}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
            <UpdatedFieldsModal
                show={showUpdatedFieldsModal}
                handleClose={handleCloseUpdatedFieldsModal}
                changes={changes}
            />
        </>
    );
}

export default SettingModal;