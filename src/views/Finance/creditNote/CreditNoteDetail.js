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
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
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

// import CommonListViewTable from '../basicMaster/CommonListViewTable';

// import { AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
// import { BsListTask } from "react-icons/bs";
import TableComponent from './TableComponent';

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

const IrnCreditNote = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allPartyName, setAllPartyName] = useState([]);
  const [branch, setBranch] = useState('Chennai');
  const [branchCode, setBranchCode] = useState('MAA');
  const [finYear, setFinYear] = useState('2024');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    active: true,
    docId: '',
    docDate: new Date(),
    orgId: orgId,
    address: '',
    amtInWords: '',
    billingMonth: '',
    branch: '',
    branchCode: '',
    cancel: true,
    cancelRemarks: '',
    charges: '',
    city: '',
    createdBy: '',
    creditDays: '',
    creditRemarks: '',
    currency: '',
    dueDate: null,
    exRate: '',
    finYear: '',
    gstType: '',
    gstin: '',
    netBillCurrAmt: '',
    netLCAmt: '',
    officeType: '',
    originBill: '',
    otherInfo: '',
    partyCode: '',
    partyName: '',
    partyType: '',
    pincode: '',
    // product: '',
    remarks: '',
    salesType: '',
    shipRefNo: '',
    state: '',
    status: '',
    supRefDate: null,
    supRefNo: '',
    totChargesBillCurrAmt: '',
    totChargesLCAmt: '',
    totGrossBillAmt: '',
    totGrossLCAmt: '',
    totTaxAmt: '',
    updatedBy: '',
    vohDate: '',
    vohNo: '',
    irnCreditGstDTO: [],
    irnCreditChargeDTO: []
  });

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: null,
    partyName: '',
    partyCode: '',
    partyType: '',
    // product: '',
    status: '',
    originBill: '',
    address: '',
    pincode: '',
    vohNo: '',
    vohDate: '',
    supRefNo: '',
    supRefDate: '',
    creditDays: '',
    dueDate: '',
    currency: '',
    exRate: '',
    remarks: '',
    shipRefNo: '',
    gstType: '',
    billingMonth: '',
    salesType: '',
    creditRemarks: '',
    charges: ''
  });

  const [irnChargesData, setIrnChargesData] = useState([
    {
      sno: '',
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: null,
      currency: '',
      exRate: '',
      rate: '',
      exempted: '',
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
      // remarks: ''
    }
  ]);

  const [irnChargesError, setIrnChargesError] = useState([
    {
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: null,
      currency: '',
      exRate: '',
      rate: '',
      exempted: '',
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
      // remarks: ''
    }
  ]);

  const [irnGstData, setIrnGstData] = useState([
    {
      sno: '',
      chargeAcc: '',
      subLedgerCode: '',
      crBillAmt: '',
      crLcAmt: null,
      remarks: '',
      dbillAmt: '',
      dblcAmt: ''
    }
  ]);

  const [irnGstError, setIrnGstError] = useState([
    {
      chargeAcc: '',
      subLedgerCode: '',
      crBillAmt: '',
      crLcAmt: null,
      remarks: '',
      dbillAmt: '',
      dblcAmt: ''
    }
  ]);

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;

  //   // If customerName is selected, find and set customerCode
  //   if (name === 'customerName') {
  //     const selectedCustomer = allCustomerName.find((customer) => customer.customerName === value);
  //     if (selectedCustomer) {
  //       setFormData({
  //         ...formData,
  //         customerName: value,
  //         customerCode: selectedCustomer.customerCode // Set the corresponding customerCode
  //       });
  //     }
  //   } else {
  //     setFormData({ ...formData, [name]: inputValue });
  //   }

  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;

  //   // Define regex for numeric fields
  //   const isNumeric = /^[0-9]*$/;

  //   // Validation logic for numeric fields
  //   const numericFields = ['bankCharges', 'receiptAmt', 'tdsAmt']; // Add other numeric fields if needed
  //   if (numericFields.includes(name)) {
  //     if (!isNumeric.test(value)) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [name]: 'Only numbers are allowed'
  //       });
  //       return; // Prevent further form updates if invalid input
  //     }
  //   }

  //   // If customerName is selected, find and set customerCode
  //   if (name === 'customerName') {
  //     const selectedCustomer = allCustomerName.find((customer) => customer.customerName === value);
  //     if (selectedCustomer) {
  //       setFormData({
  //         ...formData,
  //         customerName: value,
  //         customerCode: selectedCustomer.customerCode // Set the corresponding customerCode
  //       });
  //     }
  //   } else {
  //     setFormData({ ...formData, [name]: inputValue });
  //   }

  //   // Clear error when input is valid
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    // Define regex for numeric fields
    const isNumeric = /^[0-9]*$/;

    // Validation logic for numeric fields
    const numericFields = [
      'pincode',
      'creditDays',
      'exRate',
      'billAmt',
      'fcAmt',
      'gst',
      'gstPercentage',
      'lcAmt',
      'rate',
      'crBillAmt',
      'crLCAmt',
      'dbillAmt',
      'dblcamt',
      'netBillCurrAmt',
      'netLCAmt',
      'totChargesBillCurrAmt',
      'totChargesLCAmt',
      'totGrossBillAmt',
      'totGrossLCAmt',
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
      active: true,
      address: '',
      addressType: '',
      billCurr: '',
      dueDate: null,
      gsttype: '',
      headerColumns: '',
      invoiceDate: new Date(),
      partyCode: '',
      partyName: '',
      partyType: '',
      pincode: '',
      placeOfSupply: '',
      recipientGSTIN: '',
      salesType: '',
      status: '',
      updatedBy: '',
      irnCreditGstDTO: [],
      irnCreditChargeDTO: [],
      amtInWords: '',
      billingMonth: '',
      charges: '',
      city: '',
      creditDays: '',
      creditRemarks: '',
      currency: '',
      exRate: '',
      gstType: '',
      gstin: '',
      netBillCurrAmt: '',
      netLCAmt: '',
      officeType: '',
      originBill: '',
      otherInfo: '',
      // product: '',
      remarks: '',
      shipRefNo: '',
      state: '',
      supRefDate: '',
      supRefNo: '',
      totChargesBillCurrAmt: '',
      totChargesLCAmt: '',
      totGrossBillAmt: '',
      totGrossLCAmt: '',
      jobStatus:'',
      totTaxAmt: '',
      vohDate: '',
      vohNo: '',
    });

    setFieldErrors({
      docId: '',
      docDate: null,
      partyName: '',
      partyCode: '',
      partyType: '',
      // product: '',
      status: '',
      originBill: '',
      address: '',
      pincode: '',
      vohNo: '',
      vohDate: '',
      supRefNo: '',
      supRefDate: '',
      creditDays: '',
      dueDate: '',
      currency: '',
      exRate: '',
      remarks: '',
      shipRefNo: '',
      gstType: '',
      billingMonth: '',
      salesType: '',
      creditRemarks: '',
      charges: '',

    });

    setIrnChargesData([{
      jobNo: '',
      chargeCode: '',
      gchargeCode: '',
      chargeName: '',
      applyOn: null,
      currency: '',
      exRate: '',
      rate: '',
      exempted: '',
      fcAmt: '',
      lcAmt: '',
      tlcAmt: '',
      billAmt: '',
      gstPercentage: '',
      gst: ''
    }])
    setIrnChargesError('')
    setEditId('');
    setIrnGstData([{
      chargeAcc: '',
      subLedgerCode: '',
      crBillAmt: '',
      crLcAmt: null,
      remarks: '',
      dbillAmt: '',
      dblcAmt: ''
    }])
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleGstAddRow = () => {
    if (isGstLastRowEmpty(irnGstData)) {
      displayGstRowError(irnGstData);
      return;
    }
    const newGstRow = {
      id: Date.now(),
      chargeAcc: '',
      subLedgerCode: '',
      crBillAmt: '',
      crLcAmt: null,
      remarks: '',
      dbillAmt: '',
      dblcAmt: ''
    };

    setIrnGstData([...irnGstData, newGstRow]);

    setIrnGstError([
      ...irnChargesError,
      {
        chargeAcc: '',
        subLedgerCode: '',
        crBillAmt: '',
        crLcAmt: null,
        remarks: '',
        dbillAmt: '',
        dblcAmt: ''
      }
    ]);
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
      excempted: '',
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
        excempted: '',
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
        !lastRow.excempted ||
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
  const isGstLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === irnGstData) {
      return (
        !lastRow.chargeAcc ||
        !lastRow.subLedgerCode ||
        !lastRow.dbillAmt ||
        !lastRow.crBillAmt ||
        !lastRow.dblcAmt ||
        !lastRow.crLcAmt ||
        !lastRow.remarks
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
          excempted: !table[table.length - 1].excempted ? 'Excempted is required' : '',
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
  const displayGstRowError = (table) => {
    if (table === irnGstData) {
      setIrnChargesError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          chargeAcc: !table[table.length - 1].chargeAcc ? 'Charge Account is required' : '',
          subLedgerCode: !table[table.length - 1].subLedgerCode ? 'Sub Ledger Code is required' : '',
          dbillAmt: !table[table.length - 1].dbillAmt ? 'D Bill Amount is required' : '',
          crBillAmt: !table[table.length - 1].crBillAmt ? 'CR Bill Amount is required' : '',
          dblcAmt: !table[table.length - 1].dblcAmt ? 'DB LC Amount is required' : '',
          crLcAmt: !table[table.length - 1].crLcAmt ? 'CR LC Amount is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
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
  }, []);

  const getAllPartyName = async () => {
    try {
      const response = await apiCalls(
        'get',
        `irnCreditNote/getPartyNameAndPartyCodeAndPartyTypeForIrn?orgId=${orgId}`
      );
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

        setFormData({
          address: irnCreditNoteVO.address,
          amtInWords: irnCreditNoteVO.amtInWords,
          billingMonth: irnCreditNoteVO.billAmt,
          charges: irnCreditNoteVO.charges,
          city: irnCreditNoteVO.city,
          creditDays: irnCreditNoteVO.creditDays,
          creditRemarks: irnCreditNoteVO.creditRemarks,
          currency: irnCreditNoteVO.currency,
          dueDate: null.dueDate,
          exRate: irnCreditNoteVO.exRate,
          gstType: irnCreditNoteVO.gstType,
          gstin: irnCreditNoteVO.gstin,
          netBillCurrAmt: irnCreditNoteVO.netBillCurrAmt,
          netLCAmt: irnCreditNoteVO.netLCAmt,
          officeType: irnCreditNoteVO.officeType,
          originBill: irnCreditNoteVO.originBill,
          otherInfo: irnCreditNoteVO.otherInfo,
          partyCode: irnCreditNoteVO.partyCode,
          partyName: irnCreditNoteVO.partyName,
          partyType: irnCreditNoteVO.partyType,
          pincode: irnCreditNoteVO.pincode,
          // // product: irnCreditNoteVO.product,
          remarks: irnCreditNoteVO.remarks,
          salesType: irnCreditNoteVO.salesType,
          shipRefNo: irnCreditNoteVO.shipRefNo,
          state: irnCreditNoteVO.state,
          status: irnCreditNoteVO.status,
          supRefDate: dayjs(irnCreditNoteVO.supRefDate), // Convert to correct format,
          supRefNo: irnCreditNoteVO.supRefNo,
          totChargesBillCurrAmt: irnCreditNoteVO.totChargesBillCurrAmt,
          totChargesLCAmt: irnCreditNoteVO.totChargesLCAmt,
          totGrossBillAmt: irnCreditNoteVO.totGrossBillAmt,
          totGrossLCAmt: irnCreditNoteVO.totGrossLCAmt,
          totTaxAmt: irnCreditNoteVO.totTaxAmt,
          vohDate: dayjs(irnCreditNoteVO.vohDate),
          vohNo: irnCreditNoteVO.vohNo
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
            excempted: invoiceData.excempted,
            fcAmt: invoiceData.fcAmt,
            lcAmt: invoiceData.lcAmt,
            tlcAmt: invoiceData.tlcAmt,
            billAmt: invoiceData.billAmt,
            gstPercentage: invoiceData.gstPercentage,
            gst: invoiceData.gst
          }))
        );
        setIrnGstData(
          irnCreditNoteVO.irnGstChargesVO.map((invoiceData) => ({
            id: invoiceData.id,
            chargeAcc: invoiceData.chargeAcc,
            subLedgerCode: invoiceData.subLedgerCode,
            dbillAmt: invoiceData.dbillAmt,
            crBillAmt: invoiceData.crBillAmt,
            dblcAmt: invoiceData.dblcAmt,
            crLcAmt: invoiceData.crLcAmt,
            remarks: invoiceData.remarks
          }))
        );
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const formatDate = (date) => {
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // const currentDate = new Date();

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
      excempted: !row.excempted ? 'Excempted is required' : '',
      fcAmt: !row.fcAmt ? 'FC Amount is required' : '',
      tlcAmt: !row.tlcAmt ? 'TLC Amount is required' : '',
      billAmt: !row.billAmt ? 'Bill Amount is required' : '',
      gstPercentage: !row.gstPercentage ? 'GST % is required' : '',
      gst: !row.gst ? 'GST is required' : ''
    }));
    // const tableGstErrors = irnGstData.map((row) => ({
    //   chargeAcc: !row.chargeAcc ? 'Charge Account is required' : '',
    //   subLedgerCode: !row.subLedgerCode ? 'Sub Ledger Code is required' : '',
    //   gchargeCode: !row.gchargeCode ? 'G Charge Code is required' : '',
    //   dbillAmt: !row.dbillAmt ? 'D Bill Amount is required' : '',
    //   crBillAmt: !row.crBillAmt ? 'CR Bill Amount is required' : '',
    //   dblcAmt: !row.dblcAmt ? 'DB LC Amount is required' : '',
    //   crLcAmt: !row.crLcAmt ? 'CR LC Amount is required' : '',
    //   remarks: !row.remarks ? 'Remarks is required' : ''
    // }));

    let hasTableErrors = false;

    tableErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableErrors = true;
      }
    });

    // Check for empty fields and set error messages
    if (!formData.docId) {
      errors.docId = 'Doc Id is required';
    }
    if (!formData.docDate) {
      errors.docDate = 'Document Date is required';
    }
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.partyCode) {
      errors.partyCode = 'Party Code is required';
    }
    // if (!formData.product) {
    // // errors.product = 'Product is required';
    // }
    if (!formData.originBill) {
      errors.originBill = 'Origin Bill is required';
    }
    if (!formData.salesType) {
      errors.salesType = 'Sales Type is required';
    }
    if (!formData.vohNo) {
      errors.vohNo = 'Voucher No is required';
    }
    if (!formData.vohDate) {
      errors.vohDate = 'Voucher Date is required';
    }
    if (!formData.pincode) {
      errors.pincode = 'Pincode is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }

    setFieldErrors(errors);
    setIrnChargesError(tableErrors);

    // Prevent saving if form or table errors exist
    if (Object.keys(errors).length === 0 && !hasTableErrors) {
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
        excempted: row.excempted,
        fcAmt: parseInt(row.fcAmt),
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
        subLedgerCode: row.subLedgerCode,
        dbillAmt: parseInt(row.dbillAmt),
        crBillAmt: parseInt(row.crBillAmt),
        dblcAmt: parseInt(row.dblcAmt),
        crLcAmt: parseInt(row.crLcAmt),
        remarks: row.remarks
        // remarks: row.remarks,
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        address: formData.address,
        amtInWords: formData.amtInWords,
        billingMonth: formData.billingMonth,
        charges: formData.charges,
        city: formData.city,
        creditDays: parseInt(formData.creditDays),
        creditRemarks: formData.creditRemarks,
        currency: formData.currency,
        dueDate: dayjs(new Date(formData.dueDate)),
        exRate: parseInt(formData.exRate),
        gstType: formData.gstType,
        gstin: formData.gstin,
        netBillCurrAmt: parseInt(formData.netBillCurrAmt),
        netLCAmt: parseInt(formData.netLCAmt),
        officeType: formData.officeType,
        originBill: formData.originBill,
        otherInfo: formData.otherInfo,
        partyCode: formData.partyCode,
        partyName: formData.partyName,
        partyType: formData.partyType,
        pincode: parseInt(formData.pincode),
        // // product: formData.product ,
        remarks: formData.remarks,
        salesType: formData.salesType,
        shipRefNo: formData.shipRefNo,
        state: formData.state,
        status: formData.status,
        supRefDate: dayjs(new Date(formData.supRefDate)),
        supRefNo: formData.supRefNo,
        totChargesBillCurrAmt: parseInt(formData.totChargesBillCurrAmt),
        totChargesLCAmt: parseInt(formData.totChargesLCAmt),
        totGrossBillAmt: parseInt(formData.totGrossBillAmt),
        totGrossLCAmt: parseInt(formData.totGrossLCAmt),
        totTaxAmt: parseInt(formData.totTaxAmt),
        updatedBy: formData.updatedBy,
        vohDate: dayjs(new Date(formData.vohDate)),
        vohNo: formData.vohNo,
        irnCreditGstDTO: irnGstChargesVo,
        irnCreditChargeDTO: irnCreditChargesVo,
        createdBy: loginUserName,
        orgId: orgId,
        branch: branch,
        branchCode: branchCode,
        Cancel: true,
        cancelRemarks: '',
        finYear: finYear
      };

      try {
        const response = await apiCalls('put', `/irnCreditNote/updateCreateIrnCredit`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'IRN Credit Note Updated Successfully' : 'IRN Credit Note created successfully');
          handleClear();
          getAllIrnCredit();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'IRN Credit Note creation failed');
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
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="docId"
                    name="docId"
                    label="Doc ID"
                    size="small"
                    value={formData.docId}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.docId}
                    helperText={fieldErrors.docId}
                  />
                </FormControl>
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.docDate}
                      helperText={fieldErrors.docDate ? fieldErrors.docDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div> */}
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
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.product}>
                  <InputLabel id="product" required>
                    Product
                  </InputLabel>
                  <Select labelId="product" id="product" name="product" required value={formData.product} label="product" onChange={handleInputChange}>
                    <MenuItem value={'CO'}>CO</MenuItem>
                    <MenuItem value={'TO'}>TO</MenuItem>
                  </Select>
                  {fieldErrors.product && <FormHelperText>{fieldErrors.product}</FormHelperText>}
                </FormControl>
              </div> */}
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
                    id="pincode"
                    name="pincode"
                    label="Pin Code"
                    size="small"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.pincode}
                    helperText={fieldErrors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="jobStatus"
                    name="jobStatus"
                    label="Job Status"
                    size="small"
                    value={formData.jobStatus}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.jobStatus}
                    helperText={fieldErrors.jobStatus}
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
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="refNo"
                    name="refNo"
                    label="Supplier Ref. No."
                    size="small"
                    value={formData.refNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.refNo}
                    helperText={fieldErrors.refNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Supplier Ref. Date."
                      value={formData.refDate ? dayjs(formData.refDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('refDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.refDate}
                      helperText={fieldErrors.refDate ? fieldErrors.refDate : ''}
                    />
                  </LocalizationProvider>
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
            </div>
            {/* </div> */}

            {/* <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}> */}
            <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
              <TabList style={{ marginBottom: 0 }}>
                <Tab>Master/House Charges</Tab>
                <Tab>Gst</Tab>
                <Tab>Summary</Tab>
              </TabList>
              <TabPanel>
                {/* <TableComponent /> */}
                <div className="row d-flex ml" style={{ marginTop: '20px' }}>
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
                                            newErrors[index] = { ...newErrors[index], invNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
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
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, chargeCode: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], chargeCode: !value ? 'Charge Code is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          // Remove this block to not set any error for non-numeric input
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], invNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
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
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, chargeName: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], chargeName: !value ? 'Charge Name is required' : '' };
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
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, applyOn: value } : r)));
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
                                    <input
                                      type="text"
                                      value={row.currency}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], currency: !value ? 'Currency is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              currency: 'Only alphabets and numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.currency ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
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
                                    <input
                                      type="text"
                                      value={row.excempted}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, excempted: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], excempted: !value ? 'Excempted is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], excempted: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.excempted ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.excempted && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].excempted}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.fcAmount}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, fcAmount: value } : r)));
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
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, lcAmount: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lcAmount: !value ? 'LC Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lcAmount: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.lcAmount ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.lcAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].lcAmount}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tlcAmount}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, tlcAmount: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], tlcAmount: !value ? 'TLC Amount is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], tlcAmount: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.tlcAmount ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.tlcAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].tlcAmount}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.billAmount}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;

                                        if (isNumeric.test(value)) {
                                          setIrnChargesData((prev) => prev.map((r) => (r.id === row.id ? { ...r, billAmount: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              billAmount: !value ? 'Bill Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              billAmount: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.billAmount ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.billAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].billAmount}
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
              <TabPanel>
                {/* <TableComponent /> */}
                <div className="row d-flex ml" style={{ marginTop: '20px' }}>
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
                                      onClick={() => handleDeleteRow(row.id, irnGstData, setIrnGstData, irnGstError, setIrnGstError)}
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
                                            newErrors[index] = { ...newErrors[index], invNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.chargeAcc ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.chargeAcc && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].chargeAcc}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.subLedgerCode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, subLedgerCode: value } : r)));
                                          setIrnGstError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              subLedgerCode: !value ? 'Sub Ledger Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          // Remove this block to not set any error for non-numeric input
                                          setIrnGstError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], invNo: 'Only alphabets and numbers are allowed' }; // Clear the error instead
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.subLedgerCode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.subLedgerCode && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].subLedgerCode}
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
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              dbillAmt: !value ? 'D Bill Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              dbillAmt: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.dbillAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.dbillAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].dbillAmt}
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
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              crBillAmt: !value ? 'CR Bill Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              crBillAmt: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.crBillAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.crBillAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].crBillAmt}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.dblcAmt}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, dblcAmt: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              dblcAmt: !value ? 'DB LC Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              dblcAmt: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.dblcAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.dblcAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].dblcAmt}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.crLcAmt}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, crLcAmt: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              crLcAmt: !value ? 'CR LC Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              crLcAmt: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.crLcAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.crLcAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].crLcAmt}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.remarks}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setIrnGstData((prev) => prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r)));
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], remarks: !value ? 'Remarks is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setIrnChargesError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: 'Only alphabets and numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={irnChargesError[index]?.remarks ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {irnChargesError[index]?.remarks && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {irnChargesError[index].remarks}
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
              <TabPanel>
                <div>
                  <div className="row d-flex mt-4">
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
                          id="exRate"
                          name="exRate"
                          label="Ex Rate"
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
            </Tabs>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default IrnCreditNote;
