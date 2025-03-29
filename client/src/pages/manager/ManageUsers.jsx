// File: client/src/pages/manager/ManageUsers.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

const dummyUsers = [
  { id: 1, email: "user1@example.com", status: "active" },
  { id: 2, email: "user2@example.com", status: "locked" },
];

const ManageUsers = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {dummyUsers.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem>
                <ListItemText
                  primary={user.email}
                  secondary={`Status: ${user.status}`}
                />
                <Button
                  variant="contained"
                  color={user.status === "active" ? "error" : "primary"}
                >
                  {user.status === "active" ? "Lock" : "Unlock"}
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ManageUsers;
