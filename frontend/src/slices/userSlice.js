import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    errorMessage: null,
    profile: {
        userAvatar: '',
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
        salt: '',
        status: '',
        followingUsers: [],
        thirdParty: {}
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
            const usernameToFollow = action.payload;
            if (!state.profile.followingUsers.includes(usernameToFollow)) {
                state.profile.followingUsers.push(usernameToFollow);
            }
        },

        unfollowUser: (state, action) => {
            const usernameToFollow = action.payload;
            state.profile.followingUsers = state.profile.followingUsers.filter(id => id !== usernameToFollow);
        }
    }
});

export const { login, logout, setErrorMessage, updateAvatar, setAvatarPreview, updateProfile, setStatus, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;