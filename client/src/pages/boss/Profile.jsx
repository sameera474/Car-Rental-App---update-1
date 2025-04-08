import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const BossProfile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/users/profile", profile);
      login(response.data.user, response.data.token);
      setSuccessMsg("Profile updated successfully!");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
      setSuccessMsg("");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Boss Profile
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      <Paper sx={{ p: 2, maxWidth: "400px" }}>
        <Box component="form" onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BossProfile;
