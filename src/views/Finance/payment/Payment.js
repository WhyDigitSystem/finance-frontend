import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useRef, useState } from 'react';
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

// getPaymentById returns paymentVO as an array, the update/approve APIs return an object
// (the approve API may also use the key taxInvoiceVO). Handle every shape in one place.
const extractVo = (result) => {
  const map = result?.paramObjectsMap || {};
  const raw = map.paymentVO ?? map.taxInvoiceVO;
  return Array.isArray(raw) ? raw[0] : raw;
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
  paymentAmt: vo.paymentAmt ?? '',
  tdsAcc: vo.tdsAcc || '',
  tdsAmt: vo.tdsAmt ?? '',
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

// Backend detail row -> screen row.
//   backend invNo / invDate  = Supplier Bill No / Supplier Bill Date  -> row.vid / row.vdate
//   backend refNo / refDate  = #invoice / Date                        -> row.refNo / row.refDate
// The backend does not return totalAmt, so it is calculated (amount + gst) when missing.
const mapVoToRows = (vo) =>
  (vo.paymentInvDtlsVO || vo.paymentInvDtlsDTO || []).map((cl) => {
    const calcTotal = toNum(cl.amount) + toNum(cl.gstAmount);
    return {
      id: cl.id || Date.now() + Math.random(),
      vid: cl.invNo ?? cl.supplierRefNo ?? cl.vid ?? '',
      vdate: toDateStr(cl.invDate ?? cl.supplierRefDate ?? cl.vdate),
      refNo: cl.refNo || '',
      refDate: toDateStr(cl.refDate),
      currency: cl.currency || '',
      exRate: cl.exRate ?? '',
      amount: cl.amount ?? '',
      gstAmount: cl.gstAmount ?? '',
      totalAmt: toNum(cl.totalAmt) || calcTotal,
      chargeAmt: cl.chargeAmt ?? '',
      outstanding: cl.outstanding ?? cl.outStanding ?? '',
      settled: cl.settled ?? ''
    };
  });

// The fill-grid API mixes casing (refno / refNo, refdate / refDate). Normalize once.
const normalizeFillGridRow = (r) => {
  const billAmount = r.billamount ?? r.billAmount ?? '';
  const gstAmount = r.gstamount ?? r.gstAmount ?? '';
  const apiTotal = toNum(r.amount ?? r.totalAmt);
  return {
    ...r,
    key: r.arapDetailsId ?? `${r.refno || r.refNo}-${r.refdate || r.refDate}`,
    refNo: r.refno ?? r.refNo ?? '',
    refDate: r.refdate ?? r.refDate ?? '',
    vid: r.vid ?? r.supplierRefNo ?? r.supplierrefno ?? '',
    vdate: r.vdate ?? r.supplierRefDate ?? r.supplierrefdate ?? '',
    billAmount,
    gstAmount,
    totalAmt: apiTotal || toNum(billAmount) + toNum(gstAmount),
    chargeAmt: r.chargeAmt ?? r.chargeamt ?? '',
    currency: r.acccurrency ?? r.currency ?? '',
    exRate: r.exrate ?? r.exRate ?? ''
  };
};

const cellStyle = { whiteSpace: 'nowrap' };

// Chip colours for the approval state (same palette in the form header and the list view)
const APPROVE_CHIP_STYLES = {
  APPROVED: { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  REJECTED: { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
  PENDING: { backgroundColor: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80' }
};

// Value shown in the list view. The list API returns approveStatus as null / "" until a payment is
// approved or rejected, so an empty value means PENDING.
const getListValue = (row, key) => {
  if (key === 'approveStatus') {
    if (row.approveStatus === 'Approved') return 'APPROVED';
    if (row.approveStatus === 'Rejected') return 'REJECTED';
    return 'PENDING';
  }
  return row[key] ?? '';
};

// ---------- PDF ----------
// Change these two lines if the company name / address ever changes.
const COMPANY = {
  name: 'AIPACKS TRAX PVT LTD',
  address: 'No.627, Hoysala Nagar, T C Palya Main Road, Ramamurthy Nagar, Bangalore North, Bangalore- 560016.'
};

// Theme colours (match the screen's #673AB7 purple)
const PDF_BRAND = [103, 58, 183];
const PDF_BRAND_DARK = [81, 45, 168];
const PDF_BRAND_LIGHT = [237, 231, 246];
const PDF_BRAND_SOFT = [247, 244, 252];
const PDF_TEXT = [33, 33, 33];
const PDF_MUTED = [110, 110, 120];
const PDF_LINE = [208, 200, 228];
const PDF_YELLOW = [255, 244, 153];
const PDF_RED = [198, 40, 40];
const PDF_WHITE = [255, 255, 255];

const fmtMoney = (v) => toNum(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => {
  if (!d) return '';
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : '';
};

// Builds the payment advice PDF from a payment VO returned by getPaymentById
const buildPaymentPdf = (vo) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const m = 14;
  const contentW = pageW - m * 2; // 182mm
  const rows = mapVoToRows(vo);

  // --- header band ---
  doc.setFillColor(...PDF_BRAND);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setFillColor(...PDF_BRAND_DARK);
  doc.rect(0, 32, pageW, 1.6, 'F');
  doc.setTextColor(...PDF_WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text(COMPANY.name, pageW / 2, 13.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.text(doc.splitTextToSize(COMPANY.address, contentW), pageW / 2, 20.5, { align: 'center' });

  // --- title ---
  doc.setTextColor(...PDF_BRAND);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PAYMENT ADVICE', pageW / 2, 43, { align: 'center' });
  doc.setDrawColor(...PDF_BRAND);
  doc.setLineWidth(0.5);
  doc.line(pageW / 2 - 18, 45, pageW / 2 + 18, 45);

  // --- party card (left) + date / mode (right) ---
  const boxY = 50;
  const boxH = 24;
  doc.setFillColor(...PDF_BRAND_SOFT);
  doc.setDrawColor(...PDF_LINE);
  doc.setLineWidth(0.3);
  doc.roundedRect(m, boxY, contentW, boxH, 2, 2, 'FD');
  // left accent bar
  doc.setFillColor(...PDF_BRAND);
  doc.roundedRect(m, boxY, 2.2, boxH, 1, 1, 'F');

  doc.setTextColor(...PDF_TEXT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(String(vo.partyName || ''), m + 7, boxY + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_MUTED);
  doc.text(String(vo.gstState || ''), m + 7, boxY + 16.5);

  const labelX = pageW / 2 + 14;
  const valueBoxW = 40;
  const valueBoxX = pageW - m - valueBoxW - 3;
  const meta = [
    ['Date', fmtDate(vo.docDate)],
    ['Mode', vo.paymentType || '']
  ];
  meta.forEach(([label, val], i) => {
    const y = boxY + 9 + i * 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...PDF_BRAND_DARK);
    doc.text(label, labelX, y);
    doc.setFillColor(...PDF_WHITE);
    doc.setDrawColor(...PDF_LINE);
    doc.roundedRect(valueBoxX, y - 5, valueBoxW, 7, 1.2, 1.2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_TEXT);
    doc.text(String(val), valueBoxX + valueBoxW / 2, y, { align: 'center' });
  });

  // --- greeting ---
  const greetY = boxY + boxH + 9;
  doc.setTextColor(...PDF_TEXT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Dear Sir/Madam,', m, greetY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Please find below the payment details', m, greetY + 5.5);

  // --- bill table: Bill Reference | Bill Date | Amount | GST | TOT AMT ---
  const sumTotal = rows.reduce((s, r) => s + toNum(r.totalAmt), 0);

  autoTable(doc, {
    startY: greetY + 10,
    margin: { left: m, right: m },
    theme: 'grid',
    head: [['Bill Reference', 'Bill Date', 'Amount', 'GST', 'TOT AMT']],
    body: rows.map((r) => [
      r.vid || r.refNo || '',
      fmtDate(r.vdate || r.refDate),
      fmtMoney(r.amount),
      fmtMoney(r.gstAmount),
      fmtMoney(r.totalAmt)
    ]),
    foot: [
      [
        { content: '', colSpan: 3, styles: { fillColor: PDF_WHITE } },
        { content: 'Total', styles: { halign: 'right', fillColor: PDF_YELLOW } },
        { content: fmtMoney(sumTotal), styles: { halign: 'right', fillColor: PDF_YELLOW } }
      ]
    ],
    showFoot: 'lastPage',
    styles: { fontSize: 9, cellPadding: 2.8, lineColor: PDF_LINE, lineWidth: 0.2, textColor: PDF_TEXT, valign: 'middle' },
    headStyles: { fillColor: PDF_BRAND, textColor: PDF_WHITE, fontStyle: 'bold', halign: 'center' },
    footStyles: { textColor: [20, 20, 20], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: PDF_BRAND_SOFT },
    columnStyles: {
      0: { cellWidth: 62 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    },
    didParseCell: (d) => {
      // TOT AMT column is shown in red
      if (d.section === 'body' && d.column.index === 4) {
        d.cell.styles.textColor = PDF_RED;
        d.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // --- payment details table ---
  const transferred = [vo.payTo || '', vo.chequeNo ? `UTR No: ${vo.chequeNo}` : ''].filter(Boolean).join('\n') || '-';
  const balance = toNum(vo.onAccount);
  const titleHead = { fillColor: PDF_BRAND_DARK, textColor: PDF_WHITE, fontStyle: 'bold', halign: 'center' };
  const subHead = { fillColor: PDF_BRAND_LIGHT, textColor: PDF_BRAND_DARK, fontStyle: 'bold', halign: 'center' };

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: m, right: m },
    theme: 'grid',
    head: [
      [{ content: 'Payment Details', colSpan: 5, styles: titleHead }],
      ['Payment Mode', 'Transferred To', 'Date', 'Issued From', 'Amount'].map((t) => ({ content: t, styles: subHead }))
    ],
    body: [
      [
        vo.paymentType || '',
        transferred,
        fmtDate(vo.chequeDate || vo.docDate),
        vo.bankCashAcc || '',
        { content: fmtMoney(vo.paymentAmt), styles: { fontStyle: 'bold' } }
      ]
    ],
    foot: [
      [
        { content: 'BALANCE', colSpan: 4, styles: { halign: 'right' } },
        { content: balance > 0 ? fmtMoney(balance) : '-', styles: { halign: 'right' } }
      ]
    ],
    showFoot: 'lastPage',
    styles: { fontSize: 9, cellPadding: 3.4, lineColor: PDF_LINE, lineWidth: 0.2, textColor: PDF_TEXT, valign: 'middle', halign: 'center' },
    footStyles: { fillColor: PDF_BRAND_SOFT, textColor: PDF_BRAND_DARK, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 28 },
      3: { cellWidth: 44 },
      4: { cellWidth: 30 }
    }
  });

  // --- remarks / approval ---
  let y = doc.lastAutoTable.finalY + 9;
  doc.setFontSize(9);
  if (vo.remarks) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_BRAND_DARK);
    doc.text('Remarks:', m, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_TEXT);
    const lines = doc.splitTextToSize(String(vo.remarks), contentW - 20);
    doc.text(lines, m + 18, y);
    y += lines.length * 4.5 + 3;
  }
  if (vo.approveStatus === 'Approved' && vo.approveBy) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(46, 125, 50);
    doc.text(`Approved by ${vo.approveBy}${vo.approveOn ? ` on ${vo.approveOn}` : ''}`, m, y);
    y += 6;
  }

  // --- signature ---
  if (y > pageH - 45) {
    doc.addPage();
    y = 30;
  }
  const sigY = y + 18;
  doc.setDrawColor(...PDF_BRAND);
  doc.setLineWidth(0.4);
  doc.line(pageW - m - 55, sigY, pageW - m, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...PDF_TEXT);
  doc.text('Authorised Signatory', pageW - m - 27.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PDF_MUTED);
  doc.text(`For ${COMPANY.name}`, pageW - m - 27.5, sigY + 10, { align: 'center' });

  // --- page footer ---
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFillColor(...PDF_BRAND);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_WHITE);
    doc.text('This is a system generated payment advice.', m, pageH - 5, { align: 'left' });
    doc.text(`Page ${i} of ${pages}`, pageW - m, pageH - 5, { align: 'right' });
  }

  return doc;
};

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

  // PDF preview
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfDocRef = useRef(null);
  const pdfNameRef = useRef('Payment.pdf');

  // List view search / paging
  const [listSearch, setListSearch] = useState('');
  const [listPage, setListPage] = useState(0);
  const [listRowsPerPage, setListRowsPerPage] = useState(10);

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

  // Free the preview blob URL whenever it changes or the screen unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

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
      const vo = extractVo(result);
      if (vo) {
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

  // ---------- PDF handlers ----------
  // Called from the list view's PDF action. Loads the payment, builds the PDF and opens the preview.
  const handlePdfView = async (row) => {
    const id = row?.original?.id ?? row?.id;
    if (!id) return;
    setPdfLoading(true);
    try {
      const result = await apiCalls('get', `/payable/getPaymentById?id=${id}`);
      const vo = extractVo(result);
      if (!vo) {
        showToast('error', 'Unable to load payment details');
        return;
      }
      const doc = buildPaymentPdf(vo);
      pdfDocRef.current = doc;
      pdfNameRef.current = `Payment_${String(vo.docId || id).replace(/[\\/:*?"<>|]/g, '-')}.pdf`;
      setPdfUrl(URL.createObjectURL(doc.output('blob')));
      setPdfOpen(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('error', 'Unable to generate PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePdfClose = () => {
    setPdfOpen(false);
    setPdfUrl('');
    pdfDocRef.current = null;
  };

  const handlePdfDownload = () => {
    if (pdfDocRef.current) {
      pdfDocRef.current.save(pdfNameRef.current);
    }
    handlePdfClose();
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
      .filter((d) => !withdrawalsTableData.some((item) => item.refNo === d.refNo))
      .map((d) => ({
        id: Date.now() + Math.random(),
        // Supplier Bill No / Date  (saved as invNo / invDate)
        vid: d.vid || '',
        vdate: toDateStr(d.vdate),
        // #invoice / Date  (saved as refNo / refDate)
        refNo: d.refNo,
        refDate: toDateStr(d.refDate),
        currency: d.currency || 'INR',
        exRate: d.exRate,
        amount: d.billAmount,
        gstAmount: toNum(d.gstAmount),
        totalAmt: toNum(d.totalAmt),
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
      invNo: row.vid || '', // Supplier Bill No
      invDate: toDateStr(row.vdate), // Supplier Bill Date
      refNo: row.refNo, // #invoice
      refDate: toDateStr(row.refDate), // invoice date
      currency: row.currency,
      exRate: toNum(row.exRate),
      amount: toNum(row.amount),
      gstAmount: toNum(row.gstAmount),
      totalAmt: toNum(row.totalAmt) || toNum(row.amount) + toNum(row.gstAmount),
      chargeAmt: toNum(row.chargeAmt),
      outStanding: toNum(row.outstanding),
      settled: toNum(row.settled)
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      type: 'PARTY',
      paymentType: formData.paymentType,
      docId: formData.docId,
      docDate: toDateStr(formData.docDate),
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
      chequeDate: toDateStr(formData.chequeDate),
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
        const vo = extractVo(result);
        if (vo) {
          showToast(
            vo.approveStatus === 'Approved' ? 'success' : 'error',
            vo.approveStatus === 'Approved' ? ' Payment Approved Successfully' : 'Payment Rejected Successfully'
          );
          setListViewData(vo);
          setFormData(mapVoToForm(vo));
          setWithdrawalsTableData(mapVoToRows(vo));
        }
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

  // List view rows after search + paging
  const searchText = listSearch.trim().toLowerCase();
  const filteredRows = data.filter(
    (r) => !searchText || columns.some((c) => String(getListValue(r, c.accessorKey)).toLowerCase().includes(searchText))
  );
  const pagedRows = filteredRows.slice(listPage * listRowsPerPage, listPage * listRowsPerPage + listRowsPerPage);

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
                        sx={{ ...APPROVE_CHIP_STYLES.APPROVED, fontWeight: 700 }}
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
                        sx={{ ...APPROVE_CHIP_STYLES.REJECTED, fontWeight: 700 }}
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
                        value={formData.chequeDate ? dayjs(formData.chequeDate) : null}
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
                                    <th className="px-2 py-2 text-white text-center">Supplier Bill No</th>
                                    <th className="px-2 py-2 text-white text-center">Supplier Bill Date</th>
                                    <th className="px-2 py-2 text-white text-center">#invoice</th>
                                    <th className="px-2 py-2 text-white text-center">Date</th>
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
                                            {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : ''}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.refNo}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.refDate ? dayjs(row.refDate).format('DD-MM-YYYY') : ''}
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
                  maxWidth={false}
                  fullWidth
                  onClose={handleCloseModal}
                  PaperComponent={PaperComponent}
                  aria-labelledby="draggable-dialog-title"
                  PaperProps={{
                    sx: {
                      width: { xs: '98vw', md: '95vw' },
                      maxWidth: '1600px',
                      minWidth: { xs: 'auto', md: '1200px' },
                      maxHeight: '65vh'
                    }
                  }}
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
                                <th className="table-header">Supplier Bill No</th>
                                <th className="table-header">Supplier Bill Date</th>
                                <th className="table-header">#Invoice</th>
                                <th className="table-header">Date</th>
                                <th className="table-header">Bill amt</th>
                                <th className="table-header">Tax</th>
                                <th className="table-header">Total Amt</th>
                                <th className="table-header">Net Payable</th>
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
                            <IconButton size="small" color="secondary" onClick={() => getPaymentById({ original: row })}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View PDF">
                            <IconButton size="small" color="secondary" onClick={() => handlePdfView({ original: row })}>
                              <PictureAsPdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell key={col.accessorKey} sx={{ whiteSpace: 'nowrap' }}>
                            {col.accessorKey === 'approveStatus' ? (
                              <Chip
                                size="small"
                                label={getListValue(row, col.accessorKey)}
                                sx={{ ...APPROVE_CHIP_STYLES[getListValue(row, col.accessorKey)], fontWeight: 700 }}
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
        title="Payment Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this payment?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseApprove}
      />

      {/* PDF preview: view first, then download or cancel */}
      <Dialog open={pdfOpen} onClose={handlePdfClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#673AB7', fontWeight: 600 }}>Payment Advice Preview</DialogTitle>
        <DialogContent dividers sx={{ p: 0, backgroundColor: '#f5f5f5' }}>
          {pdfUrl && <iframe title="Payment PDF preview" src={pdfUrl} style={{ width: '100%', height: '70vh', border: 0 }} />}
        </DialogContent>
        <DialogActions sx={{ p: '1rem 1.25rem' }}>
          <Button onClick={handlePdfClose} sx={{ color: '#673AB7' }}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handlePdfDownload} sx={{ backgroundColor: '#673AB7' }}>
            Download
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={pdfLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Payment;
