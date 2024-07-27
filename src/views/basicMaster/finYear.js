import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCall from 'apicalls';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
import CommonTable from './CommonTable';

const FinYear = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);
  const [showFields, setShowFields] = useState(true);
  const [countryVO, setCountryVO] = useState([]);

  const [formData, setFormData] = useState({
    finYr: '',
    finYrId: '',
    finYrIdentifier: '',
    startDate: null,
    endDate: null,
    currentFinYr: false,
    sno: '',
    active: true,
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    finYr: false,
    finYrId: false,
    finYrIdentifier: false,
    startDate: false,
    endDate: false,
    currentFinYr: false,
    sno: false
  });

  const handleClear = () => {
    setFormData({
      finYr: '',
      finYrId: '',
      finYrIdentifier: '',
      startDate: '',
      endDate: '',
      currentFinYr: false,
      sno: ''
    });

    setFieldErrors({
      finYr: false,
      finYrId: false,
      finYrIdentifier: false,
      startDate: false,
      endDate: false,
      currentFinYr: false,
      sno: false
    });
  };

  const columns = [
    { accessorKey: 'finYr', header: 'FinYear', size: 140 },
    { accessorKey: 'finYrId', header: 'FinYearId', size: 140 },
    { accessorKey: 'finYrIdentifier', header: 'FinYearIdentifier', size: 140 },
    { accessorKey: 'startDate', header: 'Start Date', size: 140 },
    { accessorKey: 'endDate', header: 'End Date', size: 140 },
    { accessorKey: 'currentFinYr', header: 'Current FinYear', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  useEffect(() => {
    getFinYear();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    let newValue = value;

    if (name === 'sno') {
      newValue = parseInt(value, 10) || 0; // fallback to 0 if value is not a valid number
    } else if (name === 'active' || name === 'currentFinYr') {
      newValue = checked;
    } else {
      newValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: newValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleList = () => {
    setShowFields(!showFields);
  };

  const getFinYear = async () => {
    try {
      const result = await apiCall('get', `/basicMaster/getFinancialYearByOrgId?orgId=${orgId}`);

      if (result) {
        setData(result.paramObjectsMap.financialYearVO || []);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (name, date) => {
    if (date && dayjs(date).isValid()) {
      const dateString = dayjs(date).toISOString();
      setFormData({ ...formData, [name]: dateString });
      setFieldErrors({ ...fieldErrors, [name]: false });
    } else {
      setFormData({ ...formData, [name]: null });
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if any field is empty
      console.log('formData', formData);
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
      const response = await apiCall('post', 'basicMaster/financial', formData);

      // Handle successful response
      console.log('Response:', response.data);
      handleClear();
      toast.success('FinYear Created Successfully', {
        autoClose: 2000,
        theme: 'colored'
      });
      getFinYear();
    } catch (error) {
      // Error handling is already managed by the apiCall method
      toast.error(error.message, {
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
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSubmit} margin="0 10px 0 10px" />
        </div>
        {showFields ? (
          <div className="row d-flex">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="finYr"
                  label="Fin Year"
                  size="small"
                  required
                  name="finYr"
                  value={formData.finYr}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.finYr ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="finYrId"
                  label="FinYear ID"
                  size="small"
                  required
                  value={formData.finYrId}
                  name="finYrId"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.finYrId ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="finYrIdentifier"
                  label="FinYear Identifier"
                  size="small"
                  required
                  value={formData.finYrIdentifier}
                  name="finYrIdentifier"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.finYrIdentifier ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled" size="small" sx={{ minWidth: '120px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate ? dayjs(formData.startDate) : null}
                    onChange={(date) => handleDateChange('startDate', date)}
                    slotProps={{
                      textField: { size: 'small', clearable: true }
                    }}
                    error={fieldErrors.startDate}
                    helperText={fieldErrors.startDate ? 'This field is required' : ''}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled" size="small" sx={{ minHeight: '120px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate ? dayjs(formData.endDate) : null}
                    onChange={(date) => handleDateChange('endDate', date)}
                    slotProps={{
                      textField: { size: 'small', clearable: true }
                    }}
                    error={fieldErrors.endDate}
                    helperText={fieldErrors.endDate ? 'This field is required' : ''}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="sno"
                  label="Sequence No"
                  size="small"
                  required
                  value={formData.sno}
                  name="sno"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.sno ? 'This field is required' : ''}</span>}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3 ml-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.currentFinYr}
                      onChange={handleInputChange}
                      name="currentFinYr"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Current Fin Year"
                />
              </FormGroup>
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
          <CommonTable data={Array.isArray(data) ? data : []} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default FinYear;
