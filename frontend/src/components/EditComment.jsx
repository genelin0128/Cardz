import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { refreshComments } from "../slices/postsSlice";
import { useDispatch } from "react-redux";

const EditComment = ({ show, handleClose, postId, commentId, currentCommentContent }) => {
    const dispatch = useDispatch();
    const [updatedCommentContent, setUpdatedCommentContent] = useState(currentCommentContent);

    useEffect(() => {
        setUpdatedCommentContent(currentCommentContent);
    }, [currentCommentContent]);

    const handleCloseEditCommentModal = () => {
        setUpdatedCommentContent(currentCommentContent);
        handleClose();
    }

    const updatedComment = {
        commentId: commentId,
        comment: updatedCommentContent
    };

    const handleSubmitUpdatedComment = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/comments/updateAComment/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedComment)
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            dispatch(refreshComments());
            handleClose();
        }
        catch (error) {
            console.error("Error updating comment:", error);
        }
    }


    return (
        <Modal
            show={show}
            onHide={handleCloseEditCommentModal}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Comment</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmitUpdatedComment}>
                    <Form.Group className='mb-3'>
                        <Form.Label className='ps-2'>Comment</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={4}
                            value={updatedCommentContent}
                            onChange={(e) => setUpdatedCommentContent(e.target.value)}
                            placeholder='Enter comment...'
                            style={{
                                resize: 'none',
                                height: '110px'
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    className="me-2"
                    onClick={handleCloseEditCommentModal}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmitUpdatedComment}
                    disabled={updatedCommentContent.trim().length === 0}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditComment;