import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import UserAvatarInComment from './UserAvatarInComment';

const CommentInCardzModal = ({ show, onClose, userId, message, userAvatarImage}) => {
    return (
        <Toast show={show} onClose={onClose}>
            <Toast.Header closeButton={false}>
                <Row style={{width: '100%'}}>
                    <Col lg={2} style={{backgroundColor: 'green'}} className='px-1'>
                        <UserAvatarInComment userAvatarImage={userAvatarImage}/>
                    </Col>
                    <Col style={{backgroundColor: 'yellow'}} className='d-flex align-items-center p-0'>
                        <strong className='me-auto' style={{fontSize: '0.8rem'}}>{userId}</strong>
                    </Col>
                </Row>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );
}

export default CommentInCardzModal;