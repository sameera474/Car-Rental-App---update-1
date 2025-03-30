// File: client/src/components/NavBar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();

  const renderUserLinks = () => {
    if (!user)
      return (
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
      );

    const roleLinks = {
      user: [
        { path: "/user/dashboard", text: "Dashboard" },
        { path: "/user/cars", text: "Available Cars" },
        { path: "/user/myrentals", text: "My Rentals" },
        { path: "/user/reviews", text: "Reviews" },
        { path: "/user/profile", text: "Profile" },
      ],
      manager: [
        { path: "/manager/dashboard", text: "Dashboard" },
        { path: "/manager/manage-cars", text: "Manage Cars" },
        { path: "/manager/rental-requests", text: "Rental Requests" },
        { path: "/manager/returned-cars", text: "Returned Cars" },
        { path: "/manager/manage-users", text: "Manage Users" },
        { path: "/manager/profile", text: "Profile" },
      ],
      boss: [
        { path: "/boss/dashboard", text: "Dashboard" },
        { path: "/boss/manage-managers", text: "Manage Managers" },
        { path: "/boss/financial-report", text: "Financial Report" },
        { path: "/boss/profile", text: "Profile" },
      ],
      admin: [
        { path: "/admin/dashboard", text: "Dashboard" },
        { path: "/admin/manage-bosses", text: "Manage Bosses" },
        { path: "/admin/reset-system", text: "Reset System" },
        { path: "/admin/profile", text: "Profile" },
      ],
    };

    return (
      <>
        {roleLinks[user.role].map((link) => (
          <Button
            key={link.path}
            color="inherit"
            component={Link}
            to={link.path}
          >
            {link.text}
          </Button>
        ))}
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Car Rental App
        </Typography>
        {renderUserLinks()}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
