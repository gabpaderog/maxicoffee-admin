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
import { getProductById, deleteProduct } from '../products.api';
import { ProductsDataSource } from '../../../data/product';

const ProductShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  // Dialog and Snackbar state
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setError('Failed to fetch product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ProductsDataSource.deleteOne(id);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
      setTimeout(() => window.location.href = '/products', 1200);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  if (loading && !openDialog) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return null;

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/products">
          Products
        </Link>
        <Typography color="text.primary">Product #{product._id}</Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Product #{product._id}</Typography>
            </Stack>
          }
          sx={{
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
            fontWeight: 'semibold',
          }}
        />
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              src={product.image}
              alt={product.name}
              variant="rounded"
              sx={{ width: 100, height: 100, bgcolor: '#eee' }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Category: {product.category.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Base Price: P{product.basePrice}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Product ID: {product._id}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={`/products/${product._id}/edit`}
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
        <DialogTitle id="delete-dialog-title">Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
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

export default ProductShow;
