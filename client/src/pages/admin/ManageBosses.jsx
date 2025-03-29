import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

// Dummy Data (Replace with API later)
const bossesData = [{ id: 1, name: "John Smith", email: "john@example.com" }];

const ManageBosses = () => {
  const [bosses, setBosses] = useState([]);

  useEffect(() => {
    // TODO: Fetch from API later
    setBosses(bossesData);
  }, []);

  return (
    <MainLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Manage Bosses
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Add New Boss
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bosses.map((boss) => (
                <TableRow key={boss.id}>
                  <TableCell>{boss.name}</TableCell>
                  <TableCell>{boss.email}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainLayout>
  );
};

export default ManageBosses;
