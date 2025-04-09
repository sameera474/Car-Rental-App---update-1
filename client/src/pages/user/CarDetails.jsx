import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { fetchCarById } from "../../services/carService";
import { createRental } from "../../services/rentalService";
import { useAuth } from "../../context/AuthContext";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRentalDialog, setShowRentalDialog] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    start: new Date(),
    end: new Date(Date.now() + 86400000),
  });

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
    try {
      if (!user && !authLoading) {
        navigate("/login");
        return;
      }
      await createRental({
        carId: car._id,
        startDate: rentalDates.start.toISOString(),
        endDate: rentalDates.end.toISOString(),
      });
      navigate("/user/myrentals");
    } catch (err) {
      setError(err.message || "Rental creation failed.");
    } finally {
      setShowRentalDialog(false);
    }
  };

  if (loading || authLoading) {
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
          {car.brand} {car.model}
        </Typography>
        {car.image && (
          <Box
            sx={{
              mt: 2,
              mb: 4,
              display: "flex",
              justifyContent: "center",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              style={{
                maxWidth: "100%",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Specifications</Typography>
            <Typography>Year: {car.year}</Typography>
            <Typography>Seats: {car.seats}</Typography>
            <Typography>Doors: {car.doors}</Typography>
            <Typography>Transmission: {car.transmission}</Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Pricing</Typography>
            <Typography>Daily Rate: ${car.pricePerDay}</Typography>
            <Typography>Location: {car.location}</Typography>
          </Paper>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowRentalDialog(true)}
          disabled={!user || loading}
        >
          {loading ? "Loading..." : user ? "Rent This Car" : "Login to Rent"}
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

      <Dialog
        open={showRentalDialog}
        onClose={() => setShowRentalDialog(false)}
      >
        <DialogTitle>
          Confirm Rental for {car.brand} {car.model}
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
          <Button onClick={() => setShowRentalDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRent}>
            Confirm Rental
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarDetails;
