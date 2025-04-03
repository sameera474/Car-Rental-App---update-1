import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "../../services/axiosInstance";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    seats: 5,
    doors: 5,
    transmission: "Manual",
    location: "Main Branch",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    transmission: "all",
    location: "all",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axiosInstance.get("/cars");
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all car data
      Object.entries(newCar).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          } else if (typeof value === "string") {
            // Preserve existing image URL if not changing
            formData.append("imageUrl", value);
          }
        } else {
          formData.append(key, value);
        }
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = editMode
        ? await axiosInstance.put(`/cars/${selectedCar._id}`, formData, config)
        : await axiosInstance.post("/cars", formData, config);

      setCars((prev) =>
        editMode
          ? prev.map((c) => (c._id === data._id ? data : c))
          : [data, ...prev]
      );
      resetForm();
    } catch (error) {
      console.error("Error saving car:", error.response?.data || error.message);
      alert(`Save failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setNewCar({ ...newCar, image: e.target.files[0] });
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axiosInstance.delete(`/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const resetForm = () => {
    setNewCar({
      brand: "",
      model: "",
      year: "",
      pricePerDay: "",
      seats: 5,
      doors: 5,
      transmission: "Manual",
      location: "Main Branch",
      image: null,
    });
    setEditMode(false);
    setSelectedCar(null);
  };

  const filteredCars = cars.filter((car) => {
    return (
      (filters.status === "all" ||
        (filters.status === "available" && car.isAvailable) ||
        (filters.status === "rented" && !car.isAvailable)) &&
      (filters.transmission === "all" ||
        car.transmission === filters.transmission) &&
      (filters.location === "all" || car.location === filters.location)
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {editMode ? "Edit Car" : "Add New Car"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Brand"
              value={newCar.brand}
              onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Model"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Year"
              type="number"
              value={newCar.year}
              onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Price/Day"
              type="number"
              value={newCar.pricePerDay}
              onChange={(e) =>
                setNewCar({ ...newCar, pricePerDay: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          {/* Add seats/doors fields here */}
          <Grid item xs={6} md={3}>
            <TextField
              label="Seats"
              type="number"
              value={newCar.seats}
              onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Doors"
              type="number"
              value={newCar.doors}
              onChange={(e) => setNewCar({ ...newCar, doors: e.target.value })}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Transmission</InputLabel>
              <Select
                value={filters.transmission}
                onChange={(e) =>
                  setFilters({ ...filters, transmission: e.target.value })
                }
                label="Transmission"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                label="Location"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Main Branch">Main Branch</MenuItem>
                <MenuItem value="Downtown">Downtown</MenuItem>
                <MenuItem value="Airport">Airport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="car-image-upload"
            />
            <label htmlFor="car-image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
              >
                Upload Image
              </Button>
            </label>

            {newCar.image && (
              <Box
                sx={{
                  mt: 1,
                  position: "relative",
                  height: 150,
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    typeof newCar.image === "string"
                      ? newCar.image
                      : URL.createObjectURL(newCar.image)
                  }
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Car"}
        </Button>
      </Box>

      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="rented">Rented</MenuItem>
          </Select>
        </FormControl>

        {/* <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Transmission</InputLabel>
          <Select
            value={filters.transmission}
            onChange={(e) =>
              setFilters({ ...filters, transmission: e.target.value })
            }
            label="Transmission"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Automatic">Automatic</MenuItem>
          </Select>
        </FormControl> */}

        {/* <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            label="Location"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Main Branch">Main Branch</MenuItem>
            <MenuItem value="Downtown">Downtown</MenuItem>
            <MenuItem value="Airport">Airport</MenuItem>
          </Select>
        </FormControl> */}
      </Box>

      <Typography variant="h5" gutterBottom>
        Existing Cars ({filteredCars.length})
      </Typography>

      <Grid container spacing={2}>
        {filteredCars.map((car) => (
          <Grid item xs={12} md={6} lg={4} key={car._id}>
            <Card>
              <CardContent>
                {/* Improved Image Display */}
                {car.image && (
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      mb: 2,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={car.image}
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
                    label={car.isAvailable ? "Available" : "Rented"}
                    color={car.isAvailable ? "success" : "error"}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {car.year} | {car.transmission}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Seats:</strong> {car.seats}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Doors:</strong> {car.doors}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {car.location}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={() => {
                      setSelectedCar(car);
                      setEditMode(true);
                      setNewCar({
                        ...car,
                        image: car.image, // Preserve existing image URL
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(car._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageCars;
