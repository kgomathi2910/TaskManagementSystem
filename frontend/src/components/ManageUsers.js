import React from 'react';
import { Typography } from '@mui/material';
import SideNav from './AdminSideNav';

function ManageUsers() {
    return (
        <div>
            <SideNav />
            <Typography variant="h4">Manage Users</Typography>
        </div>
    );
}

export default ManageUsers;
