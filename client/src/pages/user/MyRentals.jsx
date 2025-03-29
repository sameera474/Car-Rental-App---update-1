// File: client/src/pages/user/MyRentals.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const dummyRentals = [
  { id: 1, car: "Toyota Corolla", date: "2025-03-20", cost: "$120" },
  { id: 2, car: "Honda Civic", date: "2025-03-22", cost: "$150" },
];

const MyRentals = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Rentals
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {dummyRentals.map((rental) => (
            <React.Fragment key={rental.id}>
              <ListItem>
                <ListItemText
                  primary={rental.car}
                  secondary={`Date: ${rental.date} | Cost: ${rental.cost}`}
                />
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
