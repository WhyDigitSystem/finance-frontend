import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Chip, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCall from 'apicalls';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
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
      const result = await apiCall('get', `/basicMaster/getRoleMasterByOrgId?orgId=${orgId}`);

      if (result) {
        setData(result.paramObjectsMap.roleVO);
        setRoleData(result.paramObjectsMap.roleVO.map((list) => list.role));
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
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

      // Make the API call using the apiCall method
      const response = await apiCall('put', 'basicMaster/updateCreateRoleMaster', formData);

      // Handle successful response
      console.log('Response:', response.data);
      handleClear();
      toast.success('Role Created Successfully', {
        autoClose: 2000,
        theme: 'colored'
      });
      getRole();
    } catch (error) {
      // Error handling is already managed by the apiCall method
      console.error('Error:', error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  const editRole = async (updatedCountry) => {
    try {
      const result = await apiCall('put', `/basicMaster/updateCreateRoleMaster`, updatedCountry);

      if (result) {
        toast.success('Role Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getRole();
      } else {
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
                  <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
                  <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
                  <ActionButton title="Save" icon={SaveIcon} onClick={handleSubmit} margin="0 10px 0 10px" />
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
