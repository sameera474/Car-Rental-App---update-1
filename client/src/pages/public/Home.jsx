import React from "react";
import { Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box textAlign="center" sx={{ mt: 5 }}>
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
      </Container>
    </MainLayout>
  );
};

export default Home;
