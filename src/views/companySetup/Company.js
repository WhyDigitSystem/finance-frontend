import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { Avatar, ButtonBase, FormHelperText, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState, useMemo, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import { getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';
import apiCalls from 'apicall';

const Company = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [editId, setEditId] = useState('');
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    companyCode: '',
    companyName: '',
    ceo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    // gst: '',
    website: '',
    panNo: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    companyCode: '',
    ceo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    // gst: '',
    panNo: '',
    website: '',
    active: ''
  });
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      beneficiaryName: '',
      accountNo: '',
      bankName: '',
      accountCode: '',
      branch: '',
      ifsc: '',
      accountType: '',
      primaryAccount: 'true'
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      beneficiaryName: '',
      accountNo: '',
      bankName: '',
      accountCode: '',
      branch: '',
      ifsc: '',
      accountType: '',
      primaryAccount: ''
    }
  ]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      beneficiaryName: '',
      accountNo: '',
      bankName: '',
      accountCode: '',
      branch: '',
      ifsc: '',
      accountType: '',
      primaryAccount: 'true'
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {
        beneficiaryName: '',
        accountNo: '',
        bankName: '',
        accountCode: '',
        branch: '',
        ifsc: '',
        accountType: '',
        primaryAccount: 'true'
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.beneficiaryName ||
        !lastRow.accountNo ||
        !lastRow.bankName ||
        !lastRow.accountCode ||
        !lastRow.branch ||
        !lastRow.ifsc ||
        !lastRow.accountType
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          beneficiaryName: !table[table.length - 1].beneficiaryName ? 'Beneficiary Name is required' : '',
          accountNo: !table[table.length - 1].accountNo ? 'Account No is required' : '',
          bankName: !table[table.length - 1].bankName ? 'Bank Name is required' : '',
          accountCode: !table[table.length - 1].accountCode ? 'Account Code is required' : '',
          branch: !table[table.length - 1].branch ? 'Branch is required' : '',
          ifsc: !table[table.length - 1].ifsc ? 'IFSC is required' : '',
          accountType: !table[table.length - 1].accountType ? 'Account Type is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'companyCode', header: 'Company Code', size: 140 },
    {
      accessorKey: 'companyName',
      header: 'Company',
      size: 140
    },
    {
      accessorKey: 'employeeName',
      header: 'Admin',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  useEffect(() => {
    getCompanyDetails();
    // getCompany();
    getAllCountries();
    if (formData.country) {
      getAllStates();
    }
    if (formData.state) {
      getAllCities();
    }
  }, [formData.country, formData.state]);

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
  const getAllCities = async () => {
    try {
      const cityData = await getAllActiveCitiesByState(formData.state, orgId);
      setCityList(cityData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    // Regular expressions for validation
    const nameRegex = /^[A-Za-z ]*$/; // Allows only alphabetic characters and spaces
    const numericRegex = /^[0-9]*$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    // const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\S*)?$/;
    // const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
    let error = '';
    if (name === 'panNo' && value.length > 11) return;
    if (name === 'panNo') {
      if (value.length === 11 && !panRegex.test(value)) {
        error = 'Invalid PAN Format (e.g., ABCDE1234F)';
      }
    }
    if (name === 'ceo') {
      if (!nameRegex.test(value)) {
        error = 'Only Alphabets allowed';
      } else if (name === 'ceo' && value.length > 50) {
        error = 'Exceeded Max Length';
      }
    } else if (name === 'address') {
      if (name === 'address' && value.length > 200) {
        error = 'Exceeded Max Length';
      }
    } else if (name === 'pincode') {
      if (!numericRegex.test(value)) {
        error = 'Only numerics allowed';
      } else if (value.length > 6) {
        error = 'Only 6 digits allowed';
      }
    }
    //  else if (name === 'gst') {
    //   if (!gstRegex.test(value)) {
    //     error = 'Invalid Format';
    //   } else if (value.length > 15) {
    //     error = 'Only 15 characters are allowed';
    //   }
    // }
    //  else if (name === 'pan') {
    //   if (!panRegex.test(value)) {
    //     error = 'Invalid Format';
    //   } else if (value.length > 15) {
    //     error = 'Only 15 characters are allowed';
    //   }
    // }

    // Handle errors if validation fails
    if (error) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
    } else {
      // Clear previous error if input is valid
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));

      // Update the form data
      let updatedValue = value;

      if (name !== 'active') {
        updatedValue = value.toUpperCase();
      }

      if (type === 'checkbox') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: checked
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: updatedValue
        }));
      }

      // Handle cursor position reset after input change (for text, email, and textarea)
      if (type === 'text' || type === 'textarea' || type === 'email') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const getCompanyById = async (row) => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCompany = response.paramObjectsMap.companyVO[0];
        console.log('PARTICULAR COMPANY IS:', particularCompany);

        setFormData({
          companyCode: particularCompany.companyCode,
          companyName: particularCompany.companyName,
          ceo: particularCompany.ceo,
          address: particularCompany.address,
          country: particularCompany.country,
          state: particularCompany.state,
          city: particularCompany.city,
          pincode: particularCompany.zip,
          panNo: particularCompany.panno,
          active: particularCompany.active === 'Active' ? true : false,
          // gst: particularCompany.gst,
          website: particularCompany.webSite
        });
        setDetailsTableData(
          particularCompany.bankDetailsVO.map((com) => ({
            id: com.id,
            accountCode: com.accountCode,
            accountNo: com.accountNo,
            accountType: com.accountType,
            bankName: com.bankName,
            beneficiaryName: com.beneficiaryName,
            branch: com.branch,
            ifsc: com.ifsc,
            primaryAccount: com.primaryAccount === 'true' || com.primaryAccount === true
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const particularCompany = response.paramObjectsMap.companyVO[0];
        setListViewData(response.paramObjectsMap.companyVO.reverse());
        console.log('THE LISTVIEW COMPANY IS:', particularCompany);

        setFormData({ ...formData, companyCode: particularCompany.companyCode, companyName: particularCompany.companyName });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      // companyCode: '',
      ceo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      // gst: '',
      panNo: '',
      website: '',
      active: true
    });
    setFieldErrors({
      // companyCode: '',
      ceo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      panNo: '',
      // gst: '',
      website: ''
    });
    setDetailsTableData([
      {
        id: 1,
        beneficiaryName: '',
        accountNo: '',
        bankName: '',
        accountCode: '',
        branch: '',
        ifsc: '',
        accountType: '',
        primaryAccount: 'true'
      }
    ]);
    setDetailsTableErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.ceo) {
      errors.ceo = 'CEO is required';
    } else if (formData.ceo.length < 3) {
      errors.ceo = 'Min Length is 3';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      errors.address = 'Min Length is 5';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.state) {
      errors.state = 'State is required';
    }
    if (!formData.city) {
      errors.city = 'City is required';
    }
    if (!formData.panNo) {
      errors.panNo = 'Pan No is required';
    } else if (formData.panNo.length < 10) {
      errors.panNo = 'Invalid Pan No';
    }
    if (formData.pincode.length < 6 && formData.pincode.length >= 1) {
      errors.pincode = 'Invalid Pincode';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const detailsVo = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountCode: row.accountCode,
        accountNo: parseInt(row.accountNo),
        accountType: row.accountType,
        bankName: row.bankName,
        beneficiaryName: row.beneficiaryName,
        branch: row.branch,
        ifsc: row.ifsc,
        primaryAccount: row.primaryAccount === 'true' || row.primaryAccount === true
      }));
      const saveFormData = {
        id: orgId,
        companyCode: formData.companyCode,
        companyName: formData.companyName,
        ceo: formData.ceo,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip: formData.pincode,
        panno: formData.panNo,
        webSite: formData.website,
        active: formData.active,
        updatedBy: loginUserName,
        bankDetailsDTO: detailsVo
      };
      console.log('THE SAVE FORM DATA IS:', saveFormData);

      try {
        const response = await apiCalls('put', `commonmaster/updateCompany`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);

          showToast('success', ' Company updated Successfully');
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Company updation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Company updation failed');

        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    console.log('LIST VIEW DATAS ARE:', listViewData);

    setListView(!listView);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              // editCallback={editEmployee}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getCompanyById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Company Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyName"
                  value={formData.companyName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  // error={!!fieldErrors.companyCode}
                  // helperText={fieldErrors.companyCode}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="CEO"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="ceo"
                  value={formData.ceo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.ceo}
                  helperText={fieldErrors.ceo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!fieldErrors.address}
                  helperText={fieldErrors.address}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.state}>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select labelId="city-label" label="City" value={formData.city} onChange={handleInputChange} name="city">
                    {cityList?.map((row) => (
                      <MenuItem key={row.id} value={row.cityName}>
                        {row.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.city && <FormHelperText>{fieldErrors.city}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Pincode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="pincode"
                  value={formData.pincode}
                  maxLength={6}
                  onChange={handleInputChange}
                  error={!!fieldErrors.pincode}
                  helperText={fieldErrors.pincode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Pan No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.panNo}
                  helperText={fieldErrors.panNo}
                />
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="GST"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gst}
                  helperText={fieldErrors.gst}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Official Website"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  error={!!fieldErrors.website}
                  helperText={fieldErrors.website}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Details" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-14">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '60px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    Beneficiary Name
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    Account No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '800px' }}>
                                    Bank Name
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    Account Code
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    Branch
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    IFSC
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '600px' }}>
                                    Account Type
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                    Primary Account
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.beneficiaryName}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, beneficiaryName: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              beneficiaryName: !value ? 'Beneficiary Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.beneficiaryName ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.beneficiaryName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].beneficiaryName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountNo}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountNo: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              accountNo: !value ? 'Account No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.accountNo ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.accountNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].accountNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.bankName}
                                        style={{ width: 400 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, bankName: value } : r)));
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              bankName: !value ? 'Bank Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.bankName ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.bankName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].bankName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountCode}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountCode: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              accountCode: !value ? 'Account Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.accountCode ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.accountCode && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].accountCode}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.branch}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, branch: value } : r)));
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              branch: !value ? 'Branch is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.branch ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.branch && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].branch}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.ifsc}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, ifsc: value } : r)));
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              ifsc: !value ? 'IFSC is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.ifsc ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.ifsc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].ifsc}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.accountType}
                                        style={{ width: 200 }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountType: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              accountType: !value ? 'Account Type is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.accountType ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.accountType && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].accountType}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2 text-center">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            className="ms-2 pb-0 pt-1"
                                            checked={row.primaryAccount}
                                            style={{ width: 200 }}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;

                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, primaryAccount: isChecked } : r))
                                              );
                                            }}
                                            name="primaryAccount"
                                            color="primary"
                                          />
                                        }
                                        // label="primaryAccount"
                                        sx={{
                                          '& .MuiSvgIcon-root': { color: '#5e35b1' }
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default Company;
