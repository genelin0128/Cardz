import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatarPreview } from '../slices/userSlice';

const AvatarInSettingModal = () => {

    const [isHovered, setIsHovered] = useState(false);
    const userAvatar = useSelector(state => state.user.profile.userAvatar);
    const userAvatarPreview = useSelector(state => state.user.profile.userAvatarPreview);
    const currentImage = userAvatarPreview || userAvatar;
    const dispatch = useDispatch();

    const avatarContainer = {
        width: '150px',
        height: '150px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const avatar = {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${currentImage})`,
        transition: 'opacity 0.3s',
        opacity: isHovered ? 0.7 : 1,
    };

    const overlayText = {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        whiteSpace: 'nowrap',
        borderRadius: '50%'
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(setAvatarPreview(e.target.result));
            };
            reader.readAsDataURL(file);
        }
        else {
            alert('Please select an image file.');
        }
    };

    return (
        <div
            style={avatarContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                style={{display: 'none'}}
                id='avatar-upload'
            />
            <label htmlFor='avatar-upload' style={{cursor: 'pointer'}}>
                <div style={avatar}></div>
                <div style={overlayText}>Change Avatar</div>
            </label>
        </div>
    );
}

export default AvatarInSettingModal;