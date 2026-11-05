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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ConfirmationModal from 'utils/confirmationPopup';
import { showToast } from 'utils/toast-component';
// same images / same paths as MIMpdf (change the path if this file is in a different folder)
import companySeal from '../../../assets/images/users/aipta.png';
import accountantSign from '../../../assets/images/icons/Sign.png';

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

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
  return {
    ...r,
    key: r.arapDetailsId ?? `${r.refno || r.refNo}-${r.refdate || r.refDate}`,
    refNo: r.refno ?? r.refNo ?? '',
    refDate: r.refdate ?? r.refDate ?? '',
    vid: r.vid ?? r.supplierRefNo ?? r.supplierrefno ?? '',
    vdate: r.vdate ?? r.supplierRefDate ?? r.supplierrefdate ?? '',

    // Correct API mapping
    billAmount: r.billamount ?? r.billAmount ?? '',
    gstAmount: r.gstamount ?? r.gstAmount ?? '',

    // Total Amt should come directly from API amount
    totalAmt: r.amount ?? r.totalAmt ?? '',

    chargeAmt: r.chargeAmt ?? r.chargeamt ?? '',
    currency: r.acccurrency ?? r.currency ?? '',
    exRate: r.exrate ?? r.exRate ?? ''
  };
};

const cellStyle = { whiteSpace: 'nowrap' };

// Chip colours for the approval state (same palette in the form header and the list view)
const APPROVE_CHIP_STYLES = {
  APPROVED: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    border: '1px solid #a5d6a7'
  },
  REJECTED: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: '1px solid #ef9a9a'
  },
  PENDING: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    border: '1px solid #90caf9'
  }
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

// Indian currency format: 1,00,000.00
const formatIndianCurrency = (value) => {
  if (value === '' || value === null || value === undefined) return '';

  const num = Number(value);

  if (!Number.isFinite(num)) return value;

  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const fmtMoney = (value) => formatIndianCurrency(value || 0);
const fmtDate = (d) => {
  if (!d) return '';
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format('DD-MM-YYYY') : '';
};

// Amount in words (Indian numbering) e.g. 1,25,000.50 -> "Rupees One Lakh Twenty Five Thousand and Fifty Paise Only"
const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const twoDigitWords = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`);

const threeDigitWords = (n) => {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return [h ? `${ONES[h]} Hundred` : '', rest ? twoDigitWords(rest) : ''].filter(Boolean).join(' ');
};

const integerToWords = (num) => {
  if (num === 0) return 'Zero';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  return [
    crore ? `${twoDigitWords(crore % 100) || ''}${crore >= 100 ? '' : ''} Crore`.trim() : '',
    lakh ? `${twoDigitWords(lakh)} Lakh` : '',
    thousand ? `${twoDigitWords(thousand)} Thousand` : '',
    rest ? threeDigitWords(rest) : ''
  ]
    .filter(Boolean)
    .join(' ');
};

const amountToWords = (value, currency) => {
  const n = Math.abs(toNum(value));
  if (!n) return '';
  const whole = Math.floor(n);
  const paise = Math.round((n - whole) * 100);
  const isInr = !currency || currency === 'INR';
  const unit = isInr ? 'Rupees' : currency;
  const sub = isInr ? 'Paise' : 'Cents';
  return `${unit} ${integerToWords(whole)}${paise ? ` and ${twoDigitWords(paise)} ${sub}` : ''} Only`;
};

// ---------- PDF content (same design as MIMpdf) ----------
const pdfStyles = {
  container: {
    textAlign: 'center',
    margin: '0px 0',
    position: 'relative',
    fontFamily: 'Arial, sans-serif'
  },
  beforeAfter: {
    content: '""',
    position: 'absolute',
    top: '40%',
    width: '42%',
    height: '1px',
    backgroundColor: 'rgba'
  },
  before: { left: '0' },
  after: { right: '0' },
  text: {
    display: 'inline-block',
    padding: '0 5px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000000',
    borderRadius: '1px'
  }
};

const pdfTableSx = {
  '& td, & th': {
    padding: '0.5px',
    fontSize: '10px',
    borderRight: '1px groove #000',
    borderBottom: '1px groove #000',
    '&:last-child': { borderRight: 'none' }
  }
};

const pdfHeadRowSx = {
  borderBottom: '1px groove #000',
  '& th': {
    background: ' rgba(189, 186, 186, 0.74)',
    color: 'black',
    fontWeight: '600',
    borderRight: '1px groove rgba(0, 0, 0, 0.5)',
    '&:last-child': { borderRight: 'none' }
  }
};

const center = { textAlign: 'center' };
const right = { textAlign: 'right', paddingRight: '4px' };

const PaymentPdfContent = ({ vo, companyDetails, meta }) => {
  const rows = mapVoToRows(vo);
  const sumAmount = rows.reduce((s, r) => s + toNum(r.amount), 0);
  const sumGst = rows.reduce((s, r) => s + toNum(r.gstAmount), 0);
  const sumTotal = rows.reduce((s, r) => s + toNum(r.totalAmt), 0);
  const sumSettled = rows.reduce((s, r) => s + toNum(r.settled), 0);
  const balance = toNum(vo.onAccount);
  const transferredTo = vo.payTo || '-';

  return (
    <div
      id="payment-pdf-content"
      style={{
        padding: '10px',
        width: '210mm',
        height: 'auto',
        margin: '0 auto',
        fontFamily: 'Roboto, Arial, sans-serif',
        position: 'relative',
        backgroundColor: '#fff'
      }}
    >
      {/* <!-- Header Section --> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          marginBottom: '5px',
          borderBottom: '2px solid #000000',
          paddingBottom: '3px',
          color: '#333'
        }}
      >
        <div className="d-flex flex-row">
          {companyDetails.companyLogo && (
            <img
              src={`data:image/jpeg;base64,${companyDetails.companyLogo}`}
              alt="Logo"
              style={{ width: '80px', height: '97px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = dummyImageURL;
              }}
            />
          )}
          <div className="ms-2">
            <strong style={{ fontSize: '13px' }}>{meta.companyName}</strong>
            <div style={{ width: 198 }}>
              <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '8px', lineHeight: '1.6', marginBottom: 0 }}>
                {companyDetails.address}
              </p>
            </div>
            {companyDetails.city && (
              <div className="d-flex flex-row" style={{ fontSize: '10px' }}>
                {companyDetails.city} - {companyDetails.zip}
              </div>
            )}
            {companyDetails.cin && (
              <div className="d-flex flex-row" style={{ fontSize: '12px', margin: '0px' }}>
                CIN: {companyDetails.cin}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginRight: '100px' }}>
          <strong style={{ fontSize: '15px' }}>Payment Advice</strong>
        </div>
        <div>
          <div className="mb-0" style={{ fontSize: '10px' }}>
            Doc No<strong>: {vo.docId}</strong>
          </div>
          <div className="mb-0" style={{ fontSize: '10px' }}>
            Date<strong> : {vo.docDate ? fmtDate(vo.docDate) : 'N/A'}</strong>
          </div>
          <div className="mb-0" style={{ fontSize: '10px' }}>
            Branch<strong> : {meta.branch || meta.branchCode || '-'}</strong>
          </div>
          <div className="mb-0" style={{ fontSize: '10px' }}>
            Fin Year<strong> : {meta.finYear || '-'}</strong>
          </div>
          <div className="mb-0" style={{ fontSize: '10px' }}>
            Type<strong>: {vo.paymentType}</strong>
          </div>
        </div>
      </div>

      {/* <!-- Details Section --> */}
      <div
        style={{
          marginBottom: '0px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#555'
        }}
      >
        <div>
          <strong style={{ fontSize: '10px' }}>Paid By: {meta.companyName}</strong>
          <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
            <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Issued From:</strong>
            <p style={{ margin: 0, marginTop: 2, fontSize: '10px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
              {vo.bankCashAcc}
            </p>
          </div>
          <strong>GST In: </strong>
          {companyDetails.gst}
        </div>
        <div>
          <strong style={{ fontSize: '10px' }}>Party: {vo.partyName}</strong>
          {vo.partyCode && (
            <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
              <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Party Code:</strong>
              <p style={{ margin: 0, marginTop: 2, fontSize: '10px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                {vo.partyCode}
              </p>
            </div>
          )}
          {vo.gstState && (
            <div>
              <strong>Reg State: </strong>
              {vo.gstState}
            </div>
          )}
          <div>
            <strong>GST In: </strong>
            {vo.gstIn}
          </div>
        </div>
      </div>

      <div style={pdfStyles.container}>
        <div style={{ ...pdfStyles.beforeAfter, ...pdfStyles.before }} />
        <span style={pdfStyles.text}>Bill Details</span>
        <div style={{ ...pdfStyles.beforeAfter, ...pdfStyles.after }} />
      </div>

      {/* Bill table */}
      <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 0, border: '1px groove #000' }}>
        <Table size="small" sx={pdfTableSx}>
          <TableHead>
            <TableRow sx={pdfHeadRowSx}>
              <TableCell style={center}>S.No</TableCell>
              <TableCell style={center}>Bill Reference</TableCell>
              <TableCell style={center}>Bill Date</TableCell>
              <TableCell style={center}>Amount</TableCell>
              <TableCell style={center}>GST</TableCell>
              <TableCell style={center}>Total Amt</TableCell>
              {/* <TableCell style={center}>Settled</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell style={center}>{i + 1}</TableCell>
                <TableCell style={center}>{r.vid || r.refNo}</TableCell>
                <TableCell style={center}>{fmtDate(r.vdate || r.refDate)}</TableCell>
                <TableCell style={right}>{fmtMoney(r.amount)}</TableCell>
                <TableCell style={right}>{fmtMoney(r.gstAmount)}</TableCell>
                <TableCell style={right}>{fmtMoney(r.totalAmt)}</TableCell>
                {/* <TableCell style={right}>{fmtMoney(r.settled)}</TableCell> */}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} style={center}>
                  No bills settled (On Account payment)
                </TableCell>
              </TableRow>
            )}
            {rows.length > 0 && (
              <TableRow>
                <TableCell colSpan={3} style={{ ...right, fontWeight: 'bold' }}>
                  Total
                </TableCell>
                <TableCell style={{ ...right, fontWeight: 'bold' }}>{fmtMoney(sumAmount)}</TableCell>
                <TableCell style={{ ...right, fontWeight: 'bold' }}>{fmtMoney(sumGst)}</TableCell>
                <TableCell style={{ ...right, fontWeight: 'bold' }}>{fmtMoney(sumTotal)}</TableCell>
                {/* <TableCell style={{ ...right, fontWeight: 'bold' }}>{fmtMoney(sumSettled)}</TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment details */}
      <div style={{ ...pdfStyles.container, marginTop: '6px' }}>
        <div style={{ ...pdfStyles.beforeAfter, ...pdfStyles.before }} />
        <span style={pdfStyles.text}>Payment Details</span>
        <div style={{ ...pdfStyles.beforeAfter, ...pdfStyles.after }} />
      </div>
      <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 0, border: '1px groove #000' }}>
        <Table size="small" sx={pdfTableSx}>
          <TableHead>
            <TableRow sx={pdfHeadRowSx}>
              <TableCell style={center}>Payment Mode</TableCell>
              <TableCell style={center}>Transferred To</TableCell>
              <TableCell style={center}>UTR No</TableCell>
              <TableCell style={center}>UTR Date</TableCell>
              <TableCell style={center}>Issued From</TableCell>
              <TableCell style={center}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={center}>{vo.paymentType}</TableCell>
              <TableCell style={center}>{transferredTo}</TableCell>
              <TableCell style={center}>{vo.chequeNo || '-'}</TableCell>
              <TableCell style={center}>{fmtDate(vo.chequeDate || vo.docDate)}</TableCell>
              <TableCell style={center}>{vo.bankCashAcc}</TableCell>
              <TableCell style={{ ...right, fontWeight: 'bold' }}>{fmtMoney(vo.paymentAmt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* <!-- Total Section --> */}
      <div
        style={{
          textAlign: 'right',
          fontSize: '10px',
          color: '#333',
          marginTop: '4px'
        }}
        className="d-flex justify-content-between mb-2"
      >
        <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '10px', color: '#333' }}>
          <div style={{ width: '500px', marginBottom: '2px' }}>
            Amount in words:{' '}
            <span style={{ fontWeight: 'normal', fontStyle: 'italic', color: '#333', fontSize: '10px' }}>
              {amountToWords(vo.paymentAmt, vo.currency)}
            </span>
          </div>
          <div style={{ width: '500px', marginBottom: '2px' }}>
            Prepared By:{' '}
            <span style={{ fontWeight: 'normal', color: '#333', fontSize: '10px' }}>{vo.createdBy || meta.printedBy || '-'}</span>
          </div>
          {vo.remarks && (
            <div style={{ width: '500px', marginBottom: '2px' }}>
              Remarks: <span style={{ fontWeight: 'normal', color: '#333', fontSize: '10px' }}>{vo.remarks}</span>
            </div>
          )}
          {vo.approveStatus === 'Approved' && vo.approveBy && (
            <div style={{ width: '500px', marginBottom: '2px' }}>
              Approved By:{' '}
              <span style={{ fontWeight: 'normal', color: '#333', fontSize: '10px' }}>
                {vo.approveBy}
                {vo.approveOn ? ` on ${vo.approveOn}` : ''}
              </span>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column me-2">
            <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '10px', color: '#333', marginBottom: 0 }}>
              Payment Amount:
            </p>
            {toNum(vo.tdsAmt) > 0 && (
              <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '10px', color: '#333', marginBottom: 0 }}>
                TDS Amount:
              </p>
            )}
            <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '10px', color: '#333', marginBottom: 0 }}>
              Balance (On Account):
            </p>
          </div>
          <div className="d-flex flex-column">
            <div>
              <span style={{ fontWeight: 'normal', fontSize: '8px', color: '#333', marginLeft: 3 }}>₹{fmtMoney(vo.paymentAmt)}</span>
            </div>
            {toNum(vo.tdsAmt) > 0 && (
              <div>
                <span style={{ fontWeight: 'normal', fontSize: '8px', color: '#333', marginLeft: 3 }}>₹{fmtMoney(vo.tdsAmt)}</span>
              </div>
            )}
            <div>
              <span style={{ fontWeight: 'normal', fontSize: '8px', color: '#333', marginLeft: 3 }}>
                {balance > 0 ? `₹${fmtMoney(balance)}` : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ margin: 0 }} />
      <hr style={{ margin: 0 }} />

      {/* Declaration */}
      <div className="row mt-0 mb-0">
        <div className="col-lg-1">
          <strong style={{ width: 225, fontSize: '9px' }}>Declaration:</strong>
        </div>
        <div className="col-lg-10">
          <p style={{ fontSize: '9px', margin: '0px' }}>
            This payment advice is issued against the bills listed above. Any difference or discrepancy in the amount paid should be
            informed to {meta.companyName} in writing within 7 days from the date of this advice, failing which the payment will be treated
            as accepted.
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="row mb-1">
        <div className="col-lg-1">
          <strong style={{ width: 225, fontSize: '9px' }}>Note:</strong>
        </div>
        <div className="col-lg-10">
          <p style={{ fontSize: '9px' }}>
            1. The payment is made after deduction of applicable taxes (TDS), if any.
            <br />
            2. The balance shown as <strong>On Account</strong> will be adjusted against future bills of the party.
            <br />
            3. This is a system generated document and does not require a physical signature.
          </p>
        </div>
      </div>
      <hr style={{ margin: 0 }} />

      {/* Signatures */}

      {/* Signatures */}
      <div className="d-flex justify-content-between mt-1 mb-1">
        <div className="ms-5">
          <strong style={{ fontSize: '10px' }}>Prepared By:</strong>
        </div>
        <div className="me-5">
          <strong style={{ fontSize: '10px' }}>For {meta.companyName}:</strong>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-0 mb-0">
        <div className="d-flex">
          <div className="me-3 ms-5">
            <img src={companySeal} alt="Company Seal" style={{ height: '85px', objectFit: 'contain' }} />
          </div>
          <div className="ms-3">
            <img src={accountantSign} alt="Accountant Sign" style={{ height: '85px', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-1 mb-1">
        <div className="d-flex flex-column">
          <div className="ms-5">
            <strong style={{ fontSize: '10px' }}>Authorized Signature:</strong>
          </div>
          <div style={{ fontSize: '10px' }} className="ms-4">
            (Company Seal & Signature)
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="ms-4">
            <strong style={{ fontSize: '10px' }}>Authorized Signature:</strong>
          </div>
          <div style={{ fontSize: '10px' }} className="me-5">
            (Company Seal & Signature)
          </div>
        </div>
      </div>

      {/* <!-- Footer Section --> */}
      <div
        style={{
          borderTop: '1px outset',
          paddingTop: '1px',
          fontSize: '8px',
          color: '#777',
          textAlign: 'center',
          bottom: '0',
          width: '100%',
          marginTop: '5%'
        }}
      />
    </div>
  );
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
  const [companyName] = useState(localStorage.getItem('companyName'));
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

  // PDF preview (same approach as MIMpdf: HTML preview -> html2canvas -> jsPDF)
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfVo, setPdfVo] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});

  // Common information printed on every payment advice
  const pdfMeta = { companyName, branch, branchCode, finYear, printedBy: loginUserName };

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
    getCompanyDetails();
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

  // Company logo / address / city / zip / CIN / GST (same API MIMpdf uses)
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      if (response.status === true) {
        setCompanyDetails(response.paramObjectsMap.companyVO[0] || {});
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
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

  // Cash / Bank account names for the "Cash Account" dropdown
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
  // Used by the list view PDF icon and the form toolbar PDF button.
  // Loads the saved payment and opens the preview (same layout as MIMpdf).
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
      if (!companyDetails.companyLogo && !companyDetails.address) {
        await getCompanyDetails();
      }
      setPdfVo(vo);
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
    setPdfVo(null);
  };

  // Same download logic as MIMpdf: html2canvas -> jsPDF, footer on every page
  const handlePdfDownload = async () => {
    const input = document.getElementById('payment-pdf-content');
    if (!input || !pdfVo) {
      console.error('Main content element not found!');
      return;
    }

    setPdfLoading(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const padding = 5;
      const contentWidth = pdfWidth - 2 * padding;

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      const currentDateTime = `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`;
      let heightLeft = imgHeight;
      let position = 0;
      let pageNo = 1;
      const totalPages = Math.max(1, Math.ceil(imgHeight / (pdfHeight - 2 * padding)));

      // Footer on each page
      const addFooter = () => {
        const footerY = pdfHeight - 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(`${currentDateTime} | Printed By: ${localStorage.getItem('userName')}`, padding, footerY);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        const text = `Page ${pageNo} of ${totalPages}`;
        const textWidth = (pdf.getStringUnitWidth(text) * pdf.getFontSize()) / pdf.internal.scaleFactor;
        pdf.text(text, pdfWidth - padding - textWidth, footerY);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
      };

      // First page
      pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
      addFooter();
      heightLeft -= pdfHeight - 2 * padding;
      position = -pdfHeight;

      // Additional pages
      while (heightLeft > 0) {
        pdf.addPage();
        pageNo += 1;
        pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
        addFooter();
        heightLeft -= pdfHeight - 2 * padding;
        position -= pdfHeight;
      }

      const fileName = `Payment_${String(pdfVo.docId || '').replace(/[\\/:*?"<>|]/g, '-')}_${String(pdfVo.partyName || '').replace(
        /[\\/:*?"<>|]/g,
        '-'
      )}.pdf`;
      pdf.save(fileName);
      handlePdfClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('error', 'Unable to generate PDF');
    } finally {
      setPdfLoading(false);
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
      .filter((d) => !withdrawalsTableData.some((item) => item.refNo === d.refNo))
      .map((d) => ({
        id: Date.now() + Math.random(),
        vid: d.vid || '',
        vdate: toDateStr(d.vdate),
        refNo: d.refNo,
        refDate: toDateStr(d.refDate),
        currency: d.currency || 'INR',
        exRate: d.exRate,

        // Bill Amt
        amount: d.billAmount,

        gstAmount: toNum(d.gstAmount),

        // Total Amt
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

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    if (!formData.bankCashAcc) {
      errors.bankCashAcc = 'Cash Account is required';
    }

    if (!formData.remarks || !formData.remarks.trim()) {
      errors.remarks = 'Remarks is required';
    }

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
                {showForm && editId && <ActionButton title="PDF" icon={PictureAsPdfIcon} onClick={() => handlePdfView({ id: editId })} />}
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
                      label="Cash Account"
                      value={formData.bankCashAcc || ''}
                      disabled={isSubmitted}
                      onChange={(e) => {
                        setFormData({ ...formData, bankCashAcc: e.target.value });
                        setFormDataErrors({ ...formDataErrors, bankCashAcc: '' });
                      }}
                    >
                      {bankName.map((bank, index) => (
                        <MenuItem key={index} value={bank.accountName}>
                          {bank.accountName}
                        </MenuItem>
                      ))}

                      {/* Keeps a previously saved account visible if it is no longer in the API list */}
                      {formData.bankCashAcc && !bankName.some((b) => b.accountName === formData.bankCashAcc) && (
                        <MenuItem value={formData.bankCashAcc}>{formData.bankCashAcc}</MenuItem>
                      )}
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
                                            {formatIndianCurrency(row.billAmount)}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {formatIndianCurrency(row.gstAmount)}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {formatIndianCurrency(row.totalAmt)}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.currency}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {row.exRate}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {formatIndianCurrency(row.chargeAmt)}
                                          </td>
                                          <td className="border px-2 py-2 text-center" style={cellStyle}>
                                            {formatIndianCurrency(row.outstanding)}
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
                                              value={formatIndianCurrency(row.amount)}
                                              disabled
                                              readOnly
                                              style={{ width: '120px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={formatIndianCurrency(row.gstAmount)}
                                              disabled
                                              readOnly
                                              style={{ width: '150px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={formatIndianCurrency(row.totalAmt)}
                                              disabled
                                              readOnly
                                              style={{ width: '130px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={formatIndianCurrency(row.currency)}
                                              disabled
                                              readOnly
                                              style={{ width: '100px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={formatIndianCurrency(row.exRate)}
                                              disabled
                                              readOnly
                                              style={{ width: '100px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={formatIndianCurrency(row.chargeAmt ?? '')}
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
                                              value={formatIndianCurrency(row.outstanding ?? '')}
                                              style={{ width: '120px' }}
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.settled}
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
                                value={formatIndianCurrency(formData.netAmount)}
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
                                value={formatIndianCurrency(formData.onAccount)}
                                inputProps={{ maxLength: 30 }}
                                error={!!formDataErrors.onAccount}
                                helperText={formDataErrors.onAccount}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled" error={!!formDataErrors.remarks}>
                              <TextField
                                id="remarks"
                                name="remarks"
                                label="Remarks"
                                size="small"
                                required
                                disabled={isSubmitted}
                                value={formData.remarks}
                                onChange={(e) => {
                                  setFormData({ ...formData, remarks: e.target.value });
                                  setFormDataErrors((prev) => ({
                                    ...prev,
                                    remarks: ''
                                  }));
                                }}
                                inputProps={{ maxLength: 250 }}
                                error={!!formDataErrors.remarks}
                                helperText={formDataErrors.remarks || ''}
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
                                    {formatIndianCurrency(row.billAmount)}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {formatIndianCurrency(row.gstAmount)}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {formatIndianCurrency(row.totalAmt)}
                                  </td>
                                  <td className="border px-2 py-2 text-center" style={cellStyle}>
                                    {formatIndianCurrency(row.chargeAmt || 0)}
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
        title="Payment Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this payment?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseApprove}
      />

      {/* PDF preview (same design as MIMpdf): view first, then download or close */}
      <Dialog open={pdfOpen} onClose={handlePdfClose} maxWidth="md" fullWidth>
        <DialogTitle>PDF Preview</DialogTitle>
        <DialogContent>{pdfVo && <PaymentPdfContent vo={pdfVo} companyDetails={companyDetails} meta={pdfMeta} />}</DialogContent>
        <DialogActions>
          <Button onClick={handlePdfDownload} color="primary" variant="contained" startIcon={<DownloadIcon />}>
            PDF
          </Button>
          <Button onClick={handlePdfClose} color="secondary">
            Close
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
