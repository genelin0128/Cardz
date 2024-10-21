import React, { useState } from 'react';
import { BsPlusCircleFill, BsCheckCircleFill } from 'react-icons/bs';

const UserAvatarInComment = ({userAvatarImage}) => {

    const [isFollowing, setIsFollowing] = useState(false);

    const avatarContainer = {
        width: '35px',
        height: '35px',
        position: 'relative',
    }

    const avatar = {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${userAvatarImage})`,
    };

    const followBtnContainer = {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        top: '79%',
        width: '100%',
    };

    const followBtn = {
        fontSize: '8px',
        zIndex: 1,
        cursor: 'pointer',
    };

    const follow = () => {
        setIsFollowing(prevState => !prevState);
    };

    return (
        <div style={avatarContainer}>
            <div style={avatar}></div>
            <div style={followBtnContainer}>
                <div
                    style={followBtn}
                    onClick={e => {
                        e.stopPropagation();
                        follow();
                    }}
                >
                    {isFollowing ? (
                        <BsCheckCircleFill style={{ color: 'green' }} />
                    ) : (
                        <BsPlusCircleFill style={{ color: 'red' }} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserAvatarInComment;