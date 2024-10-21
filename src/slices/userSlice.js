import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    errorMessage: null,

    profile: {
        userAvatar: '/img/avatar-guest.png',
        userAvatarPreview: null,
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        zipcode: '',
        username: '',
        password: '',
        passwordConfirmation: '',
        status: '',
        followingUserId: []
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
            state.errorMessage = null;
        },

        logout: (state) => {
            Object.assign(state, initialState);
        },

        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },

        updateAvatar: (state, action) => {
            state.profile.userAvatar = action.payload;
            state.profile.userAvatarPreview = null;
        },

        setAvatarPreview: (state, action) => {
            state.profile.userAvatarPreview = action.payload;
        },

        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },

        setStatus: (state, action) => {
            state.profile.status = action.payload;
        },

        followUser: (state, action) => {
            const userIdToFollow = action.payload;
            if (!state.profile.followingUserId.includes(userIdToFollow)) {
                state.profile.followingUserId.push(userIdToFollow);
            }
        },

        unfollowUser: (state, action) => {
            const userIdToUnfollow = action.payload;
            state.profile.followingUserId = state.profile.followingUserId.filter(id => id !== userIdToUnfollow);
        }
    }
});


export const { login, logout, setErrorMessage, updateAvatar, setAvatarPreview, updateProfile, setStatus, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;