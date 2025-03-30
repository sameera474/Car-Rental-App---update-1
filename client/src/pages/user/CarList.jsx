import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentalDates, setRentalDates] = useState({
    start: new Date(),
    end: new Date(Date.now() + 86400000), // Default 24h rental
  });

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

  const handleRentClick = async () => {
    try {
      await axiosInstance.post("/rentals", {
        carId: selectedCar._id,
        startDate: rentalDates.start.toISOString(),
        endDate: rentalDates.end.toISOString(),
      });

      const { data } = await axiosInstance.get("/cars/available");
      setCars(data);
      setSelectedCar(null);
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

      {cars.map((car) => (
        <Card key={car._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {car.brand} {car.model}
            </Typography>
            <Typography>Price per day: ${car.pricePerDay}</Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={() => setSelectedCar(car)}>
                Rent Now
              </Button>
              <Button
                component={Link}
                to={`/cars/${car._id}`}
                variant="outlined"
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Dialog open={Boolean(selectedCar)} onClose={() => setSelectedCar(null)}>
        <DialogTitle>
          Confirm Rental for {selectedCar?.brand} {selectedCar?.model}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            type="date"
            value={rentalDates.start.toISOString().split("T")[0]}
            onChange={(e) =>
              setRentalDates({
                ...rentalDates,
                start: new Date(e.target.value),
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={rentalDates.end.toISOString().split("T")[0]}
            onChange={(e) =>
              setRentalDates({ ...rentalDates, end: new Date(e.target.value) })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCar(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleRentClick}>
            Confirm Rental
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarList;
