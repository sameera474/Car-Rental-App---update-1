// File: client/src/pages/manager/RentalRequests.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const dummyRequests = [
  {
    id: 1,
    user: "user1@example.com",
    car: "Toyota Corolla",
    requestDate: "2025-03-20",
  },
  {
    id: 2,
    user: "user2@example.com",
    car: "Honda Civic",
    requestDate: "2025-03-21",
  },
];

const RentalRequests = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rental Requests
      </Typography>
      <List>
        {dummyRequests.map((request) => (
          <React.Fragment key={request.id}>
            <ListItem>
              <ListItemText
                primary={`User: ${request.user}`}
                secondary={`Car: ${request.car} | Requested on: ${request.requestDate}`}
              />
              <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                Approve
              </Button>
              <Button variant="contained" color="error">
                Decline
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RentalRequests;
