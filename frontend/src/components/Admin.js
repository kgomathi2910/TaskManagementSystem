import AdminSideNav from "./AdminSideNav";
import { useParams } from "react-router";

function Admin() {
    const { id } = useParams();
    console.log("Admin id from (Admin.js)", id)
    return (
        <>
            <h1>Welcome to the Admin Page</h1>
            <AdminSideNav id={id} />
        </>
    )
}

export default Admin;