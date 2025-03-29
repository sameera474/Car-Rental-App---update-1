// File: client/src/pages/user/CarDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { fetchCarById } from "../../services/carService";
import { createRental } from "../../services/rentalService";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCar = async () => {
      try {
        const data = await fetchCarById(id);
        setCar(data);
      } catch (err) {
        setError("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    getCar();
  }, [id]);

  const handleRent = async () => {
    setRenting(true);
    try {
      await createRental({ carId: car.id });
      navigate("/user/myrentals");
    } catch (err) {
      setError("Rental creation failed.");
    } finally {
      setRenting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {car.manufacturer} {car.model}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {car.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Price per day: ${car.pricePerDay}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRent}
          disabled={renting}
        >
          {renting ? "Processing..." : "Rent This Car"}
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
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
