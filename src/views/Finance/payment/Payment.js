import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';

const Payment = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [value, setValue] = useState('1');
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const [formData, setFormData] = useState({
    paymentType: '',
    bankCharges: '',
    bankInCurrency: '',
    staxInCurrency: '',
    docId: '',
    docDate: null,
    type: '',
    partyCode: '',
    partyName: '',
    gstState: '',
    gstIn: '',
    bankCashAcc: '',
    paymentAmt: '',
    tdsAcc: '',
    tdsAmt: '',
    bankChargeAcc: '',
    payTo: '',
    currency: '',
    currencyAmt: '',
    serviceTaxAmt: ''
  });

  const [formDataErrors, setFormDataErrors] = useState({
    docId: '',
    docDate: null,
    bankStmtDate: null,
    bankAccount: '',
    remarks: '',
    totalsupplierRefNo: '',
    totalWithdrawal: ''
  });

  const [withdrawalsTableData, setWithdrawalsTableData] = useState([
    {
      sno: '',
      invNo: '',
      invDate: '',
      refNo: '',
      refDate: '',
      clearedDate: '',
      withdrawal: '',
      supplierRefDate: '',
      supplierRefNo: '',
      exRate: '',
      currency: '',
      amount: '',
      outstanding: '',
      settled: '',
      payExRate: '',
      txnSettled: '',
      gainOrLossAmt: '',
      remarks: ''
    }
  ]);

  const [withdrawalsTableErrors, setWithdrawalsTableErrors] = useState([
    {
      sno: '',
      invNo: '',
      invDate: '',
      refNo: '',
      refDate: '',
      supplierRefDate: '',
      supplierRefNo: '',
      exRate: '',
      currency: '',
      amount: '',
      outstanding: '',
      settled: '',
      payExRate: '',
      txnSettled: '',
      gainOrLossAmt: '',
      remarks: ''
    }
  ]);

  useEffect(() => {
    getAllPayment();
  }, []);

  const getAllPayment = async () => {
    try {
      const result = await apiCalls('get', `/payable/getAllPaymentByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.paymentVO.reverse());
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(withdrawalsTableData)) {
      displayRowError(withdrawalsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      sno: '',
      invNo: '',
      invDate: '',
      refNo: '',
      refDate: '',
      // clearedDate: '',
      withdrawal: '',
      supplierRefDate: '',
      supplierRefNo: '',
      exRate: '',
      currency: '',
      amount: '',
      outstanding: '',
      settled: '',
      payExRate: '',
      txnSettled: '',
      gainOrLossAmt: '',
      remarks: ''
    };
    setWithdrawalsTableData([...withdrawalsTableData, newRow]);
    setWithdrawalsTableErrors([
      ...withdrawalsTableErrors,
      {
        sno: '',
        invNo: '',
        invDate: '',
        refNo: '',
        refDate: '',
        // clearedDate: '',
        supplierRefNo: '',
        supplierRefDate: '',
        exRate: '',
        currency: '',
        amount: '',
        outstanding: '',
        settled: '',
        payExRate: '',
        txnSettled: '',
        gainOrLossAmt: '',
        remarks: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === withdrawalsTableData) {
      return (
        !lastRow.invNo ||
        !lastRow.invDate ||
        !lastRow.refNo ||
        !lastRow.refDate ||
        // !lastRow.clearedDate ||
        !lastRow.supplierRefNo ||
        !lastRow.withdrawal ||
        !lastRow.supplierRefDate ||
        !lastRow.exRate ||
        !lastRow.currency ||
        !lastRow.amount ||
        !lastRow.outstanding ||
        !lastRow.settled ||
        !lastRow.payExRate ||
        !lastRow.txnSettled ||
        !lastRow.gainOrLossAmt ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === withdrawalsTableErrors) {
      setWithdrawalsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          invNo: !table[table.length - 1].invNo ? 'invNo is required' : '',
          invDate: !table[table.length - 1].invDate ? 'invDate is required' : '',
          refNo: !table[table.length - 1].refNo ? 'refNo is required' : '',
          refDate: !table[table.length - 1].refDate ? 'refDate is required' : '',
          clearedDate: !table[table.length - 1].clearedDate ? 'clearedDate is required' : '',
          withdrawal: !table[table.length - 1].withdrawal ? 'withdrawal is required' : '',
          supplierRefDate: !table[table.length - 1].supplierRefDate ? 'supplierRefDate is required' : '',
          supplierRefNo: !table[table.length - 1].supplierRefNo ? 'supplierRefNo is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'Ex Rate is required' : '',
          amount: !table[table.length - 1].amount ? 'Amount is required' : '',
          outstanding: !table[table.length - 1].outstanding ? 'Outstanding is required' : '',
          settled: !table[table.length - 1].settled ? 'Settled is required' : '',
          payExRate: !table[table.length - 1].payExRate ? 'PayExRate is required' : '',
          txnSettled: !table[table.length - 1].txnSettled ? 'Tax Settled is required' : '',
          gainOrLossAmt: !table[table.length - 1].gainOrLossAmt ? 'Gain Or Loss is required' : '',
          remarks: !table[table.length - 1].remarks ? 'remarks is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (rowId) => {
    setWithdrawalsTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  // const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
  //   const rowIndex = table.findIndex((row) => row.id === id);
  //   // If the row exists, proceed to delete
  //   if (rowIndex !== -1) {
  //     const updatedData = table.filter((row) => row.id !== id);
  //     const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
  //     setTable(updatedData);
  //     setErrorTable(updatedErrors);
  //   }
  // };

  const handleClear = () => {
    setFormData({
      paymentType: '',
      bankCharges: '',
      docId: '',
      docDate: null,
      type: '',
      partyCode: '',
      partyName: '',
      gstState: '',
      gstIn: '',
      bankCashAcc: '',
      paymentAmt: '',
      tdsAcc: '',
      tdsAmt: '',
      bankChargeAcc: '',
      payTo: '',
      currency: '',
      currencyAmt: '',
      serviceTaxAmt: '',
      chequeBank: '',
      chequeNo: '',
      bankInCurrency: '',
      staxInCurrency: '',
      chequeDate: null
    });

    // Set the table to only have one empty row
    setWithdrawalsTableData([
      {
        id: 1,
        sno: '',
        invNo: '',
        invDate: '',
        refNo: '',
        refDate: '',
        clearedDate: '',
        withdrawal: '',
        supplierRefDate: '',
        supplierRefNo: '',
        exRate: '',
        amount: '',
        currency: '',
        outstanding: '',
        settled: '',
        payExRate: '',
        txnSettled: '',
        gainOrLossAmt: '',
        remarks: ''
      }
    ]);

    // Reset table errors for just one row
    setWithdrawalsTableErrors([
      {
        sno: '',
        invNo: '',
        invDate: '',
        refNo: '',
        refDate: '',
        clearedDate: '',
        withdrawal: '',
        supplierRefDate: '',
        supplierRefNo: '',
        exRate: '',
        currency: '',
        amount: '',
        outstanding: '',
        settled: '',
        payExRate: '',
        txnSettled: '',
        gainOrLossAmt: '',
        remarks: ''
      }
    ]);

    // setValidationErrors({});
    setEditId('');
  };

  const handleList = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.paymentType) errors.paymentType = 'Payment Type is required';
    if (!formData.partyName) errors.partyName = 'Party Name is required';

    let detailsTableDataValid = true;
    // if (!withdrawalsTableData || withdrawalsTableData.length === 0) {
    //   detailsTableDataValid = false;
    //   setWithdrawalsTableErrors([{ general: 'detail Table Data is required' }]);
    // }
    // else {
    //   const newTableErrors = withdrawalsTableData.map((row, index) => {
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
    //   setWithdrawalsTableErrors(newTableErrors);
    // }
    // setFormDataErrors(errors);

    // if (Object.keys(errors).length === 0 && detailsTableDataValid) {
    if (detailsTableDataValid) {
      setIsLoading(true);

      const detailsVo = withdrawalsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        invNo: row.invNo,
        invDate: row.invDate,
        refNo: row.refNo,
        refDate: row.refDate,
        supplierRefDate: row.supplierRefDate,
        supplierRefNo: row.supplierRefNo,
        exRate: parseInt(row.exRate),
        currency: row.currency,
        amount: parseInt(row.amount),
        outstanding: parseInt(row.outstanding),
        settled: parseInt(row.settled),
        payExRate: parseInt(row.payExRate),
        txnSettled: parseInt(row.txnSettled),
        gainOrLossAmt: parseInt(row.gainOrLossAmt),
        remarks: row.remarks
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        // active: formData.active,
        paymentType: formData.paymentType,
        docId: formData.docId,
        docDate: formData.docDate,
        type: formData.type,
        partyCode: formData.partyCode,
        partyName: formData.partyName,
        gstState: formData.gstState,
        gstIn: formData.gstIn,
        bankCashAcc: formData.bankCashAcc,
        paymentAmt: parseInt(formData.paymentAmt),
        tdsAcc: formData.tdsAcc,
        tdsAmt: parseInt(formData.tdsAmt),
        bankChargeAcc: formData.bankChargeAcc,
        bankCharges: parseInt(formData.bankCharges),
        currencyAmt: parseInt(formData.currencyAmt),
        payTo: formData.payTo,
        currency: formData.currency,
        chequeBank: formData.chequeBank,
        chequeNo: formData.chequeNo,
        chequeDate: formData.chequeDate,
        bankInCurrency: formData.bankInCurrency,
        staxInCurrency: formData.staxInCurrency,
        paymentInvDtlsDTO: detailsVo,
        createdBy: loginUserName,
        orgId: orgId,
        serviceTaxAmt: parseInt(formData.serviceTaxAmt)
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/payable/updateCreatePayment', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Payment updated successfully' : 'Payment created successfully');
          getAllPayment();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Payment creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', ' Payment creation failed');
        setIsLoading(false);
      }
    } else {
      // setFieldErrors(errors);
    }
  };

  const getPaymentById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/payable/getAllPaymentById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.paymentVO[0];
        setEditId(row.original.id);

        setFormData({
          paymentType: listValueVO.paymentType,
          docId: listValueVO.docId,
          docDate: listValueVO.docDate,
          type: listValueVO.type,
          partyCode: listValueVO.partyCode,
          partyName: listValueVO.partyName,
          gstState: listValueVO.gstState,
          gstIn: listValueVO.gstIn,
          bankCashAcc: listValueVO.bankCashAcc,
          bankCharges: listValueVO.bankCharges,
          paymentAmt: listValueVO.paymentAmt,
          tdsAcc: listValueVO.tdsAcc,
          tdsAmt: listValueVO.tdsAmt,
          bankChargeAcc: listValueVO.bankChargeAcc,
          payTo: listValueVO.payTo,
          currency: listValueVO.currency,
          serviceTaxAmt: listValueVO.serviceTaxAmt,
          chequeBank: listValueVO.chequeBank,
          chequeNo: listValueVO.chequeNo,
          chequeDate: listValueVO.chequeDate,
          currencyAmt: listValueVO.currencyAmt,
          bankInCurrency: listValueVO.bankInCurrency,
          staxInCurrency: listValueVO.staxInCurrency
        });
        setWithdrawalsTableData(
          listValueVO.paymentInvDtlsVO.map((cl) => ({
            id: cl.id,
            invNo: cl.invNo,
            invDate: cl.invDate ? dayjs(cl.invDate) : null,
            refNo: cl.refNo,
            refDate: cl.refDate ? dayjs(cl.refDate) : null,
            supplierRefDate: cl.supplierRefDate ? dayjs(cl.supplierRefDate) : null,
            supplierRefNo: cl.supplierRefNo,
            exRate: cl.exRate,
            currency: cl.currency,
            amount: cl.amount,
            outstanding: cl.outstanding,
            settled: cl.settled,
            payExRate: cl.payExRate,
            txnSettled: cl.txnSettled,
            gainOrLossAmt: cl.gainOrLossAmt,
            remarks: cl.remarks
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

  const columns = [
    { accessorKey: 'paymentType', header: 'Payment Type', size: 140 },
    { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'type', header: 'Type', size: 140 },
    { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'gstState', header: 'GST State', size: 140 },
    { accessorKey: 'gstIn', header: 'GST In', size: 140 }
  ];

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex">
          <Grid container spacing={2} alignItems="center">
            <div className="d-flex flex-wrap justify-content-start p-2">
              <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            </div>
          </Grid>

          {showForm ? (
            <>
              {' '}
              <div className="row d-flex mt-3">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Payment Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Payment Type"
                      required
                      value={formData.paymentType}
                      onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    >
                      <MenuItem value={'BANK'}>BANK PAYMENT</MenuItem>
                      <MenuItem value={'CASH'}>CASH PAYMENT</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="docId"
                      label="Doc ID"
                      size="small"
                      onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                      value={formData.docId}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Doc Date"
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        value={formData.docDate ? dayjs(formData.docDate, 'DD-MM-YYYY') : null}
                        onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <MenuItem value={'AIR_CARRIER'}>AIR CARRIER</MenuItem>
                      <MenuItem value={'SEA_CARRIER'}>SEA CARRIER</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="partyCode"
                      label="Party Code"
                      value={formData.partyCode}
                      onChange={(e) => setFormData({ ...formData, partyCode: e.target.value })}
                      size="small"
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="partName"
                      label="party Name"
                      size="small"
                      value={formData.partyName}
                      onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">GST State</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="GST State"
                      // onChange={handleChange}
                      value={formData.gstState}
                      onChange={(e) => setFormData({ ...formData, gstState: e.target.value })}
                    >
                      <MenuItem value={'SGST'}>SGST</MenuItem>
                      <MenuItem value={'CGST'}>CGST</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gstIn"
                      label="GST In"
                      size="small"
                      value={formData.gstIn}
                      onChange={(e) => setFormData({ ...formData, gstIn: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="bank/cash Acc"
                      label="Bank/Cash Acc"
                      size="small"
                      //placeholder="accountcode"

                      value={formData.bankCashAcc}
                      onChange={(e) => setFormData({ ...formData, bankCashAcc: e.target.value })}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="paymentAmount"
                      label="PaymentAmount"
                      size="small"
                      value={formData.paymentAmt}
                      onChange={(e) => setFormData({ ...formData, paymentAmt: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="tdsAccount"
                      label="TDS Account"
                      size="small"
                      value={formData.tdsAcc}
                      onChange={(e) => setFormData({ ...formData, tdsAcc: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="tdsAmount"
                      label="TDS Amount"
                      size="small"
                      value={formData.tdsAmt}
                      onChange={(e) => setFormData({ ...formData, tdsAmt: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="Bank Charges A/c"
                      label="Bank Charges A/C"
                      size="small"
                      value={formData.bankChargeAcc}
                      onChange={(e) => setFormData({ ...formData, bankChargeAcc: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="bankCharges"
                      label="Bank Charges"
                      size="small"
                      //placeholder="accountcode"
                      inputProps={{ maxLength: 30 }}
                      value={formData.bankCharges}
                      onChange={(e) => setFormData({ ...formData, bankCharges: e.target.value })}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">In Currency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="In Currency"
                      value={formData.bankInCurrency}
                      onChange={(e) => setFormData({ ...formData, bankInCurrency: e.target.value })}
                      // onChange={handleChange}
                    >
                      <MenuItem value={'INR'}>INR</MenuItem>
                      <MenuItem value={'DOLLAR'}>DOLLAR</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="serviceTaxAmt"
                      label="S Tax Amount"
                      size="small"
                      //placeholder="accountcode"
                      inputProps={{ maxLength: 30 }}
                      value={formData.serviceTaxAmt}
                      onChange={(e) => setFormData({ ...formData, serviceTaxAmt: e.target.value })}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">In Currency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="In Currency"
                      value={formData.staxInCurrency}
                      onChange={(e) => setFormData({ ...formData, staxInCurrency: e.target.value })}
                    >
                      <MenuItem value={20}>INR</MenuItem>
                      <MenuItem value={10}>DOLLAR</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="chequeBank"
                      label="Cheque Bank"
                      size="small"
                      value={formData.chequeBank}
                      onChange={(e) => setFormData({ ...formData, chequeBank: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="chqNo"
                      label="chqNo"
                      size="small"
                      inputProps={{ maxLength: 30 }}
                      value={formData.chequeNo}
                      onChange={(e) => setFormData({ ...formData, chequeNo: e.target.value })}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  {/* <FormControl fullWidth variant="filled">
                    <TextField
                      id="chqDt"
                      label="Chq Dt"
                      size="small"
                      value={formData.chequeDate || null}
                      onChange={(e) => setFormData({ ...formData, chequeDate: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl> */}
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Chq Dt"
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        value={formData.chequeDate}
                        onChange={(newValue) => setFormData({ ...formData, chequeDate: newValue })}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="payTo"
                      label="Pay To"
                      size="small"
                      value={formData.payTo}
                      onChange={(e) => setFormData({ ...formData, payTo: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="Currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <MenuItem value={20}>INR</MenuItem>
                      <MenuItem value={10}>DOLLAR</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="currencyAmt"
                      // label="Currency Amt"
                      size="small"
                      value={formData.currencyAmt}
                      onChange={(e) => setFormData({ ...formData, currencyAmt: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChangeTab} textColor="secondary" indicatorColor="secondary">
                        <Tab label="Account Particulars" value="1" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      {/* <TableComponent formValues={formValues} setFormValues={setFormValues} /> */}
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
                                    <th className="px-2 py-2 text-white text-center">Invoice No</th>
                                    <th className="px-2 py-2 text-white text-center">Invoice Date</th>
                                    <th className="px-2 py-2 text-white text-center">Ref No</th>
                                    <th className="px-2 py-2 text-white text-center">Ref Date</th>
                                    <th className="px-2 py-2 text-white text-center">Supplier Ref No</th>
                                    <th className="px-2 py-2 text-white text-center">Supplier Ref Date</th>
                                    <th className="px-2 py-2 text-white text-center">Currency</th>
                                    <th className="px-2 py-2 text-white text-center">Ex Rate</th>
                                    <th className="px-2 py-2 text-white text-center">Amount</th>
                                    <th className="px-2 py-2 text-white text-center">Outstanding</th>
                                    <th className="px-2 py-2 text-white text-center">Settled</th>
                                    <th className="px-2 py-2 text-white text-center">Pay ExRate</th>
                                    <th className="px-2 py-2 text-white text-center">Tax Settled</th>
                                    <th className="px-2 py-2 text-white text-center">Gain Or Loss</th>
                                    <th className="px-2 py-2 text-white text-center">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(withdrawalsTableData) &&
                                    withdrawalsTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                withdrawalsTableData,
                                                setWithdrawalsTableData,
                                                withdrawalsTableErrors,
                                                setWithdrawalsTableErrors
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
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, invNo: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    invNo: !value ? 'invNo is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    invNo: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.invNo ? 'error form-control' : 'form-control'}
                                          />
                                          {withdrawalsTableErrors[index]?.invNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].invNo}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="date"
                                            value={row.invDate ? dayjs(row.invDate).format('YYYY-MM-DD') : ''}
                                            onChange={(e) => {
                                              const date = e.target.value;

                                              setWithdrawalsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, invDate: date } : r))
                                              );

                                              setWithdrawalsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  invDate: !date ? 'invDate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={withdrawalsTableErrors[index]?.invDate ? 'error form-control' : 'form-control'}
                                          />
                                          {withdrawalsTableErrors[index]?.invDate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].invDate}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.refNo}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, refNo: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], refNo: !value ? 'refNo is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], refNo: 'Only numeric characters are allowed' };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.refNo ? 'error form-control' : 'form-control'}
                                          />
                                          {withdrawalsTableErrors[index]?.refNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].refNo}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="date"
                                            value={row.refDate ? dayjs(row.refDate).format('YYYY-MM-DD') : ''}
                                            onChange={(e) => {
                                              const date = e.target.value;

                                              setWithdrawalsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, refDate: date } : r))
                                              );

                                              setWithdrawalsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  refDate: !date ? 'refDate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={withdrawalsTableErrors[index]?.refDate ? 'error form-control' : 'form-control'}
                                          />
                                          {withdrawalsTableErrors[index]?.refDate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].refDate}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.supplierRefNo}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, supplierRefNo: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    supplierRefNo: !value ? 'Eds is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    supplierRefNo: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.supplierRefNo ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.supplierRefNo && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].supplierRefNo}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="date"
                                            value={row.supplierRefDate ? dayjs(row.supplierRefDate).format('YYYY-MM-DD') : ''}
                                            onChange={(e) => {
                                              const date = e.target.value;

                                              setWithdrawalsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, supplierRefDate: date } : r))
                                              );

                                              setWithdrawalsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  supplierRefDate: !date ? 'supplierRefDate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={
                                              withdrawalsTableErrors[index]?.supplierRefDate ? 'error form-control' : 'form-control'
                                            }
                                          />
                                          {withdrawalsTableErrors[index]?.supplierRefDate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].supplierRefDate}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.currency}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], currency: !value ? 'Eds is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    currency: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.currency && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].currency}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.exRate}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], exRate: !value ? 'exRate is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    exRate: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.exRate ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.exRate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].exRate}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.amount}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], amount: !value ? 'Amount is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    amount: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.amount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].amount}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.outstanding}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, outstanding: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    outstanding: !value ? 'Outstanding is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    outstanding: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.outstanding ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.outstanding && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].outstanding}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.settled}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, settled: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], settled: !value ? 'Settled is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    settled: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.settled ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.settled && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].settled}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.payExRate}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, payExRate: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    payExRate: !value ? 'PayExRate is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    PayExRate: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.payExRate ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.payExRate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].payExRate}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.txnSettled}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, txnSettled: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    txnSettled: !value ? 'Tax Settled is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    txnSettled: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.txnSettled ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.txnSettled && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].txnSettled}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.gainOrLossAmt}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, gainOrLossAmt: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gainOrLossAmt: !value ? 'GainOrLossAmt is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gainOrLossAmt: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.gainOrLossAmt ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.gainOrLossAmt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].gainOrLossAmt}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.remarks}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    remarks: !value ? 'Remarks is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    remarks: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                            // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                          />
                                          {withdrawalsTableErrors[index]?.remarks && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].remarks}
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
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>{' '}
            </>
          ) : (
            <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getPaymentById} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
