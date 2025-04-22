import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/axios";
import {
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  TextField,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const DiscountEdit = () => {
  const { id } = useParams(); // Get discount ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    percentage: "",
    requiresVerification: false,
  });
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await axiosInstance.get(`/discounts/${id}`);
        const discount = res.data;
        setForm({
          name: discount.name,
          percentage: discount.percentage,
          requiresVerification: discount.requiresVerification,
        });
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to fetch discount details.",
        });
      }
    };

    fetchDiscount();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.patch(`/discounts/${id}`, form);
      setAlert({
        open: true,
        severity: "success",
        message: "Discount updated successfully!",
      });
      setTimeout(() => window.location.href = '/discounts', 2000); // Redirect after success
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to update discount.",
      });
    }
    setLoading(false);
  };

  const handleAlertClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/discounts">
          Discounts
        </Link>
        <Typography color="text.primary">Edit Discount</Typography>
      </Breadcrumbs>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title="Edit Discount"
          sx={{ fontWeight: 600, fontSize: 28, color: "#333" }}
        />
        <form onSubmit={handleSubmit}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Discount name"
              fullWidth
            />
            <TextField
              label="Percentage"
              name="percentage"
              value={form.percentage}
              onChange={handleChange}
              required
              placeholder="Discount percentage (e.g., 0.1 for 10%)"
              type="number"
              inputProps={{ step: "0.01", min: "0", max: "1" }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="requiresVerification"
                  checked={form.requiresVerification}
                  onChange={handleChange}
                />
              }
              label="Requires Verification"
            />
          </CardContent>
          <CardActions
            sx={{
              flexDirection: "column",
              alignItems: "stretch",
              px: 2,
              pb: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ fontSize: 18 }}
            >
              {loading ? "Updating..." : "Update Discount"}
            </Button>
          </CardActions>
        </form>
      </Card>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscountEdit;
