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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const CategoryEdit = () => {
  const { id } = useParams(); // Get category ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get(`/categories/${id}`);
        const category = res.data;
        setForm({
          name: category.name,
        });
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to fetch category details.",
        });
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.patch(`/categories/${id}`, form);
      setAlert({
        open: true,
        severity: "success",
        message: "Category updated successfully!",
      });
      setTimeout(() => navigate("/categories"), 2000); // Redirect after success
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to update category.",
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
        <Typography color="text.primary">Edit Category</Typography>
      </Breadcrumbs>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title="Edit Category"
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
              {loading ? "Updating..." : "Update Category"}
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

export default CategoryEdit;
