// File: client/src/pages/boss/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import FinancialReport from "./FinancialReport";
import ManageManagers from "./ManageManagers";

const BossDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/financial-report");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Boss Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            {stats ? (
              <>
                <Typography>Total Revenue: ${stats.totalRevenue}</Typography>
                <Typography>Total Rentals: {stats.totalRentals}</Typography>
                <Typography>Active Managers: {stats.activeManagers}</Typography>
              </>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add recent activity list */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <FinancialReport />
        </Grid>
        <Grid item xs={12}>
          <ManageManagers />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BossDashboard;
