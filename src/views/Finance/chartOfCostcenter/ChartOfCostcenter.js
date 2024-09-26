import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActiveBranches, getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';
import CommonTable from 'views/basicMaster/CommonTable';

export const ChartOfCostcenter = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    customer: '',
    shortName: '',
    pan: '',
    contactPerson: '',
    mobile: '',
    gstReg: 'YES',
    email: '',
    groupOf: '',
    tanNo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    gst: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    customer: '',
    shortName: '',
    pan: '',
    contactPerson: '',
    mobile: '',
    gstReg: '',
    email: '',
    groupOf: '',
    tanNo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    gst: ''
  });
  const [value, setValue] = useState(0);
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      costCenterCode: '',
      costCenterName: '',
      credit: '',
      debit: ''
    }
  ]);

  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      costCenterCode: '',
      costCenterName: '',
      credit: '',
      debit: ''
    }
  ]);

  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'costCenterCode', header: 'Cost Center Code', size: 140 },
    { accessorKey: 'costCenterName', header: 'Cost Center Name', size: 140 },
    { accessorKey: 'credit', header: 'Credit', size: 140 },
    { accessorKey: 'debit', header: 'Debit', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // getAllChartofCostCenter();
  }, []);

  // const getAllCountries = async () => {
  //   try {
  //     const countryData = await getAllActiveCountries(orgId);
  //     setCountryList(countryData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllStates = async () => {
  //   try {
  //     const stateData = await getAllActiveStatesByCountry(formData.country, orgId);
  //     setStateList(stateData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllCities = async () => {
  //   try {
  //     const cityData = await getAllActiveCitiesByState(formData.state, orgId);
  //     setCityList(cityData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllBranches = async () => {
  //   try {
  //     const branchData = await getAllActiveBranches(orgId);
  //     setBranchList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };

  const getAllChartofCostCenter = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllCostCenterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.costCenterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getChartofCostCenterById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/customer/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCustomer = response.paramObjectsMap.Customer;
        console.log('THE PARTICULAR CUSTOMER IS:', particularCustomer);

        setFormData({
          customer: particularCustomer.customerName,
          shortName: particularCustomer.customerShortName,
          pan: particularCustomer.panNo,
          contactPerson: particularCustomer.contactPerson,
          mobile: particularCustomer.mobileNumber,
          gstReg: particularCustomer.gstRegistration,
          email: particularCustomer.emailId,
          groupOf: particularCustomer.groupOf,
          tanNo: particularCustomer.tanNo,
          address: particularCustomer.address1,
          country: particularCustomer.country,
          state: particularCustomer.state,
          city: particularCustomer.city,
          gst: particularCustomer.gstNo,
          active: particularCustomer.active === 'Active' ? true : false
        });
        setDetailsTableData(
          particularCustomer.clientVO.map((cl) => ({
            id: cl.id,
            client: cl.client,
            clientCode: cl.clientCode,
            clientType: cl.clientType,
            fifoFife: cl.fifofife
          }))
        );

        const alreadySelectedBranch = particularCustomer.clientBranchVO.map((br) => {
          const foundBranch = branchList.find((branch) => branch.branchCode === br.branchCode);
          console.log(`Searching for branch with code ${br.branchcode}:`, foundBranch);
          return {
            id: br.id,
            branchCode: foundBranch ? foundBranch.branchCode : 'Not Found',
            branch: foundBranch.branch ? foundBranch.branch : 'Not Found'
          };
        });
        setDetailsTableData(alreadySelectedBranch);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;
    const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
    const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'customer':
      case 'shortName':
      case 'contactPerson':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'pan':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'branchName':
        if (!branchNameRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters and @, _, -, * are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'gst':
        if (formData.gstReg === 'YES') {
          if (!alphaNumericRegex.test(value)) {
            errorMessage = 'Only alphanumeric characters are allowed';
          } else if (value.length > 15) {
            errorMessage = 'Invalid Format';
          }
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'email') {
        setFormData({ ...formData, [name]: value.toLowerCase() });
      } else if (name === 'gstReg' && value === 'NO') {
        setFormData({ ...formData, [name]: value, gst: '' });
        setFieldErrors((prevErrors) => ({ ...prevErrors, gst: '' }));
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };
  const handleClear = () => {
    setDetailsTableData([
      {
        costCenterCode: '',
        costCenterName: '',
        credit: '',
        debit: ''
      }
    ]);
    setDetailsTableErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailRegex.test(formData.email)) {
    //   errors.email = 'Invalid MailID Format';
    // }
    // if (!formData.customer) {
    //   errors.customer = 'Customer is required';
    // }
    // if (!formData.shortName) {
    //   errors.shortName = 'Short Name is required';
    // }
    // if (!formData.contactPerson) {
    //   errors.contactPerson = 'Contact Person is required';
    // }
    // if (!formData.email) {
    //   errors.email = 'Email ID is required';
    // }
    // if (!formData.groupOf) {
    //   errors.groupOf = 'Group Of is required';
    // }
    // if (!formData.address) {
    //   errors.address = 'Address is required';
    // }
    // if (!formData.country) {
    //   errors.country = 'Country is required';
    // }
    // if (!formData.state) {
    //   errors.state = 'State is required';
    // }
    // if (!formData.city) {
    //   errors.city = 'City is required';
    // }
    // if (!formData.mobile) {
    //   errors.mobile = 'Mobile is required';
    // } else if (formData.mobile.length < 10) {
    //   errors.mobile = 'Invalid Mobile Format';
    // }
    // if (formData.pan.length > 0 && formData.pan.length < 10) {
    //   errors.pan = 'Invalid PAN Format';
    // }
    // if (formData.gstReg === 'YES' && !formData.gst) {
    //   errors.gst = 'GST is Required';
    // } else if (formData.gstReg === 'YES' && formData.gst.length < 15) {
    //   errors.gst = 'Invalid GST Format';
    // }

    let detailsTableDataValid = true;
    const newTableErrors1 = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.branchCode) {
        rowErrors.branchCode = 'Branch Code is required';
        detailsTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors1);

    if (Object.keys(errors).length === 0 && detailsTableDataValid) {
      setIsLoading(true);
      const branchVo = detailsTableData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: editId })
        // active: formData.active,
        // customerName: formData.customer,
        // customerShortName: formData.shortName,
        // panNo: formData.pan,
        // contactPerson: formData.contactPerson,
        // mobileNumber: formData.mobile,
        // gstRegistration: formData.gstReg,
        // emailId: formData.email,
        // groupOf: formData.groupOf,
        // tanNo: formData.tanNo,
        // address1: formData.address,
        // address2: formData.address,
        // country: formData.country,
        // state: formData.state,
        // city: formData.city,
        // gstNo: formData.gst,
        // clientDTO: clientVo,
        // clientBranchDTO: branchVo,
        // orgId: orgId,
        // createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateCustomer`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Customer Updated Successfully' : 'Customer created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Customer creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Customer creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        handleAddRow();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      costCenterCode: '',
      costCenterName: '',
      credit: '',
      debit: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { costCenterCode: '', costCenterName: '', credit: '', debit: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    if (table === detailsTableData) {
      return !lastRow.costCenterCode || !lastRow.costCenterName || !lastRow.credit || !lastRow.debit;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          costCenterCode: !table[table.length - 1].costCenterCode ? 'Cost Center Code is required' : '',
          costCenterName: !table[table.length - 1].costCenterName ? 'cost Center Name is required' : '',
          debit: !table[table.length - 1].debit ? 'Debit is required' : '',
          credit: !table[table.length - 1].credit ? 'Credit is required' : ''
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

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              // toEdit={getChartofCostCenterById}
            />
          </div>
        ) : (
          <>
            {/* <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Customer"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  error={!!fieldErrors.customer}
                  helperText={fieldErrors.customer}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Short Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.shortName}
                  helperText={fieldErrors.shortName}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Contact Person"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  error={!!fieldErrors.contactPerson}
                  helperText={fieldErrors.contactPerson}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Mobile"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  error={!!fieldErrors.mobile}
                  helperText={fieldErrors.mobile}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Group Of"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="groupOf"
                  value={formData.groupOf}
                  onChange={handleInputChange}
                  error={!!fieldErrors.groupOf}
                  helperText={fieldErrors.groupOf}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="PAN"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  error={!!fieldErrors.pan}
                  helperText={fieldErrors.pan}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="TAN"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="tanNo"
                  value={formData.tanNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.tanNo}
                  helperText={fieldErrors.tanNo}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gstReg}>
                  <InputLabel id="gstReg">GST Registration</InputLabel>
                  <Select
                    labelId="gstReg"
                    id="gstReg"
                    name="gstReg"
                    label="GST Registration"
                    value={formData.gstReg}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.gstReg && <FormHelperText error>{fieldErrors.gstReg}</FormHelperText>}
                </FormControl>
              </div>
              {formData.gstReg === 'YES' && (
                <div className="col-md-3 mb-3">
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
                </div>
              )}
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                  label="Active"
                />
              </div>
            </div> */}
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
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Cost Center Code</th>
                                  <th className="px-2 py-2 text-white text-center">Cost Center Name</th>
                                  <th className="px-2 py-2 text-white text-center">Credit</th>
                                  <th className="px-2 py-2 text-white text-center">Debit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            detailsTableData,
                                            setDetailsTableData,
                                            detailsTableErrors,
                                            setDetailsTableErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.costCenterCode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, costCenterCode: value.toUpperCase() } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              costCenterCode: !value ? 'costCenterCode is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.costCenterCode ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.costCenterCode && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].costCenterCode}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.costCenterName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, costCenterName: value.toUpperCase() } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              costCenterName: !value ? 'costCenterName is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.costCenterName ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.costCenterName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].costCenterName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.credit}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, credit: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], credit: !value ? 'Credit is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], credit: 'Only numeric characters are allowed' };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={detailsTableErrors[index]?.credit ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.credit && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].credit}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.debit}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debit: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], debit: !value ? 'Debit is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], debit: 'Only numeric characters are allowed' };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={detailsTableErrors[index]?.debit ? 'error form-control' : 'form-control'}
                                        onKeyDown={(e) => handleKeyDown(e, row, detailsTableData)}
                                      />
                                      {detailsTableErrors[index]?.debit && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].debit}
                                        </div>
                                      )}
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
      <ToastContainer />
    </>
  );
};
export default ChartOfCostcenter;
