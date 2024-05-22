import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, ButtonBase, Chip, Grid, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from './CommonTable';
import Responsibilities from './responsibilities';

const Roles = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [showFields, setShowFields] = useState(true);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [value, setValue] = useState('1');

  const [formData, setFormData] = useState({
    role: '',
    orgId: orgId,
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    role: false
  });

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.light,
    height: 28
  };

  const columns = [
    { accessorKey: 'role', header: 'Role', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  useEffect(() => {
    getRole();
  }, [showFields]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClear = () => {
    setFormData({
      role: '',
      active: true
    });

    setFieldErrors({
      role: false
    });
  };

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

  const getRole = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getRoleMasterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.roleVO);
        setRoleData(response.data.paramObjectsMap.roleVO.map((list) => list.role));

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
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateRoleMaster`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Role Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getRole();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const editRole = async (updatedCountry) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateRoleMaster`, updatedCountry);
      if (response.status === 200) {
        toast.success('Role Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getRole();
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to Update Role', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error updating country:', error);
      toast.error('Error Updating Role', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                  <Tab label="Roles" value="1" />
                  <Tab label="Responsibilities" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
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

                  <Tooltip title="List View" placement="top" onClick={handleList}>
                    {' '}
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
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="account"
                          label="Role"
                          size="small"
                          required
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          helperText={<span style={{ color: 'red' }}>{fieldErrors.role ? 'This field is required' : ''}</span>}
                        />
                      </FormControl>
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

                    <div>
                      <Typography variant="subtitle1">Available Roles</Typography>

                      <Grid item xs={12} sx={{ marginTop: '10px', gap: '5px' }}>
                        <Grid container>
                          {roleData.map((role, index) => (
                            <Grid item key={index} sx={{ marginLeft: index > 0 ? '5px' : '0' }}>
                              <Chip label={role} sx={chipSuccessSX} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                ) : (
                  <CommonTable data={data} columns={columns} editCallback={editRole} />
                )}
              </TabPanel>
              <TabPanel value="2">
                <Responsibilities />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Roles;
