// File: client/src/components/NavBar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Car Rental App
        </Typography>
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
        {user && user.role === "user" && (
          <>
            <Button color="inherit" component={Link} to="/user/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/user/cars">
              Available Cars
            </Button>
            <Button color="inherit" component={Link} to="/user/myrentals">
              My Rentals
            </Button>
            <Button color="inherit" component={Link} to="/user/reviews">
              Reviews
            </Button>
            <Button color="inherit" component={Link} to="/user/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
        {user && user.role === "manager" && (
          <>
            <Button color="inherit" component={Link} to="/manager/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/manager/manage-cars">
              Manage Cars
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/manager/rental-requests"
            >
              Rental Requests
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/manager/returned-cars"
            >
              Returned Cars
            </Button>
            <Button color="inherit" component={Link} to="/manager/manage-users">
              Manage Users
            </Button>
            <Button color="inherit" component={Link} to="/manager/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
        {user && user.role === "boss" && (
          <>
            <Button color="inherit" component={Link} to="/boss/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/boss/manage-managers">
              Manage Managers
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/boss/financial-report"
            >
              Financial Report
            </Button>
            <Button color="inherit" component={Link} to="/boss/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Button color="inherit" component={Link} to="/admin/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/admin/manage-bosses">
              Manage Bosses
            </Button>
            <Button color="inherit" component={Link} to="/admin/reset-system">
              Reset System
            </Button>
            <Button color="inherit" component={Link} to="/admin/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
