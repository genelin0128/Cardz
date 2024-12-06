import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import Cardz from "./Cardz";
import { useDispatch, useSelector } from "react-redux";
import { setSearchPosts} from "../slices/postsSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Pagination } from "react-bootstrap";

const RenderSearchPosts = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchQuery = location.state?.query || '';


    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const allSearchPosts = useSelector(state => state.posts.searchPosts);

    useEffect(() => {
        // fetch post
        fetch(`${process.env.REACT_APP_API_URL}/articles/content/${searchQuery}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    dispatch(setSearchPosts([]));
                    throw new Error(`No matched post found for "${searchQuery}"`);
                }
                throw new Error('Error fetching posts');
            }
            return response.json();
        })
        .then(posts => {
            if (posts) {
                dispatch(setSearchPosts(posts));
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }, [searchQuery]);

    const indexOfFirstPost = postsPerPage * (currentPage - 1);
    const indexOfLastPost = indexOfFirstPost + postsPerPage;
    const currentDisplayPosts = allSearchPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(allSearchPosts.length / postsPerPage);        // ex: 87 posts should have 9 pages

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    if (allSearchPosts.length === 0) {
        return (
            <Row className="justify-content-center mt-4">
                <Col lg={10} sm={12} className="text-center">
                    <h4>No matched post found for "{searchQuery}"</h4>
                </Col>
            </Row>
        );
    }

    return (
        <>
            {currentDisplayPosts.map((post, index) => (
                <Row key={`post-${index}`} className='justify-content-center'>
                    <Col lg={10} sm={12} className='p-0'>
                        <Cardz
                            post={post}
                        />
                    </Col>
                </Row>
            ))}

            <Row className="justify-content-center mt-3">
                <Col>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        />
                        {paginationItems}
                        <Pagination.Next
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>
        </>
    );
}

export default RenderSearchPosts;