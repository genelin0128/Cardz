import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { BsArrowUpCircle, BsChat, BsSend } from 'react-icons/bs';
import ImageSlider from './ImageSlider';
import AvatarInCardz from '../components/AvatarInCardz';
import CardzContent from '../components/CardzContent';
import CardzModal from './CardzModal';

const Cardz = ({ post }) => {

    const avatarImage = post.postUserAvatar;

    const defaultImages = [
        {url: '/img/cardz-defaultImage.jpeg'},
        {url: '/img/cardz-img1.jpeg'},
        {url: '/img/cardz-img2.jpeg'},
        {url: '/img/cardz-img3.jpeg'},
        {url: '/img/cardz-img4.jpeg'},
    ]

    const images = (post.images && post.images.length > 0) ? post.images : defaultImages;

    const [showCardzModal, setShowCardzModal] = useState(false);

    const handleCardzModalOpen = () => {
        setShowCardzModal(true);
    }

    const handleCardzModalClose = () => {
        setShowCardzModal(false);
    }

    return (
        <Container fluid className='py-3' style={{maxWidth: '550px'}} >
            <Row className='align-items-center shadow-sm py-2' onClick={handleCardzModalOpen} style={{borderRadius: '10px', backgroundColor:'#c9f5ff'}} >
                <Col xs={7} md={12} lg={7}>
                    <Row className='align-items-center'>
                        <div className='d-flex align-items-center gap-1'>
                            <AvatarInCardz
                                avatarImage={avatarImage}
                                userId={post.postUserId}
                            />
                            <Col xs={9} lg={9}>
                                <Row>
                                    <Col>
                                        <p className='m-0 py-1 fw-bold' style={{ fontSize: '1rem' }}>{post.postUsername}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            className='text-mutedx m-0 pe-2'
                                            style={{
                                                fontSize: '0.6rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {post.postUserStatus}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            <CardzContent width='100%' height='100px' useEllipsis={true}>
                                {post.postContent}
                            </CardzContent>
                        </Col>
                    </Row>
                </Col>

                <Col xs={5} md={12} lg={5}>
                    <Row>
                        <Col xs={10} lg={9} className='p-0 m-0 d-flex justify-content-center'
                        >
                            <ImageSlider images={images} />
                        </Col>
                        <Col xs={2} lg={3} className='d-flex flex-column align-items-center justify-content-around'
                        >
                            <Button variant='link'>
                                <BsArrowUpCircle size={18}/>
                            </Button>
                            <Button variant='link'>
                                <BsChat size={18}/>
                            </Button>
                            <Button variant='link'>
                                <BsSend size={18}/>
                            </Button>
                        </Col>
                    </Row>
                </Col>


                {/*<Col xs={12} md={5}>*/}
                {/*    <Row className='align-items-center justify-content-between'>*/}
                {/*        <Col xs={9} md={9} className='d-flex justify-content-end p-0'>*/}
                {/*            <ImageSlider images={images} />*/}
                {/*        </Col>*/}
                {/*        <Col xs={3} md={3}>*/}
                {/*            <Row>*/}
                {/*                <Button variant='link' className='my-2 p-1'>*/}
                {/*                    <BsArrowUpCircle size={18} />*/}
                {/*                </Button>*/}
                {/*            </Row>*/}
                {/*            <Row>*/}
                {/*                <Button variant='link' className='my-2 p-1'>*/}
                {/*                    <BsChat size={18} />*/}
                {/*                </Button>*/}
                {/*            </Row>*/}
                {/*            <Row>*/}
                {/*                <Button variant='link' className='my-2 p-1'>*/}
                {/*                    <BsSend size={18} />*/}
                {/*                </Button>*/}
                {/*            </Row>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</Col>*/}
            </Row>


            <CardzModal
                show={showCardzModal}
                handleClose={handleCardzModalClose}
                avatarImage={avatarImage}
                username={post.postUsername}
                userId={post.postUserId}
                images={images}
                status={post.postUserStatus}
                postId={post.postId}
                postContent={post.postContent}
                postTimeStamp={post.postTimeStamp}
            />

        </Container>
    );
}

export default Cardz;
