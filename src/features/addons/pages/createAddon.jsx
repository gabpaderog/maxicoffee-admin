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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormGroup,
  } from "@mui/material";

  const AddonCreate = () => {
    const [form, setForm] = useState({
      name: "",
      price: "",
      isGlobal: false,
      applicableCategories: [],
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
      // Fetch categories from backend
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/categories");
          setCategories(response.data);
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      };

      fetchCategories();
    }, []);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleCategoryChange = (e) => {
      const { value } = e.target;
      setForm((prev) => ({
        ...prev,
        applicableCategories: typeof value === "string" ? value.split(",") : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await axiosInstance.post("/addons", form);
        setAlert({
          open: true,
          severity: "success",
          message: "Addon created!",
        });
        setForm({ name: "", price: "", isGlobal: false, applicableCategories: [] });
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to create addon.",
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
          <Typography color="text.primary">Create Addon</Typography>
        </Breadcrumbs>
        <Card sx={{ width: "100%" }}>
          <CardHeader
            title="Create Addon"
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
                            onChange={() => {
                              setForm((prev) => {
                                const alreadySelected = prev.applicableCategories.includes(categoryId);
                                const updatedCategories = alreadySelected
                                  ? prev.applicableCategories.filter((id) => id !== categoryId)
                                  : [...prev.applicableCategories, categoryId];

                                return {
                                  ...prev,
                                  applicableCategories: updatedCategories,
                                };
                              });
                              console.log("Selected:", categoryId);
                            }}
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
                {loading ? "Creating..." : "Create Addon"}
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

  export default AddonCreate;
