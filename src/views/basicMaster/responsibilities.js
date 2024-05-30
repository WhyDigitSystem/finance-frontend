import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  ButtonBase,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from '@mui/material';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from './CommonTable';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ['Dashboard', 'BasicMaster', 'Master', 'Transaction', 'AR-Receivable', 'AP-Payable'];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

const Responsibilities = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [showFields, setShowFields] = useState(true);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [roleDataSelect, setRoleDataSelect] = useState([]);
  const [value, setValue] = useState('1');

  const [formData, setFormData] = useState({
    role: '',
    orgId: orgId,
    active: true,
    screenDTO: []
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
    {
      accessorKey: 'screenVO',
      header: 'Screens',
      Cell: ({ cell }) => {
        const screens = cell
          .getValue()
          .map((screen) => screen.screenName)
          .join(', ');
        return screens;
      }
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  useEffect(() => {
    getRole();
    getRoleData();
  }, [showFields]);

  const handleClear = () => {
    setFormData({
      role: '',
      active: true,
      screenDTO: []
    });
    setPersonName([]);
    setFieldErrors({
      role: false
    });
  };

  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    // Convert the selected values into the required format
    const selectedScreens = typeof value === 'string' ? value.split(',') : value;
    const screenDTO = selectedScreens.map((screenName, index) => ({
      //   id: index, // Assuming you don't have actual ids for the screens
      screenName
    }));

    setPersonName(selectedScreens);

    // Update the formData with the new screenDTO
    setFormData((prevFormData) => ({
      ...prevFormData,
      screenDTO
    }));
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

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleList = () => {
    setShowFields(!showFields);
  };

  const getRole = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getResponsibilitiesByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        const responsibilities = response.data.paramObjectsMap.responsibilitiesVO;
        setData(responsibilities);

        const screenNames = responsibilities.flatMap((item) => item.screenVO.map((screen) => screen.screenName));
        setRoleData(screenNames);

        console.log('Test', screenNames);
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
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateResponsibilities`, formData)
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
      <div>
        <div>
          <Box sx={{ width: '100%', typography: 'body1' }}>
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
                  <FormControl sx={{ width: 215 }} size="small">
                    <InputLabel id="demo-multiple-chip-label">Screens</InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
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
                {/* 
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
                </div> */}
              </div>
            ) : (
              <CommonTable data={data} columns={columns} editCallback={editRole} roleData={roleData} />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Responsibilities;
