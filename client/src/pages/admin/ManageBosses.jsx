// File: client/src/pages/admin/ManageBosses.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ManageBosses = () => {
  const [bosses, setBosses] = useState([]);
  const [newBossEmail, setNewBossEmail] = useState("");

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const response = await axiosInstance.get("/admin/bosses");
        setBosses(response.data);
      } catch (error) {
        console.error("Error fetching bosses:", error);
      }
    };
    fetchBosses();
  }, []);

  const handleAddBoss = async () => {
    try {
      await axiosInstance.post("/admin/bosses", { email: newBossEmail });
      const response = await axiosInstance.get("/admin/bosses");
      setBosses(response.data);
      setNewBossEmail("");
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDemote = async (userId) => {
    try {
      await axiosInstance.delete(`/admin/bosses/${userId}`);
      const response = await axiosInstance.get("/admin/bosses");
      setBosses(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Demotion failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bosses
      </Typography>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="User Email"
          value={newBossEmail}
          onChange={(e) => setNewBossEmail(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddBoss}>
          Promote to Boss
        </Button>
      </Box>

      <List>
        {bosses.map((boss) => (
          <ListItem key={boss._id}>
            <ListItemText primary={boss.name} secondary={boss.email} />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDemote(boss._id)}
            >
              Demote
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageBosses;
