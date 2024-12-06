import React, { useState } from 'react';
import {useDispatch} from "react-redux";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BsFillPlusCircleFill, BsTrash } from "react-icons/bs";
import { updatePost } from "../slices/postsSlice";

const EditPost = ({ show, handleClose, postId, currentPostContent, currentPostImages}) => {
    const dispatch = useDispatch();
    const [updatedPostContent, setUpdatedPostContent] = useState(currentPostContent);
    const [updatedPostImages, setUpdatedPostImages] = useState(currentPostImages);
    const [imagePreviewUrls, setImagePreviewUrls] = useState(currentPostImages);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCloseEditPostModal = () => {
        setUpdatedPostContent(currentPostContent);
        setUpdatedPostImages(currentPostImages);
        setImagePreviewUrls(currentPostImages);
        setIsSubmitting(false);
        handleClose();
    }

    const handleSubmitUpdatedPost = async (e) => {
        e.preventDefault();
        if (isSubmitting === true) {
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('body', updatedPostContent);

            // Check if there are any new images added by the user
            updatedPostImages.forEach((image) => {
                // If the image is a File object, it means it's a newly uploaded image
                if (image instanceof File) {
                    formData.append('images', image);
                }
            });

            formData.append('allImages', JSON.stringify(updatedPostImages));

            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/update/${postId}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const updatedPost = await response.json();
            dispatch(updatePost(updatedPost));


            setIsSubmitting(false);
            handleClose();
        }
        catch (error) {
            console.error("Error updating post:", error);
        }

        handleClose();
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setUpdatedPostImages(prevImages => [...prevImages, ...files]);

            const newImages = files.map(file => URL.createObjectURL(file));
            setImagePreviewUrls(prevImages => [...prevImages, ...newImages]);
        }
    };

    const removeImage = (index) => {
        setUpdatedPostImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviewUrls(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <Modal
            show={show}
            onHide={handleCloseEditPostModal}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmitUpdatedPost}>
                    <Form.Group className='mb-3'>
                        <Form.Label className='ps-2'>Upload Images</Form.Label>
                        <div className="d-grid">
                            <Button
                                variant="secondary"
                                onClick={() => document.getElementById('editFileInput').click()}
                                className="d-flex align-items-center justify-content-center gap-2"
                            >
                                <BsFillPlusCircleFill size={20}/>
                                <span>Upload Images</span>
                            </Button>
                            <Form.Control
                                id="editFileInput"
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                multiple
                                style={{display: 'none'}}
                            />
                        </div>
                        {imagePreviewUrls.length > 0 && (
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
                                    {imagePreviewUrls.map((image, index) => (
                                        <div key={index} className='position-relative flex-shrink-0'>
                                            <img
                                                src={image}
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
                            value={updatedPostContent}
                            onChange={(e) => setUpdatedPostContent(e.target.value)}
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
                    variant="secondary"
                    className="me-2"
                    onClick={handleCloseEditPostModal}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmitUpdatedPost}
                    disabled={!imagePreviewUrls || imagePreviewUrls.length === 0 || isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditPost;