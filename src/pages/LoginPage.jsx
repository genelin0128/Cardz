
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Header from '../components/Header';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import React, { useState } from "react";
import HotPostsHeader from "../components/HotPostsHeader";
import RenderHotPosts from "../components/RenderHotPosts";


const LoginPage = () => {

    const [status, setStatus] = useState('LogIn');

    const handleSwitchToSignUp = () => {
        setStatus('SignUp');
    }

    const handleSwitchToLogIn = () => {
        setStatus('LogIn');
    }

    return (
        <div>
            <Header />
            <Container style={{ height: 'calc(100vh - 75px)' }}>
                <Row>
                    <Col xs={12} md={6}
                         style={{
                             borderLeft: '2px solid #c9f5ff',
                             borderRight: '1px solid #c9f5ff',
                             height: 'calc(100vh - 76px)',
                             overflowY: 'auto'
                         }}
                    >
                        <Row className='justify-content-center'>
                            <HotPostsHeader />
                            <RenderHotPosts />
                        </Row>
                    </Col>
                    <Col xs={12} md={6}
                         style={{
                             borderLeft: '1px solid #c9f5ff',
                             borderRight: '2px solid #c9f5ff',
                             height: 'calc(100vh - 75px)'
                         }}
                    >
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 75px)'}}>
                            {/*Login and Sign Up Components*/}
                            {status === 'LogIn' ? (
                                <LogIn switchToSignUp={handleSwitchToSignUp} />
                            ) : (
                                <SignUp switchToLogIn={handleSwitchToLogIn} />
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;