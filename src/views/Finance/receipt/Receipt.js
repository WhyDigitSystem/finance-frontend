import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button, Typography, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'react-tabs/style/react-tabs.css';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useTheme } from '@mui/material/styles';
import { Box, padding } from '@mui/system';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const Receipt = () => {
  const [branchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allCustomerName, setAllCustomerName] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [formData, setFormData] = useState({
    paymentMode: 'Bank Receipt',
    transactionMethod: 'NEFT',
    docId: '',
    docDate: dayjs(),
    type: 'CUSTOMER',
    customerName: '',
    customerCode: '',
    tdsAmt: '',
    active: true,
    chequeUtiNo: '',
    chequeUtiDate: null,
    currency: 'INR',
    receiptAmt: '',
    netAmount: '',
    grossAmount: '',
    remarks: '',
    onAccount: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    paymentMode: '',
    transactionMethod: '',
    docId: '',
    docDate: '',
    type: '',
    customerName: '',
    customerCode: '',
    tdsAmt: '',
    active: true,
    chequeUtiNo: '',
    chequeUtiDate: '',
    currency: '',
    receiptAmt: '',
    netAmount: '',
    grossAmount: '',
    remarks: '',
    onAccount: '',
  });

  const [inVoiceDetailsData, setInVoiceDetailsData] = useState([]);
  const [invoiceDetailsError, setInvoiceDetailsError] = useState([
    {
      invNo: '',
      invDate: '',
      // refNo: '',
      // refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      gstAmt: '',
      chargeAmt: '',
      tds: '',
      outstanding: '',
      settled: '',
    }
  ]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    const isNumeric = /^[0-9.]*$/;
    const numericFields = ['bankCharges', 'receiptAmt', 'tdsAmt']; // Add other numeric fields if needed
    if (numericFields.includes(name)) {
      if (!isNumeric.test(value)) {
        setFieldErrors({
          ...fieldErrors,
          [name]: 'Only numbers are allowed'
        });
        return; 
      }
    }
    if (name === 'customerName') {
      const selectedCustomer = allCustomerName.find((customer) => customer.customerName === value);
      if (selectedCustomer) {
        setFormData({
          ...formData,
          customerName: value,
          customerCode: selectedCustomer.customerCode
        });
        setFieldErrors({
          ...fieldErrors,
          customerName: false,
          customerCode: false
        });
      }
    } else {
      setFormData({ ...formData, [name]: inputValue });
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setEditId('')
    setFormData({
      paymentMode: 'Bank Receipt',
      transactionMethod: 'NEFT',
      // docId: '',
      docDate: dayjs(),
      type: '',
      customerName: '',
      customerCode: '',
      tdsAmt: '',
      active: true,
      chequeUtiNo: '',
      chequeUtiDate: null,
      currency: '',
      receiptAmt: '',
      netAmount: '',
      grossAmount: '',
      remarks: '',
      onAccount: '',
    });
    setFieldErrors({
      paymentMode: '',
      transactionMethod: '',
      type: '',
      customerName: '',
      customerCode: '',
      tdsAmt: '',
      active: true,
      chequeUtiNo: '',
      chequeUtiDate: '',
      currency: '',
      receiptAmt: '',
      netAmount: '',
      grossAmount: '',
      remarks: '',
      onAccount: '',
    });
    setInVoiceDetailsData([]);
    setInvoiceDetailsError([{
      invNo: '',
      invDate: '',
      // refNo: '',
      // refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      gstAmt: '',
      chargeAmt: '',
      tds: '',
      outstanding: '',
      settled: '',
    }]);
    getReceiptDocId();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleView = () => {
    setListView(!listView);
  };

  // const handleAddRow = () => {
  //   const newRow = {
  //     id: Date.now(),
  //     invNo: '',
  //     invDate: null,
  //     // refNo: '',
  //     // refDate: null,
  //     currency: 'INR',
  //     exRate: 1,
  //     amount: '',
  //     gstAmt: '',
  //     chargeAmt: '',
  //     tds: 0,
  //     outstanding: '',
  //     settled: '',
  //   };
  //   setInVoiceDetailsData([...inVoiceDetailsData, newRow]);
  //   setInvoiceDetailsError([
  //     ...invoiceDetailsError,
  //     {
  //       invNo: '',
  //       invDate: '',
  //       // refNo: '',
  //       // refDate: null,
  //       currency: '',
  //       exRate: '',
  //       amount: '',
  //       gstAmt: '',
  //       chargeAmt: '',
  //       tds: '',
  //       outstanding: '',
  //       settled: '',
  //     }
  //   ]);
  // };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getAllCustomerName();
    getReceiptDocId();
    getAllReceipt();
  }, []);

  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls(
        'get',
        `arreceivable/getCustomerNameAndCodeForReceipt?orgId=${orgId}`
      );
      if (response.status === true) {
        setAllCustomerName(response.paramObjectsMap.PartyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllReceipt = async () => {
    try {
      const response = await apiCalls('get', `arreceivable/getAllReceiptReceivableByOrgId?branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.receiptReceivableVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getReceiptById = async (row) => {
    setEditId(row.original.id);
    setInvoiceDetailsError({});
    try {
      const response = await apiCalls('get', `/arreceivable/getAllReceiptById?id=${row.original.id}`);
      if (response.status === true) {
        setListView(false);
        const receiptVO = response.paramObjectsMap.receiptReceivableVO[0];
        setFormData({
          paymentMode: receiptVO.receiptType,
          bankChargeAcc: receiptVO.bankChargeAcc,
          docId: receiptVO.docId,
          docDate: dayjs(receiptVO.docDate),
          bankCharges: receiptVO.bankCharges,
          inCurrencyBnkChargs: receiptVO.inCurrencyBnkChargs,
          type: receiptVO.type,
          tdsAmt: receiptVO.tdsAmt,
          inCurrencyTdsAmt: receiptVO.inCurrencyTdsAmt,
          chequeBank: receiptVO.chequeBank,
          customerName: receiptVO.customerName,
          customerCode: receiptVO.customerCode,
          transactionMethod: receiptVO.receiptType1,
          bankCashAcc: receiptVO.bankCashAcc,
          chequeUtiNo: receiptVO.chequeUtiNo,
          chequeUtiDate: receiptVO.chequeUtiDate ? dayjs(receiptVO.chequeUtiDate) : null,
          receiptAmt: receiptVO.receiptAmt,
          currency: receiptVO.currency,
          currencyAmount: receiptVO.currencyAmount,
          receivedFrom: receiptVO.receivedFrom
        });
        setInVoiceDetailsData(
          receiptVO.receiptInvDetailsVO.map((invoiceData) => ({
            id: invoiceData.id,
            invNo: invoiceData.invNo,
            invDate: invoiceData.invDate ? dayjs(invoiceData.invDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
            // refNo: invoiceData.refNo,
            // refDate: invoiceData.refDate ? dayjs(invoiceData.refDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
            currency: invoiceData.currency,
            exRate: invoiceData.exRate,
            gstAmt: invoiceData.gstAmt,
            amount: invoiceData.amount,
            chargeAmt: invoiceData.chargeAmt,
            tds: invoiceData.tds,
            outstanding: invoiceData.outstanding,
            settled: invoiceData.settled,
          }))
        );
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const handleSave = async () => {
    const errors = {};
    const tableErrors = inVoiceDetailsData.map((row) => ({
      // invNo: !row.invNo ? 'Invoice No is required' : '',
      // invDate: !row.invDate ? 'Invoice Date is required' : '',
      // refNo: !row.refNo ? 'Ref No is required' : '',
      // refDate: !row.refDate ? 'Ref Date is required' : '',
      // masterRef: !row.masterRef ? 'Master Ref is required' : '',
      // houseRef: !row.houseRef ? 'House Ref is required' : '',
      // currency: !row.currency ? 'Currency is required' : '',
      // exRate: !row.exRate ? 'Ex Rate is required' : '',
      // amount: !row.amount ? 'Amount is required' : '',
      // chargeAmt: !row.chargeAmt ? 'Chargeable Amount is required' : '',
      // outstanding: !row.outstanding ? 'Outstanding is required' : '',
      // settled: !row.settled ? 'Settled is required' : '',
      // recExRate: !row.recExRate ? 'Rec Ex Rate is required' : '',
      // txnSettled: !row.txnSettled ? 'Txn Settled is required' : '',
      // gainAmt: !row.gainAmt ? 'Gain or Loss is required' : ''
    }));

    let hasTableErrors = false;
    tableErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableErrors = true;
      }
    });
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    setFieldErrors(errors);
    setInvoiceDetailsError(tableErrors);

    // Prevent saving if form or table errors exist
    if (Object.keys(errors).length === 0 && !hasTableErrors) {
      setIsLoading(true);

      const receiptInvDetailVo = inVoiceDetailsData.map((row) => ({
        // id: item.id || 0, // If id exists, otherwise 0

        ...(editId && { id: row.id }),
        invNo: row.invNo,
        invDate: row.invDate ? formatDate(new Date(row.invDate)) : null,
        currency: row.currency,
        exRate: parseFloat(row.exRate),
        amount: parseFloat(row.amount),
        gstAmt: parseFloat(row.gstAmt),
        tds: parseFloat(row.tds) || 0,
        settled: parseFloat(row.settled) || 0,
        // chargeAmt: parseFloat(row.chargeAmt),
        // outstanding: parseFloat(row.outstanding),
        // refDate: row.refDate ? formatDate(new Date(row.refDate)) : null,
        // refNo: row.refNo,
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: parseInt(orgId),
        receiptType: formData.paymentMode,
        receiptType1: formData.transactionMethod,
        docId: formData.docId,
        docDate: formatDate(new Date(formData.docDate)),
        customerCode: formData.customerCode,
        customerName: formData.customerName,
        tdsAmt: parseInt(formData.tdsAmt),
        receiptAmt: parseInt(formData.receiptAmt),
        currency: formData.currency,
        cancel: true,
        cancelRemarks: '',
        chequeUtiNo: formData.chequeUtiNo,
        chequeUtiDate: formData.chequeUtiDate ? dayjs(formData.chequeUtiDate).format('YYYY-MM-DD') : null,
        remarks: formData.remarks,
        receiptInvDetailaDTO: receiptInvDetailVo
      };

      try {
        const response = await apiCalls('put', `arreceivable/updateCreateReceipt`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Receipt Updated Successfully' : 'Receipt created successfully');
          handleClear();
          getAllReceipt();
          getReceiptDocId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Receipt creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Receipt creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const listViewColumns = [
    // { accessorKey: 'paymentMode', header: 'Receipt Type', size: 140 },
    // { accessorKey: 'bankChargeAcc', header: 'Bank Charges Account', size: 140 },
    // { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    // { accessorKey: 'type', header: 'Type', size: 140 },
    // { accessorKey: 'tdsAmt', header: 'TDS Amount', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'chequeUtiNo', header: 'Chq/ UTI No', size: 140 },
    { accessorKey: 'chequeUtiDate', header: 'Chq/ UTI Dt', size: 140 },
    { accessorKey: 'receiptAmt', header: 'Receipt Amount', size: 140 },
    { accessorKey: 'onAccount', header: 'On Account', size: 140 }
  ];

  useEffect(() => {
    if (currencies.length === 1) {
      handleInputChange({ target: { name: 'currency', value: currencies[0].currency } });
    }
  }, [currencies]);

  useEffect(() => {
    if (allCustomerName.length === 1) {
      handleInputChange({ target: { name: 'customerName', value: allCustomerName[0].customerName } });
    }
  }, [allCustomerName]);
  const getReceiptDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getReceiptDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.receiptDocId,
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  useEffect(() => {
    calculateTotals();
  }, [inVoiceDetailsData, formData.receiptAmt]);
  const calculateTotals = () => {
    let totalChargeAmt = 0;
    let totalSettledAmt = 0;
  
    const updatedInvoiceDetails = inVoiceDetailsData.map((row) => {
      const billAmount = parseFloat(row.amount || 0);
      const gstAmt = parseFloat(row.gstAmt || 0);
      const tdsPercent = parseFloat(row.tds || 0);
      const settledAmt = parseFloat(row.settled || 0);
      totalSettledAmt += settledAmt;
      const gross = billAmount + gstAmt;
      const tdsAmt = (gross * tdsPercent) / 100;
      const netReceivable = gross - tdsAmt;
      const outstandingAmt = netReceivable - settledAmt;
      totalChargeAmt += netReceivable;
  
      return {
        ...row,
        chargeAmt: netReceivable.toFixed(2),
        outstanding: outstandingAmt.toFixed(2)
      };
    });
  
    const receiptAmt = parseFloat(formData.receiptAmt || 0);
    const onAccount = receiptAmt >= totalSettledAmt ? receiptAmt - totalSettledAmt : 0;
    // const onAccount = receiptAmt < totalSettledAmt ? 0 : (receiptAmt - totalChargeAmt).toFixed(2);
    setInVoiceDetailsData(updatedInvoiceDetails);
    setFormData((prev) => ({
      ...prev,
      netAmount: totalChargeAmt.toFixed(2),
      onAccount: onAccount
    }));
  };  
     
    const handleFullGrid = () => {
      if (formData.customerCode) {
        setModalOpen(true);
        getAllFillGrid();
      }else{
        setModalOpen(false);
        showToast('warning', formData.customerName ? `${formData.customerCode} has No Data` : 'Please Select Customer Name');
      }
    };
    const handleCloseModal = () => {
      setModalOpen(false);
    };
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedRows([]);
      } else {
        setSelectedRows(fillGridData.map((_, index) => index));
      }
      setSelectAll(!selectAll);
    };
    const handleSubmitSelectedRows = async () => {
      const selectedData = selectedRows.map((index) => fillGridData[index]);
      const newData = selectedData
        .filter((data) => {
          return !inVoiceDetailsData.some(
            (item) => item.invNo === data.vid && item.invDate === data.vdate
          );
        })
        .map((data) => ({
          id: Date.now() + Math.random(), 
          invNo: data.vid || '',
          invDate: data.vdate ? dayjs(data.vdate).format('YYYY-MM-DD') : null,
          amount: data.billamount || '',
          gstAmt: data.gstamount || '',
          chargeAmt: parseFloat(data.gstamount) + parseFloat(data.billamount) || '',
          tds: 0,
        }));
    
      if (newData.length < selectedData.length) {
        showToast('warning', 'Some of the selected items are already added!');
      }
    
      if (newData.length === 0) {
        return;
      }
      setInVoiceDetailsData((prev) => [...prev, ...newData]);
      setSelectedRows([]);
      setSelectAll(false);
      handleCloseModal();
    };    
  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getReciptFillGrid?orgId=${orgId}&partyCode=${formData.customerCode}`
        );
      if (response.status === true) {
        setFillGridData(response.paramObjectsMap.reciptFillGrid);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-4 " style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getReceiptById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.paymentMode}>
                  <InputLabel id="paymentMode" required>
                    Payment Mode
                  </InputLabel>
                  <Select
                    labelId="paymentMode"
                    id="paymentMode"
                    name="paymentMode"
                    required
                    disabled = {editId}
                    value={formData.paymentMode}
                    label="Receipt Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'Cash Receipt'}>Cash Receipt</MenuItem>
                    <MenuItem value={'Bank Receipt'}>Bank Receipt</MenuItem>
                  </Select>
                  {fieldErrors.paymentMode && <FormHelperText>{fieldErrors.paymentMode}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.transactionMethod}>
                  <InputLabel id="transactionMethod" required>
                    Transaction Method
                  </InputLabel>
                  <Select
                    labelId="transactionMethod"
                    id="transactionMethod"
                    name="transactionMethod"
                    required
                    value={formData.transactionMethod}
                    label="Transaction Method"
                    disabled = {editId}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'NEFT'}>NEFT</MenuItem>
                    <MenuItem value={'RTGS'}>RTGS</MenuItem>
                    <MenuItem value={'IMPS'}>IMPS</MenuItem>
                    <MenuItem value={'CHEQUE'}>CHEQUE</MenuItem>
                    <MenuItem value={'CASH'}>CASH</MenuItem>
                    <MenuItem value={'DD'}>DD</MenuItem>
                  </Select>
                  {fieldErrors.transactionMethod && <FormHelperText>{fieldErrors.transactionMethod}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="docId"
                    name="docId"
                    label="Doc No"
                    size="small"
                    disabled
                    value={formData.docId}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.docId}
                    helperText={fieldErrors.docId}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      disabled
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: {size: 'small'}
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="bankCharges"
                    name="bankCharges"
                    label="Bank Charges"
                    size="small"
                    value={formData.bankCharges}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.bankCharges}
                    helperText={fieldErrors.bankCharges}
                  />
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="demo-simple-select-label">Customer Name</InputLabel>
                  <Select
                    labelId="customerName"
                    id="customerName"
                    label="Customer Name"
                    disabled = {editId}
                    onChange={handleInputChange}
                    name="customerName"
                    value={formData.customerName}
                  >
                    {allCustomerName.map((customer) => (
                      <MenuItem key={customer.id} value={customer.customerName}>
                        {customer.customerName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}{' '}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="inVoiceDetailsDataAmt"
                    name="tdsAmt"
                    disabled = {editId}
                    label="TDS Amount"
                    size="small"
                    value={formData.tdsAmt}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.tdsAmt}
                    helperText={fieldErrors.tdsAmt}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="receiptAmt"
                    name="receiptAmt"
                    label="Receipt Amount"
                    size="small"
                    disabled = {editId}
                    value={formData.receiptAmt}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.receiptAmt}
                    helperText={fieldErrors.receiptAmt}
                  />
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="bankCashAcc"
                    name="bankCashAcc"
                    label="Bank/Cash/AC"
                    size="small"
                    value={formData.bankCashAcc}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.bankCashAcc}
                    helperText={fieldErrors.bankCashAcc}
                  />
                </FormControl>
              </div> */}
              <div className="col-md-6 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="chequeUtiNo"
                    name="chequeUtiNo"
                    label="UTR No"
                    size="small"
                    disabled = {editId}
                    value={formData.chequeUtiNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 100 }}
                    error={!!fieldErrors.chequeUtiNo}
                    helperText={fieldErrors.chequeUtiNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="UTI Date"
                    disabled = {editId}
                      value={formData.chequeUtiDate ? dayjs(formData.chequeUtiDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('chequeUtiDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.chequeUtiDate}
                      helperText={fieldErrors.chequeUtiDate ? fieldErrors.chequeUtiDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                  <InputLabel id="currency">Currency</InputLabel>
                  <Select
                    labelId="currency"
                    id="currency"
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
                  {fieldErrors.currency && <FormHelperText>{fieldErrors.currency}</FormHelperText>}
                </FormControl>
              </div> */}
              
            </div>

            {/* <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}> */}
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value={0} label="Invoice Details" />
              <Tab value={1} label="Summary" />
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {value === 0 && (
                <div className="row d-flex ml" style={{ marginTop: '5px' }}>
                  <div className="mb-1">
                    {/* <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} /> */}
                    <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />                  
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
                              <th className="px-2 py-2 text-white text-center"># Invoice</th>
                              <th className="px-2 py-2 text-white text-center" style={{ border: 'none' }}>Date</th>
                              {/* <th className="px-2 py-2 text-white text-center">Ref No</th>
                               <th className="px-2 py-2 text-white text-center">Ref Date</th> 
                               <th className="px-2 py-2 text-white text-center">Curr.</th>
                              <th className="px-2 py-2 text-white text-center">Ex. Rate</th> */}
                              <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                              <th className="px-2 py-2 text-white text-center">TAX</th>
                              <th className="px-2 py-2 text-white text-center">TDS %</th>
                              <th className="px-2 py-2 text-white text-center">Net Receivable</th>
                              <th className="px-2 py-2 text-white text-center">Outstanding Bal</th>
                              <th className="px-2 py-2 text-white text-center">Settled Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inVoiceDetailsData.map((row, index) => (
                              <tr key={row.id}>
                                <td className="border px-2 py-2 text-center">
                                  <ActionButton
                                    title="Delete"
                                    icon={DeleteIcon}
                                    onClick={() =>
                                      handleDeleteRow(
                                        row.id,
                                        inVoiceDetailsData,
                                        setInVoiceDetailsData,
                                        invoiceDetailsError,
                                        setInvoiceDetailsError
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
                                    value={row.invNo}
                                    disabled
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const regex = /^[a-zA-Z0-9\s/-]*$/;
                                      if (regex.test(value)) {
                                        setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, invNo: value } : r)));
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], invNo: !value ? 'Invoice No is required' : '' };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], invNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.invNo ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.invNo && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].invNo}
                                    </div>
                                  )}
                                </td>
                                <td style={{ border: 'none', padding: '1px 2px' }}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DatePicker
                                      value={
                                        row.invDate
                                          ? dayjs(row.invDate, 'YYYY-MM-DD').isValid()
                                            ? dayjs(row.invDate, 'YYYY-MM-DD')
                                            : null
                                          : null
                                      }
                                      disabled
                                      format="DD-MM-YYYY"
                                      onChange={(newValue) => {
                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id
                                              ? { ...r, invDate: newValue ? newValue.format('YYYY-MM-DD') : null }
                                              : r
                                          )
                                        );
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            invDate: !newValue ? 'Inv Date is required' : '',
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      slotProps={{
                                        textField: {
                                          InputProps: {
                                            sx: {
                                              '& input': {
                                                padding: '9px 8px',
                                                fontSize: '14px',
                                              },
                                            },
                                          },
                                          sx: {
                                            width: '200px',
                                            padding: '8px',
                                          },
                                        },
                                      }}                                     
                                    />
                                    {invoiceDetailsError[index]?.invDate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].invDate}
                                      </div>
                                    )}
                                  </LocalizationProvider>
                                </td>
                                {/* <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.refNo}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const regex = /^[a-zA-Z0-9\s-]*$/;
                                      if (regex.test(value)) {
                                        setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, refNo: value } : r)));
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], refNo: !value ? 'Ref No is required' : '' };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], refNo: 'Only alphabets and numbers are allowed' };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.refNo ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.refNo && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].refNo}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                  <input
                                    type="date"
                                    value={row.refDate}
                                    onChange={(e) => {
                                      const date = e.target.value;

                                      setInVoiceDetailsData((prev) =>
                                        prev.map((r) =>
                                          r.id === row.id ? { ...r, refDate: date, refDate: date > r.refDate ? '' : r.refDate } : r
                                        )
                                      );

                                      setInvoiceDetailsError((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = {
                                          ...newErrors[index],
                                          refDate: !date ? 'Ref Date is required' : ''
                                        };
                                        return newErrors;
                                      });
                                    }}
                                    className={invoiceDetailsError[index]?.refDate ? 'error form-control' : 'form-control'}
                                  />
                                  {invoiceDetailsError[index]?.refDate && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].refDate}
                                    </div>
                                  )}
                                </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.currency}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], currency: !value ? 'Currency is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              currency: 'Only alphabets and numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.currency ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.currency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].currency}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.exRate}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;

                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], exRate: !value ? 'Ex Rate is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], exRate: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.exRate ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.exRate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].exRate}
                                      </div>
                                    )}
                                  </td>*/}
                                <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.amount}
                                    disabled
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isNumeric = /^[0-9.]*$/;
                                      if (isNumeric.test(value)) {
                                        setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r)));
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], amount: !value ? 'Bill Amount is required' : '' };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], amount: 'Only numbers are allowed' };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.amount ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.amount && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].amount}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.gstAmt}
                                    disabled
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isNumeric = /^[0-9]*$/;
                                      if (isNumeric.test(value)) {
                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, gstAmt: value } : r))
                                        );
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], gstAmt: !value ? 'Tax Amt is required' : '' };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            gstAmt: 'Only numbers are allowed'
                                          };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.gstAmt ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.gstAmt && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].gstAmt}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.tds}
                                    disabled = {editId}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isNumeric = /^[0-9]*$/;
                                      if (isNumeric.test(value)) {
                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tds: value } : r))
                                        );
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tds: !value ? 'TDS is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tds: 'Only numbers are allowed'
                                          };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.tds ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.tds && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].tds}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.chargeAmt}
                                    disabled
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isNumeric = /^[0-9]*$/;
                                      if (isNumeric.test(value)) {
                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, chargeAmt: value } : r))
                                        );
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], chargeAmt: 'Only numbers are allowed' };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            chargeAmt: 'Only numbers are allowed'
                                          };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.chargeAmt ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.chargeAmt && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].chargeAmt}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                  <input
                                    type="text"
                                    value={row.outstanding}
                                    disabled = {editId}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isNumeric = /^[0-9]*$/;
                                      if (isNumeric.test(value)) {
                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, outstanding: value } : r))
                                        );
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            outstanding: !value ? 'Outstanding is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      } else {
                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            outstanding: 'Only numbers are allowed'
                                          };
                                          return newErrors;
                                        });
                                      }
                                    }}
                                    className={invoiceDetailsError[index]?.outstanding ? 'error form-control' : 'form-control'}
                                    style={{ width: '150px' }}
                                  />
                                  {invoiceDetailsError[index]?.outstanding && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].outstanding}
                                    </div>
                                  )}
                                </td>
                                <td className="border px-2 py-2">
                                <input
                                  type="text"
                                  value={row.settled}
                                  disabled={(!formData.receiptAmt || parseFloat(formData.receiptAmt) === 0) || editId}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const isNumeric = /^[0-9.]*$/;

                                    if (!isNumeric.test(value)) {
                                      setInvoiceDetailsError((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], settled: 'Only numbers are allowed' };
                                        return newErrors;
                                      });
                                      return;
                                    }

                                    const newValue = parseFloat(value || 0);
                                    const totalOtherSettled = inVoiceDetailsData.reduce((sum, r) =>
                                      r.id !== row.id ? sum + parseFloat(r.settled || 0) : sum, 0
                                    );

                                    const totalSettledAfterChange = totalOtherSettled + newValue;
                                    const maxReceiptAmt = parseFloat(formData.receiptAmt || 0);
                                    const maxChargeAmt = parseFloat(row.chargeAmt || 0);

                                    let errorMsg = '';
                                    if (newValue > maxChargeAmt) {
                                      errorMsg = `Settled cannot exceed Net Receivable (${maxChargeAmt})`;
                                    } else if (totalSettledAfterChange > maxReceiptAmt) {
                                      errorMsg = `Total settled exceeds Receipt Amount (${maxReceiptAmt})`;
                                    }

                                    if (errorMsg) {
                                      setInvoiceDetailsError((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], settled: errorMsg };
                                        return newErrors;
                                      });
                                      return;
                                    }
                                    setInVoiceDetailsData((prev) =>
                                      prev.map((r) => (r.id === row.id ? { ...r, settled: value } : r))
                                    );
                                    setInvoiceDetailsError((prev) => {
                                      const newErrors = [...prev];
                                      newErrors[index] = { ...newErrors[index], settled: '' };
                                      return newErrors;
                                    });
                                  }}
                                  className={invoiceDetailsError[index]?.settled ? 'error form-control' : 'form-control'}
                                  style={{ width: '150px' }}
                                />
                                  {invoiceDetailsError[index]?.settled && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {invoiceDetailsError[index].settled}
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
              )}
            </Box>
            <Box>
              {value === 1 && (
                <div>
                  <div className="row d-flex mt-4">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="netAmount"
                          name="netAmount"
                          label="Net Amount"
                          disabled
                          size="small"
                          value={formData.netAmount}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.netAmount}
                          helperText={fieldErrors.netAmount}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="onAccount"
                          name="onAccount"
                          label="On Account"
                          disabled
                          size="small"
                          value={formData.onAccount}
                          onChange={(newValue) => setFormData({ ...formData, onAccount: newValue })}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.onAccount}
                          helperText={fieldErrors.onAccount}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="remarks"
                          name="remarks"
                          label="Remarks"
                          size="small"
                          value={formData.remarks}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.remarks}
                          helperText={fieldErrors.remarks}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}
            </Box>
                    <Dialog
                      open={modalOpen}
                      maxWidth={'md'}
                      fullWidth={true}
                      onClose={handleCloseModal}
                      PaperComponent={PaperComponent}
                      aria-labelledby="draggable-dialog-title"
                    >
                      <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <h6>Grid Details</h6>
                      </DialogTitle>
                      <DialogContent className="pb-0">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      <Checkbox checked={selectAll} onChange={handleSelectAll} />
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header"># Invoice</th>
                                    <th className="table-header">Date</th>
                                    <th className="table-header">Bill Amount</th>
                                    <th className="table-header">Tax</th>
                                    <th className="table-header">Net Receivable</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fillGridData?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border p-0 text-center">
                                        <Checkbox
                                          checked={selectedRows.includes(index)}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.vid || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.billamount || ''}
                                      </td> 
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.gstamount || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {parseFloat(row.gstamount) + parseFloat(row.billamount) || 0}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                      <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                        <Button onClick={handleCloseModal} sx={{ color: '#673AB7' }}>
                          Cancel
                        </Button>
                        <Button
                          color="secondary"
                          onClick={handleSubmitSelectedRows}
                          variant="contained"
                          sx={{ backgroundColor: '#673AB7' }}
                        >
                          Proceed
                        </Button>
                      </DialogActions>
                    </Dialog>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Receipt;
