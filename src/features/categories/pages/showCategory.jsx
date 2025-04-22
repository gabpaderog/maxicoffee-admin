import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { CategoriesDataSource } from '../../../data/category';
import { getCategoryById } from '../categories.api';


const CategoryShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dialog and Snackbar state
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Replace with your API call to fetch category by ID
    getCategoryById(id)
      .then((data) => setCategory(data))
      .catch(() => setError('Failed to fetch category'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Replace with your API call to delete category
      await CategoriesDataSource.deleteOne(id);
      setSnackbar({ open: true, message: 'Category deleted successfully!', severity: 'success' });
      setTimeout(() => window.location.href = '/categories', 1200);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  if (loading && !openDialog) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!category) return null;

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/categories">
          Categories
        </Link>
        <Typography color="text.primary">Category #{category._id}</Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Category #{category._id}</Typography>
            </Stack>
          }
          sx={{
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
            fontWeight: 'semibold',
          }}
        />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">{category.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Category ID: {category._id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Created At: {new Date(category.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={`/categories/${category._id}/edit`}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenDialog(true)}
              disabled={loading}
            >
              Delete
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryShow;