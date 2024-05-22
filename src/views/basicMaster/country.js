import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from './CommonTable';

const Country = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [showFields, setShowFields] = useState(true);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    countryName: '',
    countryCode: '',
    orgId: orgId,
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    countryName: false,
    countryCode: false
  });

  const columns = [
    { accessorKey: 'countryName', header: 'Country', size: 140 },
    { accessorKey: 'countryCode', header: 'Code', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
  ];

  useEffect(() => {
    getCountry();
  }, [showFields]);

  const [imageSrc, setImageSrc] = useState('');

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     try {
  //       // Replace with your API endpoint or blob source
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/images/1`, { responseType: 'blob' });
  //       const blob = response.data;
  //       const imageUrl = URL.createObjectURL(blob);
  //       setImageSrc(imageUrl);
  //     } catch (error) {
  //       console.error('Error fetching the image:', error);
  //     }
  //   };

  //   fetchImage();

  //   // Clean up the URL object when the component is unmounted
  //   return () => {
  //     URL.revokeObjectURL(imageSrc);
  //   };
  // }, []);

  const handleClear = () => {
    setFormData({
      countryName: '',
      countryCode: '',
      active: true
    });

    setFieldErrors({
      countryName: false,
      countryCode: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    let newValue = value;

    // Transform value to uppercase
    newValue = newValue.toUpperCase();

    // Validate value to allow only alphabetic characters
    newValue = newValue.replace(/[^A-Z]/g, '');

    // Update the value of newValue instead of redeclaring it
    newValue = name === 'active' ? checked : newValue;

    setFormData({ ...formData, [name]: newValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleList = () => {
    setShowFields(!showFields);
  };

  const getCountry = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getCountryByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.countryVO || []);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = () => {
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
      .put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateCountry`, formData)
      .then((response) => {
        console.log('Response:', response.data);
        handleClear();
        toast.success('Country Created Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getCountry();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const editCountry = async (updatedCountry) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/basicMaster/updateCreateCountry`, updatedCountry);
      if (response.status === 200) {
        toast.success('Country Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getCountry();
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to Update Country', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error updating country:', error);
      toast.error('Error Updating Country', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
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

          <Tooltip title="List View" placement="top" onClick={handleList}>
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
            <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }} onClick={handleSubmit}>
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
        <div>
          {showFields ? (
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Country"
                    size="small"
                    required
                    name="countryName"
                    value={formData.countryName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.countryName ? 'This field is required' : ''}</span>}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="account"
                    label="Code"
                    size="small"
                    required
                    value={formData.countryCode}
                    name="countryCode"
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.countryCode ? 'This field is required' : ''}</span>}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.active}
                        onChange={handleInputChange}
                        name="active"
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Active"
                  />
                </FormGroup>
              </div>
              {/* <div>{imageSrc ? <img src={imageSrc} alt="Blob" /> : <p>Loading...</p>}</div> */}
            </div>
          ) : (
            <CommonTable data={Array.isArray(data) ? data : []} columns={columns} editCallback={editCountry} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Country;
