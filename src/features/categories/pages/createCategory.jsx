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
} from "@mui/material";

const CateroryCreate = () => {
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/categories", { name: form.name });
      setAlert({
        open: true,
        severity: "success",
        message: "Category created!",
      });
      setForm({ name: "" });
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to create category.",
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
        <Link underline="hover" color="inherit" href="/categories">
          Categories
        </Link>
        <Typography color="text.primary">Create Category</Typography>
      </Breadcrumbs>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title="Create Category"
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
              placeholder="Category name"
              fullWidth
            />
          </CardContent>
          <CardActions sx={{ flexDirection: "column", alignItems: "stretch", px: 2, pb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ fontSize: 18 }}
            >
              {loading ? "Creating..." : "Create Category"}
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

export default CateroryCreate;
