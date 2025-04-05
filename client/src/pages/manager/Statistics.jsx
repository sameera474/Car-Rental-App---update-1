// Statistics.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/stats");
        setStats(data);
      } catch (err) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rental Statistics
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Financial Overview" />
        <Tab label="Vehicle Popularity" />
        <Tab label="User Activity" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper sx={{ p: 2, my: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Revenue
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ p: 2, my: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Most Popular Vehicles
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={stats.popularCars}
                dataKey="count"
                nameKey="model"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {stats.popularCars.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {tabIndex === 2 && (
        <Paper sx={{ p: 2, my: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            User Activity
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stats.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rentals" fill="#82ca9d" />
              <Bar dataKey="spending" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default Statistics;
