import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    myPosts: [],
    followingPosts: [],
    hotPosts: [],
    searchPosts: [],
    cardzModalCloseStatus: true,        // true: close, false: open
    refresh: 0
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {

        setMyPosts: (state, action) => {
            state.myPosts = action.payload;
        },
        setFollowingPosts: (state, action) => {
            state.followingPosts = action.payload;
        },
        setHotPosts: (state, action) => {
            state.hotPosts = action.payload;
        },
        setSearchPosts: (state, action) => {
            state.searchPosts = action.payload;
        },
        addNewPost: (state, action) => {
            state.myPosts.unshift(action.payload);
            state.followingPosts.unshift(action.payload);
            state.hotPosts.unshift(action.payload);
        },
        deletePost: (state, action) => {
            state.myPosts = state.myPosts.filter(post => post._id !== action.payload);
            state.followingPosts = state.followingPosts.filter(post => post._id !== action.payload);
            state.hotPosts = state.hotPosts.filter(post => post._id !== action.payload);
            state.searchPosts = state.searchPosts.filter(post => post._id !== action.payload);
        },
        updatePost: (state, action) => {
            const { _id, body, images } = action.payload;

            const updatedPostInMyPosts = state.myPosts.find(post => post._id === _id);
            if (updatedPostInMyPosts) {
                updatedPostInMyPosts.body = body;
                updatedPostInMyPosts.images = images;
            }
            const updatedPostInFollowingPosts = state.followingPosts.find(post => post._id === _id);

            if (updatedPostInFollowingPosts) {
                updatedPostInFollowingPosts.body = body;
                updatedPostInFollowingPosts.images = images;
            }

            const updatedPostInHotPosts = state.hotPosts.find(post => post._id === _id);
            if (updatedPostInHotPosts) {
                updatedPostInHotPosts.body = body;
                updatedPostInHotPosts.images = images;
            }

            const updatedPostInSearchPosts = state.searchPosts.find(post => post._id === _id);
            if (updatedPostInSearchPosts) {
                updatedPostInSearchPosts.body = body;
                updatedPostInSearchPosts.images = images;
            }
        },
        updatePostUps: (state, action) => {
            const { _id, ups } = action.payload;

            const updatedPostInMyPosts = state.myPosts.find(post => post._id === _id);
            if (updatedPostInMyPosts) {
                updatedPostInMyPosts.ups = ups;
            }

            const updatedPostInFollowingPosts = state.followingPosts.find(post => post._id === _id);
            if (updatedPostInFollowingPosts) {
                updatedPostInFollowingPosts.ups = ups;
            }

            const updatedPostInHotPosts = state.hotPosts.find(post => post._id === _id);
            if (updatedPostInHotPosts) {
                updatedPostInHotPosts.ups = ups;
            }

            const updatedPostInSearchPosts = state.searchPosts.find(post => post._id === _id);
            if (updatedPostInSearchPosts) {
                updatedPostInSearchPosts.ups = ups;
            }
        },
        clearPosts: (state) => {
            Object.assign(state, initialState);
        },
        toggleCardzModalCloseStatus: (state) => {
            state.cardzModalCloseStatus = !state.cardzModalCloseStatus ;
        },
        refreshComments: (state) => {
            state.refresh += 1;
        }
    },
});

export const { setMyPosts, setFollowingPosts, setHotPosts, setSearchPosts, addNewPost, deletePost, updatePost, clearPosts, toggleCardzModalCloseStatus, refreshComments, updatePostUps } = postSlice.actions;
export default postSlice.reducer;