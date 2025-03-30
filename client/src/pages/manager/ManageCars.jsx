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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
    location: "Main Branch",
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

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
      Object.entries(newCar).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const { data } = editMode
        ? await axiosInstance.put(`/cars/${selectedCar._id}`, formData)
        : await axiosInstance.post("/cars", formData);

      setCars((prev) =>
        editMode
          ? prev.map((c) => (c._id === data._id ? data : c))
          : [data, ...prev]
      );
      resetForm();
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setLoading(false);
    }
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
      location: "Main Branch",
    });
    setEditMode(false);
    setSelectedCar(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {editMode ? "Edit Car" : "Add New Car"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Brand"
          value={newCar.brand}
          onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Model"
          value={newCar.model}
          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Year"
          type="number"
          value={newCar.year}
          onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
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

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Car"}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Existing Cars
      </Typography>

      {cars.map((car) => (
        <Card key={car._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {car.brand} {car.model}
            </Typography>
            <Typography>Year: {car.year}</Typography>
            <Typography>Price/Day: ${car.pricePerDay}</Typography>

            <Box sx={{ mt: 2 }}>
              <IconButton
                onClick={() => {
                  setSelectedCar(car);
                  setEditMode(true);
                  setNewCar(car);
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
      ))}
    </Box>
  );
};

export default ManageCars;
