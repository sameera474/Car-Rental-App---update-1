import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ManageBosses from "./ManageBosses";
import ResetSystem from "./ResetSystem";

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">System Overview</Typography>
            <Typography variant="body1">
              Statistics and system status go here.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ManageBosses />
        </Grid>
        <Grid item xs={12}>
          <ResetSystem />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
