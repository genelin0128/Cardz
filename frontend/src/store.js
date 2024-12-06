// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './slices/userSlice';
// import postsReducer from './slices/postsSlice';
//
// const store = configureStore({
//     reducer: {
//         user: userReducer,
//         posts: postsReducer,
//     }
// });
//
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postsReducer from './slices/postsSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;

