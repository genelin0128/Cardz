import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserProfileCardz from "./UserProfileCardz";

const RenderSearchUsers = () => {
    const [searchUsers, setSearchUsers] = useState([]);
    const location = useLocation();
    const searchQuery = location.state?.query || '';

    useEffect(() => {
        // fetch user
        const fetchSearchUsers = async () => {
            try {

                // fetch all users for user information
                const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await usersResponse.json();

                const filteredUsers = users.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setSearchUsers(filteredUsers);
            }
            catch (error) {
                console.error('Error fetching search users:', error);
            }
        };

        if (searchQuery) {
            fetchSearchUsers();
        }
    }, [searchQuery]);

    if (searchUsers.length === 0) {
        return (
            <Row className="justify-content-center mt-4">
                <Col lg={10} sm={12} className="text-center">
                    <h4>No matched user found for "{searchQuery}"</h4>
                </Col>
            </Row>
        );
    }

    return (
        searchUsers.map((user, index) => (
            <Row key={`user-${index}`} className='justify-content-center'>
                <Col lg={10} sm={12} className='p-0'>
                    <UserProfileCardz key={index} userId={user.id} />
                </Col>
            </Row>
        ))
    );
}

export default RenderSearchUsers;