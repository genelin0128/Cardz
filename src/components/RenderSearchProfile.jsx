import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserProfileCardz from "./UserProfileCardz";

const RenderSearchProfile = () => {
    const [searchProfiles, setSearchProfiles] = useState([]);
    const location = useLocation();
    const searchQuery = location.state?.query || '';

    useEffect(() => {
        // fetch profile
        const fetchSearchProfiles = async () => {
            try {

                // fetch all users for user information
                const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await usersResponse.json();

                const filteredPosts = users.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setSearchProfiles(filteredPosts);
            }
            catch (error) {
                console.error('Error fetching search profiles:', error);
            }
        };

        if (searchQuery) {
            fetchSearchProfiles();
        }
    }, [searchQuery]);

    if (searchProfiles.length === 0) {
        return (
            <Row className="justify-content-center mt-4">
                <Col lg={10} className="text-center">
                    <h4>No matched user found for "{searchQuery}"</h4>
                </Col>
            </Row>
        );
    }

    return (
        searchProfiles.map((user, index) => (
            <UserProfileCardz key={index} userId={user.id} />
        ))
    );
}

export default RenderSearchProfile;