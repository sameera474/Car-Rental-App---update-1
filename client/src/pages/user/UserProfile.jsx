import React from "react";
import { Container, Paper, Typography, Avatar, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h5">You are not logged in.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            width: 80,
            height: 80,
            margin: "auto",
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          {user.name}
        </Typography>
        <Box sx={{ textAlign: "left", marginTop: 2 }}>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {user.phone || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {user.role || "User"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
