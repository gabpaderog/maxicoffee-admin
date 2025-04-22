import { DataSourceCache } from '@toolpad/core/Crud';
import { Chip } from '@mui/material';
import { boolean, z } from 'zod';
import axiosInstance from '../config/axios';
import React from 'react';

const getDiscountsStore = async () => {
  try {
    const res = await axiosInstance.get('/discounts');
    return res.data;
  } catch (error) {
    console.error('Error fetching discounts store:', error);
    return [];
  }
};

const setDiscountsStore = (value) => {
  return localStorage.setItem('discounts-store', JSON.stringify(value));
};

const getDiscountsFromLocal = () => {
  const stored = localStorage.getItem('discounts-store');
  return stored ? JSON.parse(stored) : [];
};

/**
 * Update discount in both localStorage and remote API if possible.
 * If discount exists in remote, update via API, else update local.
 */
const updateDiscount = async (discountId, data) => {
  try {
    // Try updating via API
    const res = await axiosInstance.patch(`/discounts/${discountId}`, data);
    // Optionally update local cache
    let discounts = getDiscountsFromLocal();
    discounts = discounts.map((discount) =>
      discount._id === discountId ? { ...discount, ...data } : discount
    );
    setDiscountsStore(discounts);
    return res.data;
  } catch (err) {
    // Fallback to local update
    const discounts = getDiscountsFromLocal();
    let updatedDiscount = null;
    const updatedDiscounts = discounts.map((discount) => {
      if (discount._id === discountId) {
        updatedDiscount = { ...discount, ...data };
        return updatedDiscount;
      }
      return discount;
    });
    if (!updatedDiscount) throw new Error('Discount not found');
    setDiscountsStore(updatedDiscounts);
    return updatedDiscount;
  }
};

export const DiscountsDataSource = {
  fields: [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'percentage', headerName: 'Percentage (in decimal)', flex: 1 },
    { field: 'requiresVerification', headerName: 'Requires Verification', type: 'boolean' , flex: 1 },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const discounts = (await getDiscountsStore()).map((discount) => ({
      ...discount,
      id: discount._id,
      name: discount.name,
      percentage: discount.percentage,
      requiresVerification: discount.requiresVerification,
    }));
    let filteredDiscounts = [...discounts];

    setDiscountsStore(filteredDiscounts);

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredDiscounts = filteredDiscounts.filter((discount) => {
          const fieldValue = discount[field];
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
      filteredDiscounts.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginated = filteredDiscounts.slice(start, end);

    return {
      items: paginated,
      itemCount: filteredDiscounts.length,
    };
  },
  getOne: async (discountId) => {
    try {
      const res = await axiosInstance.get(`/discounts/${discountId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching discount:', error);
      return [];
    }
  },
  createOne: async (data) => {
    const discounts = getDiscountsFromLocal();

    const newDiscount = {
      _id: discounts.reduce((max, discount) => Math.max(max, discount._id), 0) + 1,
      ...data,
    };

    const updated = [...discounts, newDiscount];
    setDiscountsStore(updated);
    return newDiscount;
  },
  updateOne: async (discountId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const discounts = getDiscountsFromLocal();
    let updatedDiscount = null;

    const updatedDiscounts = discounts.map((discount) => {
      if (discount._id === discountId) {
        updatedDiscount = { ...discount, ...data };
        return updatedDiscount;
      }
      return discount;
    });

    if (!updatedDiscount) throw new Error('Discount not found');

    setDiscountsStore(updatedDiscounts);
    return updatedDiscount;
  },
  deleteOne: async (discountId) => {
    try {
      await axiosInstance.delete(`/discounts/${discountId}`);
    } catch (error) {
      console.error('Failed to delete discount from API:', error);
    }
    // Remove from local storage
    const discounts = getDiscountsFromLocal();
    const filtered = discounts.filter((discount) => discount._id !== discountId);
    setDiscountsStore(filtered);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    percentage: z
      .number({ required_error: 'Percentage is required' })
      .min(0, 'Percentage must be at least 0')
      .max(1, 'Percentage must be at most 1'),
    requiresVerification: z.boolean({ required_error: 'Requires Verification is required' }),
  })['~standard'].validate,
};

export const discountsCache = new DataSourceCache();
