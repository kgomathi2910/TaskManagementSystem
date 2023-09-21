import { React, useState } from 'react';
import AdminSideNav from './AdminSideNav';
import { useParams } from "react-router";

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUsersAction, changeAdminStatusAction, fetchTaskCounts } from '../actions/actions';

import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Box,
    Paper,
    TablePagination
} from '@mui/material';

function ManageUsers() {
    const { id } = useParams();
    const users = useSelector((state) => state.user.users);
    const dispatch = useDispatch();

    const sty = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        dispatch(getUsersAction()); // call redux action
    }, [dispatch]);

    const handleToggleAdminStatus = (id, isAdmin) => {
        dispatch(changeAdminStatusAction(id, isAdmin)); // call redux action
    };


    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    return (
        <div>
            <AdminSideNav id={id} />
            <Box sx={sty}>
                <Typography variant="h5">Manage Users</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email ID</TableCell>
                                <TableCell>Tasks Assigned</TableCell>
                                <TableCell>Tasks In Progress</TableCell>
                                <TableCell>Tasks Done</TableCell>
                                <TableCell>Is Admin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // for pagination
                            .map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.taskCounts?.assigned || 0}</TableCell>
                                    <TableCell>{user.taskCounts?.inProgress || 0}</TableCell>
                                    <TableCell>{user.taskCounts?.done || 0}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                handleToggleAdminStatus(user.id, !user.is_admin)
                                            }
                                        >
                                            {user.is_admin ? 'Demote' : 'Promote'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination 
                    rowsPerPageOptions={[5, 10, 20]} 
                    component="div"
                    count={users.length} // Total number of rows
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <br />
                <Typography>Refresh the page to see the changes</Typography>
            </Box>
        </div>
    );
}

export default ManageUsers;

