import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    myPosts: [],
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {

        setMyPosts: (state, action) => {
            state.myPosts = action.payload;
        },
        addNewPost: (state, action) => {
            state.myPosts.unshift(action.payload);
        },
        deletePost: (state, action) => {
            state.myPosts = state.myPosts.filter(post => post.postId !== action.payload);
        },
        updatePost: (state, action) => {
            const { postId, postContent, images } = action.payload;
            const updatedPost = state.myPosts.find(post => post.postId === postId);
            if (updatedPost) {
                updatedPost.postContent = postContent;
                updatedPost.images = images;
            }
        },
        clearPosts: (state) => {
            Object.assign(state, initialState);
        }
    },
});

export const { setMyPosts, addNewPost, deletePost, updatePost, clearPosts } = postSlice.actions;
export default postSlice.reducer;