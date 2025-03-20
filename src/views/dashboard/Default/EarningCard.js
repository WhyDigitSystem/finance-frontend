import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { Avatar, Box, Grid, Menu, MenuItem, Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
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
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading, revenueAPI, cardName, totalOrderYear }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [timeValue, setTimeValue] = useState(false);

  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (typeof revenueAPI === 'function') {
      console.log("Calling revenueAPI with timeValue:", timeValue);
      revenueAPI(timeValue);
    } else {
      console.error("revenueAPI is not a function");
    }
  }, [timeValue, revenueAPI]);


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.10 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignContent={"end"}>
                  <Grid container justifyContent="space-between">
                    <Grid item>

                    </Grid>
                    <Grid item>
                      <Button
                        disableElevation
                        // variant={timeValue ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          color: timeValue ? 'white' : 'inherit',
                          backgroundColor: timeValue ? '#6f31ea' : 'transparent',
                          zIndex: 1,
                        }}
                        onClick={(e) => handleChangeTime(e, true)}
                      >
                        Month
                      </Button>
                      <Button
                        disableElevation
                        // variant={!timeValue ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          color: !timeValue ? 'white' : 'inherit',
                          backgroundColor: !timeValue ? '#6f31ea' : 'transparent',
                          zIndex: 1,
                        }}
                        onClick={(e) => handleChangeTime(e, false)}
                      >
                        Year
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container alignItems="center">
                  <Grid container alignItems="center" wrap="nowrap">
                    <Grid item sx={{ zIndex: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                        {/* {parseInt(totalOrderYear)} */}
                        ₹{parseFloat(totalOrderYear).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </Grid>

                    <Grid item sx={{ zIndex: 1 }}>
                      <Avatar
                        sx={{
                          ...theme.typography.smallAvatar,
                          cursor: 'pointer',
                          backgroundColor: theme.palette.primary[200],
                          color: theme.palette.primary.dark
                        }}
                      >
                        <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.secondary[200]
                  }}
                >
                  {cardName}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
