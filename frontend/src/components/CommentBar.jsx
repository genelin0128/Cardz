import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import React, { useState } from "react";
import {refreshComments} from "../slices/postsSlice";
import {useDispatch} from "react-redux";

const CommentBar = ({ postId, onCommentSuccess }) => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const commentData = {
        comment: comment
    };

    const handleComment = async () => {
        fetch(`${process.env.REACT_APP_API_URL}/articles/comments/addAComment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(commentData)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    setComment('');
                    setErrorMessage(`No post found with ID: ${postId}.`);
                    throw new Error(`No post found with ID: ${postId}.`);
                }
                throw new Error(`Failed to comment`);
            }

            dispatch(refreshComments());
            onCommentSuccess();
            setComment('');
            return response.json();
        })
        .catch(error => {
            console.error('Error adding comment:', error);
        });
    };

    return (
        <Row className='mx-0'>
            <Form className="d-flex gap-2 mb-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleComment();
                  }}
            >
                <Form.Control
                    type="text"
                    placeholder="Drop a comment here!"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        setErrorMessage('');
                    }}
                />
                <Button
                    variant="primary"
                    onClick={handleComment}
                    disabled={comment.trim().length === 0}
                >
                    Comment
                </Button>
            </Form>

            {errorMessage && (
                <div className="text-danger mx-2">
                    {errorMessage}
                </div>
            )}
        </Row>
    );
};

export default CommentBar;