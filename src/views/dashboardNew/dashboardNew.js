import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

// Background colors for cards
const cardColors = [
  'linear-gradient(135deg, #ff416c, #ff4b2b)', // Pink-Red
  'linear-gradient(135deg, #36d1dc, #5b86e5)', // Cyan-Blue
  'linear-gradient(135deg, #11998e, #38ef7d)', // Green-Turquoise
  'linear-gradient(135deg, #f7971e, #ffd200)' // Orange-Yellow
];

const icons = [
  <TrendingUpOutlinedIcon fontSize="inherit" />, // Revenue
  <AttachMoneyOutlinedIcon fontSize="inherit" />, // Cost
  <AccountBalanceWalletOutlinedIcon fontSize="inherit" />, // Accounts Receivable
  <LocalMallOutlinedIcon fontSize="inherit" /> // Accounts Payable
];

const StatCard = ({ title, monthlyValue, yearlyValue, color, icon, isYearly, setIsYearly, showToggle }) => {
  const theme = useTheme();

  return (
    <Card sx={{ backgroundImage: color, color: '#fff', p: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Avatar
              variant="rounded"
              sx={{
                backgroundColor: theme.palette.grey[900],
                color: '#fff',
                width: 36,
                height: 36
              }}
            >
              {icon}
            </Avatar>
          </Grid>
          {showToggle && (
            <Grid item>
              <ButtonGroup size="small" variant="contained">
                <Button sx={{ px: 1, minWidth: 'auto' }} onClick={() => setIsYearly(false)} color={!isYearly ? 'primary' : 'inherit'}>
                  M
                </Button>
                <Button sx={{ px: 1, minWidth: 'auto' }} onClick={() => setIsYearly(true)} color={isYearly ? 'primary' : 'inherit'}>
                  Y
                </Button>
              </ButtonGroup>
            </Grid>
          )}
        </Grid>
        <Typography variant="h5" mt={2}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {isYearly ? `₹${yearlyValue.toLocaleString('en-IN')}` : `₹${monthlyValue.toLocaleString('en-IN')}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

const TopCustomersChart = () => {
  const data = {
    labels: ['Customer A', 'Customer B', 'Customer C', 'Customer D', 'Customer E'],
    datasets: [
      {
        label: 'Product X',
        data: [5000, 7000, 6000, 4000, 8000],
        backgroundColor: '#FF5733'
      },
      {
        label: 'Product Y',
        data: [4000, 5000, 7000, 3000, 9000],
        backgroundColor: '#33B5E5'
      },
      {
        label: 'Product Z',
        data: [3000, 3000, 5000, 3000, 5000],
        backgroundColor: '#33D68A'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6">Top 5 Customers (Product-wise)</Typography>
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};

const SalesDistributionChart = () => {
  const data = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 25, 20, 15, 10],
        backgroundColor: ['#FF5733', '#33B5E5', '#33D68A', '#FFC107', '#8E44AD']
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          usePointStyle: true,
          font: {
            size: 12
          }
        },
        align: 'start'
      }
    },
    responsive: true
  };

  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardContent>
        <Typography variant="h6" textAlign="center">
          Sales Distribution
        </Typography>
        <Pie data={data} options={options} width={219} />
      </CardContent>
    </Card>
  );
};

const GSTRTable = () => {
  const gstrData = [
    { customer: 'Cus 1', invoiceValue: 200000, tax: 36000, igst: 36000, sgst: 0, cgst: 0 },
    { customer: 'Cus 2', invoiceValue: 100000, tax: 18000, igst: 0, sgst: 9000, cgst: 9000 },
    { customer: 'Cus 3', invoiceValue: 50000, tax: 9000, igst: 9000, sgst: 0, cgst: 0 },
    { customer: 'Cus 4', invoiceValue: 400000, tax: 72000, igst: 0, sgst: 36000, cgst: 36000 },
    { customer: 'Cus 5', invoiceValue: 300000, tax: 54000, igst: 0, sgst: 27000, cgst: 27000 }
  ];

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 1, background: '#FF5733', color: '#fff' }}>
        GSTR
      </Typography>
      <Table size="small">
        <TableHead sx={{ background: '#FFEBEE' }}>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Invoice Value</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>IGST</TableCell>
            <TableCell>SGST</TableCell>
            <TableCell>CGST</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gstrData.map((row, index) => (
            <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FCE4EC' : '#FFF' }}>
              <TableCell sx={{ py: 0.7 }}>{index + 1}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.customer}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.invoiceValue.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.tax.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.igst.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.sgst.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.cgst.toLocaleString('en-IN')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TDSTable = () => {
  const tdsData = [
    { vendor: 'Ven 1', invoiceValue: 200000, tds2: 2000, tds10: 0, tds1: 0, tdsNill: 0 },
    { vendor: 'Ven 2', invoiceValue: 100000, tds2: 0, tds10: 0, tds1: 0, tdsNill: 0 },
    { vendor: 'Ven 3', invoiceValue: 50000, tds2: 0, tds10: 5000, tds1: 0, tdsNill: 0 },
    { vendor: 'Ven 4', invoiceValue: 400000, tds2: 0, tds10: 0, tds1: 4000, tdsNill: 0 },
    { vendor: 'Ven 5', invoiceValue: 300000, tds2: 3000, tds10: 0, tds1: 0, tdsNill: 0 }
  ];

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 1, background: '#33B5E5', color: '#fff' }}>
        TDS
      </Typography>
      <Table size="small">
        <TableHead sx={{ background: '#E3F2FD' }}>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell sx={{ py: 0.7 }}>Vendor</TableCell>
            <TableCell sx={{ py: 0.7 }}>Invoice Value</TableCell>
            <TableCell sx={{ py: 0.7 }}>TDS 2%</TableCell>
            <TableCell sx={{ py: 0.7 }}>TDS 10%</TableCell>
            <TableCell sx={{ py: 0.7 }}>TDS 1%</TableCell>
            <TableCell sx={{ py: 0.7 }}>TDS Nil</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tdsData.map((row, index) => (
            <TableRow key={index} sx={{ background: index % 2 === 0 ? '#E1F5FE' : '#FFF' }}>
              <TableCell sx={{ py: 0.7 }}>{index + 1}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.vendor}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.invoiceValue.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.tds2.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.tds10.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.tds1.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 0.7 }}>{row.tdsNill.toLocaleString('en-IN')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { GSTRTable, TDSTable };

const DashboardNew = () => {
  const [isYearly, setIsYearly] = useState(false);

  const financialData = [
    { title: 'Revenue', monthly: 50000, yearly: 600000 },
    { title: 'Cost', monthly: 20000, yearly: 240000 },
    { title: 'Accounts Receivable', monthly: 15000, yearly: 180000 },
    { title: 'Accounts Payable', monthly: 12000, yearly: 144000 }
  ];

  return (
    <Grid container spacing={2} p={1}>
      {financialData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={data.title}>
          <StatCard
            title={data.title}
            monthlyValue={data.monthly}
            yearlyValue={data.yearly}
            color={cardColors[index]}
            icon={icons[index]}
            isYearly={isYearly}
            setIsYearly={setIsYearly}
            showToggle={index === 0} // Show toggle only on the first card
          />
        </Grid>
      ))}
      <Grid item xs={12} md={6}>
        <TopCustomersChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <SalesDistributionChart />
      </Grid>

      <Grid item xs={12} md={6}>
        <GSTRTable />
      </Grid>
      <Grid item xs={12} md={6}>
        <TDSTable />
      </Grid>
    </Grid>
  );
};

export default DashboardNew;
