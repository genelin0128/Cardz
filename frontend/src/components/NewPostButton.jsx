import React, { useState } from 'react';
import { BsFillPlusCircleFill, BsTrash } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { addNewPost } from "../slices/postsSlice";
import { useDispatch } from "react-redux";

const NewPostButton = () => {
    const dispatch = useDispatch();

    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClearPostContent = () => {
        setPostContent('');
    }

    const handleCloseNewPostModal = () => {
        setShowNewPostModal(false);
        setPostContent('');
        setPostImages([]);
        setIsSubmitting(false);
    }

    const handeShowNewPostModal = () => {
        setShowNewPostModal(true);
    }

    const handleSubmitNewPost = async (e) => {
        e.preventDefault();

        if (isSubmitting === true) {
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('body', postContent);

            postImages.forEach((image) => {
                formData.append('images', image);
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/posts/addAPost`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const newPost = await response.json();
            dispatch(addNewPost(newPost));

            handleCloseNewPostModal();
        }
        catch (error) {
            console.error('Error creating post:', error);
        }
        finally {
            setIsSubmitting(false);
        }
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
                                    disabled={isSubmitting}
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
                        disabled={isSubmitting}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={handleCloseNewPostModal}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitNewPost}
                        // disable submit button if no post content and images
                        disabled={!postContent || postImages.length === 0 || isSubmitting}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewPostButton;