// File: client/src/pages/manager/Dashboard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const ManagerDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard. Here you can manage cars, view rental
        requests, and process returned cars.
      </Typography>
    </Box>
  );
};

export default ManagerDashboard;
