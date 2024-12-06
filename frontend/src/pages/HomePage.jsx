import Header from '../components/Header';
import UnauthorizedAccessPage from "./UnauthorizedAccessPage";
import React from "react";
import {useSelector} from "react-redux";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import HotPostsHeader from "../components/HotPostsHeader";
import FollowingHeader from "../components/FollowingHeader";
import NewPostButton from "../components/NewPostButton";
import RenderHotPosts from "../components/RenderHotPosts";
import RenderFollowingPosts from "../components/RenderFollowingPosts";

const HomePage = () => {

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    return (
        <div>
            <Header />
            {isLoggedIn === true ? (
                <Container>
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
                                 height: 'calc(100vh - 76px)',
                                 overflowY: 'auto'
                             }}
                        >
                            <Row className='justify-content-center'>
                                <FollowingHeader />
                                <RenderFollowingPosts />
                            </Row>

                            <div style={{
                                position: 'fixed',
                                bottom: '3%',
                                right: '7%',
                                zIndex: 1000,
                                borderRadius: '50%'
                            }}>
                                <NewPostButton/>
                            </div>
                        </Col>

                    </Row>
                </Container>
            ) : (
                <UnauthorizedAccessPage/>
            )}
        </div>
    );
}

export default HomePage;