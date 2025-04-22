import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getOrderById, updateOrderStatus, verifyDiscount } from '../orders.api';
import {
  Card,
  CardContent,
  CardHeader,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Divider,
  Grid,
  Stack,
  Chip,
  Button,
  Alert,
} from '@mui/material';

const STATUS_LABELS = {
  pending: 'Step 1: Pending (waiting for admin)',
  ready: 'Step 2: Ready (waiting for customer)',
  completed: 'Step 3: Completed',
};

const STATUS_COLORS = {
  completed: 'success',
  ready: 'warning',
  pending: 'primary',
};

const OrderShow = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => setError('Failed to fetch order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVerifyID = async () => {
    setVerifying(true);
    try {
      const resJson = await verifyDiscount(id, { discountApplied: true });
      setOrder((prev) => ({ ...prev, discountApplied: true, total: prev.total - prev.discountDetails.percentage * prev.total }));
    } catch {
      setError('Failed to verify ID');
    } finally {
      setVerifying(false);
    }
  };

  const handleMarkAsReady = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(id, { status: 'ready' });
      setOrder((prev) => ({ ...prev, status: 'ready' }));
    } catch {
      setError('Failed to update order status to ready');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(id, { status: 'completed' });
      setOrder((prev) => ({ ...prev, status: 'completed' }));
    } catch {
      setError('Failed to complete order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!order) return null;

  const items = order.items || [];
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.price +
      (item.addons ? item.addons.reduce((aSum, addon) => aSum + addon.price, 0) : 0),
    0
  );
  const verified = !!order.discountApplied;

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/orders">
          Orders
        </Link>
        <Typography color="text.primary">Order #{order._id}</Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Order #{order._id}</Typography>
              {order.status && (
                <Chip
                  label={order.status}
                  color={STATUS_COLORS[order.status] || 'default'}
                  size="small"
                />
              )}
            </Stack>
          }
          subheader={STATUS_LABELS[order.status] || ''}
          sx={{
            borderBottom: '1px solid #e0e0e0',
            pb: 2,
            fontWeight: 'semibold',
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {items.map((item, idx) => (
              <Box key={idx} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography fontWeight="bold">{item.productName}</Typography>
                    {item.addons && item.addons.length > 0 && (
                      <Box sx={{ mt: 1, ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Addons:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {item.addons.map((addon, aIdx) => (
                            <li key={aIdx}>
                              <Typography variant="body2">
                                {addon.addonName} (+P{addon.price})
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>P{item.price}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal</Typography>
              <Typography>P{subtotal}</Typography>
            </Box>
            {order.discountDetails && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color={verified ? 'success.main' : 'error.main'}>
                  Discount: {order.discountDetails.name} - {verified ? 'Discount Applied' : 'Requires Verification'}
                  
                </Typography>
                <Typography color={verified ? 'success.main' : 'error.main'}>
                  -{(order.discountDetails.percentage * 100).toFixed(0)}%
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">P{order?.total}</Typography>
            </Box>
          </Box>
          {order.status === 'ready' && order.discountDetails && !verified && (
            <Alert severity="info" sx={{ mt: 3, mb: 1 }}>
              Customer must show ID for discount verification.
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {order.status === 'pending' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMarkAsReady}
                disabled={loading}
              >
                Mark as Ready
              </Button>
            )}

            {order.status === 'ready' && order.discountDetails && !verified && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyID}
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Verify ID'}
              </Button>
            )}

            {order.status === 'ready' && (!order.discountDetails || verified) && (
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteOrder}
                disabled={loading}
              >
                Check out
              </Button>
            )}
          </Stack>

        </CardContent>
      </Card>
    </>
  );
};

export default OrderShow;
