import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { BsArrowUpCircle, BsChat, BsSend } from 'react-icons/bs';
import CommentInCardzModal from './CommentInCardzModal';
import CommentBar from "./CommentBar";
import {useDispatch, useSelector} from "react-redux";
import {updatePostUps} from "../slices/postsSlice";

const UpCommentShareBtn = ({ postId, upStatus=false, numberOfUps }) => {
    const dispatch = useDispatch();
    const currentLoggedInUser = useSelector(state => state.user.profile.username);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const [showComment, setShowComment] = useState(false);

    const [allCommentsDataInAPost, setAllCommentsDataInAPost] = useState([]);

    const toggleShowComment = () => setShowComment(!showComment);

    const refreshComments = useSelector(state => state.posts.refresh);

    const handleCommentSuccess = () => {
        setShowComment(true);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/articles/comments/allComments/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    setAllCommentsDataInAPost([]);
                    throw new Error("No comments found");
                }
                if (response.status === 401) {
                    throw new Error("Log in to view the comment.");
                }
                throw new Error('Error fetching comments');
            }
            return response.json();
        })
        .then(comments => {
            if (comments) {
                setAllCommentsDataInAPost(comments);
            }
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
    }, [refreshComments]);

    const handleUpPost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/ups/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: currentLoggedInUser
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to up/unup post`);
            }
            const updatedPost = await response.json();
            dispatch(updatePostUps({
                _id: postId,
                ups: updatedPost.post.ups,
            }));
        }
        catch (error) {
            console.error('Error upping/unupping post:', error);
        }
    };

    return (
        <Container className='px-0 py-1'>
            <Row className='m-0'>
                <ButtonGroup size='xl' className='mb-3 ms-0' style={{ width: '100%' }}>
                    <Button
                        style={{ flex: 1 }}
                        className='d-flex align-items-center justify-content-center'
                        variant={upStatus ? 'danger' : 'outline-primary'}
                        onClick={handleUpPost}
                    >
                        <BsArrowUpCircle className='me-2' />
                        {numberOfUps} Up
                    </Button>
                    <Button
                        style={{ flex: 1 }}
                        className='d-flex align-items-center justify-content-center'
                        variant={showComment ? 'primary' : 'outline-primary'}
                        onClick={toggleShowComment}
                    >
                        <BsChat className='me-2' />
                        Comment
                    </Button>
                    {/*<Button style={{ flex: 1 }} className='d-flex align-items-center justify-content-center' variant='outline-primary' >*/}
                    {/*    <BsSend className='me-2' />*/}
                    {/*    Share*/}
                    {/*</Button>*/}
                </ButtonGroup>
            </Row>

            {(isLoggedIn) && (
                <CommentBar
                    postId={postId}
                    onCommentSuccess={handleCommentSuccess}
                />
            )}

            {(showComment) && (
                (!isLoggedIn) ? (
                    <Row className='justify-content-center mt-4'>
                        <Col xs={12} md={6} className="text-center">
                            <h4>Log in to view the comments.</h4>
                        </Col>
                    </Row>
                ) : (
                    (allCommentsDataInAPost.length === 0) ? (
                        <Row className='justify-content-center mt-4'>
                            <Col xs={12} md={6} className="text-center">
                                <h4>No comments found</h4>
                            </Col>
                        </Row>
                    ) : (
                        <Row className='m-0'>
                            {allCommentsDataInAPost.map((commentData, index) => (
                                <Col key={index} lg={6} className='d-flex justify-content-center my-2 p-0'>
                                    <CommentInCardzModal
                                        show={showComment}
                                        onClose={toggleShowComment}
                                        postId={postId}
                                        comment_id={commentData._id}
                                        username={commentData.username}
                                        comment={commentData.comment}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )
                )
            )}

        </Container>
    );
}

export default UpCommentShareBtn;