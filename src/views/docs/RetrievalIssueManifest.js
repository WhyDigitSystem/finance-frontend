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

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

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
    // getNewBankDocId();
    // getAllBankName();
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


  // const getNewBankDocId = async () => {
  //   try {
  //     const response = await apiCalls(
  //       'get',
  //       `/transaction/getReconcileBankDocId?branchCode=${loginBranchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
  //     );
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       docId: response.paramObjectsMap.reconcileBankDocId,
  //       docDate: dayjs()
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching gate passes:', error);
  //   }
  // };

  // const handleAddRow = () => {
  //   setDetailsKitData((prevData) => [
  //     ...prevData,
  //     {
  //       id: prevData.length + 1, // Or use a better ID generation method
  //       voucherNo: '',
  //       voucherDate: '',
  //       chequeNo: '',
  //       chequeDate: '',
  //       clearedDate: '',
  //       withdrawal: '',
  //       bankRef: '',
  //       narration: ''
  //     }
  //   ]);
  // };

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
    // if (!formData.bankStmtDate) errors.bankStmtDate = 'Bank Stmt Date is required';
    // if (!formData.bankAccount) errors.bankAccount = 'Bank Account is required';

    let detailsTableDataValid = true;
    // if (!detailsKitData || detailsKitData.length === 0) {
    //   detailsTableDataValid = false;
    //   setDetailsKitErrors([{ general: 'detail Table Data is required' }]);
    // }
    // else {
    //   const newTableErrors = detailsKitData.map((row, index) => {
    //     const rowErrors = {};
    //     if (!row.voucherNo) {
    //       rowErrors.voucherNo = 'VoucherNo is required';
    //       detailsTableDataValid = false;
    //     }
    //     if (!row.voucherDate) {
    //       rowErrors.voucherDate = 'voucherDate is required';
    //       detailsTableDataValid = false;
    //     }
    //     if (!row.chequeNo) {
    //       rowErrors.chequeNo = 'cheque No is required';
    //       detailsTableDataValid = false;
    //     }
    //     if (!row.chequeDate) {
    //       rowErrors.chequeDate = 'cheque Date is required';
    //       detailsTableDataValid = false;
    //     }
    //     if (!row.deposit) {
    //       rowErrors.deposit = 'deposit is required';
    //       detailsTableDataValid = false;
    //     }
    //     if (!row.withdrawal) {
    //       rowErrors.withdrawal = 'withdrawal is required';
    //       detailsTableDataValid = false;
    //     }

    //     if (row.active === undefined || row.active === null) {
    //       rowErrors.active = 'Active is required';
    //       detailsTableDataValid = false;
    //     }

    //     return rowErrors;
    //   });
    //   setDetailsKitErrors(newTableErrors);
    // }
    // setFormDataErrors(errors);

    // if (Object.keys(errors).length === 0 && detailsTableDataValid) {
    if (detailsTableDataValid) {
      setIsLoading(true);

      const retrievalManifestProviderDetailsVo = detailsKitData.map((row) => ({
        ...(editId && { id: row.id }),
        voucherNo: row.voucherNo,
        voucherDate: row.voucherDate,
        chequeNo: row.chequeNo,
        chequeDate: row.voucherDate,
        deposit: parseInt(row.deposit),
        withdrawal: parseInt(row.withdrawal),
        bankRef: row.bankRef
        // active: row.active === 'true' || row.active === true // Convert string 'true' to boolean true if necessary
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        cancel: true,
        createdBy: loginUserName,
        dispatchDate: formData.dispatchType ? dayjs(formData.dispatchType).format('YYYY-MM-DD') : null,
        driverPhoneNo: formData.driverNo,
        orgId: orgId,
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

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/reportController/createUpdateRetrievalManifest', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Retrieval Issue Manifest updated successfully' : 'Retrieval Issue Manifest created successfully');
          // getNewBankDocId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Retrieval Issue Manifest creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Retrieval Issue Manifest creation failed');
        setIsLoading(false);
      }
    } else {
      // setFieldErrors(errors);
    }
  };

  const getReconcileById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAllReconcileBankById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.reconcileBankVO[0];
        setEditId(row.original.id);

        setFormData({
          docId: listValueVO.docId,
          docDate: listValueVO.docDate, // handle invalid or null dates
          bankStmtDate: listValueVO.bankStmtDate, //
          bankAccount: listValueVO.bankAccount,
          remarks: listValueVO.remarks,
          totalDeposit: listValueVO.totalDeposit,
          totalWithdrawal: listValueVO.totalWithdrawal
        });
        setDetailsKitData(
          listValueVO.particularsReconcileVO.map((cl) => ({
            id: cl.id,
            voucherNo: cl.voucherNo,
            voucherDate: cl.voucherDate,
            chequeNo: cl.chequeNo,
            chequeDate: cl.chequeDate,
            clearedDate: cl.clearedDate,
            withdrawal: cl.withdrawal,
            bankRef: cl.bankRef,
            deposit: cl.deposit
          }))
        );

        console.log('DataToEdit', listValueVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleDepositChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsKitData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, deposit: value, withdrawal: value === '0' ? '' : '0' } : r))
      );

      setDetailsKitErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          deposit: !value ? 'Deposit Amount is required' : '',
          withdrawal: value === '0' ? 'Withdrawal Amount is required' : ''
        };
        return newErrors;
      });

      // calculateTotals(); // Recalculate totals
    }
  };

  const handleWithdrawalChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsKitData((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, withdrawal: value, deposit: value === '0' ? '' : '0' } : r))
      );

      setDetailsKitErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          withdrawal: !value ? 'Withdrawal Amount is required' : '',
          deposit: value === '0' ? 'Deposit Amount is required' : ''
        };
        return newErrors;
      });

      // calculateTotals(); // Recalculate totals
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
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Transaction Date"
                      disabled
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
              {/* <div className="col-md-3 mb-3">

                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Sender
                  </InputLabel>
                  <Select
                    labelId="sender"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    label="Sender"
                  // error={!!errors.bankAccount}
                  // helperText={errors.bankAccount}
                  >
                    {customerDetails &&
                      customerDetails.map((customer, index) => (
                        <MenuItem key={index} value={customer.partyShortName}>
                          {customer.partyShortName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div> */}

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
                    />
                  )}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Sender Address"
                  size="small"
                  disabled
                  multiline
                  minRows={2}
                  value={formData.senderAddress}
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
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
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Receiver Warehouse
                  </InputLabel>
                  <Select
                    labelId="receiverWarehouse"
                    value={formData.receiverWarehouse}
                    onChange={(e) => setFormData({ ...formData, receiverWarehouse: e.target.value })}
                    label="Receiver Warehouse"
                  // error={!!errors.bankAccount}
                  // helperText={errors.bankAccount}
                  >
                    {bankName &&
                      bankName.map((bank, index) => (
                        <MenuItem key={index} value={bank.accountgroupname}>
                          {bank.accountgroupname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Warehouse's Address"
                  value={formData.warehouseAddress}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  disabled
                  onChange={(e) => setFormData({ ...formData, warehouseAddress: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Transporter Name"
                  value={formData.transporterName}
                  size="small"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, transporterName: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Vehicle No"
                  value={formData.vehicleNo}
                  size="small"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
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
                                        <td>
                                          <Autocomplete
                                            options={allAccountName}
                                            getOptionLabel={(option) => option.kitName || ''}
                                            groupBy={(option) => (option.kitName ? option.kitName[0].toUpperCase() : '')}
                                            value={row.kitName ? allAccountName.find((a) => a.kitName === row.kitName) : null}
                                            onChange={(event, newValue) => {
                                              const value = newValue ? newValue.kitName : '';
                                              setDetailsKitData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, kitName: value } : r))
                                              );
                                              setDetailsKitErrors((prevErrors) =>
                                                prevErrors.map((err, idx) => (idx === index ? { ...err, kitName: '' } : err))
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
                                            value={
                                              row.hsnCode
                                                ? allHsnSacCode.find((a) => a.code === row.hsnCode) || null
                                                : allHsnSacCode.length === 1
                                                  ? allHsnSacCode
                                                  : null
                                            }
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

                                        <td className="border px-2 py-2">
                                          {row.productCode}
                                        </td>
                                        <td className="border px-2 py-2">
                                          {row.productCode}
                                        </td>
                                        <td className="border px-2 py-2">
                                          {row.productCode}
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
