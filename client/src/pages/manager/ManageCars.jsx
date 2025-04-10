// File: client/src/pages/manager/ManageCars.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Delete, Edit, CloudUpload } from "@mui/icons-material";
import axiosInstance from "../../services/axiosInstance";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    transmission: "all",
    location: "all",
  });

  // Fetch cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars");
        setCars(data);
      } catch (err) {
        setError("Failed to load cars");
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (carData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // For new cars, at least one image is required.
      if (
        !currentCar?._id &&
        (!carData.images || carData.images.length === 0)
      ) {
        throw new Error("At least one image is required for new cars");
      }

      // Append all fields into formData.
      Object.entries(carData).forEach(([key, value]) => {
        if (key === "images") {
          if (value instanceof Array && value.length > 0) {
            value.forEach((file) => {
              formData.append("images", file);
            });
          } else if (typeof value === "string" && value) {
            formData.append("imageUrl", value);
          }
        } else {
          formData.append(key, value);
        }
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = currentCar?._id
        ? await axiosInstance.put(`/cars/${currentCar._id}`, formData, config)
        : await axiosInstance.post("/cars", formData, config);

      const updatedCar = response.data;
      setCars((prev) =>
        currentCar?._id
          ? prev.map((c) => (c._id === updatedCar._id ? updatedCar : c))
          : [updatedCar, ...prev]
      );
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    try {
      await axiosInstance.put(`/cars/${carId}/remove`);
      setCars((prev) =>
        prev.map((c) =>
          c._id === carId ? { ...c, status: "removed", isAvailable: false } : c
        )
      );
    } catch (err) {
      setError("Failed to remove car");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCar(null);
  };

  // Filter cars
  const filteredCars = cars.filter((car) => {
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && car.status === "active") ||
      (filters.status === "rented" &&
        !car.isAvailable &&
        car.status === "active") ||
      (filters.status === "returned" && car.status === "returned") ||
      (filters.status === "removed" && car.status === "removed");
    const transmissionMatch =
      filters.transmission === "all" ||
      car.transmission === filters.transmission;
    const locationMatch =
      filters.location === "all" || car.location === filters.location;
    return statusMatch && transmissionMatch && locationMatch;
  });

  if (globalLoading)
    return <CircularProgress sx={{ m: 4, display: "block" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Cars</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          startIcon={<CloudUpload />}
        >
          Add New Car
        </Button>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Filter controls here */}
        {/* ... existing filter controls */}
      </Box>

      <Typography variant="h5" gutterBottom>
        Existing Cars ({filteredCars.length})
      </Typography>

      <Grid container spacing={3}>
        {filteredCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardContent>
                {car.images && car.images.length > 0 && (
                  <Box
                    sx={{
                      height: 200,
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={car.images[0]} // Show the first image for preview
                      alt={`${car.brand} ${car.model}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">
                    {car.brand} {car.model}
                  </Typography>
                  <Chip
                    label={
                      car.status === "removed"
                        ? "Removed"
                        : car.isAvailable
                        ? "Available"
                        : "Rented"
                    }
                    color={
                      car.status === "removed"
                        ? "default"
                        : car.isAvailable
                        ? "success"
                        : "error"
                    }
                  />
                </Box>
                <Chip
                  label={`Category: ${car.category || "Economy"}`}
                  sx={{ mt: 1 }}
                />

                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={`Year: ${car.year}`} />
                  <Chip label={`Mileage: ${car.mileage || "N/A"} km`} />
                  <Chip label={`Seats: ${car.seats}`} />
                  <Chip label={`Doors: ${car.doors}`} />
                  <Chip label={`$${car.pricePerDay}/day`} />
                </Box>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => {
                      setCurrentCar(car);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDelete(car._id)}
                  >
                    Remove
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CarDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        currentCar={currentCar}
        loading={loading}
      />
    </Box>
  );
};

const CarDialog = ({ open, onClose, onSubmit, currentCar, loading }) => {
  // Now handle multiple files
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    mileage: "",
    seats: 5,
    doors: 4,
    transmission: "Manual",
    location: "Main Branch",
    category: "Economy",
    images: [], // Array to store File objects for images
  });
  const [previews, setPreviews] = useState([]);

  // Clean up blob URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  useEffect(() => {
    if (currentCar) {
      setFormData({
        brand: currentCar.brand,
        model: currentCar.model,
        year: currentCar.year,
        pricePerDay: currentCar.pricePerDay,
        mileage: currentCar.mileage || "",
        seats: currentCar.seats,
        doors: currentCar.doors,
        transmission: currentCar.transmission,
        location: currentCar.location,
        category: currentCar.category || "Economy",
        images: [], // start with empty; you may choose to show existing images separately
      });
      setPreviews(currentCar.images || []);
    } else {
      setFormData({
        brand: "",
        model: "",
        year: "",
        pricePerDay: "",
        mileage: "",
        seats: 5,
        doors: 4,
        transmission: "Manual",
        location: "Main Branch",
        category: "Economy",
        images: [],
      });
      setPreviews([]);
    }
  }, [currentCar]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Revoke existing blob URLs if any
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      setFormData((prev) => ({ ...prev, images: files }));
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCar && formData.images.length === 0) {
      alert("Please upload at least one image for the car");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{currentCar ? "Edit Car" : "Add New Car"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Brand"
              fullWidth
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Model"
              fullWidth
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Year"
              type="number"
              fullWidth
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Price/Day"
              type="number"
              fullWidth
              value={formData.pricePerDay}
              onChange={(e) =>
                setFormData({ ...formData, pricePerDay: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Mileage (km)"
              type="number"
              fullWidth
              value={formData.mileage}
              onChange={(e) =>
                setFormData({ ...formData, mileage: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Seats"
              type="number"
              fullWidth
              value={formData.seats}
              onChange={(e) =>
                setFormData({ ...formData, seats: e.target.value })
              }
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              label="Doors"
              type="number"
              fullWidth
              value={formData.doors}
              onChange={(e) =>
                setFormData({ ...formData, doors: e.target.value })
              }
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Transmission</InputLabel>
              <Select
                value={formData.transmission}
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                label="Transmission"
              >
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                label="Location"
              >
                <MenuItem value="Main Branch">Main Branch</MenuItem>
                <MenuItem value="Downtown">Downtown</MenuItem>
                <MenuItem value="Airport">Airport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* New Category input */}
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                label="Category"
              >
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="SUV">SUV</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
                <MenuItem value="Convertible">Convertible</MenuItem>
                <MenuItem value="Van">Van</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="car-images-upload"
              required={!currentCar}
            />
            <label htmlFor="car-images-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Upload Images
              </Button>
            </label>
            {previews && previews.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  maxWidth: "100%",
                }}
              >
                {previews.map((url, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      minWidth: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageCars;
