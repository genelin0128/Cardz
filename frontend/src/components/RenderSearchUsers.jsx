import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserProfileCardz from "./UserProfileCardz";
import { Pagination } from "react-bootstrap";

const RenderSearchUsers = () => {
    const [searchUsers, setSearchUsers] = useState([]);
    const location = useLocation();
    const searchQuery = location.state?.query || '';

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        // fetch user
        fetch(`${process.env.REACT_APP_API_URL}/profile/search/${searchQuery}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    setSearchUsers([]);
                    throw new Error(`No matched user found for "${searchQuery}"`);
                }
                throw new Error('Error fetching users');
            }
            return response.json();
        })
        .then(users => {
            if (users) {
                setSearchUsers(users);
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }, [searchQuery]);

    const indexOfFirstUser = usersPerPage * (currentPage - 1);
    const indexOfLastUser = indexOfFirstUser + usersPerPage;
    const currentDisplayUsers = searchUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(searchUsers.length / usersPerPage);        // ex: 87 posts should have 9 pages

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }


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
        <>
            {currentDisplayUsers.map((user, index) => (
                <Row key={`user-${index}`} className='justify-content-center'>
                    <Col lg={10} sm={12} className='p-0'>
                        <UserProfileCardz key={index} username={user.username} />
                    </Col>
                </Row>
            ))}

            <Row className="justify-content-center mt-3">
                <Col>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        />
                        {paginationItems}
                        <Pagination.Next
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>
        </>
    );
}

export default RenderSearchUsers;