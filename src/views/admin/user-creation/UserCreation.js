import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveBranches, getAllActiveRoles } from 'utils/CommonFunctions';

const UserCreation = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [dataToEdit, setDataToEdit] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [roleDataSelect, setRoleDataSelect] = useState([]);
  const [value, setValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    userId: '',
    userName: '',
    password: '',
    email: '',
    active: true,
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

  const [branchTableData, setBranchTableData] = useState([
    {
      id: 1,
      branchCode: '',
      branch: ''
    }
  ]);
  const [branchTableErrors, setBranchTableErrors] = useState([
    {
      branchCode: '',
      branch: ''
    }
  ]);
  const [roleTableData, setRoleTableData] = useState([{ id: 1, role: '', roleId: '', startDate: null, endDate: null }]);
  const [roleTableDataErrors, setRoleTableDataErrors] = useState([
    {
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    }
  ]);

  useEffect(() => {
    getAllUserByOrgId();
    getAllBranches();
    getAllRoles();
  }, []);

  useEffect(() => {
    // Reset the role to an empty string if the initial role value is not in the fetched roleDataSelect options
    if (roleDataSelect.length > 0 && !roleDataSelect.includes(formData.role)) {
      setFormData((prevFormData) => ({ ...prevFormData }));
    }
  }, [roleDataSelect]);

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

  const getAllRoles = async () => {
    try {
      const branchData = await getAllActiveRoles(orgId);
      setRoleList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
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
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userName) {
      errors.userName = 'User Name is required';
    }
    if (!formData.userType) {
      errors.userType = 'User Type is required';
    }
    if (!formData.employeeCode) {
      errors.employeeCode = 'Employee Code is required';
    }
    if (!formData.employeeName) {
      errors.employeeName = 'Employee Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email ID is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }
    // if (!formData.mobileNo) {
    //   errors.mobileNo = 'Mobile No is required';
    // } else if (formData.mobileNo.length < 10) {
    //   errors.mobileNo = ' Mobile No must be in 10 digit';
    // }

    let roleTableDataValid = true;
    const newTableErrors = roleTableData.map((row) => {
      const rowErrors = {};
      if (!row.role) {
        rowErrors.role = 'Role is required';
        roleTableDataValid = false;
      }
      if (!row.startDate) {
        rowErrors.startDate = 'Start Date is required';
        roleTableDataValid = false;
      }
      if (!row.endDate) {
        rowErrors.endDate = 'End Date is required';
        roleTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setRoleTableDataErrors(newTableErrors);

    let branchTableDataValid = true;
    const newTableErrors1 = branchTableData.map((row) => {
      const rowErrors = {};
      if (!row.branchCode) {
        rowErrors.branchCode = 'Branch Code is required';
        branchTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setBranchTableErrors(newTableErrors1);

    if (Object.keys(errors).length === 0 && roleTableDataValid && branchTableDataValid) {
      setFieldErrors(errors);
      return; // Prevent API call if there are errors
    }
    const encryptedPassword = encryptPassword('Wds@2022');

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
      .put(`${process.env.REACT_APP_API_URL}/api/user/createuser`, formDataWithEncryptedPassword)
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data.status) {
          handleClear();
          showToast('success', editMode ? ' User Updated Successfully' : 'User created successfully');
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
      active: true,
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

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        if (table === roleTableData) handleAddRow();
        else handleAddRow1();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(roleTableData)) {
      displayRowError(roleTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    };
    setRoleTableData([...roleTableData, newRow]);
    setRoleTableDataErrors([...roleTableDataErrors, { role: '', roleId: '', startDate: '', endDate: '' }]);
  };

  const handleAddRow1 = () => {
    if (isLastRowEmpty(branchTableData)) {
      displayRowError(branchTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      branchCode: '',
      branch: ''
    };
    setBranchTableData([...branchTableData, newRow]);
    setBranchTableErrors([
      ...branchTableErrors,
      {
        branchCode: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === roleTableData) {
      return !lastRow.role || !lastRow.startDate;
    } else if (table === branchTableData) {
      return !lastRow.branchCode;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === roleTableData) {
      setRoleTableDataErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          role: !table[table.length - 1].role ? 'Role is required' : '',
          startDate: !table[table.length - 1].startDate ? 'Start Date is required' : ''
        };
        return newErrors;
      });
    }
    if (table === branchTableData) {
      setBranchTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          branchCode: !table[table.length - 1].branchCode ? 'Branch Code is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const getAvailableRoles = (currentRowId) => {
    const selectedRoles = roleTableData.filter((row) => row.id !== currentRowId).map((row) => row.role);
    return roleList.filter((role) => !selectedRoles.includes(role.role));
  };
  const handleRoleChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setRoleTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setRoleTableDataErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableBranchCodes = (currentRowId) => {
    const selectedBranchCodes = branchTableData.filter((row) => row.id !== currentRowId).map((row) => row.branchCode);
    return branchList.filter((branch) => !selectedBranchCodes.includes(branch.branchCode));
  };
  const handleBranchCodeChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBranch = branchList.find((branch) => branch.branchCode === value);
    setBranchTableData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, branchCode: value, branch: selectedBranch ? selectedBranch.branch : '' } : r))
    );
    setBranchTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        branchCode: !value ? 'Branch Code is required' : ''
      };
      return newErrors;
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
            <>
              <div className="row d-flex ml">
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.userType}>
                    <InputLabel id="userType-label">User Type</InputLabel>
                    <Select
                      labelId="userType-label"
                      label="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      name="userType"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="USER">USER</MenuItem>
                      <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                    </Select>
                    {fieldErrors.userType && <FormHelperText>{fieldErrors.userType}</FormHelperText>}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.reportingTO}>
                    <InputLabel id="reportingTO-label">Reporting To</InputLabel>
                    <Select
                      labelId="reportingTO-label"
                      label="reportingTO"
                      value={formData.reportingTO}
                      onChange={handleSelectChange}
                      name="reportingTO"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {roleList &&
                        roleList.map((role, index) => (
                          <MenuItem key={index} value={role.role}>
                            {role.role}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.reportingTO && <FormHelperText>{fieldErrors.reportingTO}</FormHelperText>}
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
              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Roles" />
                    <Tab value={1} label="Branch Accessible" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-9">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '250px' }}>
                                      Role
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Start Date
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      End Date
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {roleTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              roleTableData,
                                              setRoleTableData,
                                              roleTableDataErrors,
                                              setRoleTableDataErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.role}
                                          onChange={(e) => handleRoleChange(row, index, e)}
                                          className={roleTableDataErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))}
                                        </select>
                                        {roleTableDataErrors[index]?.role && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {roleTableDataErrors[index].role}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={row.startDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setRoleTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, startDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setRoleTableDataErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                startDate: !date ? 'Start Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={roleTableDataErrors[index]?.startDate ? 'error form-control' : 'form-control'}
                                          onKeyDown={(e) => handleKeyDown(e, row, roleTableData)}
                                        />
                                        {roleTableDataErrors[index]?.startDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {roleTableDataErrors[index].startDate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.endDate}
                                          className={roleTableDataErrors[index]?.endDate ? 'error form-control' : 'form-control'}
                                          onChange={(e) => {
                                            const date = e.target.value; // Capture the date string from input

                                            // Update the endDate in the row
                                            setRoleTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, endDate: date } : r)));

                                            // Handle error validation for endDate
                                            setRoleTableDataErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                endDate: !date ? 'End Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          min={row.startDate || new Date().toISOString().split('T')[0]} // Ensure the minDate is properly set
                                          disabled={!row.startDate}
                                        />
                                        {roleTableDataErrors[index]?.endDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {roleTableDataErrors[index].endDate}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {value === 1 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-6">
                            <div className="table-responsive">
                              <table className="table table-bordered table-responsive">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                      Branch Code
                                    </th>
                                    <th className="px-2 py-2 text-white text-center">Branch</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {branchTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              branchTableData,
                                              setBranchTableData,
                                              branchTableErrors,
                                              setBranchTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.branchCode}
                                          onChange={(e) => handleBranchCodeChange(row, index, e)}
                                          onKeyDown={(e) => handleKeyDown(e, row, branchTableData)}
                                          className={branchTableErrors[index]?.branchCode ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select</option>
                                          {getAvailableBranchCodes(row.id).map((branch) => (
                                            <option key={branch.id} value={branch.branchCode}>
                                              {branch.branchCode}
                                            </option>
                                          ))}
                                        </select>
                                        {branchTableErrors[index]?.branchCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {branchTableErrors[index].branchCode}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2 text-center pt-3">{row.branch}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data && data} columns={columns} editCallback={editEmployee} blockEdit={true} toEdit={getAllUserById} />
          )}
        </div>
      </div>
    </>
  );
};
export default UserCreation;
