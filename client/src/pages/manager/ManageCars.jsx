// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   CircularProgress,
//   Card,
//   CardContent,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Avatar,
//   Grid,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import axiosInstance from "../../services/axiosInstance";

// const ManageCars = () => {
//   const [cars, setCars] = useState([]);
//   const [newCar, setNewCar] = useState({
//     brand: "",
//     model: "",
//     year: "",
//     pricePerDay: "",
//     seats: 5,
//     doors: 5,
//     transmission: "Manual",
//     location: "Main Branch",
//     image: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedCar, setSelectedCar] = useState(null);
//   const [filters, setFilters] = useState({
//     status: "all",
//     transmission: "all",
//     location: "all",
//   });

//   useEffect(() => {
//     return () => {
//       if (newCar.image && typeof newCar.image !== "string") {
//         URL.revokeObjectURL(newCar.image);
//       }
//     };
//   }, [newCar.image]);

//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const { data } = await axiosInstance.get("/cars");
//         setCars(data);
//       } catch (error) {
//         console.error("Error fetching cars:", error);
//       }
//     };
//     fetchCars();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       Object.entries(newCar).forEach(([key, value]) => {
//         if (key === "image") {
//           if (value instanceof File) {
//             formData.append("image", value);
//           } else if (typeof value === "string") {
//             formData.append("imageUrl", value);
//           }
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       const { data } = editMode
//         ? await axiosInstance.put(`/cars/${selectedCar._id}`, formData, config)
//         : await axiosInstance.post("/cars", formData, config);

//       setCars((prev) =>
//         editMode
//           ? prev.map((c) => (c._id === data._id ? data : c))
//           : [data, ...prev]
//       );
//       resetForm();
//     } catch (error) {
//       console.error("Error saving car:", error.response?.data || error.message);
//       alert(`Save failed: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewCar((prev) => ({
//         ...prev,
//         image: file,
//       }));
//     }
//   };

//   const handleDelete = async (carId) => {
//     if (!window.confirm("Are you sure you want to delete this car?")) return;

//     try {
//       await axiosInstance.delete(`/cars/${carId}`);
//       setCars((prev) => prev.filter((c) => c._id !== carId));
//     } catch (error) {
//       console.error("Error deleting car:", error);
//     }
//   };

//   const resetForm = () => {
//     setNewCar({
//       brand: "",
//       model: "",
//       year: "",
//       pricePerDay: "",
//       seats: 5,
//       doors: 5,
//       transmission: "Manual",
//       location: "Main Branch",
//       image: null,
//     });
//     setEditMode(false);
//     setSelectedCar(null);
//   };
//   const filteredCars = cars.filter(
//     (car) =>
//       (filters.status === "all" ||
//         (filters.status === "available" && car.isAvailable) ||
//         (filters.status === "rented" && !car.isAvailable)) &&
//       (filters.transmission === "all" ||
//         car.transmission === filters.transmission) &&
//       (filters.location === "all" || car.location === filters.location)
//   );
//   const enhancedFilters = {
//     status: "all",
//     transmission: "all",
//     location: "all",
//     mileage: { min: 0, max: 100000 },
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         {editMode ? "Edit Car" : "Add New Car"}
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               label="Brand"
//               value={newCar.brand}
//               onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
//               fullWidth
//               margin="normal"
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               label="Model"
//               value={newCar.model}
//               onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
//               fullWidth
//               margin="normal"
//               required
//             />
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <TextField
//               label="Year"
//               type="number"
//               value={newCar.year}
//               onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
//               fullWidth
//               margin="normal"
//               required
//             />
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <TextField
//               label="Price/Day"
//               type="number"
//               value={newCar.pricePerDay}
//               onChange={(e) =>
//                 setNewCar({ ...newCar, pricePerDay: e.target.value })
//               }
//               fullWidth
//               margin="normal"
//               required
//             />
//           </Grid>
//           {/* Add seats/doors fields here */}
//           <Grid item xs={6} md={3}>
//             <TextField
//               label="Seats"
//               type="number"
//               value={newCar.seats}
//               onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
//               fullWidth
//               margin="normal"
//               required
//               inputProps={{ min: 1 }}
//             />
//           </Grid>
//           <Grid item xs={6} md={3}>
//             <TextField
//               label="Doors"
//               type="number"
//               value={newCar.doors}
//               onChange={(e) => setNewCar({ ...newCar, doors: e.target.value })}
//               fullWidth
//               margin="normal"
//               required
//               inputProps={{ min: 1 }}
//             />
//           </Grid>

//           <Grid item xs={6} md={3}>
//             <FormControl variant="outlined" sx={{ minWidth: 120 }}>
//               <InputLabel>Transmission</InputLabel>
//               <Select
//                 value={filters.transmission}
//                 onChange={(e) =>
//                   setFilters({ ...filters, transmission: e.target.value })
//                 }
//                 label="Transmission"
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 <MenuItem value="Manual">Manual</MenuItem>
//                 <MenuItem value="Automatic">Automatic</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl variant="outlined" sx={{ minWidth: 120 }}>
//               <InputLabel>Location</InputLabel>
//               <Select
//                 value={filters.location}
//                 onChange={(e) =>
//                   setFilters({ ...filters, location: e.target.value })
//                 }
//                 label="Location"
//               >
//                 <MenuItem value="all">All</MenuItem>
//                 <MenuItem value="Main Branch">Main Branch</MenuItem>
//                 <MenuItem value="Downtown">Downtown</MenuItem>
//                 <MenuItem value="Airport">Airport</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <input
//               accept="image/*"
//               type="file"
//               onChange={handleFileChange}
//               style={{ display: "none" }}
//               id="car-image-upload"
//             />
//             <label htmlFor="car-image-upload">
//               <Button
//                 variant="contained"
//                 component="span"
//                 startIcon={<CloudUploadIcon />}
//                 sx={{ mr: 2 }}
//               >
//                 Upload Image
//               </Button>
//             </label>

//             {newCar.image && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   position: "relative",
//                   height: 150,
//                   width: "100%",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <img
//                   src={
//                     typeof newCar.image === "string"
//                       ? newCar.image
//                       : URL.createObjectURL(newCar.image)
//                   }
//                   alt="Preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </Box>
//             )}
//           </Grid>
//         </Grid>

//         <Button
//           type="submit"
//           variant="contained"
//           disabled={loading}
//           sx={{ mt: 2 }}
//         >
//           {loading ? <CircularProgress size={24} /> : "Save Car"}
//         </Button>
//       </Box>

//       <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
//         <FormControl variant="outlined" sx={{ minWidth: 120 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             label="Status"
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="available">Available</MenuItem>
//             <MenuItem value="rented">Rented</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       <Typography variant="h5" gutterBottom>
//         Existing Cars ({filteredCars.length})
//       </Typography>

//       <Grid container spacing={2}>
//         {filteredCars.map((car) => (
//           <Grid item xs={12} md={6} lg={4} key={car._id}>
//             <Card>
//               <CardContent>
//                 {car.image && (
//                   <Box
//                     sx={{
//                       position: "relative",
//                       height: 200,
//                       mb: 2,
//                       borderRadius: "8px",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <img
//                       src={car.image}
//                       alt={`${car.brand} ${car.model}`}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </Box>
//                 )}

//                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                   <Typography variant="h6">
//                     {car.brand} {car.model}
//                   </Typography>
//                   <Chip
//                     label={car.isAvailable ? "Available" : "Rented"}
//                     color={car.isAvailable ? "success" : "error"}
//                   />
//                 </Box>

//                 <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                   <IconButton
//                     onClick={() => {
//                       setSelectedCar(car);
//                       setEditMode(true);
//                       setNewCar({
//                         ...car,
//                         image: car.image, // Preserve existing URL
//                       });
//                     }}
//                   >
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(car._id)}>
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ManageCars;

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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Delete, Edit, CloudUpload } from "@mui/icons-material";
import axiosInstance from "../../services/axiosInstance";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (carData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (!currentCar?._id && !carData.image) {
        throw new Error("Image is required for new cars");
      }

      Object.entries(carData).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          } else if (typeof value === "string" && value) {
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

      const { data } = currentCar?._id
        ? await axiosInstance.put(`/cars/${currentCar._id}`, formData, config)
        : await axiosInstance.post("/cars", formData, config);

      setCars((prev) =>
        currentCar?._id
          ? prev.map((c) => (c._id === data._id ? data : c))
          : [data, ...prev]
      );
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axiosInstance.delete(`/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (err) {
      setError("Failed to delete car");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCar(null);
  };

  const filteredCars = cars.filter(
    (car) =>
      (filters.status === "all" ||
        (filters.status === "available"
          ? car.isAvailable
          : !car.isAvailable)) &&
      (filters.transmission === "all" ||
        car.transmission === filters.transmission) &&
      (filters.location === "all" || car.location === filters.location)
  );

  if (loading)
    return <CircularProgress sx={{ margin: "2rem auto", display: "block" }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

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
        <FormControl sx={{ minWidth: 120 }}>
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

        <FormControl sx={{ minWidth: 120 }}>
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

        <FormControl sx={{ minWidth: 120 }}>
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
      </Box>

      <Typography variant="h5" gutterBottom>
        Existing Cars ({filteredCars.length})
      </Typography>

      <Grid container spacing={3}>
        {filteredCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardContent>
                {car.image && (
                  <Box
                    sx={{
                      height: 200,
                      mb: 2,
                      borderRadius: 2,
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

                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={`Year: ${car.year}`} />
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
                    Delete
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
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    seats: 5,
    doors: 4,
    transmission: "Manual",
    location: "Main Branch",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (currentCar) {
      setFormData(currentCar);
      setPreview(currentCar.image);
    }
  }, [currentCar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCar && !formData.image) {
      alert("Please upload an image for the car");
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
              label="Seats"
              type="number"
              fullWidth
              value={formData.seats}
              onChange={(e) =>
                setFormData({ ...formData, seats: e.target.value })
              }
              required
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
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="car-image-upload"
              required={!currentCar}
            />
            <label htmlFor="car-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Upload Image
              </Button>
            </label>
            {preview && (
              <Box
                sx={{ mt: 2, height: 200, borderRadius: 2, overflow: "hidden" }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
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
