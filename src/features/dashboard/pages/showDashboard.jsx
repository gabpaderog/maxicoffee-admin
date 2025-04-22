import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Card,
} from '@mui/material';
import { LocalCafe, ShoppingCart, AttachMoney } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import axiosInstance from '../../../config/axios';

const DashboardShow = () => {
  const theme = useTheme();

  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [stats, setStats] = useState([
    {
      label: 'Pending Orders',
      value: 0,
      icon: <ShoppingCart fontSize="large" color="primary" />,
    },
    {
      label: 'Completed Orders',
      value: 0,
      icon: <LocalCafe fontSize="large" color="secondary" />,
    },
    {
      label: 'Total Users',
      value: 0,
      icon: <AttachMoney fontSize="large" sx={{ color: 'green' }} />,
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, monthlySalesRes] = await Promise.all([
          axiosInstance.get('/dashboard'),
          axiosInstance.get('/dashboard/monthlysales'),
        ]);

        const summary = summaryRes.data;
        const monthly = monthlySalesRes.data;

        setStats([
          {
            label: 'Pending Orders',
            value: summary.pendingOrders,
            icon: <ShoppingCart fontSize="large" color="primary" />,
          },
          {
            label: 'Completed Orders',
            value: summary.completedOrders,
            icon: <LocalCafe fontSize="large" color="secondary" />,
          },
          {
            label: 'Total Users',
            value: summary.totalUsers,
            icon: <AttachMoney fontSize="large" sx={{ color: 'green' }} />,
          },
        ]);

        setMonthlySalesData(monthly);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', width: '100%' }}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4} sx={{ width: '100%', margin: 0 }}>
        {stats.map((stat, idx) => (
          <Grid size={4} key={idx}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h6">{stat.value}</Typography>
              </Box>
              <Box>{stat.icon}</Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Sales Chart */}
      <Grid sx={{ pt: 3, width: '100%' }}>
        <Grid sx={{ height: 360, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Monthly Sales
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={monthlySalesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalSales"
                fill={theme.palette.primary.main}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardShow;
