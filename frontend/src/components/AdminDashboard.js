import React from 'react';
import AdminSideNav from './AdminSideNav';
import { Typography } from '@mui/material';

function AdminDashboard() {
    return (
        <div>
            <AdminSideNav />
            <Typography variant="h4">Dashboard</Typography>
        </div>
    );
}

export default AdminDashboard;
