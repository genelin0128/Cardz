import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AvatarInCardz from "./AvatarInCardz";

const UserProfileCardz = ({ userId }) => {

    const avatar = '/img/avatar-guest.png';
    const [userData, setUserData] = useState({
        userId: '',
        username: '',
        userStatus: ''
    });

    useEffect(() => {
        if (userId) {
            // Fetch user data
            fetch(`https://jsonplaceholder.typicode.com/users?id=${userId}`)
                .then(response => response.json())
                .then(data => {
                    const user = data[0];
                    if (user) {
                        setUserData({
                            userId: user.id,
                            username: user.username,
                            userStatus: user.company.catchPhrase,
                        });
                    }
                });
        }
    }, [userId]);


    return (
        <Container className="my-3 py-2" style={{borderRadius: '10px', backgroundColor:'#c9f5ff', maxWidth: '550px'}} >
            <Row className='align-items-center'>
                <Col lg={3}>
                    <AvatarInCardz
                        avatarImage={avatar}
                        userId={userData.userId}
                    />
                </Col>
                <Col lg={9}>
                    <Row>
                        <Col lg={4}>
                            <p className='m-0 py-1 fw-bold' style={{ fontSize: '1rem' }}>{userData.username}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p
                                className='text-mutedx m-0'
                                style={{
                                    fontSize: '0.6rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {userData.userStatus}
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default UserProfileCardz;