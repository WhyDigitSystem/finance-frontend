import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
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
import apiCalls from 'apicall';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ArcElement, Tooltip, Legend);

// Background colors for cards
const cardColors = [
  'linear-gradient(135deg, #ff416c, #ff4b2b)', // Pink-Red
  'linear-gradient(135deg, #36d1dc, #5b86e5)', // Cyan-Blue
  'linear-gradient(135deg, #11998e, #38ef7d)', // Green-Turquoise
  'linear-gradient(135deg, #f7971e, #ffd200)' // Orange-Yellow
];

const icons = [
  <TrendingUpOutlinedIcon fontSize="inherit" />, // Revenue
  <TrendingDownOutlinedIcon fontSize="inherit" />, // Cost
  <AccountBalanceWalletOutlinedIcon fontSize="inherit" />, // Accounts Receivable
  <LocalMallOutlinedIcon fontSize="inherit" /> // Accounts Payable
];

const StatCard = ({ statsPercentage, stats, title, monthlyValue, yearlyValue, color, icon, isYearly, setIsYearly, showToggle }) => {
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
                <Button sx={{ px: 1, minWidth: 'auto' }} onClick={() => setIsYearly(false)} color={!isYearly ? 'dark' : 'inherit'}>
                  <span style={{ color: !isYearly ? 'white' : 'black' }}>Month</span>
                </Button>
                <Button sx={{ px: 1, minWidth: 'auto' }} onClick={() => setIsYearly(true)} color={isYearly ? 'dark' : 'inherit'}>
                  <span style={{ color: isYearly ? 'white' : 'black' }}>Year</span>
                </Button>
              </ButtonGroup>
            </Grid>
          )}
        </Grid>
        <Typography variant="h5" mt={2}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {isYearly ? `₹${Math.round(yearlyValue).toLocaleString('en-IN')}` : `₹${Math.round(monthlyValue).toLocaleString('en-IN')}`}
        </Typography>
        <hr style={{ margin: '10px' }} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{stats}</Typography>
          <Typography variant="h5">{statsPercentage}</Typography>
        </Grid>
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
    responsive: true,
    maintainAspectRatio: false,
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
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        width: '100%',
        height: '100%'
      }}
    >
      <CardContent sx={{ width: '100%', height: '300px', alignItems: 'center' }}>
        <Typography variant="h6" textAlign="center" mb={2}>
          Sales Distribution
        </Typography>
        <div style={{ position: 'relative', width: '100%', height: '100%', alignItems: 'center' }}>
          <Pie data={data} options={options} />
        </div>
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
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 4,
        borderRadius: 3,
        overflow: 'hidden',
        background: '#F9FAFB',
        border: '1px solid #E5E7EB'
      }}
    >
      {/* Table Title */}
      <Typography
        variant="h6"
        sx={{
          p: 1,
          background: 'linear-gradient(135deg, #1E3A8A, #1E40AF)',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: 1.2,
          textTransform: 'uppercase'
        }}
      >
        GSTR Details
      </Typography>

      {/* Table Component */}
      <Table size="small">
        {/* Table Header */}
        <TableHead sx={{ background: '#1E3A8A' }}>
          <TableRow>
            {['S.No', 'Customer', 'Invoice (₹)', 'Tax (₹)', 'IGST (₹)', 'SGST (₹)', 'CGST (₹)'].map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                  padding: '8px',
                  borderBottom: '0px solid #1E40AF',
                  fontSize: '0.9rem'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {gstrData.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                background: index % 2 === 0 ? '#E3E7FF' : '#FFFFFF',
                '&:hover': { background: '#C7D2FE' },
                transition: 'background 0.2s ease-in-out'
              }}
            >
              <TableCell sx={{ py: 1, textAlign: 'center', fontWeight: 500, fontSize: '0.875rem' }}>{index + 1}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontSize: '0.875rem' }}>{row.customer}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                {row.invoiceValue.toLocaleString('en-IN')}
              </TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontSize: '0.875rem' }}>{row.tax.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontSize: '0.875rem' }}>{row.igst.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontSize: '0.875rem' }}>{row.sgst.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontSize: '0.875rem' }}>{row.cgst.toLocaleString('en-IN')}</TableCell>
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
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 4,
        borderRadius: 3,
        overflow: 'hidden',
        background: '#F9FAFB'
      }}
    >
      {/* Table Title */}
      <Typography
        variant="h6"
        sx={{
          p: 1,
          background: 'linear-gradient(135deg, #0288D1, #01579B)',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: 1.1
        }}
      >
        TDS Summary
      </Typography>

      {/* Table Component */}
      <Table size="small">
        {/* Table Header */}
        <TableHead sx={{ background: '#0288D1' }}>
          <TableRow>
            {['S.No', 'Vendor', 'Invoice (₹)', 'TDS 2% (₹)', 'TDS 10% (₹)', 'TDS 1% (₹)', 'TDS Nil (₹)'].map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                  padding: '8px',
                  borderBottom: '2px solid #01579B'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {tdsData.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                background: index % 2 === 0 ? '#E1F5FE' : '#FFFFFF',
                '&:hover': { background: '#B3E5FC' }
              }}
            >
              <TableCell sx={{ py: 1, textAlign: 'center', fontWeight: 500 }}>{index + 1}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center' }}>{row.vendor}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center', fontWeight: 600 }}>{row.invoiceValue.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center' }}>{row.tds2.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center' }}>{row.tds10.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center' }}>{row.tds1.toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ py: 1, textAlign: 'center' }}>{row.tdsNill.toLocaleString('en-IN')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const LineChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 45, 28, 50, 60, 70],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.4
      }
    ]
  };

  // return <Line data={data} />;
  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6"></Typography>
        {/* <Bar data={data} options={options} /> */}
        <Line data={data} />
      </CardContent>
    </Card>
  );
};

const StackedBarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Product A',
        data: [30, 40, 50, 60],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        stack: 'group1' // Group stack
      },
      {
        label: 'Product B',
        data: [20, 30, 40, 50],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        stack: 'group1' // Group stack
      }
    ]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Stacked Bar Chart'
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true // Stacks bars along the X-axis
      },
      y: {
        stacked: true // Stacks bars along the Y-axis
      }
    }
  };

  // return <Bar data={data} options={options} />;
  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6"></Typography>
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export { GSTRTable, TDSTable };

const DashboardNew = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [totalOrderYear, setTotalOrderYear] = useState(0);
  const [totalCostYear, setTotalCostYear] = useState(0);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const getTargetMonth = (isYearly) => {
    if (isYearly) return 'ALL';
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const getDashboardRevenue = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `taxInvoice/getDsahboardRevenue?billMonth=${targetMonth}&finYear=${finYear}&orgId=${orgId}`);

      const totalOrderYear = Number(response.paramObjectsMap.taxInvoiceVO[0]?.amount || 0);
      setTotalOrderYear(totalOrderYear);
    } catch (error) {
      console.error('Error fetching dashboard revenue:', error);
    }
  }, [finYear, orgId, isYearly]); // Depend on `isYearly`

  const getDashboardCost = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `costInvoice/getDsahboardCost?billMonth=${targetMonth}&finYear=${finYear}&orgId=${orgId}`);

      const totalCostYear = Number(response.paramObjectsMap.cost[0]?.amount || 0);
      setTotalCostYear(totalCostYear);
    } catch (error) {
      console.error('Error fetching dashboard cost:', error);
    }
  }, [finYear, orgId, isYearly]); // Depend on `isYearly`

  useEffect(() => {
    getDashboardRevenue();
    getDashboardCost();
  }, [getDashboardRevenue, getDashboardCost]);

  // Update financial data dynamically
  const financialData = [
    { stats: 'ETH', statsPercentage: '+4.6%', title: 'Revenue', monthly: totalOrderYear, yearly: totalOrderYear },
    { stats: 'ETH', statsPercentage: '-7.4%', title: 'Cost', monthly: totalCostYear, yearly: totalCostYear },
    { stats: 'ETH', statsPercentage: '0%', title: 'Accounts Receivable', monthly: 0, yearly: 0 },
    { stats: 'ETH', statsPercentage: '0%', title: 'Accounts Payable', monthly: 0, yearly: 0 }
  ];

  return (
    <Grid container spacing={2} p={1}>
      {financialData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={data.title}>
          <StatCard
            statsPercentage={data.statsPercentage}
            stats={data.stats}
            title={data.title}
            monthlyValue={data.monthly}
            yearlyValue={data.yearly}
            color={cardColors[index]}
            icon={icons[index]}
            isYearly={isYearly}
            setIsYearly={setIsYearly}
            showToggle={index === 0}
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
      <Grid item xs={12} md={6}>
        <LineChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <StackedBarChart />
      </Grid>
    </Grid>
  );
};

export default DashboardNew;
