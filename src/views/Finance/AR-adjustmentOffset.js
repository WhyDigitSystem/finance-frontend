import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'react-tabs/style/react-tabs.css';

// import CommonListViewTable from '../basicMaster/CommonListViewTable';

// import { AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
// import { BsListTask } from "react-icons/bs";

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const ARadjustmentOffset = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allCustomerName, setAllCustomerName] = useState([]);
  const [allReceiptDocId, setAllReceiptDocId] = useState([]);
  const [branchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [selectedDocId, setSelectedDocId] = useState("");

  const [formData, setFormData] = useState({
    active: true,
    docNo: '',
    docDate: dayjs(),
    receiptDocId: '',
    receiptDocDate: null,
    subledgerType: '',
    currency: '',
    exRate: 1.00,
    subledgerName: '',
    amount: '',
    supplierRefNo: '',
    subledgerCode: '',
    gainorLoss: '',
    totalSettled: '',
    roundOfAmount: '',
    onAccount: '',
    narration: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    receiptDocId: '',
    receiptDocDate: null,
    subledgerType: '',
    currency: '',
    exRate: '',
    subledgerName: '',
    amount: '',
    supplierRefNo: '',
    subledgerCode: '',
    gainorLoss: '',
    totalSettled: '',
    roundOfAmount: '',
    onAccount: '',
    narration: ''
  });

  const [inVoiceDetailsData, setInVoiceDetailsData] = useState([
    {
      id: Date.now(),
      invNo: '',
      invDate: null,
      refNo: '',
      refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      outStanding: '',
      settled: '',
      setExRate: '',
      tnxSettled: '',
      gainAmt: ''
    }
  ]);

  const [invoiceDetailsError, setInvoiceDetailsError] = useState([
    {
      invNo: '',
      invDate: null,
      refNo: '',
      refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      outStanding: '',
      settled: '',
      setExRate: '',
      tnxSettled: '',
      gainAmt: ''
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
  
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: inputValue };
  
      const totalSettled = inVoiceDetailsData.reduce(
        (sum, row) => sum + (parseFloat(row.settled) || 0),
        0
      );
  
      const gainorLoss = inVoiceDetailsData.reduce(
        (sum, row) => sum + (parseFloat(row.gainAmt) || 0),
        0
      );
  
      const roundedTotalSettled = Math.round(totalSettled);
      
      const roundOfAmount = (totalSettled - roundedTotalSettled).toFixed(2);
  
      if (name === "amount") {
        updatedFormData.onAccount = totalSettled - Math.abs(parseFloat(value) || 0);
      }
  
      updatedFormData.totalSettled = totalSettled;
      updatedFormData.gainorLoss = gainorLoss;
      updatedFormData.roundOfAmount = roundOfAmount;
  
      return updatedFormData;
    });
  
    setFieldErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };  

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      active: true,
      docDate: dayjs(),
      receiptDocId: '',
      receiptDocDate: null,
      subledgerType: '',
      currency: '',
      exRate: 1.00,
      subledgerName: '',
      amount: '',
      supplierRefNo: '',
      subledgerCode: '',
      gainorLoss: '',
      totalSettled: '',
      roundOfAmount: '',
      onAccount: '',
      narration: ''
    });
    setFieldErrors({
      active: true,
      receiptDocId: '',
      receiptDocDate: null,
      subledgerType: '',
      currency: '',
      exRate: '',
      subledgerName: '',
      amount: '',
      supplierRefNo: '',
      subledgerCode: '',
      gainorLoss: '',
      totalSettled: '',
      roundOfAmount: '',
      onAccount: '',
      narration: ''
    });
    setInVoiceDetailsData([
      {
        invNo: '',
        invDate: null,
        refNo: '',
        refDate: null,
        currency: '',
        exRate: '',
        amount: '',
        outStanding: '',
        settled: '',
        setExRate: '',
        tnxSettled: '',
        gainAmt: ''
      }
    ]);
    setInvoiceDetailsError({
      invNo: '',
      invDate: null,
      refNo: '',
      refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      outStanding: '',
      settled: '',
      setExRate: '',
      tnxSettled: '',
      gainAmt: ''
    });
    getArOffsetDocId();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleAddRow = () => {
    // if (isLastRowEmpty(inVoiceDetailsData)) {
    //   displayRowError(inVoiceDetailsData);
    //   return;
    // }
    const newRow = {
      id: Date.now(),
      invNo: '',
      invDate: null,
      refNo: '',
      refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      outStanding: '',
      settled: '',
      setExRate: '',
      tnxSettled: '',
      gainAmt: ''
    };
    setInVoiceDetailsData([...inVoiceDetailsData, newRow]);
    setInvoiceDetailsError([
      ...invoiceDetailsError,
      {
        invNo: '',
        invDate: null,
        refNo: '',
        refDate: null,
        currency: '',
        exRate: '',
        amount: '',
        outStanding: '',
        settled: '',
        setExRate: '',
        tnxSettled: '',
        gainAmt: ''
      }
    ]);
  };

  // const isLastRowEmpty = (table) => {
  //   const lastRow = table[table.length - 1];
  //   if (!lastRow) return false;

  //   if (table === inVoiceDetailsData) {
  //     return (
  //       !lastRow.invNo ||
  //       !lastRow.invDate ||
  //       !lastRow.refNo ||
  //       !lastRow.refDate ||
  //       !lastRow.masterRef ||
  //       !lastRow.houseRef ||
  //       !lastRow.currency ||
  //       !lastRow.exRate ||
  //       !lastRow.amount ||
  //       !lastRow.chargeAmt ||
  //       !lastRow.outStanding ||
  //       !lastRow.settled ||
  //       !lastRow.setExRate ||
  //       !lastRow.tnxSettled ||
  //       !lastRow.gainAmt
  //     );
  //   }
  //   return false;
  // };

  // const displayRowError = (table) => {
  //   if (table === inVoiceDetailsData) {
  //     setInvoiceDetailsError((prevErrors) => {
  //       const newErrors = [...prevErrors];
  //       newErrors[table.length - 1] = {
  //         ...newErrors[table.length - 1],
  //         invNo: !table[table.length - 1].invNo ? 'Invoice No is required' : '',
  //         invDate: !table[table.length - 1].invDate ? 'Invoice Date is required' : '',
  //         refNo: !table[table.length - 1].refNo ? 'Ref No is required' : '',
  //         refDate: !table[table.length - 1].refDate ? 'Ref Date is required' : '',
  //         masterRef: !table[table.length - 1].masterRef ? 'Master Ref is required' : '',
  //         houseRef: !table[table.length - 1].houseRef ? 'House Ref is required' : '',
  //         currency: !table[table.length - 1].currency ? 'Currency is required' : '',
  //         exRate: !table[table.length - 1].exRate ? 'Ex Rate is required' : '',
  //         amount: !table[table.length - 1].amount ? 'Amount is required' : '',
  //         chargeAmt: !table[table.length - 1].chargeAmt ? 'Chargeable Amount is required' : '',
  //         outStanding: !table[table.length - 1].outStanding ? 'outStanding is required' : '',
  //         settled: !table[table.length - 1].settled ? 'Settled is required' : '',
  //         setExRate: !table[table.length - 1].setExRate ? 'Rec Ex Rate is required' : '',
  //         tnxSettled: !table[table.length - 1].tnxSettled ? 'Txn Settled is required' : '',
  //         gainAmt: !table[table.length - 1].gainAmt ? 'Gain or Loss is required' : ''
  //       };
  //       return newErrors;
  //     });
  //   }
  // };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getAllReceiptId();
    getArOffsetDocId();
  }, []);
  const getArOffsetDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/aradjustmentoffset/getArAdjustmentOffSetDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docNo: response.paramObjectsMap.arAdjustmentOffSetDocId
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllReceiptId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `aradjustmentoffset/getAllCustomerReceiptByOrgIdAndBranchCode?branchCode=${branchCode}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setAllReceiptDocId(response.paramObjectsMap.receiptVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDocIdChange = (event) => {
    const selectedId = event.target.value;
  
    // Find the selected docId details
    const selectedReceipt = allReceiptDocId.find((item) => item.docId === selectedId);
  
    if (selectedReceipt) {
      setFormData((prev) => ({
        ...prev,
        receiptDocId: selectedId,
        receiptDocDate: selectedReceipt.docDate,
        subledgerType: selectedReceipt.type,
        currency: selectedReceipt.currency,
        subledgerName: selectedReceipt.customerName,
        subledgerCode: selectedReceipt.customerCode,
      }));
  
      // Ensure receiptInvDetailsVO is an array before setting it
      const updatedTableData = Array.isArray(selectedReceipt.receiptInvDetailsVO)
        ? selectedReceipt.receiptInvDetailsVO.map((item) => ({
            invNo: item.invNo,
            invDate: item.invDate,
            refNo: item.refNo || '',
            refDate: item.refDate || '',
            currency: item.currency,
            exRate: item.exRate,
            amount: item.amount,
            outStanding: item.outStanding || '',
            settled: item.settled,
            setExRate: item.recExRate || '',
            tnxSettled: item.tnxSettled || '',
            gainAmt: item.gainAmt || '',
          }))
        : [];
  
      setInVoiceDetailsData(updatedTableData);
    }
  };
  
  

  useEffect(() => {
    getAllARAdjustmentOffset();
  }, []);

  const getAllARAdjustmentOffset = async () => {
    try {
      const response = await apiCalls('get', `/aradjustmentoffset/getAllArAdjustmentOffSetByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.arAdjustmentOffSetVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getARAdjustmentOffsetById = async (row) => {
    console.log('first', row);
    setEditId(row.original.id);

    try {
      const response = await apiCalls('get', `/aradjustmentoffset/getArAdjustmentOffSetById?id=${row.original.id}`);
      if (response.status === true) {
        setListView(false);
        const receiptVO = response.paramObjectsMap.arAdjustmentOffSetVO[0];

        setFormData({
          docNo: receiptVO.docId,
          // docDate: dayjs(receiptVO.docDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          docDate: dayjs(receiptVO.docDate),
          receiptDocId: receiptVO.receiptDocId,
          // receiptDocDate: dayjs(receiptVO.receiptDocDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          receiptDocDate: dayjs(receiptVO.receiptDocDate),
          subledgerType: receiptVO.subLedgerType,
          currency: receiptVO.currency,
          exRate: receiptVO.exRate,
          subledgerName: receiptVO.subLedgerName,
          amount: receiptVO.amount,
          supplierRefNo: receiptVO.supplierRefNo,
          subledgerCode: receiptVO.subLedgerCode,
          gainorLoss: receiptVO.forexGainOrLoss,
          totalSettled: receiptVO.totalSettled,
          roundOfAmount: receiptVO.roundOffAmount,
          onAccount: receiptVO.onAccount,
          narration: receiptVO.narration,
        });
        setInVoiceDetailsData(
          receiptVO.arOffSetInvoiceDetailsVO.map((invoiceData) => ({
            id: invoiceData.id,
            invNo: invoiceData.invoiceNo,
            invDate: dayjs(invoiceData.invoiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), // Convert to correct format
            refNo: invoiceData.refNo,
            refDate: dayjs(invoiceData.refDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), // Convert to correct format
            currency: invoiceData.curr,
            exRate: invoiceData.exRate,
            amount: invoiceData.invAmount,
            outStanding: invoiceData.outStanding,
            settled: invoiceData.settled,
            setExRate: invoiceData.setExRate,
            tnxSettled: invoiceData.tnxSettled,
            gainAmt: invoiceData.gainOrLoss
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date();

  const handleSave = async () => {
    const errors = {};
    // const tableErrors = inVoiceDetailsData.map((row) => ({
    //   invNo: !row.invNo ? 'Invoice No is required' : '',
    //   invDate: !row.invDate ? 'Invoice Date is required' : '',
    //   refNo: !row.refNo ? 'Ref No is required' : '',
    //   refDate: !row.refDate ? 'Ref Date is required' : '',
    //   masterRef: !row.masterRef ? 'Master Ref is required' : '',
    //   houseRef: !row.houseRef ? 'House Ref is required' : '',
    //   currency: !row.currency ? 'Currency is required' : '',
    //   exRate: !row.exRate ? 'Ex Rate is required' : '',
    //   amount: !row.amount ? 'Amount is required' : '',
    //   chargeAmt: !row.chargeAmt ? 'Chargeable Amount is required' : '',
    //   outStanding: !row.outStanding ? 'outStanding is required' : '',
    //   settled: !row.settled ? 'Settled is required' : '',
    //   setExRate: !row.setExRate ? 'Rec Ex Rate is required' : '',
    //   tnxSettled: !row.tnxSettled ? 'Txn Settled is required' : '',
    //   gainAmt: !row.gainAmt ? 'Gain or Loss is required' : ''
    // }));

    // let hasTableErrors = false;

    // tableErrors.forEach((err) => {
    //   if (Object.values(err).some((error) => error)) {
    //     hasTableErrors = true;
    //   }
    // });

    // Check for empty fields and set error messages
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    }

    setFieldErrors(errors);
    // setInvoiceDetailsError(tableErrors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const receiptInvDetailVo = inVoiceDetailsData.map((row) => ({

        ...(editId && { id: row.id }),
        curr: row.currency,
        exRate: parseInt(row.exRate),
        gainOrLoss: parseInt(row.gainAmt),
        invAmount: parseInt(row.amount),
        invoiceDate: formatDate(new Date(row.invDate)),
        invoiceNo: row.invNo,
        outStanding: parseInt(row.outStanding),
        refDate: formatDate(new Date(row.refDate)),
        refNo: row.refNo,
        setExRate: parseInt(row.setExRate),
        settled: parseInt(row.settled),
        tnxSettled: parseInt(row.tnxSettled)
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        amount: formData.amount,
        arOffSetInvoiceDetailsDTO: receiptInvDetailVo,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        currency: formData.currency,
        exRate: formData.exRate,
        finYear: finYear,
        narration: formData.narration,
        orgId: parseInt(orgId),
        receiptDocDate: formData.receiptDocDate,
        receiptDocId: formData.receiptDocId,
        subLedgerCode: formData.subledgerCode,
        subLedgerName: formData.subledgerName,
        subLedgerType: formData.subledgerType,
        supplierRefNo: formData.supplierRefNo,
      };

      try {
        const response = await apiCalls('put', `/aradjustmentoffset/updateCreateArAdjustmentOffSet`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'AR-Adjustment Offset Updated Successfully' : 'AR-Adjustment Offset created successfully');
          handleClear();
          getAllARAdjustmentOffset();
          getArOffsetDocId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'AR-Adjustment Offset creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'AR-Adjustment Offset creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'receiptDocId', header: 'Receipt Doc Id', size: 140 },
    { accessorKey: 'receiptDocDate', header: 'Receipt Doc Date', size: 140 },
    { accessorKey: 'totalSettled', header: 'Total Settled', size: 140 },
    { accessorKey: 'onAccount', header: 'On Account', size: 140 },
    { accessorKey: 'subLedgerType', header: 'Subledger Type', size: 140 },
    { accessorKey: 'subLedgerName', header: 'Subledger Name', size: 140 },
    { accessorKey: 'subLedgerCode', header: 'Subledger Code', size: 140 },
  ];

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-start mb-4 " style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getARAdjustmentOffsetById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  {/* <TextField id="docNo" name="docNo" label="Doc No" value={docNo} size="small" disabled /> */}
                  <TextField
                    label="Doc No"
                    size="small"
                    disabled
                    value={formData.docNo}
                    onChange={(e) => setFormData({ ...formData, docNo: e.target.value })}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      // value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      value={formData.docDate}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      disabled
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.receiptDocId}>
                  <InputLabel id="receiptDocId">Receipt Doc ID</InputLabel>
                  <Select
                    labelId="receiptDocId"
                    id="receiptDocId"
                    label="Receipt Doc ID"
                    onChange={handleDocIdChange}
                    name="receiptDocId"
                    value={formData.receiptDocId}
                  >
                    {allReceiptDocId.map((doc) => (
                      <MenuItem key={doc.id} value={doc.docId}>
                        {doc.docId}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.receiptDocId && <FormHelperText>{fieldErrors.receiptDocId}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Receipt Doc Date"
                      // value={formData.receiptDocDate ? dayjs(formData.receiptDocDate, 'YYYY-MM-DD') : null}
                      value={formData.receiptDocDate}
                      onChange={(date) => handleDateChange('receiptDocDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      // disabled
                      error={!!fieldErrors.receiptDocDate}
                      helperText={fieldErrors.receiptDocDate ? fieldErrors.receiptDocDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="subledgerType"
                    name="subledgerType"
                    label="Subledger Type"
                    size="small"
                    value={formData.subledgerType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.subledgerType}
                    helperText={fieldErrors.subledgerType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
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
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="exRate"
                    name="exRate"
                    label="Ex. rate"
                    size="small"
                    value={formData.exRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    // error={!!fieldErrors.exRate}
                    // helperText={fieldErrors.exRate}
                    disabled
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="subledgerName"
                    name="subledgerName"
                    label="Subledger Name"
                    size="small"
                    value={formData.subledgerName}
                    onChange={handleInputChange}
                    error={!!fieldErrors.subledgerName}
                    helperText={fieldErrors.subledgerName}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="amount"
                    name="amount"
                    label="Amount"
                    size="small"
                    value={formData.amount}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.amount}
                    helperText={fieldErrors.amount}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="supplierRefNo"
                    name="supplierRefNo"
                    label="Supplier Ref No"
                    size="small"
                    value={formData.supplierRefNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.supplierRefNo}
                    helperText={fieldErrors.supplierRefNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="subledgerCode"
                    name="subledgerCode"
                    label="Subledger Code"
                    size="small"
                    value={formData.subledgerCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.subledgerCode}
                    helperText={fieldErrors.subledgerCode}
                  />
                </FormControl>
              </div>
            </div>
            {/* </div> */}

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
                              <th className="px-2 py-2 text-white text-center">Invoice Number</th>
                              <th className="px-2 py-2 text-white text-center">Invoice Date</th>
                              <th className="px-2 py-2 text-white text-center">Ref No</th>
                              <th className="px-2 py-2 text-white text-center">Ref Date</th>
                              <th className="px-2 py-2 text-white text-center">Curr.</th>
                              <th className="px-2 py-2 text-white text-center">Ex. Rate</th>
                              <th className="px-2 py-2 text-white text-center">Inv. Amount</th>
                              <th className="px-2 py-2 text-white text-center">outStanding</th>
                              <th className="px-2 py-2 text-white text-center">Settled</th>
                              <th className="px-2 py-2 text-white text-center">set. Ex. Rate</th>
                              <th className="px-2 py-2 text-white text-center">Txn Settled</th>
                              <th className="px-2 py-2 text-white text-center">Gain or Loss</th>
                              {/* <th className="px-2 py-2 text-white text-center">Remarks</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(inVoiceDetailsData) &&
                              inVoiceDetailsData.map((row, index) => (
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
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, invNo: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], invNo: !value ? 'Invoice No is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          // Remove this block to not set any error for non-numeric input
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

                                  <td className="border px-2 py-2">
                                    <input
                                      type="date"
                                      value={row.invDate}
                                      onChange={(e) => {
                                        const date = e.target.value;

                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id ? { ...r, invDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                          )
                                        );

                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            invDate: !date ? 'Invoice Date is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={invoiceDetailsError[index]?.invDate ? 'error form-control' : 'form-control'}
                                    />
                                    {invoiceDetailsError[index]?.invDate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].invDate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
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
                                            r.id === row.id ? { ...r, refDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
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
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.amount}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], amount: !value ? 'Amount is required' : '' };
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
                                      value={row.outStanding}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, outStanding: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              outStanding: !value ? 'outStanding is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              outStanding: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.outStanding ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.outStanding && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].outStanding}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.settled}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, settled: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], settled: !value ? 'Settled is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], settled: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
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
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.setExRate}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;

                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, setExRate: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              setExRate: !value ? 'Rec Ex Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              setExRate: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.setExRate ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.setExRate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].setExRate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tnxSettled}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;

                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, tnxSettled: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              tnxSettled: !value ? 'Txn Settled is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              tnxSettled: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.tnxSettled ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.tnxSettled && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].tnxSettled}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gainAmt}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, gainAmt: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], gainAmt: !value ? 'Gain or Loss is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], gainAmt: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.gainAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}

                                      // onKeyDown={(e) => handleKeyDown(e, row, inVoiceDetailsData)}
                                    />
                                    {invoiceDetailsError[index]?.gainAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].gainAmt}
                                      </div>
                                    )}
                                  </td>
                                  {/* <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.remarks}
                                      className="form-control"
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r)));
                                      }}
                                    />
                                  </td> */}
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
                          id="gainorLoss"
                          name="gainorLoss"
                          label="Forex Gain or Loss"
                          size="small"
                          value={formData.gainorLoss}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.gainorLoss}
                          helperText={fieldErrors.gainorLoss}
                        />
                      </FormControl>
                    </div>

                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="totalSettled"
                          name="totalSettled"
                          label="Total Setteled"
                          size="small"
                          value={formData.totalSettled}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.totalSettled}
                          helperText={fieldErrors.totalSettled}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="roundOfAmount"
                          name="roundOfAmount"
                          label="Round Of Amount"
                          size="small"
                          value={formData.roundOfAmount}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.roundOfAmount}
                          helperText={fieldErrors.roundOfAmount}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="onAccount"
                          name="onAccount"
                          label="On Account"
                          size="small"
                          value={formData.onAccount}
                          disabled 
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="narration"
                          name="narration"
                          label="Narration"
                          size="small"
                          value={formData.narration}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.narration}
                          helperText={fieldErrors.narration}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}
            </Box>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ARadjustmentOffset;
