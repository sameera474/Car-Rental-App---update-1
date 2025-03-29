// File: client/src/pages/boss/Dashboard.jsx
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const BossDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Boss Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Overview</Typography>
            <Typography variant="body1">
              Key metrics and performance data.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Typography variant="body1">List of recent actions.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BossDashboard;
