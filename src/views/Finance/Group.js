import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import COASample from '../../assets/sample-files/COASample.xlsx';

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
  const [groupList, setGroupList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    active: false,
    type: '',
    groupName: '',
    gstTaxFlag: '',
    gstType: '',
    gstPercentage: '',
    accountCode: '',
    coaList: '',
    accountGroupName: '',
    category: '',
    currency: 'INR',
    pbflag: '',
    natureOfAccount: '',
    interBranchAc: false,
    controllAc: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: false,
    type: '',
    groupName: '',
    gstTaxFlag: '',
    gstType: '',
    gstPercentage: '',
    accountCode: '',
    coaList: '',
    accountGroupName: '',
    category: '',
    currency: '',
    pbflag: '',
    natureOfAccount: '',
    interBranchAc: false,
    controllAc: false
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
    getAllGroupName();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    let validInputValue = inputValue;
    let errorMessage = '';
    if (name === 'accountCode') {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/;
      if (!alphanumericPattern.test(inputValue)) {
        errorMessage = 'Only alphabets and numbers are allowed.';
        validInputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    if (name === 'gstPercentage') {
      const numericPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
      if (!numericPattern.test(inputValue)) {
        // errorMessage = 'Please enter a valid number for GST percentage.';
        validInputValue = inputValue.replace(/[^0-9.]/g, '');
      } else {
        errorMessage = '';
      }
    }

    setFormData((prevState) => ({ ...prevState, [name]: validInputValue }));

    if (name === 'gstTaxFlag') {
      if (value === 'NA') {
        setFormData((prevState) => ({
          ...prevState,
          gstType: '',
          gstPercentage: ''
        }));
        // Clear field errors
        setFieldErrors((prevState) => ({
          ...prevState,
          gstType: '',
          gstPercentage: ''
        }));
      }
    }

    let fieldErrorMessage = '';
    if (name === 'gstPercentage' && !value) {
    }
    if (name === 'gstType' && !value) {
      fieldErrorMessage = 'GST Type is required.';
    }

    setFieldErrors((prevState) => ({ ...prevState, [name]: fieldErrorMessage || errorMessage }));
  };

  const getGroup = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      if (result) {
        setData(result.paramObjectsMap.groupLedgerVO.reverse());
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.type) errors.type = 'Type is required';
    if (!data.accountCode) errors.accountCode = 'Account code is required';
    if (data.gstTaxFlag !== 'NA') {
      if (!data.gstPercentage || data.gstPercentage < 0 || data.gstPercentage > 100) {
        errors.gstPercentage = 'TAX is required';
      }
      if (!data.gstType) errors.gstType = 'TAX Type is required';
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveData = {
        ...(editId && { id: editId }),
        active: formData.active,
        groupName: formData.groupName,
        gstTaxFlag: formData.gstTaxFlag,
        coaList: formData.coaList,
        accountGroupName: formData.accountGroupName,
        accountCode: formData.accountCode,
        gstType: formData.gstType,
        type: formData.type,
        interBranchAc: formData.interBranchAc,
        controllAc: formData.controllAc,
        category: formData.category,
        branch: formData.branch,
        currency: 'INR',
        ...(formData.gstTaxFlag !== 'NA' && {
          gstType: formData.gstType,
          gstPercentage: formData.gstPercentage
        }),
        ...(formData.gstTaxFlag === 'NA' && {
          gstType: 'NA',
          gstPercentage: 0
        }),
        orgId: orgId,
        createdBy: loginUserName,
        pbflag: formData.pbflag,
        natureOfAccount: formData.natureOfAccount
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', 'master/updateCreateGroupLedger', saveData);

        if (response.status === true) {
          showToast(
            'success',
            editId ? `Group '${formData.groupName}' updated successfully` : `Group '${formData.groupName}' created successfully`
          );
          getGroup();
          handleClear();
        } else {
          const errorMessage = response.paramObjectsMap.errorMessage || 'Something went wrong. Please try again.';
          showToast('error', errorMessage);
        }
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = error?.response?.data?.paramObjectsMap?.errorMessage || 'Something went wrong. Please try again.';
        showToast('error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Validation Errors:', errors);
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      active: false,
      type: '',
      groupName: '',
      gstTaxFlag: '',
      gstType: '',
      gstPercentage: '',
      accountCode: '',
      coaList: '',
      accountGroupName: '',
      category: '',
      currency: '',
      pbflag: '',
      natureOfAccount: '',
      interBranchAc: false,
      controllAc: false
    });
    setFieldErrors({
      active: false,
      type: '',
      groupName: '',
      gstTaxFlag: '',
      gstType: '',
      gstPercentage: '',
      accountCode: '',
      coaList: '',
      accountGroupName: '',
      category: '',
      currency: '',
      pbflag: '',
      natureOfAccount: '',
      interBranchAc: false,
      controllAc: false
    });
    setEditId('');
  };

  const handleListView = () => {
    setShowForm(!showForm);
    setFieldErrors({
      active: false,
      type: '',
      groupName: '',
      gstTaxFlag: '',
      gstType: '',
      gstPercentage: '',
      accountCode: '',
      coaList: '',
      accountGroupName: '',
      category: '',
      currency: '',
      pbflag: '',
      natureOfAccount: '',
      interBranchAc: false,
      controllAc: false
    });
  };

  const columns = [
    { accessorKey: 'groupName', header: 'Group Name', size: 140 },
    { accessorKey: 'id', header: 'Account Code', size: 140 },
    { accessorKey: 'coaList', header: 'COA List', size: 100 },
    { accessorKey: 'accountGroupName', header: 'Account/Groupname', size: 100 },
    { accessorKey: 'type', header: 'Type', size: 100 },
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
          gstType: exRate.gstType,
          gstPercentage: exRate.gstPercentage,
          interBranchAc: exRate.interBranchAc,
          controllAc: exRate.controllAc,
          category: exRate.category,
          pbflag: exRate.pbflag,
          natureOfAccount: exRate.natureOfAccount,
          branch: exRate.branch,
          id: exRate.id,
          currency: 'INR',
          active: exRate.active
        });

        console.log('DataToEdit', exRate);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllGroupName = async () => {
    try {
      const response = await apiCalls('get', `/master/getGroupNameByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setGroupList(response.paramObjectsMap.groupNameDetails.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
        </div>
        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            sampleFileDownload={COASample}
            handleFileUpload={handleFileUpload}
            // apiUrl={`transaction/excelUploadForBrs?branch="CHENNAI"&branchCode="MAAW"&client="CASIO"&createdBy=${loginUserName}&customer="UNI"&finYear="2024"&orgId=${orgId}`}
            apiUrl={`master/excelUploadForGroupLedger?createdBy=${loginUserName}&orgId=${orgId}`}
            screen="COA"
          ></CommonBulkUpload>
        )}

        {showForm ? (
          <div className="row d-flex ">
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
                  <MenuItem value="ACCOUNT">ACCOUNT</MenuItem>
                  <MenuItem value="GROUP">GROUP</MenuItem>
                </Select>
                {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
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
                  {groupList.length > 0 &&
                    groupList.map((gro, index) => (
                      <MenuItem key={index} value={gro.groupName}>
                        {gro.groupName} {/* Display employee code */}
                      </MenuItem>
                    ))}
                </Select>
                {fieldErrors.groupName && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>

            {/* GST Tax Flag */}
            <div className="col-md-3 mb-2">
              <FormControl fullWidth size="small">
                <InputLabel id="gstTaxFlag">TAX Flag</InputLabel>
                <Select
                  labelId="gstTaxFlag"
                  id="gstTaxFlag"
                  label="TAX Flag"
                  onChange={handleInputChange}
                  name="gstTaxFlag"
                  value={formData.gstTaxFlag}
                >
                  <MenuItem value="INPUT TAX">INPUT TAX</MenuItem>
                  <MenuItem value="OUTPUT TAX">OUTPUT TAX</MenuItem>
                  <MenuItem value="NA">NA</MenuItem>
                </Select>
                {fieldErrors.gstTaxFlag && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstTaxFlag}</FormHelperText>}
              </FormControl>
            </div>

            {/* GST Type - Conditional Rendering */}
            {formData.gstTaxFlag !== 'NA' && (
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="gstType">TAX Type</InputLabel>
                  <Select
                    labelId="gstType"
                    id="gstType"
                    label="TAX Type"
                    onChange={handleInputChange}
                    name="gstType"
                    value={formData.gstType}
                  >
                    <MenuItem value="INTRA">INTRA</MenuItem>
                    <MenuItem value="INTER">INTER</MenuItem>
                  </Select>
                  {fieldErrors.gstType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstType}</FormHelperText>}
                </FormControl>
              </div>
            )}

            {/* GST Percentage - Conditional Rendering */}
            {formData.gstTaxFlag !== 'NA' && (
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="gstPercentage"
                    label="Tax %"
                    size="small"
                    onChange={handleInputChange}
                    name="gstPercentage"
                    value={formData.gstPercentage}
                  />
                  {fieldErrors.gstPercentage && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstPercentage}</FormHelperText>}
                </FormControl>
              </div>
            )}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="accountCode"
                  label="Account Code"
                  size="small"
                  required
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="accountCode"
                  value={formData.accountCode}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">COA List</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="coaList"
                  label="COA List"
                  onChange={handleInputChange}
                  name="coaList"
                  value={formData.coaList}
                >
                  <MenuItem value="ASSET">ASSET</MenuItem>
                  <MenuItem value="LIABILITY">LIABILITY</MenuItem>
                  <MenuItem value="INCOME">INCOME</MenuItem>
                  <MenuItem value="EXPENCE">EXPENCE</MenuItem>
                  <MenuItem value="Capital">CAPITAL</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="accountGroupName"
                  label="Account/Group Name"
                  size="small"
                  required
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
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="category"
                  label="Category"
                  onChange={handleInputChange}
                  name="category"
                  value={formData.category}
                >
                  <MenuItem value="RECEIVABLE A/C">RECEIVABLE A/C</MenuItem>
                  <MenuItem value="PAYABLE A/C">PAYABLE A/C</MenuItem>
                  <MenuItem value="OTHERS">OTHERS</MenuItem>
                  <MenuItem value="BANK">BANK</MenuItem>
                  <MenuItem value="TAX">TAX</MenuItem>
                </Select>
                {fieldErrors.category && <FormHelperText style={{ color: 'red' }}>Type is required</FormHelperText>}
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <TextField
                  id="currency"
                  label="Currency"
                  size="small"
                  disabled
                  inputProps={{ maxLength: 30 }}
                  onChange={handleInputChange}
                  name="currency"
                  value={formData.currency}
                  helperText={<span style={{ color: 'red' }}>{fieldErrors.currency ? fieldErrors.currency : ''}</span>}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">P/B Flag</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="pbflag"
                  onChange={handleInputChange}
                  name="pbflag"
                  value={formData.pbflag}
                >
                  <MenuItem value="P">PROFIT AND LOSS</MenuItem>
                  <MenuItem value="B">BALANCE SHEET</MenuItem>
                </Select>
                {fieldErrors.pbflag && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Nature Of Account</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="natureOfAccount"
                  onChange={handleInputChange}
                  name="natureOfAccount"
                  value={formData.natureOfAccount}
                >
                  <MenuItem value="Db">DB</MenuItem>
                  <MenuItem value="Cr">CR</MenuItem>
                  <MenuItem value="NA">N/A</MenuItem>
                </Select>
                {fieldErrors.natureOfAccount && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
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
          </div>
        ) : (
          <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getGruopById} />
        )}
      </div>
    </>
  );
};

export default Group;
