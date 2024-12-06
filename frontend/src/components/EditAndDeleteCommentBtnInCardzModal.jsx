import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";
import React, { useState } from "react";
import EditComment from "./EditComment";
import {refreshComments} from "../slices/postsSlice";
import {useDispatch} from "react-redux";

const EditAndDeleteCommentBtnInCardzModal = ({ show, handleClose, postId, comment_id, comment }) => {
    const dispatch = useDispatch();
    const deletedCommentId = {
        commentId: comment_id
    };

    const handleDeleteComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/comments/deleteAComment/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(deletedCommentId)

            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            dispatch(refreshComments())
            handleClose();
        }
        catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditComment = () => {
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
                <Modal.Header closeButton>Edit Comment</Modal.Header>
                <Modal.Body>
                    <Stack gap={2}>
                        <Button
                            variant='primary'
                            className='d-flex align-items-center'
                            onClick={handleEditComment}
                        >
                            <BsPencilSquare className='me-2' />
                            Edit
                        </Button>

                        <Button
                            variant='danger'
                            className='d-flex align-items-center'
                            onClick={handleDeleteComment}
                        >
                            <BsFillTrash3Fill className='me-2' />
                            Delete
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal>

            <EditComment
                show={showEditModal}
                handleClose={handleEditClose}
                postId={postId}
                commentId={comment_id}
                currentCommentContent={comment}
            />

        </>
    );
};

export default EditAndDeleteCommentBtnInCardzModal;