import React from 'react';
import { BsPlusCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import {useDispatch, useSelector} from "react-redux";
import {followUser, unfollowUser} from "../slices/userSlice";

const AvatarInCardz = ({ avatarImage, username }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const loggedInUsername = useSelector((state) => state.user.profile.username);

    const followingUsers = useSelector(state => state.user.profile.followingUsers);
    const isFollowing = followingUsers.includes(username);

    const avatarContainer = {
        width: '60px',
        height: '60px',
        position: 'relative',
    }

    const avatar = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${avatarImage})`,
    };

    const followBtnContainer = {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        top: '80%',
        width: '100%',
    };

    const followBtn = {
        fontSize: '13px',
        zIndex: 1,
        cursor: 'pointer',
    };

    const handleFollowAndUnfollow = async () => {
        if (isFollowing) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/followingUsers/unfollowUser/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to unfollow ${username}`);
            }
            dispatch(unfollowUser(username));
        }
        else {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/followingUsers/followUser/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to follow ${username}`);
            }
            dispatch(followUser(username));
        }
    };

    return (
        <div style={avatarContainer}>
            <div style={avatar}></div>
                {(isLoggedIn && loggedInUsername !== username) && (
                    <div style={followBtnContainer}>
                        <div
                            style={followBtn}
                            onClick={e => {
                                e.stopPropagation();
                                handleFollowAndUnfollow();
                            }}
                        >
                            {isFollowing ? (
                                <BsCheckCircleFill style={{ color: 'green' }} />
                            ) : (
                                <BsPlusCircleFill style={{ color: 'red' }} />
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default AvatarInCardz;