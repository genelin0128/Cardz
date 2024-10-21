import Header from '../components/Header';
import Profile from '../components/Profile';
import Cardz from '../components/Cardz';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useSelector} from "react-redux";
import UnauthorizedAccessPage from "./UnauthorizedAccessPage";
import React, {useEffect, useState} from "react";
import NewPostButton from "../components/NewPostButton";
import RenderMyPosts from "../components/RenderMyPosts";

const MyProfilePage = () => {

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    return (
        <div>
            <Header />
            {isLoggedIn === true ? (
                <div style={{height: 'calc(100vh - 75px)', overflowY: 'auto'}}>
                    <Container>
                        <Row>
                            <Profile />
                        </Row>
                        <Row>
                            <Col>
                                <NewPostButton />
                            </Col>
                        </Row>

                        <RenderMyPosts />
                    </Container>

                </div>
            ) : (
                <UnauthorizedAccessPage />
            )}
        </div>
    );
}

export default MyProfilePage;