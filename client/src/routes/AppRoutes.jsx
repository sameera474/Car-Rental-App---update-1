// File: client/src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import CarList from "../pages/user/CarList";
import CarDetails from "../pages/user/CarDetails";
import MyRentals from "../pages/user/MyRentals";
import ReviewCar from "../pages/user/ReviewCar";
import UserProfile from "../pages/user/Profile";

// Manager Pages
import ManagerDashboard from "../pages/manager/Dashboard";
import ManageCars from "../pages/manager/ManageCars";
import RentalRequests from "../pages/manager/RentalRequests";
import ReturnedCars from "../pages/manager/ReturnedCars";
import ManageUsers from "../pages/manager/ManageUsers";
import ManagerProfile from "../pages/manager/Profile";

// Boss Pages
import BossDashboard from "../pages/boss/Dashboard";
import ManageManagers from "../pages/boss/ManageManagers";
import FinancialReport from "../pages/boss/FinancialReport";
import BossProfile from "../pages/boss/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import ManageBosses from "../pages/admin/ManageBosses";
import ResetSystem from "../pages/admin/ResetSystem";
import AdminProfile from "../pages/admin/Profile";

import ProtectedRoute from "./ProtectedRoute";
import NavBar from "../components/Navbar";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes for Users */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/cars" element={<CarList />} />
          <Route path="/user/cars/:id" element={<CarDetails />} />
          <Route path="/user/myrentals" element={<MyRentals />} />
          <Route path="/user/reviews" element={<ReviewCar />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>

        {/* Protected Routes for Managers */}
        <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/manage-cars" element={<ManageCars />} />
          <Route path="/manager/rental-requests" element={<RentalRequests />} />
          <Route path="/manager/returned-cars" element={<ReturnedCars />} />
          <Route path="/manager/manage-users" element={<ManageUsers />} />
          <Route path="/manager/profile" element={<ManagerProfile />} />
        </Route>

        {/* Protected Routes for Boss */}
        <Route element={<ProtectedRoute allowedRoles={["boss"]} />}>
          <Route path="/boss/dashboard" element={<BossDashboard />} />
          <Route path="/boss/manage-managers" element={<ManageManagers />} />
          <Route path="/boss/financial-report" element={<FinancialReport />} />
          <Route path="/boss/profile" element={<BossProfile />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-bosses" element={<ManageBosses />} />
          <Route path="/admin/reset-system" element={<ResetSystem />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
