import React from 'react';
import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UnauthorizedAccessPage from "./UnauthorizedAccessPage";
import {useSelector} from "react-redux";
import SearchPostResultsHeader from "../components/SearchPostResultsHeader";
import RenderSearchPosts from "../components/RenderSearchPosts";
import SearchUserResultsHeader from "../components/SearchUserResultsHeader";
import RenderSearchUsers from "../components/RenderSearchUsers";

const SearchResultsPage = () => {

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
                                <SearchPostResultsHeader />
                                <RenderSearchPosts />
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
                                <SearchUserResultsHeader />
                                <RenderSearchUsers />
                            </Row>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <UnauthorizedAccessPage/>
            )}
        </div>
    );
}

export default SearchResultsPage;