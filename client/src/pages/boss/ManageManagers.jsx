// File: client/src/pages/boss/ManageManagers.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ManageManagers = () => {
  const [managers, setManagers] = useState([]);
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/managers");
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
    fetchManagers();
  }, []);

  const handleAddManager = async () => {
    try {
      await axiosInstance.post("/api/admin/manage-managers", {
        email: newManagerEmail,
        action: "promote",
      });
      const response = await axiosInstance.get("/api/admin/managers");
      setManagers(response.data);
      setOpenDialog(false);
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleRemoveManager = async (userId) => {
    try {
      await axiosInstance.post("/api/admin/manage-managers", {
        userId,
        action: "demote",
      });
      const response = await axiosInstance.get("/api/admin/managers");
      setManagers(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Managers
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add New Manager
      </Button>

      <Paper sx={{ p: 2 }}>
        <List>
          {managers.map((manager) => (
            <React.Fragment key={manager._id}>
              <ListItem>
                <ListItemText
                  primary={manager.name}
                  secondary={manager.email}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveManager(manager._id)}
                >
                  Demote
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Manager</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Email"
            fullWidth
            value={newManagerEmail}
            onChange={(e) => setNewManagerEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddManager} variant="contained">
            Promote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageManagers;
