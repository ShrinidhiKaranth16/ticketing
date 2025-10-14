import axios from 'axios';
import buildClient from '../api/build-client';

const HomePage = ({ currentUser }) => {
    return currentUser ? (
        <h1>Current User: {currentUser.email}</h1>
    ) : (
        <h1>No current user</h1>
    );
}

HomePage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const response = await client.get('/api/users/currentuser');
    return { currentUser: response.data.currentUser };
}
export default HomePage;
