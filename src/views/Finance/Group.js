import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroupTable from './GroupTable';

const Group = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);

  const [formData, setFormData] = useState({
    groupName: '',
    gstTaxflag: '',
    accountCode: '',
    coaList: '',
    accountGroupName: '',
    type: '',
    interBranchAc: false,
    controllAc: false,
    category: '',
    branch: '',
    currency: '',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    groupName: false,
    gstTaxflag: false,
    accountCode: false,
    coaList: false,
    accountGroupName: false,
    type: false,
    interBranchAc: false,
    controllAc: false,
    category: false,
    branch: false,
    currency: false,
    active: false
  });

  useEffect(() => {
    getGroup();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getGroup = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllSetTaxRate`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.setTaxRateVO);
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
    const fieldsToExclude = ['interBranchAc', 'controllAc', 'active'];

    // Check if any field is empty, excluding certain fields
    const errors = Object.keys(formData).reduce((acc, key) => {
      if (!fieldsToExclude.includes(key) && !formData[key]) {
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
      .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateGroupLedger`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Set Tax Rate Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClear = () => {
    setFormData({
      groupName: '',
      gstTaxflag: '',
      accountCode: '',
      coaList: '',
      accountGroupName: '',
      type: '',
      interBranchAc: false,
      controllAc: false,
      category: '',
      branch: '',
      currency: '',
      active: false
    });
    setFieldErrors({
      groupName: false,
      gstTaxflag: false,
      accountCode: false,
      coaList: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      category: false,
      branch: false,
      currency: false,
      active: false
    });
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      groupName: false,
      gstTaxflag: false,
      accountCode: false,
      coaList: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      category: false,
      branch: false,
      currency: false,
      active: false
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
        toast.success('Set Tax Rate Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error editing row:', error);
        // Handle error scenarios
        toast.error('Failed to Update Set Tax Rate', {
          autoClose: 2000,
          theme: 'colored'
        });
      });
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
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
            <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleListView}>
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
        {/* <div className="d-flex justify-content-between">
          <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1>
        </div> */}
        {showForm ? (
          <div className="row d-flex ">
            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Group Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Group Name"
                  onChange={handleInputChange}
                  name="groupName"
                  value={formData.groupName}
                >
                  <MenuItem value={10}>Administrative Charges</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.groupName && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-4 mb-2">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">GST Tax Flag</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="GST Tax Flag"
                  onChange={handleInputChange}
                  name="gstTaxflag"
                  value={formData.gstTaxflag}
                >
                  <MenuItem value={10}>NA</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.gstTaxflag && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-4 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="Account Code"
                  size="small"
                  required
                  placeholder="40003600104"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountCode"
                  value={formData.accountCode}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.accountCode ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">COA List</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="COA List"
                  onChange={handleInputChange}
                  name="coaList"
                  value={formData.coaList}
                >
                  <MenuItem value={10}>NA</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.coaList && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-4 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="Account/Group Name"
                  size="small"
                  required
                  placeholder="40003600104"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountGroupName"
                  value={formData.accountGroupName}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.accountGroupName ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  onChange={handleInputChange}
                  name="type"
                  value={formData.type}
                >
                  <MenuItem value={10}>Account</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-2 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.interBranchAc}
                      onChange={handleInputChange}
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Interbranch A/c"
                  name="interBranchAc"
                />
              </FormGroup>
            </div>
            <div className="col-md-2 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.controllAc}
                      onChange={handleInputChange}
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Control A/c"
                  name="controllAc"
                />
              </FormGroup>
            </div>
            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  onChange={handleInputChange}
                  name="category"
                  value={formData.category}
                >
                  <MenuItem value={10}>Others</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.category && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Branch</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleInputChange}
                  name="branch"
                  value={formData.branch}
                  label="Branch"
                >
                  <MenuItem value={10}>Others</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.branch && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-4 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Currency"
                  onChange={handleInputChange}
                  name="currency"
                  value={formData.currency}
                >
                  <MenuItem value={10}>INR</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-4 mb-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.active} onChange={handleInputChange} sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }} />
                  }
                  label="Active"
                  name="active"
                />
              </FormGroup>
            </div>
          </div>
        ) : (
          <GroupTable data={data} onRowEditTable={handleRowEdit} />
        )}
      </div>
    </>
  );
};

export default Group;
