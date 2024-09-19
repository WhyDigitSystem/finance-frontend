// import ClearIcon from '@mui/icons-material/Clear';
// import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
// import SaveIcon from '@mui/icons-material/Save';
// import SearchIcon from '@mui/icons-material/Search';
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
// import CommonTable from './CommonTable';

// const Country = () => {
//   const theme = useTheme();
//   const anchorRef = useRef(null);
//   const [showFields, setShowFields] = useState(true);
//   const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
//   const [data, setData] = useState([]);
//   const [data1, setData1] = useState([]);
//   const [Loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     countryName: '',
//     countryCode: '',
//     orgId: orgId,
//     active: true
//   });

//   const [fieldErrors, setFieldErrors] = useState({
//     countryName: false,
//     countryCode: false
//   });

//   const columns = [
//     { accessorKey: 'countryName', header: 'Country', size: 140 },
//     { accessorKey: 'countryCode', header: 'Code', size: 140 },
//     { accessorKey: 'active', header: 'active', size: 140 }
//   ];

//   useEffect(() => {
//     fetchData();
//   }, [showFields, orgId]);

//   const [imageSrc, setImageSrc] = useState('');

//   // useEffect(() => {
//   //   const fetchImage = async () => {
//   //     try {
//   //       // Replace with your API endpoint or blob source
//   //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/images/1`, { responseType: 'blob' });
//   //       const blob = response.data;
//   //       const imageUrl = URL.createObjectURL(blob);
//   //       setImageSrc(imageUrl);
//   //     } catch (error) {
//   //       console.error('Error fetching the image:', error);
//   //     }
//   //   };

//   //   fetchImage();

//   //   // Clean up the URL object when the component is unmounted
//   //   return () => {
//   //     URL.revokeObjectURL(imageSrc);
//   //   };
//   // }, []);

//   const handleClear = () => {
//     setFormData({
//       countryName: '',
//       countryCode: '',
//       active: true
//     });

//     setFieldErrors({
//       countryName: false,
//       countryCode: false
//     });
//   };

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

//   const fetchData = async () => {
//     try {
//       const result = await apiCalls('get', `/basicMaster/getCountryByOrgId?orgId=${orgId}`);
//       setData(result.paramObjectsMap.countryVO || []);
//       console.log('Test', result);
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
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
//       setLoading(true);
//       const response = await apiCalls('put', 'basicMaster/updateCreateCountry', formData);
//       console.log('Post response:', response);
//       toast.success('Country Created successfully', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//       handleClear();
//       // Handle successful response (e.g., clear form, update state, etc.)
//     } catch (error) {
//       console.error('Error posting data:', error);

//       toast.error('Error posting data', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editCountry = async (updatedCountry) => {
//     try {
//       setLoading(true);
//       const response = await apiCalls('put', '/api/basicMaster/updateCreateCountry', updatedCountry);
//       toast.success('Country Updated Successfully', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//       fetchData();
//     } catch (error) {
//       console.error('Error updating country:', error);
//       toast.error('Error Updating Country', {
//         autoClose: 2000,
//         theme: 'colored'
//       });
//     } finally {
//       setLoading(false);
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
//         <div>
//           {showFields ? (
//             <div className="row d-flex">
//               <div className="col-md-3 mb-3">
//                 <FormControl fullWidth variant="filled">
//                   <TextField
//                     id="account"
//                     label="Country"
//                     size="small"
//                     required
//                     name="countryName"
//                     value={formData.countryName}
//                     onChange={handleInputChange}
//                     inputProps={{ maxLength: 30 }}
//                     helperText={<span style={{ color: 'red' }}>{fieldErrors.countryName ? 'This field is required' : ''}</span>}
//                   />
//                 </FormControl>
//               </div>
//               <div className="col-md-3 mb-3">
//                 <FormControl fullWidth variant="filled">
//                   <TextField
//                     id="account"
//                     label="Code"
//                     size="small"
//                     required
//                     value={formData.countryCode}
//                     name="countryCode"
//                     onChange={handleInputChange}
//                     inputProps={{ maxLength: 30 }}
//                     helperText={<span style={{ color: 'red' }}>{fieldErrors.countryCode ? 'This field is required' : ''}</span>}
//                   />
//                 </FormControl>
//               </div>
//               <div className="col-md-3 mb-3">
//                 <FormGroup>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={formData.active}
//                         onChange={handleInputChange}
//                         name="active"
//                         sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
//                       />
//                     }
//                     label="Active"
//                   />
//                 </FormGroup>
//               </div>
//               {/* <div>{imageSrc ? <img src={imageSrc} alt="Blob" /> : <p>Loading...</p>}</div> */}
//             </div>
//           ) : (
//             <CommonTable data={Array.isArray(data) ? data : []} columns={columns} editCallback={editCountry} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Country;

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from './CommonListViewTable';

export const Country = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    active: true,
    countryCode: '',
    countryName: ''
  });
  const [editId, setEditId] = useState('');

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    countryName: '',
    countryCode: ''
  });
  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'countryCode', header: 'Code', size: 140 },
    {
      accessorKey: 'countryName',
      header: 'Country',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllCountries();
  }, []);

  const getAllCountries = async () => {
    try {
      const result = await apiCalls('get', `commonmaster/country?orgid=${orgId}`);
      setListViewData(result.paramObjectsMap.countryVO);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getCountryById = async (row) => {
    console.log('THE SELECTED COUNTRY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/country/${row.original.id}`);

      if (response.status === true) {
        const particularCountry = response.paramObjectsMap.Country;
        setFormData({
          countryCode: particularCountry.countryCode,
          countryName: particularCountry.countryName,
          active: particularCountry.active === 'Active' ? true : false
        });
        setListView(false);
      } else {
        console.error('API Error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   if (name === 'countryCode' && !codeRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'countryName' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    if (name === 'countryCode' && !codeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'countryName' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });
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
      countryName: '',
      countryCode: '',
      active: true
    });
    setFieldErrors({
      countryName: '',
      countryCode: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.countryCode) {
      errors.countryCode = 'Country Code is required';
    }
    if (!formData.countryName) {
      errors.countryName = 'Country is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        countryCode: formData.countryCode,
        countryName: formData.countryName,
        orgId: orgId,
        createdby: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const result = await apiCalls('post', `commonmaster/createUpdateCountry`, saveFormData);

        if (result.status === true) {
          console.log('Response:', result);
          showToast('success', editId ? ' Country Updated Successfully' : 'Country created successfully');
          handleClear();
          getAllCountries();
          setIsLoading(false);
        } else {
          showToast('error', result.paramObjectsMap.errorMessage || 'Country creation failed');
          setIsLoading(false);
        }
      } catch (err) {
        console.log('error', err);
        showToast('error', 'Country creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClose = () => {
    setEditMode(false);
    setFormData({
      country: '',
      countryCode: ''
    });
  };

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
    });
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton
              title="Save"
              icon={SaveIcon}
              isLoading={isLoading}
              onClick={() => handleSave()}
              margin="0 10px 0 10px"
            /> &nbsp;{' '}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getCountryById}
            />
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
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.countryCode}
                  helperText={fieldErrors.countryCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="countryName"
                  value={formData.countryName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.countryName}
                  helperText={fieldErrors.countryName}
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
        )}
      </div>
      <div>
        <ToastComponent />
      </div>
    </>
  );
};
export default Country;
