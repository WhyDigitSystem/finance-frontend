import { useEffect, useRef, useState } from 'react';
import apiCalls from 'apicall';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toWords } from 'number-to-words';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { FormControl, FormHelperText, Checkbox, FormControlLabel, FormLabel, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GeneratePdfTemp from 'utils/PdfTempTaxInvoice';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonTable from 'views/basicMaster/CommonTable';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const RCostInvoicegna = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [listViewData, setListViewData] = useState([]);
  const [exRates, setExRates] = useState([]);
  const [partyName, setPartyName] = useState([]);
  const [showChargeDetails, setShowChargeDetails] = useState(false);
  const [tdsList, setTDSList] = useState([]);
  const [stateCodeList, setStateCodeList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [chargeACList, setChargeACList] = useState([]);
  // const [downloadPdf, setDownloadPdf] = useState(false);
  // const [pdfData, setPdfData] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([
    {
      id: 1,
      chargeDesc: '',
      currency: '',
      gstPercent: '',
      gstAmt: '',
      billAmt: '',
      lcAmount: ''
    }
  ]);
  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    purVoucherNo: '',
    purVoucherDate: null,
    partyType: 'VENDOR',
    partyName: '',
    partyCode: '',
    vid: '',
    vdate: null,
    supplierGstIn: '',
    stateCode: '',
    supplierPlace: '',
    address: '',
    supplierBillNo: '',
    supplierDate: null,
    currency: '',
    exRate: '',
    creditDays: '',
    dueDate: null,
    gstType: '',
    remarks: '',
    // Summary
    actBillCurrAmt: '',
    netBillCurrAmt: '',
    actLcAmt: '',
    netLcAmt: '',
    amtInWords: '',
    roundOff: '',
    taxAmountLc: ''
  });
  const supplierDate = dayjs(formData.supplierDate);
  const creditDays = formData.creditDays || 0;      
  const minDate = supplierDate.add(creditDays, 'days');
  const [chargerCostInvoice, setChargerCostInvoice] = useState([
    {
      chargeAC: '',
      currency: '',
      exRate: '',
      tdsApplicable: true,
      rate: '',
      gstPer: '',
      gstAmt: '',
      fcAmount: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: ''
    }
  ]);
  const [costInvoiceErrors, setCostInvoiceErrors] = useState([
    {
      chargeAC: '',
      currency: '',
      exRate: '',
      tdsApplicable: '',
      gstPer: '',
      gstAmt: '',
      rate: '',
      fcAmount: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: ''
    }
  ]);
  const [tdsCostInvoiceDTO, setTdsCostInvoiceDTO] = useState([
    {
      tds: '',
      tdsPer: '',
      section: '',
      totalTdsAmt: '',
      tdsPerAmt: ''
    }
  ]);
  const [tdsCostErrors, setTdsCostErrors] = useState([
    {
      tds: '',
      tdsPer: '',
      section: '',
      totalTdsAmt: '',
      tdsPerAmt: ''
    }
  ]);
  const handleClear = () => {
    setShowChargeDetails(false);
    setCityList([]);
    setStateCodeList([]);
    setFormData({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: null,
      partyType: 'VENDOR',
      partyName: '',
      partyCode: '',
      vid: '',
      vdate: null,
      supplierGstIn: '',
      stateCode: '',
      supplierPlace: '',
      address: '',
      supplierBillNo: '',
      supplierDate: null,
      currency: '',
      exRate: '',
      creditDays: '',
      dueDate: null,
      gstType: '',
      remarks: '',
      // Summary
      actBillCurrAmt: '',
      netBillCurrAmt: '',
      actLcAmt: '',
      netLcAmt: '',
      amtInWords: '',
      roundOff: '',
      taxAmountLc: ''
    });
    setExRates([]);
    getAllActiveCurrency(orgId);
    setFieldErrors({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: '',
      partyType: '',
      partyName: '',
      partyCode: '',
      vid: '',
      vdate: '',
      supplierGstIn: '',

      supplierPlace: '',
      address: '',
      supplierBillNo: '',
      supplierDate: '',
      currency: '',
      exRate: '',
      creditDays: '',
      dueDate: '',
      gstType: '',
      remarks: '',
      // Summary
      actBillCurrAmt: '',
      netBillCurrAmt: '',
      actLcAmt: '',
      netLcAmt: '',
      amtInWords: '',
      roundOff: '',
      taxAmountLc: ''
    });
    setChargerCostInvoice([
      {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: true,
        gstPer: '',
        gstAmt: '',
        rate: '',
        fcAmount: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: ''
      }
    ]);
    setTdsCostInvoiceDTO([
      {
        section: '',
        tds: '',
        tdsPer: '',
        totalTdsAmt: '',
        tdsPerAmt: ''
      }
    ]);
    setCostInvoiceErrors([]);
    setTdsCostErrors([]);
    setEditId('');
    getRCostInvoiceDocId();
  };
  // const GeneratePdf = (row) => {
  //   console.log('PDF-Data =>', row.original);
  //   setPdfData(row.original);
  //   setDownloadPdf(true);
  // };
  const listViewColumns = [
    { accessorKey: 'docId', header: 'R Cost Invoice No', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 }
  ];
  useEffect(() => {
    if (!editId) {
      calculateTotals();
      calculateSummary();
    }
  }, [chargerCostInvoice, tdsCostInvoiceDTO]);

  const calculateTotals = () => {
    let totalBillAmt = 0;
    let totalLcAmount = 0;
    let totgstAmt = 0;

    const updatedChargerCostInvoice = chargerCostInvoice.map((item) => ({
      ...item,
      gstAmt: ((item.gstPer * item.lcAmount) / 100).toFixed(2)
    }));

    updatedChargerCostInvoice.forEach((row) => {
      totalLcAmount += parseFloat(row.lcAmount || 0);
      totalBillAmt += parseFloat(row.billAmount || 0);
      totgstAmt += parseFloat(row.gstAmt || 0);
    });

    setChargerCostInvoice(updatedChargerCostInvoice);

    const totalTds = tdsCostInvoiceDTO.reduce((acc, row) => acc + (parseFloat(row.tdsPer || 0) * totalLcAmount) / 100, 0);

    const updatedTdsCostInvoiceDTO = tdsCostInvoiceDTO.map((item) => ({
      ...item,
      totalTdsAmt: ((totalLcAmount * (item.tdsPer || 0)) / 100).toFixed(2),
      tdsPerAmt: ((totalLcAmount * (item.tdsPer || 0)) / 100).toFixed(2)
    }));
    setTdsCostInvoiceDTO(updatedTdsCostInvoiceDTO);
    setFormData((prev) => ({
      ...prev,
      taxAmountLc: (totalLcAmount - totgstAmt).toFixed(2),
      netBillCurrAmt: updatedChargerCostInvoice.some((item) => item.currency === 'INR')
        ? (totalLcAmount - totalTds).toFixed(2)
        : totalBillAmt.toFixed(2),
        roundOff: parseFloat(totalBillAmt - totalTds) - parseInt(totalBillAmt - totalTds)
    }));
  };
  const calculateSummary = () => {
    let totalBillAmt = 0;
    let totalLcAmount = 0;
    chargerCostInvoice.forEach((row) => {
      totalLcAmount += parseFloat(row.lcAmount || 0);
      totalBillAmt += parseFloat(row.billAmount || 0);
    });
    const totalTds = tdsCostInvoiceDTO.reduce((acc, row) => acc + parseFloat(row.totalTdsAmt || 0), 0);
    // const roundedValue = Math.round(totalLcAmount - totalTds);
    setFormData((prev) => ({
      ...prev,
      actBillCurrAmt: totalBillAmt.toFixed(2),
      actLcAmt: (totalBillAmt - totalTds).toFixed(2),
      netLcAmt: (totalLcAmount - totalTds).toFixed(2),
      // roundOff: (roundedValue - (totalLcAmount - totalTds)).toFixed(2),
      amtInWords: toWords(parseFloat(totalBillAmt)).toUpperCase()
    }));
  };
  useEffect(() => {
    getAllCostInvoiceByOrgId();
    getRCostInvoiceDocId();
    getChargeAC();
  }, []);

  useEffect(() => {
    getPartyName(formData.partyType);
  }, [formData.partyType]);
  useEffect(() => {
    getCurrencyAndExratesForMatchingParties(formData.partyCode);
  }, [formData.partyCode]);
  useEffect(() => {
    getStateCode(formData.partyCode);
  }, [formData.partyCode]);
  useEffect(() => {
    if (stateCodeList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        stateCode: stateCodeList[0]?.stateCode || '',
        supplierGstIn: stateCodeList[0]?.gstin || ''
      }));
    }
  }, [stateCodeList]);
  // useEffect(() => {
  //   if (cityList.length === 1) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       supplierPlace: cityList.city,
  //       address: cityList.address
  //     }));
  //   }
  // }, [cityList]);

  // useEffect(() => {
  //   getStateCode(formData.partyCode);
  // }, [formData.partyCode]);

  const getAllCostInvoiceByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/rCostInvoiceGna/getAllRCostInvoiceGnaByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.rCostInvoiceGnaVO.reverse() || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getRCostInvoiceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/rCostInvoiceGna/getRCostInvoiceGnaDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.rcostInvoiceGnaDocId
      }));
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };
  const getAllRCostInvoiceById = async (row) => {
    setShowForm(false);
    try {
      const result = await apiCalls('get', `/rCostInvoiceGna/getAllRCostInvoiceGnaById?id=${row.original.id}`);
      console.log('Byid', result);

      if (result) {
        const rCostVO = result.paramObjectsMap.rCostInvoiceGnaVO[0];
        setListViewData(rCostVO);
        setEditId(row.original.id);
        setFormData({
          docId: rCostVO.docId || '',
          docDate: rCostVO.docDate ? dayjs(rCostVO.docDate) : null,
          purVoucherNo: rCostVO.purVoucherNo || '',
          purVoucherDate: rCostVO.purVoucherDate ? dayjs(rCostVO.purVoucherDate) : null,
          partyType: rCostVO.partyType || '',
          partyName: rCostVO.partyName || '',
          partyCode: rCostVO.partyCode || '',
          vid: rCostVO.vid,
          vdate: rCostVO.vdate ? dayjs(rCostVO.vdate) : null,
          supplierGstIn: rCostVO.supplierGstIn || '',
          stateCode: rCostVO.supplierGstInCode || '',
          supplierPlace: rCostVO.place || '',
          address: rCostVO.address || '',
          supplierBillNo: rCostVO.supplierBillNo || '',
          supplierDate: rCostVO.supplierBillDate ? dayjs(rCostVO.supplierBillDate) : null,
          currency: rCostVO.currency || '',
          exRate: rCostVO.exRate || '',
          creditDays: rCostVO.creditDays || '',
          dueDate: rCostVO.dueDate ? dayjs(rCostVO.dueDate) : null,
          gstType: rCostVO.gstType || '',
          remarks: rCostVO.remarks || '',
          // Summary
          actBillCurrAmt: rCostVO.actBillAmtBc,
          netBillCurrAmt: rCostVO.netAmtBc,
          actLcAmt: rCostVO.actBillAmtLc,
          netLcAmt: rCostVO.netAmtLc,
          amtInWords: rCostVO.amountInWords,
          roundOff: rCostVO.roundOff,
          taxAmountLc: rCostVO.gstAmtLc,
          createdBy: loginUserName,
          finYear: finYear,
          orgId: orgId
        });
        setChargerCostInvoice(
          rCostVO.normalCharges.map((row) => ({
            id: row.id,
            chargeAC: row.chargeName,
            currency: row.currency,
            exRate: row.exRate,
            tdsApplicable: row.tdsApplicable,
            rate: row.rate,
            gstPer: row.gstPer,
            fcAmount: row.fcAmt,
            lcAmount: row.lcAmt,
            billAmount: row.billAmt,
            gtaAmount: row.gtaamount
          }))
        );
        setTdsCostInvoiceDTO(
          rCostVO.tdsRCostInvoiceGnaVO.map((row) => ({
            id: row.id,
            tds: row.tds,
            tdsPer: row.tdsPer,
            section: row.section,
            totalTdsAmt: row.totalTdsAmt,
            tdsPerAmt: row.tdsPerAmt
          }))
        );
        setChargeDetails(
          rCostVO.gstLines.map((row) => ({
            id: row.id,
            currency: row.currency,
            chargeDesc: row.chargeName,
            gstAmt: row.gstAmt,
            gstPercent: row.gstPer,
            billAmt: row.billAmt,
            lcAmount: row.lcAmt
          }))
        );
        setShowChargeDetails(true);
        console.log('DataToEdit', rCostVO);
      } else {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e, fieldType, index) => {
    const { name, value } = e.target;

    if (name === 'currency') {
      const selectedCurrency = exRates.find((item) => item.currency === value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase(),
        exRate: selectedCurrency ? selectedCurrency.buyingExRate : ''
      }));
    } else if (fieldType === 'tdsCostInvoiceDTO') {
      setTdsCostInvoiceDTO((prevData) =>
        Array.isArray(prevData) ? prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item)) : [{ [name]: value }]
      );

      if (name === 'tds') {
        getSection(value);
      } else if (name === 'section') {
        const selectedTDS = tdsList.find((tds) => tds.sectionName === value);
        if (selectedTDS) {
          setTdsCostInvoiceDTO((prevData) =>
            prevData.map((item, index) =>
              index === 0 ? { ...item, section: selectedTDS.sectionName, tdsPer: selectedTDS.tcsPercentage } : item
            )
          );
        }
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
    }
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    const selectedParty = partyName.find((emp) => emp.partyName === value);
    if (selectedParty) {
      setFormData((prevData) => ({
        ...prevData,
        partyName: selectedParty.partyName,
        partyCode: selectedParty.partyCode,
        creditDays: selectedParty.creditDays
      }));
      getStateCode(selectedParty.partyCode);
      // getCurrencyAndExratesForMatchingParties(selectedParty.partyCode);
    } else {
      console.log('No Party found with the given code:', value);
    }
  };
  const handleSelectStateCode = (e) => {
    const value = e.target.value;
    const selectedStateCode = stateCodeList.find((stateC) => stateC.stateCode === value);
    if (selectedStateCode) {
      setFormData((prevData) => ({
        ...prevData,
        stateCode: selectedStateCode.stateCode,
        // state: selectedStateCode.state,
        supplierGstIn: selectedStateCode.gstin
      }));
      getCityName(formData.partyCode,selectedStateCode.state)
    } else {
      console.log('No State Code found with the given code:', value);
    }
  };
  const handleSelectCity = (e) => {
    const value = e.target.value;
    const selectedCity = cityList.find((stateC) => stateC.city === value);
    if (selectedCity) {
      setFormData((prevData) => ({
        ...prevData,
        supplierPlace: selectedCity.city,
        address: selectedCity.address
      }));
    } else {
      console.log('No City found with the given code:', value);
    }
  };
  const getPartyName = async (partType) => {
    try {
      const response = await apiCalls('get', `/rCostInvoiceGna/getAllVendorFromPartyMaster?orgId=${orgId}&partyType=${partType}`);
      setPartyName(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getStateCode = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/rCostInvoiceGna/getStateFromPartyMaster?orgId=${orgId}&partyCode=${partyCode}`);
      const uniqueStateCodes = Array.from(
        new Map(response.paramObjectsMap.partyMasterVO.map((state) => [state.stateCode, state])).values()
      );
      setStateCodeList(uniqueStateCodes);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getCityName = async (partyCode, state) => {
    try {
      const response = await apiCalls('get', `/rCostInvoiceGna/getCityFromPartyMaster?orgId=${orgId}&partyCode=${partyCode}&state=${state}`);
      setCityList(response.paramObjectsMap.partyMasterVO);
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
  const getChargeAC = async () => {
    try {
      const response = await apiCalls('get', `/rCostInvoiceGna/getChargeLedgerFromGroup?orgId=${orgId}`);
      setChargeACList(response.paramObjectsMap.chargeCodeVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getSection = async (tds) => {
    try {
      const response = await apiCalls('get', `/rCostInvoiceGna/getSectionNameFromTDSMaster?orgId=${orgId}&tds=${tds}`);
      setTDSList(response.paramObjectsMap.tdsMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  
  const calculateChargesAmt = () => {
    if (!Array.isArray(chargerCostInvoice) || chargerCostInvoice.length === 0) return;

    const updatedCharges = chargerCostInvoice.map((item) => {
      if (!item.exRate || !item.rate) return item;

      const lcamt = parseFloat(item.exRate) * parseFloat(item.rate);
      const billamt = parseFloat(item.exRate) * parseFloat(item.rate);
      let fcamt = item.currency === 'INR' ? 0 : parseFloat(item.rate);
      return { ...item, lcAmount: lcamt, fcAmount: fcamt, billAmount: billamt };
    });
    setChargerCostInvoice(updatedCharges);
  };

  const handleRowUpdate = async (index, field, value) => {
    setChargerCostInvoice((prev) => {
      return prev.map((row, idx) => {
        if (idx === index) {
          const updatedRow = { ...row, [field]: value };
          const rate = Number(updatedRow.rate) || 0;
          const selectedCurrencyData = exRates.find((currency) => currency.currency === updatedRow.currency);
          const exRate = selectedCurrencyData?.buyingExRate || 1;
          const fcAmount = updatedRow.currency === 'INR' ? 0 : rate;
          const lcAmount = rate * exRate;
          const billAmount = rate * exRate;

          return {
            ...updatedRow,
            // rate,
            exRate,
            fcAmount,
            lcAmount,
            billAmount
          };
        }
        return row;
      });
    });

    setCostInvoiceErrors((prev) => {
      const newErrors = [...prev];
      const updatedErrors = {
        ...newErrors[index],
        [field]: !value ? `${field} is required` : ''
      };
      newErrors[index] = updatedErrors;
      return newErrors;
    });
  };
  const handleAddRow = () => {
    if (isLastRowEmpty(chargerCostInvoice)) {
      displayRowError(chargerCostInvoice);
      return;
    }
    const newRow = {
      id: Date.now(),
      chargeAC: '',
      currency: '',
      exRate: '',
      tdsApplicable: true,
      gstPer: '',
      rate: '',
      fcAmount: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: ''
    };
    setChargerCostInvoice([...chargerCostInvoice, newRow]);
    setCostInvoiceErrors([
      ...costInvoiceErrors,
      {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: '',
        gstPer: '',
        rate: '',
        fcAmount: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === chargerCostInvoice) {
      return (
        !lastRow.chargeAC ||
        !lastRow.currency ||
        !lastRow.exRate ||
        !lastRow.tdsApplicable ||
        !lastRow.gstPer ||
        !lastRow.rate ||
        !lastRow.lcAmount ||
        !lastRow.billAmount ||
        !lastRow.gtaAmount
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
          chargeAC: !table[table.length - 1].chargeAC ? 'Charge AC is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'Ex Rate is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          lcAmount: !table[table.length - 1].lcAmount ? 'LC Amount is required' : '',
          billAmount: !table[table.length - 1].billAmount ? 'Bll Amount is required' : '',
          gtaAmount: !table[table.length - 1].gtaAmount ? 'GTA Amount is required' : ''
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
    const errors = {};
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'Tax Type is required';
    }
    if (!formData.supplierBillNo) {
      errors.supplierBillNo = 'Supplier Bill No is required';
    }
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }

    let CostInvoiceValid = true;
    const newTableErrors = chargerCostInvoice.map((row) => {
      const rowErrors = {};
      if (!row.chargeAC) {
        rowErrors.chargeAC = 'Charge AC is required';
        CostInvoiceValid = false;
      }
      if (!row.rate) {
        rowErrors.rate = 'Rate is required';
        CostInvoiceValid = false;
      }
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
      if (!row.tds) {
        rowErrors.tds = 'Tds With Holding is required';
        tdsValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setTdsCostErrors(tdsTableErrors);

    if (Object.keys(errors).length === 0 && CostInvoiceValid) {
      const rCostVO = chargerCostInvoice.map((row) => ({
        ...(editId && { id: row.id }),
        chargeName: row.chargeAC,
        currency: row.currency || '',
        exRate: parseInt(row.exRate),
        gstPer: parseInt(row.gstPer),
        gtaamount: parseInt(row.gtaAmount),
        rate: parseInt(row.rate),
        tdsApplicable: row.tdsApplicable
      }));
      const tdsVO = tdsCostInvoiceDTO.map((row) => ({
        ...(editId && { id: row.id }),
        section: row.section,
        tds: row.tds,
        tdsPer: parseInt(row.tdsPer)
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        createdBy: loginUserName,
        branchCode: branchCode,
        finYear: finYear,
        branch: branch,
        orgId: orgId,
        tdsRCostInvoiceGnaDTO: tdsVO,
        chargeRCostInvoiceGnaDTO: rCostVO,
        vid: formData.vid,
        vdate: dayjs(formData.vdate).format('YYYY-MM-DD'),
        creditDays: formData.creditDays,
        currency: formData.currency,
        dueDate: formData.dueDate,
        exRate: parseInt(formData.exRate),
        gstType: formData.gstType,
        partyType: formData.partyType,
        partyName: formData.partyName,
        partyCode: formData.partyCode,
        place: formData.supplierPlace,
        remarks: formData.remarks,
        supplierBillNo: formData.supplierBillNo,
        supplierBillDate: formData.supplierDate,
        supplierGstIn: formData.supplierGstIn,
        supplierGstInCode: formData.stateCode,
        address: formData.address,
        active: true
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/rCostInvoiceGna/updateCreateRCostInvoiceGna`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Registered Cost Invoice Updated Successfully' : 'Registered Cost Invoice Created successfully');
          getAllCostInvoiceByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Registered Cost Invoice Creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Registered Cost Invoice creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setChargerCostInvoice([{
      sno: '',
      chargeAC: newType,
      currency: '',
      exRate: '',
      tdsApplicable: true,
      rate: '',
      gstPer: '',
      gstAmt: '',
      fcAmount: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: ''
    }]);
    // Clear formData (summary section)
    setFormData((prevData) => ({
      ...prevData,
      actBillCurrAmt: '',
      netBillCurrAmt: '',
      actLcAmt: '',
      netLcAmt: '',
      amtInWords: '',
      roundOff: '',
      taxAmountLc: '',
    }));
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-between mb-4" style={{ marginBottom: '20px' }}>
            <div className="d-flex">
              <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            </div>
          </div>
          {!showForm && (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="R Cost Invoice No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
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
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Purchase Voucher No"
                      size="small"
                      name="purVoucherNo"
                      inputProps={{ maxLength: 30 }}
                      value={formData.purVoucherNo}
                      onChange={handleInputChange}
                      disabled
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
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.purVoucherDate && <p className="dateErrMsg">Pur Voucher Date is required</p>} */}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Party Type</InputLabel>
                    <Select
                      labelId="partyTypeLabel"
                      value={formData.partyType}
                      name="partyType"
                      onChange={handleInputChange}
                      label="Party Type"
                      disabled
                      error={!!fieldErrors.partyType}
                      helperText={fieldErrors.partyType}
                    >
                      <MenuItem value="VENDOR">Vendor</MenuItem>
                    </Select>
                    {fieldErrors.partyType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.partyType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
                    <InputLabel id="demo-simple-select-label">{<span>Party Name</span>}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Party Name"
                      onChange={handleSelectPartyChange}
                      name="partyName"
                      value={formData.partyName}
                      // (partyName.length === 1 ? partyName[0].partyName : '')
                    >
                      {partyName &&
                        partyName.map((item) => (
                          <MenuItem key={item.id} value={item.partyName}>
                            {item.partyName}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.partyName && <FormHelperText style={{ color: 'red' }}>Party Name is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Party Code"
                      size="small"
                      name="partyCode"
                      disabled
                      inputProps={{ maxLength: 30 }}
                      value={formData.partyCode}
                      onChange={handleInputChange}
                      error={!!fieldErrors.partyCode}
                      helperText={fieldErrors.partyCode}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="V Id"
                      size="small"
                      name="vid"
                      inputProps={{ maxLength: 30 }}
                      value={formData.vid}
                      onChange={handleInputChange}
                      disabled={editId}
                      error={!!fieldErrors.vid}
                      helperText={fieldErrors.vid}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="V Date"
                        disabled={editId}
                        value={formData.vdate ? dayjs(formData.vdate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('vdate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.vdate && <p className="dateErrMsg">V Date is required</p>} */}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.stateCode}>
                    <InputLabel id="demo-simple-select-label">{<span>State Code</span>}</InputLabel>
                    <Select
                      labelId="stateCode"
                      label="State Code"
                      name="stateCode"
                      value={stateCodeList.some((state) => state.stateCode === formData.stateCode) ? formData.stateCode : ''} // Ensures only valid values
                      onChange={handleSelectStateCode}
                      error={!!fieldErrors.stateCode}
                    >
                      {stateCodeList.length > 0 ? (
                        stateCodeList.map((state) => (
                          <MenuItem key={state.id} value={state.stateCode}>
                            {state.stateCode}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No States Available
                        </MenuItem>
                      )}
                    </Select>

                    {fieldErrors.stateCode && <FormHelperText style={{ color: 'red' }}>State Code is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Supplier Reg No"
                      size="small"
                      name="supplierGstIn"
                      disabled
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
                    <InputLabel id="demo-simple-select-label">Supplier Place</InputLabel>
                    <Select
                      labelId="supplierPlace"
                      label="supplierPlace"
                      value={formData.supplierPlace}
                      //  || (cityList.length === 1 ? cityList[0].city : '')
                      name="supplierPlace"
                      onChange={handleSelectCity}
                      error={!!fieldErrors.supplierPlace}
                      helperText={fieldErrors.supplierPlace}
                    >
                      {cityList &&
                        cityList.map((par, index) => (
                          <MenuItem key={index} value={par.city}>
                            {par.city}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.supplierPlace && <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierPlace}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Address"
                      name="address"
                      size="small"
                      multiline
                      disabled
                      inputProps={{ maxLength: 30 }}
                      value={formData.address}
                      onChange={handleInputChange}
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address}
                    />
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
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Supplier Date"
                      value={formData.supplierDate ? dayjs(formData.supplierDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('supplierDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true, error: fieldErrors.supplierDate, helperText: fieldErrors.supplierDate }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                    <InputLabel id="demo-simple-select-label">{<span>Currency</span>}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Currency"
                      onChange={handleInputChange}
                      name="currency"
                      value={formData.currency}
                      // || (exRates.length === 1 ? exRates[0].currency : '')
                    >
                      {exRates &&
                        exRates.map((item) => (
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
                      label="Ex Rate"
                      name="exRate"
                      size="small"
                      type="number"
                      inputProps={{ maxLength: 30 }}
                      value={formData.exRate}
                      onChange={handleInputChange}
                      disabled
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
                      disabled
                      error={!!fieldErrors.creditDays}
                      helperText={fieldErrors.creditDays}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Due Date"
                        value={formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        minDate={minDate}
                        slotProps={{
                          textField: { size: 'small', clearable: true, error: fieldErrors.dueDate, helperText: fieldErrors.dueDate }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  {/* <FormControl fullWidth size="small"> */}
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gstType}>
                    <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                    <Select labelId="gstType" name="gstType" value={formData.gstType} onChange={handleInputChange} label="Tax Type">
                      <MenuItem value="INTER">INTER</MenuItem>
                      <MenuItem value="INTRA">INTRA</MenuItem>
                    </Select>
                    {fieldErrors.gstType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstType}</FormHelperText>}
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
                    <Tab value={0} label="Expence Charges" />
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
                          {/* <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} /> */}
                        </div>

                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive mb-3">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                    <th className="table-header" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header">Charge / Expence A/C</th>
                                    <th className="table-header">TDS Applicable</th>
                                    <th className="table-header">Currency</th>
                                    <th className="table-header">Ex Rate</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">Tax Percentage</th>
                                    <th className="table-header">FC Amount</th>
                                    <th className="table-header">LC Amount</th>
                                    <th className="table-header">Bill Amount</th>
                                    <th className="table-header">GTA Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <>
                                    {chargerCostInvoice.map((row, index) => (
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
                                            value={row.chargeAC}
                                            style={{ width: '180px' }}
                                            onChange={handleTypeChange}
                                            // onChange={(e) => {
                                            //   const selectedchargeLedger = e.target.value;
                                            //   const updatedchargeLedgerData = [...chargerCostInvoice];
                                            //   updatedchargeLedgerData[index] = {
                                            //     ...updatedchargeLedgerData[index],
                                            //     chargeAC: selectedchargeLedger
                                            //   };
                                            //   setChargerCostInvoice(updatedchargeLedgerData);
                                            // }}
                                            className={costInvoiceErrors[index]?.chargeAC ? 'error form-control' : 'form-control'}
                                          >
                                            <option value="">--Select--</option>
                                            {chargeACList &&
                                              chargeACList.map((job) => (
                                                <option key={job.id} value={job.chargeLedger}>
                                                  {job.chargeLedger}
                                                </option>
                                              ))}
                                          </select>

                                          {costInvoiceErrors[index]?.chargeAC && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].chargeAC}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2 text-center">
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                className="ms-2 pb-0 pt-1"
                                                checked={row.tdsApplicable}
                                                onChange={(e) => {
                                                  const isChecked = e.target.checked;

                                                  setChargerCostInvoice((prev) =>
                                                    prev.map((r) => (r.id === row.id ? { ...r, tdsApplicable: isChecked } : r))
                                                  );
                                                }}
                                                name="tdsApplicable"
                                                color="primary"
                                              />
                                            }
                                            sx={{
                                              '& .MuiSvgIcon-root': { color: '#5e35b1' }
                                            }}
                                          />
                                          {costInvoiceErrors[index]?.tdsApplicable && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].tdsApplicable}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <select
                                            value={row.currency}
                                            style={{ width: '150px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              handleRowUpdate(index, 'currency', value);
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
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
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
                                          />
                                          {costInvoiceErrors[index]?.exRate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].exRate}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.rate}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                handleRowUpdate(index, 'rate', value);
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
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.gstPer}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                handleRowUpdate(index, 'gstPer', value);
                                              } else {
                                                setCostInvoiceErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gstPer: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={costInvoiceErrors[index]?.gstPer ? 'error form-control' : 'form-control'}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.fcAmount ? row.fcAmount : '0'}
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
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    fcAmount: !value ? 'fcAmount is required' : ''
                                                  };
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
                                          />
                                          {costInvoiceErrors[index]?.fcAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].fcAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.lcAmount ? row.lcAmount : '0'}
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
                                          />
                                          {costInvoiceErrors[index]?.lcAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].lcAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.billAmount ? row.billAmount : ''}
                                            disabled
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setChargerCostInvoice((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, billAmount: value } : r))
                                                );
                                                setCostInvoiceErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    billAmount: !value ? 'Bill Amount is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setCostInvoiceErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    billAmount: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={costInvoiceErrors[index]?.billAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {costInvoiceErrors[index]?.billAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].billAmount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.gtaAmount ? row.gtaAmount : ''}
                                            style={{ width: '100px' }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numericRegex = /^[0-9]*$/;
                                              if (numericRegex.test(value)) {
                                                setChargerCostInvoice((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, gtaAmount: value } : r))
                                                );
                                                setCostInvoiceErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gtaAmount: !value ? 'GTA Amt is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              } else {
                                                setCostInvoiceErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    gtaAmount: 'Only numeric characters are allowed'
                                                  };
                                                  return newErrors;
                                                });
                                              }
                                            }}
                                            className={costInvoiceErrors[index]?.gtaAmount ? 'error form-control' : 'form-control'}
                                          />
                                          {costInvoiceErrors[index]?.gtaAmount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {costInvoiceErrors[index].gtaAmount}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </>
                                </tbody>
                              </table>
                            </div>
                            {showChargeDetails && chargeDetails.length > 0 && (
                              <tr>
                                <td className="border px-2 py-2">
                                  <table className="table table-bordered mb-0">
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'center' }}>S No</th>
                                        <th style={{ textAlign: 'center' }}>Tax Desc</th>
                                        <th style={{ textAlign: 'center' }}>Currency</th>
                                        <th style={{ textAlign: 'center' }}>TAX %</th>
                                        <th style={{ textAlign: 'center' }}>Tax Amount</th>
                                        <th style={{ textAlign: 'center' }}>Bill Amount</th>
                                        <th style={{ textAlign: 'center' }}>LC Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {chargeDetails.map((detail, idx) => (
                                        <tr key={idx}>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{idx + 1}</td>
                                          <td style={{ width: '300px', textAlign: 'center' }}>{detail.chargeDesc}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.currency}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.gstPercent}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.gstAmt}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.billAmt}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.lcAmount}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
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
                              <InputLabel id="demo-simple-select-label">TDS</InputLabel>
                              <Select
                                labelId="tds"
                                name="tds"
                                value={tdsCostInvoiceDTO[index]?.tds || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                label="TDS"
                                required
                                error={!!tdsCostErrors[index]?.tds}
                              >
                                <MenuItem value="NO">NO</MenuItem>
                                <MenuItem value="NORMAL">NORMAL</MenuItem>
                                <MenuItem value="SPECIAL">SPECIAL</MenuItem>
                              </Select>
                              <FormHelperText error>{tdsCostErrors[index]?.tds}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <InputLabel id="demo-simple-select-label">Section</InputLabel>
                              <Select
                                labelId="section"
                                name="section"
                                value={tdsCostInvoiceDTO[index]?.section || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                label="Section"
                                required
                                error={!!tdsCostErrors[index]?.section}
                              >
                                {tdsList.map((section, id) => (
                                  <MenuItem key={id} value={section.sectionName}>
                                    {section.sectionName}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText error>{tdsCostErrors[index]?.section}</FormHelperText>
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="TDS%"
                                size="small"
                                name="tdsPer"
                                type="number"
                                disabled
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.tdsPer || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.tdsPer}
                                helperText={tdsCostErrors[index]?.tdsPer || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="Total TDS Amount"
                                size="small"
                                name="totalTdsAmt"
                                type="number"
                                disabled
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.totalTdsAmt || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.totalTdsAmt}
                                helperText={tdsCostErrors[index]?.totalTdsAmt}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <TextField
                                label="TDS Percentage Amount"
                                size="small"
                                name="tdsPerAmt"
                                type="number"
                                disabled
                                inputProps={{ maxLength: 30 }}
                                value={tdsCostInvoiceDTO[index]?.tdsPerAmt || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                error={!!tdsCostErrors[index]?.tdsPerAmt}
                                helperText={tdsCostErrors[index]?.tdsPerAmt}
                              />
                            </FormControl>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {value === 2 && (
                    <>
                      <div className="row mt-2">
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Act Bill Amt.(Bill Curr)"
                              name="actBillCurrAmt"
                              value={formData.actBillCurrAmt}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Net Amt.(Bill Curr)"
                              name="netBillCurrAmt"
                              value={formData.netBillCurrAmt}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Act Bill Amt.(LC)"
                              name="actLcAmt"
                              value={formData.actLcAmt}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Net Amt.(LC)"
                              name="netLcAmt"
                              value={formData.netLcAmt}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Amount In Words"
                              name="amtInWords"
                              value={formData.amtInWords}
                              size="small"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Round Off"
                              name="roundOff"
                              value={formData.roundOff}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              label="Tax Amount(LC)"
                              name="taxAmountLc"
                              value={formData.taxAmountLc}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          )}
          {showForm && (
            <CommonListViewTable
              data={data && data}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getAllRCostInvoiceById}
              isPdf={false}
              // GeneratePdf={GeneratePdf}
            />
          )}
          {/* {downloadPdf && <GeneratePdfTemp row={pdfData} />} */}
        </div>
      </div>
    </>
  );
};
export default RCostInvoicegna;
