import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, FormHelperText, Grid, Tab } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import GridOnIcon from '@mui/icons-material/GridOn';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
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
  const [branchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [partyName, setPartyName] = useState([]);
  const [gstState, setGSTState] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const [formData, setFormData] = useState({
    paymentType: 'BANK PAYMENT',
    partyName: '',
    partyCode: '',
    gstState: '',
    gstIn: '',
    paymentAmt: '',
    tdsAmt: '',
    chequeNo: '',
    chequeDate: null,
    payTo: '',
    currency: 'INR',
    docId: '',
    docDate: dayjs(),
    netAmount: '',
    onAccount: '',
    remarks: ''
  });

  const [formDataErrors, setFormDataErrors] = useState({
    paymentType: '',
    partyName: '',
    partyCode: '',
    gstState: '',
    gstIn: '',
    bankCharges: '',
    paymentAmt: '',
    tdsAcc: '',
    tdsAmt: '',
    bankChargeAcc: '',
    chequeNo: '',
    chequeDate: null,
    payTo: '',
    currency: '',
    docId: '',
    docDate: dayjs(),
    netAmount: '',
    onAccount: '',
    remarks: ''
  });

  const [withdrawalsTableData, setWithdrawalsTableData] = useState([]);
  const [withdrawalsTableErrors, setWithdrawalsTableErrors] = useState([
    {
      sno: '',
      invNo: '',
      invDate: '',
      refNo: '',
      refDate: '',
      currency: '',
      exRate: '',
      gstAmount: '',
      chargeAmt: '',
      amount: '',
      outstanding: '',
      settled: ''
    }
  ]);
  useEffect(() => {
    getAllPayment();
    getPaymentDocId();
    getPartName();
  }, []);

  useEffect(() => {
    if (partyName.length === 1) {
      const singleParty = partyName[0];
      handleSelectChange({ target: { value: singleParty.partyName } });
    }
  }, [partyName]);

  const getAllPayment = async () => {
    try {
      const result = await apiCalls('get', `/payable/getAllPaymentByOrgId?branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`);
      setData(result.paramObjectsMap.paymentVO.reverse());
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getPaymentDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPaymentDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.paymentDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getPartName = async () => {
    try {
      const response = await apiCalls('get', `/payable/getPartyNameAndPartyCode?orgId=${orgId}`);
      setPartyName(response.paramObjectsMap.PartyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getGSTState = async (pname) => {
    try {
      const response = await apiCalls('get', `/payable/getPartyNameAndCodeForPayment?orgId=${orgId}&partyName=${pname}`);
      setGSTState(response.paramObjectsMap.PartyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      sno: '',
      invNo: '',
      invDate: '',
      refNo: '',
      refDate: '',
      supplierRefDate: '',
      supplierRefNo: '',
      currency: 'INR',
      amount: '',
      outstanding: '',
      settled: ''
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
        supplierRefNo: '',
        supplierRefDate: '',
        currency: '',
        amount: '',
        outstanding: '',
        settled: ''
      }
    ]);
  };

  const handleDeleteRow = (rowId) => {
    setWithdrawalsTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleClear = () => {
    setFormData({
      bankCashAcc: '',
      paymentType: 'BANK PAYMENT',
      partyName: '',
      partyCode: '',
      gstState: '',
      gstIn: '',
      bankCharges: '',
      paymentAmt: '',
      tdsAcc: '',
      tdsAmt: '',
      bankChargeAcc: '',
      chequeNo: '',
      chequeDate: null,
      payTo: '',
      currency: 'INR',
      docId: '',
      docDate: dayjs(),
      netAmount: '',
      onAccount: '',
      remarks: ''
    });
    setWithdrawalsTableData([]);
    setWithdrawalsTableErrors([
      {
        sno: '',
        invNo: '',
        invDate: '',
        refNo: '',
        refDate: '',
        supplierRefDate: '',
        supplierRefNo: '',
        currency: '',
        exRate: '',
        gstAmount: '',
        chargeAmt: '',
        amount: '',
        outstanding: '',
        settled: ''
      }
    ]);
    setFormDataErrors([
      {
        paymentType: 'BANK PAYMENT',
        partyName: '',
        partyCode: '',
        gstState: '',
        gstIn: '',
        bankCharges: '',
        paymentAmt: '',
        tdsAcc: '',
        tdsAmt: '',
        bankChargeAcc: '',
        chequeNo: '',
        chequeDate: null,
        payTo: '',
        currency: '',
        docId: '',
        docDate: dayjs(),
        netAmount: '',
        onAccount: '',
        remarks: ''
      }
    ]);
    setEditId('');
    getPaymentDocId();
  };
  const handleList = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    let errors = {};
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.paymentAmt) {
      errors.paymentAmt = 'Payment Amount is required';
    }
    setFormDataErrors(errors);
    let detailsTableDataValid = true;
    if (detailsTableDataValid) {
      setIsLoading(true);

      const detailsVo = withdrawalsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        invNo: row.invNo,
        invDate: row.invDate,
        refNo: row.refNo,
        refDate: row.refDate,
        currency: row.currency,
        exRate: row.exRate,
        amount: parseInt(row.amount),
        gstAmount: parseInt(row.gstAmount),
        // chargeAmt: row.chargeAmt,
        outStanding: parseInt(row.outstanding),
        settled: parseInt(row.settled)
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        paymentType: formData.paymentType,
        docId: formData.docId,
        docDate: formData.docDate ? dayjs(formData.docDate).format('YYYY-MM-DD') : null,
        partyCode: formData.partyCode,
        partyName: formData.partyName,
        gstState: formData.gstState,
        gstIn: formData.gstIn,
        paymentAmt: parseInt(formData.paymentAmt),
        tdsAmt: parseInt(formData.tdsAmt),
        payTo: formData.payTo,
        currency: formData.currency,
        chequeNo: formData.chequeNo,
        chequeDate: formData.chequeDate ? dayjs(formData.chequeDate).format('YYYY-MM-DD') : null,
        remarks: formData.remarks,
        paymentInvDtlsDTO: detailsVo,
        createdBy: loginUserName,
        orgId: orgId,
        finYear: finYear,
        branch: branch,
        branchCode: branchCode
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
        showToast('error', 'Payment creation failed');
        setIsLoading(false);
      }
    } else {
      setFormDataErrors(errors);
    }
  };
  const getPaymentById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/payable/getPaymentById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.paymentVO[0];
        setEditId(row.original.id);
        getGSTState(listValueVO.partyName);
        setFormData({
          paymentType: listValueVO.paymentType,
          docId: listValueVO.docId,
          docDate: listValueVO.docDate,
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
          chequeNo: listValueVO.chequeNo,
          chequeDate: listValueVO.chequeDate,
          currencyAmt: listValueVO.currencyAmt,
          onAccount: listValueVO.onAccount,
          netAmount: listValueVO.netAmount
        });
        setWithdrawalsTableData(
          listValueVO.paymentInvDtlsVO.map((cl) => ({
            id: cl.id,
            invNo: cl.invNo,
            invDate: cl.invDate ? dayjs(cl.invDate) : null,
            refNo: cl.refNo,
            refDate: cl.refDate ? dayjs(cl.refDate) : null,
            currency: cl.currency,
            exRate: cl.exRate,
            chargeAmt: cl.chargeAmt,
            gstAmount: cl.gstAmount,
            amount: cl.amount,
            outstanding: cl.outstanding,
            settled: cl.settled
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
    { accessorKey: 'gstState', header: 'Reg State', size: 140 },
    { accessorKey: 'gstIn', header: 'Reg In', size: 140 }
  ];
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'partyName') {
      setFormDataErrors((prevErrors) => ({
        ...prevErrors,
        partyName: ''
      }));
    }
    console.log('Selected employeeCode value:', value);
    partyName.forEach((emp, index) => {
      console.log(`Employee ${index}:`, emp);
    });
    const selectedEmp = partyName.find((emp) => emp.partyName === value);
    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        partyName: selectedEmp.partyName,
        partyCode: selectedEmp.partyCode
      }));
      getGSTState(selectedEmp.partyName);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };
  const handleSelectGst = (e) => {
    const value = e.target.value;
    const selectedEmp = gstState.find((emp) => emp.stateCode === value);
    if (selectedEmp.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        gstState: selectedEmp.stateCode,
        gstIn: selectedEmp.gstin,
        currency: selectedEmp.currency
      }));
    } else if (selectedEmp) {
      setFormData((prevData) => ({
        ...prevData,
        gstState: selectedEmp.stateCode,
        gstIn: selectedEmp.gstin,
        currency: selectedEmp.currency
      }));
    } else {
      console.log('No employee found with the given code:', value);
    }
  };
  useEffect(() => {
    if (!editId) calculateTotals();
  }, [withdrawalsTableData, formData.paymentAmt]);
  const calculateTotals = () => {
    let totalChargeAmt = 0;
    let totalSettledAmt = 0;

    const updatedInvoiceDetails = withdrawalsTableData.map((row, index) => {
      const billAmount = parseFloat(row.amount || 0);
      const gstAmt = parseFloat(row.gstAmt || 0);
      const chargeAmount = parseFloat(row.chargeAmt || 0);
      const tdsPercent = parseFloat(row.tds || 0);
      const settledAmt = parseFloat(row.settled || 0);
      totalSettledAmt += settledAmt;
      const gross = billAmount + gstAmt;
      const tdsAmt = (gross * tdsPercent) / 100;
      const netReceivable = chargeAmount - tdsAmt;
      const outstandingAmt = netReceivable - settledAmt;
      totalChargeAmt += netReceivable;

      return {
        ...row,
        // chargeAmt: netReceivable.toFixed(2),
        tdsAmt: netReceivable.toFixed(2),
        outstanding: outstandingAmt.toFixed(2)
      };
    });

    const paymentAmt = parseFloat(formData.paymentAmt || 0);
    const onAccount = paymentAmt >= totalSettledAmt ? paymentAmt - totalSettledAmt : 0;
    setWithdrawalsTableData(updatedInvoiceDetails);
    setFormData((prev) => ({
      ...prev,
      netAmount: totalChargeAmt.toFixed(2),
      onAccount: onAccount
    }));
  };
  const handleFullGrid = () => {
    if (formData.partyCode) {
      // if (formData.partyCode && formData.gstState) {
      setModalOpen(true);
      getAllFillGrid();
    } else {
      setModalOpen(false);
      // showToast('warning', (formData.partyName && formData.gstState) ? `${formData.partyName} has No Data` : 'Please Select Party Name & Reg State');
      showToast('warning', formData.partyName ? `${formData.partyName} has No Data` : 'Please Select Party Name');
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
        return !withdrawalsTableData.some((item) => item.invNo === data.vid && item.invDate === data.vdate);
      })
      .map((data) => ({
        id: Date.now() + Math.random(),
        invNo: data.vid || '',
        invDate: data.vdate ? dayjs(data.vdate).format('YYYY-MM-DD') : null,
        currency: data.acccurrency || '',
        exRate: data.exrate || '',
        refNo: data.refno || '',
        refDate: data.refdate || '',
        amount: data.billamount || '',
        gstAmount: parseFloat(data.gstamount) || 0,
        chargeAmt: data.chargeAmt || ''
      }));

    if (newData.length < selectedData.length) {
      showToast('warning', 'Some of the selected items are already added!');
    }
    if (newData.length === 0) {
      return;
    }
    setWithdrawalsTableData((prev) => [...prev, ...newData]);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };
  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPaymentFillGrid?branchCode=${branchCode}&orgId=${orgId}&partyCode=${formData.partyCode}`
        // `/payable/getPaymentFillGrid?branchCode=${branchCode}&orgId=${orgId}&partyCode=${formData.partyCode}&stateCode=${formData.gstState}`
      );
      if (response.status === true) {
        setFillGridData(response.paramObjectsMap.paymentfillgrid);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex">
          {/* <Grid container spacing={2} alignItems="center"> */}
          <div className="d-flex flex-wrap justify-content-end p-2">
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>
          {/* </Grid> */}

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
                      label="Payment Mode"
                      required
                      value={formData.paymentType}
                      onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                      error={!!formDataErrors.paymentType}
                    >
                      <MenuItem value={'BANK PAYMENT'}>BANK PAYMENT</MenuItem>
                      <MenuItem value={'CASH PAYMENT'}>CASH PAYMENT</MenuItem>
                    </Select>
                    {formDataErrors.paymentType && (
                      <FormHelperText error style={{ color: 'red' }}>
                        {formDataErrors.paymentType}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="docId" label="Doc No" disabled size="small" value={formData.docId} inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Doc Date"
                        format="DD-MM-YYYY"
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        value={formData.docDate ? dayjs(formData.docDate) : null}
                        onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label-party">Party Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-party"
                      id="demo-simple-select-party"
                      label="Party Name"
                      name="partyName"
                      required
                      value={formData.partyName || (partyName.length === 1 ? partyName[0].partyName : '')}
                      onChange={handleSelectChange}
                      error={!!formDataErrors.partyName}
                    >
                      {partyName.length > 0 &&
                        partyName.map((par, index) => (
                          <MenuItem key={index} value={par.partyName}>
                            {par.partyName}
                          </MenuItem>
                        ))}
                    </Select>
                    {formDataErrors.partyName && (
                      <FormHelperText error style={{ color: 'red' }}>
                        {formDataErrors.partyName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Reg State</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Reg State"
                      value={formData.gstState || (gstState.length === 1 ? gstState[0].gstState : '')}
                      onChange={handleSelectGst}
                      error={!!formDataErrors.gstState}
                    >
                      {gstState.length > 0 &&
                        gstState.map((par, index) => (
                          <MenuItem key={index} value={par.stateCode}>
                            {par.stateCode}
                          </MenuItem>
                        ))}
                    </Select>
                    {formDataErrors.gstState && (
                      <FormHelperText error style={{ color: 'red' }}>
                        {formDataErrors.gstState}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="gstIn"
                      label="Reg In"
                      disabled
                      size="small"
                      value={formData.gstIn}
                      onChange={(e) => setFormData({ ...formData, gstIn: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                      error={!!formDataErrors.gstIn}
                      helperText={formDataErrors.gstIn}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="paymentAmount"
                      label="Payment Amount"
                      size="small"
                      value={formData.paymentAmt}
                      onChange={(e) => {
                        setFormData({ ...formData, paymentAmt: e.target.value });
                        // if (e.target.value) {
                        setFormDataErrors((prevErrors) => ({
                          ...prevErrors,
                          paymentAmt: ''
                        }));
                        // }
                      }}
                      inputProps={{ maxLength: 30 }}
                      error={!!formDataErrors.paymentAmt}
                      helperText={formDataErrors.paymentAmt}
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
                      error={!!formDataErrors.tdsAmt}
                      helperText={formDataErrors.tdsAmt}
                    />
                  </FormControl>
                </div>
                <div className="col-md-6 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="chequeNo"
                      name="chequeNo"
                      label="UTR No"
                      size="small"
                      value={formData.chequeNo}
                      onChange={(e) => setFormData({ ...formData, chequeNo: e.target.value })}
                      inputProps={{ maxLength: 100 }}
                      error={!!formDataErrors.chequeNo}
                      helperText={formDataErrors.chequeNo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="UTR Date"
                        value={formData.chequeDate ? dayjs(formData.chequeDate, 'YYYY-MM-DD') : null}
                        onChange={(newValue) => setFormData({ ...formData, chequeDate: newValue })}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!formDataErrors.chequeDate}
                        helperText={formDataErrors.chequeDate ? formDataErrors.chequeDate : ''}
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
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChangeTab} textColor="secondary" indicatorColor="secondary">
                        <Tab label="Account Particulars" value="1" />
                        <Tab label="Summary" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <div className="row d-flex ml">
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
                                    <th className="px-2 py-2 text-white text-center">Date</th>
                                    <th className="px-2 py-2 text-white text-center">Ref No</th>
                                    <th className="px-2 py-2 text-white text-center">Ref Date</th>
                                    <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                                    <th className="px-2 py-2 text-white text-center">TAX</th>
                                    <th className="px-2 py-2 text-white text-center">Currency</th>
                                    <th className="px-2 py-2 text-white text-center">Ex. Rate</th>
                                    <th className="px-2 py-2 text-white text-center">Amount</th>
                                    <th className="px-2 py-2 text-white text-center">Outstanding</th>
                                    <th className="px-2 py-2 text-white text-center">Settled</th>
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
                                            style={{ width: '170px' }}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setWithdrawalsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, invNo: value } : r))
                                              );
                                              setWithdrawalsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  invNo: !value ? 'Inv No is required' : ''
                                                };
                                                return newErrors;
                                              });
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
                                            disabled
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
                                                  invDate: !date ? 'Inv Date is required' : ''
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
                                            disabled
                                            value={row.refNo}
                                            style={{ width: '170px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setWithdrawalsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, refNo: value } : r))
                                              );
                                              setWithdrawalsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], refNo: !value ? 'Ref No is required' : '' };
                                                return newErrors;
                                              });
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
                                            disabled
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
                                                  refDate: !date ? 'Ref Date is required' : ''
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
                                            value={row.amount}
                                            disabled
                                            style={{ width: '120px' }}
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
                                            value={row.gstAmount}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, gstAmount: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gstAmount: !value ? 'Tax Amt is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gstAmount: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.gstAmount ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {withdrawalsTableErrors[index]?.gstAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].gstAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <select
                                            value={row.currency}
                                            style={{ width: '100px' }}
                                            disabled
                                            onChange={(e) => {
                                              const selectedCurrency = e.target.value;
                                              const updatedCurrencyData = [...withdrawalsTableData];
                                              updatedCurrencyData[index] = {
                                                ...updatedCurrencyData[index],
                                                currency: selectedCurrency
                                              };
                                              setWithdrawalsTableData(updatedCurrencyData);
                                            }}
                                            className={withdrawalsTableErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                          >
                                            {gstState?.map((currency, index) => (
                                              <option key={index} value={currency.currency}>
                                                {currency.currency}
                                              </option>
                                            ))}
                                          </select>
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
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;

                                              if (isNumeric.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], exRate: !value ? 'Ex Rate is required' : '' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], exRate: 'Only numbers are allowed' };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.exRate ? 'error form-control' : 'form-control'}
                                            style={{ width: '100px' }}
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
                                            value={row.chargeAmt}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setWithdrawalsTableData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, chargeAmt: value } : r))
                                                );
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = { ...newErrors[index], chargeAmt: 'Only numbers are allowed' };
                                                  return newErrors;
                                                });
                                              } else {
                                                setWithdrawalsTableErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    chargeAmt: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={withdrawalsTableErrors[index]?.chargeAmt ? 'error form-control' : 'form-control'}
                                            style={{ width: '130px' }}
                                          />
                                          {withdrawalsTableErrors[index]?.chargeAmt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].chargeAmt}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            disabled
                                            value={row.outstanding}
                                            style={{ width: '120px' }}
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
                                            disabled={editId}
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
                                          />
                                          {withdrawalsTableErrors[index]?.settled && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {withdrawalsTableErrors[index].settled}
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
                    <TabPanel value="2">
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
                                onChange={(newValue) => setFormData({ ...formData, netAmount: newValue })}
                                inputProps={{ maxLength: 30 }}
                                error={!!formDataErrors.netAmount}
                                helperText={formDataErrors.netAmount}
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
                                error={!!formDataErrors.onAccount}
                                helperText={formDataErrors.onAccount}
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
                                onChange={(newValue) => setFormData({ ...formData, remarks: newValue })}
                                inputProps={{ maxLength: 30 }}
                                error={!!formDataErrors.remarks}
                                helperText={formDataErrors.remarks}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
                {/* {fillGridData && fillGridData.length > 0 ?  */}
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
                                  <Checkbox
                                    sx={{
                                      color: 'white',
                                      '&.Mui-checked': {
                                        color: 'white'
                                      }
                                    }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
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
                                    {row.chargeAmt || 0}
                                  </td>
                                  {/* <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeAmt || 0}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeAmt || 0}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeAmt || 0}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeAmt || 0}
                                      </td> */}
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
                    <Button color="secondary" onClick={handleSubmitSelectedRows} variant="contained" sx={{ backgroundColor: '#673AB7' }}>
                      Proceed
                    </Button>
                  </DialogActions>
                </Dialog>
                {/*   : showToast('warning','No Data Found for Selected Customer')} */}
              </div>
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
