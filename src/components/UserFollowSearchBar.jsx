import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { followUser } from "../slices/userSlice";

const UserFollowSearchBar = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
    }, [])

    const handleFollow = () => {
        const user = users.find(
            (user) => user.username.toLowerCase() === searchUser.trim().toLowerCase()
        );

        if (user) {
            dispatch(followUser(user.id));
            setSearchUser('');
            setErrorMessage('');
        }
        else {
            setSearchUser('');
            setErrorMessage(`No such user: ${searchUser}`);
        }
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