import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { toWords } from 'number-to-words';
import { FormControl } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from "react-icons/fa";
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import MIMpdf from './MIMpdf';

export const MaterialIssueManifest = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [mimById, setMIMById] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [allReceiver, setAllReceiver] = useState([]);
  const [allWarehouse, setAllWarehouse] = useState([]);
  const [allKitId, setAllKitId] = useState([]);
  const [allHsnSacCode, setAllHsnSacCode] = useState([]);
  const [allTransporters, setAllTransporters] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState('');
  const [data, setData] = useState(true);
  const [value, setValue] = useState(0);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedhsn, setSelectedhsn] = useState(null);
  const [kitQty, setKitQty] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    orgId: orgId,
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: 'ISSUE DOCKET',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerName: '',
    locationUnit:'',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: '',
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerName: '',
    locationUnit:'',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: '',
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
  });
  const [detailsTableData, setDetailsTableData] = useState([]);

  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '',
      actualQty: ''
    }
  ]);

  const listViewColumns = [
    { accessorKey: 'transactionNo', header: 'Transaction No', size: 140 },
    { accessorKey: 'transactionDate', header: 'Transaction Date', size: 140 },
    { accessorKey: 'dispatchDate', header: 'Dispatch Date', size: 140 },
    { accessorKey: 'receiver', header: 'Receiver', size: 140 },
    { accessorKey: 'transporterName', header: 'Transporter Name', size: 140 },
  ];
  useEffect(() => {
    getAllServiceAccountCode();
    getAllCustomerDetails();
    getAllReceiverDetails();
    getAllKitDetails();
    getAllTransporters();
    getAllManifestByOrgId();
  }, []);

  const handleClear = () => {
    setFormData({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: 'ISSUE DOCKET',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    locationUnit:'',
    customerName: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: 0,
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    locationUnit:'',
    customerName: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: 0,
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
    });
    setDetailsTableData([]);
    setDetailsTableErrors([{
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '',
      actualQty: ''
    }]);
    setEditId('');

  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddRow = () => {
    setSelectedKit(null);
    setKitQty('');
    setOpen(true);
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));
    if (name === 'amount') {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        formData.amountInWords = toWords(numericValue).replace(/,/g, '').toLocaleUpperCase();
      } else {
        formData.amountInWords = '';
      }
    }
    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
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
  const getAllServiceAccountCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllActiveSacCodeByOrgId?orgId=${orgId}`);
      setAllHsnSacCode(result.paramObjectsMap.hSNSacCodeVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };
const getAllReceiverDetails = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      setAllWarehouse(response.paramObjectsMap.warehouseVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllKitDetails = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getKitByOrgId?orgid=${orgId}`);
      setAllKitId(result.paramObjectsMap.kitVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllCustomers?orgId=${orgId}`);
      setAllReceiver(response.paramObjectsMap.masterVOs);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllTransporters = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllTransporters?orgid=${orgId}`);
      setAllTransporters(response.paramObjectsMap.partyTypeVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllManifestByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/reportController/getAllIssueManifestProvider?orgId=${orgId}&finYear=${finYear}`);
      setData(result.paramObjectsMap.IssueManifestProviderVO.reverse() || []);
      console.log('bankingDepositVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };
const handleDeleteKit = (kitNoToDelete) => {
  const updatedKits = detailsTableData.filter((row) => row.kitNo !== kitNoToDelete);
  setDetailsTableData(updatedKits);
};
  const getAllMIMById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/reportController/getAllIssueManifestProviderById?id=${row.original.id}`);
      if (result) {
        const MIMVO = result.paramObjectsMap.IssueManifestProviderVO;
        setEditId(row.original.id);
        setMIMById(result.paramObjectsMap.IssueManifestProviderVO);
        setPdfData(result.paramObjectsMap.IssueManifestProviderVO);
        // setDownloadPdf(true);
        setFormData({
          transactionNo: MIMVO.transactionNo,
          transactionDate: MIMVO.transactionDate ? dayjs(MIMVO.transactionDate, 'YYYY-MM-DD') : dayjs(),
          dispatchDate: MIMVO.dispatchDate ? dayjs(MIMVO.dispatchDate, 'YYYY-MM-DD') : dayjs(),
          transactionType: MIMVO.transactionType,
          fromWarehouse: MIMVO.fromWarehouse,
          warehouseAddress: MIMVO.warehouseAddress,
          locationUnit: MIMVO.locationUnit,
          customer: MIMVO.receiver,
          customerName: MIMVO.receiverName,
          customerAddress: MIMVO.receiverAddress,
          receiverRegIn: MIMVO.receiverGst,
          amountInWords: MIMVO.amountInWords,
          amount: MIMVO.amount,
          transporterName: MIMVO.transporterName,
          orgId: MIMVO.orgId,
          vehicleNo: MIMVO.vehicleNo,
          driverNo: MIMVO.driverPhoneNo,
          createdBy: MIMVO.createdBy,
        });
        setDetailsTableData(
          MIMVO.issueManifestProviderDetailsVOs.map((row) => ({
            id: row.id,
            kitNo: row.kitId,
            kitName: row.kitName,
            kitQty: row.kitQty,
            hsnsacCode: row.hsnCode,
            productCode: row.assetCode,
            productName: row.asset,
            productQty: row.assetQty,
            actualQty: row.actualQty,
          }))
        );
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
const GeneratePdf = async (row) => {
  try {
    const result = await apiCalls('get', `/reportController/getAllIssueManifestProviderById?id=${row.original.id}`);
    const MIMVO = result.paramObjectsMap.IssueManifestProviderVO;
    if (MIMVO) {
      setPdfData(MIMVO);
      setDownloadPdf(true);
    } else {
      showToast('error', 'Record is Incomplete Please fill needed Data');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    showToast('error', 'Failed to fetch data for PDF');
  }
};
  const handleSave = async () => {
    const errors = {};
    if (!formData.transactionNo) {
      errors.transactionNo = 'Transaction No is required';
    }
    if (!formData.dispatchDate) {
      errors.dispatchDate = 'Dispatch Date is required';
    }
    if (!formData.fromWarehouse) {
      errors.fromWarehouse = 'Warehouse is required';
    }
    if (!formData.customer) {
      errors.customer = 'Customer is required';
    }
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    }
    // if (!formData.transporterName) {
    //   errors.transporterName = 'Transporter Name is required';
    // }
    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.kitNo) {
        rowErrors.kitNo = 'Kit No is required';
        detailTableDataValid = false;
      }
      if (!row.hsnsacCode) {
        rowErrors.hsnsacCode = 'HSN/SAC is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    }); 
    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);
    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const materialIssueVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        kitId: row.kitNo,
        kitName: row.kitName,
        kitQty: row.kitQty,
        hsnCode: row.hsnsacCode,
        assetCode: row.productCode,
        asset: row.productName,
        assetQty: row.productQty,
        actualQty: row.actualQty,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        // active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        active: true,
        issueManifestProviderDetailsDTO: materialIssueVO,
        transactionNo: formData.transactionNo,
        transactionDate: dayjs(formData.transactionDate).format('YYYY-MM-DD'),
        dispatchDate: dayjs(formData.dispatchDate).format('YYYY-MM-DD'),
        transactionType: formData.transactionType,
        fromWarehouse: formData.fromWarehouse,
        warehouseAddress: formData.warehouseAddress,
        locationUnit: formData.locationUnit,
        receiver: formData.customer,
        receiverName: formData.customerName,
        receiverAddress: formData.customerAddress,
        receiverGst: formData.receiverRegIn,
        sender: companyName,
        amount: parseInt(formData.amount),
        amountInWords: formData.amountInWords,
        transporterName: formData.transporterName,
        vehicleNo: formData.vehicleNo,
        driverPhoneNo: formData.driverNo
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/reportController/createUpdateIssuemanifest`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Material Issue Manifest Updated Successfully' : 'Material Issue Manifest Created successfully');
          getAllManifestByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Material Issue Manifest creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Material Issue Manifest creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
const handleProceed = () => {
  if (!selectedKit || !selectedhsn || !kitQty) return;

  const kitAssets = selectedKit.kitAssetVO || [];
  const timestamp = Date.now();

  const newKitRows = kitAssets.map((asset, idx) => ({
    id: timestamp + idx,
    kitNo: selectedKit.kitNo,
    kitName: selectedKit.kitDesc, 
    kitQty: parseFloat(kitQty),  
    hsnsacCode: selectedhsn.code || '',
    productCode: asset.assetCodeId || '',
    productName: asset.assetName || '',
    productQty: (asset.quantity || 0) * (parseFloat(kitQty) || 0),
    actualQty: (asset.quantity || 0) * (parseFloat(kitQty) || 0),
  }));
  setDetailsTableData((prev) => [...prev, ...newKitRows]);
  setOpen(false);
  setSelectedKit(null);
  setSelectedhsn(null);
  setKitQty('');
};
const groupedData = detailsTableData.reduce((acc, row) => {
  const kitKey = row.kitNo;
  if (!acc[kitKey]) acc[kitKey] = [];
  acc[kitKey].push(row);
  return acc;
}, {});
const handleProductQtyChange = (value, kitIndex, rowIndex) => {
  const groupedEntries = Object.entries(groupedData);
  const currentKitRows = groupedEntries[kitIndex]?.[1];
  if (currentKitRows && currentKitRows[rowIndex]) {
    const rowId = currentKitRows[rowIndex].id;
    const updatedData = detailsTableData.map((item) =>
      item.id === rowId ? { ...item, actualQty: Number(value) } : item
    );
    setDetailsTableData(updatedData);
  }
};
  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField id="transactionNo" label="Transaction No" onChange={handleInputChange} variant="outlined" size="small" fullWidth name="transactionNo" value={formData.transactionNo} />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Transaction Date"
                        value={formData.transactionDate}
                        onChange={(date) => handleDateChange('transactionDate', date)}
                        // disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Dispatch Date"
                        value={formData.dispatchDate}
                        onChange={(date) => handleDateChange('dispatchDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="transactionType"
                    label="Transaction Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.transactionType ? fieldErrors.transactionType : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.transactionType}
                  />
                </div>

                <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={allWarehouse}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id} // ✅ Add this line
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    formData.fromWarehouse
                      ? allWarehouse.find((c) => c.name === formData.fromWarehouse)
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'fromWarehouse',
                        value: newValue ? newValue.name : ''
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'locationUnit',
                        value: newValue ? newValue.locationUnit : ''
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'warehouseAddress',
                        value: newValue ? newValue.address : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Warehouse"
                      name="fromWarehouse"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                      error={!!fieldErrors.fromWarehouse}
                      helperText={fieldErrors.fromWarehouse}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Warehouse Address"
                  value={formData.warehouseAddress}
                  size="small"
                  fullWidth
                  disabled
                  multiline={
                    !!formData.warehouseAddress &&
                    (formData.warehouseAddress.includes('\n') || formData.warehouseAddress.length > 50)
                  }
                  minRows={
                    !!formData.warehouseAddress &&
                      (formData.warehouseAddress.includes('\n') || formData.warehouseAddress.length > 50) ? 2 : 1
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, warehouseAddress: e.target.value })
                  }
                />
              </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={allReceiver}
                    getOptionLabel={(option) => option.partyShortName || ''}
                    isOptionEqualToValue={(option, value) => option?.partyShortName === value?.customer}
                    value={
                      formData.customer
                        ? allReceiver.find((c) => c.partyShortName === formData.customer)
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customer',
                          value: newValue ? newValue.partyShortName : ''
                        }
                      });
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.partyName : ''
                        }
                      });
                      const address = newValue?.partyAddressVO?.[0];
                      const fullAddress = address
                        ? [address.addressLine1, address.addressLine2, address.addressLine3].filter(Boolean).join(', ')
                        : '';
                      handleInputChange({
                        target: {
                          name: 'customerAddress',
                          value: fullAddress
                        }
                      });
                      handleInputChange({
                        target: {
                          name: 'receiverRegIn',
                          value: newValue ? newValue.gstIn : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="customer"
                        label="Receiver"
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
              </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerAddress"
                    label="Receiver Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerAddress ? fieldErrors.customerAddress : ''}</span>}
                    disabled
                    multiline
                    error={!!fieldErrors.customerAddress}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="receiverRegIn"
                    label="Receiver Reg In"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="receiverRegIn"
                    value={formData.receiverRegIn}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.receiverRegIn ? fieldErrors.receiverRegIn : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                    error={!!fieldErrors.receiverRegIn}
                    disabled
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="sender"
                    label="Sender"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sender"
                    disabled
                    value={companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="amount"
                    type='number'
                    label="Amount"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.amount ? fieldErrors.amount : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.amount}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="amountInWords"
                    label="Amount In Words"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="amountInWords"
                    value={formData.amountInWords}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="col-md-3 mb-3">
                <Autocomplete
                  options={allTransporters}
                  getOptionLabel={(option) => option.partyName || ''}
                  isOptionEqualToValue={(option, value) => option?.transporterName === value?.transporterName}
                  value={
                    formData.transporterName
                      ? allTransporters.find((c) => c.partyName === formData.transporterName)
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'transporterName',
                        value: newValue ? newValue.partyName : ''
                      }
                    });
                  }}
                  sx={{ width: '100%' }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name= "transporterName"
                      label= "Transporter Name"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="vehicleNo"
                    label= "Vehicle No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.vehicleNo ? fieldErrors.vehicleNo : ''}</span>}
                    // inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.vehicleNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="driverNo"
                    label= "Driver No"
                    type='number'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="driverNo"
                    value={formData.driverNo}
                    inputProps={{
                    maxLength: 10,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setFormData({ ...formData, driverNo: value });
                      setFieldErrors({ ...fieldErrors, driverNo: '' });
                    } else {
                      setFieldErrors({ ...fieldErrors, driverNo: 'Enter up to 10 digits only' });
                    }
                  }}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.driverNo ? fieldErrors.driverNo : ''}</span>}
                    error={!!fieldErrors.driverNo}
                  />
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
                      <Tab value={0} label="Kit Details" />
                    </Tabs>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    {value === 0 && (
                      <>
                          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow}>
                            Add Kit
                          </Button>
                          <Dialog open={open} onClose={() => setOpen(false)}>
                            <DialogTitle>Select Kit</DialogTitle>
                            <DialogContent sx={{ minWidth: 400 }}>
                              <Autocomplete
                                options={allKitId}
                                getOptionLabel={(option) => option.kitNo || ''}
                                value={selectedKit}
                                onChange={(e, newValue) => setSelectedKit(newValue)}
                                renderInput={(params) => <TextField {...params} label="Kit No" margin="dense" fullWidth />}
                              />
                              <TextField
                                label="Kit Name"
                                margin="dense"
                                fullWidth
                                value={selectedKit?.kitDesc || ''}
                                disabled
                              />
                              <TextField
                                label="Kit Quantity"
                                margin="dense"
                                fullWidth
                                type="number"
                                value={kitQty}
                                onChange={(e) => setKitQty(e.target.value)}
                              />
                              <Autocomplete
                                options={allHsnSacCode}
                                getOptionLabel={(option) => option.code || ''}
                                value={selectedhsn}
                                onChange={(e, newValue) => setSelectedhsn(newValue)}
                                renderInput={(params) => <TextField {...params} label="HSN/SAC" margin="dense" fullWidth />}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                              <Button onClick={handleProceed} color="primary" variant="contained">Proceed</Button>
                            </DialogActions>
                          </Dialog>
                          <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>S.No</TableCell>
                                  <TableCell>Action</TableCell>
                                  <TableCell>Kit No</TableCell>
                                  <TableCell>Kit Name</TableCell>
                                  <TableCell>Kit Qty</TableCell>
                                  <TableCell>HSN/SAC</TableCell>
                                  <TableCell>Product Code</TableCell>
                                  <TableCell>Product Name</TableCell>
                                  <TableCell>Product Qty</TableCell>
                                  <TableCell>Actual Qty</TableCell>
                                </TableRow>
                              </TableHead>
                                <TableBody>
                                  {Object.entries(groupedData).map(([kitNo, kitRows], kitIndex, kitArray) => (
                                    <React.Fragment key={kitNo}>
                                      {kitRows.map((row, rowIndex) => (
                                        <TableRow key={row.id}>
                                          {rowIndex === 0 && (
                                            <>
                                              <TableCell rowSpan={kitRows.length}>{kitIndex + 1}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>
                                              <FaTrash
                                                onClick={() => handleDeleteKit(kitNo)}
                                                style={{ cursor: "pointer", color: "red" }}
                                                className="ms-4"
                                              />
                                              </TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitNo}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitName}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitQty}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.hsnsacCode}</TableCell>
                                            </>
                                          )}

                                          {rowIndex !== 0 && null}

                                          <TableCell>{row.productCode}</TableCell>
                                          <TableCell>{row.productName}</TableCell>
                                          <TableCell>{row.productQty}</TableCell>
                                          <TableCell>
                                          <input
                                            type="number"
                                            value={row.actualQty}
                                            onChange={(e) => handleProductQtyChange(e.target.value, kitIndex, rowIndex)}
                                            style={{ width: "80px" }}
                                            min={0}
                                          />
                                        </TableCell>
                                        </TableRow>
                                      ))}

                                      {/* horizontal line */}
                                      {kitIndex !== kitArray.length - 1 && (
                                        <TableRow>
                                          <TableCell colSpan={8} sx={{ borderBottom: '2px solid #ccc' }} />
                                        </TableRow>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </TableBody>
                            </Table>

                          </TableContainer>
                      </>
                    )}
                  </Box>
                </div>
              </>
            </>
          ) : (
            <CommonListViewTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllMIMById} isPdf={true} GeneratePdf={GeneratePdf} />
          )}
          {downloadPdf && <MIMpdf row={pdfData} modalClose={() => setDownloadPdf(false)} />}
        </div>
      </div>
    </>
  );
};

export default MaterialIssueManifest;
