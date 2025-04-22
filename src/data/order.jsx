import { DataSourceCache } from '@toolpad/core/Crud';
import { Chip } from '@mui/material';
import { set, z } from 'zod';
import axiosInstance from '../config/axios';
import React from 'react';

const getOrdersStore = async () => {
  try {
    const res = await axiosInstance.get('/orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching orders store:', error);
    return [];
  }
};

const setOrdersStore = (value) => {
  return localStorage.setItem('orders-store', JSON.stringify(value));
};

const getOrdersFromLocal = () => {
  const stored = localStorage.getItem('orders-store');
  return stored ? JSON.parse(stored) : [];
};

/**
 * Update order in both localStorage and remote API if possible.
 * If order exists in remote, update via API, else update local.
 */
const updateOrder = async (orderId, data) => {
  try {
    // Try updating via API
    const res = await axiosInstance.patch(`/orders/${orderId}`, data);
    // Optionally update local cache
    let orders = getOrdersFromLocal();
    orders = orders.map((order) =>
      order.id === orderId || order._id === orderId
        ? { ...order, ...data }
        : order
    );
    setOrdersStore(orders);
    return res.data;
  } catch (err) {
    // Fallback to local update
    const orders = getOrdersFromLocal();
    let updatedOrder = null;
    const updatedOrders = orders.map((order) => {
      if (order.id === Number(orderId)) {
        updatedOrder = { ...order, ...data };
        return updatedOrder;
      }
      return order;
    });
    if (!updatedOrder) throw new Error('Order not found');
    setOrdersStore(updatedOrders);
    return updatedOrder;
  }
};

export const OrdersDataSource = {
  fields: [
    { field: 'id', 
      headerName: 'ID',
      flex: 1 
    },
    { field: 'name', 
      headerName: 'Name', 
      flex: 1
    },
    { field: 'status', 
      headerName: 'Status',
      flex: 1,
      renderCell: (row) => {
        const status = row.value;
    
        let color = 'default';
    
        switch (status) {
          case 'pending':
            color = 'info';
            break;
          case 'ready':
            color = 'warning';
            break;
          case 'completed':
            color = 'success';
            break;
          default:
            color = 'default';
        } 
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      valueGetter: (row) => new Date(row),
      flex: 1
    },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const orders = (await getOrdersStore()).map((order) => ({
      ...order,
      id: order._id,
      name: order.user?.name,
      status: order.status,
      date: order.createdAt
    }));
    let filteredOrders = [...orders];

    setOrdersStore(filteredOrders);

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredOrders = filteredOrders.filter((order) => {
          const fieldValue = order[field];
          switch (operator) {
            case 'contains':
              return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return fieldValue === value;
            case 'startsWith':
              return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return fieldValue > value;
            case '<':
              return fieldValue < value;
            default:
              return true;
          }
        });
      });
    }

    if (sortModel?.length) {
      filteredOrders.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginated = filteredOrders.slice(start, end);

    return {
      items: paginated,
      itemCount: filteredOrders.length,
    };
  },
  getOne: async (orderId) => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching orders store:', error);
      return [];
    }
  },
  createOne: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const orders = getOrdersFromLocal();

    const newOrder = {
      id: orders.reduce((max, order) => Math.max(max, order.id), 0) + 1,
      ...data,
    };

    const updated = [...orders, newOrder];
    setOrdersStore(updated);
    return newOrder;
  },
  updateOne: async (orderId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const orders = getOrdersFromLocal();
    let updatedOrder = null;

    const updatedOrders = orders.map((order) => {
      if (order.id === Number(orderId)) {
        updatedOrder = { ...order, ...data };
        return updatedOrder;
      }
      return order;
    });

    if (!updatedOrder) throw new Error('Order not found');

    setOrdersStore(updatedOrders);
    return updatedOrder;
  },
  deleteOne: async (orderId) => {
    await new Promise((resolve) => setTimeout(resolve, 750));
    // Remove from remote API
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Failed to delete order from API:', error);
    }
    // Remove from local storage
    const orders = getOrdersFromLocal().map((order) => ({
      ...order,
      id: order._id ?? order.id,
      name: order.user?.name ?? order.name,
      status: order.status,
      date: order.createdAt ?? order.date
    }));
    const filtered = orders.filter((order) => order.id !== orderId && order.id !== Number(orderId));
    setOrdersStore(filtered);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    date: z
      .string({ required_error: 'Date is required' })
      .nonempty('Date is required'),
    status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled'], {
      errorMap: () => ({ message: 'Invalid status' }),
    }),
  })['~standard'].validate,
};

export const ordersCache = new DataSourceCache();
