import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Avatar, ButtonBase, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCityByState, getCountryByOrgId, getStateByCountry } from 'utils/common-functions';
import CommonTable from 'views/basicMaster/CommonTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import CompanyCard from './card';

const CompanySetup = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [countryVO, setCountryVO] = useState([]);
  const [stateVO, setStateVO] = useState([]);
  const [cityVO, setCityVO] = useState([]);

  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    mainCurrency: '',
    phone: '',
    email: '',
    webSite: '',
    note: '',
    employeeCode: '',
    employeeName: '',
    password: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    companyName: false,
    companyCode: false,
    address: false,
    city: false,
    state: false,
    country: false,
    zip: false,
    mainCurrency: false,
    phone: false,
    email: false,
    webSite: false,
    note: false,
    employeeCode: false,
    employeeName: false,
    password: false
  });

  const columns = [
    { accessorKey: 'companyName', header: 'Company', size: 140 },
    { accessorKey: 'companyCode', header: 'Code', size: 140 },
    { accessorKey: 'city', header: 'City', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'phone', header: 'Phone', size: 140 },
    { accessorKey: 'email', header: 'Email', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  const handleEmailValidation = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const theme = useTheme();
  const anchorRef = useRef(null);

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
    getCompany();
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmailError(!handleEmailValidation(value));
    }
    const parsedValue = name === 'newRate' && value !== '' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getCompany = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getCompanyById`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.companyVO);
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
      'companyName',
      'companyCode',
      'phone',
      'email',
      'address',
      'city',
      'state',
      'country',
      'zip',
      'mainCurrency',
      'phone',
      'employeeCode',
      'employeeName',
      'password'
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
    const encryptedPassword = encryptPassword(formData.password);

    // Include the encrypted password in the form data
    const formDataWithEncryptedPassword = {
      ...formData,
      password: encryptedPassword
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateCompany`, formDataWithEncryptedPassword)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Company Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getCompany();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const editBranch = async (updatedBranch) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateCompany`, updatedBranch);
      if (response.status === 200) {
        toast.success('Company Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getCompany();
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

  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({
      companyName: false,
      companyCode: false,
      address: false,
      city: false,
      state: false,
      country: false,
      zip: false,
      mainCurrency: false,
      phone: false,
      email: false,
      webSite: false,
      note: false,
      password: false,
      employeeCode: false,
      employeeName: false
    });
  };
  const handleClear = () => {
    setFormData({
      companyName: '',
      companyCode: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      mainCurrency: '',
      phone: '',
      email: '',
      webSite: '',
      note: '',
      password: '',
      employeeCode: '',
      employeeName: ''
    });
    setFieldErrors({
      companyName: false,
      companyCode: false,
      address: false,
      city: false,
      state: false,
      country: false,
      zip: false,
      mainCurrency: false,
      phone: false,
      email: false,
      webSite: false,
      note: false,
      password: false,
      employeeCode: false,
      employeeName: false
    });
    setEmailError(false);
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
                  label="Company"
                  variant="outlined"
                  size="small"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  fullWidth
                  name="companyName"
                  // error={fieldErrors.chapter}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.companyName ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 30 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Code"
                  variant="outlined"
                  size="small"
                  name="companyCode"
                  fullWidth
                  required
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.companyCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 15 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.address ? 'This field is required' : ''}</span>}
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
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.zip ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-currency"
                  label="Main Currency"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="mainCurrency"
                  value={formData.mainCurrency}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.mainCurrency ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 20 }}
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
                  label="Email"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  helperText={
                    <span style={{ color: 'red' }}>
                      {emailError ? 'Please enter a valid email' : fieldErrors.email ? 'This field is required' : ''}
                    </span>
                  }
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-website"
                  label="Website"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="webSite"
                  value={formData.webSite}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-note"
                  label="Note"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="note"
                  value={formData.note}
                  multiline
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 200 }}
                />
              </div>
              <div className="mb-4">
                <CompanyCard />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-empCode"
                  label="Employee Code"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 20 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeCode ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-empName"
                  label="Employee Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeName ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-password"
                  label="Password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility based on showPassword state
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.password ? 'This field is required' : ''}</span>}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          onMouseDown={(e) => e.preventDefault()} // Prevents focusing the TextField
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
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
export default CompanySetup;
