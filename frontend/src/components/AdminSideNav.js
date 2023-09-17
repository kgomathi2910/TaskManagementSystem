import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';

function AdminSideNav() {
  return (
    <Drawer variant="permanent" anchor="left">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Admin Page</Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem component={Link} to="/adminDashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/adminTasks">
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem component={Link} to="/manageUsers">
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem component={Link} to="/adminProfile">
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default AdminSideNav;
