import React, {useState} from 'react';
import {BsFillPlusCircleFill, BsTrash} from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { addNewPost } from "../slices/postsSlice";
import {useDispatch, useSelector} from "react-redux";

const NewPostButton = () => {
    const dispatch = useDispatch();

    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState([]);
    const avatar = useSelector((state) => state.user.profile.userAvatar);
    const userId = useSelector(state => state.user.profile.userId);
    const username = useSelector((state) => state.user.profile.username);
    const status = useSelector(state => state.user.profile.status);

    const handleClearPostContent = () => {
        setPostContent('');
    }

    const handleCloseNewPostModal = () => {
        setShowNewPostModal(false);
        setPostContent('');
        setPostImages([]);
    }

    const handeShowNewPostModal = () => {
        setShowNewPostModal(true);
    }

    const handleSubmitNewPost = (e) => {
        e.preventDefault();

        const newPost = {
            postUserAvatar: avatar,
            postId: `${username}＿${Date.now()}`,
            postUsername: username,
            postUserStatus: status,
            postUserId: userId,
            postContent: postContent,
            images: postImages.map(image => ({
                url: URL.createObjectURL(image)
            })),
            postTimeStamp: new Date().toISOString(),
            likes: 0,
            comments: []
        }

        dispatch(addNewPost(newPost));

        handleCloseNewPostModal();
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          setPostImages(prevImages => [...prevImages, ...files]);
        }
    };

    const removeImage = (index) => {
        setPostImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <>
            <div
                className='text-center'
                style={{
                    filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px rgba(201, 245, 255, 0.8))',
                    transition: 'filter 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 8px 25px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 30px rgba(201, 245, 255, 0.9))';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px rgba(201, 245, 255, 0.8))';
                }}
            >
                <BsFillPlusCircleFill
                    size={48}
                    color='#3c7bfa'
                    onClick={handeShowNewPostModal}
                    style={{cursor: 'pointer'}}
                />
            </div>
            <Modal
                show={showNewPostModal}
                onHide={handleCloseNewPostModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Post</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmitNewPost}>

                        <Form.Group className='mb-3'>
                            <Form.Label className='ps-2'>Upload Images</Form.Label>
                            <div className="d-grid">
                                <Button
                                    variant="secondary"
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className="d-flex align-items-center justify-content-center gap-2"
                                >
                                    <BsFillPlusCircleFill size={20}/>
                                    <span>Upload Images</span>
                                </Button>
                                <Form.Control
                                    id="fileInput"
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    multiple
                                    style={{display: 'none'}}
                                />
                            </div>
                            {postImages.length > 0 && (
                                <div
                                    className='mt-2'
                                    style={{
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'thin'
                                    }}
                                >
                                    <div className='d-flex gap-2' style={{minHeight: '120px'}}>
                                        {postImages.map((image, index) => (
                                            <div key={index} className='position-relative flex-shrink-0'>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className='img-fluid rounded'
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <Button
                                                    variant='danger'
                                                    size='sm'
                                                    className='position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center'
                                                    onClick={() => removeImage(index)}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        padding: '0'
                                                    }}
                                                >
                                                    <BsTrash size={15}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label className='ps-2'>Post Content</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={4}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder='Enter post content...'
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
                        variant="warning"
                        className="me-2"
                        onClick={handleClearPostContent}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={handleCloseNewPostModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitNewPost}
                        // disable submit button if no post content and images
                        disabled={!postContent || postImages.length === 0}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewPostButton;