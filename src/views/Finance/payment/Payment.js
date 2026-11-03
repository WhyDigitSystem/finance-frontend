import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Stack, Tab } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ConfirmationModal from 'utils/confirmationPopup';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

// ---------- helpers ----------
const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const initialFormData = () => ({
  type: 'PARTY',
  paymentType: 'BANK PAYMENT',
  partyName: '',
  ledgerName: '',
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
  remarks: '',
  status: 'EDIT',
  approveStatus: '',
  approveBy: '',
  approveOn: '',
  bankCashAcc: ''
});

// Maps a payment VO coming from the backend to the form state shape
const mapVoToForm = (vo) => ({
  type: vo.type || '',
  paymentType: vo.paymentType || '',
  docId: vo.docId || '',
  docDate: vo.docDate,
  partyCode: vo.partyCode || '',
  partyName: vo.partyName || '',
  ledgerName: vo.ledgerName || '',
  remarks: vo.remarks || '',
  gstState: vo.gstState || '',
  gstIn: vo.gstIn || '',
  bankCashAcc: vo.bankCashAcc || '',
  bankCharges: vo.bankCharges || '',
  paymentAmt: vo.paymentAmt || '',
  tdsAcc: vo.tdsAcc || '',
  tdsAmt: vo.tdsAmt || '',
  bankChargeAcc: vo.bankChargeAcc || '',
  payTo: vo.payTo || '',
  currency: vo.currency || '',
  chequeNo: vo.chequeNo || '',
  chequeDate: vo.chequeDate || null,
  currencyAmt: vo.currencyAmt || '',
  onAccount: vo.onAccount ?? '',
  netAmount: vo.netAmount ?? '',
  status: vo.status || '',
  approveBy: vo.approveBy || '',
  approveOn: vo.approveOn || '',
  approveStatus: vo.approveStatus || ''
});

const mapVoToRows = (vo) =>
  (vo.paymentInvDtlsVO || []).map((cl) => ({
    id: cl.id || Date.now() + Math.random(),
    invNo: cl.invNo || '',
    invDate: cl.invDate ? dayjs(cl.invDate) : null,
    refNo: cl.refNo || '',
    refDate: cl.refDate ? dayjs(cl.refDate) : null,
    vid: cl.vid || '',
    vdate: cl.vdate || '',
    currency: cl.currency || '',
    exRate: cl.exRate ?? '',
    chargeAmt: cl.chargeAmt ?? '',
    gstAmount: cl.gstAmount ?? '',
    totalAmt: cl.totalAmt ?? '', // NEW
    amount: cl.amount ?? '',
    outstanding: cl.outstanding ?? cl.outStanding ?? '',
    settled: cl.settled ?? ''
  }));

// The fill-grid API mixes casing (refno / refNo, refdate / refDate). Normalize once.
const normalizeFillGridRow = (r) => ({
  ...r,
  key: r.arapDetailsId ?? `${r.refno || r.refNo}-${r.refdate || r.refDate}`,
  refNo: r.refno ?? r.refNo ?? '',
  refDate: r.refdate ?? r.refDate ?? '',
  vid: r.vid ?? '',
  vdate: r.vdate ?? '',
  billAmount: r.billamount ?? r.billAmount ?? '',
  gstAmount: r.gstamount ?? r.gstAmount ?? '',
  totalAmt: r.amount ?? r.totalAmt ?? '', // NEW
  chargeAmt: r.chargeAmt ?? r.chargeamt ?? '',
  currency: r.acccurrency ?? r.currency ?? '',
  exRate: r.exrate ?? r.exRate ?? ''
});

const cellStyle = { whiteSpace: 'nowrap' };

const Payment = ({ selectedRow }) => {
  const [value, setValue] = useState('1');
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName] = useState(localStorage.getItem('userName'));
  const [branchCode] = useState(localStorage.getItem('branchcode'));
  const [branch] = useState(localStorage.getItem('branch'));
  const [finYear] = useState(localStorage.getItem('finYear'));
  const [partyName, setPartyName] = useState([]);
  const [gstState, setGSTState] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [approveStatus, setApproveStatus] = useState('');
  const [modalApprove, setModalApprove] = useState(false);
  const [listViewData, setListViewData] = useState({});
  const [bankName, setBankName] = useState([]);

  const [formData, setFormData] = useState(initialFormData());
  const [formDataErrors, setFormDataErrors] = useState({});
  const [withdrawalsTableData, setWithdrawalsTableData] = useState([]);
  // errors for the "settled" input, keyed by row id
  const [rowErrors, setRowErrors] = useState({});

  const handleChangeTab = (event, newValue) => setValue(newValue);

  // ---------- effects ----------
  useEffect(() => {
    if (selectedRow) {
      getPaymentById({ original: selectedRow });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  useEffect(() => {
    getAllPayment();
    getPaymentDocId();
    getPartName();
    bankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select the party when only one exists (new entries only)
  useEffect(() => {
    if (!editId && partyName.length === 1 && !formData.partyName) {
      handleSelectChange({ target: { name: 'partyName', value: partyName[0].partyName } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyName]);

  // Net amount / on account follow the settled amounts and the payment amount
  useEffect(() => {
    if (formData.status !== 'EDIT') return;
    const totalSettled = withdrawalsTableData.reduce((sum, r) => sum + toNum(r.settled), 0);
    const paymentAmt = toNum(formData.paymentAmt);
    const onAccount = paymentAmt >= totalSettled ? paymentAmt - totalSettled : 0;
    setFormData((prev) => ({
      ...prev,
      netAmount: totalSettled.toFixed(2),
      onAccount: onAccount.toFixed(2)
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawalsTableData, formData.paymentAmt]);

  // ---------- API calls ----------
  const getAllPayment = async () => {
    try {
      const result = await apiCalls('get', `/payable/getAllPaymentByOrgId?branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`);
      setData([...(result.paramObjectsMap.paymentVO || [])].reverse());
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
      const { paymentDocId, docDate } = response.paramObjectsMap;
      setFormData((prevData) => ({
        ...prevData,
        docId: paymentDocId,
        docDate: docDate ? dayjs(docDate) : null
      }));
    } catch (error) {
      console.error('Error fetching doc id:', error);
    }
  };

  const getPartName = async () => {
    try {
      const response = await apiCalls('get', `/payable/getPartyNameAndPartyCode?orgId=${orgId}`);
      setPartyName(response.paramObjectsMap.PartyMasterVO || []);
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  // keepExisting = true when editing a saved payment, so saved values are not wiped
  const getGSTState = async (pname, keepExisting = false) => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPartyNameAndCodeForPayment?orgId=${orgId}&partyName=${encodeURIComponent(pname)}`
      );
      const states = response.paramObjectsMap?.PartyMasterVO || [];
      setGSTState(states);

      if (keepExisting) return;

      if (states.length === 1) {
        setFormData((prev) => ({
          ...prev,
          gstState: states[0].stateCode,
          gstIn: states[0].gstin || '',
          currency: states[0].currency || 'INR'
        }));
      } else {
        setFormData((prev) => ({ ...prev, gstState: '', gstIn: '', currency: 'INR' }));
      }
    } catch (error) {
      console.error('Error fetching GST state:', error);
      setGSTState([]);
    }
  };

  const bankList = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getBankNameForGroupLedger?orgId=${orgId}`);
      setBankName(response.paramObjectsMap.accountName || []);
    } catch (error) {
      console.error('Error fetching bank list:', error);
    }
  };

  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPaymentFillGrid?branchCode=${branchCode}&orgId=${orgId}&partyCode=${formData.partyCode}`
      );
      if (response.status === true) {
        setFillGridData((response.paramObjectsMap.paymentfillgrid || []).map(normalizeFillGridRow));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching fill grid:', error);
    }
  };

  const getPaymentById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/payable/getPaymentById?id=${row.original.id}`);
      if (result) {
        const vo = result.paramObjectsMap.paymentVO[0];
        setListViewData(vo);
        setEditId(row.original.id);
        getGSTState(vo.partyName, true);
        setFormData(mapVoToForm(vo));
        setWithdrawalsTableData(mapVoToRows(vo));
        setRowErrors({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ---------- handlers ----------
  const handleDeleteRow = (rowId) => {
    setWithdrawalsTableData((prev) => prev.filter((row) => row.id !== rowId));
    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };

  const handleClear = () => {
    setFormData(initialFormData());
    setWithdrawalsTableData([]);
    setRowErrors({});
    setFormDataErrors({});
    setGSTState([]);
    setEditId('');
    setListViewData({});
    getPaymentDocId();
  };

  const handleList = () => setShowForm(!showForm);

  const handleView = () => {
    setShowForm(!showForm);
    handleClear();
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'partyName') {
      const selectedParty = partyName.find((emp) => emp.partyName === value);
      if (selectedParty) {
        setFormData((prev) => ({
          ...prev,
          partyName: selectedParty.partyName,
          partyCode: selectedParty.partyCode,
          gstState: '',
          gstIn: '',
          currency: 'INR'
        }));
        setFormDataErrors((prev) => ({ ...prev, partyName: '' }));
        getGSTState(selectedParty.partyName);
      }
    }
  };

  const handleSelectGst = (e) => {
    const selectedEmp = gstState.find((emp) => emp.stateCode === e.target.value);
    if (selectedEmp) {
      setFormData((prev) => ({
        ...prev,
        gstState: selectedEmp.stateCode,
        gstIn: selectedEmp.gstin || '',
        currency: selectedEmp.currency || 'INR'
      }));
    }
  };

  const handleSettledChange = (row, rawValue) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
      setRowErrors((prev) => ({ ...prev, [row.id]: 'Only numeric characters are allowed' }));
      return;
    }

    const settled = toNum(rawValue);
    const updated = withdrawalsTableData.map((r) =>
      r.id === row.id ? { ...r, settled: rawValue, outstanding: (toNum(r.chargeAmt) - settled).toFixed(2) } : r
    );
    setWithdrawalsTableData(updated);

    const totalSettled = updated.reduce((sum, r) => sum + toNum(r.settled), 0);
    let message = '';
    if (!rawValue) {
      message = 'Settled is required';
    } else if (settled > toNum(row.chargeAmt)) {
      message = `Settled can't exceed the receivable (${row.chargeAmt})`;
    } else if (totalSettled > toNum(formData.paymentAmt)) {
      message = `Total settled can't exceed payment amount`;
    }
    setRowErrors((prev) => ({ ...prev, [row.id]: message }));
  };

  const handleFullGrid = () => {
    if (formData.partyCode) {
      setModalOpen(true);
      getAllFillGrid();
    } else {
      setModalOpen(false);
      showToast('warning', formData.partyName ? `${formData.partyName} has No Data` : 'Please Select Party Name');
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(fillGridData.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmitSelectedRows = () => {
    const selectedData = selectedRows.map((index) => fillGridData[index]);

    const newData = selectedData
      .filter((d) => !withdrawalsTableData.some((item) => item.invNo === d.refNo))
      .map((d) => ({
        id: Date.now() + Math.random(),
        invNo: d.refNo,
        invDate: d.refDate ? dayjs(d.refDate).format('YYYY-MM-DD') : null,
        refNo: d.refNo,
        refDate: d.refDate ? dayjs(d.refDate).format('YYYY-MM-DD') : null,
        vid: d.vid || '',
        vdate: d.vdate || '',
        currency: d.currency || 'INR',
        exRate: d.exRate,
        amount: d.billAmount,
        gstAmount: toNum(d.gstAmount),
        totalAmt: toNum(d.totalAmt), // NEW
        chargeAmt: d.chargeAmt,
        outstanding: toNum(d.chargeAmt).toFixed(2),
        settled: ''
      }));

    if (newData.length < selectedData.length) {
      showToast('warning', 'Some of the selected items are already added!');
    }
    if (newData.length === 0) return;

    setWithdrawalsTableData((prev) => [...prev, ...newData]);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.paymentAmt) {
      errors.paymentAmt = 'Payment Amount is required';
    } else if (!/^[0-9]*\.?[0-9]*$/.test(String(formData.paymentAmt))) {
      errors.paymentAmt = 'Only numeric characters are allowed';
    }
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.bankCashAcc) errors.bankCashAcc = 'Cash Account is required';

    setFormDataErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const totalSettled = withdrawalsTableData.reduce((sum, r) => sum + toNum(r.settled), 0);
    if (Object.values(rowErrors).some(Boolean)) {
      showToast('warning', 'Please fix the errors in the invoice rows');
      return;
    }
    if (totalSettled > toNum(formData.paymentAmt)) {
      showToast('warning', `Total settled amount can't exceed payment amount`);
      return;
    }

    setIsLoading(true);

    const detailsVo = withdrawalsTableData.map((row) => ({
      ...(editId && { id: row.id }),
      invNo: row.invNo,
      invDate: row.invDate ? dayjs(row.invDate).format('YYYY-MM-DD') : null,
      refNo: row.refNo,
      refDate: row.refDate ? dayjs(row.refDate).format('YYYY-MM-DD') : null,
      vid: row.vid,
      vdate: row.vdate ? dayjs(row.vdate).format('YYYY-MM-DD') : null,
      currency: row.currency,
      exRate: toNum(row.exRate),
      amount: toNum(row.amount),
      gstAmount: toNum(row.gstAmount),
      totalAmt: toNum(row.totalAmt), // NEW
      chargeAmt: toNum(row.chargeAmt),
      outStanding: toNum(row.outstanding),
      settled: toNum(row.settled)
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      type: 'PARTY',
      paymentType: formData.paymentType,
      docId: formData.docId,
      docDate: formData.docDate ? dayjs(formData.docDate).format('YYYY-MM-DD') : null,
      partyCode: formData.partyCode,
      partyName: formData.partyName,
      ledgerName: formData.ledgerName,
      gstState: formData.gstState,
      gstIn: formData.gstIn,
      paymentAmt: toNum(formData.paymentAmt),
      tdsAmt: toNum(formData.tdsAmt),
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
      branchCode: branchCode,
      status: formData.status,
      bankCashAcc: formData.bankCashAcc,
      approveStatus: formData.approveStatus,
      approveBy: formData.approveBy,
      approveOn: formData.approveOn
    };

    try {
      const response = await apiCalls('put', '/payable/updateCreatePayment', saveFormData);
      if (response.status === true) {
        showToast('success', editId ? ' Payment updated successfully' : 'Payment created successfully');
        getAllPayment();
        handleClear();
      } else {
        showToast('error', response.paramObjectsMap?.errorMessage || 'Payment creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Payment creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModalApprove = () => {
    setModalApprove(true);
    setApproveStatus('Approved');
  };
  const handleOpenModalReject = () => {
    setModalApprove(true);
    setApproveStatus('Rejected');
  };
  const handleCloseApprove = () => setModalApprove(false);

  const handleConfirmAction = async () => {
    try {
      const result = await apiCalls(
        'put',
        `/payable/approvePayment?action=${approveStatus}&actionBy=${loginUserName}&docId=${formData.docId}&id=${editId}&orgId=${orgId}`
      );
      if (result.status === true) {
        // NOTE: confirm the backend really returns the payment under "taxInvoiceVO" for this endpoint
        const vo = result.paramObjectsMap.taxInvoiceVO;
        showToast(
          vo.approveStatus === 'Approved' ? 'success' : 'error',
          vo.approveStatus === 'Approved' ? ' Payment Approved Successfully' : 'Payment Rejected Successfully'
        );
        setListViewData(vo);
        setFormData(mapVoToForm(vo));
        setWithdrawalsTableData(mapVoToRows(vo));
        handleCloseApprove();
        getAllPayment();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Action failed');
        handleCloseApprove();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Action failed');
      handleCloseApprove();
    }
  };

  const columns = [
    { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'gstState', header: 'Reg State', size: 140 },
    { accessorKey: 'gstIn', header: 'Reg In', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 100 },
    { accessorKey: 'approveStatus', header: 'Approve Status', size: 140 }
  ];

  const isSubmitted = formData.status === 'SUBMIT';

  // ---------- render ----------
  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex">
          <div className="row d-flex align-items-center">
            <div className="col d-flex justify-content-start align-items-center">
              {editId && showForm && (listViewData.status === 'SUBMIT' || isSubmitted) && (
                <>
                  {formData.approveStatus === 'Approved' && (
                    <Stack direction="row" spacing={2}>
                      <Chip label={`Approved By: ${formData.approveBy}`} variant="outlined" color="success" />
                      <Chip label={`Approved On: ${formData.approveOn}`} variant="outlined" color="success" />
                    </Stack>
                  )}
                  {formData.approveStatus === 'Rejected' && (
                    <Stack direction="row" spacing={2}>
                      <Chip label={`Rejected By: ${formData.approveBy}`} variant="outlined" color="error" />
                      <Chip label={`Rejected On: ${formData.approveOn}`} variant="outlined" color="error" />
                    </Stack>
                  )}

                  {listViewData.status === 'SUBMIT' && formData.approveStatus !== 'Approved' && formData.approveStatus !== 'Rejected' && (
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outlined"
                        startIcon={<CheckCircleIcon />}
                        size="small"
                        style={{
                          borderColor: '#4CAF50',
                          color: '#4CAF50',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          padding: '2px 8px',
                          fontSize: '0.8rem',
                          marginRight: '10px'
                        }}
                        onClick={handleOpenModalApprove}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        size="small"
                        style={{
                          borderColor: '#F44336',
                          color: '#F44336',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          padding: '2px 8px',
                          fontSize: '0.8rem'
                        }}
                        onClick={handleOpenModalReject}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col d-flex justify-content-end align-items-center gap-2">
              {!showForm && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{
                    borderColor: '#1e88e5',
                    backgroundColor: '#e3f2fd',
                    color: '#5e35b1',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    mr: 1.25,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: '#bbdefb',
                      color: '#1565c0'
                    }
                  }}
                  onClick={handleView}
                >
                  New
                </Button>
              )}

              <div className="d-flex flex-wrap justify-content-end ">
                {showForm && <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />}
                {showForm && <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />}
                {formData.approveStatus === 'Approved' || !showForm || isLoading ? (
                  ''
                ) : (
                  <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
                )}
              </div>
            </div>
          </div>

          {showForm ? (
            <>
              <div className="row d-flex mt-3">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="payment-mode-label">Mode</InputLabel>
                    <Select
                      labelId="payment-mode-label"
                      id="payment-mode"
                      label="Mode"
                      disabled={isSubmitted}
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
                        slotProps={{ textField: { size: 'small', clearable: true } }}
                        value={formData.docDate ? dayjs(formData.docDate) : null}
                        onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" error={!!formDataErrors.partyName}>
                    <InputLabel required id="payment-party-label">
                      Party Name
                    </InputLabel>
                    <Select
                      labelId="payment-party-label"
                      id="payment-party"
                      label="Party Name"
                      name="partyName"
                      disabled={!!editId && isSubmitted}
                      required
                      value={formData.partyName || ''}
                      onChange={handleSelectChange}
                    >
                      {partyName.map((par, index) => (
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
                    <InputLabel id="gst-state-label">Reg State</InputLabel>
                    <Select
                      labelId="gst-state-label"
                      id="gstState"
                      label="Reg State"
                      value={formData.gstState || ''}
                      onChange={handleSelectGst}
                      disabled={isSubmitted || gstState.length === 0}
                    >
                      {gstState.map((par, index) => (
                        <MenuItem key={index} value={par.stateCode}>
                          {par.stateCode}
                        </MenuItem>
                      ))}
                    </Select>
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
                      required
                      value={formData.paymentAmt}
                      disabled={isSubmitted}
                      onChange={(e) => {
                        setFormData({ ...formData, paymentAmt: e.target.value });
                        setFormDataErrors((prevErrors) => ({ ...prevErrors, paymentAmt: '' }));
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
                      disabled={isSubmitted}
                      onChange={(e) => setFormData({ ...formData, tdsAmt: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                      error={!!formDataErrors.tdsAmt}
                      helperText={formDataErrors.tdsAmt}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="chequeNo"
                      name="chequeNo"
                      label="UTR No"
                      size="small"
                      value={formData.chequeNo}
                      disabled={isSubmitted}
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
                        disabled={isSubmitted}
                        slotProps={{ textField: { size: 'small', clearable: true } }}
                        format="DD-MM-YYYY"
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
                      disabled={isSubmitted}
                      onChange={(e) => setFormData({ ...formData, payTo: e.target.value })}
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="outlined" size="small" error={!!formDataErrors.status}>
                    <InputLabel id="status-label" required>
                      Status
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      label="Status"
                      name="status"
                      value={formData.status}
                      disabled={isSubmitted || !editId}
                      onChange={(e) => {
                        setFormData({ ...formData, status: e.target.value });
                        setFormDataErrors({ ...formDataErrors, status: '' });
                      }}
                    >
                      {editId && <MenuItem value="SUBMIT">SUBMIT</MenuItem>}
                      <MenuItem value="EDIT">EDIT</MenuItem>
                    </Select>
                    {formDataErrors.status && <FormHelperText>{formDataErrors.status}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" error={!!formDataErrors.bankCashAcc}>
                    <InputLabel id="bankCashAcc-label" required>
                      Cash Account
                    </InputLabel>
                    <Select
                      labelId="bankCashAcc-label"
                      id="bankCashAcc"
                      name="bankCashAcc"
                      value={formData.bankCashAcc}
                      disabled={isSubmitted}
                      onChange={(e) => {
                        setFormData({ ...formData, bankCashAcc: e.target.value });
                        setFormDataErrors({ ...formDataErrors, bankCashAcc: '' });
                      }}
                      label="Cash Account"
                    >
                      {bankName.map((bank, index) => (
                        <MenuItem key={index} value={bank.accountgroupname}>
                          {bank.accountgroupname}
                        </MenuItem>
                      ))}
                    </Select>
                    {formDataErrors.bankCashAcc && <FormHelperText>{formDataErrors.bankCashAcc}</FormHelperText>}
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
                        {!isSubmitted && (
                          <div className="mb-1">
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                          </div>
                        )}
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    {!isSubmitted && (
                                      <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    )}
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center">#Invoice</th>
                                    <th className="px-2 py-2 text-white text-center">Date</th>
                                    <th className="px-2 py-2 text-white text-center">Doc Id</th>
                                    <th className="px-2 py-2 text-white text-center">Doc Date</th>
                                    <th className="px-2 py-2 text-white text-center">Bill amt</th>
                                    <th className="px-2 py-2 text-white text-center">TAX</th>
                                    <th className="px-2 py-2 text-white text-center">Total Amt</th>
                                    <th className="px-2 py-2 text-white text-center">Currency</th>
                                    <th className="px-2 py-2 text-white text-center">Ex. Rate</th>
                                    <th className="px-2 py-2 text-white text-center">Amount</th>
                                    <th className="px-2 py-2 text-white text-center">Outstanding</th>
                                    <th className="px-2 py-2 text-white text-center">Settled</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {isSubmitted
                                    ? withdrawalsTableData.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="text-center">{index + 1}</td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.vid}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.vdate ? dayjs(row.vdate).format('YYYY-MM-DD') : ''}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.refNo}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.refDate ? dayjs(row.refDate).format('YYYY-MM-DD') : ''}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.amount}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.gstAmount}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.totalAmt}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.currency}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.exRate}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.chargeAmt}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.outstanding}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.settled}
                                          </td>
                                        </tr>
                                      ))
                                    : withdrawalsTableData.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="border px-2 py-2 text-center">
                                            <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.vid ?? ''}
                                              style={{ width: '170px' }}
                                              disabled
                                              readOnly
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="date"
                                              disabled
                                              readOnly
                                              value={row.vdate ? dayjs(row.vdate).format('YYYY-MM-DD') : ''}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.refNo ?? ''}
                                              style={{ width: '170px' }}
                                              disabled
                                              readOnly
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="date"
                                              disabled
                                              readOnly
                                              value={row.refDate ? dayjs(row.refDate).format('YYYY-MM-DD') : ''}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.amount ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '120px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.gstAmount ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '150px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.totalAmt ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '130px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.currency ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '100px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.exRate ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '100px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.chargeAmt ?? ''}
                                              disabled
                                              readOnly
                                              style={{ width: '130px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              disabled
                                              readOnly
                                              value={row.outstanding ?? ''}
                                              style={{ width: '120px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.settled ?? ''}
                                              disabled={!formData.paymentAmt}
                                              style={{ width: '100px' }}
                                              onChange={(e) => handleSettledChange(row, e.target.value)}
                                              className={rowErrors[row.id] ? 'error form-control' : 'form-control'}
                                            />
                                            {rowErrors[row.id] && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {rowErrors[row.id]}
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
                                inputProps={{ maxLength: 30 }}
                                error={!!formDataErrors.onAccount}
                                helperText={formDataErrors.onAccount}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Remarks"
                                size="small"
                                disabled={isSubmitted}
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
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
                                  <Checkbox
                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="table-header">#Invoice</th>
                                <th className="table-header">Date</th>
                                <th className="table-header">Doc Id</th>
                                <th className="table-header">Doc Date</th>
                                <th className="table-header">Bill amt</th>
                                <th className="table-header">Tax</th>
                                <th className="table-header">Total Amt</th>
                                <th className="table-header">Net Receivable</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fillGridData.map((row, index) => (
                                <tr key={row.key}>
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
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.vid}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : ''}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.refNo}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.refDate ? dayjs(row.refDate).format('DD-MM-YYYY') : ''}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.billAmount}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.gstAmount}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.totalAmt}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.chargeAmt || 0}
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
                    <Button color="secondary" onClick={handleSubmitSelectedRows} variant="contained" sx={{ backgroundColor: '#673AB7' }}>
                      Proceed
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={columns} blockEdit={true} toEdit={getPaymentById} />
          )}
        </div>
      </div>
      <ConfirmationModal
        open={modalApprove}
        title="Payment Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this payment?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseApprove}
      />
    </div>
  );
};

export default Payment;
