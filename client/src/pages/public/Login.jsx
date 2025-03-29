// File: client/src/pages/public/Login.jsx
import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // default role for demonstration
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For demonstration, we'll log in with the selected role.
    // In a real application, you would validate credentials with your backend API.
    login({ email: formData.email, role: formData.role });

    // Navigate to the respective dashboard based on the role.
    if (formData.role === "user") {
      navigate("/user/dashboard");
    } else if (formData.role === "manager") {
      navigate("/manager/dashboard");
    } else if (formData.role === "boss") {
      navigate("/boss/dashboard");
    } else if (formData.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {/* Instead of a plain text field, we use a select for role */}
        <TextField
          fullWidth
          margin="normal"
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          helperText="Please select your role"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="boss">Boss</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "16px" }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
