import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';

const HsnSacCode = () => {
  const [formData, setFormData] = useState({
    active: true,
    serviceAccountCode: '',
    sacDescription: '',
    product: '',
    orgId: localStorage.getItem('orgId')
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: false }); // Clear error for the field
  };

  const handleCheckboxChange = (event) => {
    setFormData({ ...formData, active: event.target.checked });
  };

  useEffect(() => {
    getAllHsnSacCode();
  }, []);

  const validateForm = () => {
    const errors = {};

    // Check if required fields are filled
    const requiredFields = ['serviceAccountCode', 'sacDescription', 'product'];
    requiredFields.forEach((field) => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        errors[field] = 'This field is required';
      }
    });

    // Validate rate to be a number
    // if (isNaN(formData.rate) || formData.rate <= 0) {
    //   errors.rate = 'Rate must be a positive number';
    // }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the errors in the form.', {
        autoClose: 2000,
        theme: 'colored'
      });
      return;
    }

    const formDataWithIntegerRate = {
      ...formData,
      rate: parseInt(formData.rate, 10) // Ensure this converts to integer
    };
    try {
      const response = await apiCalls('put', '/master/updateCreateSacCode', formDataWithIntegerRate);
      toast.success(editMode ? 'SAC code Updated Successfully ' : 'SAC code Created Successfully', {
        autoClose: 2000,
        theme: 'colored'
      });
      getAllHsnSacCode();
      handleClear();
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Error occurred while saving HSN code', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  const handleClear = () => {
    setFormData({
      active: true,
      serviceAccountCode: '',
      sacDescription: '',
      product: '',
      orgId: localStorage.getItem('orgId')
    });
    setFieldErrors({});
  };

  const handleList = () => {
    setShowForm(!showForm);
  };

  const getAllHsnSacCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllSacCodeByOrgId?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.sacCodeVO);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    { accessorKey: 'serviceAccountCode', header: 'Service Account Code', size: 140 },
    { accessorKey: 'sacDescription', header: 'SAC Description', size: 140 },
    { accessorKey: 'product', header: 'product', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const getAllUserById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getAllSacCodeById?id=${row.original.id}`);
      if (result) {
        const hsnSocCodeVO = result.paramObjectsMap.sacCodeVO[0];
        setEditMode(true);
        setFormData({
          active: hsnSocCodeVO.active || false,
          serviceAccountCode: hsnSocCodeVO.serviceAccountCode || '',
          sacDescription: hsnSocCodeVO.sacDescription || '',
          product: hsnSocCodeVO.product || '',
          id: hsnSocCodeVO.id || 0,
          orgId: orgId
        });
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

        {showForm ? (
          <div className="row d-flex align-items-center">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="serviceAccountCode"
                  name="serviceAccountCode"
                  label="Service Account Code"
                  size="small"
                  required
                  value={formData.serviceAccountCode}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.serviceAccountCode && <span style={{ color: 'red' }}>{fieldErrors.serviceAccountCode}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="sacDescription"
                  name="sacDescription"
                  label="SAC Description"
                  size="small"
                  required
                  value={formData.sacDescription}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.sacDescription && <span style={{ color: 'red' }}>{fieldErrors.sacDescription}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="product"
                  name="product"
                  label="Product"
                  size="small"
                  required
                  value={formData.product}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.product && <span style={{ color: 'red' }}>{fieldErrors.product}</span>}
              </FormControl>
            </div>
            <div className="col-md-4 mb-2">
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />} label="Active" />
              </FormGroup>
            </div>
          </div>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getAllUserById} />
        )}
      </div>
    </div>
  );
};

export default HsnSacCode;
