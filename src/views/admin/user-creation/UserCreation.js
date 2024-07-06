import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import { decryptPassword, encryptPassword } from 'views/utilities/passwordEnc';
import BranchTable from './BranchTable';
import RoleTable from './RoleTable';

const UserCreation = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [dataToEdit, setDataToEdit] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [roleDataSelect, setRoleDataSelect] = useState([]);
  const [value, setValue] = useState('1');
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    userId: '',
    userName: '',
    password: '',
    email: '',
    active: false,
    allIndiaAccess: false,
    deactivatedOn: '', // Rename to match DTO structure
    userType: '',
    reportingTO: '',
    orgId: orgId, // Assuming orgId is defined elsewhere in your component
    branchAccessDTO: [],
    userRoleDTO: []
  });

  const [fieldErrors, setFieldErrors] = useState({
    employeeCode: '',
    employeeName: '',
    userId: '',
    userName: '',
    password: '',
    email: '',
    active: false,
    allIndiaAccess: false,
    deactivatedOn: '',
    userType: '',
    reportingTO: '',
    orgId: orgId
  });

  const columns = [
    { accessorKey: 'employeeCode', header: 'EmployeeCode', size: 140 },
    { accessorKey: 'employeeName', header: 'Name', size: 140 },
    { accessorKey: 'userId', header: 'User Id', size: 140 },
    { accessorKey: 'userName', header: 'User Name', size: 140 },
    { accessorKey: 'email', header: 'Email', size: 140 },
    { accessorKey: 'reportingTO', header: 'Reporting To', size: 140 }
  ];

  const theme = useTheme();
  const anchorRef = useRef(null);

  useEffect(() => {
    getAllUserByOrgId();
    getBranch();
    getRoleData();
  }, []);

  useEffect(() => {
    // Reset the role to an empty string if the initial role value is not in the fetched roleDataSelect options
    if (roleDataSelect.length > 0 && !roleDataSelect.includes(formData.role)) {
      setFormData((prevFormData) => ({ ...prevFormData }));
    }
  }, [roleDataSelect]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const parsedValue = type === 'checkbox' ? checked : name === 'newRate' && value !== '' ? parseInt(value) : value;

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
        setRoleDataSelect(response.data.paramObjectsMap.roleVO.map((list) => list.role));
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllUserByOrgId = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getAllUserByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.userVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllUserById = async (emitterId) => {
    console.log('first', emitterId);
    setShowForm(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUserById?userId=${emitterId.original.userId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setDataToEdit(response.data.paramObjectsMap.userVO);
        const userVO = response.data.paramObjectsMap.userVO;
        setEditMode(true);
        const dePassword = decryptPassword(userVO.password);

        console.log('Decrypted Password:', dePassword);
        setFormData({
          employeeCode: userVO.employeeCode || '',
          employeeName: userVO.employeeName || '',
          userId: userVO.userId || '',
          userName: userVO.userName || '',
          password: '********',
          email: userVO.email || '',
          active: userVO.active || false,
          allIndiaAccess: userVO.allIndiaAccess || false,
          deactivatedOn: userVO.deactivatedOn || '', // Assuming deactivatedOn matches your DTO structure
          userType: userVO.userType || '',
          reportingTO: userVO.reportingTO || '',
          orgId: userVO.orgId || orgId, // If orgId is not in the response, keep the existing orgId
          branchAccessDTO: userVO.branchAccessVO || [], // Assuming branchAccessVO matches the structure
          userRoleDTO: userVO.userRoleVO || [] // Assuming userRoleVO matches the structure
        });

        handleChange(1);

        console.log('DataToEdit', response.data.paramObjectsMap.userVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = () => {
    // Check if any field is empty
    const requiredFields = [
      'userName',
      'userId',
      'userType',
      'employeeCode',
      'employeeName',
      'password',
      'email',
      'reportingTO'
      // 'role'
    ];
    const errors = {};

    console.log('Testttng', formData);

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

    const formDataWithEncryptedPassword = {
      ...formData,
      password: encryptedPassword,
      userId: parseInt(formData.userId, 10),
      userRoleDTO: formData.userRoleDTO.map((item) => ({
        ...item,
        startdate: formatDate(item.startdate),
        enddate: formatDate(item.enddate)
      }))
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/user/createuser`, formDataWithEncryptedPassword)
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data.status) {
          handleClear();
          showToast('success', 'User created successfully');
        } else {
          showToast('error', response.data.errorMessage || 'User creation failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage = error.response?.data?.errorMessage || 'An error occurred';
        showToast('error', errorMessage);
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
      userId: '',
      userName: '',
      password: '',
      email: '',
      active: false,
      allIndiaAccess: false,
      deactivatedOn: '', // Rename to match DTO structure
      userType: '',
      reportingTO: '',
      orgId: orgId,
      branchAccessDTO: [],
      userRoleDTO: []
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

  const handleRoleTableUpdate = useCallback((updatedRoles) => {
    setFormData((prevData) => ({
      ...prevData,
      userRoleDTO: updatedRoles
    }));
  }, []);

  const handleBranchTableUpdate = useCallback((updatedBranch) => {
    setFormData((prevData) => ({
      ...prevData,
      branchAccessDTO: updatedBranch
    }));
  }, []);

  const editEmployee = async (updatedBranch) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateEmployee`, updatedBranch);
      if (response.status === 200) {
        toast.success('Employee Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getAllUserByOrgId();
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
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} margin="0 10px 0 10px" />
          </div>

          {showForm ? (
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="User Id"
                  variant="outlined"
                  size="small"
                  required
                  disabled={editMode}
                  value={formData.userId}
                  onChange={handleInputChange}
                  fullWidth
                  name="userId"
                  // error={fieldErrors.chapter}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.userId ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 30 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="UserName"
                  variant="outlined"
                  size="small"
                  name="userName"
                  fullWidth
                  disabled={editMode}
                  required
                  value={formData.userName}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.userName ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 15 }}
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
                  disabled={editMode}
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
                          disabled={editMode}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="userType">UserType</InputLabel>
                  <Select label="state-label" id="userType" name="userType" value={formData.userType} onChange={handleInputChange}>
                    {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                    {branchData.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.userType && (
                    <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                      This field is required
                    </span>
                  )}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Employee Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Employee Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeName ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              {/* <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Employee Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.employeeCode ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 10 }}
                />
              </div> */}

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.email ? 'This field is required' : ''}</span>}
                  inputProps={{ maxLength: 40 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="reportingTO">Reporting To</InputLabel>
                  <Select
                    labelId="reportingTO"
                    id="reportingTO"
                    name="reportingTO"
                    value={formData.reportingTO}
                    onChange={handleSelectChange}
                    required
                  >
                    {roleDataSelect &&
                      roleDataSelect.map((role, index) => (
                        <MenuItem key={index} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                  </Select>
                  <span style={{ color: 'red' }}>{fieldErrors.reportingTO ? 'This field is required' : ''}</span>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.allIndiaAccess}
                        onChange={handleInputChange}
                        name="allIndiaAccess"
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="All India Access"
                  />
                </FormGroup>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.deactivatedOn}
                        onChange={handleInputChange}
                        name="deactivatedOn"
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Deactivated on"
                  />
                </FormGroup>
              </div> */}
              {/* 
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
              </div> */}
              {/* <div className="col-md-3 mb-3">
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
              </div> */}
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
              {/* <ReusableTabs tabs={tabContent} /> */}

              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                    <Tab label="Roles" value="1" />
                    <Tab label="Branch" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <div>
                    <RoleTable data={formData.userRoleDTO} roleData={roleDataSelect} onUpdateRoles={handleRoleTableUpdate} />
                  </div>
                </TabPanel>
                <TabPanel value="2">
                  <BranchTable data={formData.branchAccessDTO} branchData={branchData} onUpdateBranch={handleBranchTableUpdate} />
                </TabPanel>
              </TabContext>
            </div>
          ) : (
            <CommonTable data={data && data} columns={columns} editCallback={editEmployee} blockEdit={true} toEdit={getAllUserById} />
          )}
        </div>
      </div>
    </>
  );
};
export default UserCreation;
