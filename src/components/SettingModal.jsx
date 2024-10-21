import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import AvatarInSettingModal from "./AvatarInSettingModal";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updateAvatar, setAvatarPreview } from "../slices/userSlice";
import ProfileForm from "./ProfileForm";
import UpdatedFieldsModal from "./UpdatedFieldsModal";

const SettingModal = ({ show, handleClose }) => {

    const dispatch = useDispatch();
    const userAvatarPreview = useSelector(state => state.user.profile.userAvatarPreview);

    const firstName = useSelector(state => state.user.profile.firstName);
    const lastName = useSelector(state => state.user.profile.lastName);
    const email = useSelector(state => state.user.profile.email);
    const dateOfBirth = useSelector(state => state.user.profile.dateOfBirth);
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

    const handleSave = (formData) => {

        const updatedData = { ...formData };
        const changedFields = {};

        if (userAvatarPreview) {
            dispatch(updateAvatar(userAvatarPreview));
            changedFields.avatar = { oldValue: '', newValue: '' };
        }

        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] !== profileData[key] && key !== 'passwordConfirmation') {
                if (key === 'password') {
                    if (updatedData[key].trim() !== '') {
                        changedFields[key] = { oldValue: '', newValue: '' };
                    }
                }
                else {
                    changedFields[key] = {
                        oldValue: profileData[key],
                        newValue: updatedData[key]
                    };
                }
            }
        });

        if (updatedData.password.trim() === '' || updatedData.passwordConfirmation.trim() === '') {
            delete updatedData.password;
            delete updatedData.passwordConfirmation;
        }

        dispatch(updateProfile(updatedData));
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
                        <Button variant="secondary" onClick={handleCloseSettingModal}>Cancel</Button>
                        <Button variant="primary" type="submit" form="profileForm">Save</Button>
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