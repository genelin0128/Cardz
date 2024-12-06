import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AvatarInCardz from "./AvatarInCardz";
import {useSelector} from "react-redux";

const UserProfileCardz = ({ username }) => {

    const [userData, setUserData] = useState({
        username: '',
        status: '',
        avatar: ''
    });

    useEffect(() => {
        if (username) {
            // Fetch user data
            fetch(`${process.env.REACT_APP_API_URL}/profile/${username}`, {
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
        }
    }, [username]);

    const loggedInUsername = useSelector((state) => state.user.profile.username);
    const loggedInUserAvatar = useSelector((state) => state.user.profile.userAvatar);
    const loggedInUserStatus = useSelector((state) => state.user.profile.status);

    useEffect(() => {
        if (username === loggedInUsername) {
            setUserData(prevState => ({
                ...prevState,
                avatar: loggedInUserAvatar,
                status: loggedInUserStatus
            }));
        }
    }, [loggedInUserAvatar, loggedInUserStatus, username, loggedInUsername]);

    return (
        <Container className="my-3 py-2" style={{borderRadius: '10px', backgroundColor:'#c9f5ff', maxWidth: '550px'}} >
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
        </Container>
    );
}

export default UserProfileCardz;