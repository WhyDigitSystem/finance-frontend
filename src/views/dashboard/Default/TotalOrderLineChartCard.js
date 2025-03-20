import PropTypes from 'prop-types';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';

// material-ui
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading, costAPI, totalYear }) => {
  const theme = useTheme();

  const [timeValue, setTimeValue] = useState(false);
  // const [totalOrderYear, setTotalOrderYear] = useState(0);
  const [billMonth, setBillMonth] = useState('All');
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  // useEffect(() => {
  //   getDashboardRevenue();
  // }, [timeValue]);

  useEffect(() => {
    if (typeof costAPI === 'function') {
      console.log("Calling costAPI with timeValue:", timeValue);
      costAPI(timeValue);
    } else {
      console.error("costAPI is not a function");
    }
  }, [timeValue, costAPI]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">

              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>

                  </Grid>
                  <Grid item>
                    <Button
                      disableElevation
                      variant={timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, true)}
                    >
                      Month
                    </Button>
                    <Button
                      disableElevation
                      variant={!timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, false)}
                    >
                      Year
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid container alignItems="center" wrap="nowrap">
                        <Grid item>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, zIndex: 1 }}>
                            {/* {parseInt(totalOrderYear)} */}
                            ₹{parseFloat(totalYear).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Avatar
                            sx={{
                              ...theme.typography.smallAvatar,
                              cursor: 'pointer',
                              backgroundColor: theme.palette.primary[200],
                              color: theme.palette.primary.dark
                            }}
                          >
                            <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: theme.palette.primary[200]
                      }}
                    >
                      Cost
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
