import { useEffect, useState } from 'react';
import apiCalls from 'apicall';
import ToastComponent, { showToast } from 'utils/toast-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import CommonTable from 'views/basicMaster/CommonTable';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, FormHelperText } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import CommonListViewTable from '../basicMaster/CommonListViewTable';

import axios from 'axios';
export const JobCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [data, setData] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [listView, setListView] = useState(false);
  const [allAccountName, setAllAccountName] = useState([]);
  const [docId, setDocId] = useState('');

  const [timer, setTimer] = useState(null);

  const [listViewData, setListViewData] = useState([]);

  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: '',
      accountName: '',
      amount: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      id: '',
      accountName: '',
      amount: ''
    }
  ]);
  const [formData, setFormData] = useState({
    customer: '',
    customerCode: '',
    operationClosed: '',
    financeClosed: '',
    date: dayjs(),
    salesCategory: 'MANAGEMENT',
    salesPerson: '',
    closedOn: null,
    closed: false,
    income: '',
    expense: '',
    profit: '',
    product: '',
    type: '',
    source: '',
    details: '',
    refNo: '',
    refDate: null,
    remarks: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    customer: '',
    operationClosed: '',
    date: new Date(),
    financeClosed: '',
    salesPerson: '',
    closedOn: null,
    closed: false,
    income: '',
    expense: '',
    profit: '',
    product: '',
    type: '',
    source: '',
    details: '',
    refNo: '',
    refDate: null,
    remarks: ''
  });

  const listViewColumns = [
    { accessorKey: 'jobNo', header: 'Document No', size: 140 },
    { accessorKey: 'customer', header: 'Customer', size: 140 },
    { accessorKey: 'product', header: 'Product', size: 140 },
    { accessorKey: 'date', header: 'Date', size: 140 },
    { accessorKey: 'closedOn', header: 'ClosedOn', size: 140 }
  ];

  useEffect(() => {
    getAllJobCard();
    getAllAccountName();
  }, []);
  const getAllAccountName = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAccountNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllAccountName(response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllJobCard = async () => {
    try {
      const response = await apiCalls('get', `transaction/getAllTmsJobCardByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.jobCardVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllTmsJobCardById = async (row) => {
    console.log('Row selected:', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAllTmsJobCardById?id=${row.original.id}`);
      if (result) {
        const jnVo = result.paramObjectsMap.jobCardVO;
        console.log('DataToEdit', jnVo);
        setEditId(row.original.id);
        setDocId(jnVo.jobNo);
        getSalesPerson(jnVo.customer);
        setFormData({
          customer: jnVo.customer || '',
          customerCode: jnVo.customerCode || '',
          salesPerson: jnVo.salesPerson || '',
          salesCategory: jnVo.salesCategory || '',
          date: jnVo.date ? dayjs(jnVo.date, 'YYYY-MM-DD') : dayjs(),
          income: jnVo.income || '',
          expense: jnVo.expense || '',
          profit: jnVo.profit || '',
          product: jnVo.product || '',
          type: jnVo.type || '',
          source: jnVo.source || '',
          details: jnVo.details || '',
          refNo: jnVo.refNo || '',
          refDate: jnVo.refDate ? dayjs(jnVo.refDate, 'YYYY-MM-DD') : dayjs(),
          closed: jnVo.closedOn ? true : false,
          remarks: jnVo.remarks || '',
          closedOn: jnVo.closedOn ? dayjs(jnVo.closedOn, 'YYYY-MM-DDTHH:mm:ss') : null,
          active: jnVo.active
        });
        setDetailsTableData(
          jnVo.costCenterJobCardVO?.map((row) => ({
            id: row.id,
            accountName: row.accountName,
            amount: row.amount || 0
          })) || []
        );
      } else {
        console.error('No data found for the selected ID');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = async () => {
    setFormData({
      customer: '',
      customerCode: '',
      operationClosed: '',
      financeClosed: '',
      salesCategory: 'MANAGEMENT',
      salesPerson: '',
      closed: false,
      income: '',
      expense: '',
      profit: '',
      product: '',
      type: '',
      source: '',
      details: '',
      refNo: '',
      refDate: null,
      remarks: '',
      date: dayjs(),
      closedOn: null
    });

    setDetailsTableData([
      {
        id: 1,
        accountsName: '',
        amount: ''
      }
    ]);

    setFieldErrors({
      customer: '',
      customerCode: '',
      operationClosed: '',
      financeClosed: '',
      closedOn: null,
      closed: false,
      income: '',
      expense: '',
      profit: '',
      product: '',
      type: '',
      refNo: '',
      refDate: null,
      remarks: ''
    });
    setDetailsTableErrors([{ accountName: '', amount: '' }]);
    setEditId('');

    getTmsJobCardDocId();
    getAllCustomers();
  };
  const handleList = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customer) {
      errors.customer = 'Customer is required';
    }
    // if (!formData.income) {
    //   errors.income = 'Income is required';
    // }
    // if (!formData.expense) {
    //   errors.expense = 'Expense is required';
    // }
    // if (!formData.profit) {
    //   errors.profit = 'Profit is required';
    // }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      // if (!row.accountName) {
      //   rowErrors.accountName = 'Account Name is required';
      //   detailTableDataValid = false;
      // }
      // if (!row.amount) {
      //   rowErrors.amount = 'Amount is required';
      //   detailTableDataValid = false;
      // }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const glOpeningVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountName: row.accountName,
        amount: row.amount
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active || false,
        customer: formData.customer || '',
        customerCode: formData.customerCode || '',
        salesPerson: formData.salesPerson || '',
        salesCategory: formData.salesCategory || '',
        income: formData.income || 0,
        expense: formData.expense || 0,
        profit: formData.profit || 0,
        product: formData.product || '',
        type: formData.type || '',
        remarks: formData.remarks || '',
        refNo: formData.refNo || '',
        refDate: formData.refDate ? dayjs(formData.refDate).format('YYYY-MM-DD') : null,
        source: formData.source || '',
        details: formData.details || '',
        closed: formData.closed,
        // closedOn: formData.closedOn,
        closedOn: formData.closedOn
          ? dayjs(formData.closedOn).format('YYYY-MM-DDTHH:mm:ss') // Format datetime
          : null,
        orgId: orgId,
        branch: branch,
        branchCode: branchCode,
        cancelRemarks: FormDataEvent.cancelRemarks || '',
        createdBy: loginUserName,
        finYear: finYear,
        financeClosed: FormDataEvent.financeClosed || false,
        operationClosed: FormDataEvent.operationClosed || false,
        costCenterTmsJobCardDTO: glOpeningVO
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `transaction/updateCreateTmsJobCard`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Job Card Updated Successfully' : 'Job Card created successfully');
          handleClear();
          setIsLoading(false);
          getAllJobCard();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Job Card creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Job Card creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const getAllJobCardById = async (row) => {
    console.log('first', row);
    setShowForm(true);
  };

  const handleCostTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      costType: type
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      costType: '' // Clear any errors for costType
    }));
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTmsJobCardDocId();
    getAllCustomers();
  }, []);

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      accountName: '',
      amount: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { accountName: '', amount: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.accountName || !lastRow.amount;
    }
    return false;
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

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          accountName: !table[table.length - 1].accountName ? 'Value Code is required' : '',
          amount: !table[table.length - 1].amount ? 'Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const getTmsJobCardDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `transaction/getTmsJobCardDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      if (response.paramObjectsMap?.tmsJobCardDocId) {
        console.log('Fetched docId:', response.paramObjectsMap.tmsJobCardDocId);
        setDocId(response.paramObjectsMap.tmsJobCardDocId);
      } else {
        console.error('No docId found in response');
      }
    } catch (error) {
      console.error('Error fetching docId:', error);
    }
  };

  const getAllCustomers = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAllCustomersFromPartyMaster?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setPartyList(response.paramObjectsMap.customer);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getSalesPerson = async (customerName) => {
    try {
      const response = await apiCalls('get', `/transaction/getSalesPersonFromPartyMaster?orgId=${orgId}&partyName=${customerName}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setSalesPerson(response.paramObjectsMap.salesperson || []); // Make sure salesPerson is set to an array
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'income' || name === 'expense' || name === 'profit') {
      if (isNaN(value) || value === '') {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: 'Invalid format. Only numbers are allowed.'
        }));
        return;
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: '' // Clear error if input is valid
        }));
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'closed' && {
        closedOn: checked ? dayjs().format('YYYY-MM-DD HH:mm:ss') : null
      })
    }));
  };

  // Date change handler for DatePicker
  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({
      ...prevData,
      [field]: formattedDate
    }));
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <TextField
                  id="docId"
                  label="Job No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="docId"
                  value={docId}
                  onChange={handleInputChange}
                  disabled
                  inputProps={{ maxLength: 10 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('date', date)}
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyname || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.customer ? partyList.find((c) => c.partyname === formData.customer) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'customer',
                        value: newValue ? newValue.partyname : ''
                      }
                    });

                    handleInputChange({
                      target: {
                        name: 'customerCode',
                        value: newValue ? newValue.partyCode : ''
                      }
                    });

                    if (newValue) {
                      getSalesPerson(newValue.partyname);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      name="customer"
                      error={!!fieldErrors.customer}
                      helperText={fieldErrors.customer}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.salesPerson}>
                  <InputLabel id="salesPerson">Sales Person</InputLabel>
                  <Select
                    labelId="salesPerson"
                    label="Sales Person"
                    value={formData.salesPerson}
                    onChange={handleInputChange}
                    name="salesPerson"
                  >
                    {salesPerson && salesPerson.length > 0 ? (
                      salesPerson.map((sales, index) => (
                        <MenuItem key={index} value={sales.salesperson}>
                          {sales.salesperson}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No sales person available
                      </MenuItem>
                    )}
                  </Select>
                  {fieldErrors.salesPerson && <FormHelperText>{fieldErrors.salesPerson}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.salesCategory}>
                  <InputLabel id="salesCategory">Sales Category</InputLabel>
                  <Select
                    labelId="AdjustmentType-label"
                    label="salesCategory"
                    value={formData.salesCategory}
                    onChange={handleInputChange}
                    name="salesCategory"
                    disabled
                  >
                    <MenuItem value="MANAGEMENT">MANAGEMENT</MenuItem>
                    {/* <MenuItem value="EXPENSE">EXPENSE</MenuItem> */}
                  </Select>
                  {fieldErrors.salesCategory && <FormHelperText>{fieldErrors.salesCategory}</FormHelperText>}
                </FormControl>
              </div>

              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.adjustmentType}>
                  <InputLabel id="Product">Product</InputLabel>
                  <Select labelId="Product-label" label="Product" value={formData.product} onChange={handleInputChange} name="product">
                    <MenuItem value="SERVICE">SERVICE</MenuItem>
                    <MenuItem value="PRODUCT">PRODUCT</MenuItem>
                    <MenuItem value="PROJECT">PROJECT</MenuItem>
                    <MenuItem value="AMC">AMC</MenuItem>
                    <MenuItem value="STAFFING">STAFFING</MenuItem>
                  </Select>
                  {fieldErrors.product && <FormHelperText>{fieldErrors.product}</FormHelperText>}
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Ref No(PO, WO)"
                    disabled={editId}
                    size="small"
                    inputProps={{ maxLength: 30 }}
                    value={formData.refNo}
                    onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                    error={!!fieldErrors.refNo}
                    // helperText={fieldErrors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ref Date"
                      disabled={editId}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      value={formData.refDate ? dayjs(formData.refDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, refDate: newValue })}
                    />
                  </LocalizationProvider>
                  {fieldErrors.refDate && <FormHelperText style={{ color: 'red' }}>{fieldErrors.refDate}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="source"
                  label="Source"
                  variant="outlined"
                  size="small"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.source}
                  helperText={fieldErrors.source}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="product"
                  label="Product"
                  variant="outlined"
                  size="small"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.product}
                  helperText={fieldErrors.product}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="type"
                  label="Type"
                  variant="outlined"
                  size="small"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.type}
                  helperText={fieldErrors.type}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="details"
                  label="Detail"
                  variant="outlined"
                  size="small"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.details}
                  helperText={fieldErrors.details}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="income"
                  label="Income"
                  variant="outlined"
                  size="small"
                  disabled
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.income}
                  helperText={fieldErrors.income}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="expense"
                  label="Expense"
                  variant="outlined"
                  size="small"
                  disabled
                  name="expense"
                  value={formData.expense}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.expense}
                  helperText={fieldErrors.expense}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="profit"
                  label="Profit"
                  variant="outlined"
                  disabled
                  size="small"
                  name="profit"
                  value={formData.profit}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.profit}
                  helperText={fieldErrors.profit}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="ClosedOn"
                      value={formData.closedOn ? dayjs(formData.closedOn) : null}
                      onChange={(date) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          closedOn: date ? date.format('YYYY-MM-DD HH:mm:ss') : null
                        }))
                      }
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY HH:mm:ss" // Format with date and time
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-1 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.closed}
                        onChange={handleInputChange}
                        name="closed"
                        // sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Closed"
                  />
                </FormGroup>
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  style={{ marginLeft: 30 }}
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>

              <div className="col-md-6 mb-3">
                <div className="d-flex flex-row">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.costType === 'Regular'}
                        onChange={(e) => handleCostTypeChange('Regular')}
                        name="Regular"
                        color="primary"
                        disabled
                      />
                    }
                    label="Operation Closed"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.costType === 'Accrual'}
                        onChange={(e) => handleCostTypeChange('Accrual')}
                        name="Accrual"
                        color="primary"
                        disabled
                      />
                    }
                    label="Finance Closed"
                  />
                </div>
              </div>
            </div>

            <div className="row d-flex">
              <div className="col-md-8">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="remarks"
                    label="Remarks"
                    size="small"
                    name="remarks"
                    value={formData.remarks}
                    multiline
                    minRows={2}
                    inputProps={{ maxLength: 30 }}
                    onChange={handleInputChange}
                    error={!!fieldErrors.remarks}
                    helperText={fieldErrors.remarks}
                  />
                </FormControl>
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
                  <Tab value={0} label="Cost Center" />
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
                        <div className="col-lg-7">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Acount Name
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Amount
                                  </th>
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
                                    {/* <td className="border px-2 py-2">
                                      <Autocomplete
                                        disablePortal
                                        options={allAccountName}
                                        getOptionLabel={(option) => option.accountName}
                                        size="small"
                                        value={row.accountName ? allAccountName.find((a) => a.accountName === row.accountName) : null}
                                        onChange={(event, newValue) => {
                                          const value = newValue ? newValue.accountName : '';
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountName: value } : r))
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Account Name"
                                            variant="outlined"
                                            error={!!detailsTableErrors[index]?.accountName}
                                            helperText={detailsTableErrors[index]?.accountName}
                                            InputProps={{
                                              ...params.InputProps,
                                              className: detailsTableErrors[index]?.accountName ? 'error form-control' : 'form-control',
                                              style: { background: 'white' }
                                            }}
                                          />
                                        )}
                                      />
                                    </td> */}

                                    <td>
                                      <Autocomplete
                                        options={allAccountName}
                                        getOptionLabel={(option) => option.accountName || ''}
                                        groupBy={(option) => (option.accountName ? option.accountName[0].toUpperCase() : '')}
                                        value={row.accountName ? allAccountName.find((a) => a.accountName === row.accountName) : null}
                                        onChange={(event, newValue) => {
                                          const value = newValue ? newValue.accountName : '';
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountName: value } : r))
                                          );
                                          setDetailsTableErrors((prevErrors) =>
                                            prevErrors.map((err, idx) => (idx === index ? { ...err, accountName: '' } : err))
                                          );
                                        }}
                                        size="small"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Account Name"
                                            variant="outlined"
                                            error={!!detailsTableErrors[index]?.accountName}
                                            helperText={detailsTableErrors[index]?.accountName}
                                          />
                                        )}
                                        sx={{ width: 250 }}
                                      />
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.amount}
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          // Allow only numeric input (digits only)
                                          if (/^\d*\.?\d*$/.test(value)) {
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={detailsTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.amount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].amount}
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
        ) : (
          <CommonTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllTmsJobCardById} />
        )}
      </div>
      <div>
        <ToastComponent />
      </div>
    </>
  );
};
export default JobCard;
