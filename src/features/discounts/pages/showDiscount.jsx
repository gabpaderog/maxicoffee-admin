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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { DiscountsDataSource } from '../../../data/discount';
import { getDiscountById } from '../discounts.api';

const DiscountShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dialog and Snackbar state
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Replace with your API call to fetch discount by ID
    getDiscountById(id)
      .then((data) => setDiscount(data))
      .catch(() => setError('Failed to fetch discount'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Replace with your API call to delete discount
      await DiscountsDataSource.deleteOne(id);
      setSnackbar({ open: true, message: 'Discount deleted successfully!', severity: 'success' });
      setTimeout(() => window.location.href = '/discounts', 1200);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete discount', severity: 'error' });
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  if (loading && !openDialog) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!discount) return null;

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/discounts">
          Discounts
        </Link>
        <Typography color="text.primary">Discount #{discount._id}</Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Discount #{discount._id}</Typography>
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
            <Typography variant="h5" fontWeight="bold">{discount.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Discount ID: {discount._id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Percentage: {(discount.percentage * 100).toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Requires Verification: {discount.requiresVerification ? 'Yes' : 'No'}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={`/discounts/${discount._id}/edit`}
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
        <DialogTitle id="delete-dialog-title">Delete Discount</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this discount? This action cannot be undone.
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

export default DiscountShow;