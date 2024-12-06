import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import {BsFillTrash3Fill, BsPencilSquare} from "react-icons/bs";
import React, {useState} from "react";
import {deletePost, updatePost} from "../slices/postsSlice";
import { useDispatch } from "react-redux";
import EditPost from "./EditPost";

const EditAndDeletePostBtnInCardzModal = ({ show, handleClose, postId, postContent, postImages, closeParentModal }) => {
    const dispatch = useDispatch();

    const handleDeletePost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/delete/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            dispatch(deletePost(postId));
            handleClose();
            closeParentModal();
        }
        catch (error) {
            console.error("Error updating post:", error);
        }
    };

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
                <Modal.Header closeButton>Edit Post</Modal.Header>
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