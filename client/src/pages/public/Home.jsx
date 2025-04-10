import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Paper, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../services/axiosInstance";

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchHomeData = async () => {
    try {
      const [featuredRes, popularRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/cars/featured"),
        axiosInstance.get("/cars/popular"),
        axiosInstance.get("/cars/categories"),
      ]);
      setFeaturedVehicles(featuredRes.data);
      setPopularVehicles(popularRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Error fetching home page data:", err);
      setError("Failed to load home page data");
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h2" gutterBottom>
            Rent a Car Anytime, Anywhere!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Explore our collection of premium and budget-friendly cars.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              component={Link}
              to="/register"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              to="/cars"
            >
              Browse Cars
            </Button>
          </Box>
        </Box>

        {error && (
          <Box textAlign="center" sx={{ mb: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Featured Vehicles Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Featured Vehicles
          </Typography>
          <Grid container spacing={3}>
            {featuredVehicles.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2">
                    ${car.pricePerDay} per day
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Popular Vehicles Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Popular Vehicles
          </Typography>
          <Grid container spacing={3}>
            {popularVehicles.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2">
                    ${car.pricePerDay} per day
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Categories Section */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Vehicle Categories
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Promotion Section */}
        <Box
          sx={{
            my: 4,
            p: 3,
            bgcolor: "primary.main",
            borderRadius: 2,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Special Promotion
          </Typography>
          <Typography variant="body1" gutterBottom>
            Get 20% off your first rental! Use promo code{" "}
            <strong>RENT20</strong>
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/register"
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Home;
