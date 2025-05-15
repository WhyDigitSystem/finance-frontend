import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Autocomplete, Box, Grid, Tab, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import 'react-tabs/style/react-tabs.css';
import Select from '@mui/material/Select';
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
  const [allAccountName, setAllAccountName] = useState([]);
  const [allHsnSacCode, setAllHsnSacCode] = useState([]);
  const [kitDetails, setKitDetails] = useState([]);
  const [receiverDetails, setReceiverDetails] = useState([]);
  const [allTransporters, setAllTransporters] = useState([]);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
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

  const [detailsKitData, setDetailsKitData] = useState([
    {
      id: '',
      kitName: '',
      kitQty: '',
      hsnCode: '',
      asset: '',
      assetCode: '',
      assetQty: ''
    }
  ]);

  const [detailsKitErrors, setDetailsKitErrors] = useState([
    {
      id: '',
      kitName: '',
      kitQty: '',
      hsnCode: '',
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
      const response = await apiCalls('get', `/master/getAllCustomers?orgId=${orgId}`);
      setCustomerDetails(response.paramObjectsMap.masterVOs);

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
      setKitDetails(result.paramObjectsMap.kitVO || []);
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

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsKitData)) {
      displayRowError(detailsKitData);
      return;
    }
    const newRow = {
      id: Date.now(),
      kitName: '',
      kitQty: '',
      hsnCode: '',
      asset: '',
      assetCode: '',
      assetQty: ''
    };
    setDetailsKitData([...detailsKitData, newRow]);
    setDetailsKitErrors([
      ...detailsKitErrors,
      {
        kitName: '',
        kitQty: '',
        hsnCode: '',
        asset: '',
        assetCode: '',
        assetQty: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsKitData) {
      return (
        !lastRow.kitName ||
        !lastRow.kitQty ||
        !lastRow.hsnCode ||
        !lastRow.asset ||
        !lastRow.assetCode ||
        !lastRow.assetQty
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsKitErrors) {
      setDetailsKitErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          kitName: !table[table.length - 1].kitName ? 'Kit is required' : '',
          kitQty: !table[table.length - 1].kitQty ? 'Kit QTY is required' : '',
          hsnCode: !table[table.length - 1].hsnCode ? 'HSN Code is required' : '',
          asset: !table[table.length - 1].asset ? 'Product is required' : '',
          assetCode: !table[table.length - 1].assetCode ? 'Product Code is required' : '',
          assetQty: !table[table.length - 1].assetQty ? 'Product QTY is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setFormData({
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

    // Set the table to only have one empty row
    setDetailsKitData([
      {
        id: 1,
        kitName: '',
        kitQty: '',
        hsnCode: '',
        asset: '',
        assetCode: '',
        assetQty: ''
      }
    ]);

    // Reset table errors for just one row
    setDetailsKitErrors([
      {
        kitName: '',
        kitQty: '',
        hsnCode: '',
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
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,

    }));
  };

  const handleDeleteRow = (rowId) => {
    setDetailsKitData((prev) => prev.filter((row) => row.id !== rowId));
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

    // === FORM DATA VALIDATION ===
    if (!formData.docId) errors.docId = 'Transaction ID is required';
    if (!formData.docDate) errors.docDate = 'Transaction Date is required';
    if (!formData.dispatchType) errors.dispatchType = 'Dispatch Date is required';
    if (!formData.sender) errors.sender = 'Sender is required';
    if (!formData.senderAddress) errors.senderAddress = 'Sender Address is required';
    if (!formData.senderGst) errors.senderGst = 'Sender GST is required';
    if (!formData.receiverWarehouse) errors.receiverWarehouse = 'Receiver Warehouse is required';
    if (!formData.receiverAddress) errors.receiverAddress = 'Receiver Address is required';
    if (!formData.transporterName) errors.transporterName = 'Transporter Name is required';
    if (!formData.vehicleNo) errors.vehicleNo = 'Vehicle No is required';
    if (!formData.driverNo) errors.driverNo = 'Driver No is required';

    // === DETAILS TABLE VALIDATION ===
    if (!detailsKitData || detailsKitData.length === 0) {
      detailsTableDataValid = false;
      setDetailsKitErrors([{ general: 'Details table data is required' }]);
    } else {
      const newTableErrors = detailsKitData.map((row) => {
        const rowErrors = {};
        if (!row.kitName) {
          rowErrors.kitName = 'Kit Name is required';
          detailsTableDataValid = false;
        }
        if (!row.kitQty) {
          rowErrors.kitQty = 'Kit Qty is required';
          detailsTableDataValid = false;
        }
        if (!row.hsnCode) {
          rowErrors.hsnCode = 'HSN Code is required';
          detailsTableDataValid = false;
        }
        if (!row.asset) {
          rowErrors.asset = 'Asset is required';
          detailsTableDataValid = false;
        }
        if (!row.assetCode) {
          rowErrors.assetCode = 'Asset Code is required';
          detailsTableDataValid = false;
        }
        if (!row.assetQty) {
          rowErrors.assetQty = 'Asset Qty is required';
          detailsTableDataValid = false;
        }
        return rowErrors;
      });

      setDetailsKitErrors(newTableErrors);
    }

    setFormDataErrors(errors); // set error state (use this in your form fields)

    // === ONLY SUBMIT IF VALID ===
    if (Object.keys(errors).length === 0 && detailsTableDataValid) {
      setIsLoading(true);

      const retrievalManifestProviderDetailsVo = detailsKitData.map((row) => ({
        ...(editId && { id: row.id }),
        asset: row.asset,
        assetCode: row.assetCode,
        assetQty: parseInt(row.assetQty),
        hsnCode: parseInt(row.hsnCode),
        kitId: row.kitCode,
        kitName: row.kitName,
        kitQty: parseInt(row.kitQty),
        bankRef: row.bankRef
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
          warehouseAddress: listValueVO.receiverAddress || '',
          transporterName: listValueVO.transporterName || '',
          vehicleNo: listValueVO.vehicleeNo || '',
          driverNo: listValueVO.driverPhoneNo || '',
          retrievalManifestProviderDetailsVOs: listValueVO.retrievalManifestProviderDetailsVOs
        });

        setDetailsKitData(
          (listValueVO.retrievalManifestProviderDetailsVOs || []).map((cl, index) => ({
            id: cl.id || `${Date.now()}-${index}`,
            kitName: cl.kitName || '',
            kitQty: cl.kitQty || '',
            hsnCode: cl.hsnCode || '',
            asset: cl.asset || '',
            assetCode: cl.assetCode || '',
            assetQty: cl.assetQty || ''
          }))
        );

        console.log('DataToEdit', listValueVO);
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
                  onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
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
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Dispatch Date"
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      value={formData.dispatchType ? dayjs(formData.dispatchType) : null}
                      onChange={(newValue) => setFormData({ ...formData, dispatchType: newValue })}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Transaction Type"
                  size="small"
                  value={formData.transactionType}
                  fullWidth
                  disabled
                  required
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={customerDetails.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyShortName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.sender ? customerDetails.find((c) => c.partyShortName === formData.sender) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'sender', value: newValue ? newValue.partyShortName : ''
                      }
                    });

                    const address = newValue?.partyAddressVO?.[0];
                    const fullAddress = address
                      ? [address.addressLine1, address.addressLine2, address.addressLine3]
                        .filter(Boolean)
                        .join(', ')
                      : '';
                    handleInputChange({
                      target: {
                        name: 'senderAddress',
                        value: fullAddress
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'senderGst',
                        value: newValue ? newValue.gstIn : ''
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

              {/* <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={receiverDetails.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.locationName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.receiverWarehouse ? receiverDetails.find((c) => c.locationName === formData.receiverWarehouse) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'receiverWarehouse', value: newValue ? newValue.locationName : ''
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
              </div> */}
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={receiverDetails.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.locationName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={
                    formData.receiverWarehouse
                      ? receiverDetails.find((c) => c.locationName === formData.receiverWarehouse)
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'receiverWarehouse',
                        value: newValue ? newValue.locationName : '',
                      },
                    });

                    // ✅ Correct address assignment
                    const fullAddress = newValue?.address || '';
                    handleInputChange({
                      target: {
                        name: 'warehouseAddress',
                        value: fullAddress,
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Receiver Warehouse"
                      name="receiverWarehouse"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 },
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
                  name="warehouseAddress"
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
                      (formData.warehouseAddress.includes('\n') || formData.warehouseAddress.length > 50)
                      ? 2
                      : 1
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={allTransporters.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyShortName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.transporterName ? allTransporters.find((c) => c.partyShortName === formData.transporterName) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'transporterName', value: newValue ? newValue.partyShortName : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="transporterName"
                      label="Transporter Name"
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
                  onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                  error={!!formDataErrors.vehicleNo}
                  helperText={formDataErrors.vehicleNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Driver No"
                  value={formData.driverNo}
                  type='number'
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => setFormData({ ...formData, driverNo: e.target.value })}
                  error={!!formDataErrors.driverNo}
                  helperText={formDataErrors.driverNo}
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
                    <Tab value={0} label="KIT" />
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
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Kit
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '240px' }}>
                                      Kit Qty
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      HSN Code
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Product Code
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Product Name
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                      Product QTY
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(detailsKitData) &&
                                    detailsKitData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                detailsKitData,
                                                setDetailsKitData,
                                                detailsKitErrors,
                                                setDetailsKitErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <Autocomplete
                                            options={kitDetails}
                                            getOptionLabel={(option) => option.kitNo || ''}
                                            value={
                                              kitDetails.find(
                                                (a) => a.kitNo?.toLowerCase().trim() === row.kitNo?.toLowerCase().trim()
                                              ) || null
                                            }
                                            onChange={(event, newValue) => {
                                              setDetailsKitData((prev) =>
                                                prev.map((r) =>
                                                  r.id === row.id
                                                    ? {
                                                      ...r,
                                                      kitNo: newValue?.kitNo || '',
                                                      kitName: newValue?.kitName || '',
                                                      kitId: newValue?.kitId || '',
                                                      kitQty: newValue?.partQty || '',
                                                      assetCode: newValue?.kitAssetVO?.[0]?.assetCodeId || '',
                                                      asset: newValue?.kitAssetVO?.[0]?.assetName || '',
                                                      assetQty: newValue?.kitAssetVO?.[0]?.quantity || '',
                                                    }
                                                    : r
                                                )
                                              );
                                              setDetailsKitErrors((prevErrors) =>
                                                prevErrors.map((err, idx) =>
                                                  idx === index ? { ...err, kitName: '', kitQty: '' } : err
                                                )
                                              );
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                error={!!detailsKitErrors[index]?.kitName}
                                                helperText={detailsKitErrors[index]?.kitName}
                                              />
                                            )}
                                            sx={{ width: 250 }}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.kitQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setDetailsKitData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, kitQty: value } : r))
                                                );
                                                setDetailsKitErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    kitQty: !value ? 'Kik Qty is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setDetailsKitErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    kitQty: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={detailsKitErrors[index]?.kitQty ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsKitErrors[index]?.kitQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsKitErrors[index].kitQty}
                                            </div>
                                          )}
                                        </td>
                                        <td>
                                          <Autocomplete
                                            options={allHsnSacCode}
                                            getOptionLabel={(option) => option.code || ''}
                                            value={allHsnSacCode.find((a) => a.code === row.hsnCode) || null}
                                            onChange={(event, newValue) => {
                                              console.log("hsnCode", newValue);

                                              const value = newValue ? newValue.code : '';
                                              setDetailsKitData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, hsnCode: value } : r))
                                              );
                                              setDetailsKitErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  hsnCode: !value ? 'HSN Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                error={!!detailsKitErrors[index]?.hsnCode}
                                                helperText={detailsKitErrors[index]?.hsnCode}
                                              />
                                            )}
                                            sx={{ width: 150 }}
                                          />
                                        </td>
                                        {/* <table className="table-auto w-full border">
                                          <tbody>
                                            {Array.from({ length: Math.ceil(data.length / 3) }, (_, rowIndex) => {
                                              const start = rowIndex * 3;
                                              const rowItems = data.slice(start, start + 3);
                                              return (
                                                <tr key={rowIndex}>
                                                  {rowItems.map((item, i) => {
                                                    // If it's the last row and not full (less than 3 items)
                                                    if (rowItems.length < 3 && i === rowItems.length - 1) {
                                                      return (
                                                        <td key={i} className="border px-2 py-2" colSpan={3 - i}>
                                                          {item}
                                                        </td>
                                                      );
                                                    }
                                                    return (
                                                      <td key={i} className="border px-2 py-2">
                                                        {item}
                                                      </td>
                                                    );
                                                  })}
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table> */}

                                        <td className="border px-2 py-2" style={{ alignContent: 'center', textAlign: 'center' }}>
                                          {row.assetCode}
                                        </td>
                                        <td className="border px-2 py-2" style={{ alignContent: 'center', textAlign: 'center' }}>
                                          {row.asset}
                                        </td>
                                        <td className="border px-2 py-2" style={{ alignContent: 'center', textAlign: 'center' }}>
                                          {row.assetQty}
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
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getReconcileById} />
        )}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default RetrievalIssueManifest;
