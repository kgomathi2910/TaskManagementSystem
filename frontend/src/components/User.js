import { useParams } from "react-router";
import UserSideNav from './UserSideNav';

function User() {
    const { id } = useParams();
    console.log("User id from (User.js)", id)
    return (
        <>
            <h1>Welcome to the User Page</h1>
            <UserSideNav id={id} />
        </>
    )
}

export default User;