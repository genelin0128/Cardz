import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import {BsFillTrash3Fill, BsPencilSquare} from "react-icons/bs";
import React, {useState} from "react";
import { deletePost } from "../slices/postsSlice";
import { useDispatch } from "react-redux";
import EditPost from "./EditPost";

const EditAndDeletePostBtnInCardzModal = ({ show, handleClose, postId, postContent, postImages, closeParentModal }) => {
    const dispatch = useDispatch();

    const handleDeletePost = () => {
        dispatch(deletePost(postId));
        handleClose();
        closeParentModal();
    }

    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditPost = () => {
        setShowEditModal(true);
        handleClose();
    }

    const handleEditClose = () => {
        setShowEditModal(false);
    }

    return (
        <>
            <Modal
                size='sm'
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Stack gap={2}>
                        <Button
                            variant='primary'
                            className='d-flex align-items-center'
                            onClick={handleEditPost}
                        >
                            <BsPencilSquare className='me-2' />
                            Edit
                        </Button>

                        <Button
                            variant='danger'
                            className='d-flex align-items-center'
                            onClick={handleDeletePost}
                        >
                            <BsFillTrash3Fill className='me-2' />
                            Delete
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal>

            <EditPost
                show={showEditModal}
                handleClose={handleEditClose}
                postId={postId}
                currentPostContent={postContent}
                currentPostImages={postImages}
            />
        </>
    );
};

export default EditAndDeletePostBtnInCardzModal;