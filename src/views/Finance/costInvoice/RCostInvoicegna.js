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
  const [partyId, setPartyId] = useState('');
  const [stateName, setStateName] = useState([]);
  const [stateCode, setStateCode] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [chargeLedgerList, setchargeLedgerList] = useState([]);
  const [chargeCode, setChargeCode] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    purVoucherNo: '',
    purVoucherDate: null,
    partyType: 'VENDOR',
    partyName: '',
    partyCode: '',

    supplierGstIn: '',

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
    taxAmountLc: '',
  });

  const [chargerCostInvoice, setChargerCostInvoice] = useState([
    {
      chargeAC: '',
      currency: '',
      exRate: '',
      tdsApplicable: true,
      rate: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: '',
    }
  ]);
  const [costInvoiceErrors, setCostInvoiceErrors] = useState([
    {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: '',
        rate: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: '',
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
  const handleClear = () => {
    setFormData({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: null,
      partyType: 'VENDOR',
      partyName: '',
      partyCode: '',
  
      supplierGstIn: '',
  
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
      taxAmountLc: '',
    });
    setExRates([]);
    setStateName([]);
    getAllActiveCurrency(orgId);
    setFieldErrors({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: null,
      partyType: '',
      partyName: '',
      partyCode: '',
  
      supplierGstIn: '',
  
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
      taxAmountLc: '',
    });
    setChargerCostInvoice([
      {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: '',
        rate: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: '',
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
    setCostInvoiceErrors([]);
    setTdsCostErrors([]);
    setSectionOptions([]);
    setEditId('');
    getRCostInvoiceDocId();
  };
  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };

  const handleSaveClear = () => {
    setFormData({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: null,
      partyType: 'VENDOR',
      partyName: '',
      partyCode: '',
  
      supplierGstIn: '',
  
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
      taxAmountLc: '',
    });
    setExRates([]);
    // setStateName([]);
    getAllActiveCurrency(orgId);
    setFieldErrors({
      docId: '',
      docDate: dayjs(),
      purVoucherNo: '',
      purVoucherDate: null,
      partyType: '',
      partyName: '',
      partyCode: '',
  
      supplierGstIn: '',
  
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
      taxAmountLc: '',
    });
    setChargerCostInvoice([
      {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: '',
        rate: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: '',
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
    setCostInvoiceErrors([]);
    setTdsCostErrors([]);
    setSectionOptions([]);
    setEditId('');
    getRCostInvoiceDocId();
  };

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Cost Invoice No', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 }
  ];
  const calculateTotTdsWhAmnt = () => {
    const totalLcAmount = chargerCostInvoice.reduce((acc, curr) => acc + curr.lcAmount, 0);

    const updatedTdsCostInvoiceDTO = tdsCostInvoiceDTO.map((item) => {
      const tdsWithHoldingPer = parseFloat(item.tdsWithHoldingPer);
      const totTdsWhAmnt = tdsWithHoldingPer ? (totalLcAmount * tdsWithHoldingPer) / 100 : 0;
      return { ...item, totTdsWhAmnt: totTdsWhAmnt.toFixed(2) };
    });

    setTdsCostInvoiceDTO(updatedTdsCostInvoiceDTO);
  };

  // useEffect(() => {
  //   if (partyName.length === 1) {
  //     const defaultParty = partyName[0];
  //     console.log('defaultParty', defaultParty);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       partyName: defaultParty.partyName,
  //       partyCode: defaultParty.partyName
  //     }));
  //     setPartyId(defaultParty.id);
  //     getStateName(defaultParty.id);
  //     getCurrencyAndExratesForMatchingParties(defaultParty.partyName);
  //     getCreditDaysFromVendor(defaultParty.partyName);
  //     getTdsDetailsFromPartyMasterSpecialTDS(defaultParty.partyName);
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       partyCode: '',
  //       supplierGstIn: '',
  //       supplierGstInCode: ''
  //     }));
  //   }
  // }, [partyName]);

  // useEffect(() => {
  //   if (placeOfSupply.length === 1) {
  //     const defaultSupplierPlace = placeOfSupply[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       supplierPlace: defaultSupplierPlace.placeOfSupply
  //     }));
  //     getAddessType(defaultSupplierPlace.placeOfSupply);
  //     console.log('defaultSupplierPlace.supplierPlace', defaultSupplierPlace.placeOfSupply);
  //   }
  // }, [placeOfSupply]);

  // useEffect(() => {
  //   if (exRates.length === 1) {
  //     const defaultExRate = exRates[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       currency: defaultExRate.currency,
  //       // currency: defaultExRate.currency.toUpperCase(),
  //       exRate: defaultExRate.buyingExRate
  //     }));
  //     console.log('defaultExRate.exRate', defaultExRate.buyingExRate);
  //   }
  // }, [exRates]);

  // useEffect(() => {
  //   if (stateName.length === 1) {
  //     const defaultSGST = stateName[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       supplierGstInCode: defaultSGST.stateCode,
  //       // supplierGstInCode: defaultSGST.stateCode.toUpperCase(),
  //       stateNo: defaultSGST.stateNo,
  //       supplierGstIn: defaultSGST.recipientGSTIN
  //     }));
  //     console.log('defaultSGST.supplierGstInCode', defaultSGST.stateCode);
  //     getPlaceOfSupply(defaultSGST.stateCode);
  //     setStateCode(defaultSGST.stateCode);
  //     getGSTType(defaultSGST.stateCode);
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       supplierGstIn: '',
  //       supplierGstInCode: ''
  //     }));
  //   }
  // }, [stateName]);

  useEffect(() => {
    calculateTotTdsWhAmnt();
  }, [chargerCostInvoice, tdsCostInvoiceDTO.map((item) => item.tdsWithHoldingPer)]);

  useEffect(() => {
    calculateTotals();
  }, [chargerCostInvoice, tdsCostInvoiceDTO]);

  const calculateTotals = () => {
    let totalBillAmt = 0;
    let totalLcAmount = 0;
    let totalGst = 0;

    chargerCostInvoice.forEach((row) => {
      totalBillAmt += parseFloat(row.billAmount || 0);
      totalLcAmount += parseFloat(row.lcAmount || 0);
      totalGst += parseFloat(row.gst || 0);
    });

    const totalTds = tdsCostInvoiceDTO.reduce((acc, row) => acc + parseFloat(row.totTdsWhAmnt || 0), 0);

    const roundOffDifference = (Math.round(totalLcAmount) - totalLcAmount).toFixed(2);

    const roundedLcAmount = Math.round(totalLcAmount);

    setFormData((prev) => ({
      ...prev,
      totChargesBillCurrAmt: totalBillAmt.toFixed(2),
      taxAmountLc: roundedLcAmount.toFixed(2),
      roundOff: roundOffDifference,
      actBillCurrAmt: (totalBillAmt + totalGst).toFixed(2),
      actBillLcAmt: (roundedLcAmount + totalGst - totalTds).toFixed(2),
      netBillCurrAmt: (totalBillAmt + totalGst - totalTds).toFixed(2),
      netLcAmt: (roundedLcAmount + totalGst - totalTds).toFixed(2),
      amtInWords: totalGst.toFixed(2)
    }));
  };

  useEffect(() => {
    getAllCostInvoiceByOrgId();
    getRCostInvoiceDocId();
    getchargeLedgerFromTmsJobCard();
    getChargeDetailsFromChargeType();
  }, []);

  useEffect(() => {
    getPartyName(formData.partyType);
  }, [formData.partyType]);

  const getAllCostInvoiceByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/costInvoice/getAllCostInvoiceByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.costInvoiceVO.reverse() || []);
      console.log('costInvoiceVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getRCostInvoiceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/costInvoice/getRCostInvoiceDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
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

  const getchargeLedgerFromTmsJobCard = async () => {
    try {
      const response = await apiCalls('get', `/costInvoice/getchargeLedgerFromTmsJobCard?orgId=${orgId}`);
      setchargeLedgerList(response.paramObjectsMap.chargeLedger);
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
  const getAllRCostInvoiceById = async (row) => {
    console.log('first', row);
    setShowForm(false);
    try {
      const result = await apiCalls('get', `/costInvoice/getAllRCostInvoiceById?id=${row.original.id}`);

      if (result) {
        const costVO = result.paramObjectsMap.costInvoiceVO[0];
        setListViewData(costVO);
        setEditId(row.original.id);
        getCurrencyAndExratesForMatchingParties(costVO.partyCode);
        getTdsDetailsFromPartyMasterSpecialTDS(costVO.partyCode);
        getStateName(partyId);
        getPlaceOfSupply(costVO.supplierGstInCode);
        setFormData({
          docId: costVO.docId,
          docDate: costVO.docDate ? dayjs(costVO.docDate) : dayjs(),
          purVoucherNo: costVO.purVoucherNo,
          purVoucherDate: costVO.purVoucherDate ? dayjs(costVO.purVoucherDate) : dayjs(),
          partyType: costVO.partyType,
          partyName: costVO.partyName,
          partyCode: costVO.partyCode,
      
          supplierGstIn: costVO.supplierGstIn,
      
          supplierPlace: costVO.supplierPlace,
          address: costVO.address,
          supplierBillNo: costVO.supplierBillNo,
          supplierDate: costVO.supplierDate ? dayjs(costVO.supplierDate) : dayjs(),
          currency: costVO.currency,
          exRate: costVO.exRate,
          creditDays: costVO.creditDays,
          dueDate: costVO.dueDate ? dayjs(costVO.dueDate) : dayjs(),
          gstType: costVO.gstType,
          remarks: costVO.remarks,
      // Summary
          actBillCurrAmt: costVO.actBillCurrAmt,
          netBillCurrAmt: costVO.netBillCurrAmt,
          actLcAmt: costVO.actLcAmt,
          netLcAmt: costVO.netLcAmt,
          amtInWords: costVO.amtInWords,
          roundOff: costVO.roundOff,
          taxAmountLc: costVO.taxAmountLc,
          createdBy: loginUserName,
          finYear: finYear,
          orgId: orgId,
        });
        setChargerCostInvoice(
          costVO.normalCharges.map((row) => ({
            id: row.id,
            chargeAC: row.chargeAC,
            currency: row.currency,
            exRate: row.exRate,
            tdsApplicable: row.tdsApplicable,
            rate: row.rate,
            lcAmount: row.lcAmount,
            billAmount: row.billAmount,
            gtaAmount: row.gtaAmount,
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
        getAllSectionName(costVO.tdsCostInvoiceVO[0].tdsWithHolding);
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
            gst: '',
            gstPercent: '',
            chargeLedger: '',
            ledger: '',
            qty: '',
            rate: '',
            sac: '',
            fcAmount: '',
            lcAmount: '',
            taxable: ''
          }
        ]);

        setTdsCostInvoiceDTO([{ section: '', tdsWithHolding: '', tdsWithHoldingPer: '', totTdsWhAmnt: '' }]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          gstType: value,
          actBillCurrAmt: '',
          actBillLcAmt: '',
          amtInWords: '',
          netBillCurrAmt: '',
          netLcAmt: '',
          roundOff: '',
          totChargesBillCurrAmt: '',
          taxAmountLc: ''
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

      if (name === 'tdsWithHolding') {
        getAllSectionName(value);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
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
        partyName: selectedEmp.partyName,
        partyCode: selectedEmp.partyName
      }));
      setPartyId(selectedEmp.id);
      getStateName(selectedEmp.id);
      getCurrencyAndExratesForMatchingParties(selectedEmp.partyName);
      getTdsDetailsFromPartyMasterSpecialTDS(selectedEmp.partyName);
      getCreditDaysFromVendor(selectedEmp.partyName);
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

  const getCurrencyAndExratesForMatchingParties = async (partyName) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getCurrencyAndExratesForMatchingParties?orgId=${orgId}&partyName=${partyName}`);
      setExRates(response.paramObjectsMap.currencyVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getCreditDaysFromVendor = async (partyName) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getCreditDaysFromVendor?orgId=${orgId}&partyCode=${partyName}`);
      setFormData((prev) => ({
        ...prev,
        creditDays: response.paramObjectsMap.creditdays[0].creditDays
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getTdsDetailsFromPartyMasterSpecialTDS = async (partyName) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getTdsDetailsFromPartyMasterSpecialTDS?orgId=${orgId}&partyName=${partyName}`);

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

  const handleSelectPlaceChange = (e) => {
    const value = e.target.value;

    const selectedEmp = placeOfSupply.find((emp) => emp.placeOfSupply === value);

    if (selectedEmp) {
      setFormData((prevData) => ({
        ...prevData,
        supplierPlace: selectedEmp.placeOfSupply
      }));
      getAddessType(selectedEmp.placeOfSupply);
      console.log('selectedEmp.placeOfSupply', selectedEmp.placeOfSupply);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const getPlaceOfSupply = async (stateCode) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getPlaceOfSupply?orgId=${orgId}&id=${partyId}&stateCode=${stateCode}`);
      setPlaceOfSupply(response.paramObjectsMap.placeOfSupplyDetails);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getGSTType = async (stateCode) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getGstType?orgId=${orgId}&branchCode=${branchCode}&stateCode=${stateCode}`);

      setFormData((prevData) => ({
        ...prevData,
        gstType: response.paramObjectsMap.gstTypeDetails[0].gstType
      }));
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
      setFormData((prevData) => ({
        ...prevData,
        address: response.paramObjectsMap.partyAddress[0].address
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllSectionName = async (section) => {
    try {
      const response = await apiCalls('get', `master/getSectionNameFromTds?orgId=${orgId}&section=${section}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setSectionOptions(response.paramObjectsMap.tdsMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChargeCodeChange = async (e, index) => {
    const selectedChargeCode = e.target.value;
    const selectedChargeCodeData = chargeCode.find((item) => item.chargeCode === selectedChargeCode);

    const defaultStateValues = {
      qty: '',
      rate: '',
      currency: '',
      exRate: '',
      sac: '',
      gstPercent: ''
    };
    setChargerCostInvoice((prev) => {
      return prev.map((row, idx) => {
        if (idx === index) {
          return {
            ...row,
            ...defaultStateValues,
            chargeCode: selectedChargeCode,
            gstPercent: selectedChargeCodeData ? selectedChargeCodeData.GSTPercent : defaultStateValues.gstPercent,
            ccFeeApplicable: selectedChargeCodeData ? selectedChargeCodeData.ccFeeApplicable : '',
            chargeName: selectedChargeCodeData ? selectedChargeCodeData.chargeName : '',
            exempted: selectedChargeCodeData ? selectedChargeCodeData.exempted : '',
            ledger: selectedChargeCodeData ? selectedChargeCodeData.ledger : '',
            sac: selectedChargeCodeData ? selectedChargeCodeData.sac : defaultStateValues.sac,
            taxable: selectedChargeCodeData ? selectedChargeCodeData.taxable : ''
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

          const qty = Number(updatedRow.qty) || 0;
          const rate = Number(updatedRow.rate) || 0;
          const selectedCurrencyData = exRates.find((currency) => currency.currency === updatedRow.currency);
          const exRate = selectedCurrencyData?.buyingExRate || 1;

          const fcAmount = updatedRow.currency === 'INR' ? 0 : qty * rate;
          const lcAmount = qty * rate * exRate;
          const billAmt = lcAmount / exRate;
          const gst = (lcAmount * (updatedRow.gstPercent || 0)) / 100;

          return {
            ...updatedRow,
            exRate,
            fcAmount,
            lcAmount,
            billAmt,
            gst
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
      rate: '',
      lcAmount: '',
      billAmount: '',
      gtaAmount: '',
    };
    setChargerCostInvoice([...chargerCostInvoice, newRow]);
    setCostInvoiceErrors([
      ...costInvoiceErrors,
      {
        chargeAC: '',
        currency: '',
        exRate: '',
        tdsApplicable: '',
        rate: '',
        lcAmount: '',
        billAmount: '',
        gtaAmount: '',
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
      if (!row.tdsWithHolding) {
        rowErrors.tdsWithHolding = 'Tds With Holding is required';
        tdsValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setTdsCostErrors(tdsTableErrors);

    if (Object.keys(errors).length === 0 && CostInvoiceValid) {
      console.log('try called');
      const costVO = chargerCostInvoice.map((row) => ({
        ...(editId && { id: row.id }),
        chargeAC: row.chargeAC,
        currency: row.currency,
        exRate: row.exRate,
        tdsApplicable: row.tdsApplicable,
        rate: row.rate,
        lcAmount: row.lcAmount,
        billAmount: row.billAmount,
        gtaAmount: row.gtaAmount,
      }));
      const tdsVO = tdsCostInvoiceDTO.map((row) => ({
        ...(editId && { id: row.id }),
        section: row.section,
        tdsWithHolding: row.tdsWithHolding,
        tdsWithHoldingPer: row.tdsWithHoldingPer
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        createdBy: loginUserName,
        branchCode: branchCode,
        finYear: finYear,
        branch: branch,
        orgId: orgId,
        docId: formData.docId,
        docDate: formData.docDate,
        purVoucherNo: formData.purVoucherNo,
        partyType: formData.partyType,
        partyName: formData.partyName,
        partyCode: formData.partyCode,
        supplierGstIn: formData.supplierGstIn,
        supplierPlace: formData.supplierPlace,
        supplierBillNo: formData.supplierBillNo,
        address: formData.address,
        currency: formData.currency,
        exRate: formData.exRate,
        creditDays: formData.creditDays,
        gstType: formData.gstType,
        remarks: formData.remarks,
        actBillCurrAmt: formData.actBillCurrAmt,
        netBillCurrAmt: formData.netBillCurrAmt,
        actLcAmt: formData.actLcAmt,
        netLcAmt: formData.netLcAmt,
        amtInWords: formData.amtInWords,
        roundOff: formData.roundOff,
        taxAmountLc: formData.taxAmountLc,
        dueDate: formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : dayjs(),
        supplierDate: formData.supplierDate ? dayjs(formData.supplierDate, 'YYYY-MM-DD') : dayjs(),
        purVoucherDate : formData.purVoucherDate  ? dayjs(formData.purVoucherDate , 'YYYY-MM-DD') : dayjs(),
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/costInvoice/updateCreateCostInvoice`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Cost Invoice Updated Successfully' : 'Cost Invoice Created successfully');
          getAllCostInvoiceByOrgId();
          getPartyName(formData.partyType);
          // getStateName();
          // getPlaceOfSupply();
          handleSaveClear();
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
                    label="Cost Invoice No"
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
                      value={formData.partyName || (partyName.length === 1 ? partyName[0].partyName : '')}
                      
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
                      value={formData.supplierPlace || (placeOfSupply.length === 1 ? placeOfSupply[0].supplierPlace : '')}
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
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Supplier Date"
                        disabled
                        value={formData.supplierDate}
                        onChange={(date) => handleDateChange('supplierDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.supplierDate && <p className="dateErrMsg">Due Date is required</p>}
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
                      value={formData.currency || (exRates.length === 1 ? exRates[0].currency : '')}
                      
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
                  {/* <FormControl fullWidth size="small"> */}
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gstType}>
                    <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                    <Select
                      labelId="gstType"
                      name="gstType"
                      value={formData.gstType}
                      onChange={handleInputChange}
                      
                      label="TAX Type"
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
                                    {/* <th className="table-header">FC Amount</th> */}
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
                                              value={row.chargeLedger}
                                              style={{ width: '180px' }}
                                              onChange={(e) => {
                                                const selectedchargeLedger = e.target.value;
                                                const selectedCurrencyData = chargeLedgerList.find((job) => job.chargeLedger === selectedchargeLedger);
                                                const updatedchargeLedgerData = [...chargerCostInvoice];
                                                updatedchargeLedgerData[index] = {
                                                  ...updatedchargeLedgerData[index],
                                                  chargeLedger: selectedchargeLedger
                                                };
                                                setChargerCostInvoice(updatedchargeLedgerData);
                                              }}
                                              className={costInvoiceErrors[index]?.chargeLedger ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {chargeLedgerList &&
                                                chargeLedgerList.map((job) => (
                                                  <option key={job.id} value={job.chargeLedger}>
                                                    {job.chargeLedger}
                                                  </option>
                                                ))}
                                            </select>

                                            {costInvoiceErrors[index]?.chargeLedger && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {costInvoiceErrors[index].chargeLedger}
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
                                              // label="tdsApplicable"
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
                                              value={row.gtaAmt ? row.gtaAmt : '0.00'}
                                              style={{ width: '100px' }}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const numericRegex = /^[0-9]*$/;
                                                if (numericRegex.test(value)) {
                                                  setChargerCostInvoice((prev) =>
                                                    prev.map((r) => (r.id === row.id ? { ...r, gtaAmt: value } : r))
                                                  );
                                                  setCostInvoiceErrors((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      gtaAmt: !value ? 'TAX is required' : ''
                                                    };
                                                    return newErrors;
                                                  });
                                                } else {
                                                  setCostInvoiceErrors((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      gtaAmt: 'Only numeric characters are allowed'
                                                    };
                                                    return newErrors;
                                                  });
                                                }
                                              }}
                                              className={costInvoiceErrors[index]?.gtaAmt ? 'error form-control' : 'form-control'}
                                              // onKeyDown={(e) => handleKeyDown(e, row, chargerCostInvoice)}
                                            />
                                            {costInvoiceErrors[index]?.gtaAmt && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {costInvoiceErrors[index].gtaAmt}
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </>
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
                              <InputLabel id="demo-simple-select-label">TDS</InputLabel>
                              <Select
                                labelId="tds"
                                name="tdsWithHolding"
                                value={tdsCostInvoiceDTO[index]?.tdsWithHolding || ''}
                                onChange={(e) => handleInputChange(e, 'tdsCostInvoiceDTO', index)}
                                
                                label="TDS"
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
                                {sectionOptions.map((section, id) => (
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
                                name="tdsWithHoldingPer"
                                type="number"
                                disabled
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
                                label="Total TDS Amount"
                                size="small"
                                name="totTdsWhAmnt"
                                type="number"
                                disabled
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
                              name="actBillLcAmt"
                              value={formData.actBillLcAmt}
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
export default RCostInvoicegna;
