import React from 'react';
import { Typography } from '@mui/material';
import AdminSideNav from './AdminSideNav';

function AdminProfile() {
    return (
        <div>
            <AdminSideNav />
            <Typography variant="h4">Profile</Typography>
        </div>
    );
}

export default AdminProfile;
