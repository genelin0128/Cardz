import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Cardz from "./Cardz";

const RenderSearchPosts = () => {
    const [searchPosts, setSearchPosts] = useState([]);
    const location = useLocation();
    const searchQuery = location.state?.query || '';
    const avatar = '/img/avatar-guest.png';

    useEffect(() => {
        // fetch post
        const fetchSearchPosts = async () => {
            try {

                // fetch all users for user information
                const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await usersResponse.json();

                const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
                const posts = await postsResponse.json();

                // merge user data with post data
                const mergedPosts = posts.map(post => {
                    const user = users.find(u => u.id === post.userId);
                    return {
                        ...post,
                        username: user.username,
                        status: user.company.catchPhrase
                    };
                });

                const filteredPosts = mergedPosts.filter(post =>
                    post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                const formattedPosts = filteredPosts.map(post => ({
                    postUserAvatar: avatar,
                    postId: `${post.username}_${post.id}`,
                    postUsername: post.username,
                    postUserStatus: post.status,
                    postUserId: post.userId,
                    postContent: post.body,
                    images: [],
                    postTimeStamp: new Date().toISOString(),
                    likes: 0,
                    comments: []
                }));

                setSearchPosts(formattedPosts);
            }
            catch (error) {
                console.error('Error fetching search posts:', error);
            }
        };

        if (searchQuery) {
            fetchSearchPosts();
        }
    }, [searchQuery]);

    if (searchPosts.length === 0) {
        return (
            <Row className="justify-content-center mt-4">
                <Col lg={10} className="text-center">
                    <h4>No matched post found for "{searchQuery}"</h4>
                </Col>
            </Row>
        );
    }

    return (
        searchPosts.map((post, index) => (
            <Row key={`post-${index}`} className='justify-content-center'>
                <Col lg={10} sm={12} className='p-0'>
                    <Cardz post={post} />
                </Col>
            </Row>
        ))
    );
}

export default RenderSearchPosts;