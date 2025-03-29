// File: client/src/pages/user/MyRentals.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { returnRental } from "../../services/rentalService";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Replace this with a real API call
  useEffect(() => {
    setTimeout(() => {
      setRentals([
        {
          id: 1,
          car: "Toyota Corolla",
          date: "2025-03-20",
          cost: "$120",
          status: "active",
        },
        {
          id: 2,
          car: "Honda Civic",
          date: "2025-03-22",
          cost: "$150",
          status: "active",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleReturn = async (rentalId) => {
    try {
      await returnRental(rentalId);
      setRentals(
        rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: "returned" } : rental
        )
      );
    } catch (err) {
      console.error("Return rental failed:", err);
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
      <Typography variant="h4" gutterBottom>
        My Rentals
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {rentals.map((rental) => (
            <React.Fragment key={rental.id}>
              <ListItem>
                <ListItemText
                  primary={rental.car}
                  secondary={`Date: ${rental.date} | Cost: ${rental.cost} | Status: ${rental.status}`}
                />
                {rental.status === "active" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReturn(rental.id)}
                  >
                    Return
                  </Button>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MyRentals;
