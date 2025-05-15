import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import ChargeCodeSample from '../../assets/sample-files/ChargeCodeSample.xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileExcel } from 'react-icons/fa';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { FormHelperText } from '@mui/material';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

export const CreateAsset = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [listValues, setListValues] = useState([]);
  const [serviceCode, setServiceCode] = useState([]);
  const [salesCode, setSalesCode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [allHsnSacCode, setAllHsnSacCode] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [assetType, setAssetType] = useState([]);
  const [assetCategory, setAssetCategory] = useState([]);
  const [assetDetais, setAssetDetails] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    type: '',
    category: '',
    categoryCode: '',
    assetCode: '',
    assetDescripition: '',
    belongsTo: '',
    materialIdentification: '',
    design: '',
    manufacturePartCode: '',
    eanUpc: '',
    grossWeight: '',
    chargeableWeight: '',
    expectedLife: '',
    maintenancePeriod: '',
    expectedTrips: '',
    hsnCode: '',
    taxRate: '',
    costPrice: '',
    sellPrice: '',
    scrapValue: '',
    length: '',
    breath: '',
    height: '',
    cancelremarks: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    type: '',
    category: '',
    categoryCode: '',
    assetCode: '',
    assetDescripition: '',
    belongsTo: '',
    materialIdentification: '',
    design: '',
    manufacturePartCode: '',
    eanUpc: '',
    grossWeight: '',
    chargeableWeight: '',
    expectedLife: '',
    maintenancePeriod: '',
    expectedTrips: '',
    hsnCode: '',
    taxRate: '',
    costPrice: '',
    sellPrice: '',
    scrapValue: '',
    length: '',
    breath: '',
    height: '',
  });

  const columns = [
    { accessorKey: 'assetType', header: 'Type', size: 140 },
    { accessorKey: 'category', header: 'Category', size: 140 },
    { accessorKey: 'categoryCode', header: 'Category Code', size: 140 },
    { accessorKey: 'assetCodeId', header: 'Asset Code', size: 140 },
    { accessorKey: 'assetName', header: 'Asset Descripition', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'serviceAccountCode') {
      const selectedService = serviceCode.find((item) => item.code === value);
      const sacDescription = selectedService ? selectedService.description : '';

      setFormData({
        ...formData,
        sacDescripition: sacDescription,
        serviceAccountCode: selectedService.code
      });
    } else if (name === 'category') {
      const selectedCategory = assetCategory.find((item) => item.category === value);
      const categoryCode = selectedCategory ? selectedCategory.categoryCode : '';

      setFormData({
        ...formData,
        category: value,
        categoryCode: categoryCode
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  useEffect(() => {
    getAllServiceAccountCode();
    getAllCustomerDetails();
    getAssetType();
    getAssetCategory();
    getAllAsset();
  }, []);

  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllCustomers?orgId=${orgId}`);
      setCustomerDetails(response.paramObjectsMap.masterVOs);

    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllServiceAccountCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllActiveSacCodeByOrgId?orgId=${orgId}`);
      setAllHsnSacCode(result.paramObjectsMap.hSNSacCodeVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAssetType = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetTypeByOrgId?orgid=${orgId}`);
      setAssetType(result.paramObjectsMap.assetTypeVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAssetCategory = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetCategoryByOrgId?orgid=${orgId}`);
      setAssetCategory(result.paramObjectsMap.assetCategoryVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAsset = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetByOrgId?orgid=${orgId}`);
      setAssetDetails(result.paramObjectsMap.assetVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAssetById = async (row) => {
    handleClear();
    console.log('THE SELECTED ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `kitController/getAssetById?id=${row.original.id}`);

      if (response.status === true) {
        const assetDetailsVO = response.paramObjectsMap.assetVO;
        setShowForm(true);

        setFormData({
          active: assetDetailsVO.active === "Active", // ✅ Convert to boolean
          type: assetDetailsVO.assetType || '',
          category: assetDetailsVO.category || '',
          categoryCode: assetDetailsVO.categoryCode || '',
          assetCode: assetDetailsVO.assetCodeId || '',
          assetDescripition: assetDetailsVO.assetName || '',
          belongsTo: assetDetailsVO.belongsTo || '',
          materialIdentification: assetDetailsVO.materialIdentification || '',
          design: assetDetailsVO.design || '',
          manufacturePartCode: assetDetailsVO.manufacturePartCode || '',
          eanUpc: assetDetailsVO.eanUpc || '',
          grossWeight: assetDetailsVO.weight || '',
          chargeableWeight: assetDetailsVO.chargableWeight || '',
          length: assetDetailsVO.length || '',
          breath: assetDetailsVO.breath || '',
          height: assetDetailsVO.height || '',
          expectedLife: assetDetailsVO.expectedLife || '',
          maintenancePeriod: assetDetailsVO.maintanencePeriod || '',
          expectedTrips: assetDetailsVO.expectedTrips || '',
          hsnCode: assetDetailsVO.hsnCode || '',
          taxRate: assetDetailsVO.taxRate || '',
          costPrice: assetDetailsVO.costPrice || '',
          sellPrice: assetDetailsVO.sellPrice || '',
          scrapValue: assetDetailsVO.scrapValue || '',
        });

        console.log('DataToEdit', assetDetailsVO);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleList = () => {
    setShowForm(!showForm);
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleClear = () => {
    setFormData({
      active: true,
      type: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDescripition: '',
      belongsTo: '',
      materialIdentification: '',
      design: '',
      manufacturePartCode: '',
      eanUpc: '',
      grossWeight: '',
      chargeableWeight: '',
      expectedLife: '',
      maintenancePeriod: '',
      expectedTrips: '',
      hsnCode: '',
      taxRate: '',
      costPrice: '',
      sellPrice: '',
      scrapValue: '',
      length: '',
      breath: '',
      height: '',
    });

    setEditId('');

    setFieldErrors({
      type: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDescripition: '',
      belongsTo: '',
      materialIdentification: '',
      design: '',
      manufacturePartCode: '',
      eanUpc: '',
      grossWeight: '',
      chargeableWeight: '',
      expectedLife: '',
      maintenancePeriod: '',
      expectedTrips: '',
      hsnCode: '',
      taxRate: '',
      costPrice: '',
      sellPrice: '',
      scrapValue: '',
      length: '',
      breath: '',
      height: '',
    });
  };

  const validateForm = () => {
    let errors = {};
    let hasError = false;

    if (!formData.type) {
      errors.type = 'Type is required';
      hasError = true;
    }
    if (!formData.category) {
      errors.category = 'Category is required';
      hasError = true;
    }
    if (!formData.categoryCode) {
      errors.categoryCode = 'Category Code is required';
      hasError = true;
    }
    if (!formData.assetCode) {
      errors.assetCode = 'Asset Code is required';
      hasError = true;
    }
    if (!formData.assetDescripition) {
      errors.assetDescripition = 'Asset Descripition is required';
      hasError = true;
    }
    if (!formData.belongsTo) {
      errors.belongsTo = 'Belongs to is required';
      hasError = true;
    }
    if (!formData.materialIdentification) {
      errors.materialIdentification = 'Material Identification is required';
      hasError = true;
    }
    if (!formData.design) {
      errors.design = 'Design is required';
      hasError = true;
    }
    if (!formData.manufacturePartCode) {
      errors.manufacturePartCode = 'Manufacture Part Code is required';
      hasError = true;
    }
    if (!formData.eanUpc) {
      errors.eanUpc = 'EAN/UPC is required';
      hasError = true;
    }
    if (!formData.grossWeight) {
      errors.grossWeight = 'Gross Weight is required';
      hasError = true;
    }
    if (!formData.chargeableWeight) {
      errors.chargeableWeight = 'Chargable Weight is required';
      hasError = true;
    }
    if (!formData.expectedLife) {
      errors.expectedLife = 'Expected Life is required';
      hasError = true;
    }
    if (!formData.maintenancePeriod) {
      errors.maintenancePeriod = 'Maintenance Period is required';
      hasError = true;
    }
    if (!formData.expectedTrips) {
      errors.expectedTrips = 'Expected Trips is required';
      hasError = true;
    }
    if (!formData.hsnCode) {
      errors.hsnCode = 'HSN Code is required';
      hasError = true;
    }
    if (!formData.taxRate) {
      errors.taxRate = 'Tax Rate is required';
      hasError = true;
    }
    if (!formData.costPrice) {
      errors.costPrice = 'Cost Price is required';
      hasError = true;
    }
    if (!formData.sellPrice) {
      errors.sellPrice = 'Sell Price is required';
      hasError = true;
    }
    if (!formData.scrapValue) {
      errors.scrapValue = 'Scrap Price is required';
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleSave = async () => {
    if (validateForm()) {

      const formDataToSend = {
        ...(editId && { id: editId }),
        active: formData.active,
        assetCodeId: formData.assetCode,
        assetName: formData.assetDescripition,
        assetType: formData.type,
        belongsTo: formData.belongsTo,
        breath: parseFloat(formData.breath),
        cancelremarks: formData.cancelremarks,
        category: formData.category,
        categoryCode: formData.categoryCode,
        chargableWeight: formData.chargeableWeight,
        costPrice: formData.costPrice,
        createdBy: loginUserName,
        design: formData.design,
        dimUnit: null,
        eanUpc: formData.eanUpc,
        expectedLife: formData.expectedLife,
        expectedTrips: formData.expectedTrips,
        height: parseFloat(formData.height),
        hsnCode: formData.hsnCode,
        length: parseFloat(formData.length),
        maintanencePeriod: formData.maintenancePeriod,
        manufacturePartCode: formData.manufacturePartCode,
        manufacturer: null,
        materialIdentification: formData.materialIdentification,
        orgId: parseFloat(orgId),
        poDate: null,
        poNo: null,
        quantity: 0,
        scrapValue: formData.scrapValue,
        sellPrice: formData.sellPrice,
        skuFrom: 0,
        skuTo: 0,
        taxRate: formData.taxRate,
        weight: parseFloat(formData.grossWeight),
      };

      console.log('Data to save is:', formDataToSend);

      try {
        const result = await apiCalls('put', `/kitController/updateCreateAsset`, formDataToSend);
        console.log('API Response:', result); // Log the complete result object

        if (result.status === true) {
          console.log('Response:', result.data);
          showToast('success', editId ? 'Asset Updated Successfully' : 'Asset created successfully');
          handleClear();
          getAllAsset();
        } else if (result.status === false) {
          // Check for error message within result object
          console.log('Error Response:', result);
          showToast('error', result.paramObjectsMap?.errorMessage || 'Asset creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      showToast('error', 'Please fill in all required fields');
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            {showForm ? <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} /> : ''}

            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                title="Upload Files"
                uploadText="Upload file"
                downloadText="Sample File"
                onSubmit={handleSubmit}
                sampleFileDownload={ChargeCodeSample}
                handleFileUpload={handleFileUpload}
                apiUrl={`master/excelUploadForChargeCode`}
                screen="Charge Code"
                loginUser={loginUserName}
                orgId={orgId}
              ></CommonBulkUpload>
            )}
          </div>

          {showForm ? (
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.type}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    required
                    value={formData.type}
                    name="type"
                    onChange={handleInputChange}
                  >
                    {assetType.map((item) => (
                      <MenuItem key={item.id} value={item.assetType}>
                        {item.assetType}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.type && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.type}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.category}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Category"
                    required
                    value={formData.category}
                    name="category"
                    onChange={handleInputChange}
                  >
                    {assetCategory.map((item) => (
                      <MenuItem key={item.id} value={item.category}>
                        {item.category}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.category && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.category}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Category Code"
                  variant="outlined"
                  size="small"
                  name="categoryCode"
                  disabled
                  value={formData.categoryCode}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.categoryCode}
                  helperText={fieldErrors.categoryCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Asset Code"
                  variant="outlined"
                  size="small"
                  name="assetCode"
                  value={formData.assetCode}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.assetCode}
                  helperText={fieldErrors.assetCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Asset Description"
                  variant="outlined"
                  size="small"
                  name="assetDescripition"
                  value={formData.assetDescripition}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.assetDescripition}
                  helperText={fieldErrors.assetDescripition}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="active" checked={formData.active} onChange={handleInputChange} />}
                    label="Active"
                  />
                </FormGroup>
              </div>
              <div className="col-md-12 mb-1">
                <h6>Details</h6>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.belongsTo}>
                  <InputLabel id="demo-simple-select-label">Belongs To</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Belongs to"
                    value={formData.belongsTo}
                    name="belongsTo"
                    onChange={handleInputChange}
                  >
                    {customerDetails.map((item) => (
                      <MenuItem key={item.id} value={item.partyShortName}>
                        {item.partyShortName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.belongsTo && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.belongsTo}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.materialIdentification}>
                  <InputLabel id="materialIdentification" >
                    Material Identification
                  </InputLabel>
                  <Select
                    labelId="materialIdentification"
                    id="materialIdentification"
                    name="materialIdentification"
                    value={formData.materialIdentification}
                    label="Material Identification"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'Plastic'}>Plastic</MenuItem>
                    <MenuItem value={'Wooden'}>Wooden</MenuItem>
                    <MenuItem value={'Metal'}>Metal</MenuItem>
                    <MenuItem value={'Cardboard'}>Cardboard</MenuItem>
                  </Select>
                  {fieldErrors.materialIdentification && <FormHelperText>{fieldErrors.materialIdentification}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.design}>
                  <InputLabel id="design" >
                    Design
                  </InputLabel>
                  <Select
                    labelId="design"
                    id="design"
                    name="design"
                    value={formData.design}
                    label="design"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'Only Sleeves foldable'}>Only Sleeves foldable</MenuItem>
                    <MenuItem value={'With Pallet and foldable'}>With Pallet and foldable</MenuItem>
                  </Select>
                  {fieldErrors.design && <FormHelperText>{fieldErrors.design}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Manufacture part Code"
                  variant="outlined"
                  size="small"
                  name="manufacturePartCode"
                  value={formData.manufacturePartCode}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.manufacturePartCode}
                  helperText={fieldErrors.manufacturePartCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="EAN/UPC"
                  variant="outlined"
                  size="small"
                  name="eanUpc"
                  type='number'
                  value={formData.eanUpc}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.eanUpc}
                  helperText={fieldErrors.eanUpc}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Gross Weight (kg)"
                  variant="outlined"
                  size="small"
                  name="grossWeight"
                  type='number'
                  value={formData.grossWeight}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.grossWeight}
                  helperText={fieldErrors.grossWeight}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Chargeable Weight (kg)"
                  variant="outlined"
                  size="small"
                  name="chargeableWeight"
                  type='number'
                  value={formData.chargeableWeight}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.chargeableWeight}
                  helperText={fieldErrors.chargeableWeight}
                />
              </div>
              <div className="col-md-12 mb-1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Size Identification</span>

                <div className="col-md-1 mb-1" style={{ width: '60px', marginRight: '5px' }}>
                  <TextField
                    label="L"
                    variant="outlined"
                    size="small"
                    name="length"
                    type="number"
                    value={formData.length}
                    onChange={handleInputChange}
                    InputProps={{
                      sx: {
                        height: '40px',
                        fontSize: '12px',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                </div>

                <div className="col-md-1 mb-1" style={{ width: '35px', marginRight: '5px' }}>
                  <TextField
                    label="X"
                    variant="outlined"
                    size="small"
                    disabled
                    onChange={handleInputChange}
                    InputProps={{
                      sx: {
                        height: '40px', // Adjust as needed
                        fontSize: '12px', // Optional: smaller text
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '12px' } // Smaller label text
                    }}
                  />
                </div>
                <div className="col-md-1 mb-1" style={{ width: '60px', marginRight: '5px' }}>
                  <TextField
                    label="B"
                    variant="outlined"
                    size="small"
                    name="breath"
                    type="number"
                    value={formData.breath}
                    onChange={handleInputChange}
                    error={!!fieldErrors.breath}
                    helperText={fieldErrors.breath}
                    InputProps={{
                      sx: {
                        height: '40px',
                        fontSize: '12px',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                </div>

                <div className="col-md-1 mb-1" style={{ width: '35px', marginRight: '5px' }}>
                  <TextField
                    label="X"
                    variant="outlined"
                    size="small"
                    disabled
                    onChange={handleInputChange}
                    InputProps={{
                      sx: {
                        height: '38px',
                        fontSize: '12px',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                </div>
                <div className="col-md-1 mb-1" style={{ width: '60px', marginRight: '5px' }}>
                  <TextField
                    label="H"
                    variant="outlined"
                    size="small"
                    name="height"
                    type='number'
                    value={formData.height}
                    onChange={handleInputChange}
                    error={!!fieldErrors.height}
                    helperText={fieldErrors.height}
                    InputProps={{
                      sx: {
                        height: '38px',
                        fontSize: '12px',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                </div>
              </div>

              <div className="col-md-12 mb-1">
                <h6>Information</h6>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Expected Life (Days)"
                  variant="outlined"
                  size="small"
                  name="expectedLife"
                  type='number'
                  value={formData.expectedLife}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.expectedLife}
                  helperText={fieldErrors.expectedLife}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Maintenance Period (Days)"
                  variant="outlined"
                  size="small"
                  name="maintenancePeriod"
                  type='number'
                  value={formData.maintenancePeriod}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.maintenancePeriod}
                  helperText={fieldErrors.maintenancePeriod}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Expected Trips"
                  variant="outlined"
                  size="small"
                  name="expectedTrips"
                  type='number'
                  value={formData.expectedTrips}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.expectedTrips}
                  helperText={fieldErrors.expectedTrips}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.hsnCode}>
                  <InputLabel id="demo-simple-select-label">HSN Code</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="HSN Code"
                    required
                    value={formData.hsnCode}
                    name="hsnCode"
                    onChange={handleInputChange}
                  >
                    {allHsnSacCode.map((item) => (
                      <MenuItem key={item.id} value={item.code}>
                        {item.code}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.hsnCode && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.hsnCode}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Tax Rate"
                  variant="outlined"
                  size="small"
                  name="taxRate"
                  type='number'
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.taxRate}
                  helperText={fieldErrors.taxRate}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Cost Price"
                  variant="outlined"
                  size="small"
                  name="costPrice"
                  type='number'
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.costPrice}
                  helperText={fieldErrors.costPrice}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Sell Price"
                  variant="outlined"
                  size="small"
                  name="sellPrice"
                  type='number'
                  value={formData.sellPrice}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.sellPrice}
                  helperText={fieldErrors.sellPrice}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Scrap Value"
                  variant="outlined"
                  size="small"
                  name="scrapValue"
                  type='number'
                  value={formData.scrapValue}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.scrapValue}
                  helperText={fieldErrors.scrapValue}
                />
              </div>
            </div>
          ) : (
            <CommonListViewTable data={assetDetais} columns={columns} blockEdit={true} toEdit={getAssetById} />
          )}
        </div>
      </div>
    </>
  );
};
export default CreateAsset;
