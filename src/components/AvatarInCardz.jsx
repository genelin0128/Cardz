import React, { useState } from 'react';
import { BsPlusCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import {useDispatch, useSelector} from "react-redux";
import {followUser, unfollowUser} from "../slices/userSlice";

const AvatarInCardz = ({ avatarImage, userId }) => {
    const dispatch = useDispatch();

    const loggedInUserId = useSelector((state) => state.user.profile.userId);

    const followingUserIds = useSelector(state => state.user.profile.followingUserId);
    const isFollowing = followingUserIds.includes(userId);

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

    const handleFollowAndUnfollow = () => {
        if (isFollowing) {
            dispatch(unfollowUser(userId));
        }
        else {
            dispatch(followUser(userId));
        }
    };

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    return (
        <div style={avatarContainer}>
            <div style={avatar}></div>
                { (isLoggedIn && loggedInUserId !== userId) && (
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