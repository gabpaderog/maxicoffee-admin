import { DataSourceCache } from '@toolpad/core/Crud';
import { Chip } from '@mui/material';
import { z } from 'zod';
import axiosInstance from '../config/axios';
import React from 'react';

const getProductsStore = async () => {
  try {
    const res = await axiosInstance.get('/products');
    return res.data;
  } catch (error) {
    console.error('Error fetching products store:', error);
    return [];
  }
};

const setProductsStore = (value) => {
  return localStorage.setItem('products-store', JSON.stringify(value));
};

const getProductsFromLocal = () => {
  const stored = localStorage.getItem('products-store');
  return stored ? JSON.parse(stored) : [];
};

/**
 * Update product in both localStorage and remote API if possible.
 * If product exists in remote, update via API, else update local.
 */
const updateProduct = async (productId, data) => {
  try {
    // Try updating via API
    const res = await axiosInstance.patch(`/products/${productId}`, data);
    // Optionally update local cache
    let products = getProductsFromLocal();
    products = products.map((product) =>
      product.id === productId || product._id === productId
        ? { ...product, ...data }
        : product
    );
    setProductsStore(products);
    return res.data;
  } catch (err) {
    // Fallback to local update
    const products = getProductsFromLocal();
    let updatedProduct = null;
    const updatedProducts = products.map((product) => {
      if (product.id === Number(productId)) {
        updatedProduct = { ...product, ...data };
        return updatedProduct;
      }
      return product;
    });
    if (!updatedProduct) throw new Error('Product not found');
    setProductsStore(updatedProducts);
    return updatedProduct;
  }
};

export const ProductsDataSource = {
  fields: [
    { field: 'id', 
      headerName: 'ID',
      flex: 1 
    },
    { field: 'name', 
      headerName: 'Name', 
      flex: 1
    },
    { field: 'category', 
      headerName: 'Category',
      flex: 1
    },
    { field: 'price', 
      headerName: 'Price',
      flex: 1
    },
    { field: 'status', 
      headerName: 'Status',
      flex: 1,
      renderCell: (row) => {
        const status = row.value;
        let color = 'default';
        switch (status) {
          case 'available':
            color = 'success';
            break;
          case 'unavailable':
            color = 'warning';
            break;
          default:
            color = 'default';
        } 

        console.log(row, 'row.value')
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
      valueGetter: (row) => new Date(row),
      flex: 1
    },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const products = (await getProductsStore()).map((product) => ({
      ...product,
      id: product._id,
      name: product.name,
      category: product.category.name,
      price: product.basePrice,
      status: product.available ? 'available' : 'unavailable',
      createdAt: product.createdAt
    }));
    let filteredProducts = [...products];

    setProductsStore(filteredProducts);

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredProducts = filteredProducts.filter((product) => {
          const fieldValue = product[field];
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
      filteredProducts.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginated = filteredProducts.slice(start, end);

    return {
      items: paginated,
      itemCount: filteredProducts.length,
    };
  },
  getOne: async (productId) => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return [];
    }
  },
  createOne: async (data) => {

    const products = getProductsFromLocal();

    const newProduct = {
      id: products.reduce((max, product) => Math.max(max, product.id), 0) + 1,
      ...data,
    };

    const updated = [...products, newProduct];
    setProductsStore(updated);
    return newProduct;
  },
  updateOne: async (productId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const products = getProductsFromLocal();
    let updatedProduct = null;

    const updatedProducts = products.map((product) => {
      if (product.id === Number(productId)) {
        updatedProduct = { ...product, ...data };
        return updatedProduct;
      }
      return product;
    });

    if (!updatedProduct) throw new Error('Product not found');

    setProductsStore(updatedProducts);
    return updatedProduct;
  },
  deleteOne: async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
    } catch (error) {
      console.error('Failed to delete product from API:', error);
    }
    // Remove from local storage
    const products = getProductsFromLocal().map((product) => ({
      ...product,
      id: product._id,
      name: product.name,
      category: product.category.name,
      price: product.basePrice,
      status: product.available ? 'available' : 'unavailable',
      createdAt: product.createdAt
    }));
    const filtered = products.filter((product) => product.id !== productId && product.id !== Number(productId));
    setProductsStore(filtered);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    category: z.string({ required_error: 'Category is required' }).nonempty('Category is required'),
    price: z.number({ required_error: 'Price is required' }),
    status: z.enum(['in stock', 'out of stock', 'discontinued'], {
      errorMap: () => ({ message: 'Invalid status' }),
    }),
    createdAt: z
      .string({ required_error: 'Created At is required' })
      .nonempty('Created At is required'),
  })['~standard'].validate,
};

export const productsCache = new DataSourceCache();
