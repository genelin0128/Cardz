import React, { useEffect } from 'react';
import Cardz from "./Cardz";
import {useDispatch, useSelector} from "react-redux";
import {setMyPosts} from "../slices/postsSlice";

const RenderMyPosts = () => {
    const dispatch = useDispatch();
    const avatar = useSelector(state => state.user.profile.userAvatar);
    const userId = useSelector(state => state.user.profile.userId);
    const username = useSelector(state => state.user.profile.username);
    const status = useSelector(state => state.user.profile.status);
    const myPosts = useSelector(state => state.posts.myPosts);

    useEffect(() => {
        if (userId) {
            fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
                .then(response => response.json())
                .then(postsData => {
                    const formattedPosts = postsData.map(post => ({
                        postUserAvatar: avatar,
                        postId: `${username}_${post.id}`,
                        postUsername: username,
                        postUserStatus: status,
                        postUserId: userId,
                        postContent: post.body,
                        images: [],
                        postTimeStamp: new Date().toISOString(),
                        likes: 0,
                        comments: []
                    }))
                    .reverse();

                    dispatch(setMyPosts(formattedPosts));
                })
        }
    }, [userId]);

    useEffect(() => {
        if (myPosts.length > 0) {
            const updatedPosts = myPosts.map(post => ({
                ...post,
                postUserAvatar: avatar,
                postUsername: username,
                postUserStatus: status,
            }));
            dispatch(setMyPosts(updatedPosts));
        }
    }, [avatar, username, status]);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {myPosts.map((post, index) => (
                <div key={index} style={{ flex: '0 1 48%', margin: '1%' }}>
                    <Cardz post={post} />
                </div>
            ))}
        </div>
    );
}

export default RenderMyPosts;