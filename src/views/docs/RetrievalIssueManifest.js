import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import FormControl from '@mui/material/FormControl';
import Tabs from '@mui/material/Tabs';
import 'react-tabs/style/react-tabs.css';
import { FaTrash } from "react-icons/fa";
import React from 'react';
import {
  Button,
  Tab,
  Box,
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
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import RIMpdf from './RIMpdf';

const RetrievalIssueManifest = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [bankName, setBankName] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedhsn, setSelectedhsn] = useState(null);
  const [kitQty, setKitQty] = useState('');
  const [open, setOpen] = useState(false);
  const [allKitId, setAllKitId] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [allHsnSacCode, setAllHsnSacCode] = useState([]);
  const [receiverDetails, setReceiverDetails]  = useState([]);
  const [allTransporters, setAllTransporters] = useState([]);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    dispatchType: null,
    transactionType: 'RETRIEVAL DOCKET',
    sender: '',
    senderAddress: '',
    senderGst: '',
    receiverWarehouse: '',
    receiverAddress: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: ''
  });

  const [formDataErrors, setFormDataErrors] = useState({
    docId: '',
    docDate: dayjs(),
    dispatchType: null,
    transactionType: 'Retrieval Docket',
    sender: '',
    senderAddress: '',
    senderGst: '',
    receiverWarehouse: '',
    transporterName: '',
    vehicleNo: '',
  });

  const [detailsKitData, setDetailsKitData] = useState([]);

  const [detailsKitErrors, setDetailsKitErrors] = useState([
    {
      id: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      asset: '',
      assetCode: '',
      assetQty: ''
    }
  ]);

  useEffect(() => {
    getAllRetrievalManifestProvider();
    getAllCustomerDetails();
    getAllServiceAccountCode();
    getAllKitDetails();
    getAllReceiverDetails();
    getAllTransporters();
  }, []);

  const getAllRetrievalManifestProvider = async () => {
    try {
      const result = await apiCalls('get', `/reportController/getAllRetrievalManifestProvider`);
      setData(result.paramObjectsMap.retrievalManifestProviderVOs.reverse() || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      setCustomerDetails(response.paramObjectsMap.warehouseVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
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

  const getAllKitDetails = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getKitByOrgId?orgid=${orgId}`);
      setAllKitId(result.paramObjectsMap.kitVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllReceiverDetails = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      setReceiverDetails(response.paramObjectsMap.warehouseVO);

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
  const handleClear = () => {
    setFormData({
      docId: '',
      dispatchType: null,
      transactionType: 'Retrieval Docket',
      sender: '',
      senderAddress: '',
      senderGst: '',
      receiverWarehouse: '',
      receiverAddress: '',
      transporterName: '',
      vehicleNo: '',
      driverNo: ''
    });

    setFormDataErrors([]);

    setDetailsKitData([]);
    setDetailsKitErrors([
      {
        kitName: '',
        kitQty: '',
        hsnsacCode: '',
        asset: '',
        assetCode: '',
        assetQty: ''
      }
    ]);

    // setValidationErrors({});
    setEditId('');
    // getNewBankDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Uppercase only for free text input types
    const newValue = type === 'text' || type === 'textarea' || typeof type === 'undefined'
      ? value.toUpperCase()
      : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue
    }));
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { accessorKey: 'sender', header: 'Sender', size: 140 },
    { accessorKey: 'transactionNo', header: 'Transaction No', size: 140 },
    { accessorKey: 'transactionDate', header: 'Transaction Date', size: 140 },
  ];

  const handleList = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    let detailsTableDataValid = true;
    if (!formData.docId) errors.docId = 'Transaction No is required';
    if (!formData.docDate) errors.docDate = 'Transaction Date is required';
    if (!formData.dispatchType) errors.dispatchType = 'Dispatch Date is required';
    if (!formData.sender) errors.sender = 'Sender is required';
    if (!formData.senderAddress) errors.senderAddress = 'Sender Address is required';
    if (!formData.senderGst) errors.senderGst = 'Sender GST is required';
    if (!formData.receiverWarehouse) errors.receiverWarehouse = 'Receiver Warehouse is required';
    if (!formData.receiverAddress) errors.receiverAddress = 'Receiver Address is required';
    if (!formData.transporterName) errors.transporterName = 'Transporter Name is required';

    // === DETAILS TABLE VALIDATION ===
    if (!detailsKitData || detailsKitData.length === 0) {
      detailsTableDataValid = false;
      setDetailsKitErrors([{ general: 'Details table data is required' }]);
    } else {
      const newTableErrors = detailsKitData.map((row) => {
        const rowErrors = {};
        if (!row.kitNo) {
          rowErrors.kitNo = 'Kit is required';
          detailsTableDataValid = false;
        }
        if (!row.kitQty) {
          rowErrors.kitQty = 'Kit Qty is required';
          detailsTableDataValid = false;
        }
        if (!row.hsnsacCode) {
          rowErrors.hsnsacCode = 'HSN Code is required';
          detailsTableDataValid = false;
        }
        return rowErrors;
      });
      setDetailsKitErrors(newTableErrors);
    }
    setFormDataErrors(errors);
console.log("errors",detailsKitErrors,errors);
    if (Object.keys(errors).length === 0 && detailsTableDataValid) {
      setIsLoading(true);
      const retrievalManifestProviderDetailsVo = detailsKitData.map((row) => ({
        ...(editId && { id: row.id }),
        asset: row.productName,
        assetCode: row.productCode,
        assetQty: parseInt(row.productQty),
        hsnCode: parseInt(row.hsnsacCode),
        kitId: row.kitNo,
        kitName: row.kitName,
        kitQty: parseInt(row.kitQty),
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        createdBy: loginUserName,
        dispatchDate: formData.dispatchType ? dayjs(formData.dispatchType).format('YYYY-MM-DD') : null,
        driverPhoneNo: formData.driverNo,
        orgId: parseInt(orgId),
        receiver: formData.receiverWarehouse,
        receiverAddress: formData.receiverAddress,
        retrievalManifestProviderDetailsDTO: retrievalManifestProviderDetailsVo,
        sender: formData.sender,
        senderAddress: formData.senderAddress,
        senderGst: formData.senderGst,
        transactionDate: formData.docDate ? dayjs(formData.docDate).format('YYYY-MM-DD') : null,
        transactionNo: formData.docId,
        transactionType: formData.transactionType,
        transporterName: formData.transporterName,
        vechileNo: formData.vehicleNo
      };

      try {
        const response = await apiCalls('put', '/reportController/createUpdateRetrievalManifest', saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Retrieval Issue Manifest updated successfully' : 'Retrieval Issue Manifest created successfully');
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Retrieval Issue Manifest creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Retrieval Issue Manifest creation failed');
      }

      setIsLoading(false);
    }
  };

  const getReconcileById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/reportController/getRetrievalManifestProviderById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.retrievalManifestProviderVO;
        setEditId(row.original.id);

        // Set form data
        setFormData({
          docId: listValueVO.transactionNo || '',
          docDate: listValueVO.transactionDate || dayjs(),
          dispatchType: listValueVO.dispatchDate || null,
          transactionType: listValueVO.transactionType || 'Retrieval Docket',
          sender: listValueVO.sender || '',
          senderAddress: listValueVO.senderAddress || '',
          senderGst: listValueVO.senderGst || '',
          receiverWarehouse: listValueVO.receiver || '',
          receiverAddress: listValueVO.receiverAddress || '',
          transporterName: listValueVO.transporterName || '',
          vehicleNo: listValueVO.vehicleeNo || '',
          driverNo: listValueVO.driverPhoneNo || '',
          retrievalManifestProviderDetailsVOs: listValueVO.retrievalManifestProviderDetailsVOs
        });
        setDetailsKitData(
          listValueVO.retrievalManifestProviderDetailsVOs.map((row) => ({
            id: row.id,
            kitNo: row.kitId,
            kitName: row.kitName,
            kitQty: row.kitQty,
            hsnsacCode: row.hsnCode,
            productCode: row.assetCode,
            productName: row.asset,
            productQty: row.assetQty
          }))
        );
        console.log('Edited', detailsKitData);
      } else {
        console.error('No result returned from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const totalDepositAmt = detailsKitData.reduce((sum, row) => sum + Number(row.deposit || 0), 0);
    const totalWithdrawalAmt = detailsKitData.reduce((sum, row) => sum + Number(row.withdrawal || 0), 0);

    setFormData((prev) => ({
      ...prev,
      totalDeposit: totalDepositAmt,
      totalWithdrawal: totalWithdrawalAmt
    }));
  }, [detailsKitData]);
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
  }));
  setDetailsKitData((prev) => [...prev, ...newKitRows]);
  setOpen(false);
  setSelectedKit(null);
  setSelectedhsn(null);
  setKitQty('');
};
const groupedData = detailsKitData.reduce((acc, row) => {
  const kitKey = row.kitNo;
  if (!acc[kitKey]) acc[kitKey] = [];
  acc[kitKey].push(row);
  return acc;
}, {});
const GeneratePdf = async (row) => {
  try {
    const result = await apiCalls('get', `/reportController/getRetrievalManifestProviderById?id=${row.original.id}`);
    const RIMVO = result.paramObjectsMap.retrievalManifestProviderVO;
    if (RIMVO) {
      setPdfData(RIMVO);
      setDownloadPdf(true);
    } else {
      showToast('error', 'Record is Incomplete Please fill needed Data');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    showToast('error', 'Failed to fetch data for PDF');
  }
};
  const handleAddRow = () => {
    setSelectedKit(null);
    setKitQty('');
    setOpen(true);
  };
const handleDeleteKit = (kitNoToDelete) => {
  const updatedKits = detailsKitData.filter((row) => row.kitNo !== kitNoToDelete);
  setDetailsKitData(updatedKits);
};
  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end p-2">
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>
        </div>

        {/* Form Section */}
        {showForm ? (
          <>
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Transaction No"
                  size="small"
                  value={formData.docId}
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, docId: e.target.value.toUpperCase() })}
                  error={!!formDataErrors.docId}
                  helperText={formDataErrors.docId}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Transaction Date"
                      fullWidth
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      value={formData.docDate ? dayjs(formData.docDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Dispatch Date"
                    format="DD-MM-YYYY"
                    value={formData.dispatchType ? dayjs(formData.dispatchType) : null}
                    onChange={(newValue) => setFormData({ ...formData, dispatchType: newValue })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!formDataErrors.dispatchType,
                        helperText: formDataErrors.dispatchType || ''
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Transaction Type"
                  size="small"
                  value={formData.transactionType}
                  fullWidth
                  // disabled
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={customerDetails}
                  getOptionLabel={(option) => option.name || ''}
                  sx={{ width: '100%' }}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  size="small"
                  value={formData.sender ? customerDetails.find((c) => c.name === formData.sender) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'sender', value: newValue ? newValue.name : ''
                      }
                    });
                    // const address = newValue?.partyAddressVO?.[0];
                    // const fullAddress = address
                    //   ? [address.addressLine1, address.addressLine2, address.addressLine3]
                    //     .filter(Boolean)
                    //     .join(', ')
                    //   : '';
                    handleInputChange({
                      target: {
                        name: 'senderAddress',
                        value: newValue ? newValue.address : ''
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'senderGst',
                        value: newValue ? newValue.gst : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sender"
                      name="sender"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                      error={!!formDataErrors.sender}
                      helperText={formDataErrors.sender}
                    />
                  )}
                />
              </div>
              <div className="col-lg-3 col-md-6 mb-2">
                <TextField
                  label="Sender Address"
                  size="small"
                  disabled
                  fullWidth
                  value={formData.senderAddress}
                  multiline={formData.senderAddress.includes('\n') || formData.senderAddress.length > 50}
                  minRows={
                    formData.senderAddress.includes('\n') || formData.senderAddress.length > 50 ? 2 : 1
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, senderAddress: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Sender's GST"
                  value={formData.senderGst}
                  size="small"
                  fullWidth
                  disabled
                  onChange={(e) => setFormData({ ...formData, senderGst: e.target.value })}
                />
              </div>
                <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={receiverDetails}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id} // ✅ Add this line
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    formData.receiverWarehouse
                      ? receiverDetails.find((c) => c.name === formData.receiverWarehouse)
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'receiverWarehouse',
                        value: newValue ? newValue.name : ''
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'receiverAddress',
                        value: newValue ? newValue.address : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Receiver Warehouse"
                      name="receiverWarehouse"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                      error={!!formDataErrors.receiverWarehouse}
                      helperText={formDataErrors.receiverWarehouse}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Warehouse Address"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  size="small"
                  fullWidth
                  onChange={(e) =>
                    setFormData({ ...formData, receiverAddress: e.target.value })
                  }
                  disabled
                  multiline={
                    !!formData.receiverAddress &&
                    (formData.receiverAddress.includes('\n') || formData.receiverAddress.length > 50)
                  }
                  minRows={
                    !!formData.receiverAddress &&
                      (formData.receiverAddress.includes('\n') || formData.receiverAddress.length > 50)
                      ? 2
                      : 1
                  }
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
                  label="Vehicle No"
                  value={formData.vehicleNo}
                  size="small"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Driver No"
                  value={formData.driverNo}
                  type="text"
                  size="small"
                  fullWidth
                  inputProps={{
                    maxLength: 10,
                    inputMode: 'numeric', // mobile-friendly numeric keypad
                    pattern: '[0-9]*'      // enforce digits only
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setFormData({ ...formData, driverNo: value });
                      setFormDataErrors({ ...formDataErrors, driverNo: '' });
                    } else {
                      setFormDataErrors({ ...formDataErrors, driverNo: 'Enter up to 10 digits only' });
                    }
                  }}
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
          <CommonListViewTable data={data && data} columns={columns} blockEdit={true} toEdit={getReconcileById} isPdf={true} GeneratePdf={GeneratePdf} />
        )}
        {downloadPdf && <RIMpdf row={pdfData} modalClose={() => setDownloadPdf(false)} />}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default RetrievalIssueManifest;
