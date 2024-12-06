import Header from '../components/Header';
import UnauthorizedAccessPage from "./UnauthorizedAccessPage";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import LogIn from "../components/LogIn";
import SignUp from "../components/SignUp";
import Container from "react-bootstrap/Container";

// 設定點選其他人的profile參考影片
// https://www.youtube.com/watch?v=oTIJunBa6MA&ab_channel=CosdenSolutions
// 10:58
const ProfilePage = () => {

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    return (
        <div>
            <Header />
            {isLoggedIn === true ? (
                <Container>
                    <h1>This is ProfilePage!</h1>
                </Container>
            ) : (
                <UnauthorizedAccessPage />
            )}

        </div>
    );
}

export default ProfilePage;