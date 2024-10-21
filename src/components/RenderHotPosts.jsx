import React, {useEffect, useState} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Cardz from "./Cardz";

const RenderHotPosts = () => {
    const [hotPosts, setHotPosts] = useState([]);

    const avatar = '/img/avatar-guest.png';

    useEffect(() => {
        // Fetch hot posts (currently is random)
        const fetchRandomPosts = async () => {
            try {
                const randomPostIds = [];
                while (randomPostIds.length < 20) {
                    const randomId = Math.floor(Math.random() * 100) + 1;
                    if (!randomPostIds.includes(randomId)) {
                        randomPostIds.push(randomId);
                    }
                }

                // Fetch all users
                const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await usersResponse.json();

                const randomPostsPromises = randomPostIds.map(id =>
                    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
                        .then(response => response.json())
                );

                const fetchedPosts = await Promise.all(randomPostsPromises);

                const formattedPosts = fetchedPosts.map(post => {
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

                setHotPosts(formattedPosts);
            }
            catch (error) {
                console.error('Error fetching random posts:', error);
            }
        };

        fetchRandomPosts();
    }, []);

    return hotPosts.map((post, index) => (
        <Row key={`post-${index}`} className='justify-content-center'>
            <Col lg={10} sm={12} className='p-0'>
                <Cardz post={post} />
            </Col>
        </Row>
    ));
}

export default RenderHotPosts;