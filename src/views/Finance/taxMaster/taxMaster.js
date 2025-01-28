import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Autocomplete } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { showToast } from 'utils/toast-component';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toDate } from 'date-fns';

const TaxMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [formValues, setFormValues] = useState({
    active: true,
    finYear: '',
    tax: '',
    taxSlab: 0,
    serviceAccountCode: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    finYear: '',
    tax: '',
    taxSlab: '',
    serviceAccountCode: '',
  });
  const [taxMasterTable, setTaxMasterTable] = useState([{
    sno:'',
    active: true,
    tax: '',
    taxType: '',
    percentage: '',
    type: '',
    fromDate: '',
    toDate: '',
    revenueLedger: '',
    costLedger: '',
}]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([{
    sno:'',
    active: true,
    tax: '',
    taxType: '',
    percentage: '',
    type: '',
    fromDate: '',
    toDate: '',
    revenueLedger: '',
    costLedger: '',
  }]);
  const [finYearList, setFinYearList] = useState([]);
  const [serviceAccountCodeList, setServiceAccountCodeList] = useState([]);
  const [revenueLedgerList, setRevenueLedgerList] = useState([]);
  const [costLedgerList, setCostLedgerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(0);
  useEffect(() => {
    getAllTaxMasterByOrgId();
    getAllFinYear();
    getAllSAC();
    getAllRevenueLedger();
    getAllCostLedger();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getAllFinYear = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/getAllAciveFInYear?orgId=${orgId}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setFinYearList(response.paramObjectsMap.financialYearVOs);
        console.log('fin', response.paramObjectsMap.financialYearVOs);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllSAC = async () => {
    try {
      const response = await apiCalls('get', `master/getServiceAccountCodeForTaxMaster?orgId=${orgId}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setServiceAccountCodeList(response.paramObjectsMap.serviceAccountCode);
        console.log('fin', response.paramObjectsMap.serviceAccountCode);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllRevenueLedger = async () => {
    try {
      const response = await apiCalls('get', `master/getRevenueLegderForTaxMaster?orgId=${orgId}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setRevenueLedgerList(response.paramObjectsMap.accountGroupName);
        console.log('fin', response.paramObjectsMap.accountGroupName);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllCostLedger = async () => {
    try {
      const response = await apiCalls('get', `master/getCostLedgerForTaxMaster?orgId=${orgId}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setCostLedgerList(response.paramObjectsMap.accountGroupName);
        console.log('fin', response.paramObjectsMap.accountGroupName);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const numericRegex = /^[0-9 %]*$/;
    let errorMessage = '';
    switch (name) {
      case 'tax':
        if (!numericRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'taxslab':
        if (!numericRegex.test(value)) {
          errorMessage = 'Invalid Format';
        } else if (value.length > 3) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }
    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormValues({ ...formValues, [name]: checked });
      } else if(type === 'text') {
        setFormValues({ ...formValues, [name]: value.toUpperCase() });
      }
       else {
        setFormValues({ ...formValues, [name]: value });
      }
      setFieldErrors({ ...fieldErrors, [name]: '' });
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
  const columns = [
    { accessorKey: 'finYear', header: 'FinYear', size: 140 },
    { accessorKey: 'serviceAccountCode', header: 'Service Account Code', size: 270 },
    { accessorKey: 'gst', header: 'Tax', size: 140 },
    { accessorKey: 'gstSlab', header: 'Tax Slab', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleClear = () => {
    setEditId('');
    setFormValues({
      finYear: '',
      serviceAccountCode: '',
      active: true,
      tax: '',
      taxSlab: ''
    });
    setTaxMasterTable([{
      sno:'',
      active: true,
      tax: '',
      taxType: '',
      percentage: '',
      type: '',
      fromDate: '',
      toDate: '',
      revenueLedger: '',
      costLedger: '',
    }]);
    setFieldErrors([])
    setDetailsTableErrors([]);
  }; 
  const handleAddRow = () => {
    if (isLastRowEmpty(taxMasterTable)) {
      displayRowError(taxMasterTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      sno:'',
      active: true,
      tax: '',
      taxType: '',
      percentage: '',
      type: '',
      fromDate: '',
      toDate: '',
      revenueLedger: '',
      costLedger: '',
    };
    setTaxMasterTable([...taxMasterTable, newRow]);
    setDetailsTableErrors([...detailsTableErrors, {
      sno:'',
      tax: '',
      taxType: '',
      percentage: '',
      type: '',
      fromDate: '',
      toDate: '',
      revenueLedger: '',
      costLedger: '', 
    }]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === taxMasterTable) {
      return !lastRow.tax || !lastRow.taxType || !lastRow.costLedger || !lastRow.revenueLedger || !lastRow.toDate || !lastRow.fromDate || !lastRow.type || !lastRow.percentage;

    }
    return false;
  };
  const displayRowError = (table) => {
    if (table === taxMasterTable) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          tax: !table[table.length - 1].tax ? 'Tax is required' : '',
          taxType: !table[table.length - 1].taxType ? 'Tax Type is required' : '',
          costLedger: !table[table.length - 1].costLedger ? 'Cost Ledger is required' : '',
          revenueLedger: !table[table.length - 1].revenueLedger ? 'Revenue Ledger is required' : '',
          toDate: !table[table.length - 1].toDate ? 'To Date is required' : '',
          fromDate: !table[table.length - 1].fromDate ? 'From Date is required' : '',
          type: !table[table.length - 1].type ? 'Type is required' : '',
          percentage: !table[table.length - 1].percentage ? 'Percentage is required' : ''
        };
        return newErrors;
      });
    }
  };
  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };
  const handleSave = async () => {
    const errors = {};
    if (!formValues.finYear) {
      errors.finYear = 'Fin Year is required';
    }
    if (!formValues.serviceAccountCode) {
      errors.serviceAccountCode = 'SAC is required';
    }
    if (!formValues.tax) {
      errors.tax = 'Tax is required';
    }
    if (!formValues.taxSlab) {
      errors.taxSlab = 'Tax Slab is required';
    }
    let detailTableDataValid = true;
    const newTableErrors = taxMasterTable.map((row) => {
      const rowErrors = {};
      if (!row.tax) {
        rowErrors.tax = 'Tax is required';
        detailTableDataValid = false;
      }
      if (!row.taxType) {
        rowErrors.taxType = 'Tax Type is required';
        detailTableDataValid = false;
      }
      if (!row.percentage) {
        rowErrors.percentage = 'Percentage is required';
        detailTableDataValid = false;
      }
      if (!row.type) {
        rowErrors.type = 'Type is required';
        detailTableDataValid = false;
      }
      if (!row.fromDate) {
        rowErrors.fromDate = 'From Date is required';
        detailTableDataValid = false;
      }
      if (!row.toDate) {
        rowErrors.toDate = 'To Date is required';
        detailTableDataValid = false;
      }
      if (!row.costLedger) {
        rowErrors.costLedger = 'Cost Ledger is required';
        detailTableDataValid = false;
      }
      if (!row.revenueLedger) {
        rowErrors.revenueLedger = 'Revenue Ledger is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const taxMasterVO = taxMasterTable.map((row) => ({
        ...(editId && { id: row.id }),
        gst: row.tax,
        gstType: row.taxType,
        debit: row.debit,
        percentage: row.percentage,
        taxType: row.type,
        costLedger: row.costLedger,
        revenueLedger: row.revenueLedger,
        toDate: row.toDate ? dayjs(row.toDate).format('YYYY-MM-DD') : null,
        fromDate: row.fromDate ? dayjs(row.toDate).format('YYYY-MM-DD') : null,
        active: row.active
      }));
      const saveformValues = {
        ...(editId && { id: editId }),
        // branch: branch,
        // branchCode: branchCode,
        createdBy: loginUserName,
        finYear: formValues.finYear.toString(),
        orgId: parseInt(orgId),
        taxMasterDetailsDTO: taxMasterVO,
        serviceAccountCode: formValues.serviceAccountCode,
        gst: formValues.tax,
        gstSlab: parseInt(formValues.taxSlab),
        active: formValues.active
      };
      console.log('DATA TO SAVE IS:', saveformValues);
      try {
        const response = await apiCalls('put', `/master/updateCreateTaxMaster`, saveformValues);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Tax Master Updated Successfully' : 'Tax Master Created successfully');
          getAllCostLedger();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Tax Master creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Tax Master creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const getAllTaxMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllTaxMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.taxMasterVO.reverse() || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getTaxMasterById = async (row) => {
    console.log('first', row);
    setEditId(row.original.id);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getAllTaxMasterById?id=${row.original.id}`);
      if (result) {
        const taxMasterVO = result.paramObjectsMap.taxMasterVO[0];
        setEditMode(true);
        setFormValues({
          finYear: taxMasterVO.finYear || '',
          tax: taxMasterVO.gst || '',
          taxSlab: taxMasterVO.gstSlab || '',
          serviceAccountCode: taxMasterVO.serviceAccountCode || '',
          active: taxMasterVO.active || false,
          id: taxMasterVO.id,
          taxMasterDetailsDTO: taxMasterVO.taxMasterDetailsVO || [],
          orgId: orgId
        });
        setTaxMasterTable(
          taxMasterVO.taxMasterDetailsVO.map((tm) => ({
            id: tm.id,
            tax: tm.gst,
            taxType: tm.gstType,
            percentage: tm.percentage,
            type: tm.taxType,
            revenueLedger: tm.revenueLedger,
            costLedger: tm.costLedger,
            toDate: tm.toDate ? dayjs(tm.toDate, 'YYYY-MM-DD') : dayjs(),
            fromDate: tm.fromDate ? dayjs(tm.fromDate, 'YYYY-MM-DD') : dayjs(),
            active: tm.active
          }))
        );
      } else {

      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleList = () => {
    setShowForm(!showForm);
  };
  return (
    <div>
      <ToastContainer />
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.finYear}>
                  <InputLabel id="finYear-label">Fin Year</InputLabel>
                  <Select
                    labelId="finYear-label"
                    id='finYear'
                    label="finYear"
                    value={formValues.finYear}
                    onChange={handleInputChange}
                    name="finYear"
                    // disabled={isEditMode}
                  >
                    {finYearList?.map((row) => (
                      <MenuItem key={row.id} value={row.finYear}>
                        {row.finYear}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.finYear && <FormHelperText>{fieldErrors.finYear}</FormHelperText>}
                </FormControl>
              </div>
            <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.serviceAccountCode}>
                  <InputLabel id="serviceAccountCode">Service Account Code</InputLabel>
                  <Select
                    labelId="Service Account Code"
                    id='serviceAccountCode'
                    label="serviceAccountCode"
                    value={formValues.serviceAccountCode}
                    onChange={handleInputChange}
                    name="serviceAccountCode"
                  >
                    {serviceAccountCodeList?.map((row) => (
                      <MenuItem key={row.id} value={row.serviceAccountCode}>
                        {row.serviceAccountCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.serviceAccountCode && <FormHelperText>{fieldErrors.serviceAccountCode}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="tax"
                    name="tax"
                    label="Tax"
                    size="small"
                    required
                    value={formValues.tax}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.tax}
                    helperText={fieldErrors.tax}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="taxSlab"
                    name="taxSlab"
                    label="Tax Slab"
                    size="small"
                    required
                    value={formValues.taxSlab}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.taxSlab}
                    helperText={fieldErrors.taxSlab}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="active"
                        checked={formValues.active}
                        onChange={handleInputChange}
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Active"
                  />
                </FormGroup>
              </div>
            </div>
            <>
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
                          <div className="row mt-2" style={{width: '100%'}}>
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Tax</th>
                                    <th className="table-header">Tax Type</th>
                                    <th className="table-header">Percentage</th>
                                    <th className="table-header">Type</th>
                                    <th className="table-header">From Date</th>
                                    <th className="table-header">To Date</th>
                                    <th className="table-header">Revenue Ledger</th>
                                    <th className="table-header">Cost Ledger</th>
                                    <th className="table-header">Active</th>
                                  </tr>
                                </thead>
                                  <tbody>
                                    {taxMasterTable.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                taxMasterTable,
                                                setTaxMasterTable,
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
                                            type="number"
                                            value={row.tax}
                                            sx={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^[0-9]*$/; 
                                              if (regex.test(value)) {
                                                setTaxMasterTable((prev) => {
                                                  const updatedData = prev.map((r) =>
                                                    r.id === row.id ? { ...r, tax: value } : r
                                                  );
                                                  return updatedData;
                                                });
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    tax: value ? '' : 'Tax is required'
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    tax: 'Invalid Format'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={
                                              detailsTableErrors[index]?.tax ? 'error form-control' : 'form-control'
                                            }
                                          />
                                          {detailsTableErrors[index]?.tax && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].tax}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.taxType}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^[a-zA-Z\s-/]*$/;
                                              if (regex.test(value)) {
                                                setTaxMasterTable((prev) => {
                                                  const updatedData = prev.map((r) =>
                                                    r.id === row.id ? { ...r, taxType: value } : r
                                                  );
                                                  return updatedData;
                                                });
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    taxType: value ? '' : 'Tax Type is required'
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    taxType: 'Invalid Format'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={
                                              detailsTableErrors[index]?.taxType ? 'error form-control' : 'form-control'
                                            }
                                          />
                                          {detailsTableErrors[index]?.taxType && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].taxType}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.percentage}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setTaxMasterTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, percentage: value } : r))
                                                );
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], percentage: !value ? 'Percentage is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], percentage: 'Invalid Format' };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={detailsTableErrors[index]?.percentage ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.percentage && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].percentage}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.type}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^[a-zA-Z0-9\s-/]*$/;
                                              if (regex.test(value)) {
                                                setTaxMasterTable((prev) => {
                                                  const updatedData = prev.map((r) =>
                                                    r.id === row.id ? { ...r, type: value } : r
                                                  );
                                                  return updatedData;
                                                });
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    type: value ? '' : 'Type is required'
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    type: 'Invalid Format'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={
                                              detailsTableErrors[index]?.type ? 'error form-control' : 'form-control'
                                            }
                                            // sx={{ width: '180px' }}
                                          />
                                          {detailsTableErrors[index]?.type && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].type}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              value={
                                                row.fromDate
                                                  ? dayjs(row.fromDate, 'YYYY-MM-DD').isValid()
                                                    ? dayjs(row.fromDate, 'YYYY-MM-DD')
                                                    : null
                                                  : null
                                              }
                                              slotProps={{
                                                textField: { size: 'small', clearable: true }
                                              }}
                                              format="DD-MM-YYYY"
                                              onChange={(newValue) => {
                                                setTaxMasterTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? { ...r, fromDate: newValue ? newValue.format('YYYY-MM-DD') : null }
                                                      : r
                                                  )
                                                );
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    fromDate: !newValue ? 'From Date is required' : '',
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  className={
                                                    detailsTableErrors[index]?.fromDate
                                                      ? 'error form-control'
                                                      : 'form-control'
                                                  }
                                                />
                                              )}
                                              minDate={row.fromDate ? dayjs(row.fromDate) : dayjs()}
                                              // sx={{ width: '180px' }}
                                            />
                                            {detailsTableErrors[index]?.fromDate && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {detailsTableErrors[index].fromDate}
                                              </div>
                                            )}
                                          </LocalizationProvider>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              value={
                                                row.toDate
                                                  ? dayjs(row.toDate, 'YYYY-MM-DD').isValid()
                                                    ? dayjs(row.toDate, 'YYYY-MM-DD')
                                                    : null
                                                  : null
                                              }
                                              slotProps={{
                                                textField: { size: 'small', clearable: true }
                                              }}
                                              format="DD-MM-YYYY"
                                              onChange={(newValue) => {
                                                setTaxMasterTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? { ...r, toDate: newValue ? newValue.format('YYYY-MM-DD') : null }
                                                      : r
                                                  )
                                                );
                                                setDetailsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    toDate: !newValue ? 'To Date is required' : '',
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  className={
                                                    detailsTableErrors[index]?.toDate
                                                      ? 'error form-control'
                                                      : 'form-control'
                                                  }
                                                />
                                              )}
                                              minDate={row.toDate ? dayjs(row.toDate) : dayjs()}
                                              // sx={{ width: '180px' }}
                                            />
                                            {detailsTableErrors[index]?.toDate && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {detailsTableErrors[index].toDate}
                                              </div>
                                            )}
                                            
                                          </LocalizationProvider>
                                        </td>
                                        <td>
                                          <Autocomplete
                                            options={revenueLedgerList}
                                            getOptionLabel={(option) => option.revenueLedger || ''}
                                            groupBy={(option) => (option.revenueLedger ? option.revenueLedger[0].toUpperCase() : '')}
                                            value={
                                              row.revenueLedger
                                                ? revenueLedgerList.find((a) => a.revenueLedger === row.revenueLedger)
                                                : revenueLedgerList.length === 1
                                                ? revenueLedgerList[0]
                                                : null
                                            }
                                            onChange={(event, newValue) => {
                                              const value = newValue ? newValue.revenueLedger : '';
                                              setTaxMasterTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, revenueLedger: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  revenueLedger: !value ? 'Revenue Ledger is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Revenue Ledger"
                                                variant="outlined"
                                                error={!!detailsTableErrors[index]?.revenueLedger}
                                                helperText={detailsTableErrors[index]?.revenueLedger}
                                              />
                                            )}
                                            // sx={{ width: 150 }}
                                          />
                                        </td>
                                        <td>
                                          <Autocomplete
                                            options={costLedgerList}
                                            getOptionLabel={(option) => option.costLedger || ''}
                                            groupBy={(option) => (option.costLedger ? option.costLedger[0].toUpperCase() : '')}
                                            value={
                                              row.costLedger
                                                ? costLedgerList.find((a) => a.costLedger === row.costLedger)
                                                : costLedgerList.length === 1
                                                ? costLedgerList[0]
                                                : null
                                            }
                                            onChange={(event, newValue) => {
                                              const value = newValue ? newValue.costLedger : '';
                                              setTaxMasterTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, costLedger: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  costLedger: !value ? 'Cost Ledger is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Cost Ledger"
                                                variant="outlined"
                                                error={!!detailsTableErrors[index]?.costLedger}
                                                helperText={detailsTableErrors[index]?.costLedger}
                                              />
                                            )}
                                            // sx={{ width: 150 }}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={row.active}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;

                                              setTaxMasterTable((prev) =>
                                                prev.map((r) =>
                                                  r.id === row.id ? { ...r, active: isChecked } : r 
                                                )
                                              );
                                            }}
                                            name="active"
                                            color="primary"
                                          />
                                        }
                                        label="Active"
                                        sx={{
                                          "& .MuiSvgIcon-root": { color: "#5e35b1" },
                                        }}
                                      />
                                      {detailsTableErrors[index]?.active && (
                                        <div className="mt-2" style={{ color: "red", fontSize: "12px" }}>
                                          {detailsTableErrors[index].active}
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
          </>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getTaxMasterById} />
        )}
      </div>
    </div>
  );
};

export default TaxMaster;
