// File: client/src/pages/boss/Profile.jsx
import React from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

const BossProfile = () => {
  const [profile, setProfile] = React.useState({
    name: "Boss One",
    email: "boss1@example.com",
    phone: "555-1234",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Boss profile saved", profile);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Boss Profile
      </Typography>
      <Paper sx={{ p: 2, maxWidth: "400px" }}>
        <Box component="form" onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BossProfile;
