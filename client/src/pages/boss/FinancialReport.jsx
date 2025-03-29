// File: client/src/pages/boss/FinancialReport.jsx
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const FinancialReport = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Financial Report
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="body1">$12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Rentals</Typography>
            <Typography variant="body1">150 Rentals</Typography>
          </Paper>
        </Grid>
        {/* Additional financial metrics or charts can be added here */}
      </Grid>
    </Box>
  );
};

export default FinancialReport;
