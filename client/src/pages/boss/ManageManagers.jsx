// File: client/src/pages/boss/ManageManagers.jsx
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

const dummyManagers = [
  { id: 1, name: "Manager One", email: "manager1@example.com" },
  { id: 2, name: "Manager Two", email: "manager2@example.com" },
];

const ManageManagers = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Managers
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Add New Manager
      </Button>
      <Paper sx={{ p: 2 }}>
        <List>
          {dummyManagers.map((manager) => (
            <React.Fragment key={manager.id}>
              <ListItem>
                <ListItemText
                  primary={manager.name}
                  secondary={manager.email}
                />
                <Button variant="contained" color="error">
                  Remove
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

export default ManageManagers;
