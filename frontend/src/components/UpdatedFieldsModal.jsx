import React from 'react';
import Modal from "react-bootstrap/Modal";
import {ListGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const UpdatedFieldsModal = ({ show, handleClose, changes }) => {

    const getFieldDisplayName = (key) => {
        const displayNames = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            dateOfBirth: 'Date of Birth',
            phoneNumber: 'Phone Number',
            zipcode: 'Zip Code',
            username: 'Username',
            avatar: 'Avatar'
        };
        return displayNames[key] || key;
    };

    const getChangedValue = (key, oldValue, newValue) => {
        if (key === 'password') {
            return 'Password has been changed';
        }
        else if (key === 'avatar') {
            return 'Avatar has been updated';
        }
        return `${oldValue || 'Not set'} → ${newValue || 'Not set'}`;
    };

    return(
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Updated Fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {Object.entries(changes).map(([key, { oldValue, newValue }]) => (
                        <ListGroup.Item key={key}>
                            <strong>{getFieldDisplayName(key)}:</strong>{' '}
                            {getChangedValue(key, oldValue, newValue)}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdatedFieldsModal;