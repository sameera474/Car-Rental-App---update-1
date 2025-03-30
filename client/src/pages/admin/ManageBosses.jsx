import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ManageBosses = () => {
  const [bosses, setBosses] = useState([]);
  const [newBossEmail, setNewBossEmail] = useState("");

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const response = await axiosInstance.get("/users/bosses");
        setBosses(response.data);
      } catch (error) {
        console.error("Error fetching bosses:", error);
      }
    };
    fetchBosses();
  }, []);

  const handleAddBoss = async () => {
    try {
      await axiosInstance.post("/admin/promote-boss", { email: newBossEmail });
      setNewBossEmail("");
      // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Promotion failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bosses
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          label="User Email"
          value={newBossEmail}
          onChange={(e) => setNewBossEmail(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddBoss}>
          Promote to Boss
        </Button>
      </Box>

      <List>
        {bosses.map((boss) => (
          <ListItem key={boss._id}>
            <ListItemText primary={boss.name} secondary={boss.email} />
            <Button color="error">Demote</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageBosses;
