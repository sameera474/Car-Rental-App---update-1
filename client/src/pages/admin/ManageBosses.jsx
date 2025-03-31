import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const ManageBosses = () => {
  const [bosses, setBosses] = useState([]);
  const [newBossEmail, setNewBossEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const response = await axiosInstance.get("/admin/bosses");
        setBosses(response.data);
      } catch (error) {
        setError("Failed to load bosses");
      } finally {
        setLoading(false);
      }
    };
    fetchBosses();
  }, []);

  const handleAddBoss = async () => {
    try {
      setError("");
      const response = await axiosInstance.post("/admin/bosses", {
        email: newBossEmail,
      });
      setBosses([...bosses, response.data]);
      setNewBossEmail("");
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDemote = async (userId) => {
    try {
      await axiosInstance.delete(`/admin/bosses/${userId}`);
      setBosses(bosses.filter((boss) => boss._id !== userId));
    } catch (error) {
      setError(error.response?.data?.message || "Demotion failed");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bosses
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
            <ListItemText
              primary={boss.name}
              secondary={`${boss.email} (ID: ${boss._id})`}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDemote(boss._id)}
            >
              Demote to User
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageBosses;
