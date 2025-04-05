// client/src/pages/manager/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AttachMoney,
  DirectionsCar,
  CheckCircle,
  PendingActions,
} from "@mui/icons-material";
import axiosInstance from "../../services/axiosInstance";

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/rentals/stats");
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AttachMoney fontSize="large" />
                <div>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">
                    ${stats?.totalRevenue?.toLocaleString()}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DirectionsCar fontSize="large" />
                <div>
                  <Typography variant="h6">Available Cars</Typography>
                  <Typography variant="h4">{stats?.availableCars}</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle fontSize="large" />
                <div>
                  <Typography variant="h6">Completed Rentals</Typography>
                  <Typography variant="h4">
                    {stats?.completedRentals}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PendingActions fontSize="large" />
                <div>
                  <Typography variant="h6">Pending Requests</Typography>
                  <Typography variant="h4">{stats?.pendingRequests}</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add charts section */}
    </Box>
  );
};

export default ManagerDashboard;
