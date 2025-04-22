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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";

const ProductCreate = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    available: true,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("categoryId", form.category);
    data.append("basePrice", form.price);
    data.append("available", form.available);
    if (form.image) data.append("image", form.image);

    try {
      await axiosInstance.post("products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlert({
        open: true,
        severity: "success",
        message: "Product created!",
      });
      setForm({
        name: "",
        category: "",
        price: "",
        available: true,
        image: null,
      });
      setPreview(null);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to create product.",
      });
    }
    setLoading(false);
  };

  const handleAlertClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto"}}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link underline="hover" color="inherit" href="/products">
          Products
        </Link>
        <Typography color="text.primary">Create Product</Typography>
      </Breadcrumbs>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title="Create Product"
          sx={{ fontWeight: 600, fontSize: 28, color: "#333" }}
        />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <InputLabel shrink>Product Image</InputLabel>
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 1 }}
              >
                Upload Image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
              </Button>
              {preview && (
                <Box>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: 120,
                      marginTop: 8,
                      borderRadius: 8,
                      border: "1px solid #eee",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  />
                </Box>
              )}
            </Box>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Product name"
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              placeholder="Price"
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                  sx={{ color: "#2d7d46", "&.Mui-checked": { color: "#2d7d46" } }}
                />
              }
              label="Available"
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
              {loading ? "Creating..." : "Create Product"}
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

export default ProductCreate;
