import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';

const ProductService = () => {
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    active: true,
    type: '',
    code: '',
    name: '',
    description: '',
    dimension: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    type: '',
    code: '',
    name: '',
    description: '',
    dimension: ''
  });

  const listViewColumns = [
    { accessorKey: 'type', header: 'Type', size: 140 },
    { accessorKey: 'code', header: 'Code', size: 140 },
    { accessorKey: 'name', header: 'Name', size: 140 },
    { accessorKey: 'description', header: 'Description', size: 140 },
    { accessorKey: 'dimension', header: 'Dimension', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  useEffect(() => {
    getAllProductServiceCode();
  }, []);

  const getAllProductServiceCode = async () => {
    try {
      const result = await apiCalls('get', `/api/commonmaster/getProductServiceByOrgId?orgId=${orgId}`);
      setListViewData(result.paramObjectsMap?.productServices?.reverse() || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    const codeRegex = /^[A-Za-z0-9_-]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    const descriptionRegex = /^[A-Za-z0-9 .,!]*$/;
    const dimensionRegex = /^[0-9xX.]*$/;

    let newErrors = { ...fieldErrors };

    if (name === 'code') {
      if (!codeRegex.test(inputValue)) newErrors.code = 'Only alphanumeric, underscore, hyphen allowed.';
      else if (inputValue.length > 10) newErrors.code = 'Max length 10 characters.';
      else newErrors.code = '';
    }

    if (name === 'name') {
      if (!nameRegex.test(inputValue)) newErrors.name = 'Only letters and spaces allowed.';
      else if (inputValue.length > 50) newErrors.name = 'Max length 50 characters.';
      else newErrors.name = '';
    }

    if (name === 'description') {
      if (!descriptionRegex.test(inputValue)) newErrors.description = 'Only letters, numbers, spaces, .,! allowed.';
      else if (inputValue.length > 200) newErrors.description = 'Max length 200 characters.';
      else newErrors.description = '';
    }

    // if (name === 'dimension') {
    //   if (!dimensionRegex.test(inputValue)) newErrors.dimension = 'Only numbers, x, X, and decimal allowed.';
    //   else if (inputValue.length > 20) newErrors.dimension = 'Max length 20 characters.';
    //   else newErrors.dimension = '';
    // }

    setFieldErrors(newErrors);

    if (!newErrors[name]) {
      setFormData({ ...formData, [name]: inputValue });
    }
  };

  const handleCheckboxChange = (event) => {
    setFormData({ ...formData, active: event.target.checked });
  };

  const handleClear = () => {
    setFormData({
      active: true,
      type: '',
      code: '',
      name: '',
      description: '',
      dimension: ''
    });
    setFieldErrors({});
    setEditId('');
  };

  const handleView = () => {
    setListView(!listView);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.code) errors.code = 'Code is required';
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.description) errors.description = 'Description is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    const formDataToSend = {
      ...(editId && { id: editId }),
      active: formData.active,
      type: formData.type,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      dimension: formData.dimension,
      orgId: parseInt(orgId),
      createdBy: loginUserName
    };

    try {
      setIsLoading(true);
      const result = await apiCalls('put', '/api/commonmaster/updateProductService', formDataToSend);
      if (result.status) {
        showToast('success', editId ? 'Product/Service Updated Successfully' : 'Product/Service Created Successfully');
        getAllProductServiceCode();
        handleClear();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Product/Service creation failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      showToast('error', 'An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-start mb-2 " style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} />
          </div>
        ) : (
          <>
            <div className="row"></div>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                  <InputLabel id="mode" required>
                    Type
                  </InputLabel>
                  <Select labelId="type" id="type" name="type" required value={formData.type} label="Type" onChange={handleInputChange}>
                    <MenuItem value="Product">PRODUCT</MenuItem>
                    <MenuItem value="Services">SERVICES</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText>{fieldErrors.type}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="code"
                  label="Code"
                  name="code"
                  variant="outlined"
                  size="small"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.code}
                  helperText={fieldErrors.code}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="name"
                  label="Name"
                  name="name"
                  variant="outlined"
                  size="small"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="description"
                  label="Description"
                  name="description"
                  variant="outlined"
                  size="small"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.description}
                  helperText={fieldErrors.description}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="dimension"
                  label="Dimension"
                  name="dimension"
                  variant="outlined"
                  size="small"
                  value={formData.dimension}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!fieldErrors.dimension}
                  helperText={fieldErrors.dimension}
                />
              </div>

              <div className="col-md-2 mb-3">
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    multiline
                    startIcon={<CloudUploadIcon />}
                    sx={{ color: 'rgb(103 58 183)', borderRadius: '12px' }}
                  >
                    Upload
                    <input type="file" hidden />
                  </Button>
                </Box>
              </div>

              <div className="col-md-3 mb-3 d-flex align-items-center">
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />} label="Active" />
                </FormGroup>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default ProductService;
