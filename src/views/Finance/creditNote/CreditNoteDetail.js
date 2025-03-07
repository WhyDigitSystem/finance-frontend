import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { toWords } from 'number-to-words';
import { Autocomplete, Chip, FormHelperText, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ConfirmationModal from 'utils/confirmationPopup';
import GeneratePdfTempIRN from 'utils/pdfTempIRN';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

const IrnCreditNote = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [listViewById, setListViewById] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allPartyName, setAllPartyName] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [docId, setDocId] = useState('');
  const [value, setValue] = useState('1');
  const [partyTypeData, setPartyTypeData] = useState([]);
  const [originBillList, setOriginBillList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [approveStatus, setApproveStatus] = useState('');
  const [formData, setFormData] = useState({
    vohNo: '',
    dueDate: null,
    vohDate: null,
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    partyType: 'CUSTOMER',
    partyName: '',
    originBill: '',
    partyCode: '',
    supplierRefNo: '',
    jobNo: '',
    supplierRefDate: null,
    originBillDate: null,
    // currentDate: dayjs(),
    // currentDateValue: '',
    // product: '',
    creditDays: '',
    // dueDate: null,
    currency: '',
    exRate: '',
    status: 'PROFORMA',
    // remarks: '',
    address: '',
    shipRefNo: '',
    pincode: '',
    gstType: '',
    // billingMonth: '',
    // otherInfo: '',
    salesType: '',
    // exAmount: '',
    creditRemarks: '',
    // charges: '',
    stateCode: '',
    stateNo: '',
    recipientGSTIN: '',
    placeOfSupply: '',
    addressType: '',
    totalChargeAmountLc:'',
    totalTaxAmountLc:'',
    totalInvAmountLc:'',
    roundOffAmountLc:'',
    totalChargeAmountBc:'',
    totalTaxAmountBc:'',
    totalInvAmountBc:'',
    totalTaxableAmountLc:'',
    amountInWords:'',
    billingRemarks:'',
    summaryExRate: '',
    amtInWords: '',
    docId: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    vohNo: '',
    jobNo: '',
    vohDate: null,
    partyType: '',
    partyName: '',
    originBill: '',
    partyCode: '',
    supplierRefNo: '',
    supplierRefDate: null,
    // currentDate: dayjs(),
    // currentDateValue: '',
    // product: '',
    creditDays: '',
    // dueDate: null,
    currency: '',
    exRate: '',
    status: '',
    // remarks: '',
    address: '',
    shipRefNo: '',
    pincode: '',
    gstType: '',
    // billingMonth: '',
    // otherInfo: '',
    salesType: '',
    // exAmount: '',
    creditRemarks: '',
    // charges: '',
    stateCode: '',
    stateNo: '',
    recipientGSTIN: '',
    placeOfSupply: '',
    addressType: '',
    totalChargeAmountLc:'',
    totalTaxAmountLc:'',
    totalInvAmountLc:'',
    roundOffAmountLc:'',
    totalChargeAmountBc:'',
    totalTaxAmountBc:'',
    totalInvAmountBc:'',
    totalTaxableAmountLc:'',
    amountInWords:'',
    billingRemarks:'',
    summaryExRate: '',
    totTaxAmt: ''
  });

  const [irnChargesData, setIrnChargesData] = useState([
    {
      id: 1,
      jobNo: '',
      chargeType: '',
      chargeCode: '',
      // govChargeCode: '',
      description: '',
      ledger: '',
      chargeName: '',
      taxable: '',
      // applyOn: '',
      qty: '',
      rate: '',
      currency: '',
      exRate: '',
      exempted: '',
      fcAmount: '',
      lcAmount: '',
      tlcAmount: '',
      billAmount: '',
      sac: '',
      gstAmount: '',
      gstpercent: ''
    }
  ]);

  const [irnChargesError, setIrnChargesError] = useState([
    {
      // jobNo: '',
      chargeType: '',
      chargeCode: '',
      // govChargeCode: '',
      description: '',
      ledger: '',
      chargeName: '',
      taxable: '',
      // applyOn: '',
      qty: '',
      rate: '',
      currency: '',
      exRate: '',
      exempted: '',
      fcAmount: '',
      lcAmount: '',
      tlcAmount: '',
      billAmount: '',
      sac: '',
      gstAmount: '',
      gstpercent: ''
    }
  ]);

  const [irnGstData, setIrnGstData] = useState([
    {
      id: 1,
      chargeAcc: '',
      subLodgerCode: '',
      crBillAmt: '',
      crLCAmt: null,
      gstRemarks: '',
      dbillAmt: '',
      dblcamt: ''
    }
  ]);

  const [irnGstError, setIrnGstError] = useState([
    {
      chargeAcc: '',
      subLodgerCode: '',
      crBillAmt: '',
      crLCAmt: null,
      gstRemarks: '',
      dbillAmt: '',
      dblcamt: ''
    }
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value || ''; // ✅ Default to empty string if undefined

    // Define regex for numeric fields
    const isNumeric = /^[0-9]*$/;

    // Validation logic for numeric fields
    const numericFields = [
      'pincode',
      'creditDays',
      'exRate',
      'summaryExRate',
      'totalChargeAmountLc',
      'totalTaxAmountLc',
      'totalInvAmountLc',
      'roundOffAmountLc',
      'totalChargeAmountBc',
      'totalTaxAmountBc',
      'totalInvAmountBc',
      'totalTaxableAmountLc',
      'amountInWords',
      'billingRemarks',
    ];

    if (numericFields.includes(name)) {
      if (!isNumeric.test(inputValue)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Only numbers are allowed'
        }));
        return; // Prevent further form updates if invalid input
      }
    }

    // Handle other fields
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue
    }));

    // Clear error when input is valid
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false
    }));

    if (name === 'partyType') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        partyType: inputValue,
        partyName: '',
        partyCode: ''
      }));
      getAllPartyName(inputValue); // Fetch all party names based on selected partyType
      return;
    }

    if (name === 'partyName') {
      const selectedParty = allPartyName.find((party) => party.partyName === inputValue);
      setFormData((prevFormData) => ({
        ...prevFormData,
        partyName: inputValue,
        partyCode: selectedParty ? selectedParty.partyCode : ''
      }));
      return;
    }

    // If the currency field is being changed, update exRate based on the selected currency's sellingExRate
    if (name === 'currency') {
      const selectedCurrency = currencies.find((currency) => currency.currency === inputValue);
      if (selectedCurrency) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          exRate: selectedCurrency.sellingExRate || ''
        }));
      }
    }
  };
  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      vohNo: '',
      jobNo:'',
      vohDate: null,
      partyType: 'CUSTOMER',
      partyName: '',
      originBill: '',
      partyCode: '',
      supplierRefNo: '',
      supplierRefDate: null,
      // currentDate: dayjs(),
      // currentDateValue: '',
      // product: '',
      creditDays: '',
      // dueDate: null,
      currency: '',
      exRate: '',
      status: 'PROFORMA',
      // remarks: '',
      address: '',
      shipRefNo: '',
      pincode: '',
      gstType: '',
      // billingMonth: '',
      // otherInfo: '',
      salesType: '',
      // exAmount: '',
      creditRemarks: '',
      // charges: '',
      stateCode: '',
      stateNo: '',
      recipientGSTIN: '',
      placeOfSupply: '',
      addressType: '',
      totalChargeAmountLc:'',
      totalTaxAmountLc:'',
      totalInvAmountLc:'',
      roundOffAmountLc:'',
      totalChargeAmountBc:'',
      totalTaxAmountBc:'',
      totalInvAmountBc:'',
      totalTaxableAmountLc:'',
      amountInWords:'',
      billingRemarks:'',
      summaryExRate: '',
    });

    setFieldErrors({
      vohNo: '',
      jobNo:'',
      vohDate: null,
      partyType: '',
      partyName: '',
      originBill: '',
      partyCode: '',
      supplierRefNo: '',
      supplierRefDate: null,
      // currentDate: dayjs(),
      // currentDateValue: '',
      // product: '',
      creditDays: '',
      // dueDate: null,
      currency: '',
      exRate: '',
      status: '',
      // remarks: '',
      address: '',
      shipRefNo: '',
      pincode: '',
      gstType: '',
      // billingMonth: '',
      // otherInfo: '',
      salesType: '',
      // exAmount: '',
      creditRemarks: '',
      // charges: '',
      stateCode: '',
      stateNo: '',
      recipientGSTIN: '',
      placeOfSupply: '',
      addressType: '',
      totalChargeAmountLc:'',
      totalTaxAmountLc:'',
      totalInvAmountLc:'',
      roundOffAmountLc:'',
      totalChargeAmountBc:'',
      totalTaxAmountBc:'',
      totalInvAmountBc:'',
      totalTaxableAmountLc:'',
      amountInWords:'',
      billingRemarks:'',
      summaryExRate: '',
    });

    setIrnChargesData([
      {
        // id: 1,
        // jobNo: '',
        chargeType: '',
        chargeCode: '',
        // govChargeCode: '',
        description: '',
        ledger: '',
        chargeName: '',
        taxable: '',
        // applyOn: '',
        qty: '',
        rate: '',
        currency: '',
        exRate: '',
        exempted: '',
        fcAmount: '',
        lcAmount: '',
        tlcAmount: '',
        billAmount: '',
        sac: '',
        gstAmount: '',
        gstpercent: ''
      }
    ]);
    setIrnChargesError('');
    setEditId('');
    // setDocId('');
    getIrnCreditNoteDocId();
    setIrnGstData([
      {
        chargeAcc: '',
        subLodgerCode: '',
        crBillAmt: '',
        crLCAmt: null,
        gstRemarks: '',
        dbillAmt: '',
        dblcamt: ''
      }
    ]);
    setIrnGstError('');
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleOpenModalApprove = () => {
    setModalOpen(true);
    setApproveStatus('Approved');
  };

  const handleOpenModalReject = () => {
    setModalOpen(true);
    setApproveStatus('Rejected');
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmAction = async (docId) => {
    try {
      const result = await apiCalls(
        'put',
        `/irnCreditNote/approveIrnCreditNote?orgId=${orgId}&action=${approveStatus}&actionBy=${loginUserName}&docId=${encodeURIComponent(docId)}&id=${formData.id}`
      );
      console.log('API Response:==>', result);
      if (result.status === true) {
        setFormData({ ...formData, approveStatus: result.paramObjectsMap.irnCreditNoteVO.approveStatus });
        showToast(
          result.paramObjectsMap.irnCreditNoteVO.approveStatus === 'Approved' ? 'success' : 'error',
          result.paramObjectsMap.irnCreditNoteVO.approveStatus === 'Approved'
            ? ' Credit Note Approved successfully'
            : 'Credit Note Rejected successfully'
        );
        const listValueVO = result.paramObjectsMap.irnCreditNoteVO;
        setFormData({
          docId: listValueVO.docId,
          approveStatus: listValueVO.approveStatus,
          approveBy: listValueVO.approveBy,
          approveOn: listValueVO.approveOn,
          docDate: listValueVO.docDate,
          type: listValueVO.type,
          partyCode: listValueVO.partyCode,
          partyName: listValueVO.partyName,
          partyType: listValueVO.partyType,
          originBill: listValueVO.originBillNo,
          bizType: listValueVO.bizType,
          bizMode: listValueVO.bizMode,
          stateNo: listValueVO.stateNo,
          stateCode: listValueVO.stateCode,
          address: listValueVO.address,
          addressType: listValueVO.addressType,
          gstType: listValueVO.gstType,
          pinCode: listValueVO.pinCode,
          placeOfSupply: listValueVO.placeOfSupply,
          recipientGSTIN: listValueVO.recipientGSTIN,
          billCurr: listValueVO.billCurr,
          status: listValueVO.status,
          // salesType: listValueVO.salesType,
          updatedBy: listValueVO.updatedBy,
          supplierBillNo: listValueVO.supplierBillNo,
          supplierBillDate: listValueVO.supplierBillDate,
          billCurrRate: listValueVO.billCurrRate,
          // exAmount: listValueVO.exAmount,
          creditDays: listValueVO.creditDays,
          contactPerson: listValueVO.contactPerson,
          shipperInvoiceNo: listValueVO.shipperInvoiceNo,
          billOfEntry: listValueVO.billOfEntry,
          billMonth: listValueVO.billMonth,
          invoiceNo: listValueVO.invoiceNo,
          invoiceDate: listValueVO.invoiceDate,
          id: listValueVO.id,
          totalChargeAmountLc: listValueVO.totalChargeAmountLc,
          totalChargeAmountBc: listValueVO.totalChargeAmountBc,
          totalTaxAmountLc: listValueVO.totalTaxAmountLc,
          roundOffAmountLc: listValueVO.roundOffAmountLc,
          totalInvAmountLc: listValueVO.totalInvAmountLc,
          totalInvAmountBc: listValueVO.totalInvAmountBc,
          totalTaxAmountBc: listValueVO.totalTaxAmountBc,
          totalTaxableAmountLc: listValueVO.totalTaxableAmountLc,
          amountInWords: listValueVO.amountInWords,
          billingRemarks: listValueVO.billingRemarks
        });
        handleCloseModal();
        getAllIrnCredit();
        console.log('Credit Note:==>', result);
      } else {
        console.error('API Error:', result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
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

  const handleDeleteRow1 = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const getAllOriginalBill = async (party) => {
    try {
      const response = await apiCalls('get', `irnCreditNote/getOrginBillNoByParty?branchCode=${branchCode}&orgId=${orgId}&party=${party}`);
      if (response.status === true) {
        // Update the origin bill dropdown options
        setOriginBillList(response.paramObjectsMap.taxInvoiceVO || []);
      } else {
        console.error('Failed to fetch origin bills:', response);
      }
    } catch (error) {
      console.error('Error fetching origin bills:', error);
    }
  };

  const handleOriginBillSelection = (selectedBill) => {
    if (selectedBill) {
      // Update the formData with selected bill data (excluding table data for Party Name)
      setFormData((prev) => ({
        ...prev,
        creditDays: selectedBill.creditDays,
        currency: selectedBill.billCurr,
        exRate: parseFloat(selectedBill.billCurrRate),
        originBill: selectedBill.originBillNo,
        originBillDate: selectedBill.docDate,
        address: selectedBill.address,
        pincode: selectedBill.pinCode,
        gstType: selectedBill.gstType,
        stateCode: selectedBill.stateCode,
        stateNo: selectedBill.stateNo,
        recipientGSTIN: selectedBill.recipientGSTIN,
        placeOfSupply: selectedBill.placeOfSupply,
        addressType: selectedBill.addressType,
        shipRefNo: selectedBill.shipperInvoiceNo,
        jobNo: selectedBill.jobOrderNo,
        supplierRefNo: selectedBill.invoiceNo,
        supplierRefDate: selectedBill.invoiceDate,
        dueDate: selectedBill.dueDate,
        totalChargeAmountLc: selectedBill.totalChargeAmountLc,
        totalChargeAmountBc: selectedBill.totalChargeAmountBc,
        totalTaxAmountLc: selectedBill.totalTaxAmountLc,
        roundOffAmountLc: selectedBill.roundOffAmountLc,
        totalInvAmountLc: selectedBill.totalInvAmountLc,
        totalInvAmountBc: selectedBill.totalInvAmountBc,
        totalTaxAmountBc: selectedBill.totalTaxAmountBc,
        totalTaxableAmountLc: selectedBill.totalTaxableAmountLc,
        amountInWords: selectedBill.amountInWords,
        billingRemarks: selectedBill.billingRemarks
      }));
      if (selectedBill.taxInvoiceDetailsVO) {
        setIrnChargesData(
          selectedBill.taxInvoiceDetailsVO.map((item) => ({
            id: item.id,
            chargeType: item.chargeType,
            chargeCode: item.chargeCode,
            // govChargeCode: item.govChargeCode,
            description: item.description,
            ledger: item.ledger,
            chargeName: item.chargeName,
            taxable: item.taxable,
            qty: parseFloat(item.qty).toFixed(2),
            rate: parseFloat(item.rate).toFixed(2),
            currency: item.currency,
            exRate: parseFloat(item.exRate).toFixed(2),
            exempted: item.exempted,
            fcAmount: parseFloat(item.fcAmount).toFixed(2),
            lcAmount: parseFloat(item.lcAmount).toFixed(2),
            tlcAmount: item.tlcAmount,
            billAmount: parseFloat(item.billAmount).toFixed(2),
            sac: item.sac,
            gstAmount: parseFloat(item.gstAmount).toFixed(2),
            gstpercent: item.gstpercent
            // Map other fields as needed
          }))
        );
      }
      console.log('orgin bill ', formData.originBillDate, 'docDate', selectedBill.docDate);
    }
  };

  const getAllPartyTypeByOrgId = async () => {
    try {
      const response = await apiCalls('get', `master/getAllPartyTypeByOrgId?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setPartyTypeData(response.paramObjectsMap.partyTypeVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllCurrency = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getCurrencyAndExrateDetails?orgId=${orgId}`);
      setCurrencies(response.paramObjectsMap.currencyVO);

      console.log('Test===>', response.paramObjectsMap.currencyVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  useEffect(() => {
    getAllPartyName();
    getIrnCreditNoteDocId();
    getAllPartyTypeByOrgId();
    getAllCurrency();
    getAllIrnCredit();
  }, []);

  const getIrnCreditNoteDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `irnCreditNote/getIrnCreditNoteDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        if (response.paramObjectsMap.irnCreditVO && response.paramObjectsMap.irnCreditVO) {
          setDocId(response.paramObjectsMap.irnCreditVO); // Extracting the actual docId
        } else {
          console.error('Invalid response format: Missing docId');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPartyName = async (partyType) => {
    try {
      const response = await apiCalls('get', `irnCreditNote/getPartyNameByPartyType?orgId=${orgId}&partyType=${partyType}`);
      console.log('API Response:', response);
      // &partyType=${partyType}

      if (response.status === true) {
        setAllPartyName(response.paramObjectsMap.partyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllIrnCredit = async () => {
    try {
      const response = await apiCalls('get', `irnCreditNote/getAllIrnCreditByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.irnCreditVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getIrnCreditById = async (row) => {
    console.log('first', row);
    setEditId(row.original.id);
    setListView(false);

    try {
      const response = await apiCalls('get', `/irnCreditNote/getIrnCreditById?id=${row.original.id}`);
      if (response.status === true) {
        const irnCreditNoteVO = response.paramObjectsMap.irnCreditVO[0];
        setListViewById(response.paramObjectsMap.irnCreditVO[0]);
        setDocId(irnCreditNoteVO.docId);
        setFormData({
          jobNo: irnCreditNoteVO.jobNo,
          partyName: irnCreditNoteVO.partyName,
          partyCode: irnCreditNoteVO.partyCode,
          partyType: irnCreditNoteVO.partyType,
          stateCode: irnCreditNoteVO.stateCode,
          approveStatus: irnCreditNoteVO.approveStatus,
          approveBy: irnCreditNoteVO.approveBy,
          approveOn: irnCreditNoteVO.approveOn,
          stateNo: irnCreditNoteVO.stateNo,
          recipientGSTIN: irnCreditNoteVO.recipientGSTIN,
          placeOfSupply: irnCreditNoteVO.placeOfSupply,
          addressType: irnCreditNoteVO.addressType,
          address: irnCreditNoteVO.address,
          pincode: irnCreditNoteVO.pinCode,
          status: irnCreditNoteVO.status,
          gstType: irnCreditNoteVO.gstType,
          originBill: irnCreditNoteVO.originBillNo,
          vohNo: irnCreditNoteVO.voucherNo,
          vohDate: irnCreditNoteVO.voucherDate,
          supplierRefNo: irnCreditNoteVO.supplierRefNo,
          supplierRefDate: irnCreditNoteVO.supplierRefDate,
          currency: irnCreditNoteVO.billCurr,
          exRate: irnCreditNoteVO.billCurrRate,
          // exAmount: irnCreditNoteVO.exAmount,
          creditDays: irnCreditNoteVO.creditDays,
          shipRefNo: irnCreditNoteVO.shipperRefNo,
          id: irnCreditNoteVO.id,
          // dueDate: irnCreditNoteVO.dueDate,
          // billingMonth: irnCreditNoteVO.billMonth,
          // salesType: irnCreditNoteVO.salesType,
          creditRemarks: irnCreditNoteVO.creditRemarks,
          supplierRefDate: irnCreditNoteVO.invoiceDate,
          totalChargeAmountLc: irnCreditNoteVO.totalChargeAmountLc,
          totalChargeAmountBc: irnCreditNoteVO.totalChargeAmountBc,
          totalTaxAmountLc: irnCreditNoteVO.totalTaxAmountLc,
          roundOffAmountLc: irnCreditNoteVO.roundOffAmountLc,
          totalInvAmountLc: irnCreditNoteVO.totalInvAmountLc,
          totalInvAmountBc: irnCreditNoteVO.totalInvAmountBc,
          totalTaxAmountBc: irnCreditNoteVO.totalTaxAmountBc,
          totalTaxableAmountLc: irnCreditNoteVO.totalTaxableAmountLc,
          amountInWords: irnCreditNoteVO.amountInWords,
          billingRemarks: irnCreditNoteVO.billingRemarks
          // summaryExRate: irnCreditNoteVO.summaryExRate,
          // totTaxAmt: irnCreditNoteVO.totTaxAmt
        });
        setIrnChargesData(
          irnCreditNoteVO.irnCreditNoteDetailsVO.map((invoiceData) => ({
            id: invoiceData.id,
            // jobNo: invoiceData.jobNo,
            chargeType: invoiceData.chargeType,
            chargeCode: invoiceData.chargeCode,
            description: invoiceData.description,
            // govChargeCode: invoiceData.govChargeCode,
            ledger: invoiceData.ledger,
            chargeName: invoiceData.chargeName,
            taxable: invoiceData.taxable,
            // applyOn: invoiceData.applyOn,
            qty: invoiceData.qty,
            rate: invoiceData.rate,
            currency: invoiceData.currency,
            exRate: invoiceData.exRate,
            exempted: invoiceData.exempted,
            fcAmount: invoiceData.fcAmount,
            lcAmount: invoiceData.lcAmount,
            tlcAmount: invoiceData.tlcAmount,
            billAmount: invoiceData.billAmount,
            sac: invoiceData.sac,
            gstAmount: invoiceData.gstAmount,
            gstpercent: invoiceData.gstpercent
          }))
        );
        setIrnGstData(
          irnCreditNoteVO.irnCreditNoteGstVO.map((invoiceData) => ({
            id: invoiceData.id,
            chargeAcc: invoiceData.gstChargeAcc,
            subLodgerCode: invoiceData.gstSubledgerCode,
            dbillAmt: invoiceData.gstDbBillAmount,
            crBillAmt: invoiceData.gstCrBillAmount,
            dblcamt: invoiceData.gstDbLcAmount,
            crLCAmt: invoiceData.gstCrLcAmount
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
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    const errors = {};
    const tableErrors = irnChargesData.map((row) => ({
      rate: !row.rate ? 'Rate is required' : ''
    }));

    let hasTableErrors = false;

    tableErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableErrors = true;
      }
    });
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.partyCode) {
      errors.partyCode = 'Party Code is required';
    }
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    // if (!formData.currency) {
    //   errors.currency = 'Currency is required';
    // }
    // if (!formData.exRate) {
    //   errors.exRate = 'Ex Rate is required';
    // }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.stateCode) {
      errors.stateCode = 'State Code is required';
    }
    if (!formData.stateNo) {
      errors.stateNo = 'State No is required';
    }
    if (!formData.recipientGSTIN) {
      errors.recipientGSTIN = 'Recipient Reg No is required';
    }
    if (!formData.placeOfSupply) {
      errors.placeOfSupply = 'Place Of Supply is required';
    }
    if (!formData.addressType) {
      errors.addressType = 'Address Type is required';
    }
    if (!formData.originBill) {
      errors.originBill = 'Origin Bill is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    // if (!formData.shipRefNo) {
    //   errors.shipRefNo = 'shipper RefNo is required';
    // }
    if (!formData.gstType) {
      errors.gstType = 'Tax Type is required';
    }
    console.log('Error Save', errors);

    setFieldErrors(errors);
    setIrnChargesError(tableErrors);

    // Prevent saving if form or table errors exist
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const irnCreditChargesVo = irnChargesData.map((row) => ({
        ...(editId && { id: row.id }),
        chargeType: row.chargeType,
        chargeCode: row.chargeCode,
        description: row.description,
        // govChargeCode: row.govChargeCode,
        ledger: row.ledger,
        chargeName: row.chargeName,
        taxable: row.taxable,
        qty: parseInt(row.qty),
        rate: parseInt(row.rate),
        currency: row.currency,
        exRate: parseInt(row.exRate),
        exempted: row.exempted,
        sac: row.sac,
        gstpercent: parseInt(row.gstpercent)
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        address: formData.address,
        jobNo: formData.jobNo,
        dueDate: formatDate(formData.dueDate),
        addressType: formData.addressType,
        billCurr: formData.currency,
        billCurrRate: parseInt(formData.exRate),
        branch: branch,
        status: formData.status,
        branchCode: branchCode,
        createdBy: loginUserName,
        creditDays: parseInt(formData.creditDays),
        // exAmount: parseInt(formData.exAmount),
        creditRemarks: formData.creditRemarks || null,
        finYear: finYear,
        gstType: formData.gstType,
        originBillDate: formData.originBillDate,
        irnCreditNoteDetailsDTO: irnCreditChargesVo,
        orgId: parseInt(orgId),
        originBillNo: formData.originBill,
        partyCode: formData.partyCode,
        partyName: formData.partyName,
        partyType: formData.partyType,
        pinCode: formData.pincode,
        placeOfSupply: formData.placeOfSupply,
        recipientGSTIN: formData.recipientGSTIN,
        // salesType: formData.salesType,
        shipperRefNo: formData.shipRefNo || null,
        stateCode: formData.stateCode,
        stateNo: formData.stateNo,
        status: formData.status,
        supplierRefDate: formatDate(formData.supplierRefDate),
        supplierRefNo: formData.supplierRefNo,
        voucherDate: formatDate(formData.vohDate),
        voucherNo: formData.vohNo,
        bizMode: 'TAX',
        bizType: 'B2B'
      };

      try {
        const response = await apiCalls('put', `/irnCreditNote/updateCreateIrnCreditNote`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'IRN Credit Note Updated Successfully' : 'IRN Credit Note created successfully');
          handleClear();
          getAllIrnCredit();
          getIrnCreditNoteDocId();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'IRN Credit Note creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'IRN Credit Note creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (formData.partyName) {
      getAllOriginalBill(formData.partyName);
    }
  }, [formData.partyName]);

  useEffect(() => {
    if (formData.partyType) {
      getAllPartyName(formData.partyType);
    }
  }, [formData.partyType]);

  const listViewColumns = [
    { accessorKey: 'status', header: 'Status', size: 140 },
    { accessorKey: 'approveStatus', header: 'Approve Status', size: 140 },
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 }
    // { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    // { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    // { accessorKey: 'voucherNo', header: 'Voucher No', size: 140 },
    // { accessorKey: 'voucherDate', header: 'Voucher Date', size: 140 }
  ];

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };
  useEffect(() => {
    if (irnChargesData && irnChargesData.length) {
      calculateTotals(irnChargesData, setFormData);
    }
  }, [irnChargesData, setFormData]);
  
  const calculateTotals = (rows, setFormData) => {
    if (!Array.isArray(rows)) return; // Ensure rows is an array
  
    console.log("irncreditnote table values", rows);
  
    const totalChargeAmountLc = rows.reduce((sum, row) => sum + (parseFloat(row.lcAmount) || 0), 0);
    const totalTaxAmountLc = rows.reduce((sum, row) => sum + (parseFloat(row.gstAmount) || 0), 0);
    const totalInvAmountLc = totalChargeAmountLc + totalTaxAmountLc;
    const roundOffAmountLc = totalInvAmountLc;
    const totalChargeAmountBc = rows.reduce((sum, row) => sum + (parseFloat(row.billAmount) || 0), 0);
    const totalTaxAmountBc = rows.reduce((sum, row) => sum + (parseFloat(row.gstAmount) || 0), 0);
    const totalInvAmountBc = totalChargeAmountBc + totalTaxAmountBc;
    const totalTaxableAmountLc = 0;
  
    setFormData((prev) => ({
      ...prev,
      totalChargeAmountLc: totalChargeAmountLc.toFixed(2),
      totalTaxAmountLc: totalTaxAmountLc.toFixed(2),
      totalInvAmountLc: totalInvAmountLc.toFixed(2),
      roundOffAmountLc: roundOffAmountLc.toFixed(2),
      totalChargeAmountBc: totalChargeAmountBc.toFixed(2),
      totalTaxAmountBc: totalTaxAmountBc.toFixed(2),
      totalInvAmountBc: totalInvAmountBc.toFixed(2),
      totalTaxableAmountLc: totalTaxableAmountLc.toFixed(2),
      amountInWords: toWords(Math.round(totalInvAmountLc)).toUpperCase(),
    }));
  };
  
  const handleRowUpdate = async (index, field, value) => {
    setIrnChargesData((prev) => {
      return prev.map((row, idx) => {
        if (idx === index) {
          const updatedRow = { ...row, [field]: value };
          const rate = Number(updatedRow.rate) || 0;
          const selectedCurrencyData = currencies.find((currency) => currency.currency === updatedRow.currency);
          const exRate = selectedCurrencyData?.buyingExRate || 1;
          const fcAmount = updatedRow.currency === 'INR' ? 0 : rate;
          const lcAmount = rate * exRate;
          const billAmount = rate * exRate;
          const gstAmount = (lcAmount * updatedRow.gstpercent) / 100;

          return {
            ...updatedRow,
            // rate,
            exRate,
            fcAmount,
            lcAmount,
            billAmount,
            gstAmount,
          };
        }
        return row;
      });
    });

    setIrnChargesError((prev) => {
      const newErrors = [...prev];
      const updatedErrors = {
        ...newErrors[index],
        [field]: !value ? `${field} is required` : ''
      };
      newErrors[index] = updatedErrors;
      return newErrors;
    });
  };

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row">
          <div className="d-flex flex-wrap justify-content-between mb-4" style={{ marginBottom: '20px' }}>
            <div className="d-flex">
              {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
              <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            </div>
            {editId && !listView && (formData.status.toUpperCase() === 'TAX' || listViewById.status === 'TAX') && (
              // {editId && !listView && (
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
                {listViewById.status === 'TAX' && formData.approveStatus !== 'Approved' && formData.approveStatus !== 'Rejected' && (
                  <div className="d-flex" style={{ marginRight: '30px' }}>
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
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getIrnCreditById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <GeneratePdfTempIRN row={pdfData} />}
          </div>
        ) : (
          <>
            <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField id="docId" name="docId" label="Doc No" size="small" value={docId} disabled required fullWidth />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      disabled
                      value={dayjs()}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      readOnly
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="vohNo"
                    name="vohNo"
                    label="Voucher No"
                    size="small"
                    value={formData.vohNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.vohNo}
                    helperText={fieldErrors.vohNo}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Voucher Date"
                      value={formData.vohDate ? dayjs(formData.vohDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('vohDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                      error={!!fieldErrors.vohDate}
                      helperText={fieldErrors.vohDate ? fieldErrors.vohDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Status
                  </InputLabel>
                  <Select
                    labelId="statusLabel"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                    required
                    disabled={formData.status === 'TAX' || !editId}
                  >
                    {editId && <MenuItem value="TAX">TAX</MenuItem>}
                    <MenuItem value="PROFORMA">PROFORMA</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.partyType}>
                  <InputLabel id="partyType">Party Type</InputLabel>
                  <Select
                    labelId="partyType"
                    label="Party Type"
                    name="partyType"
                    disabled
                    value={formData.partyType}
                    onChange={handleInputChange}
                  >
                    {partyTypeData?.map((row) => (
                      <MenuItem key={row.id} value={row.partyType}>
                        {row.partyType}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={allPartyName}
                  getOptionLabel={(option) => option.partyName}
                  disabled={formData.status === 'TAX'}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.partyName ? allPartyName.find((c) => c.partyName === formData.partyName) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'partyName',
                        value: newValue ? newValue.partyName : ''
                      }
                    });
                    if (newValue) {
                      getAllOriginalBill(newValue.partyName);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Party Name"
                      name="partyName"
                      error={!!fieldErrors.partyName}
                      helperText={fieldErrors.partyName}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partyCode"
                    name="partyCode"
                    label="Party Code"
                    size="small"
                    value={formData.partyCode}
                    // onChange={handleInputChange}
                    // error={!!fieldErrors.partyCode}
                    // helperText={fieldErrors.partyCode}
                    disabled
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.originBill}>
                  <InputLabel id="originBill">Origin Bill</InputLabel>
                  <Select
                    labelId="originBill"
                    label="Origin Bill"
                    name="originBill"
                    disabled={formData.status === 'TAX'}
                    value={formData.originBill}
                    onChange={(event) => {
                      const selectedDocId = event.target.value;
                      const selectedBill = originBillList.find((item) => item.docId === selectedDocId);
                      handleOriginBillSelection(selectedBill);
                      setFormData((prev) => ({
                        ...prev,
                        originBill: selectedDocId ? selectedDocId : ''
                      }));
                    }}
                  >
                    {originBillList?.map((row) => (
                      <MenuItem key={row.id} value={row.docId}>
                        {row.docId}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.originBill && <FormHelperText>{fieldErrors.originBill}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="supplierRefNo"
                    name="supplierRefNo"
                    label="Supplier Ref No"
                    disabled
                    size="small"
                    value={formData.supplierRefNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.supplierRefNo}
                    helperText={fieldErrors.supplierRefNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Supplier Ref. Date."
                      value={formData.supplierRefDate ? dayjs(formData.supplierRefDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('supplierRefDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.supplierRefDate}
                      helperText={fieldErrors.supplierRefDate ? fieldErrors.supplierRefDate : ''}
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.currentDate ? dayjs(formData.currentDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('currentDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.currentDate}
                      helperText={fieldErrors.currentDate ? fieldErrors.currentDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="currentDateValue"
                    name="currentDateValue"
                    value={formData.currentDateValue}
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    error={!!fieldErrors.currentDateValue}
                    helperText={fieldErrors.currentDateValue}
                  />
                </FormControl>
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.product}>
                  <InputLabel id="product" required>
                    Product
                  </InputLabel>
                  <Select
                    labelId="product"
                    id="product"
                    name="product"
                    required
                    value={formData.product}
                    label="product"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'CO'}>CO</MenuItem>
                    <MenuItem value={'TO'}>TO</MenuItem>
                  </Select>
                  {fieldErrors.product && <FormHelperText>{fieldErrors.product}</FormHelperText>}
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="creditDays"
                    name="creditDays"
                    label="Credit Days"
                    size="small"
                    value={formData.creditDays}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.creditDays}
                    helperText={fieldErrors.creditDays}
                    disabled
                  />
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('dueDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.dueDate}
                      helperText={fieldErrors.dueDate ? fieldErrors.dueDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                  <InputLabel id="currency">Currency</InputLabel>
                  <Select
                    labelId="currency"
                    id="currency"
                    label="currency"
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
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="currency"
                    name="currency"
                    label="Currency"
                    size="small"
                    value={formData.currency}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.currency}
                    helperText={fieldErrors.currency}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="exRate"
                    name="exRate"
                    label="Ex. Rate"
                    size="small"
                    value={formData.exRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.exRate}
                    helperText={fieldErrors.exRate}
                    disabled
                  />
                </FormControl>
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status" required>
                    Status
                  </InputLabel>
                  <Select
                    labelId="status"
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    label="status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={'OPEN'}>OPEN</MenuItem>
                    <MenuItem value={'RELEASED'}>RELEASED</MenuItem>
                  </Select>
                  {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div> */}

              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="remarks"
                    name="remarks"
                    label="Remarks"
                    size="small"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 150 }}
                    error={!!fieldErrors.remarks}
                    helperText={fieldErrors.remarks}
                  />
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="stateCode"
                    name="stateCode"
                    label="State Code"
                    size="small"
                    value={formData.stateCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.stateCode}
                    helperText={fieldErrors.stateCode}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="stateNo"
                    name="stateNo"
                    label="State No"
                    size="small"
                    value={formData.stateNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.stateNo}
                    helperText={fieldErrors.stateNo}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="recipientGSTIN"
                    name="recipientGSTIN"
                    label="Recipient Reg No"
                    size="small"
                    value={formData.recipientGSTIN}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.recipientGSTIN}
                    helperText={fieldErrors.recipientGSTIN}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="placeOfSupply"
                    name="placeOfSupply"
                    label="Place Of Supply"
                    size="small"
                    value={formData.placeOfSupply}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.placeOfSupply}
                    helperText={fieldErrors.placeOfSupply}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="addressType"
                    name="addressType"
                    label="Address Type"
                    size="small"
                    value={formData.addressType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.addressType}
                    helperText={fieldErrors.addressType}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="address"
                    name="address"
                    label="Address"
                    size="small"
                    value={formData.address}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 200 }}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                    disabled
                  />
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="shipRefNo"
                    name="shipRefNo"
                    label="Shipper Ref. No."
                    size="small"
                    disabled
                    value={formData.shipRefNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.shipRefNo}
                    helperText={fieldErrors.shipRefNo}
                  />
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="pincode"
                    name="pincode"
                    label="Pin code"
                    size="small"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.pincode}
                    helperText={fieldErrors.pincode}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="gstType"
                    name="gstType"
                    label="TAX Type"
                    size="small"
                    value={formData.gstType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.gstType}
                    helperText={fieldErrors.gstType}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="jobNo"
                    name="jobNo"
                    label="Job No"
                    size="small"
                    value={formData.jobNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.jobNo}
                    helperText={fieldErrors.jobNo}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="creditRemarks"
                    name="creditRemarks"
                    label="Credit Remarks"
                    disabled={formData.status === 'TAX'}
                    size="small"
                    value={formData.creditRemarks}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 150 }}
                    error={!!fieldErrors.creditRemarks}
                    helperText={fieldErrors.creditRemarks}
                  />
                </FormControl>
              </div>
            </div>

            <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                      <Tab label="Charges" value="1" />
                      <Tab label="Summary" value="2" />
                      {editId && <Tab label="Tax" value="3" />}
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    {/* <TableComponent /> */}
                    <div className="row d-flex ml">
                      <div className="mb-1">{/* <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} /> */}</div>
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
                                  {/* <th className="px-2 py-2 text-white text-center">Job Number</th> */}
                                  <th className="px-2 py-2 text-white text-center">Charge Type</th>
                                  <th className="px-2 py-2 text-white text-center">Charge Code</th>
                                  {/* <th className="px-2 py-2 text-white text-center">GCharge Code</th> */}
                                  <th className="px-2 py-2 text-white text-center">Description</th>
                                  <th className="px-2 py-2 text-white text-center">Ledger</th>
                                  <th className="px-2 py-2 text-white text-center">Charge Name</th>
                                  {/* <th className="px-2 py-2 text-white text-center">Apply On</th> */}
                                  <th className="px-2 py-2 text-white text-center">Taxable</th>
                                  <th className="px-2 py-2 text-white text-center">Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Rate</th>
                                  {/* <th className="px-2 py-2 text-white text-center">Currency</th>
                                  <th className="px-2 py-2 text-white text-center">Ex. Rate</th> */}
                                  <th className="px-2 py-2 text-white text-center">Excempted</th>
                                  <th className="px-2 py-2 text-white text-center">FC Amount</th>
                                  <th className="px-2 py-2 text-white text-center">LC Amount</th>
                                  {/* <th className="px-2 py-2 text-white text-center">TLC Amount</th> */}
                                  <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                                  <th className="px-2 py-2 text-white text-center">SAC</th>
                                  <th className="px-2 py-2 text-white text-center">TAX</th>
                                  <th className="px-2 py-2 text-white text-center">TAX %</th>
                                  {/* <th className="px-2 py-2 text-white text-center">Remarks</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(irnChargesData) &&
                                  irnChargesData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(row.id, irnChargesData, setIrnChargesData, irnChargesError, setIrnChargesError)
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeType}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, chargeType: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeType: !value ? 'Charge Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              // Remove this block to not set any error for non-numeric input
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeType: 'Only alphabets and numbers are allowed'
                                                }; // Clear the error instead
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.chargeType ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.chargeType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].chargeType}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeCode}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, chargeCode: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeCode: !value ? 'Charge Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              // Remove this block to not set any error for non-numeric input
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeCode: 'Only alphabets and numbers are allowed'
                                                }; // Clear the error instead
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.chargeCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].chargeCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.description}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  description: !value ? 'Description is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  description: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.description ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.description && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].description}
                                          </div>
                                        )}
                                      </td>
                                      {/* <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.govChargeCode}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, govChargeCode: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  govChargeCode: !value ? 'GCharge Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  govChargeCode: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.govChargeCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.govChargeCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].govChargeCode}
                                          </div>
                                        )}
                                      </td> */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.ledger}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, ledger: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  ledger: !value ? 'Ledger is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  ledger: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.ledger ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.ledger && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].ledger}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeName}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, chargeName: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeName: !value ? 'Charge Name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeName: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.chargeName ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.chargeName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].chargeName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <Checkbox
                                            id="tax"
                                            checked={row.taxable}
                                            disabled
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxable: isChecked } : r))
                                              );
                                              // setirnChargesError((prev) => {
                                              //   const newErrors = [...prev];
                                              //   newErrors[index] = { ...newErrors[index], taxable: '' };
                                              //   return newErrors;
                                              // });
                                            }}
                                            sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                                          />
                                        </div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input type="text" value={row.qty} readOnly className="form-control" style={{ width: '150px' }} />
                                      </td>
                                      <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.rate}
                                              style={{ width: '100px' }}
                                              disabled={
                                                formData.status === 'TAX' ||
                                                originBillList.some(invoice =>
                                                  invoice.originBillList?.some(charge =>
                                                    charge.chargeName === row.chargeName && charge.taxable === null
                                                  )
                                                )
                                              }
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const numericRegex = /^[0-9]*$/;
                                                if (numericRegex.test(value)) {
                                                  handleRowUpdate(index, 'rate', value);
                                                } else {
                                                  setIrnChargesError((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      rate: 'Only numeric characters are allowed'
                                                    };
                                                    return newErrors;
                                                  });
                                                }
                                              }}
                                              className={irnChargesError[index]?.rate ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                      <td className="border px-2 py-2">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <Checkbox
                                            id="tax"
                                            checked={row.exempted}
                                            disabled
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, exempted: isChecked } : r))
                                              );
                                              // setirnChargesError((prev) => {
                                              //   const newErrors = [...prev];
                                              //   newErrors[index] = { ...newErrors[index], exempted: '' };
                                              //   return newErrors;
                                              // });
                                            }}
                                            sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                                          />
                                        </div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.currency === 'INR' ? '0.00' : row.fcAmount}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, fcAmount: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fcAmount: !value ? 'FC Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fcAmount: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.fcAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.fcAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].fcAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.lcAmount}
                                          readOnly
                                          className="form-control"
                                          style={{ width: '150px' }}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.billAmount}
                                          readOnly
                                          className="form-control"
                                          style={{ width: '150px' }}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sac}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, sac: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sac: !value ? 'SAC is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sac: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.sac ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.sac && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].sac}
                                          </div>
                                        )}
                                      </td>
                                      {/* <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gstAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gstAmount: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], gstAmount: !value ? 'Gst is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], gstAmount: 'Only numbers are allowed' };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.gstAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}

                                          // onKeyDown={(e) => handleKeyDown(e, row, inVoiceDetailsData)}
                                        />
                                        {irnChargesError[index]?.gstAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].gstAmount}
                                          </div>
                                        )}
                                      </td> */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gstAmount}
                                          readOnly
                                          className="form-control"
                                          style={{ width: '150px' }}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gstpercent}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;

                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gstpercent: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstpercent: !value ? 'TAX % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstpercent: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.gstpercent ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.gstpercent && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].gstpercent}
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
                  </TabPanel>
                 
                  {/* {editId && ( */}
                    <TabPanel value="2">
                      <div>
                        <div className="row d-flex mt-2">
                        <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalChargeAmountLc"
                                name="totalChargeAmountLc"
                                label="Total Charge Amount(LC) "
                                size="small"
                                disabled
                                value={formData.totalChargeAmountLc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalTaxAmountLc"
                                name="totalTaxAmountLc"
                                label="Total Tax Amount(LC) "
                                size="small"
                                disabled
                                value={formData.totalTaxAmountLc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalInvAmountLc"
                                name="totalInvAmountLc"
                                label="Total Inv Amount(LC)"
                                size="small"
                                disabled
                                value={formData.totalInvAmountLc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="roundOffAmountLc"
                                name="roundOffAmountLc"
                                label="Round Off Amt(LC)"
                                size="small"
                                disabled
                                value={formData.roundOffAmountLc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalChargeAmountBc"
                                name="totalChargeAmountBc"
                                label="Total Charge Amount(Bill Curr)"
                                size="small"
                                disabled
                                value={formData.totalChargeAmountBc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalTaxAmountBc"
                                name="totalTaxAmountBc"
                                label="Total Tax Amount(Bill Curr)"
                                size="small"
                                disabled
                                value={formData.totalTaxAmountBc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalInvAmountBc"
                                name="totalInvAmountBc"
                                label="Total Inv Amount(Bill Curr)"
                                size="small"
                                disabled
                                value={formData.totalInvAmountBc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="totalTaxableAmountLc"
                                name="totalTaxableAmountLc"
                                label="Total Taxable Amount(LC)"
                                size="small"
                                disabled
                                value={formData.totalTaxableAmountLc}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                                // error={!!fieldErrors.netLCAmt}
                                // helperText={fieldErrors.netLCAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-6 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="amountInWords"
                                name="amountInWords"
                                label="Amount In Words"
                                size="small"
                                disabled
                                value={formData.amountInWords}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 30 }}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-6 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="billingRemarks"
                              name="billingRemarks"
                              label="Billing Remarks"
                              size="small"
                              disabled
                              value={formData.billingRemarks}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        {/* <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totTaxAmt"
                              name="totTaxAmt"
                              label="Total Tax Amount"
                              size="small"
                              disabled
                              value={formData.totTaxAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              // error={!!fieldErrors.totTaxAmt}
                              // helperText={fieldErrors.totTaxAmt}
                            />
                          </FormControl>
                        </div> */}
                        </div>
                      </div>
                    </TabPanel>
                  {/* )} */}
                  {editId && (
                    <TabPanel value="3">
                      {/* <TableComponent /> */}
                      <div className="row d-flex ml">
                        <div className="mb-1">{/* <ActionButton title="Add" icon={AddIcon} onClick={handleGstAddRow} /> */}</div>
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
                                    <th className="px-2 py-2 text-white text-center">Charge Account</th>
                                    <th className="px-2 py-2 text-white text-center">Sub Ledger Code</th>
                                    <th className="px-2 py-2 text-white text-center">D Bill Amount</th>
                                    <th className="px-2 py-2 text-white text-center">CR Bill Amount</th>
                                    <th className="px-2 py-2 text-white text-center">DB LC Amount</th>
                                    <th className="px-2 py-2 text-white text-center">CR LC Amount</th>
                                    <th className="px-2 py-2 text-white text-center">Remarks</th>

                                    {/* <th className="px-2 py-2 text-white text-center">Remarks</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(irnGstData) &&
                                    irnGstData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() => handleDeleteRow1(row.id, irnGstData, setIrnGstData, irnGstError, setIrnGstError)}
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.chargeAcc}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^[a-zA-Z0-9\s-]*$/;
                                              if (regex.test(value)) {
                                                setIrnGstData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, chargeAcc: value } : r))
                                                );
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    chargeAcc: !value ? 'Charge Account is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                // Remove this block to not set any error for non-numeric input
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    chargeAcc: 'Only alphabets and numbers are allowed'
                                                  }; // Clear the error instead
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.chargeAcc ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.chargeAcc && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].chargeAcc}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.subLodgerCode}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const regex = /^[a-zA-Z0-9\s-]*$/;
                                              if (regex.test(value)) {
                                                setIrnGstData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, subLodgerCode: value } : r))
                                                );
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    subLodgerCode: !value ? 'Sub Ledger Code is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                // Remove this block to not set any error for non-numeric input
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    subLodgerCode: 'Only alphabets and numbers are allowed'
                                                  }; // Clear the error instead
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.subLodgerCode ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.subLodgerCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].subLodgerCode}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.dbillAmt}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, dbillAmt: value } : r)));
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    dbillAmt: !value ? 'D Bill Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    dbillAmt: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.dbillAmt ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.dbillAmt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].dbillAmt}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.crBillAmt}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setIrnGstData((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, crBillAmt: value } : r))
                                                );
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    crBillAmt: !value ? 'CR Bill Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    crBillAmt: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.crBillAmt ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.crBillAmt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].crBillAmt}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.dblcamt}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, dblcamt: value } : r)));
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    dblcamt: !value ? 'DB LC Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    dblcamt: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.dblcamt ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.dblcamt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].dblcamt}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.crLCAmt}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const isNumeric = /^[0-9]*$/;
                                              if (isNumeric.test(value)) {
                                                setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, crLCAmt: value } : r)));
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    crLCAmt: !value ? 'CR LC Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setIrnGstError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    crLCAmt: 'Only numbers are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={irnGstError[index]?.crLCAmt ? 'error form-control' : 'form-control'}
                                            style={{ width: '150px' }}
                                          />
                                          {irnGstError[index]?.crLCAmt && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {irnGstError[index].crLCAmt}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.gstRemarks}
                                            disabled
                                            className="form-control"
                                            style={{ width: '150px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gstRemarks: value } : r)));
                                            }}
                                          />
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
                  )}
                </TabContext>
              </Box>
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        open={modalOpen}
        title="Credit Note Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this invoice?`}
        onConfirm={() => handleConfirmAction(docId)}
        onCancel={handleCloseModal}
      />
      <ToastContainer />
    </div>
  );
};

export default IrnCreditNote;
