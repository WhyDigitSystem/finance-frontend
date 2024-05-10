import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SetTaxRateTable from './SetTaxRateTable';

export const SetTaxRate = () => {
  const [formData, setFormData] = useState({
    chapter: '',
    subChapter: '',
    hsnCode: '',
    branch: '',
    newRate: '',
    excepmted: '',
    orgId: 1
  });

  const [fieldErrors, setFieldErrors] = useState({
    chapter: false,
    subChapter: false,
    hsnCode: false,
    branch: false,
    newRate: false,
    excepmted: false
  });

  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);

  const theme = useTheme();
  const anchorRef = useRef(null);

  useEffect(() => {
    getSetTaxRate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'newRate' && value !== '' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getSetTaxRate = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllSetTaxRate`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.setTaxRateVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = () => {
    // Check if any field is empty
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
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateSetTaxRate`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Set Tax Rate Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleRowEdit = (rowId, newData) => {
    console.log('Edit', rowId, newData);
    // Send PUT request to update the row
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateSetTaxRate/${rowId}`, newData)
      .then((response) => {
        console.log('Edit successful:', response.data);
        // Handle any further actions after successful edit
        toast.success('Set Tax Rate Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error editing row:', error);
        // Handle error scenarios
        toast.error('Failed to Update Set Tax Rate', {
          autoClose: 2000,
          theme: 'colored'
        });
      });
  };

  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({
      chapter: false,
      subChapter: false,
      hsnCode: false,
      branch: false,
      newRate: false,
      excepmted: false
    });
  };
  const handleClear = () => {
    setFormData({
      chapter: '',
      subChapter: '',
      hsnCode: '',
      branch: '',
      newRate: '',
      excepmted: ''
    });
    setFieldErrors({
      chapter: false,
      subChapter: false,
      hsnCode: false,
      branch: false,
      newRate: false,
      excepmted: false
    });
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <Tooltip title="Search" placement="top">
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SearchIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }} onClick={handleClear}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <ClearIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="List View" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleList}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Save" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }} onClick={handleSave}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SaveIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>

          {showForm ? (
            <div className="row d-flex ml">
              <div className="col-md-4 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Chapter"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  fullWidth
                  // error={fieldErrors.chapter}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.chapter ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Sub Chapter"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="subChapter"
                  fullWidth
                  required
                  value={formData.subChapter}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.subChapter ? 'This field is required' : ''}</span>}
                />
              </div>

              <div className="col-md-4 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="HSN Code"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.hsnCode ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="Old Rate"
                  label="Branch/Location"
                  placeholder="Placeholder"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  name="branch"
                  size="small"
                  fullWidth
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.branch ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="New Rate"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="newRate"
                  value={formData.newRate}
                  onChange={handleInputChange}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.newRate ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Excepmted</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Excepmted"
                    required
                    value={formData.excepmted}
                    name="excepmted"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
            </div>
          ) : (
            <SetTaxRateTable data={data} onRowEditTable={handleRowEdit} />
          )}
        </div>
      </div>
    </>
  );
};
export default SetTaxRate;
