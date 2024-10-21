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

    const handleCloseEditPostModal = () => {
        setUpdatedPostContent(currentPostContent);
        setUpdatedPostImages(currentPostImages);
        handleClose();
    }

    const handleSubmitUpdatedPost = (e) => {
        e.preventDefault();

        const updatedPost = {
            postId: postId,
            postContent: updatedPostContent,
            images: updatedPostImages
        }

        dispatch(updatePost(updatedPost));
        handleClose();
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => ({
                url: URL.createObjectURL(file)
            }));
            setUpdatedPostImages(prevImages => [...prevImages, ...newImages]);
        }
    };

    const removeImage = (index) => {
        setUpdatedPostImages(prevImages => prevImages.filter((_, i) => i !== index));
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
                        {updatedPostImages.length > 0 && (
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
                                    {updatedPostImages.map((image, index) => (
                                        <div key={index} className='position-relative flex-shrink-0'>
                                            <img
                                                src={image.url}
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
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmitUpdatedPost}
                    disabled={!updatedPostContent || updatedPostImages.length === 0}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditPost;