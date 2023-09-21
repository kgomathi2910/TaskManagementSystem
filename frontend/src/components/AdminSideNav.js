import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';

function AdminSideNav({ id }) {
  console.log("id from admin side nav", id)
  return (
    <Drawer variant="permanent" anchor="left">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Admin Page</Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem component={Link} to={`/adminDashboard/${id}`}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to={`/adminTasks/${id}`}>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem component={Link} to={`/manageUsers/${id}`}>
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem component={Link} to={`/adminProfile/${id}`}>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem component={Link} to={`/login`}>
          <ListItemText primary="Logout"/>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default AdminSideNav;
