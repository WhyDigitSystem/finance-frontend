import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@mui/material';
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
import { useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ConfirmationModal from 'utils/confirmationPopup';
import { showToast } from 'utils/toast-component';

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

// Always store / send dates as YYYY-MM-DD strings (or null)
const toDateStr = (d) => {
  if (!d) return null;
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
};

const fmtDate = (d) => {
  if (!d) return '';
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format('DD-MM-YYYY') : '';
};

// Indian currency format: 1,00,000.00
const formatIndianCurrency = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// getAllReceiptById returns receiptReceivableVO as an array, the approve API returns an object
// under taxInvoiceVO. Handle every shape in one place.
const extractVo = (result) => {
  const map = result?.paramObjectsMap || {};
  const raw = map.receiptReceivableVO ?? map.taxInvoiceVO;
  return Array.isArray(raw) ? raw[0] : raw;
};

const initialFormData = () => ({
  type: 'PARTY',
  paymentMode: 'Bank Receipt',
  transactionMethod: 'NEFT',
  docId: '',
  docDate: dayjs(),
  customerName: '',
  customerCode: '',
  shortName: '',
  ledgerName: '',
  receiptAmt: '',
  tdsAmt: '',
  chequeUtiNo: '',
  chequeUtiDate: null,
  cashAccount: '',
  netAmount: '',
  onAccount: '',
  remarks: '',
  status: 'EDIT',
  approveStatus: '',
  approveBy: '',
  approveOn: ''
});

// Maps a receipt VO coming from the backend to the form state shape
const mapVoToForm = (vo) => ({
  type: vo.type || 'PARTY',
  paymentMode: vo.receiptType || '',
  transactionMethod: vo.receiptType1 || '',
  docId: vo.docId || '',
  docDate: vo.docDate,
  customerName: vo.customerName || '',
  customerCode: vo.customerCode || '',
  shortName: vo.shortName || '',
  ledgerName: vo.ledgerName || '',
  receiptAmt: vo.receiptAmt ?? '',
  tdsAmt: vo.tdsAmt ?? '',
  chequeUtiNo: vo.chequeUtiNo || '',
  chequeUtiDate: vo.chequeUtiDate || null,
  cashAccount: vo.bankCashAcc || '',
  netAmount: vo.netAmount ?? '',
  onAccount: vo.onAccount ?? '',
  remarks: vo.remarks || '',
  status: vo.status || '',
  approveStatus: vo.approveStatus || '',
  approveBy: vo.approveBy || '',
  approveOn: vo.approveOn || ''
});

// Backend detail row -> screen row
//   invNo / invDate = #Invoice / Date   (fill grid vid / vdate)
//   refNo / refDate = Ref No / Ref Date (fill grid refNo / refate)
const mapVoToRows = (vo) =>
  (vo.receiptInvDetailsVO || vo.receiptInvDetailaDTO || []).map((d) => ({
    id: d.id || Date.now() + Math.random(),
    invNo: d.invNo ?? '',
    invDate: toDateStr(d.invDate),
    refNo: d.refNo || '',
    refDate: toDateStr(d.refDate),
    currency: d.currency || '',
    exRate: d.exRate ?? '',
    amount: d.amount ?? '',
    gstAmt: d.gstAmt ?? '',
    chargeAmt: d.chargeAmt ?? '',
    tds: d.tds ?? '',
    outstanding: d.outstanding ?? '',
    settled: d.settled ?? ''
  }));

// The fill-grid API has a few odd keys (refate, acccurrency, billamount). Normalize once.
//   amount     -> Total Amt (bill + tax)
//   chargeAmt  -> Net Receivable (before TDS %)
const normalizeFillGridRow = (r) => ({
  key: r.arapDetailsId ?? r.refNo,
  vid: r.vid ?? '',
  vdate: r.vdate ?? '',
  refNo: r.refNo ?? '',
  refDate: r.refate ?? r.refDate ?? '',
  billAmount: r.billamount ?? '',
  gstAmount: r.gstamount ?? '',
  totalAmt: r.amount ?? '',
  chargeAmt: r.chargeAmt ?? '',
  currency: r.acccurrency ?? 'INR',
  exRate: r.exrate ?? ''
});

// ---------- row calculations (derived, never stored) ----------
const calcTdsAmt = (row) => (toNum(row.amount) * toNum(row.tds)) / 100;
const calcNetReceivable = (row) => toNum(row.chargeAmt) - calcTdsAmt(row);
const calcOutstanding = (row) => calcNetReceivable(row) - toNum(row.settled);

const cellStyle = { whiteSpace: 'nowrap' };

// Chip colours for the approval state (same palette as Payment)
const APPROVE_CHIP_STYLES = {
  APPROVED: { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  REJECTED: { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
  PENDING: { backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' }
};

// The list API returns approveStatus as null / "" until a receipt is approved or rejected => PENDING
const getListValue = (row, key) => {
  if (key === 'approveStatus') {
    if (row.approveStatus === 'Approved') return 'APPROVED';
    if (row.approveStatus === 'Rejected') return 'REJECTED';
    return 'PENDING';
  }
  if (key === 'chequeUtiDate') return fmtDate(row[key]);
  if (key === 'receiptAmt' || key === 'onAccount') return formatIndianCurrency(row[key]);
  return row[key] ?? '';
};

const columns = [
  { accessorKey: 'docId', header: 'Doc Id' },
  { accessorKey: 'customerName', header: 'Customer Name' },
  { accessorKey: 'chequeUtiNo', header: 'UTR No' },
  { accessorKey: 'chequeUtiDate', header: 'UTR Date' },
  { accessorKey: 'receiptAmt', header: 'Receipt Amount' },
  { accessorKey: 'onAccount', header: 'On Account' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'approveStatus', header: 'Approve Status' }
];

const Receipt = ({ selectedRow }) => {
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

  const [allCustomerName, setAllCustomerName] = useState([]);
  const [bankName, setBankName] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [approveStatus, setApproveStatus] = useState('');
  const [modalApprove, setModalApprove] = useState(false);
  const [listViewData, setListViewData] = useState({});

  const [formData, setFormData] = useState(initialFormData());
  const [formDataErrors, setFormDataErrors] = useState({});
  const [invoiceRows, setInvoiceRows] = useState([]);

  // List view search / paging
  const [listSearch, setListSearch] = useState('');
  const [listPage, setListPage] = useState(0);
  const [listRowsPerPage, setListRowsPerPage] = useState(10);

  const handleChangeTab = (event, newValue) => setValue(newValue);

  const isSubmitted = formData.status === 'SUBMIT';

  // Row level errors, derived from the rows so they are always in sync with TDS % / receipt amount
  const rowErrors = useMemo(() => {
    const errors = {};
    const receiptAmt = toNum(formData.receiptAmt);
    let running = 0;
    invoiceRows.forEach((row) => {
      const settled = toNum(row.settled);
      if (!settled) return;
      running += settled;
      const net = calcNetReceivable(row);
      if (settled > net) {
        errors[row.id] = `Settled can't exceed net receivable (${formatIndianCurrency(net)})`;
      } else if (running > receiptAmt) {
        errors[row.id] = `Total settled can't exceed receipt amount (${formatIndianCurrency(receiptAmt)})`;
      }
    });
    return errors;
  }, [invoiceRows, formData.receiptAmt]);

  // ---------- effects ----------
  useEffect(() => {
    if (selectedRow) {
      getReceiptById({ original: selectedRow });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  useEffect(() => {
    getAllReceipt();
    getReceiptDocId();
    getAllCustomerName();
    bankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select the customer when only one exists (new entries only)
  useEffect(() => {
    if (!editId && allCustomerName.length === 1 && !formData.customerName) {
      handleSelectChange({ target: { name: 'customerName', value: allCustomerName[0].customerName } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCustomerName]);

  // Net amount / on account follow the settled amounts and the receipt amount
  useEffect(() => {
    if (formData.status !== 'EDIT') return;
    const totalSettled = invoiceRows.reduce((sum, r) => sum + toNum(r.settled), 0);
    const receiptAmt = toNum(formData.receiptAmt);
    const onAccount = receiptAmt >= totalSettled ? receiptAmt - totalSettled : 0;
    setFormData((prev) => ({
      ...prev,
      netAmount: totalSettled.toFixed(2),
      onAccount: onAccount.toFixed(2)
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceRows, formData.receiptAmt]);

  // ---------- API calls ----------
  const getAllReceipt = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getAllReceiptReceivableByOrgId?branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      if (response.status === true) {
        setData([...(response.paramObjectsMap.receiptReceivableVO || [])].reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const getReceiptDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getReceiptDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      const { receiptDocId, docDate } = response.paramObjectsMap;
      setFormData((prev) => ({
        ...prev,
        docId: receiptDocId,
        docDate: docDate ? dayjs(docDate) : null
      }));
    } catch (error) {
      console.error('Error fetching doc id:', error);
    }
  };

  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls('get', `/arreceivable/getCustomerNameAndCodeForReceipt?orgId=${orgId}`);
      if (response.status === true) {
        setAllCustomerName(response.paramObjectsMap.PartyMasterVO || []);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Cash / Bank account names for the "Cash Account" dropdown (same API as Payment)
  const bankList = async () => {
    try {
      const response = await apiCalls('get', `/payable/getPaymentAccountName?orgId=${orgId}`);
      if (response.status === true) {
        setBankName(response.paramObjectsMap?.mapp || []);
      } else {
        setBankName([]);
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching account names:', error);
      setBankName([]);
    }
  };

  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getReciptFillGrid?orgId=${orgId}&branchCode=${branchCode}&partyCode=${formData.customerCode}`
      );
      if (response?.status === true) {
        setFillGridData((response.paramObjectsMap.reciptFillGrid || []).map(normalizeFillGridRow));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching fill grid:', error);
    }
  };

  const getReceiptById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/arreceivable/getAllReceiptById?id=${row.original.id}`);
      const vo = extractVo(result);
      if (vo) {
        setListViewData(vo);
        setEditId(row.original.id);
        setFormData(mapVoToForm(vo));
        setInvoiceRows(mapVoToRows(vo));
        setFormDataErrors({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ---------- handlers ----------
  const handleClear = () => {
    setFormData(initialFormData());
    setInvoiceRows([]);
    setFormDataErrors({});
    setEditId('');
    setListViewData({});
    getReceiptDocId();
  };

  const handleList = () => setShowForm(!showForm);

  const handleView = () => {
    setShowForm(!showForm);
    handleClear();
  };

  const handleSelectChange = (e) => {
    const { name, value: val } = e.target;
    if (name === 'customerName') {
      const selected = allCustomerName.find((c) => c.customerName === val);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          customerName: selected.customerName,
          customerCode: selected.customerCode,
          shortName: selected.shortName || ''
        }));
        setFormDataErrors((prev) => ({ ...prev, customerName: '' }));
        // rows belong to the previous customer
        setInvoiceRows([]);
      }
    }
  };

  // numeric-only inputs (receipt amount, TDS amount)
  const handleAmountChange = (name, raw) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setFormDataErrors((prev) => ({ ...prev, [name]: 'Only numeric characters are allowed' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: raw }));
    setFormDataErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRowChange = (rowId, field, raw) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(raw)) return;
    if (field === 'tds' && toNum(raw) > 100) return;
    setInvoiceRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [field]: raw } : r)));
  };

  const handleDeleteRow = (rowId) => {
    setInvoiceRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleFullGrid = () => {
    if (formData.customerCode) {
      setModalOpen(true);
      getAllFillGrid();
    } else {
      setModalOpen(false);
      showToast('warning', 'Please Select Customer Name');
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSelectAll = () => {
    setSelectedRows(selectAll ? [] : fillGridData.map((_, index) => index));
    setSelectAll(!selectAll);
  };

  const handleSubmitSelectedRows = () => {
    const selectedData = selectedRows.map((index) => fillGridData[index]);

    const newData = selectedData
      .filter((d) => !invoiceRows.some((item) => item.refNo === d.refNo))
      .map((d) => ({
        id: Date.now() + Math.random(),
        invNo: d.vid,
        invDate: toDateStr(d.vdate),
        refNo: d.refNo,
        refDate: toDateStr(d.refDate),
        currency: d.currency,
        exRate: d.exRate,
        amount: d.billAmount,
        gstAmt: d.gstAmount,
        chargeAmt: d.chargeAmt,
        tds: '',
        outstanding: toNum(d.chargeAmt).toFixed(2),
        settled: ''
      }));

    if (newData.length < selectedData.length) {
      showToast('warning', 'Some of the selected items are already added!');
    }
    if (newData.length === 0) return;

    setInvoiceRows((prev) => [...prev, ...newData]);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.receiptAmt) {
      errors.receiptAmt = 'Receipt Amount is required';
    } else if (!/^[0-9]*\.?[0-9]*$/.test(String(formData.receiptAmt))) {
      errors.receiptAmt = 'Only numeric characters are allowed';
    }
    if (!formData.cashAccount) {
      errors.cashAccount = 'Cash Account is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setFormDataErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (Object.keys(rowErrors).length > 0) {
      showToast('warning', 'Please fix the errors in the invoice rows');
      return;
    }

    setIsLoading(true);

    const detailsVo = invoiceRows.map((row) => ({
      ...(editId && { id: row.id }),
      invNo: row.invNo || '',
      invDate: toDateStr(row.invDate),
      refNo: row.refNo,
      refDate: toDateStr(row.refDate),
      currency: row.currency,
      exRate: toNum(row.exRate),
      amount: toNum(row.amount),
      gstAmt: toNum(row.gstAmt),
      chargeAmt: toNum(row.chargeAmt),
      tds: toNum(row.tds),
      outstanding: Number(calcOutstanding(row).toFixed(2)),
      settled: toNum(row.settled)
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      active: true,
      type: 'PARTY',
      receiptType: formData.paymentMode,
      receiptType1: formData.transactionMethod,
      docId: formData.docId,
      docDate: toDateStr(formData.docDate),
      customerName: formData.customerName,
      customerCode: formData.customerCode,
      shortName: formData.shortName,
      ledgerName: formData.ledgerName,
      receiptAmt: toNum(formData.receiptAmt),
      tdsAmt: toNum(formData.tdsAmt),
      chequeUtiNo: formData.chequeUtiNo,
      chequeUtiDate: toDateStr(formData.chequeUtiDate),
      bankCashAcc: formData.cashAccount,
      remarks: formData.remarks,
      status: formData.status,
      receiptInvDetailaDTO: detailsVo,
      createdBy: loginUserName,
      orgId: orgId,
      finYear: finYear,
      branch: branch,
      branchCode: branchCode
    };

    try {
      const response = await apiCalls('put', '/arreceivable/updateCreateReceipt', saveFormData);
      if (response.status === true) {
        showToast('success', editId ? 'Receipt Updated Successfully' : 'Receipt created successfully');
        getAllReceipt();
        handleClear();
      } else {
        showToast('error', response.paramObjectsMap?.errorMessage || 'Receipt creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Receipt creation failed');
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
        `/arreceivable/approveReceipt?action=${approveStatus}&actionBy=${loginUserName}&docId=${formData.docId}&id=${editId}&orgId=${orgId}`
      );
      if (result.status === true) {
        const vo = extractVo(result);
        if (vo) {
          showToast(
            vo.approveStatus === 'Approved' ? 'success' : 'error',
            vo.approveStatus === 'Approved' ? 'Receipt Approved successfully' : 'Receipt Rejected successfully'
          );
          setListViewData(vo);
          setFormData(mapVoToForm(vo));
          setInvoiceRows(mapVoToRows(vo));
        }
        handleCloseApprove();
        getAllReceipt();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Action failed');
        handleCloseApprove();
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Action failed');
      handleCloseApprove();
    }
  };

  // List view rows after search + paging
  const searchText = listSearch.trim().toLowerCase();
  const filteredRows = data.filter(
    (r) => !searchText || columns.some((c) => String(getListValue(r, c.accessorKey)).toLowerCase().includes(searchText))
  );
  const pagedRows = filteredRows.slice(listPage * listRowsPerPage, listPage * listRowsPerPage + listRowsPerPage);

  const thClass = 'px-2 py-2 text-white text-center';

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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<CheckCircleIcon style={{ color: '#2e7d32' }} />}
                        label="APPROVED"
                        size="small"
                        sx={{ ...APPROVE_CHIP_STYLES.APPROVED, fontWeight: 200 }}
                      />
                      <Chip label={`By: ${formData.approveBy || '-'}`} size="small" variant="outlined" />
                      <Chip label={`On: ${formData.approveOn || '-'}`} size="small" variant="outlined" />
                    </Stack>
                  )}
                  {formData.approveStatus === 'Rejected' && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<CancelIcon style={{ color: '#c62828' }} />}
                        label="REJECTED"
                        size="small"
                        sx={{ ...APPROVE_CHIP_STYLES.REJECTED, fontWeight: 200 }}
                      />
                      <Chip label={`By: ${formData.approveBy || '-'}`} size="small" variant="outlined" />
                      <Chip label={`On: ${formData.approveOn || '-'}`} size="small" variant="outlined" />
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
                    '&:hover': { borderColor: '#1565c0', backgroundColor: '#bbdefb', color: '#1565c0' }
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
                      id="paymentMode"
                      label="Mode"
                      required
                      disabled={!!editId}
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    >
                      <MenuItem value={'Bank Receipt'}>Bank Receipt</MenuItem>
                      <MenuItem value={'Cash Receipt'}>Cash Receipt</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="transaction-method-label">Transaction Method</InputLabel>
                    <Select
                      labelId="transaction-method-label"
                      id="transactionMethod"
                      label="Transaction Method"
                      required
                      disabled={!!editId}
                      value={formData.transactionMethod}
                      onChange={(e) => setFormData({ ...formData, transactionMethod: e.target.value })}
                    >
                      <MenuItem value={'NEFT'}>NEFT</MenuItem>
                      <MenuItem value={'RTGS'}>RTGS</MenuItem>
                      <MenuItem value={'IMPS'}>IMPS</MenuItem>
                      <MenuItem value={'CHEQUE'}>CHEQUE</MenuItem>
                      <MenuItem value={'CASH'}>CASH</MenuItem>
                      <MenuItem value={'DD'}>DD</MenuItem>
                    </Select>
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
                  <FormControl fullWidth size="small" error={!!formDataErrors.customerName}>
                    <InputLabel required id="customer-label">
                      Customer Name
                    </InputLabel>
                    <Select
                      labelId="customer-label"
                      id="customerName"
                      label="Customer Name"
                      name="customerName"
                      disabled={!!editId}
                      required
                      value={formData.customerName || ''}
                      onChange={handleSelectChange}
                    >
                      {allCustomerName.map((customer, index) => (
                        <MenuItem key={customer.id ?? index} value={customer.customerName}>
                          {customer.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formDataErrors.customerName && <FormHelperText>{formDataErrors.customerName}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="receiptAmt"
                      label="Receipt Amount"
                      size="small"
                      required
                      value={formData.receiptAmt}
                      disabled={isSubmitted}
                      onChange={(e) => handleAmountChange('receiptAmt', e.target.value)}
                      inputProps={{ maxLength: 30 }}
                      error={!!formDataErrors.receiptAmt}
                      helperText={formDataErrors.receiptAmt}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="tdsAmt"
                      label="TDS Amount"
                      size="small"
                      value={formData.tdsAmt}
                      disabled={isSubmitted}
                      onChange={(e) => handleAmountChange('tdsAmt', e.target.value)}
                      inputProps={{ maxLength: 30 }}
                      error={!!formDataErrors.tdsAmt}
                      helperText={formDataErrors.tdsAmt}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="chequeUtiNo"
                      label="UTR No"
                      size="small"
                      value={formData.chequeUtiNo}
                      disabled={isSubmitted}
                      onChange={(e) => setFormData({ ...formData, chequeUtiNo: e.target.value })}
                      inputProps={{ maxLength: 100 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="UTR Date"
                        value={formData.chequeUtiDate ? dayjs(formData.chequeUtiDate) : null}
                        onChange={(newValue) => setFormData({ ...formData, chequeUtiDate: newValue })}
                        disabled={isSubmitted}
                        slotProps={{ textField: { size: 'small', clearable: true } }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" error={!!formDataErrors.cashAccount}>
                    <InputLabel id="cashAccount-label" required>
                      Cash Account
                    </InputLabel>
                    <Select
                      labelId="cashAccount-label"
                      id="cashAccount"
                      name="cashAccount"
                      label="Cash Account"
                      value={formData.cashAccount || ''}
                      disabled={isSubmitted}
                      onChange={(e) => {
                        setFormData({ ...formData, cashAccount: e.target.value });
                        setFormDataErrors({ ...formDataErrors, cashAccount: '' });
                      }}
                    >
                      {bankName.map((bank, index) => (
                        <MenuItem key={index} value={bank.accountName}>
                          {bank.accountName}
                        </MenuItem>
                      ))}

                      {/* Keeps a previously saved account visible if it is no longer in the API list */}
                      {formData.cashAccount && !bankName.some((b) => b.accountName === formData.cashAccount) && (
                        <MenuItem value={formData.cashAccount}>{formData.cashAccount}</MenuItem>
                      )}
                    </Select>
                    {formDataErrors.cashAccount && <FormHelperText>{formDataErrors.cashAccount}</FormHelperText>}
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
              </div>

              <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChangeTab} textColor="secondary" indicatorColor="secondary">
                        <Tab label="Invoice Details" value="1" />
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
                                      <th className={thClass} style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    )}
                                    <th className={thClass} style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className={thClass}>#Invoice</th>
                                    <th className={thClass}>Date</th>
                                    <th className={thClass}>Ref No</th>
                                    <th className={thClass}>Ref Date</th>
                                    <th className={thClass}>Bill Amount</th>
                                    <th className={thClass}>TAX</th>
                                    <th className={thClass}>TDS %</th>
                                    <th className={thClass}>Net Receivable</th>
                                    <th className={thClass}>Outstanding Bal</th>
                                    <th className={thClass}>Settled Amt</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoiceRows.map((row, index) => (
                                    <tr key={row.id}>
                                      {!isSubmitted && (
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                        </td>
                                      )}
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={cellStyle}>
                                        {row.invNo}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={cellStyle}>
                                        {fmtDate(row.invDate)}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={cellStyle}>
                                        {row.refNo}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={cellStyle}>
                                        {fmtDate(row.refDate)}
                                      </td>
                                      <td className="border px-2 py-2 text-end" style={cellStyle}>
                                        {formatIndianCurrency(row.amount)}
                                      </td>
                                      <td className="border px-2 py-2 text-end" style={cellStyle}>
                                        {formatIndianCurrency(row.gstAmt)}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.tds}
                                          disabled={isSubmitted}
                                          style={{ width: '80px' }}
                                          onChange={(e) => handleRowChange(row.id, 'tds', e.target.value)}
                                          className="form-control"
                                        />
                                      </td>
                                      <td className="border px-2 py-2 text-end" style={cellStyle}>
                                        {formatIndianCurrency(calcNetReceivable(row))}
                                      </td>
                                      <td className="border px-2 py-2 text-end" style={cellStyle}>
                                        {formatIndianCurrency(calcOutstanding(row))}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.settled}
                                          disabled={isSubmitted || !formData.receiptAmt}
                                          style={{ width: '120px' }}
                                          onChange={(e) => handleRowChange(row.id, 'settled', e.target.value)}
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
                                  {invoiceRows.length === 0 && (
                                    <tr>
                                      <td colSpan={12} className="text-center">
                                        No invoices added (use Fill Grid)
                                      </td>
                                    </tr>
                                  )}
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
                                label="Net Amount"
                                disabled
                                size="small"
                                value={formatIndianCurrency(formData.netAmount)}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="onAccount"
                                label="On Account"
                                disabled
                                size="small"
                                value={formatIndianCurrency(formData.onAccount)}
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
                                disabled={isSubmitted}
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                inputProps={{ maxLength: 250 }}
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
                  maxWidth="lg"
                  fullWidth
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
                                <th className={thClass} style={{ width: '68px' }}>
                                  <Checkbox
                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                </th>
                                <th className={thClass} style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="table-header">#Invoice</th>
                                <th className="table-header">Date</th>
                                <th className="table-header">Ref No</th>
                                <th className="table-header">Bill Amount</th>
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
                                    {fmtDate(row.vdate)}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {row.refNo}
                                  </td>
                                  <td className="border px-2 py-2 text-end" style={cellStyle}>
                                    {formatIndianCurrency(row.billAmount)}
                                  </td>
                                  <td className="border px-2 py-2 text-end" style={cellStyle}>
                                    {formatIndianCurrency(row.gstAmount)}
                                  </td>
                                  <td className="border px-2 py-2 text-end" style={cellStyle}>
                                    {formatIndianCurrency(row.totalAmt)}
                                  </td>
                                  <td className="border px-2 py-2 text-end" style={cellStyle}>
                                    {formatIndianCurrency(row.chargeAmt || 0)}
                                  </td>
                                </tr>
                              ))}
                              {fillGridData.length === 0 && (
                                <tr>
                                  <td colSpan={9} className="text-center">
                                    No pending invoices
                                  </td>
                                </tr>
                              )}
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
            <div className="mt-3">
              <div className="d-flex justify-content-end mb-2">
                <TextField
                  size="small"
                  label="Search"
                  value={listSearch}
                  onChange={(e) => {
                    setListSearch(e.target.value);
                    setListPage(0);
                  }}
                />
              </div>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#673AB7' }}>
                      <TableCell align="center" sx={{ color: '#fff', fontWeight: 600 }}>
                        Action
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.accessorKey} sx={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {col.header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedRows.map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="secondary" onClick={() => getReceiptById({ original: row })}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell key={col.accessorKey} sx={{ whiteSpace: 'nowrap' }}>
                            {col.accessorKey === 'approveStatus' ? (
                              <Chip
                                size="small"
                                label={getListValue(row, col.accessorKey)}
                                sx={{ ...APPROVE_CHIP_STYLES[getListValue(row, col.accessorKey)], fontWeight: 200 }}
                              />
                            ) : (
                              getListValue(row, col.accessorKey)
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {filteredRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredRows.length}
                page={listPage}
                onPageChange={(e, newPage) => setListPage(newPage)}
                rowsPerPage={listRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setListRowsPerPage(parseInt(e.target.value, 10));
                  setListPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={modalApprove}
        title="Receipt Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this receipt?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseApprove}
      />
    </div>
  );
};

export default Receipt;
