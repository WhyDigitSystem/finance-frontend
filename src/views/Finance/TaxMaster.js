import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TaxMaster = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [formData, setFormData] = useState({
    taxType: '',
    taxPercentage: '',
    taxDescription: '',
    active: true,
    taxMaster2DTO: [
      {
        inputAccount: '',
        outputAccount: '',
        sgstRcmPayable: '',
        taxMaster2Id: 0
      }
    ],
    taxMasterId: 0,
    orgId: 0
  });

  const [fieldErrors, setFieldErrors] = useState({
    taxType: false,
    taxPercentage: false,
    taxDescription: false,
    inputAccount: false,
    outputAccount: false,
    sgstRcmPayable: false
  });

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const newValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: newValue });

  //   // Only clear the error if the field is not empty
  //   if (value.trim() !== '') {
  //     setFieldErrors({ ...fieldErrors, [name]: false });
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const newValue = type === 'checkbox' ? checked : value;

  //   // Check if the input belongs to fields within the TabPanel
  //   if (name.startsWith('taxMaster2DTO')) {
  //     const field = name.split('.').pop(); // Get the field name
  //     const updatedTaxMaster2DTO = { ...formData.taxMaster2DTO[0], [field]: newValue };
  //     const updatedFormData = { ...formData, taxMaster2DTO: [updatedTaxMaster2DTO] };
  //     setFormData(updatedFormData);

  //     // Only clear the error if the field is not empty
  //     if (value.trim() !== '') {
  //       setFieldErrors({ ...fieldErrors, [name]: false });
  //     }
  //   } else {
  //     // For fields outside the TabPanel
  //     setFormData({ ...formData, [name]: newValue });

  //     // Only clear the error if the field is not empty
  //     if (value.trim() !== '') {
  //       setFieldErrors({ ...fieldErrors, [name]: false });
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name.startsWith('taxMaster2DTO')) {
      const field = name.split('.').pop();
      const updatedTaxMaster2DTO = { ...formData.taxMaster2DTO[0], [field]: newValue };
      const updatedFormData = { ...formData, taxMaster2DTO: [updatedTaxMaster2DTO] };
      setFormData(updatedFormData);

      if (value.trim() !== '') {
        setFieldErrors({ ...fieldErrors, [name]: false });
      } else {
        setFieldErrors({ ...fieldErrors, [name]: true });
      }
    } else {
      setFormData({ ...formData, [name]: newValue });

      if (value.trim() !== '') {
        setFieldErrors({ ...fieldErrors, [name]: false });
      } else {
        setFieldErrors({ ...fieldErrors, [name]: true });
      }
    }
  };

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const theme = useTheme();
  const anchorRef = useRef(null);

  const handleSave = () => {
    const errors = Object.keys(formData).reduce((acc, key) => {
      if (!formData[key]) {
        acc[key] = true;
      }
      return acc;
    }, {});

    if (!formData.taxMaster2DTO[0].inputAccount.trim()) {
      errors.inputAccount = true;
    }
    if (!formData.taxMaster2DTO[0].outputAccount.trim()) {
      errors.outputAccount = true;
    }
    if (!formData.taxMaster2DTO[0].sgstRcmPayable.trim()) {
      errors.sgstRcmPayable = true;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    console.log('formData', formData);

    axios
      .PUT(`${process.env.REACT_APP_API_URL}/api/master/updateCreateTaxMaster`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        setFormData({
          taxType: '',
          taxPercentage: '',
          taxDescription: '',
          active: true,
          taxMaster2DTO: {
            inputAccount: '',
            outputAccount: '',
            sgstRcmPayable: '',
            taxMaster2Id: 0
          },
          taxMasterId: 0,
          orgId: 0
        });
        toast.success('Data Saved Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClear = () => {
    setFormData({
      taxType: '',
      taxPercentage: '',
      taxDescription: '',
      active: true,
      taxMaster2DTO: [
        {
          inputAccount: '',
          outputAccount: '',
          sgstRcmPayable: ''
        }
      ]
    });

    // Also clear fieldErrors state
    setFieldErrors({
      taxType: false,
      taxPercentage: false,
      taxDescription: false,
      inputAccount: false,
      outputAccount: false,
      sgstRcmPayable: false
    });
  };

  return (
    <>
      <ToastContainer />

      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
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

          <Tooltip title="Clear" placement="top" onClick={handleClear}>
            {' '}
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
                <ClearIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </Tooltip>

          <Tooltip title="List View" placement="top">
            {' '}
            <ButtonBase sx={{ borderRadius: '12px' }}>
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
        <div className="row d-flex mt-3">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="taxType-label">Tax Type</InputLabel>
              <Select
                labelId="taxType-label"
                id="taxType"
                name="taxType"
                value={formData.taxType}
                onChange={handleInputChange}
                label="Tax Type"
                error={fieldErrors.taxType}
              >
                <MenuItem value="SGST">SGST</MenuItem>
                <MenuItem value="Option1">Option1</MenuItem>
              </Select>
              {fieldErrors.taxType && <FormHelperText error={true}>This field is required</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <TextField
              id="taxPercentage"
              label="Tax Percentage"
              variant="outlined"
              size="small"
              name="taxPercentage"
              value={formData.taxPercentage}
              onChange={handleInputChange}
              fullWidth
              error={fieldErrors.taxPercentage}
              helperText={fieldErrors.taxPercentage && 'This field is required'}
            />{' '}
          </div>
          <div className="col-md-3 mb-3">
            <TextField
              id="taxDescription"
              label="Tax Description"
              variant="outlined"
              size="small"
              name="taxDescription"
              value={formData.taxDescription}
              onChange={handleInputChange}
              fullWidth
              error={fieldErrors.taxDescription}
              helperText={fieldErrors.taxDescription && 'This field is required'}
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
        </div>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab>SGST</Tab>
          </TabList>

          <TabPanel>
            <div>
              <div className="row d-flex mt-3">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="inputAccount"
                      label="Input Account"
                      variant="outlined"
                      size="small"
                      name="taxMaster2DTO.inputAccount"
                      value={formData.taxMaster2DTO[0].inputAccount}
                      onChange={handleInputChange}
                      fullWidth
                      error={fieldErrors.inputAccount}
                      helperText={fieldErrors.inputAccount && 'This field is required'}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="outputAccount"
                      label="Output Account"
                      variant="outlined"
                      size="small"
                      name="taxMaster2DTO.outputAccount"
                      value={formData.taxMaster2DTO[0].outputAccount}
                      onChange={handleInputChange}
                      fullWidth
                      error={fieldErrors.outputAccount}
                      helperText={fieldErrors.outputAccount && 'This field is required'}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="sgstRcmPayable"
                      label="SGST RCM Payable"
                      variant="outlined"
                      size="small"
                      name="taxMaster2DTO.sgstRcmPayable"
                      value={formData.taxMaster2DTO[0].sgstRcmPayable}
                      onChange={handleInputChange}
                      fullWidth
                      error={fieldErrors.sgstRcmPayable}
                      helperText={fieldErrors.sgstRcmPayable && 'This field is required'}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};
export default TaxMaster;
