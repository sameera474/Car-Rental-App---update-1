// File: client/src/pages/user/Dashboard.jsx
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email || "User"}!
      </Typography>
      <Grid container spacing={2}>
        {/* Section for Active Rentals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Rentals
            </Typography>
            <Typography variant="body1">
              You currently have X active rentals.
            </Typography>
          </Paper>
        </Grid>
        {/* Section for Account Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Summary
            </Typography>
            <Typography variant="body1">Email: {user?.email}</Typography>
            {/* You can add more account-related information here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
