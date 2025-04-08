import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const CarDetails = ({ match }) => {
  const carId = match.params.id; // Or use useParams() from react-router-dom v6+
  const [car, setCar] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data } = await axiosInstance.get(`/cars/${carId}`);
        setCar(data);
        // Assume you have endpoints for rental history and reviews
        const rentalRes = await axiosInstance.get(`/rentals/car/${carId}`);
        setRentalHistory(rentalRes.data);
        const reviewsRes = await axiosInstance.get(`/reviews/car/${carId}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [carId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {car.brand} {car.model} Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {car.image && (
            <Box
              component="img"
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              sx={{ width: "100%", height: 300, objectFit: "cover", mb: 2 }}
            />
          )}
          <Typography variant="body1">
            <strong>Year:</strong> {car.year}
          </Typography>
          <Typography variant="body1">
            <strong>Mileage:</strong> {car.mileage} km
          </Typography>
          <Typography variant="body1">
            <strong>Price per day:</strong> ${car.pricePerDay}
          </Typography>
          <Typography variant="body1">
            <strong>Transmission:</strong> {car.transmission}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {car.location}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {car.status}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h5" gutterBottom>
        Rental History
      </Typography>
      <List>
        {rentalHistory.map((rental) => (
          <React.Fragment key={rental._id}>
            <ListItem>
              <ListItemText
                primary={`Rented by: ${rental.user?.email}`}
                secondary={`From: ${new Date(
                  rental.startDate
                ).toLocaleDateString()} To: ${new Date(
                  rental.endDate
                ).toLocaleDateString()} | Total: $${rental.totalCost}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Reviews
      </Typography>
      <List>
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            <ListItem>
              <ListItemText
                primary={`${review.user?.email} says:`}
                secondary={review.comment}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CarDetails;
