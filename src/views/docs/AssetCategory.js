import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete } from '@mui/material';
import ToastComponent, { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { Button } from '@mui/material';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SampleFile from '../../assets/sample-files/AssetCategory.xlsx';
import AddIcon from '@mui/icons-material/Add';

const AssetCategory = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [showForm, setShowForm] = useState(true);
  const [allTypes, setAllTypes] = useState([]);
  const [editId, setEditId] = useState('');
  const [data, setData] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    categoryCode: '',
    type: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    category: '',
    categoryCode: '',
    type: ''
  });
  const handleView = () => {
    setShowForm(!showForm);
  };
  const handleClear = () => {
    setFormData({
      category: '',
      categoryCode: '',
      type: '',
      active: true
    });
    setFieldErrors({
      category: '',
      categoryCode: '',
      type: ''
    });
    setEditId('');
  };
  useEffect(() => {
    getAllAssetCategoryByOrgId();
    getAllTypes();
  }, []);
  const listViewColumns = [
    { accessorKey: 'assetType', header: 'Type', size: 140 },
    { accessorKey: 'category', header: 'Category', size: 140 },
    { accessorKey: 'categoryCode', header: 'Category Code', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
    if (name === 'category' && !/^[A-Za-z ]*$/.test(value)) {
      errorMessage = 'Only Alphabets Allowed';
    }
    if (name === 'categoryCode' && !/^[A-Za-z0-9]*$/.test(value)) {
      errorMessage = 'Only Alphanumeric Characters Allowed';
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };
  const getAllTypes = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetTypeByOrgId?orgid=${orgId}`);
      const allTypes = result.paramObjectsMap.assetTypeVO || [];
      const activeTypes = allTypes.filter((type) => type.active === 'Active');
      setAllTypes(activeTypes);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllAssetCategoryByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetCategoryByOrgId?orgid=${orgId}`);
      setData(result.paramObjectsMap.assetCategoryVO.reverse() || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAssetCategoryById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/kitController/getAssetCategoryById?id=${row.original.id}`);

      if (result) {
        const assetTypeVO = result.paramObjectsMap.assetCategoryVO;
        setEditId(row.original.id);
        setFormData({
          // branch: assetTypeVO.branch,
          // branchCode:assetTypeVO. branchCode,
          createdBy: assetTypeVO.loginUserName,
          updatedBy: assetTypeVO.loginUserName,
          orgId: assetTypeVO.orgId,
          type: assetTypeVO.assetType,
          active: assetTypeVO.active === 'Active' ? true : false,
          category: assetTypeVO.category,
          categoryCode: assetTypeVO.categoryCode
        });
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.categoryCode) {
      errors.categoryCode = 'Category Code is required';
    }
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        // branchCode: branchCode,
        active: true,
        createdBy: loginUserName,
        updatedBy: loginUserName,
        orgId: orgId,
        assetType: formData.type,
        category: formData.category,
        categoryCode: formData.categoryCode,
        active: formData.active
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/kitController/updateCreateAssetCategory`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Asset Type Updated Successfully' : 'Asset Type Created successfully');
          getAllAssetCategoryByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Asset Type creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Asset Type creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      active: event.target.checked
    }));
  };
  //
  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };
  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };
  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };
  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };
  const handleNew = () => {
    handleClear();
    setShowForm(!showForm);
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {showForm ? <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} /> : ''}
            {showForm ? <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} /> : ''}
            {showForm ? <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} /> : ''}
            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                title="Upload Files"
                uploadText="Upload file"
                downloadText="Sample File"
                onSubmit={handleSubmit}
                sampleFileDownload={SampleFile}
                handleFileUpload={handleFileUpload}
                apiUrl={`/kitController/ExcelUploadForAssetCategory?createdBy=${loginUserName}&orgId=${orgId}`}
                screen="As"
                loginUser={loginUserName}
                orgId={orgId}
              ></CommonBulkUpload>
            )}
            {!showForm ? (
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

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    options={allTypes}
                    value={formData.type ? allTypes.find((c) => c.assetType === formData.type) : null}
                    getOptionLabel={(option) => option.assetType || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: '100%' }}
                    size="small"
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'type',
                          value: newValue ? newValue.assetType : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="type"
                        label="Type"
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="category"
                    label="Category"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="category"
                    inputProps={{ maxLength: 30 }}
                    value={formData.category}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.category ? fieldErrors.category : ''}</span>}
                    error={!!fieldErrors.category}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="categoryCode"
                    label="Category Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="categoryCode"
                    inputProps={{ maxLength: 10 }}
                    value={formData.categoryCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.categoryCode ? fieldErrors.categoryCode : ''}</span>}
                    error={!!fieldErrors.categoryCode}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                    label="Active"
                    labelPlacement="end"
                  />
                </div>
              </div>
            </>
          ) : (
            <CommonListViewTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAssetCategoryById} />
          )}
        </div>
      </div>
    </>
  );
};

export default AssetCategory;
