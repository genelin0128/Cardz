import React, {useEffect, useState} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Cardz from "./Cardz";
import {useSelector} from "react-redux";

const RenderFollowingPosts = () => {
    const [followingPosts, setFollowingPosts] = useState([]);
    const followingUserIds = useSelector(state => state.user.profile.followingUserId);

    const avatar = '/img/avatar-guest.png';

    useEffect(() => {
        // fetch following posts
        const fetchFollowingPosts = async () => {
            try {

                // fetch all users
                const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await usersResponse.json();

                // only fetch three posts for each followed user
                const followingPostsPromises = followingUserIds.map(userId =>
                    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_limit=3`)
                        .then(response => response.json())
                );

                const fetchedPosts = await Promise.all(followingPostsPromises);

                const formattedPosts = fetchedPosts.flat().map(post => {
                    const user = users.find(user => user.id === post.userId);
                    return {
                        postUserAvatar: avatar,
                        postId: `${user.username}_${post.id}`,
                        postUsername: user.username,
                        postUserStatus: user.company.catchPhrase,
                        postUserId: post.userId,
                        postContent: post.body,
                        images: [],
                        postTimeStamp: new Date().toISOString(),
                        likes: 0,
                        comments: []
                    };
                });

                setFollowingPosts(formattedPosts);
            }
            catch (error) {
                console.error('Error fetching following posts:', error);
            }
        };

        fetchFollowingPosts();
    }, [followingUserIds]);




    return (
        followingPosts.map((post, index) => (
            <Row key={`post-${index}`} className='justify-content-center'>
                <Col lg={10} sm={12} className='p-0'>
                    <Cardz post={post} />
                </Col>
            </Row>
        ))
    );
}

export default RenderFollowingPosts;