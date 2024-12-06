import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { followUser } from "../slices/userSlice";

const UserFollowSearchBar = () => {
    const dispatch = useDispatch();
    const [searchUser, setSearchUser] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const currentUser = useSelector(state => state.user.profile.username);

    const handleFollow = async () => {
        if (searchUser.trim().toLowerCase() === currentUser.trim().toLowerCase()) {
            setSearchUser('');
            setErrorMessage('You cannot follow yourself.');
            return;
        }


        fetch(`${process.env.REACT_APP_API_URL}/followingUsers/followUser/${searchUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    setSearchUser('');
                    setErrorMessage(`No such user: ${searchUser}`);
                    throw new Error(`No such user: ${searchUser}`);
                }
                throw new Error(`Failed to follow ${searchUser}`);
            }
            dispatch(followUser(searchUser));
            setSearchUser('');
            return response.json();
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    };

    return (
        <Row>
            <Form className="d-flex gap-2 mb-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFollow();
                  }}
            >
                <Form.Control
                    type="text"
                    placeholder="Enter username to follow."
                    value={searchUser}
                    onChange={(e) => {
                        setSearchUser(e.target.value);
                        setErrorMessage('');
                    }}
                />
                <Button
                    variant="primary"
                    onClick={handleFollow}
                    disabled={searchUser.length === 0}
                >
                    Follow
                </Button>
            </Form>

            {errorMessage && (
                <div className="text-danger mx-2">
                    {errorMessage}
                </div>
            )}
        </Row>
    );
};

export default UserFollowSearchBar;