import { useEffect, useRef, useState } from 'react';
import apiCalls from 'apicall';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, Checkbox, FormControlLabel, FormLabel, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonTable from 'views/basicMaster/CommonTable';

const CostInvoice = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [exRates, setExRates] = useState([]);
  const [partyName, setPartyName] = useState([]);
  const [partyId, setPartyId] = useState('');
  const [stateName, setStateName] = useState([]);
  const [stateCode, setStateCode] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [jobNoList, setJobNoList] = useState([]);
  const [chargeCode, setChargeCode] = useState([]);
  const [addressType, setAddressType] = useState([]);
  const [formData, setFormData] = useState({
    accuralid: '',
    address: '',
    branch: '',
    branchCode: '',
    client: '',
    costInvoiceDate: null,
    costInvoiceNo: '',
    costType: '',
    creditDays: '',
    currency: '',
    customer: '',
    docDate: dayjs(),
    docId: '',
    dueDate: null,
    exRate: '',
    finYear: '',
    gstType: '',
    ipNo: '',
    latitude: '',
    mode: '',
    otherInfo: '',
    payment: '',
    product: '',
    purVoucherDate: null,
    purVoucherNo: '',
    remarks: '',
    shipperRefNo: '',
    supplierBillNo: '',
    supplierCode: '',
    supplierGstIn: '',
    supplierGstInCode: '',
    supplierName: '',
    supplierPlace: '',
    supplierType: '',
    utrRef: ''
  });

  const [chargerCostInvoice, setChargerCostInvoice] = useState([
    {
      chargeCode: '',
      chargeLedger: '',
      chargeName: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      gst: '',
      gstPercent: '',
      jobNo: '',
      ledger: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    }
  ]);
  const [costInvoiceErrors, setCostInvoiceErrors] = useState([
    {
      chargeCode: '',
      chargeLedger: '',
      chargeName: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      gst: '',
      gstPercent: '',
      jobNo: '',
      ledger: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    }
  ]);

  const [tdsCostInvoiceDTO, setTdsCostInvoiceDTO] = useState([
    {
      section: '',
      tdsWithHolding: '',
      tdsWithHoldingPer: '',
      totTdsWhAmnt: ''
    }
  ]);

  const [tdsCostErrors, setTdsCostErrors] = useState([
    {
      section: '',
      tdsWithHolding: '',
      tdsWithHoldingPer: '',
      totTdsWhAmnt: ''
    }
  ]);

  const [costInvSummaryDTO, setCostInvSummaryDTO] = useState([
    {
      actBillCurrAmt: '',
      actBillLcAmt: '',
      gstInputLcAmt: '',
      netBillCurrAmt: '',
      netBillLcAmt: '',
      roundOff: '',
      totChargesBillCurrAmt: '',
      totChargesLcAmt: ''
    }
  ]);

  const [costInvErrors, setCostInvErrors] = useState([
    {
      actBillCurrAmt: '',
      actBillLcAmt: '',
      gstInputLcAmt: '',
      netBillCurrAmt: '',
      netBillLcAmt: '',
      roundOff: '',
      totChargesBillCurrAmt: '',
      totChargesLcAmt: ''
    }
  ]);

  const listViewColumns = [
    { accessorKey: 'mode', header: 'Mode', size: 140 },
    { accessorKey: 'product', header: 'Product', size: 140 },
    { accessorKey: 'costInvoiceNo', header: 'Cost Invoice No', size: 140 },
    { accessorKey: 'purVoucherNo', header: 'Pur Voucher No', size: 140 },
    { accessorKey: 'supplierType', header: 'Supplier Type', size: 140 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getAllCostInvoiceByOrgId();
    getCostInvoiceDocId();
    getJobNoFromTmsJobCard();
    getChargeDetailsFromChargeType();
  }, []);

  useEffect(() => {
    getPartyName(formData.supplierType);
  }, [formData.supplierType]);

  const getAllCostInvoiceByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/costInvoice/getAllCostInvoiceByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.costInvoiceVO || []);
      // showForm(true);
      console.log('costInvoiceVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getCostInvoiceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/costInvoice/getCostInvoiceDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.taxInvoiceDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const getJobNoFromTmsJobCard = async () => {
    try {
      const response = await apiCalls('get', `/costInvoice/getJobNoFromTmsJobCard?orgId=${orgId}`);
      setJobNoList(response.paramObjectsMap.jobNo);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const getChargeDetailsFromChargeType = async (type) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getChargeDetailsFromChargeType?orgId=${orgId}`);
      setChargeCode(response.paramObjectsMap.chargeDetails);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllCostInvoiceById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/costInvoice/getAllCostInvoiceById?id=${row.original.id}`);

      if (result) {
        const costVO = result.paramObjectsMap.costInvoiceVO[0];
        setEditId(row.original.id);

        setFormData({
          accuralid: costVO.accuralid,
          address: costVO.address,
          branch: costVO.branch,
          branchCode: costVO.branchCode,
          client: costVO.client,
          costInvoiceDate: costVO.costInvoiceDate ? dayjs(costVO.costInvoiceDate) : dayjs(),
          costInvoiceNo: costVO.costInvoiceNo,
          costType: costVO.costType,
          createdBy: loginUserName,
          creditDays: costVO.creditDays,
          currency: costVO.currency,
          customer: costVO.customer,
          dueDate: costVO.dueDate ? dayjs(costVO.dueDate) : dayjs(),
          docDate: costVO.docDate ? dayjs(costVO.docDate) : dayjs(),
          docId: costVO.docId,
          exRate: costVO.exRate,
          finYear: finYear,
          gstType: costVO.gstType,
          mode: costVO.mode,
          orgId: orgId,
          otherInfo: costVO.otherInfo,
          payment: costVO.payment,
          product: costVO.product,
          purVoucherDate: costVO.purVoucherDate ? dayjs(costVO.purVoucherDate) : dayjs(),
          purVoucherNo: costVO.purVoucherNo,
          remarks: costVO.remarks,
          shipperRefNo: costVO.shipperRefNo,
          supplierBillNo: costVO.supplierBillNo,
          supplierCode: costVO.supplierCode,
          supplierGstIn: costVO.supplierGstIn,
          supplierGstInCode: costVO.supplierGstInCode,
          supplierName: costVO.supplierName,
          supplierPlace: costVO.supplierPlace,
          supplierType: costVO.supplierType,
          // tdsCostInvoiceDTO: costVO.tdsCostInvoiceVO,
          utrRef: costVO.utrRef
        });
        setChargerCostInvoice(
          costVO.chargerCostInvoiceVO.map((row) => ({
            id: row.id,
            billAmt: row.billAmt,
            chargeCode: row.chargeCode,
            chargeLedger: row.chargeLedger,
            chargeName: row.chargeName,
            // contType: row.contType,
            currency: row.currency,
            exRate: row.exRate,
            fcAmt: row.fcAmt,
            sac: row.sac,
            gst: row.gst,
            // houseNo: row.houseNo,
            jobNo: row.jobNo,
            lcAmt: row.lcAmt
            // subJobNo: row.subJobNo
          }))
        );
        setCostInvSummaryDTO(
          costVO.costInvSummaryVO.map((row) => ({
            id: row.id,
            actBillCurrAmt: row.actBillCurrAmt,
            actBillLcAmt: row.actBillLcAmt,
            gstInputLcAmt: row.gstInputLcAmt,
            netBillCurrAmt: row.netBillCurrAmt,
            netBillLcAmt: row.netBillLcAmt,
            roundOff: row.roundOff,
            totChargesBillCurrAmt: row.totChargesBillCurrAmt,
            totChargesLcAmt: row.totChargesLcAmt
          }))
        );
        setTdsCostInvoiceDTO(
          costVO.tdsCostInvoiceVO.map((row) => ({
            id: row.id,
            section: row.section,
            tdsWithHolding: row.tdsWithHolding,
            tdsWithHoldingPer: row.tdsWithHoldingPer,
            totTdsWhAmnt: row.totTdsWhAmnt
          }))
        );

        console.log('DataToEdit', costVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPartyName = async (partType) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${partType}`);
      setPartyName(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleInputChange = (e, fieldType, index) => {
    const { name, value } = e.target;

    if (fieldType === 'tdsCostInvoiceDTO') {
      setTdsCostInvoiceDTO((prevData) => prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
    } else if (fieldType === 'costInvSummaryDTO') {
      setCostInvSummaryDTO((prevData) => prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
    } else {
      // Directly update formData here
      setFormData({
        ...formData,
        [name]: value.toUpperCase() // Example: converting text to uppercase
      });

      setFieldErrors({
        ...fieldErrors,
        [name]: '' // Clear any field errors
      });
    }
  };

  const handleSelectPartyChange = (e) => {
    const value = e.target.value;

    partyName.forEach((emp, index) => {
      console.log(`Employee ${index}:`, emp);
    });

    const selectedEmp = partyName.find((emp) => emp.partyName === value);

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        supplierName: selectedEmp.partyName,
        supplierCode: selectedEmp.partyCode
      }));
      getStateName(selectedEmp.id);
      getCurrencyAndExratesForMatchingParties(selectedEmp.partyCode);
      setPartyId(selectedEmp.id);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const getStateName = async (partId) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getPartyStateDetails?orgId=${orgId}&id=${partId}`);
      setStateName(response.paramObjectsMap.partyStateVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getCurrencyAndExratesForMatchingParties = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getCurrencyAndExratesForMatchingParties?orgId=${orgId}&partyCode=${partyCode}`);
      setExRates(response.paramObjectsMap.currencyVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleSelectStateChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);

    const selectedEmp = stateName.find((emp) => emp.stateCode === value);

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        stateCode: selectedEmp.stateCode,
        stateNo: selectedEmp.stateNo,
        recipientGSTIN: selectedEmp.recipientGSTIN
      }));

      getPlaceOfSupply(selectedEmp.stateCode);
      setStateCode(selectedEmp.stateCode);
      // getGSTType(selectedEmp.stateCode);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const handleSelectPlaceChange = (e) => {
    const value = e.target.value;

    const selectedEmp = placeOfSupply.find((emp) => emp.placeOfSupply === value);

    if (selectedEmp) {
      setFormData((prevData) => ({
        ...prevData,
        placeOfSupply: selectedEmp.placeOfSupply
      }));

      getAddessType(selectedEmp.placeOfSupply);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const getPlaceOfSupply = async (stateCode) => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPlaceOfSupply?orgId=${orgId}&id=${partyId}&stateCode=${stateCode}`);
      setPlaceOfSupply(response.paramObjectsMap.placeOfSupplyDetails);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAddessType = async (place) => {
    try {
      const response = await apiCalls(
        'get',
        `/costInvoice/getPartyAddress?orgId=${orgId}&id=${partyId}&stateCode=${stateCode}&placeOfSupply=${place}`
      );
      setAddressType(response.paramObjectsMap.partyAddress);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleCostTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      costType: type
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      costType: '' // Clear any errors for costType
    }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      accuralid: '',
      address: '',
      branch: '',
      branchCode: '',
      client: '',
      costInvoiceDate: null,
      costInvoiceNo: '',
      creditDays: '',
      currency: '',
      customer: '',
      dueDate: null,
      docDate: dayjs(),
      exRate: '',
      finYear: '',
      gstType: '',
      ipNo: '',
      latitude: '',
      mode: '',
      otherInfo: '',
      product: '',
      purVoucherDate: null,
      purVoucherNo: '',
      remarks: '',
      shipperRefNo: '',
      supplierBillNo: '',
      supplierCode: '',
      supplierGstIn: '',
      supplierGstInCode: '',
      supplierName: '',
      supplierPlace: '',
      supplierType: '',
      utrRef: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      accuralid: '',
      address: '',
      branch: '',
      branchCode: '',
      client: '',
      costInvoiceDate: null,
      costInvoiceNo: '',
      creditDays: '',
      currency: '',
      customer: '',
      dueDate: null,
      exRate: '',
      finYear: '',
      gstType: '',
      ipNo: '',
      latitude: '',
      mode: '',
      otherInfo: '',
      product: '',
      purVoucherDate: null,
      purVoucherNo: '',
      remarks: '',
      shipperRefNo: '',
      supplierBillNo: '',
      supplierCode: '',
      supplierGstIn: '',
      supplierGstInCode: '',
      supplierName: '',
      supplierPlace: '',
      supplierType: '',
      utrRef: ''
    });
    setChargerCostInvoice([
      {
        chargeCode: '',
        chargeLedger: '',
        chargeName: '',
        currency: '',
        exRate: '',
        exempted: '',
        govChargeCode: '',
        gst: '',
        gstPercent: '',
        jobNo: '',
        ledger: '',
        qty: '',
        rate: '',
        sac: '',
        taxable: ''
      }
    ]);
    setTdsCostInvoiceDTO([
      {
        section: '',
        tdsWithHolding: '',
        tdsWithHoldingPer: '',
        totTdsWhAmnt: ''
      }
    ]);
    setCostInvSummaryDTO([
      {
        actBillCurrAmt: '',
        actBillLcAmt: '',
        gstInputLcAmt: '',
        netBillCurrAmt: '',
        netBillLcAmt: '',
        roundOff: '',
        totChargesBillCurrAmt: '',
        totChargesLcAmt: ''
      }
    ]);
    setCostInvoiceErrors({});
    setCostInvErrors({});
    setTdsCostErrors({});
    setEditId({});
    getCostInvoiceDocId();
  };

  // const handleKeyDown = (e, row, table) => {
  //   if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
  //     e.preventDefault();
  //     if (isLastRowEmpty(table)) {
  //       displayRowError(table);
  //     } else {
  //       if (table === roleTableData) handleAddRow();
  //       // else handleAddRow1();
  //     }
  //   }
  // };

  const handleAddRow = () => {
    if (isLastRowEmpty(chargerCostInvoice)) {
      displayRowError(chargerCostInvoice);
      return;
    }
    const newRow = {
      id: Date.now(),
      chargeCode: '',
      chargeLedger: '',
      chargeName: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      gst: '',
      gstPercent: '',
      jobNo: '',
      ledger: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    };
    setChargerCostInvoice([...chargerCostInvoice, newRow]);
    setCostInvoiceErrors([
      ...costInvoiceErrors,
      {
        chargeCode: '',
        chargeLedger: '',
        chargeName: '',
        currency: '',
        exRate: '',
        exempted: '',
        govChargeCode: '',
        gst: '',
        gstPercent: '',
        jobNo: '',
        ledger: '',
        qty: '',
        rate: '',
        sac: '',
        taxable: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === chargerCostInvoice) {
      return (
        !lastRow.billAmt ||
        !lastRow.chargeCode ||
        !lastRow.chargeLedger ||
        !lastRow.chargeName ||
        !lastRow.currency ||
        !lastRow.exRate ||
        !lastRow.fcAmt ||
        !lastRow.sac ||
        !lastRow.gst ||
        !lastRow.houseNo ||
        !lastRow.jobNo ||
        !lastRow.lcAmt ||
        !lastRow.subJobNo
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === chargerCostInvoice) {
      setCostInvoiceErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          billAmt: !table[table.length - 1].billAmt ? 'Bill Amt is required' : '',
          chargeCode: !table[table.length - 1].chargeCode ? 'Charge Code is required' : '',
          chargeLedger: !table[table.length - 1].chargeLedger ? 'Charge Ledger is required' : '',
          chargeName: !table[table.length - 1].chargeName ? 'Charge Name is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'EX Rate is required' : '',
          fcAmt: !table[table.length - 1].fcAmt ? 'FC Amt is required' : '',
          sac: !table[table.length - 1].sac ? 'SAC is required' : '',
          gst: !table[table.length - 1].gst ? 'GST is required' : '',
          // houseNo: !table[table.length - 1].houseNo ? 'House No is required' : '',
          jobNo: !table[table.length - 1].jobNo ? 'Job No is required' : '',
          lcAmt: !table[table.length - 1].lcAmt ? 'LC Amt is required' : ''
          // subJobNo: !table[table.length - 1].subJobNo ? 'Sub Job No is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    console.log('save clicked');

    const errors = {};
    if (!formData.accuralid) {
      errors.accuralid = 'Accural ID is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    // if (!formData.costInvoiceDate) {
    //   errors.costInvoiceDate = 'Cost Invoice Date is required';
    // }
    // if (!formData.costInvoiceNo) {
    //   errors.costInvoiceNo = 'Cost Invoice No is required';
    // }
    if (!formData.creditDays) {
      errors.creditDays = 'Credit Days is required';
    }
    if (!formData.currency) {
      errors.currency = 'currency is required';
    }
    // if (!formData.dueDate) {
    //   errors.dueDate = 'Due Date is required';
    // }
    if (!formData.exRate) {
      errors.exRate = 'Ex Rate is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'GST Type is required';
    }
    if (!formData.mode) {
      errors.mode = 'Mode is required';
    }
    if (!formData.payment) {
      errors.payment = 'Payment is required';
    }
    // if (!formData.product) {
    //   errors.product = 'Product is required';
    // }
    if (!formData.purVoucherDate) {
      errors.purVoucherDate = 'Pur Voucher Date is required';
    }
    if (!formData.purVoucherNo) {
      errors.purVoucherNo = 'Pur Voucher No is required';
    }
    if (!formData.shipperRefNo) {
      errors.shipperRefNo = 'Shipper Ref No is required';
    }
    if (!formData.supplierBillNo) {
      errors.supplierBillNo = 'Supplier Bill No is required';
    }
    if (!formData.supplierCode) {
      errors.supplierCode = 'Supplier Code is required';
    }
    if (!formData.supplierGstIn) {
      errors.supplierGstIn = 'Supplier Gst In is required';
    }
    if (!formData.supplierGstInCode) {
      errors.supplierGstInCode = 'Supplier GstInCode is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.supplierPlace) {
      errors.supplierPlace = 'Supplier Place is required';
    }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }
    if (!formData.utrRef) {
      errors.utrRef = 'UTR Ref is required';
    }

    let CostInvoiceValid = true;
    const newTableErrors = chargerCostInvoice.map((row) => {
      const rowErrors = {};
      // if (!row.billAmt) {
      //   rowErrors.billAmt = 'Account Name is required';
      //   CostInvoiceValid = false;
      // }
      if (!row.chargeCode) {
        rowErrors.chargeCode = 'Charge Code is required';
        CostInvoiceValid = false;
      }
      if (!row.chargeLedger) {
        rowErrors.chargeLedger = 'Charge Ledger is required';
        CostInvoiceValid = false;
      }
      if (!row.chargeName) {
        rowErrors.chargeName = 'Charge Name is required';
        CostInvoiceValid = false;
      }
      if (!row.currency) {
        rowErrors.currency = 'Currency is required';
        CostInvoiceValid = false;
      }
      if (!row.exRate) {
        rowErrors.exRate = 'EX Rate is required';
        CostInvoiceValid = false;
      }
      if (!row.fcAmt) {
        rowErrors.fcAmt = 'FC Amt is required';
        CostInvoiceValid = false;
      }
      if (!row.sac) {
        rowErrors.sac = 'SAC is required';
        CostInvoiceValid = false;
      }
      if (!row.gst) {
        rowErrors.gst = 'GST is required';
        CostInvoiceValid = false;
      }
      // if (!row.houseNo) {
      //   rowErrors.houseNo = 'House No is required';
      //   CostInvoiceValid = false;
      // }
      if (!row.jobNo) {
        rowErrors.jobNo = 'Job No is required';
        CostInvoiceValid = false;
      }
      if (!row.lcAmt) {
        rowErrors.lcAmt = 'LC Amt is required';
        CostInvoiceValid = false;
      }
      // if (!row.subJobNo) {
      //   rowErrors.subJobNo = 'Sub Job No is required';
      //   CostInvoiceValid = false;
      // }

      return rowErrors;
    });
    setFieldErrors(errors);

    setCostInvoiceErrors(newTableErrors);

    let tdsValid = true;
    const tdsTableErrors = tdsCostInvoiceDTO.map((row) => {
      const rowErrors = {};
      if (!row.section) {
        rowErrors.section = 'Section is required';
        tdsValid = false;
      }
      if (!row.tdsWithHolding) {
        rowErrors.tdsWithHolding = 'TdsWithHolding is required';
        tdsValid = false;
      }
      if (!row.tdsWithHoldingPer) {
        rowErrors.tdsWithHoldingPer = 'TdsWithHolding% is required';
        tdsValid = false;
      }
      if (!row.totTdsWhAmnt) {
        rowErrors.totTdsWhAmnt = 'Tot Tds Amount is required';
        tdsValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setTdsCostErrors(tdsTableErrors);

    let summaryValid = true;
    const summaryTableErrors = costInvSummaryDTO.map((row) => {
      const rowErrors = {};
      if (!row.actBillCurrAmt) {
        rowErrors.actBillCurrAmt = 'Act Bill Amt.(Bill Curr) is required';
        summaryValid = false;
      }
      if (!row.actBillLcAmt) {
        rowErrors.actBillLcAmt = 'Act Bill Amt.(LC) is required';
        summaryValid = false;
      }
      if (!row.gstInputLcAmt) {
        rowErrors.gstInputLcAmt = 'GST Input Amt(LC) is required';
        summaryValid = false;
      }
      if (!row.netBillCurrAmt) {
        rowErrors.netBillCurrAmt = 'Net Amt.(Bill Curr) is required';
        summaryValid = false;
      }
      if (!row.netBillLcAmt) {
        rowErrors.netBillLcAmt = 'Net Amt.(LC) is required';
        summaryValid = false;
      }
      if (!row.roundOff) {
        rowErrors.roundOff = 'Round Off is required';
        summaryValid = false;
      }
      if (!row.totChargesBillCurrAmt) {
        rowErrors.totChargesBillCurrAmt = 'Tot. Charge Amt.(Bill Curr) is required';
        summaryValid = false;
      }
      if (!row.totChargesLcAmt) {
        rowErrors.totChargesLcAmt = 'Tot. Charge Amt.(LC) is required';
        summaryValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setCostInvErrors(summaryTableErrors);

    if (Object.keys(errors).length === 0 && CostInvoiceValid) {
      console.log('try called');
      const costVO = chargerCostInvoice.map((row) => ({
        ...(editId && { id: row.id }),
        billAmt: row.billAmt,
        chargeCode: row.chargeCode,
        chargeLedger: row.chargeLedger,
        chargeName: row.chargeName,
        currency: row.currency,
        exRate: row.exRate,
        fcAmt: row.fcAmt,
        sac: row.sac,
        gst: row.gst,
        jobNo: row.jobNo,
        lcAmt: row.lcAmt
      }));
      const costSummaryVO = costInvSummaryDTO.map((row) => ({
        ...(editId && { id: row.id }),
        actBillCurrAmt: row.actBillCurrAmt,
        actBillLcAmt: row.actBillLcAmt,
        gstInputLcAmt: row.gstInputLcAmt,
        netBillCurrAmt: row.netBillCurrAmt,
        netBillLcAmt: row.netBillLcAmt,
        roundOff: row.roundOff,
        totChargesBillCurrAmt: row.totChargesBillCurrAmt,
        totChargesLcAmt: row.totChargesLcAmt
      }));
      const tdsVO = tdsCostInvoiceDTO.map((row) => ({
        ...(editId && { id: row.id }),
        section: row.section,
        tdsWithHolding: row.tdsWithHolding,
        tdsWithHoldingPer: row.tdsWithHoldingPer,
        totTdsWhAmnt: row.totTdsWhAmnt
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        accuralid: formData.accuralid,
        address: formData.address,
        branch: branch,
        branchCode: branchCode,
        client: formData.client,
        chargerCostInvoiceDTO: costVO,
        costInvSummaryDTO: costSummaryVO,
        costInvoiceDate: dayjs(formData.costInvoiceDate).format('YYYY-MM-DD'),
        costInvoiceNo: formData.costInvoiceNo,
        costType: formData.costType,
        createdBy: loginUserName,
        creditDays: formData.creditDays,
        currency: formData.currency,
        customer: formData.customer,
        dueDate: dayjs(formData.dueDate).format('YYYY-MM-DD'),
        exRate: formData.exRate,
        finYear: finYear,
        gstType: formData.gstType,
        mode: formData.mode,
        orgId: orgId,
        otherInfo: formData.otherInfo,
        payment: formData.payment,
        product: formData.product,
        purVoucherDate: dayjs(formData.purVoucherDate).format('YYYY-MM-DD'),
        purVoucherNo: formData.purVoucherNo,
        remarks: formData.remarks,
        shipperRefNo: formData.shipperRefNo,
        supplierBillNo: formData.supplierBillNo,
        supplierCode: formData.supplierCode,
        supplierGstIn: formData.supplierGstIn,
        supplierGstInCode: formData.supplierGstInCode,
        supplierName: formData.supplierName,
        supplierPlace: formData.supplierPlace,
        supplierType: formData.supplierType,
        tdsCostInvoiceDTO: tdsVO,
        utrRef: formData.utrRef
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/costInvoice/updateCreateCostInvoice`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Cost Invoice Updated Successfully' : 'Cost Invoice Created successfully');
          getAllCostInvoiceByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Cost Invoice Creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Cost Invoice creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    // label="Document Id"
                    label="Cost Invoice No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        // label="Document Date"
                        label="Cost Invoice Date"
                        value={formData.docDate}
                        onChange={(date) => handleDateChange('docDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" variant="outlined" error={!!fieldErrors.mode}>
                    <InputLabel id="mode-label">Mode</InputLabel>
                    <Select labelId="mode-label" label="Select Mode" name="mode" value={formData.mode} onChange={handleInputChange}>
                      <MenuItem value="SUBMIT">Submit</MenuItem>
                      <MenuItem value="EDIT">Edit</MenuItem>
                    </Select>
                    {fieldErrors.mode && <FormHelperText style={{ color: 'red' }}>{fieldErrors.mode}</FormHelperText>}
                  </FormControl>
                </div>
                {/* <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" variant="outlined" error={!!fieldErrors.product}>
                    <InputLabel id="product">Product</InputLabel>
                    <Select labelId="product" label="Select product" name="product" value={formData.product} onChange={handleInputChange}>
                      <MenuItem value="SO">SO</MenuItem>
                      <MenuItem value="AO">AO</MenuItem>
                    </Select>
                    {fieldErrors.product && <FormHelperText style={{ color: 'red' }}>{fieldErrors.product}</FormHelperText>}
                  </FormControl>
                </div> */}

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Pur Voucher No"
                      size="small"
                      name="purVoucherNo"
                      inputProps={{ maxLength: 30 }}
                      value={formData.purVoucherNo}
                      onChange={handleInputChange}
                      error={!!fieldErrors.purVoucherNo}
                      helperText={fieldErrors.purVoucherNo}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Purchase Voucher Date"
                        value={formData.purVoucherDate}
                        onChange={(date) => handleDateChange('purVoucherDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.purVoucherDate && <p className="dateErrMsg">Pur Voucher Date is required</p>}
                  </FormControl>
                </div>

                {/* <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Cost Invoice No"
                      size="small"
                      name="costInvoiceNo"
                      inputProps={{ maxLength: 30 }}
                      value={formData.costInvoiceNo}
                      onChange={handleInputChange}
                      error={!!fieldErrors.costInvoiceNo}
                      helperText={fieldErrors.costInvoiceNo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Cost Invoice Date"
                        value={formData.costInvoiceDate}
                        onChange={(date) => handleDateChange('costInvoiceDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.costInvoiceDate && <p className="dateErrMsg">Cost Invoice Date is required</p>}
                  </FormControl>
                </div> */}

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Supplier Type</InputLabel>
                    <Select
                      labelId="supplierTypeLabel"
                      value={formData.supplierType}
                      name="supplierType"
                      onChange={handleInputChange}
                      label="Supplier Type"
                      error={!!fieldErrors.supplierType}
                      helperText={fieldErrors.supplierType}
                    >
                      <MenuItem value="VENDOR">Vendor</MenuItem>
                    </Select>
                    {fieldErrors.supplierType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierType}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label-party">Supplier Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-party"
                      id="demo-simple-select-party"
                      label="Supplier Name"
                      required
                      value={formData.supplierName}
                      onChange={handleSelectPartyChange}
                      error={!!fieldErrors.supplierName}
                      helperText={fieldErrors.supplierName}
                    >
                      {partyName &&
                        partyName.map((par, index) => (
                          <MenuItem key={index} value={par.partyName}>
                            {par.partyName} {/* Display employee code */}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.supplierName && <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierName}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Supplier Code"
                      size="small"
                      name="supplierCode"
                      disabled
                      inputProps={{ maxLength: 30 }}
                      value={formData.supplierCode}
                      onChange={handleInputChange}
                      error={!!fieldErrors.supplierCode}
                      helperText={fieldErrors.supplierCode}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label" required>
                      State Code
                    </InputLabel>
                    <Select
                      labelId="addressTypeLabel"
                      value={formData.stateCode}
                      onChange={handleSelectStateChange}
                      label="State Code"
                      required
                      // error={!!errors.stateCode}
                      // helperText={errors.stateCode}
                    >
                      {stateName?.length > 0 ? (
                        stateName.map((par, index) => (
                          <MenuItem key={index} value={par.stateCode}>
                            {par.stateCode}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No states available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Supplier Place</InputLabel>
                    <Select
                      labelId="supplierPlace"
                      label="supplierPlace"
                      value={formData.supplierPlace}
                      name="supplierPlace"
                      onChange={handleSelectPlaceChange}
                      error={!!fieldErrors.supplierPlace}
                      helperText={fieldErrors.supplierPlace}
                    >
                      {placeOfSupply &&
                        placeOfSupply.map((par, index) => (
                          <MenuItem key={index} value={par.placeOfSupply}>
                            {par.placeOfSupply}
                          </MenuItem>
                        ))}
                      {/* <MenuItem value="PUNE">PUNE</MenuItem>
                      <MenuItem value="CHENNAI">CHENNAI</MenuItem> */}
                    </Select>
                    {fieldErrors.supplierPlace && <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierPlace}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Supplier Bill No"
                      size="small"
                      name="supplierBillNo"
                      inputProps={{ maxLength: 30 }}
                      value={formData.supplierBillNo}
                      onChange={handleInputChange}
                      error={!!fieldErrors.supplierBillNo}
                      helperText={fieldErrors.supplierBillNo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Supplier GST State Code</InputLabel>
                    <Select
                      labelId="supplierGSTCode"
                      name="supplierGstInCode"
                      value={formData.supplierGstInCode}
                      onChange={handleInputChange}
                      label="Supplier GST Code"
                      error={!!fieldErrors.supplierGstInCode}
                      helperText={fieldErrors.supplierGstInCode}
                    >
                      <MenuItem value="TN">TN</MenuItem>
                      <MenuItem value="GJ">GJ</MenuItem>
                    </Select>
                    {fieldErrors.supplierGstInCode && (
                      <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierGstInCode}</FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Supplier GSTIN"
                      size="small"
                      name="supplierGstIn"
                      inputProps={{ maxLength: 30 }}
                      value={formData.supplierGstIn}
                      onChange={handleInputChange}
                      error={!!fieldErrors.supplierGstIn}
                      helperText={fieldErrors.supplierGstIn}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Address"
                      name="address"
                      size="small"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.address}
                      onChange={handleInputChange}
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                    <InputLabel id="demo-simple-select-label">
                      {
                        <span>
                          Currency <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Currency"
                      onChange={handleInputChange}
                      name="currency"
                      value={formData.currency}
                    >
                      {currencies &&
                        currencies.map((item) => (
                          <MenuItem key={item.id} value={item.currency}>
                            {item.currency}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="ExRate"
                      name="exRate"
                      size="small"
                      type="number"
                      inputProps={{ maxLength: 30 }}
                      value={formData.exRate}
                      onChange={handleInputChange}
                      error={!!fieldErrors.exRate}
                      helperText={fieldErrors.exRate}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Credit Days"
                      size="small"
                      type="number"
                      name="creditDays"
                      inputProps={{ maxLength: 30 }}
                      value={formData.creditDays}
                      onChange={handleInputChange}
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
                        disabled
                        value={formData.dueDate}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.dueDate && <p className="dateErrMsg">Due Date is required</p>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Shipper RefNo"
                      size="small"
                      name="shipperRefNo"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.shipperRefNo}
                      onChange={handleInputChange}
                      error={!!fieldErrors.shipperRefNo}
                      helperText={fieldErrors.shipperRefNo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Other Info"
                      size="small"
                      name="otherInfo"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.otherInfo}
                      onChange={handleInputChange}
                      error={!!fieldErrors.otherInfo}
                      helperText={fieldErrors.otherInfo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">GST Type</InputLabel>
                    <Select
                      labelId="gstType"
                      name="gstType"
                      value={formData.gstType}
                      onChange={handleInputChange}
                      label="GST Type"
                      error={!!fieldErrors.gstType}
                      helperText={fieldErrors.gstType}
                    >
                      <MenuItem value="INTER">INTER</MenuItem>
                      <MenuItem value="INTRA">INTRA</MenuItem>
                    </Select>
                    {fieldErrors.gstType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Payment</InputLabel>
                    <Select
                      labelId="payment"
                      value={formData.payment}
                      onChange={handleInputChange}
                      label="Payment"
                      name="payment"
                      error={!!fieldErrors.payment}
                      helperText={fieldErrors.payment}
                    >
                      <MenuItem value="YETTOPAY">Yet to Pay</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                    </Select>
                    {fieldErrors.payment && <FormHelperText style={{ color: 'red' }}>{fieldErrors.payment}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Accrual ID"
                      size="small"
                      name="accuralid"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.accuralid}
                      onChange={handleInputChange}
                      error={!!fieldErrors.accuralid}
                      helperText={fieldErrors.accuralid}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="UTR Reference"
                      size="small"
                      name="utrRef"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.utrRef}
                      onChange={handleInputChange}
                      error={!!fieldErrors.utrRef}
                      helperText={fieldErrors.utrRef}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Remarks"
                      size="small"
                      name="remarks"
                      multiline
                      inputProps={{ maxLength: 30 }}
                      value={formData.remarks}
                      onChange={handleInputChange}
                      error={!!fieldErrors.remarks}
                      helperText={fieldErrors.remarks}
                    />
                  </FormControl>
                </div>
                {/* <div className="col-md-5 mb-3">
                  <div className="d-flex flex-row">
                    <FormLabel className="me-3" style={{ marginTop: 10 }}>
                      Cost Type
                    </FormLabel>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.costType === 'Regular'}
                          onChange={(e) => handleCostTypeChange('Regular')}
                          name="Regular"
                          color="primary"
                        />
                      }
                      label="Regular"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.costType === 'Accrual'}
                          onChange={(e) => handleCostTypeChange('Accrual')}
                          name="Accrual"
                          color="primary"
                        />
                      }
                      label="Accrual"
                    />
                  </div>
                </div> */}
              </div>
              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Master/House Charges" />
                    <Tab value={1} label="TDS" />
                    <Tab value={2} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                {/* <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Bill Amount</th>
                                    <th className="table-header">Charge Code</th>
                                    <th className="table-header">Charge Ledger</th>
                                    <th className="table-header">Charge Name</th>
                                    <th className="table-header">Cont Type</th>
                                    <th className="table-header">Currency</th>
                                    <th className="table-header">EX Rate</th>
                                    <th className="table-header">FC Amount</th>
                                    <th className="table-header">GSAC</th>
                                    <th className="table-header">GST</th>
                                    <th className="table-header">House No</th>
                                    <th className="table-header">Job No</th>
                                    <th className="table-header">LC Amount</th>
                                    <th className="table-header">Sub Job No</th>
                                  </tr>
                                </thead> */}
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="table-header" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header">Job No</th>
                                    <th className="table-header">Charge Code</th>
                                    <th className="table-header">GCharge Code</th>
                                    <th className="table-header">Charge Name</th>
                                    <th className="table-header">Taxable</th>
                                    <th className="table-header">Qty</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">Currency</th>
                                    <th className="table-header">Ex Rate</th>
                                    <th className="table-header">FC Amount</th>
                                    <th className="table-header">LC Amount</th>
                                    <th className="table-header">Bill Amount</th>
                                    <th className="table-header">SAC</th>
                                    <th className="table-header">GST %</th>
                                    <th className="table-header">GST</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chargerCostInvoice.map((row, index) => (
                                    // <tr key={row.id}>
                                    //   <td className="border px-2 py-2 text-center">
                                    //     <ActionButton
                                    //       title="Delete"
                                    //       icon={DeleteIcon}
                                    //       onClick={() =>
                                    //         handleDeleteRow(
                                    //           row.id,
                                    //           chargerCostInvoice,
                                    //           setChargerCostInvoice,
                                    //           costInvoiceErrors,
                                    //           setCostInvoiceErrors
                                    //         )
                                    //       }
                                    //     />
                                    //   </td>
                                    //   <td className="text-center">
                                    //     <div className="pt-2">{index + 1}</div>
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="number"
                                    //       value={row.billAmt}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, billAmt: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             billAmt: !value ? 'Bill Amt is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.billAmt ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.billAmt && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].billAmt}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.chargeCode}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, chargeCode: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             chargeCode: !value ? 'Charge Code is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.chargeCode && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].chargeCode}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.chargeLedger}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, chargeLedger: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             chargeLedger: !value ? 'Charge Ledger is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.chargeLedger ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.chargeLedger && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].chargeLedger}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.chargeName}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, chargeName: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             chargeName: !value ? 'Charge Name is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.chargeName ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.chargeName && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].chargeName}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.contType}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, contType: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             contType: !value ? 'Cont Type is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.contType ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.contType && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].contType}
                                    //       </div>
                                    //     )}
                                    //   </td>

                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="number"
                                    //       value={row.exRate}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             exRate: !value ? 'EX Rate is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.exRate ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.exRate && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].exRate}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="number"
                                    //       value={row.fcAmt}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, fcAmt: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             fcAmt: !value ? 'FC Amt is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.fcAmt ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.fcAmt && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].fcAmt}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <select
                                    //       value={row.currency}
                                    //       style={{ width: '150px' }}
                                    //       className={costInvoiceErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                    //       onChange={(e) =>
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, currency: e.target.value } : r))
                                    //         )
                                    //       }
                                    //     >
                                    //       <option value="">-- Select --</option>
                                    //       {currencies.map((item) => (
                                    //         <option key={item.id} value={item.currency}>
                                    //           {item.currency}
                                    //         </option>
                                    //       ))}
                                    //     </select>
                                    //     {costInvoiceErrors[index]?.currency && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].currency}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.sac}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) => prev.map((r) => (r.id === row.id ? { ...r, sac: value } : r)));
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             sac: !value ? 'GSAC is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.sac ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.sac && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].sac}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="number"
                                    //       value={row.gst}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) => prev.map((r) => (r.id === row.id ? { ...r, gst: value } : r)));
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             gst: !value ? 'GST is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.gst ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.gst && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].gst}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.houseNo}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, houseNo: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             houseNo: !value ? 'House No is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.houseNo ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.houseNo && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].houseNo}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.jobNo}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, jobNo: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             jobNo: !value ? 'Job No is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.jobNo ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.jobNo && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].jobNo}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="number"
                                    //       value={row.lcAmt}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, lcAmt: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             lcAmt: !value ? 'LC Amt is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.lcAmt ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.lcAmt && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].lcAmt}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.subJobNo}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, subJobNo: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             subJobNo: !value ? 'Sub Job No is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.subJobNo ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.subJobNo && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].subJobNo}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    //   <td className="border px-2 py-2">
                                    //     <input
                                    //       type="text"
                                    //       value={row.subJobNo}
                                    //       style={{ width: '150px' }}
                                    //       onChange={(e) => {
                                    //         const value = e.target.value;
                                    //         setChargerCostInvoice((prev) =>
                                    //           prev.map((r) => (r.id === row.id ? { ...r, subJobNo: value } : r))
                                    //         );
                                    //         setCostInvoiceErrors((prev) => {
                                    //           const newErrors = [...prev];
                                    //           newErrors[index] = {
                                    //             ...newErrors[index],
                                    //             subJobNo: !value ? 'Sub Job No is required' : ''
                                    //           };
                                    //           return newErrors;
                                    //         });
                                    //       }}
                                    //       className={costInvoiceErrors[index]?.subJobNo ? 'error form-control' : 'form-control'}
                                    //     />
                                    //     {costInvoiceErrors[index]?.subJobNo && (
                                    //       <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    //         {costInvoiceErrors[index].subJobNo}
                                    //       </div>
                                    //     )}
                                    //   </td>
                                    // </tr>

                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              chargerCostInvoice,
                                              setChargerCostInvoice,
                                              costInvoiceErrors,
                                              setCostInvoiceErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.jobNo}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const selectedJobNo = e.target.value;
                                            const selectedCurrencyData = jobNoList.find((currency) => currency.jobNo === selectedJobNo);
                                            const updatedJobNoData = [...chargerCostInvoice];
                                            updatedJobNoData[index] = {
                                              ...updatedJobNoData[index],
                                              jobNo: selectedJobNo
                                            };
                                            setChargerCostInvoice(updatedJobNoData);
                                            // getChargeDetailsFromChargeType(e.target.value);
                                          }}
                                          className={costInvoiceErrors[index]?.jobNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">--Select--</option>
                                          {jobNoList &&
                                            jobNoList.map((currency) => (
                                              <option key={currency.id} value={currency.jobNo}>
                                                {currency.jobNo}
                                              </option>
                                            ))}
                                        </select>

                                        {costInvoiceErrors[index]?.jobNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].jobNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.chargeCode}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const selectedCurrency = e.target.value;
                                            const selectedCurrencyData = chargeCode.find(
                                              (currency) => currency.chargeCode === selectedCurrency
                                            );
                                            const updatedCurrencyData = [...chargerCostInvoice];
                                            updatedCurrencyData[index] = {
                                              ...updatedCurrencyData[index],
                                              chargeCode: selectedCurrency,
                                              gstPercent: selectedCurrencyData ? selectedCurrencyData.GSTPercent : '',
                                              ccFeeApplicable: selectedCurrencyData ? selectedCurrencyData.ccFeeApplicable : '',
                                              chargeName: selectedCurrencyData ? selectedCurrencyData.chargeName : '',
                                              exempted: selectedCurrencyData ? selectedCurrencyData.exempted : '',
                                              govChargeCode: selectedCurrencyData ? selectedCurrencyData.govChargeCode : '',
                                              ledger: selectedCurrencyData ? selectedCurrencyData.ledger : '',
                                              sac: selectedCurrencyData ? selectedCurrencyData.sac : '',
                                              taxable: selectedCurrencyData ? selectedCurrencyData.taxable : ''
                                            };

                                            setChargerCostInvoice(updatedCurrencyData);
                                          }}
                                          className={costInvoiceErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">--Select--</option>
                                          {chargeCode?.map((currency, index) => (
                                            <option key={index} value={currency.chargeCode}>
                                              {currency.chargeCode}
                                            </option>
                                          ))}
                                        </select>
                                        {costInvoiceErrors[index]?.chargeCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].chargeCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.govChargeCode}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, govChargeCode: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  govChargeCode: !value ? 'GOV Charge Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  govChargeCode: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.govChargeCode ? 'error form-control' : 'form-control'}
                                        />
                                        {costInvoiceErrors[index]?.govChargeCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].govChargeCode}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.chargeName}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, chargeName: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeName: !value ? 'chargeName is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  chargeName: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.chargeName ? 'error form-control' : 'form-control'}
                                        />
                                        {costInvoiceErrors[index]?.chargeName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].chargeName}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.taxable}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxable: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxable: !value ? 'taxable is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxable: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.taxable ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.taxable && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].taxable}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qty}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  qty: !value ? 'qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  qty: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].qty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.rate}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: !value ? 'rate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.rate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].rate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.currency}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const selectedCurrency = e.target.value;
                                            const selectedCurrencyData = currencies.find(
                                              (currency) => currency.currency === selectedCurrency
                                            );

                                            const updatedCurrencyData = [...chargerCostInvoice];
                                            updatedCurrencyData[index] = {
                                              ...updatedCurrencyData[index],
                                              currency: selectedCurrency,
                                              exRate: selectedCurrencyData.buyingExRate,
                                              fcAmount: selectedCurrency === 'INR' ? 0 : row.qty * row.rate,
                                              lcAmount:
                                                (Number(row.qty) || 0) *
                                                (Number(row.rate) || 0) *
                                                (Number(selectedCurrencyData.buyingExRate) || 0),
                                              billAmt:
                                                ((Number(row.qty) || 0) *
                                                  (Number(row.rate) || 0) *
                                                  (Number(selectedCurrencyData.buyingExRate) || 0)) /
                                                selectedCurrencyData.buyingExRate,
                                              gst:
                                                ((Number(row.qty) || 0) *
                                                  (Number(row.rate) || 0) *
                                                  (Number(selectedCurrencyData.buyingExRate) || 0) *
                                                  row.gstPercent) /
                                                100
                                            };

                                            setChargerCostInvoice(updatedCurrencyData);
                                          }}
                                          className={costInvoiceErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">--Select--</option>
                                          {exRates &&
                                            exRates.map((currency) => (
                                              <option key={currency.id} value={currency.currency}>
                                                {currency.currency}
                                              </option>
                                            ))}
                                        </select>
                                        {costInvoiceErrors[index]?.currency && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].currency}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.exRate}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], exRate: !value ? 'exRate is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  exRate: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.exRate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.exRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].exRate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.fcAmount ? row.fcAmount.toFixed(2) : '0'}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, fcAmount: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], fcAmount: !value ? 'fcAmount is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  fcAmount: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.fcAmount ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.fcAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].fcAmount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.lcAmount ? row.lcAmount.toFixed(2) : '0'}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, lcAmount: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lcAmount: !value ? 'lcAmount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  lcAmount: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.lcAmount ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.lcAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].lcAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.billAmt ? row.billAmt.toFixed(2) : '0.00'}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, billAmt: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], billAmt: !value ? 'Settled is required' : '' };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  billAmt: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.billAmt ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.billAmt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].billAmt}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sac}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sac: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sac: !value ? 'sac is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sac: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.sac ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.sac && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].sac}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gstPercent}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gstPercent: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstPercent: !value ? 'GST Percent is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gstPercent: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.gstPercent ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.gstPercent && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].gstPercent}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.gst ? row.gst.toFixed(2) : '0.00'}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const numericRegex = /^[0-9]*$/;
                                            if (numericRegex.test(value)) {
                                              setChargerCostInvoice((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, gst: value } : r))
                                              );
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gst: !value ? 'GST is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            } else {
                                              setCostInvoiceErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  gst: 'Only numeric characters are allowed'
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={costInvoiceErrors[index]?.gst ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                        />
                                        {costInvoiceErrors[index]?.gst && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {costInvoiceErrors[index].gst}
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
                    </>
                  )}
                  {value === 1 && (
                    <>
                      {tdsCostInvoiceDTO.map((row, index) => (
                        <div className="row mt-3">
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <InputLabel id="demo-simple-select-label">TDS / WH</InputLabel>
                              <Select
                                labelId="tds/wh"
                                name="tdsWithHolding"
                                value={tdsCostInvoiceDTO[index]?.tdsWithHolding || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                label="TDS / WH"
                                required
                                error={!!tdsCostErrors[index]?.tdsWithHolding}
                              >
                                <MenuItem value="NO">NO</MenuItem>
                                <MenuItem value="NORMAL">NORMAL</MenuItem>
                                <MenuItem value="SPECIAL">SPECIAL</MenuItem>
                              </Select>
                              <FormHelperText error>{tdsCostErrors[index]?.tdsWithHolding}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="TDS / WH %"
                                size="small"
                                name="tdsWithHoldingPer"
                                type="number"
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.tdsWithHoldingPer || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.tdsWithHoldingPer}
                                helperText={tdsCostErrors[index]?.tdsWithHoldingPer || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="Section"
                                size="small"
                                name="section"
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.section || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.section}
                                helperText={tdsCostErrors[index]?.section}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="Tot TDS/WH Amt"
                                size="small"
                                name="totTdsWhAmnt"
                                type="number"
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.totTdsWhAmnt || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.totTdsWhAmnt}
                                helperText={tdsCostErrors[index]?.totTdsWhAmnt}
                              />
                            </FormControl>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {value === 2 && (
                    <>
                      {costInvSummaryDTO.map((row, index) => (
                        <div className="row mt-2">
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Tot. Charge Amt.(Bill Curr)"
                                name="totChargesBillCurrAmt"
                                value={costInvSummaryDTO[index]?.totChargesBillCurrAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.totChargesBillCurrAmt}
                                helperText={costInvErrors[index]?.totChargesBillCurrAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Act Bill Amt.(Bill Curr)"
                                name="actBillCurrAmt"
                                value={costInvSummaryDTO[index]?.actBillCurrAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.actBillCurrAmt}
                                helperText={costInvErrors[index]?.actBillCurrAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Net Amt.(Bill Curr)"
                                name="netBillCurrAmt"
                                value={costInvSummaryDTO[index]?.netBillCurrAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.netBillCurrAmt}
                                helperText={costInvErrors[index]?.netBillCurrAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Act Bill Amt.(LC)"
                                name="actBillLcAmt"
                                value={costInvSummaryDTO[index]?.actBillLcAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.actBillLcAmt}
                                helperText={costInvErrors[index]?.actBillLcAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Net Amt.(LC)"
                                name="netBillLcAmt"
                                value={costInvSummaryDTO[index]?.netBillLcAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.netBillLcAmt}
                                helperText={costInvErrors[index]?.netBillLcAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="GST Input Amt(LC)"
                                name="gstInputLcAmt"
                                value={costInvSummaryDTO[index]?.gstInputLcAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.gstInputLcAmt}
                                helperText={costInvErrors[index]?.gstInputLcAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Round Off"
                                name="roundOff"
                                value={costInvSummaryDTO[index]?.roundOff || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.roundOff}
                                helperText={costInvErrors[index]?.roundOff}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                label="Tot. Charge Amt.(LC)"
                                name="totChargesLcAmt"
                                value={costInvSummaryDTO[index]?.totChargesLcAmt || ''}
                                onChange={(e) => handleInputChange(e, 'costInvSummaryDTO', index)}
                                size="small"
                                placeholder="0.00"
                                inputProps={{ maxLength: 30 }}
                                error={!!costInvErrors[index]?.totChargesLcAmt}
                                helperText={costInvErrors[index]?.totChargesLcAmt}
                              />
                            </FormControl>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllCostInvoiceById} />
          )}
        </div>
      </div>
    </>
  );
};
export default CostInvoice;
