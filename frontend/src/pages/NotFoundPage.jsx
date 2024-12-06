import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";

const NotFoundPage = () => {

    return (
        <Container className='d-flex flex-column gap-2'>
            <h1>404 Not Found</h1>
            <Link to='/'>LoginPage</Link>
            <Link to='/home'>HomePage</Link>
            <Link to='/myprofile'>MyProfilePage</Link>
            <Link to='/profile'>ProfilePage</Link>
        </Container>

    );
}

export default NotFoundPage;