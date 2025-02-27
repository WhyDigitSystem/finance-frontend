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

const UrCostInvoicegna = () => {
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
  const [chargeLedgerList, setChargeLedgerList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showChargeDetails, setShowChargeDetails] = useState(false);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [stateCodeList, setStateCodeList] = useState([]);
  const [tdsList, setTDSList] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([
    {
      id: 1,
      chargeAccount: '',
      chargeLedger: '',
      currency: '',
      exRate: '',
      gstPercent: '',
      rate: '',
      fcAmount: '',
      lcAmount: '',
      billAmt: ''
    }
  ]);
  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    purVoucherNo:'',
    purVoucherDate: null,
    address: '',
    creditDays: '',
    currency: '',
    dueDate: null,
    exRate: '',
    gstType: '',
    otherInfo: '',
    remarks: '',
    vid: '',
    vdate: null,
    shipperRefNo: '',
    supplierBillDate: null,
    supplierBillNo: '',
    supplierCode: '',
    supplierGstIn: '',
    stateCode: '',
    supplierName: '',
    supplierPlace: '',
    supplierType: 'VENDOR',

    totalChargeAmtlc:'',
    netAmtBillCurr:'',
    actBillAmtLc:'',
    roundOff:'',
    gstAmt:'',
    input:'',
    output:''
  });

  const [chargerCostInvoice, setChargerCostInvoice] = useState([
    {
      chargeLedger: '',
      chargeAccount: '',
      currency: '',
      exRate: '',
      rate: '',
      gstPercent: '',
      gstAmount: '',
      fcAmount: '',
      lcAmount: '',
      billAmt: ''
    }
  ]);
  const [costInvoiceErrors, setCostInvoiceErrors] = useState([
    {
      chargeAccount: '',
      chargeLedger: '',
      currency: '',
      exRate: '',
      gstPercent: '',
      gstAmount: '',
      rate: '',
      fcAmount: '',
      lcAmount: '',
      billAmt: ''
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
  const supplierDate = dayjs(formData.supplierBillDate);
  const creditDays = formData.creditDays || 0;      
  const minDate = supplierDate.add(creditDays, 'days');
  const handleClear = () => {
    setFormData({
      docId: '',
      docDate: dayjs(),
      purVoucherNo:'',
      purVoucherDate: null,
      address: '',
      branch: '',
      branchCode: '',
      creditDays: '',
      currency: '',
      dueDate: null,
      exRate: '',
      finYear: '',
      gstType: '',
      otherInfo: '',
      remarks: '',
      shipperRefNo: '',
      supplierBillDate: null,
      supplierBillNo: '',
      supplierCode: '',
      supplierGstIn: '',
      stateCode: '',
      supplierName: '',
      supplierPlace: '',
      supplierType: 'VENDOR',
      totalChargeAmtlc:'',
      netAmtBillCurr:'',
      actBillAmtLc:'',
      roundOff:'',
      gstAmt:'',
      input:'',
      output:'',
      vid: '',
      vdate: null,
    });
    setExRates([]);
    getAllActiveCurrency(orgId);
    setFieldErrors({
      address: '',
      branch: '',
      branchCode: '',
      creditDays: '',
      currency: '',
      dueDate: null,
      exRate: '',
      finYear: '',
      gstType: '',
      otherInfo: '',
      remarks: '',
      shipperRefNo: '',
      supplierBillDate: null,
      supplierBillNo: '',
      supplierCode: '',
      supplierGstIn: '',
      stateCode: '',
      supplierName: '',
      supplierPlace: '',
      supplierType: '',
      totalChargeAmtlc:'',
      netAmtBillCurr:'',
      actBillAmtLc:'',
      roundOff:'',
      gstAmt:'',
      input:'',
      output:'',
      vid: '',
      vdate: null,
    });
    setChargerCostInvoice([
      {
        chargeAccount: '',
        chargeLedger: '',
        currency: '',
        exRate: '',
        gstPercent: '',
        gstAmount: '',
        rate: '',
        fcAmount: '',
        lcAmount: '',
        billAmt: ''
      }
    ]);
    setTdsCostInvoiceDTO([
      {
        tds: '',
        tdsPer: '',
        section: '',
        totalTdsAmt: '',
        tdsPerAmt: ''
      }
    ]);
    setCostInvoiceErrors([]);
    setTdsCostErrors([]);
    setEditId('');
    getUrCostInvoiceDocId();
    setShowChargeDetails(false);
  };
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'supplierName', header: 'Supplier Name', size: 140 }
  ];

  useEffect(() => {
    getAllUrCostInvoiceByOrgId();
    getUrCostInvoiceDocId();
    getChargeAC();
  }, []);

  useEffect(() => {
    getPartyName(formData.supplierType);
  }, [formData.supplierType]);
  useEffect(() => {
    getStateCode(formData.supplierCode);
  }, [formData.supplierCode]);
  useEffect(() => {
    getCityName(formData.supplierCode,formData.state);
  }, [formData.supplierCode,formData.state]);
  useEffect(() => {
    getSection(tdsCostInvoiceDTO.tds);
  }, [tdsCostInvoiceDTO.tds]);

  const getAllUrCostInvoiceByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/UrCostInvoiceGna/getAllUrCostInvoiceGnaByOrgId?branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`);
      setData(result.paramObjectsMap.urCostInvoiceGnaVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getUrCostInvoiceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/UrCostInvoiceGna/getUrCostInvoiceGnaDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.urCostInvoiceGnaDocId
      }));
    } catch (error) {
      console.error('Error fetching Doc No:', error);
    }
  };

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };
  const getAllUrCostInvoiceById = async (row) => {
    console.log('first', row);
    setShowForm(false);
    try {
      const result = await apiCalls('get', `/UrCostInvoiceGna/getUrCostInvoiceGnaById?id=${row.original.id}`);

      if (result) {
        const costVO = result.paramObjectsMap.urCostInvoiceGnaVO[0];
        setListViewData(costVO);
        setEditId(row.original.id);
        // getCurrencyAndExratesForMatchingParties(costVO.supplierCode);
        getTdsDetailsFromPartyMasterSpecialTDS(costVO.supplierCode);
        setShowChargeDetails(true);
        setFormData({
          dueDate: costVO.dueDate ? dayjs(costVO.dueDate) : null,
          supplierBillDate: costVO.supplierBillDate ? dayjs(costVO.supplierBillDate) : null,
          purVoucherDate: costVO.purVoucherDate ? dayjs(costVO.purVoucherDate) : null,
          docId:costVO.docId,
          docDate: costVO.docDate ? dayjs(costVO.docDate) : null,
          purVoucherNo:costVO.purVoucherNo,
          address: costVO.address,
          creditDays: costVO.creditDays,
          currency: costVO.currency,
          exRate: costVO.exRate,
          gstType: costVO.gstType,
          otherInfo: costVO.otherInfo,
          remarks: costVO.remarks,
          shipperRefNo: costVO.shipperRefNo,
          supplierBillNo: costVO.supplierBillNo,
          supplierCode: costVO.supplierCode,
          supplierGstIn: costVO.supplierGstIn,
          stateCode: costVO.supplierGstInCode,
          supplierName: costVO.supplierName,
          supplierPlace: costVO.supplierPlace,
          supplierType: costVO.supplierType,
          orgId:orgId,
          updatedBy: loginUserName,
          createdBy:loginUserName,
          // branch: branch,
          // branchCode: branchCode,
          finYear: finYear,
          totalChargeAmtlc:costVO.totChargeAmtLc,
          netAmtBillCurr:costVO.netamountBillCurr,
          actBillAmtLc:costVO.actBillAmtLc,
          roundOff:costVO.roundOff,
          input:costVO.input,
          output: costVO.output,
          vid: costVO.vid,
          vdate: costVO.vdate ? dayjs(costVO.vdate) : null,
        });
        setChargerCostInvoice(
          costVO.normalCharges.map((row) => ({
            id: row.id,
            chargeLedger: row.chargeLedger,
            chargeAccount: row.chargeAccount,
            currency: row.currency,
            exRate: row.exRate,
            rate: row.rate,
            gstPercent: row.gstpercent,
            fcAmount: row.fcAmount,
            lcAmount: row.lcAmount,
            billAmt: row.billAmount
          }))
        );
        setTdsCostInvoiceDTO(
          costVO.tdsUrCostInvoiceGnaVO.map((row) => ({
            id: row.id,
            tds: row.tdsWithHolding,
            tdsPer: row.tdsWithHoldingPer,
            section: row.section,
            totalTdsAmt: row.totTdsWithAmt,
            tdsPerAmt: row.fcTdsAmt
          }))
        );
        setChargeDetails(
          costVO.gstLines.map((row) => ({
            id: row.id,
            chargeLedger: row.chargeLedger,
            chargeAccount: row.chargeAccount,
            currency: row.currency,
            gstPercent: row.gstpercent,
            // gstPercent: row.gstPercent,
            billAmt: row.billAmount,
            lcAmount: row.lcAmount
          }))
        );
        getSection(costVO.tdsCostInvoiceVO[0].tdsWithHolding);
        
        console.log('DataToEdit', costVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e, fieldType, index) => {
    const { name, value } = e.target;

    if (name === 'gstType') {
      if (formData.gstType !== value) {
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
            fcAmount: '',
            lcAmount: '',
            taxable: ''
          }
        ]);
        setTdsCostInvoiceDTO([{ section: '', tdsWithHolding: '', tdsWithHoldingPer: '', totalTdsAmt: '' }]);
        // setShowChargeDetails(false);
        setFormData((prevFormData) => ({
          ...prevFormData,
          gstType: value,
          actBillCurrAmt: '',
          actBillLcAmt: '',
          gstInputLcAmt: '',
          netBillCurrAmt: '',
          netBillLcAmt: '',
          roundOff: '',
          totChargesBillCurrAmt: '',
          totChargesLcAmt: ''
        }));
      }
    } else if (name === 'currency') {
      const selectedCurrency = exRates.find((item) => item.currency === value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase(),
        exRate: selectedCurrency ? selectedCurrency.buyingExRate : ''
      }));
    } else if (fieldType === 'tdsCostInvoiceDTO') {
      setTdsCostInvoiceDTO((prevData) => prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item)));

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
    }
     else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
    }
  };

  const getPartyName = async (partType) => {
    try {
      const response = await apiCalls('get', `/UrCostInvoiceGna/getAllVendorFromPartyMaster?orgId=${orgId}&partyType=${partType}`);
      setPartyName(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    const selectedParty = partyName.find((emp) => emp.partyName === value);

    if (selectedParty) {
      console.log('Selected Party:', selectedParty);
      setFormData((prevData) => ({
        ...prevData,
        supplierName: selectedParty.partyName,
        supplierCode: selectedParty.partyCode,
        creditDays: selectedParty.creditDays,
      }));
      getStateCode(selectedParty.partyCode);
      getCurrencyAndExratesForMatchingParties(selectedParty.partyCode);
      getTdsDetailsFromPartyMasterSpecialTDS(selectedParty.partyCode);
    } else {
      console.log('No Party found with the given code:', value);
    }
  };

  const getStateCode = async (supplierCode) => {
    try {
      const response = await apiCalls('get', `/UrCostInvoiceGna/getVendorAddressFromPartyMaster?orgId=${orgId}&supplierCode=${supplierCode}`);
      // setStateCodeList(response.paramObjectsMap.partyMasterVO);
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
  const getTdsDetailsFromPartyMasterSpecialTDS = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getTdsDetailsFromPartyMasterSpecialTDS?orgId=${orgId}&partyCode=${partyCode}`);

      const tdsData = response.paramObjectsMap.tds;
      const tdsWhPercent = tdsData.length > 0 ? tdsData[0].tdsWhPercent : '';

      console.log('tds', tdsWhPercent);
      setTdsCostInvoiceDTO((prevData) =>
        prevData.map((item, index) => (index === 0 ? { ...item, tdsWithHoldingPer: tdsWhPercent } : item))
      );
    } catch (error) {
      console.error('Error fetching TDS details:', error);
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
  // const handleDateChange = (field, date) => {
  //   const formattedDate = dayjs(date).format('YYYY-MM-DD');
  //   setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  // };
  const handleDateChange = (field, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date ? dayjs(date).format('YYYY-MM-DD') : null,
    }));
  };
  
  const handleChargeCodeChange = async (e, index) => {
    const selectedChargeCode = e.target.value;
    const selectedChargeCodeData = chargeLedgerList.find((item) => item.chargeLedger === selectedChargeCode);

    const defaultStateValues = {
      qty: '',
      rate: '',
      currency: '',
      exRate: '',
      sac: '',
      gstPercent: ''
    };

    // setShowChargeDetails(false);

    setChargerCostInvoice((prev) => {
      return prev.map((row, idx) => {
        if (idx === index) {
          return {
            ...row,
            ...defaultStateValues,
            chargeLedger: selectedChargeCode,
            chargeAccount: selectedChargeCode,
            // gstPercent: selectedChargeCodeData ? selectedChargeCodeData.GSTPercent : defaultStateValues.gstPercent,
            // ccFeeApplicable: selectedChargeCodeData ? selectedChargeCodeData.ccFeeApplicable : '',
            // chargeName: selectedChargeCodeData ? selectedChargeCodeData.chargeName : '',
            // exempted: selectedChargeCodeData ? selectedChargeCodeData.exempted : '',
            // govChargeCode: selectedChargeCodeData ? selectedChargeCodeData.govChargeCode : '',
            // ledger: selectedChargeCodeData ? selectedChargeCodeData.ledger : '',
            // sac: selectedChargeCodeData ? selectedChargeCodeData.sac : defaultStateValues.sac,
            // taxable: selectedChargeCodeData ? selectedChargeCodeData.taxable : ''
          };
        }
        return row;
      });
    });
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
          const billAmt = rate * exRate;

          return {
            ...updatedRow,
            // rate,
            exRate,
            fcAmount,
            lcAmount,
            billAmt
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
      chargeLedger: '',
      chargeAccount: '',
      currency: '',
      exRate: '',
      rate: '',
      gstPercent: '',
      gstAmount: '',
      fcAmount: '',
      lcAmount: '',
      billAmt: ''
    };
    setChargerCostInvoice([...chargerCostInvoice, newRow]);
    setCostInvoiceErrors([
      ...costInvoiceErrors,
      {
        chargeLedger: '',
        chargeAccount: '',
        currency: '',
        exRate: '',
        rate: '',
        gstPercent: '',
        gstAmount: '',
        fcAmount: '',
        lcAmount: '',
        billAmt: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === chargerCostInvoice) {
      return (
        // !lastRow.chargeCode ||
        !lastRow.chargeLedger ||
        // !lastRow.chargeName ||
        !lastRow.currency ||
        !lastRow.exRate ||
        // !lastRow.fcAmt ||
        // !lastRow.sac ||
        // !lastRow.gst ||
        // !lastRow.houseNo ||
        // !lastRow.jobNo ||
        // !lastRow.qty ||
        !lastRow.rate
        // !lastRow.lcAmt ||
        // !lastRow.subJobNo
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
          // jobNo: !table[table.length - 1].jobNo ? 'Job No is required' : '',
          // chargeCode: !table[table.length - 1].chargeCode ? 'Charge Code is required' : '',
          chargeLedger: !table[table.length - 1].chargeLedger ? 'Charge Ledger is required' : '',
          // chargeName: !table[table.length - 1].chargeName ? 'Charge Name is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'Ex Rate is required' : '',
          // fcAmt: !table[table.length - 1].fcAmt ? 'FC Amt is required' : '',
          // sac: !table[table.length - 1].sac ? 'SAC is required' : '',
          // gst: !table[table.length - 1].gst ? 'TAX is required' : '',
          // qty: !table[table.length - 1].qty ? 'Qty is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : ''
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
  const handleSelectStateCode = (e) => {
    const value = e.target.value;
  
    // Find the selected state code from the list
    const selectedStateCode = stateCodeList.find((stateC) => stateC.stateCode === value);
  
    if (selectedStateCode) {
      let gstIn = selectedStateCode.gstin || 'UNREGISTERED';
  
      // If gstin exists but is invalid, log an error
      if (selectedStateCode.gstin && selectedStateCode.gstin !== 'UNREGISTERED') {
        console.error('It is UnRegistered CostInvoice So, does not have GST:', selectedStateCode.gstin);
      }
  
      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        stateCode: selectedStateCode.stateCode,
        state: selectedStateCode.state,
        supplierGstIn: gstIn,
      }));
      getCityName(formData.supplierCode,selectedStateCode.state)
    } else {
      console.error('No State Code found with the given code:', value);
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
  const getChargeAC = async () => {
    try {
      const response = await apiCalls('get', `/UrCostInvoiceGna/getChargeLedgerFromGroup?orgId=${orgId}`);
      setChargeLedgerList(response.paramObjectsMap.chargeCodeVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
    useEffect(() => {
      if (!editId) {
        calculateTotals();
        // calculateSummary();
      }
    }, [chargerCostInvoice, tdsCostInvoiceDTO]);
  
    const calculateTotals = () => {
      let totalBillAmt = 0;
      let totalLcAmount = 0;
      let totgstAmt = 0;
  
      const updatedChargerCostInvoice = chargerCostInvoice.map((item) => ({
        ...item,
        gstAmount: ((item.gstPercent * item.lcAmount) / 100).toFixed(2)
      }));
  
      updatedChargerCostInvoice.forEach((row) => {
        totalLcAmount += parseFloat(row.lcAmount || 0);
        totalBillAmt += parseFloat(row.billAmt || 0);
        totgstAmt += parseFloat(row.gstAmount || 0);
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
        totalChargeAmtlc: totalLcAmount,
        netAmtBillCurr: totalBillAmt - totalTds,
        actBillAmtLc: totalBillAmt - totalTds,
        roundOff: parseFloat(totalBillAmt - totalTds) - parseInt(totalBillAmt - totalTds)
        // taxAmountLc: (totalLcAmount - totgstAmt).toFixed(2),
        // netBillCurrAmt: updatedChargerCostInvoice.some((item) => item.currency === 'INR')
        //   ? (totalLcAmount - totalTds).toFixed(2)
        //   : totalBillAmt.toFixed(2)
      }));
    };
  
    const calculateSummary = () => {
      let totalBillAmt = 0;
      let totalLcAmount = 0;
      chargerCostInvoice.forEach((row) => {
        totalLcAmount += parseFloat(row.lcAmount || 0);
        totalBillAmt += parseFloat(row.billAmt || 0);
      });
      const totalTds = tdsCostInvoiceDTO.reduce((acc, row) => acc + parseFloat(row.totalTdsAmt || 0), 0);
      const roundedValue = Math.round(totalLcAmount - totalTds);
  
      setFormData((prev) => ({
        ...prev,
        // actBillCurrAmt: totalBillAmt.toFixed(2),
        // actLcAmt: (totalBillAmt - totalTds).toFixed(2),
        // netLcAmt: (totalLcAmount - totalTds).toFixed(2),
        // amtInWords: toWords(parseFloat(totalBillAmt)).toUpperCase()
        roundOff: (roundedValue - (totalLcAmount - totalTds)).toFixed(2),
      }));
    };
  
  const handleSave = async () => {
    console.log('save clicked');

    const errors = {};
    if (!formData.gstType) {
      errors.gstType = 'Tax Type is required';
    }
    if (!formData.supplierBillNo) {
      errors.supplierBillNo = 'Supplier Bill No is required';
    }
    if (!formData.supplierPlace) {
      errors.supplierPlace = 'Supplier GstInCode is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }

    let CostInvoiceValid = true;
    const newTableErrors = chargerCostInvoice.map((row) => {
      const rowErrors = {};
      if (!row.chargeLedger) {
        rowErrors.chargeLedger = 'Charge Ledger is required';
        CostInvoiceValid = false;
      }
      if (!row.rate) {
        rowErrors.rate = 'Rate is required';
        CostInvoiceValid = false;
      }
      if (!row.currency) {
        rowErrors.currency = 'Currency is required';
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
      if (!row.tdsPer) {
        rowErrors.tdsPer = 'Tds Percentage is required';
        tdsValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);
    setTdsCostErrors(tdsTableErrors);
    if (Object.keys(errors).length === 0 && CostInvoiceValid && tdsValid) {
      console.log('try called');
      const chargesUrCostInvoiceGnaVo = chargerCostInvoice.map((row) => ({
        ...(editId && { id: row.id }),
        chargeAccount: row.chargeAccount,
        chargeLedger: row.chargeLedger,
        currency: row.currency,
        exRate: parseInt(row.exRate),
        gstpercent: parseInt(row.gstPercent),
        rate: parseInt(row.rate),
      }));
      const tdsUrCostInvoiceGnaVo = tdsCostInvoiceDTO.map((row) => ({
        ...(editId && { id: row.id }),
        section: row.section,
        tdsWithHolding: row.tds,
        tdsWithHoldingPer: parseInt(row.tdsPer)
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        shipperRefNo: formData.shipperRefNo,
        otherInfo: formData.otherInfo,
        remarks: formData.remarks,
        gstType: formData.gstType,
        exRate: parseInt(formData.exRate),
        currency: formData.currency,
        creditDays: parseInt(formData.creditDays),
        dueDate: formData.dueDate,
        supplierBillDate: formData.supplierBillDate,
        supplierBillNo: formData.supplierBillNo,
        address: formData.address,
        supplierPlace: formData.supplierPlace,
        supplierGstIn: formData.supplierGstIn,
        supplierGstInCode: formData.stateCode,
        supplierCode: formData.supplierCode,
        supplierName: formData.supplierName,
        supplierType: formData.supplierType,
        active: true,
        chargesUrCostInvoiceGnaDTO: chargesUrCostInvoiceGnaVo,
        tdsUrCostInvoiceGnaDTO: tdsUrCostInvoiceGnaVo,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/UrCostInvoiceGna/updateCreateUrCostInvoiceGna`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'UR Cost Invoice Updated Successfully' : 'UR Cost Invoice Created successfully');
          getAllUrCostInvoiceByOrgId();
          getPartyName(formData.supplierType);
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'UR Cost Invoice Creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'UR Cost Invoice creation failed');
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
          <div className="d-flex flex-wrap justify-content-between mb-4" style={{ marginBottom: '20px' }}>
            <div className="d-flex">
              {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
              <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
              {/* {formData.mode === 'SUBMIT' ? '' : <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />} */}
            </div>
          </div>
          {!showForm && (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="UR Cost Invoice No"
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
                        value={formData.docDate || null}
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
                    {fieldErrors.purVoucherDate && <p className="dateErrMsg">Pur Voucher Date is required</p>}
                  </FormControl>
                </div>

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
                      <MenuItem value="VENDOR">VENDOR</MenuItem>
                    </Select>
                    {fieldErrors.supplierType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.supplierType}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" error={!!fieldErrors.supplierName}>
                    <InputLabel id="demo-simple-select-label-party">Supplier Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-party"
                      id="demo-simple-select-party"
                      label="Supplier Name"
                      required
                      value={formData.supplierName || ''}
                      onChange={handleSelectPartyChange}
                    >
                      {partyName &&
                        partyName.map((par, index) => (
                          <MenuItem key={index} value={par.partyName}>
                            {par.partyName}
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
                        value={formData.vdate}
                        onChange={(date) => handleDateChange('vdate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.vdate && <p className="dateErrMsg">V Date is required</p>}
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
                      name="supplierGstIn"
                      size="small"
                      multiline
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
                  <FormControl fullWidth size="small" error={!!fieldErrors.supplierPlace}>
                    <InputLabel id="demo-simple-select-label">Supplier Place</InputLabel>
                    <Select
                      labelId="supplierPlace"
                      label="supplierPlace"
                      value={formData.supplierPlace}
                      //  || (cityList.length === 1 ? cityList[0].city : '')
                      name="supplierPlace"
                      onChange={handleSelectCity}
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
                        value={formData.supplierBillDate ? dayjs(formData.supplierBillDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('supplierBillDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true, error: fieldErrors.supplierBillDate, helperText: fieldErrors.supplierBillDate }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                    <InputLabel id="demo-simple-select-label">{<span>Currency</span>}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Currency"
                      onChange={handleInputChange}
                      name="currency"
                      // value={formData.currency}
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
                      disabled
                      inputProps={{ maxLength: 30 }}
                      value={formData.exRate}
                      onChange={handleInputChange}
                      error={!!fieldErrors.exRate}
                      helperText={fieldErrors.exRate}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small"variant="outlined" error={!!fieldErrors.gstType}>
                    <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                    <Select
                      labelId="gstType"
                      name="gstType"
                      value={formData.gstType}
                      onChange={handleInputChange}
                      label="Tax Type"
                    >
                      <MenuItem value="INTER">INTER</MenuItem>
                      <MenuItem value="INTRA">INTRA</MenuItem>
                    </Select>
                    {fieldErrors.gstType && <FormHelperText style={{ color: 'red' }}>{fieldErrors.gstType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Shipper Ref No"
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
                        {/* )} */}
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive mb-3">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    {/* {formData.mode === 'SUBMIT' ? (
                                      ''
                                    ) : ( */}
                                      <th className="table-header" style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    {/* )} */}
                                    <th className="table-header" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header">Charge Ledger</th>
                                    <th className="table-header">Charge Account</th>
                                    <th className="table-header">Currency</th>
                                    <th className="table-header">Ex Rate</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">TAX %</th>
                                    <th className="table-header">FC Amount</th>
                                    <th className="table-header">LC Amount</th>
                                    <th className="table-header">Bill Amount</th>
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
                                              value={row.chargeLedger}
                                              style={{ width: '150px' }}
                                              onChange={(e) => handleChargeCodeChange(e, index)}
                                              className={costInvoiceErrors[index]?.chargeLedger ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {chargeLedgerList?.map((item, index) => (
                                                <option key={index} value={item.chargeLedger}>
                                                  {item.chargeLedger}
                                                </option>
                                              ))}
                                            </select>
                                            {costInvoiceErrors[index]?.chargeLedger && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {costInvoiceErrors[index].chargeLedger}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              value={row.chargeAccount}
                                              style={{ width: '150px' }}
                                              onChange={(e) => handleChargeCodeChange(e, index)}
                                              className={costInvoiceErrors[index]?.chargeAccount ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {chargeLedgerList?.map((item, index) => (
                                                <option key={index} value={item.chargeLedger}>
                                                  {item.chargeLedger}
                                                </option>
                                              ))}
                                            </select>
                                            {costInvoiceErrors[index]?.chargeAccount && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {costInvoiceErrors[index].chargeAccount}
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
                                              type="text"
                                              value={row.exRate}
                                              style={{ width: '100px' }}
                                              disabled
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const numericRegex = /^[0-9]*$/;
                                                if (numericRegex.test(value)) {
                                                  setChargerCostInvoice((prev) =>
                                                    prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                                  );
                                                  setCostInvoiceErrors((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = { ...newErrors[index], exRate: !value ? 'Ex Rate is required' : '' };
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
                                              type="text"
                                              value={row.gstPercent}
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
                                                      gstPercent: !value ? 'Tax % is required' : ''
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
                                              value={row.billAmt ? row.billAmt : '0.00'}
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
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      billAmt: !value ? 'Settled is required' : ''
                                                    };
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
                                        </tr>
                                      ))}
                                    </>
                                  {/* // )} */}
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
                                        <th style={{ textAlign: 'center' }}>Tax Code</th>
                                        <th style={{ textAlign: 'center' }}>Currency</th>
                                        <th style={{ textAlign: 'center' }}>TAX %</th>
                                        <th style={{ textAlign: 'center' }}>LC Amount</th>
                                        <th style={{ textAlign: 'center' }}>Bill Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {chargeDetails.map((detail, idx) => (
                                        <tr key={idx}>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{idx + 1}</td>
                                          <td style={{ width: '300px', textAlign: 'center' }}>{detail.chargeLedger}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.chargeAccount}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.currency}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.gstPercent}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.lcAmount}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.billAmt}</td>
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
                              label="Tot. Charge Amt.(LC)"
                              name="totChargesLcAmt"
                              value={formData.totalChargeAmtlc}
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
                              name="netAmtBillCurr"
                              value={formData.netAmtBillCurr}
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
                              name="actBillLcAmt"
                              value={formData.actBillAmtLc}
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
                              label="GST Amount"
                              name="gstAmt"
                              value={formData.gstAmt}
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
                              label="Input"
                              name="input"
                              value={formData.input}
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
                              label="Output"
                              name="output"
                              value={formData.output}
                              size="small"
                              placeholder="0.00"
                              disabled
                              inputProps={{ maxLength: 30 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      {/* ))} */}
                    </>
                  )}
                </Box>
              </div>
            </>
          )}
          {showForm && (
            // <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllCostInvoiceById} />
            <CommonListViewTable
              data={data && data}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getAllUrCostInvoiceById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
          )}
          {downloadPdf && <GeneratePdfTemp row={pdfData} />}
        </div>
      </div>
    </>
  );
};
export default UrCostInvoicegna;
