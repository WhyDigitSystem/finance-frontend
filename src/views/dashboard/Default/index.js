import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gridSpacing } from 'store/constant';
import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import CurrencyExchangeRates from './ExRateDash';
import apiCalls from 'apicall';
import { useCallback } from 'react';



// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [totalOrderYear, setTotalOrderYear] = useState(0);
  const [totalYear, setTotalYear] = useState(0);

  useEffect(() => {
    setLoading(false);
    if (localStorage.getItem('LoginMessage') === 'true') {
      toast.success('Login Successful, Welcome!', {
        autoClose: 2000,
        theme: 'colored'
      });

      // Set loginMessage to false after 2 seconds
      const timeoutId = setTimeout(() => {
        localStorage.setItem('LoginMessage', false);
      }, 2000);

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);

      // Clear the timeout on component unmount to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const getDashboardRevenue = useCallback(async (timeValue) => {
    try {
      const options = { month: 'long' };
      const currentMonth = new Date().toLocaleString('default', options);
      const targetMonth = timeValue ? currentMonth : 'ALL';

      const response = await apiCalls(
        'get',
        `taxInvoice/getDsahboardRevenue?billMonth=${targetMonth}&finYear=${finYear}&orgId=${orgId}`
      );

      setTotalOrderYear(response.paramObjectsMap.taxInvoiceVO[0].amount);
    } catch (error) {
      console.error('Error fetching dashboard revenue:', error);
    }
  }, [finYear, orgId]); // Dependencies

  const getDashboardCost = useCallback(async (timeValue) => {
    try {
      const options = { month: 'long' };
      const currentMonth = new Date().toLocaleString('default', options);
      const targetMonth = timeValue ? currentMonth : 'ALL';

      const response = await apiCalls(
        'get',
        `costInvoice/getDsahboardCost?billMonth=${targetMonth}&finYear=${finYear}&orgId=${orgId}`
      );

      setTotalYear(response.paramObjectsMap.cost[0].amount);
    } catch (error) {
      console.error('Error fetching dashboard revenue:', error);
    }
  }, [finYear, orgId]); // Dependencies

  return (
    <Grid container spacing={gridSpacing}>
      {/* <div>
        <ToastContainer />
      </div> */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={4} sm={4} xs={6}>
            <EarningCard isLoading={isLoading} revenueAPI={getDashboardRevenue} cardName={"Revenue"} totalOrderYear={totalOrderYear} />
          </Grid>
          <Grid item lg={3} md={4} sm={4} xs={6}>
            <TotalOrderLineChartCard isLoading={isLoading} costAPI={getDashboardCost} cardName={"Cost"} totalYear={totalYear}/>
          </Grid>
          <Grid item lg={3} md={4} sm={4} xs={6}>
            <EarningCard isLoading={isLoading} revenueAPI={getDashboardRevenue} cardName={"AR"} totalOrderYear={totalOrderYear} />
          </Grid>
          <Grid item lg={3} md={4} sm={4} xs={6}>
            <TotalOrderLineChartCard isLoading={isLoading} costAPI={getDashboardCost} cardName={"AP"} totalYear={totalYear}/>
          </Grid>
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
          <Grid item xs={12} md={4}>
            <CurrencyExchangeRates />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
