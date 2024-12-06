import React, { useEffect, useState } from 'react';
import Cardz from "./Cardz";
import { useDispatch, useSelector } from "react-redux";
import { setMyPosts } from "../slices/postsSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RenderMyPosts = () => {
    const dispatch = useDispatch();
    const avatar = useSelector(state => state.user.profile.userAvatar);
    const status = useSelector(state => state.user.profile.status);

    const allMyPosts = useSelector(state => state.posts.myPosts);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/articles/posts/myPosts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    dispatch(setMyPosts([]));
                    throw new Error("You do not have any post");
                }
                throw new Error('Error fetching your posts');
            }
            return response.json();
        })
        .then(posts => {
            if (posts) {
                dispatch(setMyPosts(posts));
            }
        })
        .catch(error => {
            console.error('Error fetching your posts:', error);
        });
    }, [avatar, status]);

     if (allMyPosts.length === 0) {
        return (
            <Row className='justify-content-center mt-4'>
                <Col xs={12} md={6} className="text-center">
                    <h4>You do not have any post</h4>
                </Col>
            </Row>
        );
     }

    return (
        <Row className='my-4'>
            {allMyPosts.map((post, index) => (
                <Col key={index} xs={12} md={6} className="mb-2">
                    <Cardz
                        post={post}
                    />
                </Col>
            ))}
        </Row>
    );
}

export default RenderMyPosts;