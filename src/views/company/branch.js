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
import { getCityByState, getCountryByOrgId, getStateByCountry } from 'utils/common-functions';
import CommonTable from 'views/basicMaster/CommonTable';

const Branch = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const [formData, setFormData] = useState({
    branch: '',
    branchCode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    lccurrency: '',
    phone: '',
    pan: '',
    gstIn: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    branch: false,
    branchCode: false,
    addressLine1: false,
    addressLine2: false,
    city: false,
    state: false,
    country: false,
    pinCode: false,
    lccurrency: false,
    phone: false,
    pan: false,
    gstIn: false
  });

  const columns = [
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'branchCode', header: 'Code', size: 140 },
    { accessorKey: 'addressLine1', header: 'Address 1', size: 140 },
    { accessorKey: 'addressLine2', header: 'Address 2', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'city', header: 'City', size: 140 },
    { accessorKey: 'pinCode', header: 'ZIP', size: 140 },
    { accessorKey: 'lccurrency', header: 'Currency', size: 140 },
    { accessorKey: 'phone', header: 'Phone', size: 140 },
    { accessorKey: 'pan', header: 'PAN', size: 140 },
    { accessorKey: 'gstIn', header: 'GST', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [countryVO, setCountryVO] = useState([]);
  const [stateVO, setStateVO] = useState([]);
  const [cityVO, setCityVO] = useState([]);

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
    getBranch();
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

  useEffect(() => {
    const fetchDataCity = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const cityData = await getCityByState(orgId, formData.state);
        setCityVO(cityData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    fetchDataCity();
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = name === 'newRate' && value !== '' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getBranch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getBranchByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.branchVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = () => {
    // Check if any field is empty
    const requiredFields = [
      'branch',
      'branchCode',
      'addressLine1',
      'addressLine1',
      'city',
      'state',
      'country',
      'pinCode',
      'lccurrency',
      'phone',
      'pan',
      'gstIn'
    ];
    const errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true;
      }
    });
    // If there are errors, set the corresponding fieldErrors state to true
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return; // Prevent API call if there are errors
    }

    axios
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateBranch`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Branch Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getBranch();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleRowEdit = (rowId, newData) => {
    console.log('Edit', rowId, newData);
    // Send PUT request to update the row
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateSetTaxRate/${rowId}`, newData)
      .then((response) => {
        console.log('Edit successful:', response.data);
        // Handle any further actions after successful edit
        toast.success('Company created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error editing row:', error);
        // Handle error scenarios
        toast.error('Company creation failed', {
          autoClose: 2000,
          theme: 'colored'
        });
      });
  };

  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({
      branch: false,
      branchCode: false,
      address1: false,
      address2: false,
      city: false,
      state: false,
      country: false,
      pinCode: false,
      currency: false,
      phone: false,
      pan: false,
      gst: false
    });
  };
  const handleClear = () => {
    setFormData({
      branch: '',
      branchCode: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      lccurrency: '',
      phone: '',
      pan: '',
      gstIn: '',
      active: ''
    });
    setFieldErrors({
      branch: false,
      branchCode: false,
      addressLine1: false,
      addressLine2: false,
      city: false,
      state: false,
      country: false,
      pinCode: false,
      lccurrency: false,
      phone: false,
      pan: false,
      gstIn: false
    });
    setEmailError(false);
  };

  const editBranch = async (updatedBranch) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateBranch`, updatedBranch);
      if (response.status === 200) {
        toast.success('Branch Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getBranch();
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to Update Country', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error updating country:', error);
      toast.error('Error Updating Country', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
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
              <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }} onClick={handleSave}>
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

          {showForm ? (
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Branch"
                  variant="outlined"
                  size="small"
                  required
                  value={formData.branch}
                  onChange={handleInputChange}
                  fullWidth
                  name="branch"
                  // error={fieldErrors.chapter}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.branch ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 30 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Code"
                  variant="outlined"
                  size="small"
                  name="branchCode"
                  fullWidth
                  required
                  value={formData.branchCode}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.branchCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 15 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Address 1"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  required
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.addressLine1 ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 200 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Address 2"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  required
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.addressLine2 ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 200 }}
                />
              </div>

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
                <FormControl fullWidth size="small">
                  <InputLabel id="country">City</InputLabel>
                  <Select label="state-label" id="state" name="city" value={formData.city} onChange={handleInputChange}>
                    {cityVO.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.city && (
                    <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="ZIP"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.pinCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-phone"
                  label="Phone"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.phone ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-email"
                  label="GST"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="gstIn"
                  value={formData.gstIn}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.gstIn ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-website"
                  label="PAN"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.pan ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-currency"
                  label="Currency"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="lccurrency"
                  value={formData.lccurrency}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.lccurrency ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 20 }}
                />
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
            <CommonTable data={data} columns={columns} editCallback={editBranch} countryVO={countryVO} />
          )}
        </div>
      </div>
    </>
  );
};
export default Branch;
