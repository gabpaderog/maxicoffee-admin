import { DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';
import axiosInstance from '../config/axios';

const getAddonsStore = async () => {
  try {
    const res = await axiosInstance.get('/addons');
    return res.data;
  } catch (error) {
    console.error('Error fetching addons store:', error);
    return [];
  }
};

const setAddonsStore = (value) => {
  return localStorage.setItem('addons-store', JSON.stringify(value));
};

const getAddonsFromLocal = () => {
  const stored = localStorage.getItem('addons-store');
  return stored ? JSON.parse(stored) : [];
};

/**
 * Update addon in both localStorage and remote API if possible.
 * If addon exists in remote, update via API, else update local.
 */
const updateAddon = async (addonId, data) => {
  try {
    const res = await axiosInstance.patch(`/addons/${addonId}`, data);
    let addons = getAddonsFromLocal();
    addons = addons.map((addon) =>
      addon._id === addonId ? { ...addon, ...data } : addon
    );
    setAddonsStore(addons);
    return res.data;
  } catch (err) {
    const addons = getAddonsFromLocal();
    let updatedAddon = null;
    const updatedAddons = addons.map((addon) => {
      if (addon._id === addonId) {
        updatedAddon = { ...addon, ...data };
        return updatedAddon;
      }
      return addon;
    });
    if (!updatedAddon) throw new Error('Addon not found');
    setAddonsStore(updatedAddons);
    return updatedAddon;
  }
};

export const AddonsDataSource = {
  fields: [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
    { field: 'isGlobal', headerName: 'Is Global', type: 'boolean', flex: 1 },
    { field: 'available', headerName: 'Available', type: 'boolean', flex: 1 },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const addons = (await getAddonsStore()).map((addon) => ({
      ...addon,
      id: addon._id,
    }));
    let filteredAddons = [...addons];

    setAddonsStore(filteredAddons);

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredAddons = filteredAddons.filter((addon) => {
          const fieldValue = addon[field];
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
      filteredAddons.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginated = filteredAddons.slice(start, end);

    return {
      items: paginated,
      itemCount: filteredAddons.length,
    };
  },
  getOne: async (addonId) => {
    try {
      const res = await axiosInstance.get(`/addons/${addonId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching addon:', error);
      return [];
    }
  },
  createOne: async (data) => {
    const addons = getAddonsFromLocal();

    const newAddon = {
      _id: addons.reduce((max, addon) => Math.max(max, addon._id), 0) + 1,
      ...data,
    };

    const updated = [...addons, newAddon];
    setAddonsStore(updated);
    return newAddon;
  },
  updateOne: async (addonId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const addons = getAddonsFromLocal();
    let updatedAddon = null;

    const updatedAddons = addons.map((addon) => {
      if (addon._id === addonId) {
        updatedAddon = { ...addon, ...data };
        return updatedAddon;
      }
      return addon;
    });

    if (!updatedAddon) throw new Error('Addon not found');

    setAddonsStore(updatedAddons);
    return updatedAddon;
  },
  deleteOne: async (addonId) => {
    try {
      await axiosInstance.delete(`/addons/${addonId}`);
    } catch (error) {
      console.error('Failed to delete addon from API:', error);
    }
    const addons = getAddonsFromLocal();
    const filtered = addons.filter((addon) => addon._id !== addonId);
    setAddonsStore(filtered);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    price: z.number({ required_error: 'Price is required' }),
    isGlobal: z.boolean({ required_error: 'Is Global is required' }),
    available: z.boolean({ required_error: 'Available is required' }),
  })['~standard'].validate,
};

export const addonsCache = new DataSourceCache();
