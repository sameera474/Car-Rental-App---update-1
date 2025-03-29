// File: client/src/pages/admin/ResetSystem.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ResetSystem = () => {
  const [open, setOpen] = React.useState(false);

  const handleReset = () => {
    // Add reset logic here (e.g., API call to reset the system)
    console.log("System reset initiated");
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reset System
      </Typography>
      <Typography variant="body1" gutterBottom>
        Warning: This will reset the entire system. Use with caution.
      </Typography>
      <Button variant="contained" color="error" onClick={() => setOpen(true)}>
        Reset System
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset the system? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReset}>
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetSystem;
