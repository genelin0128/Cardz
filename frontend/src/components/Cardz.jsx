import React, {useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { BsArrowUpCircle, BsChat, BsSend } from 'react-icons/bs';
import ImageSlider from './ImageSlider';
import AvatarInCardz from '../components/AvatarInCardz';
import CardzContent from '../components/CardzContent';
import CardzModal from './CardzModal';
import {useDispatch, useSelector} from "react-redux";
import {toggleCardzModalCloseStatus, updatePostUps} from "../slices/postsSlice";

const Cardz = ({ post }) => {
    const dispatch = useDispatch();

    const currentLoggedInUser = useSelector(state => state.user.profile.username);
    const hasUserUpped = post.ups.some(up => up.username === currentLoggedInUser);

    const [userData, setUserData] = useState({
        username: post.username,
        status: '',
        avatar: ''
    });

    const defaultImages = [
        '/img/cardz-defaultImage.jpeg',
        '/img/cardz-img1.jpeg',
        '/img/cardz-img2.jpeg',
        '/img/cardz-img3.jpeg',
        '/img/cardz-img4.jpeg'
    ]

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profile/user/${post.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(user => {
            if (user) {
                setUserData({
                    username: user.username,
                    status: user.status,
                    avatar: user.avatar
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    }, [post.username]);

    const loggedInUsername = useSelector((state) => state.user.profile.username);
    const loggedInUserAvatar = useSelector((state) => state.user.profile.userAvatar);
    const loggedInUserStatus = useSelector((state) => state.user.profile.status);

    useEffect(() => {
        if (post.username === loggedInUsername) {
            setUserData(prevState => ({
                username: post.username,
                avatar: loggedInUserAvatar,
                status: loggedInUserStatus
            }));
        }
    }, [loggedInUserAvatar, loggedInUserStatus, post.username, loggedInUsername]);

    const images = (post.images && post.images.length > 0)
        ? post.images
        : defaultImages;

    const [showCardzModal, setShowCardzModal] = useState(false);

    const handleCardzModalOpen = () => {
        setShowCardzModal(true);
        dispatch(toggleCardzModalCloseStatus());
    }

    const handleCardzModalClose = () => {
        setShowCardzModal(false);
        dispatch(toggleCardzModalCloseStatus());
    }

    const handleUpPost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/ups/${post._id}`, {
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
                _id: post._id,
                ups: updatedPost.post.ups,
            }));
        }
        catch (error) {
            console.error('Error upping/unupping post:', error);
        }
    };

    return (
        <Container fluid className='py-3' style={{maxWidth: '550px'}} >
            <Row className='align-items-center shadow-sm py-2' style={{borderRadius: '10px', backgroundColor:'#c9f5ff'}} >
                <Col xs={7} md={12} lg={7} onClick={handleCardzModalOpen} >
                    <Row className='align-items-center'>
                        <div className='d-flex align-items-center gap-2'>
                            <AvatarInCardz
                                avatarImage={userData.avatar}
                                username={userData.username}
                            />
                            <Col xs={9} lg={9}>
                                <Row>
                                    <Col>
                                        <p className='m-0 py-1 fw-bold' style={{ fontSize: '1rem' }}>{userData.username}</p>
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
                                            {userData.status}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            <CardzContent width='100%' height='100px' useEllipsis={true}>
                                {post.body}
                            </CardzContent>
                        </Col>
                    </Row>
                </Col>

                <Col xs={5} md={12} lg={5}>
                    <Row>
                        <Col xs={10} lg={9} className='p-0 m-0 d-flex justify-content-center'>
                            <ImageSlider images={images} />
                        </Col>
                        <Col xs={2} lg={3} className='d-flex flex-column align-items-center justify-content-around'>
                            <Button
                                variant='link'
                                style={{
                                    color: hasUserUpped && 'red'
                                }}
                                onClick={handleUpPost}
                            >
                                <BsArrowUpCircle size={18}  />
                            </Button>

                            <Button
                                variant='link'
                                onClick={handleCardzModalOpen}
                            >
                                <BsChat size={18}/>
                            </Button>
                            {/*<Button variant='link'>*/}
                            {/*    <BsSend size={18}/>*/}
                            {/*</Button>*/}
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
                avatarImage={userData.avatar}
                username={userData.username}
                images={images}
                status={userData.status}
                postId={post._id}
                postContent={post.body}
                postTimeStamp={post.createdAt}
                ups={post.ups}
            />

        </Container>
    );
}

export default Cardz;
