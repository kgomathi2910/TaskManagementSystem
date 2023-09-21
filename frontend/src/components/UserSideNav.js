import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';

function UserSideNav({ id }) {
  console.log("id from user side nav", id)
  return (
    <Drawer variant="permanent" anchor="left">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">User Page</Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem component={Link} to={`/userDashboard/${id}`}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to={`/userTasks/${id}`}>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem component={Link} to={`/userProfile/${id}`}>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem component={Link} to={`/login`}>
          <ListItemText primary="Logout"/>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default UserSideNav;
