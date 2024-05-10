import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCountryByOrgId, getStateByCountry } from 'utils/common-functions';
import CommonTable from './CommonTable';

const City = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);
  const [showFields, setShowFields] = useState(true);
  const [countryVO, setCountryVO] = useState([]);
  const [stateVO, setStateVO] = useState([]);

  const [formData, setFormData] = useState({
    state: '',
    cityName: '',
    cityCode: '',
    country: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    cityName: false,
    state: false,
    country: false,
    cityCode: false
  });

  const handleClear = () => {
    setFormData({
      state: '',
      cityName: '',
      cityCode: '',
      country: '',
      active: true
    });

    setFieldErrors({
      cityName: false,
      state: false,
      country: false,
      cityCode: false
    });
  };

  const columns = [
    { accessorKey: 'cityName', header: 'City', size: 140 },
    { accessorKey: 'cityCode', header: 'Code', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const countryData = await getCountryByOrgId(orgId);
        setCountryVO(countryData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    fetchData();
    getCity();
  }, []);

  useEffect(() => {
    const fetchDataState = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const stateData = await getStateByCountry(orgId, formData.country);
        setStateVO(stateData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    fetchDataState();
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    let newValue = value;

    // Transform value to uppercase
    newValue = newValue.toUpperCase();

    // Validate value to allow only alphabetic characters
    newValue = newValue.replace(/[^A-Z]/g, '');

    // Update the value of newValue instead of redeclaring it
    newValue = name === 'active' ? checked : newValue;

    setFormData({ ...formData, [name]: newValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleList = () => {
    setShowFields(!showFields);
  };

  const getCity = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getCityByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.cityVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = () => {
    // Check if any field is empty
    const errors = Object.keys(formData).reduce((acc, key) => {
      if (!formData[key]) {
        acc[key] = true;
      }
      return acc;
    }, {});
    // If there are errors, set the corresponding fieldErrors state to true
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return; // Prevent API call if there are errors
    }
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateCity`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('City Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getCity();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <Tooltip title="Search" placement="top">
            <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
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
                aria-haspopup="true"
                color="inherit"
              >
                <SearchIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </Tooltip>

          <Tooltip title="Clear" placement="top">
            {' '}
            <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }} onClick={handleClear}>
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
                aria-haspopup="true"
                color="inherit"
              >
                <ClearIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </Tooltip>

          <Tooltip title="List View" placement="top">
            {' '}
            <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleList}>
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
                aria-haspopup="true"
                color="inherit"
              >
                <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Save" placement="top">
            {' '}
            <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }} onClick={handleSubmit}>
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
                aria-haspopup="true"
                color="inherit"
              >
                <SaveIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </Tooltip>
        </div>
        {showFields ? (
          <div className="row d-flex">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="country">Country</InputLabel>
                <Select label="country-label" id="country" name="country" value={formData.country} onChange={handleInputChange}>
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {countryVO.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.country && (
                  <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                    This field is required
                  </span>
                )}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="country">State</InputLabel>
                <Select label="state-label" id="state" name="state" value={formData.state} onChange={handleInputChange}>
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {stateVO.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.state && (
                  <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                    This field is required
                  </span>
                )}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="City"
                  size="small"
                  required
                  name="cityName"
                  value={formData.cityName}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.cityName ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="Code"
                  size="small"
                  required
                  value={formData.cityCode}
                  name="cityCode"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.cityCode ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3 ml-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      onChange={handleInputChange}
                      name="active"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Active"
                />
              </FormGroup>
            </div>
          </div>
        ) : (
          <CommonTable data={data} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default City;
