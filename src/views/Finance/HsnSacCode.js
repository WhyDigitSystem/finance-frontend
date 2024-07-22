import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
import CommonTable from 'views/basicMaster/CommonTable';

const HsnSacCode = () => {
  const [formData, setFormData] = useState({
    active: true,
    chapter: '',
    chapterCode: '',
    code: '',
    createdBy: '',
    description: '',
    excempted: true,
    orgId: localStorage.getItem('orgId'),
    rate: '',
    subChapter: '',
    subChapterCode: '',
    type: '',
    updatedBy: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

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
    const requiredFields = ['code', 'description', 'chapter', 'chapterCode', 'subChapter', 'subChapterCode', 'rate', 'type'];
    requiredFields.forEach((field) => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        errors[field] = 'This field is required';
      }
    });

    // Validate rate to be a number
    if (isNaN(formData.rate) || formData.rate <= 0) {
      errors.rate = 'Rate must be a positive number';
    }

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
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateHsnSacCode`, formDataWithIntegerRate);
      toast.success('HSN code Created Successfully', {
        autoClose: 2000,
        theme: 'colored'
      });
      getAllHsnSacCode();
      handleClear();
      console.log('API Response:', response.data);
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
      chapter: '',
      chapterCode: '',
      code: '',
      createdBy: '',
      description: '',
      excempted: true,
      orgId: localStorage.getItem('orgId'),
      rate: '',
      subChapter: '',
      subChapterCode: '',
      type: '',
      updatedBy: ''
    });
    setFieldErrors({});
  };

  const handleList = () => {
    setShowForm(!showForm);
  };

  const getAllHsnSacCode = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllHsnSacCodeByOrgId?orgId=${orgId}`);
      if (response.status === 200) {
        setData(response.data.paramObjectsMap.hsnSacCodeVO);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    { accessorKey: 'type', header: 'Type', size: 140 },
    { accessorKey: 'code', header: 'Code', size: 140 },
    { accessorKey: 'description', header: 'Description', size: 140 },
    { accessorKey: 'chapter', header: 'Chapter', size: 140 },
    { accessorKey: 'chapterCode', header: 'Chapter Code', size: 140 },
    { accessorKey: 'rate', header: 'Rate', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const getAllUserById = async (row) => {
    setShowForm(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllHsnSacCodeById?id=${row.original.id}`);
      if (response.status === 200) {
        const hsnSocCodeVO = response.data.paramObjectsMap.hsnSacCodeVO[0];
        setFormData({
          active: hsnSocCodeVO.active || false,
          chapter: hsnSocCodeVO.chapter || '',
          chapterCode: hsnSocCodeVO.chapterCode || '',
          code: hsnSocCodeVO.code || '',
          description: hsnSocCodeVO.description || '',
          excempted: hsnSocCodeVO.excempted || '',
          rate: hsnSocCodeVO.rate || '',
          id: hsnSocCodeVO.id || 0,
          subChapter: hsnSocCodeVO.subChapter || '',
          subChapterCode: hsnSocCodeVO.subChapterCode || '',
          type: hsnSocCodeVO.type || '',
          orgId: orgId
        });
      } else {
        console.error('API Error:', response.data);
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
              <FormControl fullWidth size="small">
                <InputLabel id="type-label">Type</InputLabel>
                <Select labelId="type-label" id="type" name="type" value={formData.type} onChange={handleInputChange} label="Type">
                  <MenuItem value="Type-1">Type-1</MenuItem>
                  <MenuItem value="Type-2">Type-2</MenuItem>
                  <MenuItem value="Type-3">Type-3</MenuItem>
                </Select>
                {fieldErrors.type && <span style={{ color: 'red' }}>{fieldErrors.type}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="code"
                  name="code"
                  label="Code"
                  size="small"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.code && <span style={{ color: 'red' }}>{fieldErrors.code}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  size="small"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.description && <span style={{ color: 'red' }}>{fieldErrors.description}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="chapter"
                  name="chapter"
                  label="Chapter"
                  size="small"
                  required
                  value={formData.chapter}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.chapter && <span style={{ color: 'red' }}>{fieldErrors.chapter}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="chapterCode"
                  name="chapterCode"
                  label="Chapter Code"
                  size="small"
                  required
                  value={formData.chapterCode}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.chapterCode && <span style={{ color: 'red' }}>{fieldErrors.chapterCode}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="subChapterCode"
                  name="subChapterCode"
                  label="Sub Chapter Code"
                  size="small"
                  required
                  value={formData.subChapterCode}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.subChapterCode && <span style={{ color: 'red' }}>{fieldErrors.subChapterCode}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="subChapter"
                  name="subChapter"
                  label="Sub Chapter"
                  size="small"
                  required
                  value={formData.subChapter}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.subChapter && <span style={{ color: 'red' }}>{fieldErrors.subChapter}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="rate"
                  name="rate"
                  label="Rate"
                  size="small"
                  required
                  value={formData.rate}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 30 }}
                />
                {fieldErrors.rate && <span style={{ color: 'red' }}>{fieldErrors.rate}</span>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="excempted-label">Exempted (Yes/No)</InputLabel>
                <Select
                  labelId="excempted-label"
                  id="excempted"
                  name="excempted"
                  value={formData.excempted ? 'true' : 'false'}
                  onChange={handleInputChange}
                  label="Exempted (Yes/No)"
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
                {fieldErrors.excempted && <span style={{ color: 'red' }}>{fieldErrors.excempted}</span>}
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
