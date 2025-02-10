import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CommonListViewTable from '../../views/basicMaster/CommonListViewTable';

const HsnSacCode = () => {

  const [formData, setFormData] = useState({
    active: true,
    type:'',
    code:'',
    description:'',
    taxType:'',
    igst:'',
    cgst:'',
    sgst:''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const columns = [
    { accessorKey: 'type', header: 'Type', size: 240 },
    { accessorKey: 'description', header: 'Description', size: 140 },
    { accessorKey: 'code', header: 'Code', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  useEffect(() => {
    getAllHsnSacCode();
  }, []);

  const getAllHsnSacCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllHSNSacCodeByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.hsnSacCodeVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllSacCodeById = async (row) => {
    setEditId(row.original.id);
    try {
      const result = await apiCalls('get', `/master/getAllHSNSacCodeById?id=${row.original.id}`);
      if (result.status === true) {
        const hsnSocCodeVO = result.paramObjectsMap.hsnSacCodeVO;
        setShowForm(true);
        setFormData({
          type: hsnSocCodeVO.type || '',
          code: hsnSocCodeVO.code || '',
          description: hsnSocCodeVO.description || '',
          taxType: hsnSocCodeVO.taxType || '',
          igst: hsnSocCodeVO.igst || '',
          cgst: hsnSocCodeVO.cgst || '',
          sgst: hsnSocCodeVO.sgst || '',
          active: hsnSocCodeVO.active || false,
          orgId: orgId
        });
      } else {
        console.error('API Error:', result.paramObjectsMap.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;
    if (name === 'code') {
      if (!/^\d*$/.test(inputValue)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Only numbers are allowed'
        }));
        return; // Prevent invalid input from being set
      } else if (inputValue.length > 6) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Maximum length is 6 digits'
        }));
        return;
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ''
        }));
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue
    }));
  };  

  const handleCheckboxChange = (event) => {
    setFormData({ ...formData, active: event.target.checked });
  };
  const handleClear = () => {
    setFormData({
      active: true,
      type:'',
      code:'',
      description:'',
      taxType:'',
      igst:'',
      cgst:'',
      sgst:''
    });
    setEditId('');
    setFieldErrors({});
  };
  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({});
  };
  const validateForm = () => {
    let errors = {};
    let hasError = false;

    if (!formData.type) {
      errors.type = 'Type is required';
      hasError = true;
    }
    if (!formData.description) {
      errors.description = 'Description is required';
      hasError = true;
    }
    if (!formData.code) {
      errors.code = 'Code is required';
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formDataToSend = {
        ...(editId && { id: editId }),
        active: formData.active === 'Active' ? true : false,
        type: formData.type,
        code: formData.code,
        description: formData.description,
        taxType: formData.taxType,
        igst: formData.igst ? parseInt(formData.igst) : 0,
        cgst: formData.cgst ? parseInt(formData.cgst) : 0,
        sgst: formData.sgst ? parseInt(formData.sgst) : 0,
        orgId: parseInt(orgId),
        createdBy: loginUserName
      };
      
      console.log('Saving HSN code with payload:', formDataToSend);
      try {
        const result = await apiCalls('put', '/master/updateCreateHSNSacCode', formDataToSend);
        if (result.status === true) {
          showToast('success', editId ? `${formData.type} Code Updated Successfully` : `${formData.type} Code created successfully`);
          getAllHsnSacCode();
          handleClear();
        } else {
          showToast('error', result.paramObjectsMap.errorMessage || `${formData.type} code creation failed`);
        }
      } catch (error) {
        console.error('API Error:', error);
        showToast('error', 'An error occurred while saving');
      }
    } else {
      showToast('error', 'Please fill in all required fields');
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
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Type
                  </InputLabel>
                  <Select
                    labelId="statusLabel"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    label={
                      <span>
                        Type <span className="asterisk">*</span>
                      </span>
                    }
                    required
                    error={!!fieldErrors.type}
                    helperText={fieldErrors.type}
                    // disabled={formData.type === 'TAX' || !editId}
                  >
                    <MenuItem value="HSN">HSN</MenuItem>
                    <MenuItem value="SAC">SAC</MenuItem>
                  </Select>
                </FormControl>
              </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="code"
                  name="code"
                  label={
                    <span>
                      Code <span className="asterisk">*</span>
                    </span>
                  }
                  size="small"
                  value={formData.code}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 50 }}
                  error={!!fieldErrors.code}
                  helperText={fieldErrors.code}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="description"
                  name="description"
                  label={
                    <span>
                      Description <span className="asterisk">*</span>
                    </span>
                  }
                  size="small"
                  value={formData.description}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                  error={!!fieldErrors.description}
                  helperText={fieldErrors.description}
                />
              </FormControl>
            </div>
            {formData.type === 'SAC' && (
              <>
            <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Tax Type
                  </InputLabel>
                  <Select
                    labelId="statusLabel"
                    value={formData.taxType}
                    onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                    label="Tax Type"
                    error={!!fieldErrors.taxType}
                    helperText={fieldErrors.taxType}
                    // disabled={formData.type === 'TAX' || !editId}
                  >
                    <MenuItem value="INTER">INTER</MenuItem>
                    <MenuItem value="INTRA">INTRA</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {formData.taxType === 'INTER' && (
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="igst"
                      name="igst"
                      label={
                        <span>
                          IGST
                        </span>
                      }
                      size="small"
                      value={formData.igst}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.igst}
                      helperText={fieldErrors.igst}
                    />
                  </FormControl>
                </div>
              )}
              {formData.taxType === 'INTRA' && (
                <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="sgst"
                      name="sgst"
                      label={
                        <span>
                          SGST
                        </span>
                      }
                      size="small"
                      value={formData.sgst}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.sgst}
                      helperText={fieldErrors.sgst}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="cgst"
                      name="cgst"
                      label={
                        <span>
                          CGST
                        </span>
                      }
                      size="small"
                      value={formData.cgst}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.cgst}
                      helperText={fieldErrors.cgst}
                    />
                  </FormControl>
                </div>
                </>
              )}
            </>
            )}
            <div className="col-md-4 mb-2">
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />} label="Active" />
              </FormGroup>
            </div>
          </div>
        ) : (
          <CommonListViewTable
              data={data}
              columns={columns}
              blockEdit={true}
              toEdit={getAllSacCodeById}
            />
          // <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getAllSacCodeById} />
        )}
      </div>
    </div>
  );
};

export default HsnSacCode;
