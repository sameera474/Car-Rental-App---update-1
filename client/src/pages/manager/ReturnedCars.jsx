// File: client/src/pages/manager/ReturnedCars.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

const dummyReturnedCars = [
  { id: 1, car: "Toyota Corolla", returnDate: "2025-03-25" },
  { id: 2, car: "Honda Civic", returnDate: "2025-03-26" },
];

const ReturnedCars = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Returned Cars
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {dummyReturnedCars.map((car) => (
            <React.Fragment key={car.id}>
              <ListItem>
                <ListItemText
                  primary={car.car}
                  secondary={`Returned on: ${car.returnDate}`}
                />
                <Button variant="contained" color="primary">
                  Process Return
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ReturnedCars;
