import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Avatar, ButtonBase, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from 'views/basicMaster/CommonTable';
import { encryptPassword } from 'views/utilities/passwordEnc';

const Employee = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [roleDataSelect, setRoleDataSelect] = useState([]);

  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    gender: '',
    branch: '',
    department: '',
    designation: '',
    dateOfBirth: '',
    joiningDate: '',
    active: true,
    password: '',
    role: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    employeeCode: false,
    employeeName: false,
    gender: false,
    branch: false,
    department: false,
    designation: false,
    dateOfBirth: false,
    joiningDate: false,
    role: false,
    Password: false
  });

  const columns = [
    { accessorKey: 'employeeCode', header: 'EmployeeCode', size: 140 },
    { accessorKey: 'employeeName', header: 'Name', size: 140 },
    { accessorKey: 'gender', header: 'Gender', size: 140 },
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'designation', header: 'Designation', size: 140 },
    { accessorKey: 'dateOfBirth', header: 'DOB', size: 140 },
    { accessorKey: 'joiningDate', header: 'DOJ', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  const theme = useTheme();
  const anchorRef = useRef(null);

  useEffect(() => {
    getEmployee();
    getBranch();
    getRoleData();
  }, []);

  useEffect(() => {
    // Reset the role to an empty string if the initial role value is not in the fetched roleDataSelect options
    if (roleDataSelect.length > 0 && !roleDataSelect.includes(formData.role)) {
      setFormData((prevFormData) => ({ ...prevFormData, role: '' }));
    }
  }, [roleDataSelect]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = name === 'newRate' && value !== '' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getBranch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getBranchByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setBranchData(response.data.paramObjectsMap.branchVO.map((branch) => branch.branch));

        console.log(
          'Testt',
          response.data.paramObjectsMap.branchVO.map((branch) => branch.branch)
        );
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getRoleData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getRoleMasterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        // setData(response.data.paramObjectsMap.roleMasterVO);
        setRoleDataSelect(response.data.paramObjectsMap.roleMasterVO.map((list) => list.role));

        console.log(
          'Test',
          response.data.paramObjectsMap.roleMasterVO.map((list) => list.role)
        );
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getEmployee = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getEmployeeByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.employeeVO);
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
      'employeeCode',
      'employeeName',
      'gender',
      'department',
      'designation',
      'dateOfBirth',
      'joiningDate',
      'password'
      // 'role'
    ];
    const errors = {};

    console.log('Testtt', formData);

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
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateEmployee`, formDataWithEncryptedPassword)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Employee Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getEmployee();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({
      employeeCode: false,
      employeeName: false,
      gender: false,
      branch: false,
      department: false,
      designation: false,
      dateOfBirth: false,
      joiningDate: false,
      password: false,
      role: false
    });
  };
  const handleClear = () => {
    setFormData({
      employeeCode: '',
      employeeName: '',
      gender: '',
      branch: '',
      department: '',
      designation: '',
      dateOfBirth: '',
      joiningDate: '',
      active: true,
      password: '',
      role: ''
    });
    setFieldErrors({
      employeeCode: false,
      employeeName: false,
      gender: false,
      branch: false,
      department: false,
      designation: false,
      dateOfBirth: false,
      joiningDate: false,
      password: false,
      role: false
    });
  };

  const genderVO = ['Male', 'Female', 'Other'];

  const handleDateChange = (name, date) => {
    if (date && dayjs(date).isValid()) {
      const dateString = dayjs(date).toISOString();
      setFormData({ ...formData, [name]: dateString });
      setFieldErrors({ ...fieldErrors, [name]: false });
    } else {
      setFormData({ ...formData, [name]: null });
    }
  };

  const editEmployee = async (updatedBranch) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateEmployee`, updatedBranch);
      if (response.status === 200) {
        toast.success('Employee Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getEmployee();
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to Update Employee', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error updating country:', error);
      toast.error('Error Updating Employee', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
                  label="EmployeeId"
                  variant="outlined"
                  size="small"
                  required
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  fullWidth
                  name="employeeCode"
                  // error={fieldErrors.chapter}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 30 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Name"
                  variant="outlined"
                  size="small"
                  name="employeeName"
                  fullWidth
                  required
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeName ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 15 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="country">Gender</InputLabel>
                  <Select label="country-label" id="country" name="gender" value={formData.gender} onChange={handleInputChange}>
                    {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                    {genderVO.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.gender && (
                    <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="branch">Branch</InputLabel>
                  <Select label="state-label" id="branch" name="branch" value={formData.branch} onChange={handleInputChange}>
                    {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                    {branchData.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && (
                    <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Department"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.department ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Designation"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.designation ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                      onChange={(date) => handleDateChange('dateOfBirth', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      error={fieldErrors.dateOfBirth}
                      helperText={fieldErrors.dateOfBirth && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Joining Date"
                      value={formData.joiningDate ? dayjs(formData.joiningDate) : null}
                      onChange={(date) => handleDateChange('joiningDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      error={fieldErrors.joiningDate}
                      helperText={fieldErrors.joiningDate && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select labelId="role-label" id="role" name="role" value={formData.role} onChange={handleSelectChange} required>
                    {roleDataSelect &&
                      roleDataSelect.map((role, index) => (
                        <MenuItem key={index} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                  </Select>
                  <span style={{ color: 'red' }}>{fieldErrors.role ? 'This field is required' : ''}</span>
                </FormControl>
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
              <div className="col-md-3 mb-3">
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
            <CommonTable data={data} columns={columns} editCallback={editEmployee} />
          )}
        </div>
      </div>
    </>
  );
};
export default Employee;
