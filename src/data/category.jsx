import { DataSourceCache } from '@toolpad/core/Crud';
import { Chip } from '@mui/material';
import { z } from 'zod';
import axiosInstance from '../config/axios';
import React from 'react';

const getCategoriesStore = async () => {
  try {
    const res = await axiosInstance.get('/categories');
    return res.data;
  } catch (error) {
    console.error('Error fetching categories store:', error);
    return [];
  }
};

const setCategoriesStore = (value) => {
  return localStorage.setItem('categories-store', JSON.stringify(value));
};

const getCategoriesFromLocal = () => {
  const stored = localStorage.getItem('categories-store');
  return stored ? JSON.parse(stored) : [];
};

/**
 * Update category in both localStorage and remote API if possible.
 * If category exists in remote, update via API, else update local.
 */
const updateCategory = async (categoryId, data) => {
  try {
    // Try updating via API
    const res = await axiosInstance.patch(`/categories/${categoryId}`, data);
    // Optionally update local cache
    let categories = getCategoriesFromLocal();
    categories = categories.map((category) =>
      category._id === categoryId ? { ...category, ...data } : category
    );
    setCategoriesStore(categories);
    return res.data;
  } catch (err) {
    // Fallback to local update
    const categories = getCategoriesFromLocal();
    let updatedCategory = null;
    const updatedCategories = categories.map((category) => {
      if (category._id === categoryId) {
        updatedCategory = { ...category, ...data };
        return updatedCategory;
      }
      return category;
    });
    if (!updatedCategory) throw new Error('Category not found');
    setCategoriesStore(updatedCategories);
    return updatedCategory;
  }
};

export const CategoriesDataSource = {
  fields: [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
      valueGetter: (row) => new Date(row),
      flex: 1,
    },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const categories = (await getCategoriesStore()).map((category) => ({
      ...category,
      id: category._id,
      name: category.name,
      createdAt: category.createdAt,
    }));
    let filteredCategories = [...categories];

    setCategoriesStore(filteredCategories);

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredCategories = filteredCategories.filter((category) => {
          const fieldValue = category[field];
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
      filteredCategories.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginated = filteredCategories.slice(start, end);

    return {
      items: paginated,
      itemCount: filteredCategories.length,
    };
  },
  getOne: async (categoryId) => {
    try {
      const res = await axiosInstance.get(`/categories/${categoryId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return [];
    }
  },
  createOne: async (data) => {
    const categories = getCategoriesFromLocal();

    const newCategory = {
      _id: categories.reduce((max, category) => Math.max(max, category._id), 0) + 1,
      ...data,
    };

    const updated = [...categories, newCategory];
    setCategoriesStore(updated);
    return newCategory;
  },
  updateOne: async (categoryId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const categories = getCategoriesFromLocal();
    let updatedCategory = null;

    const updatedCategories = categories.map((category) => {
      if (category._id === categoryId) {
        updatedCategory = { ...category, ...data };
        return updatedCategory;
      }
      return category;
    });

    if (!updatedCategory) throw new Error('Category not found');

    setCategoriesStore(updatedCategories);
    return updatedCategory;
  },
  deleteOne: async (categoryId) => {
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error('Failed to delete category from API:', error);
    }
    // Remove from local storage
    const categories = getCategoriesFromLocal();
    const filtered = categories.filter((category) => category._id !== categoryId);
    setCategoriesStore(filtered);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    createdAt: z
      .string({ required_error: 'Created At is required' })
      .nonempty('Created At is required'),
  })['~standard'].validate,
};

export const categoriesCache = new DataSourceCache();
