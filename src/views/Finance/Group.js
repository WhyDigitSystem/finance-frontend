import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import { getAllActiveCurrency } from 'utils/CommonFunctions';

const Group = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [currencies, setCurrencies] = useState([]);
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    groupName: '',
    gstTaxflag: '',
    accountCode: '',
    coaList: '',
    accountGroupName: '',
    type: '',
    interBranchAc: false,
    controllAc: false,
    category: '',
    branch: '',
    currency: '',
    active: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    groupName: false,
    gstTaxflag: false,
    accountCode: false,
    coaList: false,
    accountGroupName: false,
    type: false,
    interBranchAc: false,
    controllAc: false,
    category: false,
    branch: false,
    currency: false,
    active: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getGroup();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    let errorMessage = '';
    let validInputValue = inputValue; // Initialize valid input value

    // Validation for accountCode (alphanumeric only)
    if (name === 'accountCode') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/; // Pattern for alphanumeric
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        // Set validInputValue to prevent invalid character input
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    // Validation for accountGroupName (alphabets only)
    if (name === 'accountGroupName') {
      const alphabetPattern = /^[a-zA-Z]*$/; // Pattern for alphabets
      if (!alphabetPattern.test(inputValue)) {
        errorMessage = 'Only alphabets are allowed.';
        // Set validInputValue to prevent invalid character input
        validInputValue = inputValue.replace(/[^a-zA-Z]/g, '');
      }
    }

    // Update the form data with the valid input value
    setFormData({ ...formData, [name]: validInputValue });

    // Update the error messages
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const getGroup = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.groupLedgerVO);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleSave = async () => {
  //   // Check if any field is empty
  //   const fieldsToExclude = ['interBranchAc', 'controllAc', 'active'];
  //   // setIsLoading(true);e
  //   // Check if any field is empty, excluding certain fields
  //   const errors = Object.keys(formData).reduce((acc, key) => {
  //     if (!fieldsToExclude.includes(key) && !formData[key]) {
  //       acc[key] = true;
  //     }
  //     return acc;
  //   }, {});

  //   // If there are errors, set the corresponding fieldErrors state to true
  //   // if (Object.keys(errors).length > 0) {
  //   //   setFieldErrors(errors);
  //   //   return; // Prevent API call if there are errors
  //   // }
  //   // axios
  //   //   .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateGroupLedger`, formData)
  //   //   .then((response) => {
  //   //     console.log('Response:', response.data);
  //   //     handleClear();
  //   //     toast.success('Group Created Successfully', {
  //   //       autoClose: 2000,
  //   //       theme: 'colored'
  //   //     });
  //   //     setIsLoading(false);
  //   //     getGroup();
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error('Error:', error);
  //   //   });
  //   if (Object.keys(errors).length === 0) {
  //     setIsLoading(true);
  //     const saveData = {
  //       ...(editId && { id: editId }),
  //       active: formData.active,
  //       groupName: formData.groupName,
  //       gstTaxflag: formData.gstTaxflag,
  //       accountCode: formData.accountCode,
  //       coaList: formData.coaList,
  //       accountGroupName: formData.accountGroupName,
  //       type: formData.type,
  //       interBranchAc: formData.interBranchAc,
  //       controllAc: formData.controllAc,
  //       category: formData.category,
  //       branch: formData.branch,
  //       currency: formData.currency,
  //       orgId: orgId,
  //       createdBy: loginUserName
  //     };

  //     console.log('DATA TO SAVE', saveData);

  //     try {
  //       const response = await apiCalls('put', `master/updateCreateGroupLedger`, saveData);
  //       if (response.status === true) {
  //         console.log('Response:', response);
  //         showToast('success', editId ? ' Group Updated Successfully' : 'Group created successfully');
  //         handleClear();
  //         // getAllRegions();
  //         getGroup();
  //         setIsLoading(false);
  //       } else {
  //         showToast('error', response.paramObjectsMap.errorMessage || 'Group creation failed');
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       showToast('error', 'Group creation failed');
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setFieldErrors(errors);
  //   }
  // };

  const handleSave = async () => {
    // Check if any field is empty
    const fieldsToExclude = ['interBranchAc', 'controllAc', 'active'];

    const errors = Object.keys(formData).reduce((acc, key) => {
      if (!fieldsToExclude.includes(key) && !formData[key]) {
        acc[key] = 'This field is required'; // Show 'This field is required' message
      }
      return acc;
    }, {});

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        groupName: formData.groupName,
        gstTaxflag: formData.gstTaxflag,
        accountCode: formData.accountCode,
        coaList: formData.coaList,
        accountGroupName: formData.accountGroupName,
        type: formData.type,
        interBranchAc: formData.interBranchAc,
        controllAc: formData.controllAc,
        category: formData.category,
        branch: formData.branch,
        currency: formData.currency,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `master/updateCreateGroupLedger`, saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Group Updated Successfully' : 'Group created successfully');
          handleClear();
          getGroup();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Group creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Group creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors); // Set the error messages for required fields
    }
  };

  const handleClear = () => {
    setFormData({
      groupName: '',
      gstTaxflag: '',
      accountCode: '',
      coaList: '',
      accountGroupName: '',
      type: '',
      interBranchAc: false,
      controllAc: false,
      category: '',
      branch: '',
      currency: '',
      active: false
    });
    setFieldErrors({
      groupName: false,
      gstTaxflag: false,
      accountCode: false,
      coaList: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      category: false,
      branch: false,
      currency: false,
      active: false
    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      groupName: false,
      gstTaxflag: false,
      accountCode: false,
      coaList: false,
      accountGroupName: false,
      type: false,
      interBranchAc: false,
      controllAc: false,
      category: false,
      branch: false,
      currency: false,
      active: false
    });
  };

  const columns = [
    { accessorKey: 'groupName', header: 'Group Name', size: 140 },
    { accessorKey: 'accountCode', header: 'Account Code', size: 140 },
    { accessorKey: 'coaList', header: 'COA List', size: 100 },
    { accessorKey: 'accountGroupName', header: 'Account/Groupname', size: 100 },
    { accessorKey: 'type', header: 'type', size: 100 },
    { accessorKey: 'branch', header: 'Branch', size: 100 },
    { accessorKey: 'currency', header: 'Currency', size: 100 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  const getGruopById = async (row) => {
    console.log('Editing Exchange Rate:', row.original.id);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getAllGroupLedgerById?id=${row.original.id}`);

      if (result) {
        const exRate = result.paramObjectsMap.groupLedgerVO[0];
        setEditMode(true);

        setFormData({
          orgId: orgId,
          groupName: exRate.groupName,
          gstTaxFlag: exRate.gstTaxFlag,
          accountCode: exRate.accountCode,
          coaList: exRate.coaList,
          accountGroupName: exRate.accountGroupName,
          type: exRate.type,
          interBranchAc: exRate.interBranchAc,
          controllAc: exRate.controllAc,
          category: exRate.category,
          branch: exRate.branch,
          id: exRate.id,
          currency: exRate.currency,
          active: exRate.active
        });

        console.log('DataToEdit', exRate);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
        </div>
        {/* <div className="d-flex justify-content-between">
          <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1>
        </div> */}
        {showForm ? (
          <div className="row d-flex ">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Group Name</InputLabel>
                <Select
                  labelId="groupName"
                  id="groupName"
                  label="Group Name"
                  onChange={handleInputChange}
                  name="groupName"
                  value={formData.groupName}
                >
                  <MenuItem value="Administrative Charges">Administrative Charges</MenuItem>
                  <MenuItem value="Twenty">Twenty</MenuItem>
                  <MenuItem value="Thirty">Thirty</MenuItem>
                </Select>
                {fieldErrors.groupName && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-2">
              <FormControl fullWidth size="small">
                <InputLabel id="gstTaxflag">GST Tax Flag</InputLabel>
                <Select
                  labelId="gstTaxflag"
                  id="gstTaxflag"
                  label="GST Tax Flag"
                  onChange={handleInputChange}
                  name="gstTaxflag"
                  value={formData.gstTaxflag}
                >
                  <MenuItem value="Input Tax">Input Tax</MenuItem>
                  <MenuItem value="Output Tax">Output Tax</MenuItem>
                  <MenuItem value="NA">NA</MenuItem>
                </Select>
                {fieldErrors.gstTaxflag && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="account"
                  label="Account Code"
                  size="small"
                  required
                  placeholder="40003600104"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountCode"
                  value={formData.accountCode}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.accountCode || ''}</span>}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">COA List</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="COA List"
                  onChange={handleInputChange}
                  name="coaList"
                  value={formData.coaList}
                >
                  <MenuItem value="Asset">Asset</MenuItem>
                  <MenuItem value="Liability">Liability</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                </Select>
                {fieldErrors.coaList && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="accountGroupName"
                  label="Account/Group Name"
                  size="small"
                  required
                  placeholder="Enter Group Name"
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountGroupName"
                  value={formData.accountGroupName}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.accountGroupName ? fieldErrors.accountGroupName : ''}</span>}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  onChange={handleInputChange}
                  name="type"
                  value={formData.type}
                >
                  <MenuItem value="Account">Account</MenuItem>
                  <MenuItem value="Twenty">Twenty</MenuItem>
                  <MenuItem value="Thirty">Thirty</MenuItem>
                </Select>
                {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-3 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.interBranchAc}
                      onChange={handleInputChange}
                      name="interBranchAc"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Interbranch A/c"
                />
              </FormGroup>
            </div>
            <div className="col-md-3 mb-2">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.controllAc}
                      onChange={handleInputChange}
                      name="controllAc"
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Control A/c"
                />
              </FormGroup>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  onChange={handleInputChange}
                  name="category"
                  value={formData.category}
                >
                  <MenuItem value="Others">Others</MenuItem>
                  <MenuItem value="Twenty">Twenty</MenuItem>
                  <MenuItem value="Thirty">Thirty</MenuItem>
                </Select>
                {fieldErrors.category && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Branch</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleInputChange}
                  name="branch"
                  value={formData.branch}
                  label="Branch"
                >
                  <MenuItem value="Others">Others</MenuItem>
                  <MenuItem value="Twenty">Twenty</MenuItem>
                  <MenuItem value="Thirty">Thirty</MenuItem>
                </Select>
                {fieldErrors.branch && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Currency"
                  onChange={handleInputChange}
                  name="currency"
                  value={formData.currency}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.id} value={currency.currency}>
                      {currency.currency}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      name="active"
                      onChange={handleInputChange}
                      sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                    />
                  }
                  label="Active"
                />
              </FormGroup>
            </div>
          </div>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};

export default Group;
