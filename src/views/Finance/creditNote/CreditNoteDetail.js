import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import 'react-tabs/style/react-tabs.css';
import React, { useState, useRef, useEffect } from 'react';
import ActionButton from 'utils/ActionButton';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { Autocomplete, FormHelperText } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

const IrnCreditNote = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allPartyName, setAllPartyName] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [docId, setDocId] = useState('');
  const [value, setValue] = useState('1');

  const [formData, setFormData] = useState({
    vohNo: '',
    vohDate: null,
    partyName: '',
    partyCode: '',
    partyType: '',
    supRefDate: null,
    currentDate: dayjs(),
    currentDateValue: '',
    product: '',
    creditDays: '',
    dueDate: null,
    currency: '',
    exRate: '',
    status: '',
    originBill: '',
    remarks: '',
    address: '',
    shipRefNo: '',
    pincode: '',
    gstType: '',
    billingMonth: '',
    otherInfo: '',
    salesType: '',
    creditRemarks: '',
    charges: '',
    salesType: '',
    roundOff: '',
    totChargesBillCurrAmt: '',
    totChargesLCAmt: '',
    totGrossBillAmt: '',
    totGrossLCAmt: '',
    netBillCurrAmt: '',
    netLCAmt: '',
    summaryExRate: '',
    amtInWords: '',
    totTaxAmt: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    vohNo: '',
    vohDate: null,
    partyName: '',
    partyCode: '',
    partyType: '',
    supRefDate: null,
    currentDate: null,
    currentDateValue: '',
    product: '',
    creditDays: '',
    dueDate: null,
    currency: '',
    exRate: '',
    status: '',
    originBill: '',
    remarks: '',
    address: '',
    shipRefNo: '',
    pincode: '',
    gstType: '',
    billingMonth: '',
    otherInfo: '',
    salesType: '',
    creditRemarks: '',
    charges: '',
    salesType: '',
    roundOff: '',
    totChargesBillCurrAmt: '',
    totChargesLCAmt: '',
    totGrossBillAmt: '',
    totGrossLCAmt: '',
    netBillCurrAmt: '',
    netLCAmt: '',
    summaryExRate: '',
    amtInWords: '',
    totTaxAmt: ''
  });

  const [irnChargesData, setIrnChargesData] = useState([
    {
      id: 1,
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: '',
      currency: '',
      exRate: '',
      rate: '',
      exampted: true,
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
    }
  ]);

  const [irnChargesError, setIrnChargesError] = useState([
    {
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: '',
      currency: '',
      exRate: '',
      rate: '',
      exampted: true,
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
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
    const inputValue = type === 'checkbox' ? checked : value;

    // Define regex for numeric fields
    const isNumeric = /^[0-9]*$/;

    // Validation logic for numeric fields
    const numericFields = [
      'pincode',
      'creditDays',
      'currentDateValue',
      'exRate',
      'netBillCurrAmt',
      'netLCAmt',
      'roundOff',
      'totChargesBillCurrAmt',
      'totChargesLCAmt',
      'totGrossBillAmt',
      'totGrossLCAmt',
      'summaryExRate',
      'totTaxAmt'
    ]; // Add other numeric fields if needed
    if (numericFields.includes(name)) {
      if (!isNumeric.test(value)) {
        setFieldErrors({
          ...fieldErrors,
          [name]: 'Only numbers are allowed'
        });
        return; // Prevent further form updates if invalid input
      }
    }

    // Handle partyName selection and partyCode mapping
    if (name === 'partyName') {
      const selectedParty = allPartyName.find((party) => party.partyName === value);
      if (selectedParty) {
        setFormData({
          ...formData,
          partyName: value,
          partyCode: selectedParty.partyCode, // Set the corresponding partyCode
          partyType: selectedParty.partyType // Set the corresponding party Type
        });

        // Clear any errors related to customerName if input is valid
        setFieldErrors({
          ...fieldErrors,
          partyName: false,
          partyCode: false,
          partyType: false
        });
      }
    } else {
      // Handle other fields
      setFormData({ ...formData, [name]: inputValue });

      // Clear error when input is valid
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      vohNo: '',
      vohDate: null,
      partyName: '',
      partyCode: '',
      partyType: '',
      supRefDate: null,
      currentDate: dayjs(),
      currentDateValue: '',
      product: '',
      creditDays: '',
      dueDate: null,
      currency: '',
      exRate: '',
      status: '',
      originBill: '',
      remarks: '',
      address: '',
      shipRefNo: '',
      pincode: '',
      gstType: '',
      billingMonth: '',
      otherInfo: '',
      salesType: '',
      creditRemarks: '',
      charges: '',
      salesType: '',
      roundOff: '',
      totChargesBillCurrAmt: '',
      totChargesLCAmt: '',
      totGrossBillAmt: '',
      totGrossLCAmt: '',
      netBillCurrAmt: '',
      netLCAmt: '',
      summaryExRate: '',
      amtInWords: '',
      totTaxAmt: ''
    });

    setFieldErrors({
      vohNo: '',
      vohDate: null,
      partyName: '',
      partyCode: '',
      partyType: '',
      supRefDate: null,
      currentDate: null,
      currentDateValue: '',
      product: '',
      creditDays: '',
      dueDate: null,
      currency: '',
      exRate: '',
      status: '',
      originBill: '',
      remarks: '',
      address: '',
      shipRefNo: '',
      pincode: '',
      gstType: '',
      billingMonth: '',
      otherInfo: '',
      salesType: '',
      creditRemarks: '',
      charges: '',
      salesType: '',
      roundOff: '',
      totChargesBillCurrAmt: '',
      totChargesLCAmt: '',
      totGrossBillAmt: '',
      totGrossLCAmt: '',
      netBillCurrAmt: '',
      netLCAmt: '',
      summaryExRate: '',
      amtInWords: '',
      totTaxAmt: ''
    });

    setIrnChargesData([
      {
        jobNo: '',
        chargeCode: '',
        gchargeCode: '',
        chargeName: '',
        applyOn: '',
        currency: '',
        exRate: '',
        rate: '',
        exampted: true,
        fcAmt: '',
        lcAmt: '',
        tlcAmt: '',
        billAmt: '',
        gstPercentage: '',
        gst: ''
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

  const handleAddRow = () => {
    if (isLastRowEmpty(irnChargesData)) {
      displayRowError(irnChargesData);
      return;
    }

    const newRow = {
      id: Date.now(),
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: '',
      currency: '',
      exRate: '',
      rate: '',
      exampted: true,
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
      // remarks: ''
    };

    setIrnChargesData([...irnChargesData, newRow]);
    setIrnChargesError([
      ...irnChargesError,
      {
        jobNo: '',
        chargeCode: '',
        gchargeCode: '',
        chargeName: '',
        applyOn: '',
        currency: '',
        exRate: '',
        rate: '',
        exampted: true,
        fcAmt: '',
        lcAmt: '',
        tlcAmt: '',
        billAmt: '',
        gstPercentage: '',
        gst: ''
        // remarks: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === irnChargesData) {
      return (
        !lastRow.jobNo ||
        !lastRow.chargeCode ||
        !lastRow.gchargeCode ||
        !lastRow.chargeName ||
        !lastRow.applyOn ||
        !lastRow.currency ||
        !lastRow.exRate ||
        !lastRow.rate ||
        // !lastRow.exampted ||
        !lastRow.fcAmt ||
        !lastRow.lcAmt ||
        !lastRow.tlcAmt ||
        !lastRow.billAmt ||
        !lastRow.gstPercentage ||
        !lastRow.gst
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === irnChargesData) {
      setIrnChargesError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          jobNo: !table[table.length - 1].jobNo ? 'Job No is required' : '',
          chargeCode: !table[table.length - 1].chargeCode ? 'Charge Code is required' : '',
          gchargeCode: !table[table.length - 1].gchargeCode ? 'G Charge Code is required' : '',
          chargeName: !table[table.length - 1].chargeName ? 'Charge Name is required' : '',
          applyOn: !table[table.length - 1].applyOn ? 'Apply On is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'Ex Rate is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          // exampted: !table[table.length - 1].exampted ? 'Excempted is required' : '',
          fcAmt: !table[table.length - 1].fcAmt ? 'FC Amount is required' : '',
          lcAmt: !table[table.length - 1].lcAmt ? 'LC Amount Amount is required' : '',
          tlcAmt: !table[table.length - 1].tlcAmt ? 'TLC Amount is required' : '',
          billAmt: !table[table.length - 1].billAmt ? 'Bill Amount is required' : '',
          gstPercentage: !table[table.length - 1].gstPercentage ? 'GST % is required' : '',
          gst: !table[table.length - 1].gst ? 'GST is required' : ''
        };
        return newErrors;
      });
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

  const handleGstAddRow = () => {
    if (isGstLastRowEmpty(irnGstData)) {
      displayGstRowError(irnGstData);
      return;
    }
    const newGstRow = {
      id: Date.now(),
      chargeAcc: '',
      subLodgerCode: '',
      crBillAmt: '',
      crLCAmt: null,
      gstRemarks: '',
      dbillAmt: '',
      dblcamt: ''
    };

    setIrnGstData([...irnGstData, newGstRow]);

    setIrnGstError([
      ...irnGstError,
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
  };

  const isGstLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === irnGstData) {
      return (
        !lastRow.chargeAcc || !lastRow.subLodgerCode || !lastRow.dbillAmt || !lastRow.crBillAmt || !lastRow.dblcamt || !lastRow.crLCAmt
      );
    }
    return false;
  };

  const displayGstRowError = (table) => {
    if (table === irnGstData) {
      setIrnGstError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          chargeAcc: !table[table.length - 1].chargeAcc ? 'Charge Account is required' : '',
          subLodgerCode: !table[table.length - 1].subLodgerCode ? 'Sub Ledger Code is required' : '',
          dbillAmt: !table[table.length - 1].dbillAmt ? 'D Bill Amount is required' : '',
          crBillAmt: !table[table.length - 1].crBillAmt ? 'CR Bill Amount is required' : '',
          dblcamt: !table[table.length - 1].dblcamt ? 'DB LC Amount is required' : '',
          crLCAmt: !table[table.length - 1].crLCAmt ? 'CR LC Amount is required' : ''
          // remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
        };
        return newErrors;
      });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    // getGroup();
  }, []);

  useEffect(() => {
    getAllPartyName();
    getIrnCreditNoteDocId();
  }, []);

  const getIrnCreditNoteDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `irnCreditNote/getIrnCreditNoteDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setDocId(response.paramObjectsMap.irnCreditVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPartyName = async () => {
    try {
      const response = await apiCalls('get', `irnCreditNote/getPartyNameAndPartyCodeAndPartyTypeForIrn?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllPartyName(response.paramObjectsMap.irnCreditVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllIrnCredit();
  }, []);

  const getAllIrnCredit = async () => {
    try {
      const response = await apiCalls('get', `irnCreditNote/getAllIrnCreditByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.irnCreditVO);
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
    // setShowForm(true);

    try {
      const response = await apiCalls('get', `/irnCreditNote/getAllIrnCreditById?id=${row.original.id}`);
      if (response.status === true) {
        setListView(false);
        const irnCreditNoteVO = response.paramObjectsMap.irnCreditVO[0];

        setDocId(irnCreditNoteVO.docId);

        setFormData({
          // docId: irnCreditNoteVO.docId,
          vohNo: irnCreditNoteVO.vohNo,
          vohDate: irnCreditNoteVO.vohDate,
          partyName: irnCreditNoteVO.partyName,
          partyCode: irnCreditNoteVO.partyCode,
          partyType: irnCreditNoteVO.partyType,
          supRefDate: irnCreditNoteVO.supRefDate,
          currentDate: irnCreditNoteVO.currentDate,
          currentDateValue: irnCreditNoteVO.currentDateValue,
          product: irnCreditNoteVO.product,
          creditDays: irnCreditNoteVO.creditDays,
          dueDate: irnCreditNoteVO.dueDate,
          currency: irnCreditNoteVO.currency,
          exRate: irnCreditNoteVO.exRate,
          status: irnCreditNoteVO.status,
          originBill: irnCreditNoteVO.originBill,
          remarks: irnCreditNoteVO.remarks,
          address: irnCreditNoteVO.address,
          shipRefNo: irnCreditNoteVO.shipRefNo,
          pincode: irnCreditNoteVO.pincode,
          gstType: irnCreditNoteVO.gstType,
          billingMonth: irnCreditNoteVO.billingMonth,
          otherInfo: irnCreditNoteVO.otherInfo,
          salesType: irnCreditNoteVO.salesType,
          creditRemarks: irnCreditNoteVO.creditRemarks,
          charges: irnCreditNoteVO.charges,
          roundOff: irnCreditNoteVO.roundOff,
          totChargesBillCurrAmt: irnCreditNoteVO.totChargesBillCurrAmt,
          totChargesLCAmt: irnCreditNoteVO.totChargesLCAmt,
          totGrossBillAmt: irnCreditNoteVO.totGrossBillAmt,
          totGrossLCAmt: irnCreditNoteVO.totGrossLCAmt,
          netBillCurrAmt: irnCreditNoteVO.netBillCurrAmt,
          netLCAmt: irnCreditNoteVO.netLCAmt,
          amtInWords: irnCreditNoteVO.amtInWords,
          summaryExRate: irnCreditNoteVO.summaryExRate,
          totTaxAmt: irnCreditNoteVO.totTaxAmt
        });
        setIrnChargesData(
          irnCreditNoteVO.irnCreditChargesVO.map((invoiceData) => ({
            id: invoiceData.id,
            jobNo: invoiceData.jobNo,
            chargeCode: invoiceData.chargeCode,
            gchargeCode: invoiceData.gchargeCode,
            chargeName: invoiceData.chargeName,
            applyOn: invoiceData.applyOn,
            currency: invoiceData.currency,
            exRate: invoiceData.exRate,
            rate: invoiceData.rate,
            exampted: invoiceData.exampted,
            fcAmt: invoiceData.fcAmt,
            lcAmt: invoiceData.lcAmt,
            tlcAmt: invoiceData.tlcAmt,
            billAmt: invoiceData.billAmt,
            gstPercentage: invoiceData.gstPercentage,
            gst: invoiceData.gst
          }))
        );
        setIrnGstData(
          irnCreditNoteVO.irnCreditGstVO.map((invoiceData) => ({
            id: invoiceData.id,
            chargeAcc: invoiceData.chargeAcc,
            subLodgerCode: invoiceData.subLodgerCode,
            dbillAmt: invoiceData.dbillAmt,
            crBillAmt: invoiceData.crBillAmt,
            dblcamt: invoiceData.dblcamt,
            crLCAmt: invoiceData.crLCAmt,
            gstRemarks: invoiceData.gstRemarks
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
      jobNo: !row.jobNo ? 'Job No is required' : '',
      chargeCode: !row.chargeCode ? 'Charge Code is required' : '',
      gchargeCode: !row.gchargeCode ? 'G Charge Code is required' : '',
      chargeName: !row.chargeName ? 'Charge Name is required' : '',
      applyOn: !row.applyOn ? 'Apply On is required' : '',
      currency: !row.currency ? 'Currency is required' : '',
      exRate: !row.exRate ? 'Ex Rate is required' : '',
      rate: !row.rate ? 'Rate is required' : '',
      // exampted: !row.exampted ? 'Excempted is required' : '',
      fcAmt: !row.fcAmt ? 'FC Amount is required' : '',
      lcAmt: !row.lcAmt ? 'LC Amount is required' : '',
      tlcAmt: !row.tlcAmt ? 'TLC Amount is required' : '',
      billAmt: !row.billAmt ? 'Bill Amount is required' : '',
      gstPercentage: !row.gstPercentage ? 'GST % is required' : '',
      gst: !row.gst ? 'GST is required' : ''
    }));
    const tableGstErrors = irnGstData.map((row) => ({
      chargeAcc: !row.chargeAcc ? 'Charge Account is required' : '',
      subLodgerCode: !row.subLodgerCode ? 'Sub Ledger Code is required' : '',
      dbillAmt: !row.dbillAmt ? 'D Bill Amount is required' : '',
      crBillAmt: !row.crBillAmt ? 'CR Bill Amount is required' : '',
      dblcamt: !row.dblcamt ? 'DB LC Amount is required' : '',
      crLCAmt: !row.crLCAmt ? 'CR LC Amount is required' : ''
    }));

    let hasTableErrors = false;
    let hasTableGstErrors = false;

    tableErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableErrors = true;
      }
    });

    tableGstErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableGstErrors = true;
      }
    });

    // Check for empty fields and set error messages
    if (!formData.vohNo) {
      errors.vohNo = 'Voucher No is required';
    }
    if (!formData.vohDate) {
      errors.vohDate = 'Voucher Date is required';
    }
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.partyCode) {
      errors.partyCode = 'Party Code is required';
    }
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.supRefDate) {
      errors.supRefDate = 'SupRef Date is required';
    }
    if (!formData.currentDate) {
      errors.currentDate = 'Current Date is required';
    }
    if (!formData.product) {
      errors.product = 'Product is required';
    }
    if (!formData.creditDays) {
      errors.creditDays = 'Credit Days is required';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'Due Date is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exRate) {
      errors.exRate = 'Ex Rate is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.originBill) {
      errors.originBill = 'Origin Bill is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    if (!formData.shipRefNo) {
      errors.shipRefNo = 'shipper RefNo is required';
    }
    if (!formData.pincode) {
      errors.pincode = 'Pin code is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'Gst Type is required';
    }
    if (!formData.billingMonth) {
      errors.billingMonth = 'Bill Amount is required';
    }
    if (!formData.otherInfo) {
      errors.otherInfo = 'Other Info is required';
    }
    if (!formData.salesType) {
      errors.salesType = 'Sales Type is required';
    }
    if (!formData.creditRemarks) {
      errors.creditRemarks = 'Credit Remarks is required';
    }
    if (!formData.charges) {
      errors.charges = 'Charges is required';
    }
    if (!formData.totChargesBillCurrAmt) {
      errors.totChargesBillCurrAmt = 'Total Charges Bill CurrAmt is required';
    }
    if (!formData.totChargesLCAmt) {
      errors.totChargesLCAmt = 'Total Charges LC Amt is required';
    }
    if (!formData.totGrossBillAmt) {
      errors.totGrossBillAmt = 'Total Gross Bill Amt is required';
    }
    if (!formData.totGrossLCAmt) {
      errors.totGrossLCAmt = 'Total Gross LC Amt is required';
    }
    if (!formData.netBillCurrAmt) {
      errors.netBillCurrAmt = 'Net Bill Curr Amt is required';
    }
    if (!formData.netLCAmt) {
      errors.netLCAmt = 'Net LC Amt is required';
    }
    if (!formData.amtInWords) {
      errors.amtInWords = 'Amt In Words is required';
    }
    if (!formData.summaryExRate) {
      errors.summaryExRate = 'Ex rate is required';
    }
    if (!formData.totTaxAmt) {
      errors.totTaxAmt = 'Tot TaxAmt is required';
    }

    setFieldErrors(errors);
    setIrnChargesError(tableErrors);
    setIrnGstError(tableGstErrors);

    // Prevent saving if form or table errors exist
    if (Object.keys(errors).length === 0 && !hasTableErrors && !hasTableGstErrors) {
      setIsLoading(true);

      const irnCreditChargesVo = irnChargesData.map((row) => ({
        // id: item.id || 0, // If id exists, otherwise 0
        ...(editId && { id: row.id }),
        jobNo: row.jobNo,
        chargeCode: row.chargeCode,
        gchargeCode: row.gchargeCode,
        chargeName: row.chargeName,
        applyOn: row.applyOn,
        currency: row.currency,
        exRate: parseInt(row.exRate),
        rate: parseInt(row.rate),
        exampted: row.exampted,
        fcAmt: parseInt(row.fcAmt),
        lcAmt: parseInt(row.lcAmt),
        tlcAmt: parseInt(row.tlcAmt),
        billAmt: parseInt(row.billAmt),
        gstPercentage: parseInt(row.gstPercentage),
        gst: parseInt(row.gst)
        // remarks: row.remarks,
      }));
      const irnGstChargesVo = irnGstData.map((row) => ({
        // id: item.id || 0, // If id exists, otherwise 0

        ...(editId && { id: row.id }),
        chargeAcc: row.chargeAcc,
        subLodgerCode: row.subLodgerCode,
        dbillAmt: parseInt(row.dbillAmt),
        crBillAmt: parseInt(row.crBillAmt),
        dblcamt: parseInt(row.dblcamt),
        crLCAmt: parseInt(row.crLCAmt),
        gstRemarks: row.gstRemarks
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        vohNo: formData.vohNo,
        vohDate: formatDate(formData.vohDate),
        partyName: formData.partyName,
        partyCode: formData.partyCode,
        partyType: formData.partyType,
        supRefDate: formatDate(formData.supRefDate),
        currentDate: formatDate(formData.currentDate),
        currentDateValue: parseInt(formData.currentDateValue),
        product: formData.product,
        creditDays: parseInt(formData.creditDays),
        dueDate: formatDate(formData.dueDate),
        currency: formData.currency,
        exRate: parseInt(formData.exRate),
        status: formData.status,
        originBill: formData.originBill,
        remarks: formData.remarks,
        address: formData.address,
        shipRefNo: formData.shipRefNo,
        pincode: parseInt(formData.pincode),
        gstType: formData.gstType,
        billingMonth: formData.billingMonth,
        otherInfo: formData.otherInfo,
        salesType: formData.salesType,
        creditRemarks: formData.creditRemarks,
        charges: formData.charges,
        irnCreditGstDTO: irnGstChargesVo,
        irnCreditChargeDTO: irnCreditChargesVo,
        roundOff: formData.roundOff,
        totChargesBillCurrAmt: parseInt(formData.totChargesBillCurrAmt),
        totChargesLCAmt: parseInt(formData.totChargesLCAmt),
        totGrossBillAmt: parseInt(formData.totGrossBillAmt),
        totGrossLCAmt: parseInt(formData.totGrossLCAmt),
        netBillCurrAmt: parseInt(formData.netBillCurrAmt),
        netLCAmt: parseInt(formData.netLCAmt),
        amtInWords: formData.amtInWords,
        summaryExRate: parseInt(formData.summaryExRate),
        totTaxAmt: parseInt(formData.totTaxAmt),
        createdBy: loginUserName,
        orgId: parseInt(orgId),
        branch: branch,
        branchCode: branchCode,
        cancel: true,
        cancelRemarks: '',
        finYear: finYear
      };

      try {
        const response = await apiCalls('put', `/irnCreditNote/updateCreateIrnCredit`, saveFormData);
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

  const listViewColumns = [
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    // { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'vohNo', header: 'Voucher No', size: 140 },
    { accessorKey: 'vohDate', header: 'Voucher Date', size: 140 }
  ];

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-start mb-4 " style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getIrnCreditById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField id="docId" name="docId" label="Doc ID" size="small" value={docId} disabled required fullWidth />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
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
                      error={!!fieldErrors.vohDate}
                      helperText={fieldErrors.vohDate ? fieldErrors.vohDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={allPartyName}
                  getOptionLabel={(option) => option.partyName}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.partyName ? allPartyName.find((c) => c.partyName === formData.partyName) : null}
                  onChange={(event, newValue) => {
                    // Wrapped in an arrow function
                    handleInputChange({
                      target: {
                        name: 'partyName',
                        value: newValue ? newValue.partyName : '' // Passes 'partyName' value or empty string
                      }
                    });
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
                    onChange={handleInputChange}
                    error={!!fieldErrors.partyCode}
                    helperText={fieldErrors.partyCode}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partyType"
                    name="partyType"
                    label="Party Type"
                    size="small"
                    value={formData.partyType}
                    onChange={handleInputChange}
                    error={!!fieldErrors.partyType}
                    helperText={fieldErrors.partyType}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Supplier Ref. Date."
                      value={formData.supRefDate ? dayjs(formData.supRefDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('supRefDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.supRefDate}
                      helperText={fieldErrors.supRefDate ? fieldErrors.supRefDate : ''}
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
              </div>
              <div className="col-md-3 mb-3">
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
              </div>
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
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
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
              </div>
              <div className="col-md-3 mb-3">
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
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
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
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="originBill"
                    name="originBill"
                    label="Origin Bill"
                    size="small"
                    value={formData.originBill}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.originBill}
                    helperText={fieldErrors.originBill}
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
                    inputProps={{ maxLength: 150 }}
                    error={!!fieldErrors.remarks}
                    helperText={fieldErrors.remarks}
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
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="shipRefNo"
                    name="shipRefNo"
                    label="Shipper Ref. No."
                    size="small"
                    value={formData.shipRefNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.shipRefNo}
                    helperText={fieldErrors.shipRefNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="pincode"
                    name="pincode"
                    label="Pin Code"
                    size="small"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 6 }}
                    error={!!fieldErrors.pincode}
                    helperText={fieldErrors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="pincode"
                    name="pincode"
                    // label="Pin Code"
                    size="small"
                    // value={formData.pincode}
                    // onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    // error={!!fieldErrors.pincode}
                    // helperText={fieldErrors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="gstType"
                    name="gstType"
                    label="Gst Type"
                    size="small"
                    value={formData.gstType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.gstType}
                    helperText={fieldErrors.gstType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="billingMonth"
                    name="billingMonth"
                    label="Billing Month"
                    size="small"
                    value={formData.billingMonth}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.billingMonth}
                    helperText={fieldErrors.billingMonth}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="otherInfo"
                    name="otherInfo"
                    label="Other Info"
                    size="small"
                    value={formData.otherInfo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.otherInfo}
                    helperText={fieldErrors.otherInfo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="salesType"
                    name="salesType"
                    label="Sales Type"
                    size="small"
                    value={formData.salesType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.salesType}
                    helperText={fieldErrors.salesType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="creditRemarks"
                    name="creditRemarks"
                    label="Credit Remarks"
                    size="small"
                    value={formData.creditRemarks}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 150 }}
                    error={!!fieldErrors.creditRemarks}
                    helperText={fieldErrors.creditRemarks}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="charges"
                    name="charges"
                    label="Charges"
                    size="small"
                    value={formData.charges}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 50 }}
                    error={!!fieldErrors.charges}
                    helperText={fieldErrors.charges}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="jobStatus"
                    name="jobStatus"
                    // label="Job Status"
                    size="small"
                    // value={formData.jobStatus}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    // error={!!fieldErrors.jobStatus}
                    // helperText={fieldErrors.jobStatus}
                  />
                </FormControl>
              </div>
            </div>
            {/* </div> */}

            <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                      <Tab label="Masters / House Charges" value="1" />
                      <Tab label="Gst" value="2" />
                      <Tab label="Summary" value="3" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    {/* <TableComponent /> */}
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
                                  <th className="px-2 py-2 text-white text-center">Job Number</th>
                                  <th className="px-2 py-2 text-white text-center">Charge Code</th>
                                  <th className="px-2 py-2 text-white text-center">GCharge Code</th>
                                  <th className="px-2 py-2 text-white text-center">Charge Name</th>
                                  <th className="px-2 py-2 text-white text-center">Apply On</th>
                                  <th className="px-2 py-2 text-white text-center">Ex. Rate</th>
                                  <th className="px-2 py-2 text-white text-center">Currency</th>
                                  <th className="px-2 py-2 text-white text-center">Rate</th>
                                  <th className="px-2 py-2 text-white text-center">Excempted</th>
                                  <th className="px-2 py-2 text-white text-center">FC Amount</th>
                                  <th className="px-2 py-2 text-white text-center">LC Amount</th>
                                  <th className="px-2 py-2 text-white text-center">TLC Amount</th>
                                  <th className="px-2 py-2 text-white text-center">Bil Amount</th>
                                  <th className="px-2 py-2 text-white text-center">GST %</th>
                                  <th className="px-2 py-2 text-white text-center">GST</th>

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
                                          value={row.jobNo}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, jobNo: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], jobNo: !value ? 'Job No is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              // Remove this block to not set any error for non-numeric input
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], jobNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.jobNo ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.jobNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].jobNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeCode}
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
                                          value={row.gchargeCode}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gchargeCode: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gchargeCode: !value ? 'GCharge Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gchargeCode: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.gchargeCode ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.gchargeCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].gchargeCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeName}
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
                                        <input
                                          type="text"
                                          value={row.applyOn}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, applyOn: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], applyOn: !value ? 'Apply On is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  applyOn: 'Only alphabets and numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.applyOn ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.applyOn && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].applyOn}
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
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  exRate: !value ? 'Ex Rate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  exRate: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.exRate ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.exRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].exRate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.currency}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r)));
                                            setIrnChargesError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], currency: !value ? 'currency is required' : '' };
                                              return newErrors;
                                            });
                                          }}
                                          className={irnChargesError[index]?.currency ? 'error form-control' : 'form-control'}
                                          style={{ width: '200px' }}
                                        >
                                          <option value="">Select Currency</option>
                                          {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.currency}>
                                              {currency.currency}
                                            </option>
                                          ))}
                                        </select>
                                        {irnChargesError[index]?.currency && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].currency}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: !value ? 'Rate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.rate ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.rate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].rate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <Checkbox
                                            id="tax"
                                            checked={row.exampted}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, exampted: isChecked } : r))
                                              );
                                              // setirnChargesError((prev) => {
                                              //   const newErrors = [...prev];
                                              //   newErrors[index] = { ...newErrors[index], exampted: '' };
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
                                          value={row.fcAmt}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, fcAmt: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fcAmt: !value ? 'FC Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fcAmt: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.fcAmt ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.fcAmt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].fcAmt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.lcAmt}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, lcAmt: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lcAmt: !value ? 'LC Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lcAmt: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.lcAmt ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.lcAmt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].lcAmt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.tlcAmt}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, tlcAmt: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], tlcAmt: !value ? 'TLC Amount is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], tlcAmt: 'Only numbers are allowed' };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.tlcAmt ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.tlcAmt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].tlcAmt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.billAmt}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;

                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, billAmt: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  billAmt: !value ? 'Bill Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  billAmt: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.billAmt ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.billAmt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].billAmt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gstPercentage}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;

                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gstPercentage: value } : r))
                                              );
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstPercentage: !value ? 'GST % is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstPercentage: 'Only numbers are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.gstPercentage ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {irnChargesError[index]?.gstPercentage && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].gstPercentage}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gst}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gst: value } : r)));
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], gst: !value ? 'GST is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setIrnChargesError((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], gst: 'Only numbers are allowed' };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={irnChargesError[index]?.gst ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}

                                          // onKeyDown={(e) => handleKeyDown(e, row, inVoiceDetailsData)}
                                        />
                                        {irnChargesError[index]?.gst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {irnChargesError[index].gst}
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
                  <TabPanel value="2">
                    {/* <TableComponent /> */}
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleGstAddRow} />
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
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s-]*$/;
                                            if (regex.test(value)) {
                                              setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, chargeAcc: value } : r)));
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
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const isNumeric = /^[0-9]*$/;
                                            if (isNumeric.test(value)) {
                                              setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, crBillAmt: value } : r)));
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
                  <TabPanel value="3">
                    <div>
                      <div className="row d-flex mt-2">
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="roundOff"
                              name="roundOff"
                              label="Round Off"
                              size="small"
                              value={formData.roundOff}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.roundOff}
                              helperText={fieldErrors.roundOff}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totChargesBillCurrAmt"
                              name="totChargesBillCurrAmt"
                              label="Total Charges Bill Curr Amount"
                              size="small"
                              value={formData.totChargesBillCurrAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.totChargesBillCurrAmt}
                              helperText={fieldErrors.totChargesBillCurrAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totChargesLCAmt"
                              name="totChargesLCAmt"
                              label="Total Charges LC Amount"
                              size="small"
                              value={formData.totChargesLCAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.totChargesLCAmt}
                              helperText={fieldErrors.totChargesLCAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totGrossBillAmt"
                              name="totGrossBillAmt"
                              label="Total Gross Bill Amount"
                              size="small"
                              value={formData.totGrossBillAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.totGrossBillAmt}
                              helperText={fieldErrors.totGrossBillAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totGrossLCAmt"
                              name="totGrossLCAmt"
                              label="Total Gross LC Amount"
                              size="small"
                              value={formData.totGrossLCAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.totGrossLCAmt}
                              helperText={fieldErrors.totGrossLCAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="netBillCurrAmt"
                              name="netBillCurrAmt"
                              label="Net Bill Curr Amount"
                              size="small"
                              value={formData.netBillCurrAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.netBillCurrAmt}
                              helperText={fieldErrors.netBillCurrAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="netLCAmt"
                              name="netLCAmt"
                              label="Net LC Amount"
                              size="small"
                              value={formData.netLCAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.netLCAmt}
                              helperText={fieldErrors.netLCAmt}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="amtInWords"
                              name="amtInWords"
                              label="Amount In Words"
                              size="small"
                              value={formData.amtInWords}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.amtInWords}
                              helperText={fieldErrors.amtInWords}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="summaryExRate"
                              name="summaryExRate"
                              label="Ex Rate"
                              size="small"
                              value={formData.summaryExRate}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.summaryExRate}
                              helperText={fieldErrors.summaryExRate}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="totTaxAmt"
                              name="totTaxAmt"
                              label="Total Tax Amount"
                              size="small"
                              value={formData.totTaxAmt}
                              onChange={handleInputChange}
                              inputProps={{ maxLength: 30 }}
                              error={!!fieldErrors.totTaxAmt}
                              helperText={fieldErrors.totTaxAmt}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default IrnCreditNote;
