import React from 'react';
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import { useSelector } from "react-redux";
import UserProfileCardz from "./UserProfileCardz";
import UserFollowSearchBar from "./UserFollowSearchBar";

const FollowingListInOffcanvas = ({ show, handleClose }) => {

    const followingUsers = useSelector(state => state.user.profile.followingUsers);

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
        >
            <OffcanvasHeader closeButton>
                <OffcanvasTitle>Following List</OffcanvasTitle>
            </OffcanvasHeader>
            <OffcanvasBody>

                <UserFollowSearchBar />

                {followingUsers.length !== 0 ? (
                    followingUsers.map(username => (
                        <UserProfileCardz key={username} username={username} />
                    ))
                ) : (
                    <p>No following users</p>
                )}
            </OffcanvasBody>
        </Offcanvas>
    );
}

export default FollowingListInOffcanvas;