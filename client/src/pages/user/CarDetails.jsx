// File: client/src/pages/user/CarDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const dummyCarDetails = {
  1: {
    id: 1,
    manufacturer: "Toyota",
    model: "Corolla",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 40,
    description: "Reliable and fuel efficient.",
  },
  2: {
    id: 2,
    manufacturer: "Honda",
    model: "Civic",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 45,
    description: "Sporty design with advanced features.",
  },
  3: {
    id: 3,
    manufacturer: "Ford",
    model: "Focus",
    transmission: "Manual",
    seats: 5,
    pricePerDay: 38,
    description: "Efficient and compact car.",
  },
};

const CarDetails = () => {
  const { id } = useParams();
  const car = dummyCarDetails[id];

  if (!car) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Car not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {car.manufacturer} {car.model}
        </Typography>
        <Typography variant="body1">
          <strong>Transmission:</strong> {car.transmission}
        </Typography>
        <Typography variant="body1">
          <strong>Seats:</strong> {car.seats}
        </Typography>
        <Typography variant="body1">
          <strong>Price per day:</strong> ${car.pricePerDay}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {car.description}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          component={Link}
          to="/user/cars"
        >
          Back to Cars
        </Button>
      </Paper>
    </Box>
  );
};

export default CarDetails;
