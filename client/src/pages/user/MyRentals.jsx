import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../components/ReviewForm";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedCarForReview, setSelectedCarForReview] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data } = await axiosInstance.get(`/rentals/user/${user.id}`);
        setRentals(data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    user && fetchRentals();
  }, [user]);

  // Update the handleReturn function
  const handleReturn = async (rentalId) => {
    try {
      const { data } = await axiosInstance.put(`/rentals/${rentalId}/return`);

      // Verify response structure
      if (!data?.carId) {
        throw new Error("Missing car ID in return response");
      }

      setRentals((prev) => prev.filter((r) => r._id !== rentalId));
      setSelectedCarForReview(data.carId);
      setShowReviewForm(true);
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Rentals
      </Typography>

      {rentals.map((rental) => (
        <Card key={rental._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {rental.car.brand} {rental.car.model}
            </Typography>
            <Typography>
              {new Date(rental.startDate).toLocaleDateString()} -{" "}
              {new Date(rental.endDate).toLocaleDateString()}
            </Typography>
            <Typography>Total: ${rental.totalCost}</Typography>
            <Typography color={rental.status === "active" ? "green" : "gray"}>
              Status: {rental.status.toUpperCase()}
            </Typography>

            {rental.status === "active" && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => handleReturn(rental._id)}
              >
                Return Car
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {showReviewForm && selectedCarForReview && (
        <ReviewForm
          carId={selectedCarForReview}
          onSuccess={() => {
            setShowReviewForm(false);
            setSelectedCarForReview(null);
          }}
        />
      )}
    </Box>
  );
};

export default MyRentals;
