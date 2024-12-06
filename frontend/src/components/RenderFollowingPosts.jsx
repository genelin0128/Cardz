import React, { useEffect, useState } from 'react';
import Cardz from "./Cardz";
import { useDispatch, useSelector } from "react-redux";
import { setFollowingPosts } from "../slices/postsSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Pagination } from "react-bootstrap";

const RenderFollowingPosts = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const followingUsers = useSelector(state => state.user.profile.followingUsers);

    const allFollowingPosts = useSelector(state => state.posts.followingPosts);

    const cardzModalCloseStatus = useSelector(state => state.posts.cardzModalCloseStatus);

    const [refreshFollowingUsers, setRefreshFollowingUsers] = useState(true);

    useEffect(() => {
        setRefreshFollowingUsers(true);
    }, [followingUsers])

    // Ensure that following/unfollowing a user in the CardzModal triggers a refetch of following posts when the CardzModal is closed
    const shouldRefresh = refreshFollowingUsers && cardzModalCloseStatus;

    useEffect(() => {
        if (shouldRefresh) {
            fetch(`${process.env.REACT_APP_API_URL}/articles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        dispatch(setFollowingPosts([]));
                        throw new Error("You are not following anyone right now");
                    }
                    throw new Error('Error fetching following posts');
                }
                return response.json();
            })
            .then(posts => {
                if (posts) {
                    setRefreshFollowingUsers(false)
                    dispatch(setFollowingPosts(posts));
                }
            })
            .catch(error => {
                console.error('Error fetching following posts:', error);
            });
        }
    }, [shouldRefresh]);

    const indexOfFirstPost = postsPerPage * (currentPage - 1);
    const indexOfLastPost = indexOfFirstPost + postsPerPage;
    const currentDisplayPosts = allFollowingPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(allFollowingPosts.length / postsPerPage);        // ex: 87 posts should have 9 pages

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

    if (allFollowingPosts.length === 0) {
        return (
            <Row className="justify-content-center mt-4">
                <Col lg={10} sm={12} className="text-center">
                    <h4>You are not following anyone right now</h4>
                </Col>
            </Row>
        );
    }

    return (
        <>
            {currentDisplayPosts.map((post, index) => (
                <Row key={`post-${index}`} className='justify-content-center'>
                    <Col sm={11} className='p-0'>
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

export default RenderFollowingPosts;