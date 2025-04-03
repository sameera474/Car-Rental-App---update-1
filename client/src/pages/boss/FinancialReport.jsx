// File: client/src/pages/boss/FinancialReport.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";

const FinancialReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/financial-report");
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Financial Report
      </Typography>

      {report && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell align="right">${report.totalRevenue}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Rentals</TableCell>
                <TableCell align="right">{report.totalRentals}</TableCell>
              </TableRow>
              {report.details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.car} Earnings</TableCell>
                  <TableCell align="right">${detail.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FinancialReport;
