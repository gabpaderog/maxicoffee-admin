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
    FormControl,
    FormGroup,
  } from "@mui/material";
  import { useParams, useNavigate } from "react-router-dom";

  const AddonEdit = () => {
    const { id } = useParams(); // Get addon ID from URL
    const navigate = useNavigate();
    const [form, setForm] = useState({
      name: "",
      price: "",
      isGlobal: false,
      applicableCategories: [],
      available: false,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Snackbar state
    const [alert, setAlert] = useState({
      open: false,
      severity: "success",
      message: "",
    });

    useEffect(() => {
      // Fetch categories and addon details
      const fetchData = async () => {
        try {
          const [categoriesResponse, addonResponse] = await Promise.all([
            axiosInstance.get("/categories"),
            axiosInstance.get(`/addons/${id}`),
          ]);
          setCategories(categoriesResponse.data);
          setForm({
            ...addonResponse.data,
            applicableCategories: addonResponse.data.applicableCategories.map(category => {return category._id}), // Ensure string IDs
          });
        } catch (err) {
          console.error("Failed to fetch data", err);
        }
      };

      fetchData();
    }, [id]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleCategoryChange = (categoryId) => {
      setForm((prev) => {
        const alreadySelected = prev.applicableCategories.includes(categoryId);

        const updatedCategories = alreadySelected
          ? prev.applicableCategories.filter((id) => id !== categoryId)
          : [...prev.applicableCategories, categoryId];

        console.log(updatedCategories)

        return {
          ...prev,
          applicableCategories: updatedCategories,
        };
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await axiosInstance.patch(`/addons/${id}`, form);
        setAlert({
          open: true,
          severity: "success",
          message: "Addon updated successfully!",
        });
        // window.location.href = "/addons"; // Redirect to addons page
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to update addon.",
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
          <Link underline="hover" color="inherit" href="/addons">
            Addons
          </Link>
          <Typography color="text.primary">Edit Addon</Typography>
        </Breadcrumbs>
        <Card sx={{ width: "100%" }}>
          <CardHeader
            title="Edit Addon"
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
                placeholder="Addon name"
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Addon price"
                type="number"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isGlobal"
                    checked={form.isGlobal}
                    onChange={handleChange}
                  />
                }
                label="Is Global"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="available"
                    checked={form.available}
                    onChange={handleChange}
                  />
                }
                label="Available"
              />
              {!form.isGlobal && (
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Applicable Categories
                  </Typography>
                  <FormGroup>
                    {categories.map((category) => {
                      const categoryId = String(category._id); // ensure consistent type
                      const isChecked = form.applicableCategories.includes(categoryId);

                      return (
                        <FormControlLabel
                          key={categoryId}
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleCategoryChange(categoryId)}
                            />
                          }
                          label={category.name}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              )}
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
                {loading ? "Updating..." : "Update Addon"}
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

  export default AddonEdit;
