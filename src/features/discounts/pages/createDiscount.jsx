import React, { useState } from "react";
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

const DiscountCreate = () => {
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
      await axiosInstance.post("/discounts", {
        name: form.name,
        percentage: parseFloat(form.percentage),
        requiresVerification: form.requiresVerification,
      });
      setAlert({
        open: true,
        severity: "success",
        message: "Discount created!",
      });
      setForm({ name: "", percentage: "", requiresVerification: false });
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to create discount.",
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
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/discounts">
          Discounts
        </Link>
        <Typography color="text.primary">Create Discount</Typography>
      </Breadcrumbs>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title="Create Discount"
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
            sx={{ flexDirection: "column", alignItems: "stretch", px: 2, pb: 2 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ fontSize: 18 }}
            >
              {loading ? "Creating..." : "Create Discount"}
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

export default DiscountCreate;
