import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
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
    voucherNo: '',
    voucherDate: null,
    status: 'PROFORMA',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    partyCode: '',
    partyName: '',
    docDate: dayjs(),
    docId: '',
    orgId: '',
    branch: '',
    branchCode: '',
    finYear: '',
    createdBy: '',
    modifiedBy: '',
    stateNo: '',
    stateCode: '',
    vid: '',
    vdate: null,
    recipientGSTIN: '',
    placeOfSupply: '',
    addressType: '',
    address: '',
    pinCode: '',
    gstType: '',
    originBillNo:'',
    originBillDate: null,
    currency: '',
    exRate: '',
    creditDays: '',
    shipRefNo: '',
    jobNo: '',
    supplierRefNo: '',
    supplierRefDate: null,
    dueDate: null,

    billOfEntry: '',
    partyType: 'CUSTOMER',
    partyId: '',
    bizMode: '',
    bizType: '',
    
    totalChargeAmountLc: '',
    totalChargeAmountBc: '',
    totalTaxAmountLc: '',
    roundOffAmountLc: '',
    totalInvAmountLc: '',
    totalInvAmountBc: '',
    totalTaxAmountBc: '',
    totalTaxableAmountLc: '',
    amountInWords: '',
    billingRemarks: '',
    creditRemarks: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    voucherNo: '',
    voucherDate: null,
    status: 'PROFORMA',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    partyCode: '',
    partyName: '',
    docDate: dayjs(),
    docId: '',
    orgId: '',
    branch: '',
    branchCode: '',
    finYear: '',
    createdBy: '',
    modifiedBy: '',
    stateNo: '',
    stateCode: '',
    vid: '',
    vdate: null,
    recipientGSTIN: '',
    placeOfSupply: '',
    addressType: '',
    address: '',
    pinCode: '',
    gstType: '',
    originBillNo:'',
    originBillDate: null,
    currency: '',
    exRate: '',
    creditDays: '',
    shipRefNo: '',
    jobNo: '',
    supplierRefNo: '',
    supplierRefDate: null,
    dueDate: null,

    billOfEntry: '',
    partyType: '',
    partyId: '',
    bizMode: '',
    bizType: '',
    
    totalChargeAmountLc: '',
    totalChargeAmountBc: '',
    totalTaxAmountLc: '',
    roundOffAmountLc: '',
    totalInvAmountLc: '',
    totalInvAmountBc: '',
    totalTaxAmountBc: '',
    totalTaxableAmountLc: '',
    amountInWords: '',
    billingRemarks: '',
    creditRemarks: '',
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
      chargeType: '',
      chargeCode: '',
      // govChargeCode: '',
      description: '',
      ledger: '',
      chargeName: '',
      taxable: '',
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
    const [creditNoteAnnexure, setCreditNoteAnnexure] = useState([
      {
        amount: '',
        dsec: '',
        kitId: '',
        qty: '',
        rate: '',
        skuType: '',
        transDate: null,
        transNo: ''
      }
    ]);
  
    const [creditNoteAnnexureErrors, setCreditNoteAnnexureErrors] = useState([
      {
        amount: '',
        dsec: '',
        kitId: '',
        qty: '',
        rate: '',
        skuType: '',
        transDate: null,
        transNo: ''
      }
    ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleInputChange = (e) => {
    // if (!e || !e.target) {
    //   console.error('Undefined event or target:', e);
    //   return; // Avoid crashing the application
    // }
    const { name, value, type, checked } = e.target;
    console.log('Field Name:', name, 'Field Value:', value);
    const inputValue = type === 'checkbox' ? checked : value || '';

    // Define regex for numeric fields
    const isNumeric = /^[0-9]*$/;

    // Validation logic for numeric fields
    const numericFields = [
      'pinCode',
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
      getAllPartyName(inputValue);
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
      voucherNo: '',
      voucherDate: null,
      status: 'PROFORMA',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      partyCode: '',
      partyName: '',
      docDate: dayjs(),
      docId: '',
      orgId: '',
      branch: '',
      branchCode: '',
      finYear: '',
      createdBy: '',
      modifiedBy: '',
      stateNo: '',
      stateCode: '',
      vid: '',
      vdate: null,
      recipientGSTIN: '',
      placeOfSupply: '',
      addressType: '',
      address: '',
      pinCode: '',
      gstType: '',
      originBillNo:'',
      originBillDate: null,
      currency: '',
      exRate: '',
      creditDays: '',
      shipRefNo: '',
      jobNo: '',
      supplierRefNo: '',
      supplierRefDate: null,
      dueDate: null,
  
      billOfEntry: '',
      partyType: 'CUSTOMER',
      partyId: '',
      bizMode: '',
      bizType: '',
      
      totalChargeAmountLc: '',
      totalChargeAmountBc: '',
      totalTaxAmountLc: '',
      roundOffAmountLc: '',
      totalInvAmountLc: '',
      totalInvAmountBc: '',
      totalTaxAmountBc: '',
      totalTaxableAmountLc: '',
      amountInWords: '',
      billingRemarks: '',
      creditRemarks: '',
    });

    setFieldErrors({
      voucherNo: '',
      voucherDate: null,
      status: 'PROFORMA',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      partyCode: '',
      partyName: '',
      docDate: dayjs(),
      docId: '',
      orgId: '',
      branch: '',
      branchCode: '',
      finYear: '',
      createdBy: '',
      modifiedBy: '',
      stateNo: '',
      stateCode: '',
      vid: '',
      vdate: null,
      recipientGSTIN: '',
      placeOfSupply: '',
      addressType: '',
      address: '',
      pinCode: '',
      gstType: '',
      originBillNo:'',
      originBillDate: null,
      currency: '',
      exRate: '',
      creditDays: '',
      shipRefNo: '',
      jobNo: '',
      supplierRefNo: '',
      supplierRefDate: null,
      dueDate: null,
  
      billOfEntry: '',
      partyType: '',
      partyId: '',
      bizMode: '',
      bizType: '',
      
      totalChargeAmountLc: '',
      totalChargeAmountBc: '',
      totalTaxAmountLc: '',
      roundOffAmountLc: '',
      totalInvAmountLc: '',
      totalInvAmountBc: '',
      totalTaxAmountBc: '',
      totalTaxableAmountLc: '',
      amountInWords: '',
      billingRemarks: '',
      creditRemarks: '',
    });

    setIrnChargesData([
      {
        // id: 1,
        chargeType: '',
        chargeCode: '',
        // govChargeCode: '',
        description: '',
        ledger: '',
        chargeName: '',
        taxable: '',
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
    setCreditNoteAnnexure([
      {
        amount: '',
        dsec: '',
        kitId: '',
        qty: '',
        rate: '',
        skuType: '',
        transDate: null,
        transNo: ''
      }
    ]);
    setCreditNoteAnnexureErrors('');
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
    handleClear();
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
        `/irnCreditNote/approveIrnCreditNote?orgId=${orgId}&action=${approveStatus}&actionBy=${loginUserName}&docId=${encodeURIComponent(formData.docId)}&id=${formData.id}`
      );
      console.log('API Response Confirm:==>', result);
      if (result.status === true) {
        setFormData({ ...formData, approveStatus: result.paramObjectsMap.irnCreditNoteVO.approveStatus });
        showToast(
          result.paramObjectsMap.irnCreditNoteVO.approveStatus === 'Approved' ? 'success' : 'error',
          result.paramObjectsMap.irnCreditNoteVO.approveStatus === 'Approved'
            ? 'Credit Note Approved successfully'
            : 'Credit Note Rejected successfully'
        );
        const listValueVO = result.paramObjectsMap.irnCreditNoteVO;
        setFormData({
          docId: listValueVO.docId,
          voucherNo: listValueVO.voucherNo,
          creditRemarks: listValueVO.creditRemarks,
          jobNo: listValueVO.jobNo,
          voucherDate: listValueVO.voucherDate,
          approveStatus: listValueVO.approveStatus,
          approveBy: listValueVO.approveBy,
          approveOn: listValueVO.approveOn,
          docDate: listValueVO.docDate,
          type: listValueVO.type,
          partyCode: listValueVO.partyCode,
          partyName: listValueVO.partyName,
          partyType: listValueVO.partyType,
          originBillNo: listValueVO.originBillNo,
          vid: listValueVO.vid,
          vdate: listValueVO.vdate,
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
          currency: listValueVO.billCurr,
          status: listValueVO.status,
          // salesType: listValueVO.salesType,
          updatedBy: listValueVO.updatedBy,
          supplierBillNo: listValueVO.supplierBillNo,
          supplierBillDate: listValueVO.supplierBillDate,
          exRate: listValueVO.billCurrRate,
          // exAmount: listValueVO.exAmount,
          creditDays: listValueVO.creditDays,
          contactPerson: listValueVO.contactPerson,
          shipperInvoiceNo: listValueVO.shipperInvoiceNo,
          billOfEntry: listValueVO.billOfEntry,
          billMonth: listValueVO.billMonth,
          supplierRefNo: listValueVO.supplierRefNo,
          supplierRefDate: listValueVO.supplierRefDate,
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
      setFormData((prev) => ({
        ...prev,
        orgId: selectedBill?.orgId || '',
        branch: selectedBill?.branch || '',
        branchCode: selectedBill?.branchCode || '',
        finYear: selectedBill?.finYear || '',
        createdBy: selectedBill?.createdBy || '',
        modifiedBy: selectedBill?.modifiedBy || '',
        stateNo: selectedBill?.stateNo || '',
        stateCode: selectedBill?.stateCode || '',
        vid: selectedBill?.vid || '',
        vdate: selectedBill?.vdate || '',
        recipientGSTIN: selectedBill?.recipientGSTIN || '',
        placeOfSupply: selectedBill?.placeOfSupply || '',
        addressType: selectedBill?.addressType || '',
        address: selectedBill?.address || '',
        pinCode: selectedBill?.pinCode || '',
        gstType: selectedBill?.gstType || '',
        originBillNo: selectedBill?.originBillNo || '',
        originBillDate: selectedBill?.docDate || '',
        currency: selectedBill?.billCurr || '',
        exRate: parseFloat(selectedBill?.billCurrRate) || '',
        creditDays: selectedBill?.creditDays || '',
        shipRefNo: selectedBill?.shipperInvoiceNo || '',
        jobNo: selectedBill?.jobOrderNo || '',
        supplierRefNo: selectedBill?.supplierBillNo || '',
        supplierRefDate: selectedBill?.supplierBillDate || '',
        dueDate: selectedBill?.dueDate || '',

        billOfEntry: selectedBill?.billOfEntry || '',
        partyType: selectedBill?.partyType || '',
        partyId: selectedBill?.partyId || '',
        bizMode: selectedBill?.bizMode || '',
        bizType: selectedBill?.bizType || '',
        
        totalChargeAmountLc: selectedBill?.totalChargeAmountLc || '',
        totalChargeAmountBc: selectedBill?.totalChargeAmountBc || '',
        totalTaxAmountLc: selectedBill?.totalTaxAmountLc || '',
        roundOffAmountLc: selectedBill?.roundOffAmountLc || '',
        totalInvAmountLc: selectedBill?.totalInvAmountLc || '',
        totalInvAmountBc: selectedBill?.totalInvAmountBc || '',
        totalTaxAmountBc: selectedBill?.totalTaxAmountBc || '',
        totalTaxableAmountLc: selectedBill?.totalTaxableAmountLc || '',
        amountInWords: selectedBill?.amountInWords || '',
        billingRemarks: selectedBill?.billingRemarks || ''
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
            qty: parseInt(item.qty),
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
          }))
        );
      }
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
            qty: parseInt(item.qty),
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
          }))
        );
      }
      if (selectedBill.taxInvoiceAnnexureVO) {
        setCreditNoteAnnexure(
          selectedBill.taxInvoiceAnnexureVO.map((item) => ({
            id: item.id,
            transDate: item.transDate,
            transNo: item.transNo,
            kitId: item.kitId,
            dsec: item.dsec,
            skuType: item.skuType,
            qty: item.qty,
            rate: item.rate,
            amount: item.amount,
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
        setFormData((prev) => ({
          ...prev,
          docId: response.paramObjectsMap.irnCreditVO, 
        }));
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
  const handleAddAnnexureRow = () => {
    if (isLastRowAnnexureEmpty(creditNoteAnnexure)) {
      displayRowAnnexureError(creditNoteAnnexure);
      return;
    }
    const newRow = {
      id: Date.now(),
      amount: '',
      dsec: '',
      id: '',
      kitId: '',
      qty: '',
      rate: '',
      skuType: '',
      transDate: null,
      transNo: ''
    };
    setCreditNoteAnnexure([...creditNoteAnnexure, newRow]);
    setCreditNoteAnnexureErrors([
      ...creditNoteAnnexureErrors,
      {
        amount: '',
        dsec: '',
        kitId: '',
        qty: '',
        rate: '',
        skuType: '',
        transDate: null,
        transNo: ''
      }
    ]);
  };

  const isLastRowAnnexureEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === creditNoteAnnexure) {
      return (
        !lastRow.amount ||
        !lastRow.dsec ||
        !lastRow.kitId ||
        !lastRow.qty ||
        !lastRow.rate ||
        !lastRow.skuType ||
        !lastRow.transDate ||
        !lastRow.transNo
      );
    }
    return false;
  };

  const displayRowAnnexureError = (table) => {
    if (table === creditNoteAnnexureErrors) {
      setCreditNoteAnnexureErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          amount: !table[table.length - 1].amount ? 'Amount is required' : '',
          dsec: !table[table.length - 1].dsec ? 'Desc is required' : '',
          kitId: !table[table.length - 1].kitId ? 'KitId is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          skuType: !table[table.length - 1].skuType ? 'Sku Type is required' : '',
          transDate: !table[table.length - 1].transDate ? 'Trans Date is required' : '',
          transNo: !table[table.length - 1].transNo ? 'Trans No is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRowAnnexure = (rowId) => {
    setCreditNoteAnnexure((prev) => prev.filter((row) => row.id !== rowId));
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
        // setDocId(irnCreditNoteVO.docId);
        // handleClear();
        setFormData({
          bizMode: irnCreditNoteVO.bizMode,
          docId: irnCreditNoteVO.docId,
          bizType: irnCreditNoteVO.bizType,
          orgId: irnCreditNoteVO.orgId,
          branch: irnCreditNoteVO.branch,
          branchCode: irnCreditNoteVO.branchCode,
          finYear: irnCreditNoteVO.finYear,
          createdBy: irnCreditNoteVO.createdBy,
          modifiedBy: irnCreditNoteVO.modifiedBy,
          vid: irnCreditNoteVO.vid,
          vdate: irnCreditNoteVO.vdate,
          partyName: irnCreditNoteVO.partyName,
          partyCode: irnCreditNoteVO.partyCode,
          partyType: irnCreditNoteVO.partyType,
          stateNo: irnCreditNoteVO.stateNo,
          stateCode: irnCreditNoteVO.stateCode,
          recipientGSTIN: irnCreditNoteVO.recipientGSTIN,
          placeOfSupply: irnCreditNoteVO.placeOfSupply,
          addressType: irnCreditNoteVO.addressType,
          address: irnCreditNoteVO.address,
          pinCode: irnCreditNoteVO.pinCode,
          status: irnCreditNoteVO.status,
          gstType: irnCreditNoteVO.gstType,
          originBillNo: irnCreditNoteVO.originBillNo,
          originBillDate: irnCreditNoteVO.originBillDate,
          voucherNo: irnCreditNoteVO.voucherNo,
          voucherDate: irnCreditNoteVO.voucherDate,
          supplierRefNo: irnCreditNoteVO.supplierRefNo,
          supplierRefDate: irnCreditNoteVO.supplierRefDate,
          approveStatus: irnCreditNoteVO.approveStatus,
          approveBy: irnCreditNoteVO.approveBy,
          approveOn: irnCreditNoteVO.approveOn,
          creditRemarks: irnCreditNoteVO.creditRemarks,
          jobNo: irnCreditNoteVO.jobNo,
          id: irnCreditNoteVO.id,
          creditDays: irnCreditNoteVO.creditDays,
          // exAmount: irnCreditNoteVO.exAmount,
          dueDate: irnCreditNoteVO.dueDate,
          currency: irnCreditNoteVO.billCurr,
          exRate: irnCreditNoteVO.billCurrRate,
          // billingMonth: irnCreditNoteVO.billMonth,
          // salesType: irnCreditNoteVO.salesType,
          // summaryExRate: irnCreditNoteVO.summaryExRate,
          // totTaxAmt: irnCreditNoteVO.totTaxAmt
          shipRefNo: irnCreditNoteVO.shipperRefNo,
          totalChargeAmountLc: irnCreditNoteVO.totalChargeAmountLc,
          totalChargeAmountBc: irnCreditNoteVO.totalChargeAmountBc,
          totalTaxAmountLc: irnCreditNoteVO.totalTaxAmountLc,
          roundOffAmountLc: irnCreditNoteVO.roundOffAmountLc,
          totalInvAmountLc: irnCreditNoteVO.totalInvAmountLc,
          totalInvAmountBc: irnCreditNoteVO.totalInvAmountBc,
          totalTaxAmountBc: irnCreditNoteVO.totalTaxAmountBc,
          totalTaxableAmountLc: irnCreditNoteVO.totalTaxableAmountLc,
          amountInWords: irnCreditNoteVO.amountInWords,
          billingRemarks: irnCreditNoteVO.billingRemarks,
        });
        setIrnChargesData(
          irnCreditNoteVO.irnCreditNoteDetailsVO.map((invoiceData) => ({
            id: invoiceData.id,
            chargeType: invoiceData.chargeType,
            chargeCode: invoiceData.chargeCode,
            description: invoiceData.description,
            // govChargeCode: invoiceData.govChargeCode,
            ledger: invoiceData.ledger,
            chargeName: invoiceData.chargeName,
            taxable: invoiceData.taxable,
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
        setCreditNoteAnnexure(
          irnCreditNoteVO.irnCreditNoteAnnexureVO.map((row) => ({
            id: row.id,
            amount: row.amount,
            dsec: row.dsec,
            kitId: row.kitId,
            qty: row.qty,
            rate: row.rate,
            skuType: row.skuType,
            transDate: row.transDate ? dayjs(row.transDate) : null,
            transNo: row.transNo
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
    if (!formData.originBillNo) {
      errors.originBillNo = 'Origin Bill is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'Tax Type is required';
    }
    setFieldErrors(errors);
    setIrnChargesError(tableErrors);
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
        rate: parseFloat(row.rate),
        currency: row.currency,
        exRate: parseInt(row.exRate),
        exempted: row.exempted,
        sac: row.sac,
        gstpercent: parseInt(row.gstpercent)
      }));
          const annexureVO = creditNoteAnnexure.map((row) => ({
            ...(editId && { id: row.id }),
            amount: row.amount,
            dsec: row.dsec,
            kitId: row.kitId,
            qty: row.qty,
            rate: row.rate,
            skuType: row.skuType,
            transDate: row.transDate ? dayjs(row.transDate).format('YYYY-MM-DD') : null,
            transNo: row.transNo
          }));
      const saveFormData = {
        ...(editId && { id: editId }),
            address: formData.address,
            addressType: formData.addressType,
            billCurr: formData.currency,
            billCurrRate: parseInt(formData.exRate),
            bizMode: formData.bizMode,
            bizType: formData.bizType,
            branch: formData.branch,
            branchCode: formData.branchCode,
            finYear: formData.finYear,
            createdBy: formData.createdBy,
            creditDays: formData.creditDays,
            creditRemarks: formData.creditRemarks,
            dueDate: formData.dueDate,
            gstType: formData.gstType,
            jobNo: formData.jobNo,
            orgId: formData.orgId,
            originBillNo: formData.originBillNo,
            originBillDate: formData.originBillDate,
            partyCode: formData.partyCode,
            partyName: formData.partyName,
            partyType: formData.partyType,
            pinCode: formData.pinCode,
            placeOfSupply: formData.placeOfSupply,
            recipientGSTIN: formData.recipientGSTIN,
            shipperRefNo: formData.shipRefNo,
            stateCode: formData.stateCode,
            stateNo: formData.stateNo,
            status: formData.status,
            supplierRefNo: formData.supplierRefNo,
            supplierRefDate: formData.supplierRefDate,
            vid: formData.vid,
            vdate: formData.vdate,
            irnCreditNoteDetailsDTO: irnCreditChargesVo,
            irnCreditNoteAnnexureDTO: annexureVO,
    
            billOfEntry: formData.billOfEntry,
            partyId: formData.partyId,
            billingRemarks: formData.billingRemarks,
      };

      try {
        const response = await apiCalls('put', `/irnCreditNote/updateCreateIrnCreditNote`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Credit Note Updated Successfully' : 'Credit Note created successfully');
          handleClear();
          getAllIrnCredit();
          getIrnCreditNoteDocId();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Credit Note creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Credit Note creation failed');
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
    if (!Array.isArray(rows)) return;
    const totalChargeAmountLc = rows.reduce((sum, row) => sum + (parseFloat(row.lcAmount) || 0), 0);
    const totalTaxAmountLc = rows.reduce((sum, row) => sum + (parseFloat(row.gstAmount) || 0), 0);
    const totalInvAmountLc = totalChargeAmountLc + totalTaxAmountLc;
    const roundOffDiff = (Math.round(totalChargeAmountLc) - totalChargeAmountLc).toFixed(2);
    const roundOffAmountLc = roundOffDiff;
    const totalChargeAmountBc = rows.reduce((sum, row) => sum + (parseFloat(row.billAmount) || 0), 0);
    const totalTaxAmountBc = rows.reduce((sum, row) => sum + (parseFloat(row.gstAmount) || 0), 0);
    const totalInvAmountBc = totalChargeAmountBc + totalTaxAmountBc;
    const totalTaxableAmountLc = 0;
  
    setFormData((prev) => ({
      ...prev,
      totalChargeAmountLc: totalChargeAmountLc.toFixed(2),
      totalTaxAmountLc: totalTaxAmountLc.toFixed(2),
      totalInvAmountLc: totalInvAmountLc.toFixed(2),
      roundOffAmountLc: roundOffAmountLc,
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

          if (value === '') {
            return {
              ...updatedRow,
              rate: '',
              fcAmount: '',
              lcAmount: '',
              billAmount: '',
              gstAmount: '',
            };
          }

          const rate = parseFloat(updatedRow.rate) || 0;
          const selectedCurrencyData = currencies.find((currency) => currency.currency === updatedRow.currency);
          const exRate = selectedCurrencyData?.buyingExRate || 1;
          const fcAmount = updatedRow.currency === 'INR' ? 0 : rate;
          const lcAmount = rate * exRate * updatedRow.qty;
          const billAmount = rate * exRate * updatedRow.qty;
          const gstAmount = (lcAmount * updatedRow.gstpercent) / 100;

          return {
            ...updatedRow,
            rate,
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
  const handleAnnexureDescriptionChange = (index, newDescription) => {
    const updatedRows = [...creditNoteAnnexure];
    updatedRows[index].dsec = newDescription;
    setCreditNoteAnnexure(updatedRows);
  };
  // const handleAnnexureInputChange = (index, field, value) => {
  //   setCreditNoteAnnexure((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));

  //   setCreditNoteAnnexureErrors((prev) => {
  //     const newErrors = [...prev];
  //     if (field === 'amount' || field === 'qty' || field === 'rate') {
  //       const regex = /^[0-9\n-]*$/;
  //       if (value === '' || !regex.test(value)) {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           [field]: `${field} must be a valid number`
  //         };
  //       } else {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           [field]: ''
  //         };
  //       }
  //     } else if (field === 'transNo') {
  //       if (value.length > 20) {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           transNo: 'Transaction No cannot exceed 20 characters'
  //         };
  //       } else {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           transNo: ''
  //         };
  //       }
  //     } else if (field === 'kitId') {
  //       const duplicate = creditNoteAnnexure.some((row, i) => row.kitId === value && i !== index);
  //       if (duplicate) {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           kitId: 'Duplicate Kit ID not allowed'
  //         };
  //       } else {
  //         newErrors[index] = {
  //           ...newErrors[index],
  //           kitId: ''
  //         };
  //       }
  //     } else {
  //       newErrors[index] = {
  //         ...newErrors[index],
  //         [field]: ''
  //       };
  //     }
  //     return newErrors;
  //   });
  // };
  const handleAnnexureInputChange = (index, field, value) => {
    const isValidNumber = /^\d*\.?\d*$/.test(value);
  
    if ((field === 'amount' || field === 'qty' || field === 'rate') && !isValidNumber && value !== '') {
      return; 
    }
    setCreditNoteAnnexure((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
    setCreditNoteAnnexureErrors((prev) => {
      const newErrors = [...prev];
  
      if (field === 'amount' || field === 'qty' || field === 'rate') {
        newErrors[index] = {
          ...newErrors[index],
          [field]: isValidNumber ? '' : `${field} must be a valid number`
        };
      } else if (field === 'transNo') {
        newErrors[index] = {
          ...newErrors[index],
          transNo: value.length > 20 ? 'Transaction No cannot exceed 20 characters' : ''
        };
      } else if (field === 'kitId') {
        const duplicate = creditNoteAnnexure.some((row, i) => row.kitId === value && i !== index);
        newErrors[index] = {
          ...newErrors[index],
          kitId: duplicate ? 'Duplicate Kit ID not allowed' : ''
        };
      }
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
              {listViewById.approveStatus === 'Approved' ? '' : <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />}
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
                  <TextField id="docId" name="docId" label="Doc No" size="small" value={formData.docId} disabled required fullWidth />
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
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.originBillNo}>
                  <InputLabel id="originBillNo">Origin Bill</InputLabel>
                  <Select
                    labelId="originBillNo"
                    label="Origin Bill"
                    name="originBillNo"
                    disabled={formData.status === 'TAX'}
                    value={formData.originBillNo}
                    onChange={(event) => {
                      const selectedDocId = event.target.value;
                      const selectedBill = originBillList.find((item) => item.docId === selectedDocId);
                      handleOriginBillSelection(selectedBill);
                      setFormData((prev) => ({
                        ...prev,
                        originBillNo: selectedDocId ? selectedDocId : ''
                      }));
                    }}
                  >
                    {originBillList?.map((row) => (
                      <MenuItem key={row.id} value={row.docId}>
                        {row.docId}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.originBillNo && <FormHelperText>{fieldErrors.originBillNo}</FormHelperText>}
                </FormControl>
              </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth size="small">
                            <TextField
                              label="V Id"
                              disabled
                              size="small"
                              required
                              inputProps={{ maxLength: 30 }}
                              value={formData.vid}
                              onChange={(e) => setFormData({ ...formData, vid: e.target.value })}
                              error={!!fieldErrors.vid}
                              // helperText={fieldErrors.pincode}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="V Date"
                                disabled
                                format="DD-MM-YYYY"
                                slotProps={{
                                  textField: { size: 'small', clearable: true }
                                }}
                                value={formData.vdate ? dayjs(formData.vdate) : null}
                                onChange={(newValue) => setFormData({ ...formData, vdate: newValue })}
                              />
                            </LocalizationProvider>
                            {fieldErrors.vdate && <FormHelperText style={{ color: 'red' }}>{fieldErrors.vdate}</FormHelperText>}
                          </FormControl>
                        </div>
              {/*<div className="col-md-3 mb-3">
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
               <div className="col-md-3 mb-3">
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
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="pinCode"
                    name="pinCode"
                    label="Pin code"
                    size="small"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.pinCode}
                    helperText={fieldErrors.pinCode}
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
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="voucherNo"
                    name="voucherNo"
                    label="Voucher No"
                    size="small"
                    value={formData.voucherNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.voucherNo}
                    helperText={fieldErrors.voucherNo}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Voucher Date"
                      value={formData.voucherDate ? dayjs(formData.voucherDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('voucherDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                      error={!!fieldErrors.voucherDate}
                      helperText={fieldErrors.voucherDate ? fieldErrors.voucherDate : ''}
                    />
                  </LocalizationProvider>
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
                      {creditNoteAnnexure.length > 0 && <Tab label="Annexure" value="2" />}
                      <Tab label="Summary" value="3" />
                      {editId && <Tab label="Tax" value="4" />}
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
                                    <tr key={row.id || index}>
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
                                          style={{ width: '250px' }}
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
                                                // const numericRegex = /^[0-9]*$/;
                                                // if (value === '' || numericRegex.test(value)) {
                                                const floatRegex = /^[0-9]*\.?[0-9]*$/; // Accept numbers and decimals
                                                  if (value === '' || floatRegex.test(value)) {
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
                  {creditNoteAnnexure.length > 0 && (
                <TabPanel value="2">
                  <div className="row d-flex ml">
                    {/* <div className="mb-1">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddAnnexureRow} />
                    </div> */}
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                {/* {formData.status !== 'TAX' && (
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                )} */}
                                <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '250px' }}>
                                  Transaction Date
                                </th>
                                <th className="px-2 py-2 text-white text-center">Transaction No</th>
                                <th className="px-2 py-2 text-white text-center">Kit Id</th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '250px' }}>
                                  Kit Description
                                </th>
                                <th className="px-2 py-2 text-white text-center">Sku Type</th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                  Qty
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '100px' }}>
                                  Rate
                                </th>
                                <th className="px-2 py-2 text-white text-center">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditNoteAnnexure.map((row, index) => (
                                <tr key={row.id}>
                                  {/* {formData.status !== 'TAX' && (
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRowAnnexure(
                                            row.id,
                                            creditNoteAnnexure,
                                            setCreditNoteAnnexure,
                                            creditNoteAnnexureErrors,
                                            setCreditNoteAnnexureErrors
                                          )
                                        }
                                      />
                                    </td>
                                  )} */}
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>
                                  <td className="border px-2 py-2" style={{ width: '250px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        value={
                                          row.transDate
                                            ? dayjs(row.transDate, 'YYYY-MM-DD').isValid()
                                              ? dayjs(row.transDate, 'YYYY-MM-DD')
                                              : null
                                            : null
                                        }
                                        disabled
                                        slotProps={{
                                          textField: { size: 'small', clearable: true }
                                        }}
                                        sx={{
                                          width: '192px'
                                        }}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue) => {
                                          setCreditNoteAnnexure((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id ? { ...r, transDate: newValue ? newValue.format('YYYY-MM-DD') : null } : r
                                            )
                                          );
                                          setCreditNoteAnnexureErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              transDate: !newValue ? 'Transaction Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            className={creditNoteAnnexureErrors[index]?.transDate ? 'error form-control' : 'form-control'}
                                          />
                                        )}
                                        minDate={dayjs()}
                                      />
                                    </LocalizationProvider>
                                    {creditNoteAnnexureErrors[index]?.transDate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].transDate}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.transNo}
                                      disabled
                                      style={{ width: '150px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'transNo', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.transNo ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.transNo && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].transNo}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.kitId}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'kitId', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.kitId ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.kitId && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].kitId}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.dsec}
                                      disabled
                                      style={{ width: '250px' }}
                                      className={creditNoteAnnexureErrors[index]?.dsec ? 'error form-control' : 'form-control'}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 250) {
                                          handleAnnexureDescriptionChange(index, newValue);
                                        } else {
                                          const updatedErrors = [...creditNoteAnnexureErrors];
                                          updatedErrors[index] = {
                                            ...updatedErrors[index],
                                            dsec: 'Description cannot exceed 250 characters.'
                                          };
                                          setCreditNoteAnnexureErrors(updatedErrors);
                                        }
                                      }}
                                    />
                                    {creditNoteAnnexureErrors[index]?.dsec && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].dsec}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.skuType}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'skuType', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.skuType ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.skuType && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].skuType}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.qty}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'qty', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.qty && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].qty}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.rate}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'rate', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.rate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].rate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.amount}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'amount', e.target.value)}
                                      className={creditNoteAnnexureErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                    />
                                    {creditNoteAnnexureErrors[index]?.amount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {creditNoteAnnexureErrors[index].amount}
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
                )}
                    <TabPanel value="3">
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
                    <TabPanel value="4">
                      {/* <TableComponent /> */}
                      <div className="row d-flex ml">
                        <div className="mb-1">{/* <ActionButton title="Add" icon={AddIcon} onClick={handleGstAddRow} /> */}</div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th> */}
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
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(irnGstData) &&
                                    irnGstData.map((row, index) => (
                                      <tr key={row.id}>
                                        {/* <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() => handleDeleteRow1(row.id, irnGstData, setIrnGstData, irnGstError, setIrnGstError)}
                                          />
                                        </td> */}
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
