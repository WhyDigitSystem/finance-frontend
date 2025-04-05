import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';
import { Avatar, Typography, Dialog, DialogContent } from '@mui/material';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import IconButton from '@mui/material/IconButton';

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

  // image
  const [logo, setLogo] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setLogo(file);
    } else {
      showToast('error', 'Please upload a valid image (PNG or JPEG).');
    }
  };

  const handleFileUpload = async (generatedId) => {
    if (!generatedId) {
      console.warn('Generated ID is missing');
      showToast('error', 'Generated ID is required');
      return;
    }
    const formData = new FormData();
    formData.append('file', logo);
    try {
      const response = await apiCalls(
        'post',
        `/commonmaster/uploadImageProductServivceInBloob?id=${generatedId}`,
        formData,
        {},
        { 'Content-Type': 'multipart/form-data' }
      );
      console.log('Img Upload Response:', response);

      if (response.status === true) {
        showToast('success', response.message || 'Image Uploaded successfully!');
      } else {
        console.warn('Img upload failed:', response);
        showToast('error', 'Img upload failed');
      }
    } catch (error) {
      console.error('Img Upload Error:', error);
      showToast('error', 'Failed to upload Img');
    }
  };
  useEffect(() => {
    return () => {
      if (logo && typeof logo === 'object') {
        URL.revokeObjectURL(logo);
      }
    };
  }, [logo]);
  const handleRemoveLogo = () => setLogo(null);

  //
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
      const result = await apiCalls('get', `/commonmaster/getProductServiceByOrgId?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setListViewData(result.paramObjectsMap?.productServiceVO?.reverse() || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllProductServiceCodeId = async (row) => {
    setEditId(row.original.id);
    setFieldErrors({});
    try {
      const result = await apiCalls('get', `/commonmaster/getProductServiceById?id=${row.original.id}`);
      console.log('Edit API Response:', result);

      if (result.status === true) {
        setListView(false);
        const product = result.paramObjectsMap.productServiceVO;
        setLogo(result.paramObjectsMap.productServiceVO.image);

        setFormData({
          type: product.type || '',
          code: product.code || '',
          name: product.name || '',
          description: product.description || '',
          dimension: product.dimension || '',
          active: product.active === 'Active' ? true : false,
          orgId: product.orgId
        });
      } else {
        console.warn('Error fetching product details:', result.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    const codeRegex = /^[A-Za-z0-9_-]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    // const descriptionRegex = /^[A-Za-z0-9.,!-]*$/;
    const descriptionRegex = /^[A-Za-z0-9.,!\s-]*$/;
    // const dimensionRegex = /^[0-9xX.]*$/;

    let newErrors = { ...fieldErrors };

    if (name === 'type') {
      newErrors.type = '';
    }

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
    //   else if (inputValue.length > 20) newErrors.grt = 'Max length 20 characters.';
    //   else newErrors.dimension = '';
    // }
    setFieldErrors(newErrors);

    if (!newErrors[name]) {
      setFormData({ ...formData, [name]: inputValue });
    }
  };

  // const handleCheckboxChange = (event) => {
  //   // setFormData({ ...formData, active: event.target.checked });
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     active: event.target.checked
  //   }));
  // };

  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      active: event.target.checked
    }));
    console.log('Active Field Updated:', event.target.checked);
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
    setLogo(null);
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
      active: formData.active === true ? true : false,
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
      // const result = await apiCalls('put', 'api/commonmaster/createUpdateProductService', formDataToSend);
      const result = await apiCalls('put', '/commonmaster/createUpdateProductService', formDataToSend);

      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        const generatedId = result.paramObjectsMap.productServiceVO.id;
        if (generatedId && typeof logo === 'object') {
          console.log('Generated ID:', generatedId);
          console.log('Uploaded Item', logo);
          handleFileUpload(generatedId);
        } else {
          console.log('handle Img Upload failed');
        }
        getAllProductServiceCode();
        handleClear();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'creation failed');
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
          <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            {/* <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllProductServiceCodeId} /> */}
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllProductServiceCodeId} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                  <InputLabel htmlFor="type" required>
                    Type
                  </InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    label="Type"
                    onChange={handleInputChange}
                  >
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

              {/* <div className="col-md-2 mb-3">
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
                </div> */}

              {/* image upload */}
              <div className="col-md-3 mb-3">
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    multiline
                    startIcon={<CloudUploadIcon />}
                    sx={{ color: 'rgb(103 58 183)', borderRadius: '12px' }}
                  >
                    {logo ? (typeof logo === 'object' && logo.name ? logo.name : 'Image') : 'Upload Image'}

                    <input type="file" hidden accept="image/png, image/jpeg" onChange={handleLogoChange} />
                  </Button>

                  {logo && (
                    <IconButton variant="contained" sx={{ whiteSpace: 'nowrap', color: 'rgb(103 58 183)' }} onClick={handleOpen}>
                      <ControlCameraIcon />
                    </IconButton>
                  )}
                </Box>
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                  <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" sx={{ whiteSpace: 'nowrap', color: 'rgb(103 58 183)' }}>
                      Product Image
                    </Typography>
                    {logo ? (
                      <Box>
                        <Avatar
                          src={typeof logo === 'object' ? URL.createObjectURL(logo) : `data:image/jpeg;base64,${logo}`}
                          alt="Product Image"
                          sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', borderRadius: 2 }}
                        />
                        <Box display="flex" gap={2} mt={2}>
                          <IconButton
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap', color: 'rgb(103 58 183)', fontSize: '13px' }}
                            onClick={handleRemoveLogo}
                          >
                            Delete
                          </IconButton>
                          <IconButton
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap', color: 'rgb(103 58 183)', fontSize: '13px' }}
                            onClick={handleClose}
                          >
                            Close
                          </IconButton>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Avatar sx={{ width: 150, height: 150, bgcolor: '#F0F0F0', borderRadius: 2 }}>
                          <Typography variant="caption">Upload Image</Typography>
                        </Avatar>
                        <Box display="flex" gap={2} mt={2}>
                          <IconButton
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap', color: 'rgb(103 58 183)', fontSize: '15px' }}
                            onClick={handleClose}
                          >
                            Close
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/*image upload  */}

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
