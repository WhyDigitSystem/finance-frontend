// import ClearIcon from '@mui/icons-material/Clear';
// import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
// import SaveIcon from '@mui/icons-material/Save';
// import SearchIcon from '@mui/icons-material/Search';
// import { InputLabel, MenuItem, Select } from '@mui/material';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import TextField from '@mui/material/TextField';
// import { useTheme } from '@mui/material/styles';
// import apiCalls from 'apicall';
// import { useEffect, useRef, useState } from 'react';
// import 'react-tabs/style/react-tabs.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ActionButton from 'utils/ActionButton';
// import { getCountryByOrgId, getStateByCountry } from 'utils/common-functions';
// import CommonTable from './CommonTable';

// const City = () => {
//   const theme = useTheme();
//   const anchorRef = useRef(null);
//   const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
//   const [data, setData] = useState([]);
//   const [showFields, setShowFields] = useState(true);
//   const [countryVO, setCountryVO] = useState([]);
//   const [stateVO, setStateVO] = useState([]);

//   const [formData, setFormData] = useState({
//     state: '',
//     cityName: '',
//     cityCode: '',
//     country: '',
//     active: true,
//     orgId: orgId
//   });

//   const [fieldErrors, setFieldErrors] = useState({
//     cityName: false,
//     state: false,
//     country: false,
//     cityCode: false
//   });

//   const handleClear = () => {
//     setFormData({
//       state: '',
//       cityName: '',
//       cityCode: '',
//       country: '',
//       active: true
//     });

//     setFieldErrors({
//       cityName: false,
//       state: false,
//       country: false,
//       cityCode: false
//     });
//   };

//   const columns = [
//     { accessorKey: 'cityName', header: 'City', size: 140 },
//     { accessorKey: 'cityCode', header: 'Code', size: 140 },
//     { accessorKey: 'state', header: 'State', size: 140 },
//     { accessorKey: 'country', header: 'Country', size: 140 },
//     { accessorKey: 'active', header: 'active', size: 140 }
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Replace with your orgId or fetch it from somewhere
//         const countryData = await getCountryByOrgId(orgId);
//         setCountryVO(countryData);
//       } catch (error) {
//         console.error('Error fetching country data:', error);
//       }
//     };
//     fetchData();
//     getCity();
//   }, []);

//   useEffect(() => {
//     const fetchDataState = async () => {
//       try {
//         // Replace with your orgId or fetch it from somewhere
//         const stateData = await getStateByCountry(orgId, formData.country);
//         setStateVO(stateData);
//       } catch (error) {
//         console.error('Error fetching country data:', error);
//       }
//     };
//     fetchDataState();
//   }, [formData.country]);

//   const handleInputChange = (e) => {
//     const { name, value, checked } = e.target;
//     let newValue = value;

//     // Transform value to uppercase
//     newValue = newValue.toUpperCase();

//     // Validate value to allow only alphabetic characters
//     newValue = newValue.replace(/[^A-Z]/g, '');

//     // Update the value of newValue instead of redeclaring it
//     newValue = name === 'active' ? checked : newValue;

//     setFormData({ ...formData, [name]: newValue });
//     setFieldErrors({ ...fieldErrors, [name]: false });
//   };

//   const handleList = () => {
//     setShowFields(!showFields);
//   };

//   const getCity = async () => {
//     try {
//       const result = await apiCalls('get', `/basicMaster/getCityByOrgId?orgId=${orgId}`);
//       console.log('API Response:', result);

//       if (result) {
//         setData(result.paramObjectsMap.cityVO);
//       } else {
//         // Handle error
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Check if any field is empty
//       const errors = Object.keys(formData).reduce((acc, key) => {
//         if (!formData[key]) {
//           acc[key] = true;
//         }
//         return acc;
//       }, {});

//       // If there are errors, set the corresponding fieldErrors state to true
//       if (Object.keys(errors).length > 0) {
//         setFieldErrors(errors);
//         return; // Prevent API call if there are errors
//       }

//       // Make the API call using the apiCalls method
//       const response = await apiCalls('put', 'basicMaster/updateCreateCity', formData);

//       // Handle successful response
//       console.log('Response:', response.data);
//       handleClear();
//       toast.success('City Created Successfully', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//       getCity();
//     } catch (error) {
//       // Error handling
//       toast.error(error.message, {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//     }
//   };

//   const editCity = async (updatedCity) => {
//     try {
//       const response = await apiCalls('put', `/basicMaster/updateCreateCity`, updatedCity);

//       if (response) {
//         toast.success('City Updated Successfully', {
//           autoClose: 2000,
//           theme: 'colored'
//         });
//         getCity();
//       } else {
//         toast.error('Failed to Update City', {
//           autoClose: 2000,
//           theme: 'colored'
//         });
//       }
//     } catch (error) {
//       console.error('Error updating city:', error);
//       toast.error('Error Updating City', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//     }
//   };

//   return (
//     <div>
//       <div>
//         <ToastContainer />
//       </div>
//       <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
//         <div className="d-flex flex-wrap justify-content-start mb-4">
//           <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
//           <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
//           <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
//           <ActionButton title="Save" icon={SaveIcon} onClick={handleSubmit} margin="0 10px 0 10px" />
//         </div>
//         {showFields ? (
//           <div className="row d-flex">
//             <div className="col-md-3 mb-3">
//               <FormControl fullWidth size="small">
//                 <InputLabel id="country">Country</InputLabel>
//                 <Select label="country-label" id="country" name="country" value={formData.country} onChange={handleInputChange}>
//                   {/* <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem> */}
//                   {countryVO.map((country) => (
//                     <MenuItem key={country} value={country}>
//                       {country}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {fieldErrors.country && (
//                   <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
//                     This field is required
//                   </span>
//                 )}
//               </FormControl>
//             </div>
//             <div className="col-md-3 mb-3">
//               <FormControl fullWidth size="small">
//                 <InputLabel id="country">State</InputLabel>
//                 <Select label="state-label" id="state" name="state" value={formData.state} onChange={handleInputChange}>
//                   {/* <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem> */}
//                   {stateVO.map((state) => (
//                     <MenuItem key={state} value={state}>
//                       {state}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {fieldErrors.state && (
//                   <span className="mt-1" style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
//                     This field is required
//                   </span>
//                 )}
//               </FormControl>
//             </div>
//             <div className="col-md-3 mb-3">
//               <FormControl fullWidth variant="filled">
//                 <TextField
//                   id="account"
//                   label="City"
//                   size="small"
//                   required
//                   name="cityName"
//                   value={formData.cityName}
//                   onChange={handleInputChange}
//                   inputProps={{ maxLength: 30 }}
//                   helperText={<span style={{ color: 'red' }}>{fieldErrors.cityName ? 'This field is required' : ''}</span>}
//                 />
//               </FormControl>
//             </div>
//             <div className="col-md-3 mb-3">
//               <FormControl fullWidth variant="filled">
//                 <TextField
//                   id="account"
//                   label="Code"
//                   size="small"
//                   required
//                   value={formData.cityCode}
//                   name="cityCode"
//                   onChange={handleInputChange}
//                   inputProps={{ maxLength: 30 }}
//                   helperText={<span style={{ color: 'red' }}>{fieldErrors.cityCode ? 'This field is required' : ''}</span>}
//                 />
//               </FormControl>
//             </div>
//             <div className="col-md-3 mb-3 ml-4">
//               <FormGroup>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={formData.active}
//                       onChange={handleInputChange}
//                       name="active"
//                       sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                     />
//                   }
//                   label="Active"
//                 />
//               </FormGroup>
//             </div>
//           </div>
//         ) : (
//           <CommonTable data={data} columns={columns} editCallback={editCity} countryVO={countryVO} stateVO={stateVO} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default City;

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, TextField, Checkbox, FormControlLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from './CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';

export const City = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [formData, setFormData] = useState({
    cityCode: '',
    cityName: '',
    state: '',
    country: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    cityCode: '',
    cityName: '',
    state: '',
    country: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  useEffect(() => {
    getAllCities();
    getAllCountries();
    if (formData.country) {
      getAllStates();
    }
  }, [formData.country]);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllStates = async () => {
    try {
      const stateData = await getAllActiveStatesByCountry(formData.country, orgId);
      setStateList(stateData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   if (name === 'cityCode' && !codeRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'cityCode' && value.length > 3) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 3' });
  //   } else if (name === 'cityName' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else {
  //     setFormData({ ...formData, [name]: name === 'active' ? checked : value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    if (name === 'cityCode' && !codeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'cityCode' && value.length > 3) {
      setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 3' });
    } else if (name === 'cityName' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'active' ? checked : value.toUpperCase()
      });
      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Update the cursor position after the input change
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      cityCode: '',
      cityName: '',
      state: '',
      country: '',
      active: true
    });
    setFieldErrors({
      cityCode: '',
      cityName: '',
      state: '',
      country: ''
    });
    setEditId('');
  };

  const getAllCities = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/city?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.cityVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCityById = async (row) => {
    console.log('THE SELECTED CITY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/city/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCity = response.paramObjectsMap.cityVO;

        setFormData({
          cityCode: particularCity.cityCode,
          cityName: particularCity.cityName,
          country: particularCity.country,
          state: particularCity.state,
          active: particularCity.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.cityCode) {
      errors.cityCode = 'City Code is required';
    }
    if (!formData.cityName) {
      errors.cityName = 'City Name is required';
    }
    if (!formData.state) {
      errors.state = 'State is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        cityCode: formData.cityCode,
        cityName: formData.cityName,
        state: formData.state,
        country: formData.country,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('post', `commonmaster/createUpdateCity`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' City Updated Successfully' : 'City created successfully');
          handleClear();
          getAllCities();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'City creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'City creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'cityCode', header: 'Code', size: 140 },
    { accessorKey: 'cityName', header: 'City', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCityById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="cityCode"
                  value={formData.cityCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.cityCode}
                  helperText={fieldErrors.cityCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="cityName"
                  value={formData.cityName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.cityName}
                  helperText={fieldErrors.cityName}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.countryName}>
                          {row.countryName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.state}>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select labelId="state-label" label="State" value={formData.state} onChange={handleInputChange} name="state">
                    {stateList?.map((row) => (
                      <MenuItem key={row.id} value={row.stateName}>
                        {row.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.state && <FormHelperText>{fieldErrors.state}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default City;
