import { Typography } from "@mui/material";
import AdminSideNav from "./AdminSideNav";
import { useParams } from "react-router";

function Admin() {
    const { id } = useParams();
    console.log("Admin id from (Admin.js)", id)
    return (
        <>
        <Typography>Admin Page</Typography>
        <AdminSideNav id={id}/>
        </>
    )
}

export default Admin;