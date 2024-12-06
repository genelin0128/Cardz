import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ImageSliderInModal from './ImageSliderInModal';
import AvatarInCardz from './AvatarInCardz';
import CardzContent from './CardzContent';
import UpCommentShareBtn from './UpCommentShareBtn';
import { BsThreeDotsVertical } from 'react-icons/bs';
import EditAndDeletePostBtnInCardzModal from './EditAndDeletePostBtnInCardzModal';
import {useDispatch, useSelector} from "react-redux";

const CardzModal = ({ show, handleClose, avatarImage, username, images, status, postId, postContent, postTimeStamp, ups }) => {
    const dispatch = useDispatch();

    const currentLoggedInUser = useSelector(state => state.user.profile.username);
    const hasUserUpped = ups.some(up => up.username === currentLoggedInUser);

    const [showEditAndDeleteBtnModal, setShowEditAndDeleteBtnModal] = useState(false);

    const handleShowEditAndDeleteBtnInCardzModal = () => {
        setShowEditAndDeleteBtnModal(true);
    }
    const handleCloseEditAndDeleteBtnInCardzModal = () => {
        setShowEditAndDeleteBtnModal(false);
    }

    // check if the currently logged-in user can edit or delete the post
    const belongToUser = username === currentLoggedInUser;

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2');
    };

    return (
        <Modal
            size='lg'
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>{formatDateTime(postTimeStamp)}</Modal.Header>

            <Modal.Body
                style={{
                    overflowY: 'auto',
                    maxHeight: '80vh'
                }}
            >
                <Container>
                    <Row className='align-items-center'>
                        <div className='d-flex align-items-center gap-2'>
                            <AvatarInCardz
                                avatarImage={avatarImage}
                                username={username}
                            />
                            <Col xs={9} lg={10}>
                                <Row>
                                    <Col lg={4}>
                                        <p className='m-0 py-1 fw-bold' style={{fontSize: '1.3rem'}}>{username}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            className='text-mutedx m-0 pe-2'
                                            style={{
                                                fontSize: '0.8rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {status}
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

                    <Row className='p-1'></Row>

                    <Row>
                        <Col lg={5} className='d-flex align-items-center'>
                            <CardzContent width="100%" height="315px">
                                {postContent}
                            </CardzContent>
                        </Col>
                        <Col lg={7} className='d-flex justify-content-end'>
                            <ImageSliderInModal images={images}/>
                        </Col>
                    </Row>
                    <Row>
                        <UpCommentShareBtn postId={postId} upStatus={hasUserUpped} numberOfUps={ups.length} />
                    </Row>
                </Container>
            </Modal.Body>

            {(belongToUser) && (
                <EditAndDeletePostBtnInCardzModal
                    show={showEditAndDeleteBtnModal}
                    handleClose={handleCloseEditAndDeleteBtnInCardzModal}
                    postId={postId}
                    postContent={postContent}
                    postImages={images}
                    closeParentModal={handleClose}
                />
            )}

        </Modal>
    );
}

export default CardzModal;