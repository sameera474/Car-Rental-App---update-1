import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import RentalDialog from "./RentalDialog";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars/available");
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const handleRent = async (carId, dates) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post("/rentals", {
        carId,
        startDate: dates.start.toISOString(),
        endDate: dates.end.toISOString(),
      });
      // Refresh available cars
      const { data } = await axiosInstance.get("/cars/available");
      setCars(data);
      alert("Car rented successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Rental failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Cars
      </Typography>
      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                {car.image && (
                  <Box
                    sx={{
                      height: 200,
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Typography variant="h6">
                  {car.brand} {car.model}
                </Typography>
                <Typography>Price per day: ${car.pricePerDay}</Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedCar(car)}
                  >
                    Rent Now
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/cars/${car._id}`}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <RentalDialog
        car={selectedCar}
        open={Boolean(selectedCar)}
        onClose={() => setSelectedCar(null)}
        onRent={handleRent}
      />
    </Box>
  );
};

export default CarList;
