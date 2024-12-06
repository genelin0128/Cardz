import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyProfilePage from './pages/MyProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import store, { persistor } from './store';
import {PersistGate} from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <Router>
                  <Routes>
                      <Route exact path='/' element={<LoginPage />} />
                      <Route exact path='/home' element={<HomePage />} />
                      <Route exact path='/myprofile' element={<MyProfilePage />} />
                      <Route exact path='/profile' element={<ProfilePage />} />
                      <Route exact path='/searchresults' element={<SearchResultsPage />} />
                      <Route exact path='*' element={<NotFoundPage />} />
                  </Routes>
              </Router>
          </PersistGate>
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
