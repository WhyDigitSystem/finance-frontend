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
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from 'views/basicMaster/CommonTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

export const ChargeTypeRequest = () => {
  const [formData, setFormData] = useState({
    chapter: '',
    subChapter: '',
    hsnCode: '',
    branch: '',
    newRate: '',
    excepmted: '',
    orgId: localStorage.getItem('orgId')
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
  const [data, setData] = useState([]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  // useEffect(() => {
  //   getSetTaxRate();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'newRate') {
      parsedValue = value !== '' ? parseInt(value, 10) : '';
      if (isNaN(parsedValue)) {
        parsedValue = '';
      }
    }

    setFormData({ ...formData, [name]: parsedValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getSetTaxRate = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllSetTaxRateByOrgId?orgId=${formData.orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.setTaxRateVO);

        console.log('Test', response.data.paramObjectsMap.setTaxRateVO);
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

    getSetTaxRate();
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

  const columns = [
    { accessorKey: 'chapter', header: 'Chapter', size: 140 },
    { accessorKey: 'subChapter', header: 'Sub Chapter', size: 140 },
    { accessorKey: 'hsnCode', header: 'HSN Code', size: 140 },
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'newRate', header: 'NewRAte', size: 140 },
    { accessorKey: 'excepmted', header: 'Excepmted', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

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
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Charge Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Charge Type"
                    required
                    // value={formData.excepmted}
                    name="chargeType"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="active" checked={formData.active} onChange={handleInputChange} />}
                    label="Active"
                  />
                </FormGroup>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Charge Code"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="chargeCode"
                  //   fullWidth
                  //   required
                  //   value={formData.subChapter}
                  //   onChange={handleInputChange}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.subChapter ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Product</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Product"
                    required
                    // value={formData.excepmted}
                    name="product"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Charge Description"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="chargeDescription"
                  //   value={formData.chapter}
                  //   onChange={handleInputChange}
                  //   fullWidth
                  //   // error={fieldErrors.chapter}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.chapter ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Local Charge Description"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="localChargeDescription"
                  //   value={formData.chapter}
                  //   onChange={handleInputChange}
                  //   fullWidth
                  //   // error={fieldErrors.chapter}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.chapter ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Service Account Code</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Service Account Code"
                    required
                    // value={formData.excepmted}
                    name="serviceAccountCode"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="SAC Description"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  name="sACDescription"
                  //   value={formData.hsnCode}
                  //   onChange={handleInputChange}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.hsnCode ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Sales A/c</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Sales A/c"
                    required
                    // value={formData.excepmted}
                    name="salesA/c"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Purchase A/c</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Purchase A/c"
                    required
                    // value={formData.excepmted}
                    name="purchaseA/c"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Taxable</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Taxable"
                    required
                    // value={formData.excepmted}
                    name="taxable"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Tax Type"
                    required
                    // value={formData.excepmted}
                    name="taxType"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">CC Fee Applicable</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="CC Fee Applicable"
                    required
                    // value={formData.excepmted}
                    name="cCFeeApplicable"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="taxable100%"
                  label="Taxable %"
                  placeholder="Placeholder"
                  //   value={formData.branch}
                  //   onChange={handleInputChange}
                  required
                  variant="outlined"
                  name="taxable100%"
                  size="small"
                  fullWidth
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.branch ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">CC Job?</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="CC Job?"
                    required
                    // value={formData.excepmted}
                    name="cCJob?"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Govt. SAC"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="govtSAC"
                  //   value={formData.newRate}
                  //   onChange={handleInputChange}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.newRate ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Exempted</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Exempted"
                    required
                    // value={formData.excepmted}
                    name="exempted"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="GST Tax"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  name="gSTTax"
                  //   value={formData.newRate}
                  //   onChange={handleInputChange}
                  //   helperText={<span style={{ color: 'red' }}>{fieldErrors.newRate ? 'This field is required' : ''}</span>}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">GST Control</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="GST Control"
                    required
                    // value={formData.excepmted}
                    name="gSTControl"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Service</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Service"
                    required
                    // value={formData.excepmted}
                    name="service"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Type (TI/ BOS)</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type (TI/ BOS)"
                    required
                    // value={formData.excepmted}
                    name="typeBos"
                    // onChange={handleInputChange}
                  >
                    <MenuItem value="0">Yes</MenuItem>
                    <MenuItem value="1">No</MenuItem>
                  </Select>
                  {/* {fieldErrors.excepmted && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>} */}
                </FormControl>
              </div>
            </div>
          ) : (
            <CommonTable data={data} columns={columns} onRowEditTable={handleRowEdit} />
          )}
        </div>
      </div>
    </>
  );
};
export default ChargeTypeRequest;
