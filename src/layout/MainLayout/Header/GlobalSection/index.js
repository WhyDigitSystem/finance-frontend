import { useEffect, useRef, useState } from 'react';

// material-ui
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// third-party

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets

import { IconWorld } from '@tabler/icons-react';

// notification status options
const FinYear = [
  // {
  //   value: 'all',
  //   label: 'Financial Year'
  // },
  {
    value: '2020-2021',
    label: '2020-2021'
  },
  {
    value: '2021-2022',
    label: '2022-2022'
  },
  {
    value: '2023-2024',
    label: '2023-2024'
  }
];

const branch = [
  {
    value: 'Chennai',
    label: 'Chennai'
  },
  {
    value: 'Bangalore',
    label: 'Bangalore'
  },
  {
    value: 'Delhi',
    label: 'Delhi'
  },
  {
    value: 'Kochin',
    label: 'Kochi'
  }
];
const Company = [
  // {
  //   value: 'all',
  //   label: 'Company'
  // },
  {
    value: 'AIPacks',
    label: 'AIPacks'
  },
  {
    value: 'WDS',
    label: 'WDS'
  },
  {
    value: 'MSI',
    label: 'MSI'
  }
];

// ==============================|| NOTIFICATION ||============================== //

const GlobalSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [finYearValue, setFinYearValue] = useState('');
  const [companyValue, setCompanyValue] = useState('');
  const [branchValue, setBranchValue] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [userId, setUserId] = useState(parseInt(localStorage.getItem('userId')));
  const [branchVO, setBranchVO] = useState([]);
  const [finVO, setFinVO] = useState([]);
  const [companyVO, setCompanyVO] = useState([]);
  const [globalParameter, setGlobalParameter] = useState([]);

  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  useEffect(() => {
    getGlobalParameter();
    getAccessBranch();
    getFinYear();
    getCompany();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const getAccessBranch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/GlobalParam/getAccessBranchByUserId?userId=${userId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setBranchVO(response.data.paramObjectsMap.userAccessBranch);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getFinYear = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/GlobalParam/getFinYearforGlobalParam?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setFinVO(response.data.paramObjectsMap.finYear || []);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCompany = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/GlobalParam/getCompanyByUserID?userId=${userId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setCompanyVO(response.data.paramObjectsMap.company);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getGlobalParameter = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/GlobalParam/getGlobalParametrByUserId?userId=${userId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        // setGlobalParameter(response.data.paramObjectsMap.globalParameterVO);
        const globalParameterVO = response.data.paramObjectsMap.globalParameterVO;
        setGlobalParameter(globalParameterVO);
        setBranchValue(globalParameterVO.branch);
        setCompanyValue(globalParameterVO.company);
        setFinYearValue(globalParameterVO.finYear);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = () => {
    const formData = {
      branch: branchValue,
      branchCode: branchValue,
      company: companyValue,
      finYear: finYearValue,
      userId
    };
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/GlobalParam/createUpdateGlobalParameter`, formData)
      .then((response) => {
        // console.log('Response:', response.data);
        // handleClear();
        // toast.success('City Created Successfully', {
        //   autoClose: 2000,
        //   theme: 'colored'
        // });
        // getCity();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => {
    if (event?.target.value) setValue(event?.target.value);
  };

  const handleFinYearChange = (event) => {
    setFinYearValue(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setCompanyValue(event.target.value);
  };

  const handleBranchChange = (event) => {
    setBranchValue(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 2,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconWorld stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ width: 300 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">Global Parameter</Typography>
                            {/* <Chip
                              size="small"
                              label="01"
                              sx={{
                                color: theme.palette.background.default,
                                bgcolor: theme.palette.warning.dark
                              }}
                            /> */}
                          </Stack>
                        </Grid>
                        {/* <Grid item>
                          <Typography component={Link} to="#" variant="subtitle2" color="primary">
                            Mark as all read
                          </Typography>
                        </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ px: 2, pt: 0.25 }}>
                        <TextField
                          id="outlined-select-currency-native"
                          select
                          fullWidth
                          label="Company"
                          // disabled
                          value={companyValue}
                          onChange={handleCompanyChange}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value="" disabled>
                            Select Company
                          </option>
                          {companyVO?.map((option) => (
                            <option key={option.companyName} value={option.companyName}>
                              {option.companyName}
                            </option>
                          ))}
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ px: 2, pt: 0.25 }}>
                            <TextField
                              id="outlined-select-currency-native"
                              select
                              fullWidth
                              label="Fin Year"
                              value={finYearValue}
                              onChange={handleFinYearChange}
                              SelectProps={{
                                native: true
                              }}
                            >
                              <option value="" disabled>
                                Select FinYear
                              </option>
                              {finVO?.map((option) => (
                                <option key={option.finYear} value={option.finYear}>
                                  {option.finYear}
                                </option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ px: 2, pt: 0.25, mb: 2 }}>
                            <TextField
                              id="outlined-select-currency-native"
                              select
                              fullWidth
                              label="Branch"
                              value={branchValue}
                              onChange={handleBranchChange}
                              SelectProps={{
                                native: true
                              }}
                            >
                              <option value="" disabled>
                                Select Branch
                              </option>
                              {branchVO.map((option) => (
                                <option key={option.branchCode} value={option.branchCode}>
                                  {option.branchName}
                                </option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} p={0}>
                          <Divider sx={{ my: 0 }} />
                        </Grid>
                      </Grid>
                      {/* <NotificationList /> */}
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation onClick={handleSubmit}>
                      change
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default GlobalSection;
