import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    Button,
    TextField,
    Box,
    Paper
} from '@mui/material';
import UserSideNav from './UserSideNav';

function UserProfile() {
    const { id } = useParams();
    console.log("User id from (User.js)", id)
    const [userData, setUserData] = useState([]); // contains user data of the logged in user (read-only)
    const [isModalOpen, setIsModalOpen] = useState(false); // modal for Edit Profile
    const [userEdit, setUserEdit] = useState({}); // Store the user (edit information)

    const handleOpenModal = (user) => {
        console.log("user to be editted: ", user)
        setUserEdit(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setUserEdit(null);
        setIsModalOpen(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

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
        const getUserData = async () => {
            const reqData = await fetch(`http://localhost:8081/getUser/${id}`);
            console.log("Fetched user", reqData);
            const resData = await reqData.json();
            console.log("Fetched user response", resData);
            setUserData(resData.users);
            console.log("UserData: ", userData);
        };
        getUserData();
    }, []);

    useEffect(() => {
        console.log("UserData has changed:", userData);
    }, [userData]);


    const editUserHandler = async () => {
        try {
            if (!userEdit) {
                console.error('No user selected for editing');
                return;
            }

            const { id, username, password, email, is_admin } = userEdit;

            const edittedUser = {
                username,
                password,
                email
            };

            const response = await fetch(`http://localhost:8081/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(edittedUser),
            });

            if (response.ok) {
                handleCloseModal();
            } else {
                console.error('Edit user failed');
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <React.Fragment>
            <UserSideNav id={id} />
            <Box sx={sty}>
                <Typography variant="h5">Profile</Typography>

                <Paper style={{ width: '100%' }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Password</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Is admin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(userData) && userData.length > 0 ? (
                                    userData.map((user) => (
                                        <TableRow key={user.id} onClick={() => handleOpenModal(user)}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.password}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.is_admin}</TableCell>
                                        </TableRow>
                                    ))) : (
                                    <TableRow>
                                        <TableCell>No user found!</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <br /><br />
                <Typography>Click the row to edit the Profile details</Typography>
            </Box>


            {/* Edit user details */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={style}>
                    <div>
                        <Typography variant="h6">Edit Profile</Typography>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={userEdit?.username || ''}
                            onChange={(e) =>
                                setUserEdit({
                                    ...userEdit,
                                    username: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant='outlined'
                            fullWidth
                            margin="normal"
                            value={userEdit?.password || ''}
                            onChange={(e) =>
                                setUserEdit({
                                    ...userEdit,
                                    password: e.target.value,
                                })
                            }
                        />
                        <TextField
                            type="email"
                            variant='outlined'
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={userEdit?.email || ''}
                            onChange={(e) =>
                                setUserEdit({
                                    ...userEdit,
                                    email: e.target.value,
                                })
                            }
                        />
                        <TextField
                            variant='outlined'
                            label="Is Admin"
                            fullWidth
                            margin="normal"
                            value={userEdit?.is_admin || 0}
                            disabled
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editUserHandler}
                            style={{ marginTop: '16px' }}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </Box>
            </Modal>

        </React.Fragment>
    );
}

export default UserProfile;