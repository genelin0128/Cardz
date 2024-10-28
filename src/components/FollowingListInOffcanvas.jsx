import React from 'react';
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import { useSelector } from "react-redux";
import UserProfileCardz from "./UserProfileCardz";
import UserFollowSearchBar from "./UserFollowSearchBar";

const FollowingListInOffcanvas = ({ show, handleClose }) => {

    const followingUserIds = useSelector(state => state.user.profile.followingUserId);

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

                {followingUserIds.length !== 0 ? (
                    followingUserIds.map(userId => (
                        <UserProfileCardz key={userId} userId={userId} />
                    ))
                ) : (
                    <p>No following users</p>
                )}
            </OffcanvasBody>
        </Offcanvas>
    );
}

export default FollowingListInOffcanvas;