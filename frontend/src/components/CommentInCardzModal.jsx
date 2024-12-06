import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import UserAvatarInComment from './UserAvatarInComment';
import Button from "react-bootstrap/Button";
import {BsThreeDotsVertical} from "react-icons/bs";
import { useSelector } from "react-redux";
import EditAndDeleteCommentBtnInCardzModal from "./EditAndDeleteCommentBtnInCardzModal";
import Container from "react-bootstrap/Container";

const CommentInCardzModal = ({ show, onClose, postId, comment_id, username, comment }) => {

    const [showEditAndDeleteBtnModal, setShowEditAndDeleteBtnModal] = useState(false);

    const handleShowEditAndDeleteBtnInCardzModal = () => {
        setShowEditAndDeleteBtnModal(true);
    }
    const handleCloseEditAndDeleteBtnInCardzModal = () => {
        setShowEditAndDeleteBtnModal(false);
    }

    // check if the currently logged-in user can edit or delete the post
    const belongToUser = username === useSelector(state => state.user.profile.username);

    const [userData, setUserData] = useState({
        username: '',
        status: '',
        avatar: ''
    });

    useEffect(() => {
        if (username) {
            // Fetch user data
            fetch(`${process.env.REACT_APP_API_URL}/profile/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(user => {
                if (user) {
                    setUserData({
                        username: user.username,
                        status: user.status,
                        avatar: user.avatar
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
        }
    }, [username]);

    return (
        <Container>
            <Toast show={show} onClose={onClose}>
                <Toast.Header closeButton={false}>
                    <Row className='align-items-center justify-content-concenter w-100' >
                        <div className='d-flex align-items-center gap-2'>
                            <div className='p-0 ms-0'>
                                <UserAvatarInComment
                                    avatarImage={userData.avatar}
                                    username={userData.username}
                                />
                            </div>
                            <Col>
                                <Row>
                                    <Col>
                                        <p className='m-0 py-0 fw-bold' style={{ fontSize: '0.8rem' }}>{userData.username}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            className='text-mutedx m-0 pe-2'
                                            style={{
                                                fontSize: '0.5rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {userData.status}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                            {(belongToUser) && (
                                <Col lg={1} className='d-flex justify-content-center'>
                                    <Button
                                        variant='link'
                                        onClick={handleShowEditAndDeleteBtnInCardzModal}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <BsThreeDotsVertical size={20}/>
                                    </Button>
                                </Col>
                            )}
                        </div>
                    </Row>
                </Toast.Header>
                <Toast.Body>{comment}</Toast.Body>
            </Toast>
            {(belongToUser) && (
                <EditAndDeleteCommentBtnInCardzModal
                    show={showEditAndDeleteBtnModal}
                    handleClose={handleCloseEditAndDeleteBtnInCardzModal}
                    postId={postId}
                    comment_id={comment_id}
                    comment={comment}
                />
            )}
        </Container>
    );
}

export default CommentInCardzModal;