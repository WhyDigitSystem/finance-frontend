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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Box } from '@mui/system';
import NoDataAvailable from 'utils/NoData';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartDataLabels, Title, ArcElement, Tooltip, Legend);

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

const StatCard = ({ statsPercentageMonthly, statsPercentageYearly, stats, title, monthlyValue, yearlyValue, color, icon, isYearly, setIsYearly, showToggle }) => {
  const theme = useTheme();

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return "N/A";
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2); // You can adjust decimal places
  };

  const percentageChange = isYearly
    ? getPercentageChange(yearlyValue, statsPercentageYearly)
    : getPercentageChange(monthlyValue, statsPercentageMonthly);

  const isPositive = percentageChange !== "N/A" && parseFloat(percentageChange) >= 0;


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
              <ButtonGroup size="small">
                <Button
                  sx={{
                    px: 1,
                    // py: 1.2,
                    minWidth: "auto",
                    // borderRadius: "8px",
                    // border: "2px solid",
                    border: !isYearly ? "none" : "none",
                    borderColor: !isYearly ? "#121926" : "transparent",
                    backgroundColor: !isYearly ? "#121926" : "",
                    color: !isYearly ? "white" : "grey.700",
                    fontWeight: "bold",
                    // boxShadow: !isYearly ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: !isYearly ? "#121926" : "",
                      transform: !isYearly ? "scale(1.05)" : "none",
                      border: !isYearly ? "none" : "none",
                      // borderColor: !isYearly ? "#121926" : "transparent",
                    },
                  }}
                  onClick={() => setIsYearly(false)}
                >
                  Month
                </Button>
                <Button
                  sx={{
                    px: 1,
                    // py: 1.2,
                    minWidth: "auto",
                    // borderRadius: "8px",
                    // border: "2px solid",
                    border: isYearly ? "none" : "none",
                    borderColor: isYearly ? "#121926" : "transparent",
                    backgroundColor: isYearly ? "#121926" : "",
                    color: isYearly ? "white" : "grey.700",
                    fontWeight: "bold",
                    // boxShadow: isYearly ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: isYearly ? "#121926" : "",
                      transform: isYearly ? "scale(1.05)" : "none",
                      border: isYearly ? "none" : "none",
                    },
                  }}
                  onClick={() => setIsYearly(true)}
                >
                  Year
                </Button>
              </ButtonGroup>
            </Grid>
          )}
        </Grid>
        <Typography variant="h5" mt={2}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {isYearly
            ? `₹${Math.round(yearlyValue).toLocaleString('en-IN')}`
            : `₹${Math.round(monthlyValue).toLocaleString('en-IN')}`}
        </Typography>

        <hr style={{ margin: '10px' }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{stats}</Typography>
          <Typography variant="h5" sx={{ color: 'balck' }}>
            {percentageChange !== "N/A" && (
              <>
                {isPositive ? '+' : ''}
                {percentageChange}%
              </>
            )}
          </Typography>
        </Grid>

      </CardContent>
    </Card>
  );
};

const TopCustomersChart = ({ chartData }) => {

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        clip: false,
        formatter: (value) => `${value}L`,
        font: {
          weight: 'bold',
          size: 12,
        },
      }
    },

    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 120, 
        ticks: {
          stepSize: 10,
          callback: (value) => `${value.toFixed(2)}L`,
        },
      },
    },
  };

  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent>
        <Typography variant="h6">Top 5 Customers</Typography>
        {chartData && chartData.labels.length > 0 ? (
          <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        ) : (
          <>
            <NoDataAvailable />
            <Typography sx={{ textAlign: 'center' }}>No Data Available</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const SalesDistributionChart = ({ loading, error, salesData }) => {

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 10,
          usePointStyle: true,
          font: { size: 12 },
        },
        align: "start",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `₹${value.toLocaleString("en-IN")}L`;
          },
        },
        bodyFont: {
          weight: 'bold',
          size: 13
        }
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value) => `${value}L`
      }
    },
  };

  return (
    <Card sx={{ p: 1, boxShadow: 3, borderRadius: 2, width: "100%", height: "100%" }}>
      <CardContent sx={{ width: "100%", height: "300px", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">
          Sales Distribution
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <>
            <NoDataAvailable />
            <Typography sx={{ textAlign: 'center' }}>No Data Available</Typography>
          </>
        ) : (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Pie data={salesData} options={options} plugins={[ChartDataLabels]} />
          </div>
        )}
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

const TDSTable = ({ tdsData }) => {
  console.log("TDSDATA", tdsData);
  const [openTdsSummary, setOpenTdsSummary] = useState(false);

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 4, borderRadius: 3, overflow: "hidden", background: "#F9FAFB" }}
    >
      {/* Header with View Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          background: "linear-gradient(135deg, #0288D1, #01579B)",
          color: "#fff",
          fontWeight: "bold",
          letterSpacing: 1.1,
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", color: "white", fontWeight: "bold" }}>
          TDS Summary
        </Typography>
        <Button variant="contained" color="primary" sx={{ height: "30px" }} onClick={() => setOpenTdsSummary(true)}>
          View
        </Button>
      </Box>

      {/* Main Table (Showing Only 5 Records) */}
      <Table size="small">
        <TableHead sx={{ background: "#0288D1" }}>
          <TableRow>
            {["S.No", "Supplier", "TDS 9%", "TDS 10%", "TDS 4%", "TDS Amount (₹)"].map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold", textAlign: "center", color: "#fff", padding: "8px", borderBottom: "2px solid #01579B" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tdsData.slice(0, 5).map((row, index) => (
            <TableRow key={index} sx={{ background: index % 2 === 0 ? "#E1F5FE" : "#FFFFFF", "&:hover": { background: "#B3E5FC" } }}>
              <TableCell sx={{ py: 1, textAlign: "center", fontWeight: 500, fontSize: '0.875rem' }}>{index + 1}</TableCell>
              {/* <TableCell sx={{ py: 1, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130, fontSize: '0.875rem' }}>
                <span>{row.supplierName}</span>
              </TableCell> */}
              <TableCell sx={{ py: 1, textAlign: "center", fontSize: '0.875rem' }}>{row.shortName.toLocaleString("en-IN")}</TableCell>
              <TableCell sx={{ py: 1, textAlign: "center", fontSize: '0.875rem' }}>{row.tds9.toLocaleString("en-IN")}</TableCell>
              <TableCell sx={{ py: 1, textAlign: "center", fontSize: '0.875rem' }}>{row.tds10.toLocaleString("en-IN")}</TableCell>
              <TableCell sx={{ py: 1, textAlign: "center", fontSize: '0.875rem' }}>{row.tds4.toLocaleString("en-IN")}</TableCell>
              <TableCell sx={{ py: 1, textAlign: "center", fontWeight: 600, fontSize: '0.875rem' }}>{row.tdsAmount.toLocaleString("en-IN")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openTdsSummary} maxWidth="md" fullWidth onClose={() => setOpenTdsSummary(false)}>
        <DialogContent>
          <DialogTitle sx={{ background: "#0288D1", color: "#fff", fontWeight: "bold", textAlign: "center" }}>Full TDS Summary</DialogTitle>
          <Table size="small">
            <TableHead sx={{ background: "#0288D1" }}>
              <TableRow>
                {["S.No", "Supplier", "TDS 9% (₹)", "TDS 10% (₹)", "TDS 4% (₹)", "TDS Amount (₹)"].map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: "bold", textAlign: "center", color: "#fff", padding: "8px", borderBottom: "2px solid #01579B" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tdsData.map((row, index) => (
                <TableRow key={index} sx={{ background: index % 2 === 0 ? "#E1F5FE" : "#FFFFFF", "&:hover": { background: "#B3E5FC" } }}>
                  <TableCell sx={{ py: 1, textAlign: "center", fontWeight: 500 }}>{index + 1}</TableCell>
                  {/* <TableCell sx={{ py: 1, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                    <span>{row.supplierName}</span>
                  </TableCell> */}
                  <TableCell sx={{ py: 1 }}>{row.supplierName.toLocaleString("en-IN")}</TableCell>
                  <TableCell sx={{ py: 1, textAlign: "center" }}>{row.tds9.toLocaleString("en-IN")}</TableCell>
                  <TableCell sx={{ py: 1, textAlign: "center" }}>{row.tds10.toLocaleString("en-IN")}</TableCell>
                  <TableCell sx={{ py: 1, textAlign: "center" }}>{row.tds4.toLocaleString("en-IN")}</TableCell>
                  <TableCell sx={{ py: 1, textAlign: "center", fontWeight: 600 }}>{row.tdsAmount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => setOpenTdsSummary(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
  const [revenuePrevMonthAmt, setRevenuePrevMonthAmt] = useState(0);
  const [revenuePrevYearAmt, setRevenuePrevYearAmt] = useState(0);
  const [totalCostYear, setTotalCostYear] = useState(0);
  const [costPrevMonthAmt, setCostPrevMonthAmt] = useState(0);
  const [costPrevYearAmt, setCostPrevYearAmt] = useState(0);
  const [totalReceiptYear, setTotalReceiptYear] = useState(0);
  const [receiptPrevMonthAmt, setReceiptPrevMonthAmt] = useState(0);
  const [receiptPrevYearAmt, setReceiptPrevYearAmt] = useState(0);
  const [totalPaymentYear, setTotalPaymentYear] = useState(0);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [chartData, setChartData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tdsData, setTdsData] = useState([]);

  const getTargetMonth = (isYearly) => {
    if (isYearly) return 'ALL';
    return new Date().toLocaleString('default', { month: 'long' });
  };

  const getDashboardRevenue = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `taxInvoice/getDsahboardRevenue?&finYear=${finYear}&orgId=${orgId}${targetMonth === "ALL" ? `&billMonth=YEAR` : `&billMonth=MONTH`}`);

      const totalOrderYear = Number(response.paramObjectsMap.taxInvoiceVO[0]?.amount || 0);
      setTotalOrderYear(totalOrderYear);
    } catch (error) {
      console.error('Error fetching dashboard revenue:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getDashboardCost = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `costInvoice/getDsahboardCost?billMonth=${targetMonth}&finYear=${finYear}&orgId=${orgId}`);

      const totalCostYear = Number(response.paramObjectsMap.cost[0]?.amount || 0);
      setTotalCostYear(totalCostYear);
    } catch (error) {
      console.error('Error fetching dashboard cost:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getDashboardReceipt = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `dashboard/getReceiptAmont?orgId=${orgId}${targetMonth === "ALL" ? `&year=${finYear}` : `&month=MONTH&year=${finYear}`}`);

      const totalReceiptYear = Number(response.paramObjectsMap.receiptAmont[0]?.receiptAmt || 0);
      setTotalReceiptYear(totalReceiptYear);
    } catch (error) {
      console.error('Error fetching dashboard cost:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getDashboardPayment = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `dashboard/getPaymentAmont?orgId=${orgId}${targetMonth === "ALL" ? `&year=${finYear}` : `&month=MONTH&year=${finYear}`}`);

      const totalPaymentYear = Number(response.paramObjectsMap.receiptAmont[0]?.paymentAmt || 0);
      setTotalPaymentYear(totalPaymentYear);
    } catch (error) {
      console.error('Error fetching dashboard cost:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getRevenuePreviousMonth = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `dashboard/getPercentageDiffFromRevenue?orgId=${orgId}&finYear=${finYear}${targetMonth === "ALL" ? `&year=YEAR` : `&month=MONTH`}`);

      const totalOrderMonth = Number(response.paramObjectsMap.Revenue[0]?.preMonth || 0);
      const totalOrderYear = Number(response.paramObjectsMap.Revenue[0]?.preYear || 0);
      setRevenuePrevMonthAmt(totalOrderMonth);
      setRevenuePrevYearAmt(totalOrderYear);
    } catch (error) {
      console.error('Error fetching dashboard revenue:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getCostPreviousMonth = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `dashboard/getPercentageDiffFromCost?orgId=${orgId}&finYear=${finYear}${targetMonth === "ALL" ? `&year=YEAR` : `&month=MONTH`}`);

      const totalOrderMonth = Number(response.paramObjectsMap.cost[0]?.preMonth || 0);
      const totalOrderYear = Number(response.paramObjectsMap.cost[0]?.preYear || 0);
      setCostPrevMonthAmt(totalOrderMonth);
      setCostPrevYearAmt(totalOrderYear);
    } catch (error) {
      console.error('Error fetching dashboard Cost:', error);
    }
  }, [finYear, orgId, isYearly]);

  const getReceiptPreviousMonth = useCallback(async () => {
    try {
      const targetMonth = getTargetMonth(isYearly);

      const response = await apiCalls('get', `dashboard/getPercentageFromReceipt?orgId=${orgId}&finYear=${finYear}${targetMonth === "ALL" ? `&month=YEAR` : `&month=MONTH`}`);

      const totalOrderMonth = Number(response.paramObjectsMap.receipt[0]?.preMonth || 0);
      const totalOrderYear = Number(response.paramObjectsMap.receipt[0]?.preYear || 0);
      setReceiptPrevMonthAmt(totalOrderMonth);
      setReceiptPrevYearAmt(totalOrderYear);
    } catch (error) {
      console.error('Error fetching dashboard Cost:', error);
    }
  }, [finYear, orgId, isYearly]);

  useEffect(() => {
    getDashboardRevenue();
    getDashboardCost();
    getDashboardReceipt();
    getDashboardPayment();
    getRevenuePreviousMonth();
    getCostPreviousMonth();
    getReceiptPreviousMonth();
  }, [getDashboardRevenue, getDashboardCost, getDashboardReceipt, getDashboardPayment, getRevenuePreviousMonth, getCostPreviousMonth, getReceiptPreviousMonth]);

  useEffect(() => {
    const fetchTopCustomerData = async () => {
      const targetMonth = getTargetMonth(isYearly);

      try {
        const response = await apiCalls('get', `master/getMonthlyAndYearWiseData?orgId=${orgId}${targetMonth === "ALL" ? `&finYear=${finYear}` : `&month=MONTH&finYear=${finYear}`}`);

        if (response?.status && response?.paramObjectsMap?.partyMasterVO) {
          let parties = response.paramObjectsMap.partyMasterVO || [];

          parties = parties
            .map((party) => ({
              name: party.partyName, // Full name for tooltip
              shortName: party.partyShortName || "", // Show empty if shortName is missing
              amount: parseFloat(party.amt || 0) / 100000,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // Limit to top 5 customers

          const labels = parties.map((party) => party.shortName); // Use empty string if shortName is missing
          const amounts = parties.map((party) => party.amount);
          const tooltips = parties.map((party) => party.name);

          setChartData({
            labels,
            datasets: [
              {
                label: "Total Amount in Lakhs",
                data: amounts,
                backgroundColor: [
                  "#33D68A",
                  "#FF5733",
                  "#33B5E5",
                  "#FFC107",
                  "#8E44AD",
                ],
                borderColor: "#fff",
                borderWidth: 2,
                tooltips, // Store tooltips separately
              },
            ],
          });
        } else {
          setChartData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setChartData(null);
      }
    };
    fetchTopCustomerData();
  }, [orgId, isYearly]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const targetMonth = getTargetMonth(isYearly);

      try {
        const response = await apiCalls(
          "get",
          `/master/getSalesDistributionData?orgId=${orgId}${targetMonth === "ALL" ? `&finYear=${finYear}` : `&month=MONTH&finYear=${finYear}`}`
        );

        if (response?.status && response?.paramObjectsMap?.partyMasterVO) {
          const sales = response.paramObjectsMap.partyMasterVO;

          const labels = sales.map((item) => item.product);
          const data = sales.map((item) => parseFloat((item.amt || 0) / 100000).toFixed(2));

          setSalesData({
            labels,
            datasets: [
              {
                label: "Sales (in Lakhs)",
                data,
                backgroundColor: ["#33B5E5", "#FF5733", "#33D68A", "#FFC107", "#8E44AD"],
              },
            ],
          });
        } else {
          setError("No data available");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [orgId, isYearly]);

  useEffect(() => {
    const fetchTdsData = async () => {
      const targetMonth = getTargetMonth(isYearly);
      try {
        const response = await apiCalls('get', `dashboard/getTdsSummary?orgId=${orgId}&finYear=${finYear}${targetMonth === "ALL" ? `&month=YEAR` : `&month=MONTH`}`);
        if (response?.status && response?.paramObjectsMap?.receiptAmont) {
          setTdsData(response.paramObjectsMap.receiptAmont || []);
          console.log("TDS data", response)
        }
      } catch (error) {
        console.error("Error fetching TDS data:", error);
      }
    };
    fetchTdsData();
  }, [orgId, isYearly]);

  // Update financial data dynamically
  const financialData = [
    { stats: !isYearly ? "PM" : "PY", statsPercentageMonthly: revenuePrevMonthAmt, statsPercentageYearly: revenuePrevYearAmt, title: 'Revenue', monthly: totalOrderYear, yearly: totalOrderYear },
    { stats: !isYearly ? "PM" : "PY", statsPercentageMonthly: costPrevMonthAmt, statsPercentageYearly: costPrevYearAmt, title: 'Cost', monthly: totalCostYear, yearly: totalCostYear },
    { stats: !isYearly ? "PM" : "PY", statsPercentageMonthly: receiptPrevMonthAmt, statsPercentageYearly: receiptPrevYearAmt, title: 'Receipt', monthly: totalReceiptYear, yearly: totalReceiptYear },
    { stats: !isYearly ? "PM" : "PY", statsPercentage: '0%', title: 'Payment', monthly: totalPaymentYear, yearly: totalPaymentYear }
  ];

  return (
    <Grid container spacing={2} p={1}>
      {financialData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={data.title}>
          <StatCard
            statsPercentageMonthly={data.statsPercentageMonthly}
            statsPercentageYearly={data.statsPercentageYearly}
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
        <TopCustomersChart chartData={chartData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SalesDistributionChart salesData={salesData} loading={loading} error={error} />
      </Grid>
      <Grid item xs={12} md={6}>
        <GSTRTable />
      </Grid>
      <Grid item xs={12} md={6}>
        <TDSTable tdsData={tdsData} />
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
