import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { InputLabel, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCall from 'apicalls';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
import { getCountryByOrgId } from 'utils/common-functions';
import CommonTable from './CommonTable';

const State = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);
  const [showFields, setShowFields] = useState(true);
  const [countryVO, setCountryVO] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stateName: '',
    stateCode: '',
    country: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    stateName: false,
    country: false,
    stateCode: false
  });

  const handleClear = () => {
    setFormData({
      stateName: '',
      stateCode: '',
      country: '',
      active: true
    });

    setFieldErrors({
      stateName: false,
      country: false,
      stateCode: false
    });
  };

  const columns = [
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'stateName', header: 'State', size: 140 },
    { accessorKey: 'stateCode', header: 'Code', size: 140 },
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
    getState();
  }, []);

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

  const getState = async () => {
    try {
      const result = await apiCall('get', `/basicMaster/getStateByOrgId?orgId=${orgId}`);

      if (result) {
        setData(result.paramObjectsMap.stateVO);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    // Check for errors in the form fields
    const errors = Object.keys(formData).reduce((acc, key) => {
      if (!formData[key]) {
        acc[key] = true;
      }
      return acc;
    }, {});

    // If there are errors, set the fieldErrors state and prevent API call
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Proceed with the API call
    try {
      setLoading(true);
      const response = await apiCall('put', 'basicMaster/updateCreateState', formData);
      console.log('Response:', response.data);
      handleClear();
      toast.success('State Created Successfully', {
        autoClose: 2000,
        theme: 'colored'
      });
      getState();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error posting data', {
        autoClose: 2000,
        theme: 'colored'
      });
    } finally {
      setLoading(false);
    }
  };

  const editState = async (updatedState) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateState`, updatedState);
      if (response.status === 200) {
        toast.success('State Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getState();
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to Update State', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error updating state:', error);
      toast.error('Error Updating state', {
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
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={loading} margin="0 10px 0 10px" />
        </div>
        {showFields ? (
          <div className="row d-flex">
            <div className="col-md-3 mb-3 ">
              <FormControl fullWidth size="small">
                <InputLabel id="country">Country</InputLabel>
                <Select label="country-label" id="country" name="country" value={formData.country} onChange={handleInputChange}>
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
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="State"
                  size="small"
                  required
                  name="stateName"
                  value={formData.stateName}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.stateName ? 'This field is required' : ''}</span>}
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
                  value={formData.stateCode}
                  name="stateCode"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.stateCode ? 'This field is required' : ''}</span>}
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
          <CommonTable data={data} columns={columns} editCallback={editState} countryVO={countryVO} />
        )}
      </div>
    </div>
  );
};

export default State;
