import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Card,
  Tabs,
  Tab,
  Button,
  Stack,
} from '@mui/material';
import { LocalCafe, ShoppingCart, AttachMoney, TrendingUp, FileDownload } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axiosInstance from '../../../config/axios';

const DashboardShow = () => {
  const theme = useTheme();
  const [timeFrame, setTimeFrame] = useState('daily');
  const [productTimeFrame, setProductTimeFrame] = useState('day');

  // Data states
  const [summaryData, setSummaryData] = useState({});
  const [dailySalesData, setDailySalesData] = useState([]);
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [yearlySalesData, setYearlySalesData] = useState([]);
  const [topProductsByDay, setTopProductsByDay] = useState([]);
  const [topProductsByMonth, setTopProductsByMonth] = useState([]);
  const [topProductsByYear, setTopProductsByYear] = useState([]);
  const [productTrends, setProductTrends] = useState([]);
  
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
        // Fetch summary data
        const summaryRes = await axiosInstance.get('/dashboard');
        setSummaryData(summaryRes.data);
        setStats([
          {
            label: 'Pending Orders',
            value: summaryRes.data.pendingOrders,
            icon: <ShoppingCart fontSize="large" color="primary" />,
          },
          {
            label: 'Completed Orders',
            value: summaryRes.data.completedOrders,
            icon: <LocalCafe fontSize="large" color="secondary" />,
          },
          {
            label: 'Total Users',
            value: summaryRes.data.totalUsers,
            icon: <AttachMoney fontSize="large" sx={{ color: 'green' }} />,
          },
        ]);

        // Fetch sales data for all time periods
        const [dailyRes, weeklyRes, monthlyRes, yearlyRes] = await Promise.all([
          axiosInstance.get('/dashboard/dailysales'),
          axiosInstance.get('/dashboard/weeklysales'),
          axiosInstance.get('/dashboard/monthlysales'),
          axiosInstance.get('/dashboard/yearlysales'),
        ]);
        
        setDailySalesData(dailyRes.data);
        setWeeklySalesData(weeklyRes.data);
        setMonthlySalesData(monthlyRes.data);
        setYearlySalesData(yearlyRes.data);

        // Fetch product sales data
        const [productsByDay, productsByMonth, productsByYear] = await Promise.all([
          axiosInstance.get('/dashboard/productSales'),
          axiosInstance.get('/dashboard/productSalesByMonth'),
          axiosInstance.get('/dashboard/productSalesByYear')
        ]);
        
        setTopProductsByDay(productsByDay.data.products || []);
        setTopProductsByMonth(productsByMonth.data.products || []);
        setTopProductsByYear(productsByYear.data.products || []);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get current sales data based on timeframe
  const getCurrentSalesData = () => {
    switch(timeFrame) {
      case 'daily': return dailySalesData;
      case 'weekly': return weeklySalesData;
      case 'monthly': return monthlySalesData;
      case 'yearly': return yearlySalesData;
      default: return dailySalesData;
    }
  };

  // Helper function to get current product data based on timeframe
  const getCurrentProductData = () => {
    switch(productTimeFrame) {
      case 'day': return topProductsByDay;
      case 'month': return topProductsByMonth;
      case 'year': return topProductsByYear;
      default: return topProductsByDay;
    }
  };

  // Export CSV function for Sales data
  const exportSalesCSV = async () => {
    try {
      let endpoint;
      switch(timeFrame) {
        case 'daily': endpoint = '/dashboard/dailysales?export=csv'; break;
        case 'weekly': endpoint = '/dashboard/weeklysales?export=csv'; break;
        case 'monthly': endpoint = '/dashboard/monthlysales?export=csv'; break;
        case 'yearly': endpoint = '/dashboard/yearlysales?export=csv'; break;
        default: endpoint = '/dashboard/dailysales?export=csv';
      }
      
      const response = await axiosInstance.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${timeFrame}_sales.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  // Export CSV function for Products data
  const exportProductsCSV = async () => {
    try {
      let endpoint;
      switch(productTimeFrame) {
        case 'day': endpoint = '/dashboard/productSales?export=csv'; break;
        case 'month': endpoint = '/dashboard/productSalesByMonth?export=csv'; break;
        case 'year': endpoint = '/dashboard/productSalesByYear?export=csv'; break;
        default: endpoint = '/dashboard/productSales?export=csv';
      }

      const response = await axiosInstance.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${productTimeFrame}_products.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', width: '100%', p: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4} sx={{ width: '100%'}}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx} sx={{ flex: 1, display: 'flex' }}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'background.paper',
                width: '100%',
                height: '100%',
                m: 0,
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
      {/* Sales Data Chart with Tabs */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">
            Sales Overview
          </Typography>
          <Button 
            startIcon={<FileDownload />} 
            variant="outlined" 
            size="small" 
            onClick={exportSalesCSV}
          >
            Export CSV
          </Button>
        </Box>
        <Tabs
          value={timeFrame}
          onChange={(_, newValue) => setTimeFrame(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Daily" value="daily" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
          <Tab label="Yearly" value="yearly" />
        </Tabs>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getCurrentSalesData()}>
            <XAxis dataKey={timeFrame === 'daily' ? 'day' : timeFrame === 'weekly' ? 'week' : timeFrame === 'monthly' ? 'month' : 'year'} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSales" fill={theme.palette.primary.main} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Product Sales Chart with Tabs */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">
            Top Products
          </Typography>
          <Button 
            startIcon={<FileDownload />} 
            variant="outlined" 
            size="small"
            onClick={exportProductsCSV}
          >
            Export CSV
          </Button>
        </Box>
        <Tabs
          value={productTimeFrame}
          onChange={(_, newValue) => setProductTimeFrame(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Daily" value="day" />
          <Tab label="Monthly" value="month" />
          <Tab label="Yearly" value="year" />
        </Tabs>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getCurrentProductData()}>
            <XAxis dataKey="productName" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSold" fill={theme.palette.secondary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default DashboardShow;
