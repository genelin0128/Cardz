import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { BsArrowUpCircle, BsChat, BsSend } from 'react-icons/bs';
import CommentInCardzModal from './CommentInCardzModal';

const UpCommentShareBtn = ({userAvatarImage}) => {

    const [showComment, setShowComment] = useState(false);

    const toggleShowComment = () => setShowComment(!showComment);

    return (
        <Container className='px-0 py-1'>
            <Row>
                <ButtonGroup size='xl' className='mb-3 ms-0' style={{ width: '100%' }}>
                    <Button style={{ flex: 1 }} className='d-flex align-items-center justify-content-center' variant='outline-primary' >
                        <BsArrowUpCircle className='me-2' />
                        Up
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
                    <Button style={{ flex: 1 }} className='d-flex align-items-center justify-content-center' variant='outline-primary' >
                        <BsSend className='me-2' />
                        Share
                    </Button>
                </ButtonGroup>
            </Row>

            <Row className='justify-content-center m-0 p-0'>
                <Col lg={6} style={{backgroundColor: 'pink'}} className='d-flex justify-content-center m-0 p-0'>
                    <CommentInCardzModal
                        show={showComment}
                        onClose={toggleShowComment}
                        userId='UserID:1'
                        message='Write your comment here!'
                        userAvatarImage={userAvatarImage}
                    />
                </Col>

                <Col lg={6} style={{backgroundColor: 'cyan'}} className='d-flex justify-content-center m-0 p-0'>
                    <CommentInCardzModal
                        show={showComment}
                        onClose={toggleShowComment}
                        userId='UserID:2'
                        message='Write your comment here!'
                        userAvatarImage={userAvatarImage}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default UpCommentShareBtn;