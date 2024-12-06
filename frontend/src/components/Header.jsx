import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/userSlice";
import SettingModal from "./SettingModal";
import FollowingListInOffcanvas from "./FollowingListInOffcanvas";
import { clearPosts } from "../slices/postsSlice";
import { persistStore } from 'redux-persist';
import store from '../store'

const Header = () => {

    const avatarImage = useSelector(state => state.user.profile.userAvatar);

    const [showSettingModal, setShowSettingModal] = useState(false);

    const handleCardzModalOpen = () => {
        setShowSettingModal(true);
    }

    const handleCardzModalClose = () => {
        setShowSettingModal(false);
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const user = useSelector(state => state.user.profile.username);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleLogOut = async () => {
        try{

            dispatch(logout());
            dispatch(clearPosts());

            await persistStore(store).purge();

            await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'PUT',
                credentials: 'include'
            });
            navigate('/');

        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    }

    const [showFollowingListInOffcanvas, setShowFollowingListInOffcanvas] = useState(false);
    const handleFollowingListInOffcanvasOpen = () => {
        setShowFollowingListInOffcanvas(true);
    }

    const handleFollowingListInOffcanvasClose = () => {
        setShowFollowingListInOffcanvas(false);
    }

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/searchresults', {
                state: { query: searchQuery }
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const searchContainerStyle = {
        flex: 1,
        marginLeft: 0,
        '@media (min-width: 768px)': {
            marginLeft: '100px'
        }
    }

    return (
        <>
            <style>
                {`
                    .search-container {
                        flex: 1;
                        margin-left: 0;
                    }
                    @media (min-width: 768px) {
                        .search-container {
                            margin-left: 100px;
                        }
                    }
                `}
            </style>
            <Navbar expand='md' bg='primary' variant='dark' sticky="top" style={{minHeight: '75px'}}>
                <Container>
                    <Navbar.Brand as={isLoggedIn ? Link : 'div'} to={isLoggedIn ? '/home' : '#'}>
                        <div className='d-flex align-items-center'>
                            <img
                                alt='icon'
                                src='/img/cardz-icon.png'
                                width='50'
                                height='50'
                                className='d-inline-block align-center'
                            />
                            Cardz
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls='header-navbar'/>
                    <Navbar.Collapse id='header-navbar'>
                        <div className="d-flex justify-content-center search-container">
                            {isLoggedIn && (
                                <Form inline onSubmit={handleSearch}>
                                    <InputGroup>
                                        <Form.Control
                                            type='Text'
                                            placeholder='Search'
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                        <InputGroup.Text>
                                            <Button
                                                variant='primary'
                                                type='submit'
                                                className='d-flex'
                                            >
                                                <BsSearch/>
                                            </Button>
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form>
                            )}
                        </div>

                        <Nav className='ml-auto'>
                            {isLoggedIn && (
                                <>
                                    <Nav.Link className='mx-1' as={Link} to='/home'>Home</Nav.Link>
                                    <Nav.Link className='mx-1' as={Link} to='/myprofile'>Profile</Nav.Link>
                                </>
                            )}

                            {isLoggedIn ? (
                                <NavDropdown
                                    className='ms-1'
                                    title={
                                        <>
                                            <img
                                                src={avatarImage}
                                                alt="User avatar"
                                                style={{
                                                    width: '25px',
                                                    height: '25px',
                                                    borderRadius: '50%',
                                                    marginRight: '8px',
                                                    objectFit: 'cover',
                                                    border: '1px solid white'
                                                }}
                                            />
                                            <span>{`${user}`}</span>
                                        </>
                                    }
                                    id='header-dropdown'
                                    drop='down'
                                    align='end'
                                >
                                    <NavDropdown.Item onClick={handleCardzModalOpen}>Settings</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item onClick={handleFollowingListInOffcanvasOpen}>Following User</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Navbar.Text className='ms-2'>Guest</Navbar.Text>
                            )}
                        </Nav>

                    </Navbar.Collapse>
                </Container>
                {isLoggedIn && (
                    <>
                        <SettingModal
                            show={showSettingModal}
                            handleClose={handleCardzModalClose}
                        />
                        <FollowingListInOffcanvas
                            show={showFollowingListInOffcanvas}
                            handleClose={handleFollowingListInOffcanvasClose}
                        />
                    </>
                )}
            </Navbar>
        </>
    );
}

export default Header;