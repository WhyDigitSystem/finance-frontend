import React, { useEffect, useState } from 'react';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import WhSample from '../../assets/sample-files/SampleExcel.xlsx';
const Warehouse = () => {
  const [listView, setListView] = useState(true);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);
  const orgId = localStorage.getItem('orgId');
  const createdBy = localStorage.getItem('userName');
  const modifiedBy = createdBy;
  const [allBranchName, setAllBranchName] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [countryAllList, setCountryAllList] = useState([]);
  const [stateAllList, setStateAllList] = useState([]);
  const [cityAllList, setCityAllList] = useState([]);

  const [formData, setFormData] = useState({
    locationName: '',
    locationUnit: '',
    name: '',
    code: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    gst: '',
    stockBranch: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});

  let handleListView = () => {
    setListView(!listView);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value.toUpperCase();

    const NameRegex = /^[A-Za-z0-9 .-]*$/;
    const unitRegex = /^[A-Za-z0-9 ]*$/;
    const codeRegex = /^[A-Za-z0-9_-]*$/;
    // const addressRegex = /^[A-Za-z0-9\s,.-]*$/;
    const gstRegex = /^[A-Za-z0-9]*$/;
    const pincodeRegex = /^[0-9]*$/;

    let errorMessage = { ...fieldErrors };
    if (name === 'locationName') {
      if (!NameRegex.test(inputValue)) {
        errorMessage.locationName = 'Only allowed alphanumeric, space, dot, hyphen';
      } else if (inputValue.length > 50) {
        errorMessage.locationName = 'Max Length 50';
      } else {
        errorMessage.locationName = '';
      }
    }
    if (name === 'locationUnit') {
      if (!unitRegex.test(inputValue)) {
        errorMessage.locationUnit = 'Only allowed alphanumeric, space';
      } else if (inputValue.length > 50) {
        errorMessage.locationUnit = 'Max Length 50';
      } else {
        errorMessage.locationUnit = '';
      }
    }
    if (name === 'code') {
      if (!codeRegex.test(inputValue)) {
        errorMessage.code = 'Only allowed alphanumeric, underscore, hyphen';
      } else if (inputValue.length > 50) {
        errorMessage.code = 'Max Length 50';
      } else {
        errorMessage.code = '';
      }
    }
    if (name === 'gst') {
      if (!gstRegex.test(inputValue)) {
        errorMessage.gst = 'Only allowed alphanumeric';
      } else if (inputValue.length > 15) {
        errorMessage.gst = 'Max Length 15';
      } else {
        errorMessage.gst = '';
      }
    }

    if (name === 'pincode') {
      if (!pincodeRegex.test(inputValue)) {
        errorMessage.pincode = 'Only allowed Digist';
      } else if (inputValue.length > 6) {
        errorMessage.pincode = 'Max Length 6';
      } else {
        errorMessage.pincode = '';
      }
    }

    if (name === 'stockBranch') {
      if (!unitRegex.test(inputValue)) {
        errorMessage.stockBranch = 'Only allowed alphanumeric, space';
      } else if (inputValue.length > 50) {
        errorMessage.stockBranch = 'Max Length 50';
      } else {
        errorMessage.stockBranch = '';
      }
    }

    if (name === 'country') {
      if (!inputValue) {
        errorMessage.country = 'Country is required';
      } else {
        errorMessage.country = '';
      }
    }

    if (name === 'state') {
      if (!inputValue) {
        errorMessage.state = 'State is required';
      } else {
        errorMessage.state = '';
      }
    }
    if (name === 'city') {
      if (!inputValue) {
        errorMessage.city = 'City is required';
      } else {
        errorMessage.city = '';
      }
    }
    if (name === 'stockBranch') {
      if (!inputValue) {
        errorMessage.stockBranch = 'Stock Branch is required';
      } else {
        errorMessage.stockBranch = '';
      }
    }
    if (name === 'address') {
      if (!inputValue) {
        errorMessage.address = 'Address is required';
      } else {
        errorMessage.address = '';
      }
    }

    setFieldErrors(errorMessage);
    if (!errorMessage[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };
  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      active: event.target.checked
    }));
  };

  const handleClearAll = () => {
    setFormData({
      locationName: '',
      locationUnit: '',
      name: '',
      code: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      gst: '',
      stockBranch: '',
      active: true
    });
    setFieldErrors({});
    setEditId('');
  };

  const validForm = () => {
    let error = {};
    if (!formData.locationName) {
      error.locationName = 'Location Name is required';
    }
    if (!formData.locationUnit) {
      error.locationUnit = 'Location Unit is required';
    }
    if (!formData.code) {
      error.code = 'Code is required';
    }
    if (!formData.address) {
      error.address = 'Address is required';
    }
    if (!formData.country) {
      error.country = 'Country is required';
    }
    if (!formData.state) {
      error.state = 'State is required';
    }
    if (!formData.city) {
      error.city = 'City is required';
    }
    if (!formData.pincode) {
      error.pincode = 'Pincode is required';
    }
    if (!formData.stockBranch) {
      error.stockBranch = 'Stock Branch is required';
    }
    setFieldErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validForm()) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    const formDataSendtoApi = {
      ...(editId && { id: editId }),
      locationName: formData.locationName,
      locationUnit: formData.locationUnit,
      name: formData.name,
      code: formData.code,
      address: formData.address,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode ? parseInt(formData.pincode) : '',
      gst: formData.gst,
      stockBranch: formData.stockBranch,
      active: formData.active,
      orgId: parseInt(orgId),
      createdBy,
      modifiedBy
    };

    try {
      const result = await apiCalls('put', '/warehouser/createupdateWarehouse', formDataSendtoApi);
      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        handleClearAll();
        getAllData();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Creation failed');
      }
    } catch (error) {
      showToast('error', 'API call failed');
    }
  };

  const getAllData = async () => {
    try {
      const res = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setListViewData(res.paramObjectsMap.warehouseVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getAllData();
    getAllCountry();
    getBranchName();
    // getAllcity();
    // getAllState();
  }, []);

  const rowEditgetbyid = async (row) => {
    setEditId(row.original.id);
    setFieldErrors({});
    setListView(true);
    try {
      const results = await apiCalls('get', `/warehouser/getWarehouseById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const product = results.paramObjectsMap.warehouseVO;
        setFormData({
          locationName: product.locationName || '',
          locationUnit: product.locationUnit || '',
          name: product.name || '',
          code: product.code || '',
          address: product.address || '',
          country: product.country || '',
          state: product.state || '',
          city: product.city || '',
          pincode: parseInt(product.pincode || ''),
          gst: product.gst,
          stockBranch: product.stockBranch || '',
          active: product.active === 'Active' ? true : false,
          orgId: parseInt(orgId),
          createdBy,
          modifiedBy
        });
      } else {
        console.warn('Error fetching product details:', results.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  const listViewColumns = [
    { accessorKey: 'name', header: 'Warehouse Name', size: 140 },
    { accessorKey: 'stockBranch', header: 'Stock Branch', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    // { accessorKey: 'city', header: 'City', size: 140 },
    // { accessorKey: 'pincode', header: 'Pincode', size: 140 },
    { accessorKey: 'gst', header: 'Reg In', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const getAllCountry = async () => {
    try {
      const response = await apiCalls('get', `/commonmaster/country?orgid=${orgId}`);
      setCountryAllList(response.paramObjectsMap.countryVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: `${prev.locationName} - ${prev.locationUnit}`
    }));
  }, [formData.locationName, formData.locationUnit]);

  const getBranchName = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getStockBranchName?orgId=${orgId}`);
      setAllBranchName(response.paramObjectsMap.taxInvoiceVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleNew = () => {
    handleClearAll();
    setListView(!listView);
  };
  //
  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };
  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };
  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };
  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };
  //
  const getAllcity = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/warehouser/getAllCitiesByStateAndCountry?country=${formData.country}&orgId=${orgId}&state=${formData.state}`
      );

      setCityAllList(response.paramObjectsMap.cityVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllState = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllStatesByCountry?country=${formData.country}&orgId=${orgId}`);
      setStateAllList(response.paramObjectsMap.stateVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    if (formData.country) {
      getAllState();
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state && formData.country) {
      getAllcity();
    }
  }, [formData.state]);

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
      <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
        <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          {listView ? <ActionButton title="Clear" icon={ClearIcon} onClick={handleClearAll} /> : ''}
          {listView ? <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} /> : ''}
          {listView ? <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} /> : ''}
          {uploadOpen && (
            <CommonBulkUpload
              open={uploadOpen}
              handleClose={handleBulkUploadClose}
              title="Upload Files"
              uploadText="Upload file"
              downloadText="Sample File"
              onSubmit={handleSubmit}
              sampleFileDownload={WhSample}
              handleFileUpload={handleFileUpload}
              apiUrl={`/warehouser/excelUploadForWarehouse?createdBy=${createdBy}&orgId=${orgId}`}
              screen="WH"
              loginUser={createdBy}
              orgId={orgId}
            ></CommonBulkUpload>
          )}
          {!listView ? (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              sx={{
                borderColor: '#1e88e5',
                backgroundColor: '#e3f2fd',
                color: '#5e35b1',
                fontWeight: 'bold',
                textTransform: 'none',
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                mr: 1.25,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: '#bbdefb',
                  color: '#1565c0'
                }
              }}
              onClick={handleNew}
            >
              New
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
      {listView ? (
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="locationName"
                label="Location Name"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.locationName}
                helperText={fieldErrors.locationName}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="locationUnit"
                label="Location Unit"
                name="locationUnit"
                value={formData.locationUnit}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.locationUnit}
                helperText={fieldErrors.locationUnit}
              />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="name"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                size="small"
                disabled
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
              />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="code"
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.code}
                helperText={fieldErrors.code}
              />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="address"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.address}
                helperText={fieldErrors.address}
              />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.country}>
              <InputLabel htmlFor="type">Country</InputLabel>
              <Select labelId="country-label" id="country" label="Country" name="country" value={formData.country} onChange={handleChange}>
                {/* do not allow duplicate */}
                {/* {[...new Set(countryAllList.map((c) => c.country))].map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))} */}
                {countryAllList.map((country) => (
                  <MenuItem key={country.countryName} value={country.countryName}>
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.state}>
              <InputLabel htmlFor="type">State</InputLabel>
              <Select labelId="state-label" id="state" label="State" name="state" value={formData.state} onChange={handleChange}>
                {stateAllList.map((state) => (
                  <MenuItem key={state.stateName} value={state.stateName}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.state && <FormHelperText>{fieldErrors.state}</FormHelperText>}
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.city}>
              <InputLabel htmlFor="type">City</InputLabel>
              <Select labelId="city-label" id="city" label="City" name="city" value={formData.city} onChange={handleChange}>
                {cityAllList.map((city) => (
                  <MenuItem key={city.cityName} value={city.cityName}>
                    {city.cityName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.city && <FormHelperText>{fieldErrors.city}</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="pincode"
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.pincode}
                helperText={fieldErrors.pincode}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="gst"
                label="Reg In"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                variant="outlined"
                size="small"
                error={!!fieldErrors.gst}
                helperText={fieldErrors.gst}
              />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.stockBranch}>
              <InputLabel htmlFor="type">Stock Branch</InputLabel>
              <Select
                labelId="unit-label"
                id="stockBranch"
                label="Stock Branch"
                name="stockBranch"
                value={formData.stockBranch}
                onChange={handleChange}
              >
                {allBranchName.map((branch) => (
                  <MenuItem key={branch.branch} value={branch.branch}>
                    {branch.branch}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.stockBranch && <FormHelperText>{fieldErrors.stockBranch}</FormHelperText>}
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormGroup>
              <FormControlLabel
                name="active"
                label="Active"
                control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
              />
            </FormGroup>
          </div>
        </div>
      ) : (
        <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={rowEditgetbyid} />
      )}
    </div>
  );
};
export default Warehouse;
