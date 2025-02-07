import { useEffect, useState } from 'react';
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
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import ActionButton from 'utils/ActionButton';
import Button from '@mui/material/Button';
import GridOnIcon from '@mui/icons-material/GridOn';
import ToastComponent, { showToast } from 'utils/toast-component';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Chip, Stack } from '@mui/material';
import ConfirmationModal from 'utils/confirmationPopup';
import GeneratePdfTemp from 'utils/PdfTempTaxInvoice';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const CostDebitNote = () => {
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
  const [exRates, setExRates] = useState([]);
  const [originBillVo, setOriginBillVo] = useState([]);
  const [partyName, setPartyName] = useState([]);
  const [partyId, setPartyId] = useState('');
  const [docId, setDocId] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [jobNoList, setJobNoList] = useState([]);
  const [chargeCode, setChargeCode] = useState([]);
  const [showChargeDetails, setShowChargeDetails] = useState(false);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [approveStatus, setApproveStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [chargeDetails, setChargeDetails] = useState([
    {
      id: 1,
      chargeDesc: '',
      chargeCode: '',
      gChargeCode: '',
      gstPercent: '',
      sac: '',
      taxable: '',
      lcAmount: ''
    }
  ]);

  const [formData, setFormData] = useState({
    accuralid: '',
    actBillCurrAmt: '',
    actBillLcAmt: '',
    address: '',
    originBill: '',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    branch: '',
    jobOrderNo: '',
    normalCharges: '',
    gstLines: '',
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
    gstInputLcAmt: '',
    gstType: '',
    ipNo: '',
    latitude: '',
    mode: '',
    netBillCurrAmt: '',
    netBillLcAmt: '',
    originBill: '',
    originBillDate: '',
    otherInfo: '',
    payment: '',
    product: '',
    purVoucherDate: null,
    purVoucherNo: '',
    remarks: '',
    roundOff: '',
    shipperRefNo: '',
    supplierBillNo: '',
    supplierCode: '',
    supplierGstIn: '',
    supplierGstInCode: '',
    supplierName: '',
    supplierPlace: '',
    supplierType: 'VENDOR',
    totChargesBillCurrAmt: '',
    totChargesLcAmt: '',
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
      fcAmount: '',
      lcAmount: '',
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
      fcAmount: '',
      lcAmount: '',
      taxable: ''
    }
  ]);

  const [costDebitNoteTaxPrtculDTO, setTdsCostInvoiceDTO] = useState([
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
      accuralid: '',
      actBillCurrAmt: '',
      actBillLcAmt: '',
      address: '',
      originBill: '',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
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
      gstInputLcAmt: '',
      gstType: '',
      ipNo: '',
      latitude: '',
      mode: '',
      netBillCurrAmt: '',
      netBillLcAmt: '',
      otherInfo: '',
      product: '',
      payment: '',
      purVoucherDate: null,
      purVoucherNo: '',
      remarks: '',
      roundOff: '',
      shipperRefNo: '',
      supplierBillNo: '',
      supplierCode: '',
      supplierGstIn: '',
      supplierGstInCode: '',
      supplierName: '',
      supplierPlace: '',
      supplierType: 'VENDOR',
      totChargesBillCurrAmt: '',
      totChargesLcAmt: '',
      utrRef: ''
    });
    setExRates([]);
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
      payment: '',
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
        fcAmount: '',
        lcAmount: '',
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
    setCostInvoiceErrors([]);
    setTdsCostErrors([]);
    setEditId('');
    getCostDebitNoteDocId();
    setOriginBillVo([])
    setShowChargeDetails(false);
  };

  const listViewColumns = [
    { accessorKey: 'mode', header: 'Mode', size: 140 },
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'supplierName', header: 'Supplier Name', size: 140 },
    { accessorKey: 'gstType', header: 'GST Type', size: 140 }
  ];

  const handleOpenModalApprove = () => {
    setModalOpen(true);
    setApproveStatus('Approved');
  };

  const handleOpenModalReject = () => {
    setModalOpen(true);
    setApproveStatus('Rejected');
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmAction = async () => {
    try {
      const result = await apiCalls(
        'put',
        `/costdebitnote/approveCostDebitNote?action=${loginUserName}&actionBy=${loginUserName}&docId=${formData.docId}&id=${formData.id}&orgId=${orgId}`
      );
      console.log('API Response:==>', result);
      if (result.status === true) {
        setFormData({ ...formData, approveStatus: result.paramObjectsMap.taxInvoiceVO.approveStatus });
        showToast(
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved' ? 'success' : 'error',
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved'
            ? ' Cost Debit Note Approved successfully'
            : 'Cost Debit Note Rejected successfully'
        );
        const listValueVO = result.paramObjectsMap.taxInvoiceVO;
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
          salesType: listValueVO.salesType,
          updatedBy: listValueVO.updatedBy,
          supplierBillNo: listValueVO.supplierBillNo,
          supplierBillDate: listValueVO.supplierBillDate,
          billCurrRate: listValueVO.billCurrRate,
          exAmount: listValueVO.exAmount,
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
          totalInvAmountLc: listValueVO.totalInvAmountLc,
          roundOffAmountLc: listValueVO.roundOffAmountLc,
          totalChargeAmountBc: listValueVO.totalChargeAmountBc,
          totalInvAmountLc: listValueVO.totalInvAmountLc,
          totalInvAmountBc: listValueVO.totalInvAmountBc,
          totalChargeAmountBc: listValueVO.totalChargeAmountBc,
          totalTaxAmountBc: listValueVO.totalTaxAmountBc,
          totalInvAmountBc: listValueVO.totalInvAmountBc,
          totalTaxableAmountLc: listValueVO.totalTaxableAmountLc,
          amountInWords: listValueVO.amountInWords,
          billingRemarks: listValueVO.billingRemarks,
          amountInWords: listValueVO.amountInWords
        });
        handleCloseModal();
        console.log('TAX INVOICE:==>', result);
      } else {
        console.error('API Error:', result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotTdsWhAmnt = () => {
    const totalLcAmount = chargerCostInvoice.reduce((acc, curr) => acc + curr.lcAmount, 0);

    const updatedTdsCostInvoiceDTO = costDebitNoteTaxPrtculDTO.map((item) => {
      const tdsWithHoldingPer = parseFloat(item.tdsWithHoldingPer);
      const totTdsWhAmnt = tdsWithHoldingPer ? (totalLcAmount * tdsWithHoldingPer) / 100 : 0;
      return { ...item, totTdsWhAmnt: totTdsWhAmnt.toFixed(2) };
    });

    setTdsCostInvoiceDTO(updatedTdsCostInvoiceDTO);
  };

  useEffect(() => {
    calculateTotTdsWhAmnt();
  }, [chargerCostInvoice, costDebitNoteTaxPrtculDTO.map((item) => item.tdsWithHoldingPer)]);

  useEffect(() => {
    calculateTotals();
  }, [chargerCostInvoice, costDebitNoteTaxPrtculDTO]);

  const calculateTotals = () => {
    let totalBillAmt = 0;
    let totalLcAmount = 0;
    let totalGst = 0;

    chargerCostInvoice.forEach((row) => {
      totalBillAmt += parseFloat(row.billAmt || 0);
      totalLcAmount += parseFloat(row.lcAmount || 0);
      totalGst += parseFloat(row.gst || 0);
    });

    const totalTds = costDebitNoteTaxPrtculDTO.reduce((acc, row) => acc + parseFloat(row.totTdsWhAmnt || 0), 0);

    const roundOffDifference = (Math.round(totalLcAmount) - totalLcAmount).toFixed(2);

    const roundedLcAmount = Math.round(totalLcAmount);

    setFormData((prev) => ({
      ...prev,
      totChargesBillCurrAmt: totalBillAmt.toFixed(2),
      totChargesLcAmt: roundedLcAmount.toFixed(2),
      roundOff: roundOffDifference,
      actBillCurrAmt: (totalBillAmt + totalGst).toFixed(2),
      actBillLcAmt: (roundedLcAmount + totalGst - totalTds).toFixed(2),
      netBillCurrAmt: (totalBillAmt + totalGst - totalTds).toFixed(2),
      netBillLcAmt: (roundedLcAmount + totalGst - totalTds).toFixed(2),
      gstInputLcAmt: totalGst.toFixed(2)
    }));
  };

  useEffect(() => {
    getAllCostDebitNoteByOrgId();
    getCostDebitNoteDocId();
    getJobNoFromTmsJobCard();
    getChargeDetailsFromChargeType();
    getCurrencyAndExratesForMatchingParties();
  }, []);

  useEffect(() => {
    if (formData.supplierName) {
      getOrginBillNoByParty(formData.supplierName);
    }
  }, [formData.supplierName]);

  useEffect(() => {
    getPartyName(formData.supplierType);
  }, [formData.supplierType]);

  const getAllCostDebitNoteByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/costdebitnote/getCostDebitNoteByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.costDebitNoteVOs || []);
      console.log('costInvoiceVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getCostDebitNoteDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/costdebitnote/getCostDebitNoteDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.costDebitNoteDocId);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
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

  const getAllCostDebitNoteById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/costdebitnote/getCostDebitNoteById?id=${row.original.id}`);

      if (result) {
        const costVO = result.paramObjectsMap.costDebitNoteVOs[0];
        setEditId(row.original.id);
        getCurrencyAndExratesForMatchingParties(costVO.supplierName);
        setFormData({
          accuralid: costVO.accuralid,
          address: costVO.address,
          actBillCurrAmt: costVO.actBillCurrAmt,
          actBillLcAmt: costVO.actBillLcAmt,
          originBill: costVO.orginBill,
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
          gstInputLcAmt: costVO.gstInputLcAmt,
          gstType: costVO.gstType,
          mode: costVO.mode,
          netBillCurrAmt: costVO.netBillCurrAmt,
          netBillLcAmt: costVO.netBillLcAmt,
          orgId: orgId,
          otherInfo: costVO.otherInfo,
          payment: costVO.payment,
          product: costVO.product,
          purVoucherDate: costVO.purVoucherDate ? dayjs(costVO.purVoucherDate) : dayjs(),
          purVoucherNo: costVO.purVoucherNo,
          remarks: costVO.remarks,
          roundOff: costVO.roundOff,
          shipperRefNo: costVO.shipperRefNo,
          supplierBillNo: costVO.supplierBillNo,
          supplierCode: costVO.supplierCode,
          supplierGstIn: costVO.supplierGstIn,
          supplierGstInCode: costVO.supplierGstInCode,
          supplierName: costVO.supplierName,
          supplierPlace: costVO.supplierPlace,
          supplierType: costVO.supplierType,
          totChargesBillCurrAmt: costVO.totChargesBillCurrAmt,
          totChargesLcAmt: costVO.totChargesLcAmt,
          utrRef: costVO.utrRef
        });
        setChargerCostInvoice(
          costVO.normalCharges.map((row) => ({
            id: row.id,
            billAmt: row.billAmt,
            chargeCode: row.chargeCode,
            chargeLedger: row.chargeLedger,
            chargeName: row.chargeName,
            govChargeCode: row.govChargeCode,
            currency: row.currency,
            exRate: row.exRate,
            fcAmount: row.fcAmt,
            gst: row.gst,
            gstPercent: row.gstpercent,
            jobNo: row.jobNo,
            lcAmount: row.lcAmt,
            qty: row.qty,
            rate: row.rate,
            sac: row.sac,
            taxable: row.taxable
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
        setChargeDetails(
          costVO.gstLines.map((row) => ({
            id: row.id,
            chargeCode: row.chargeCode,
            chargeDesc: row.chargeName,
            gChargeCode: row.govChargeCode,
            gstPercent: row.gstpercent,
            sac: row.sac,
            lcAmount: row.lcAmt
          }))
        );
        setShowChargeDetails(true);
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

    console.log(`Field Name: ${name}, Field Value: ${value}, Field Type: ${fieldType}, Index: ${index}`);

    if (fieldType === 'costDebitNoteTaxPrtculDTO') {
      setTdsCostInvoiceDTO((prevData) => {
        const updatedData = [...prevData]; // Clone state
        updatedData[index] = { ...updatedData[index], [name]: value };
        return updatedData;
      });
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase()
    }));

    if (name === 'gstType') {
      if (formData.gstType !== value) {
        setChargerCostInvoice([{
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
        }]);
        setTdsCostInvoiceDTO([{
          section: '',
          tdsWithHolding: '',
          tdsWithHoldingPer: '',
          totTdsWhAmnt: ''
        }]);
        setShowChargeDetails(false);
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
    }
    else {
      console.log("All working fine");
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

    const selectedEmp = partyName.find((emp) => emp.partyName === value);

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        supplierName: selectedEmp.partyName,
        supplierCode: selectedEmp.partyCode
      }));
      getOrginBillNoByParty(selectedEmp.partyName);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const handleOriginBillChange = (e) => {
    const value = e.target.value;
    console.log(`Origin e.target.value`, e.target.value);

    const selectedBill = originBillVo.find((emp) => emp.docId === value);

    if (selectedBill) {
      console.log('Selected Employee:', selectedBill);
      setFormData((prevData) => ({
        ...prevData,

        actBillCurrAmt: selectedBill.actBillCurrAmt,
        actBillLcAmt: selectedBill.actBillLcAmt,
        customer: selectedBill.customer,
        // docDate: selectedBill.docDate ? dayjs(selectedBill.docDate) : dayjs(),
        finYear: finYear,
        gstInputLcAmt: selectedBill.gstInputLcAmt,
        netBillCurrAmt: selectedBill.netBillCurrAmt,
        netBillLcAmt: selectedBill.netBillLcAmt,
        originBillDate: selectedBill.docDate,
        product: selectedBill.product,
        roundOff: selectedBill.roundOff,
        supplierType: selectedBill.supplierType,
        totChargesBillCurrAmt: selectedBill.totChargesBillCurrAmt,
        totChargesLcAmt: selectedBill.totChargesLcAmt,
        originBill: selectedBill.docId,
        orgId: orgId,
        branch: selectedBill.branch,
        branchCode: selectedBill.branchCode,
        client: selectedBill.client,
        createdBy: loginUserName,
        accuralid: selectedBill.accuralid,
        address: selectedBill.address,
        exRate: selectedBill.exRate,
        dueDate: selectedBill.dueDate ? dayjs(selectedBill.dueDate) : dayjs(),
        creditDays: selectedBill.creditDays,
        currency: selectedBill.currency,
        gstType: selectedBill.gstType,
        otherInfo: selectedBill.otherInfo,
        payment: selectedBill.payment,
        purVoucherDate: selectedBill.purVoucherDate ? dayjs(selectedBill.purVoucherDate) : dayjs(),
        purVoucherNo: selectedBill.purVoucherNo,
        remarks: selectedBill.remarks,
        shipperRefNo: selectedBill.shipperRefNo,
        supplierBillNo: selectedBill.supplierBillNo,
        supplierGstIn: selectedBill.supplierGstIn,
        supplierGstInCode: selectedBill.supplierGstInCode,
        supplierPlace: selectedBill.supplierPlace,
        utrRef: selectedBill.utrRef
      }));
      setChargerCostInvoice(
        (selectedBill.chargerCostInvoiceVO || []).map((row) => ({
          id: row.id,
          jobNo: row.jobNo,
          chargeName: row.chargeName,
          chargeCode: row.chargeCode,
          chargeLedger: row.chargeLedger,
          sac: row.sac,
          contType: row.contType,
          currency: row.currency,
          exRate: row.exRate,
          fcAmt: row.fcAmt,
          gst: row.gst,
          billAmt: row.billAmt,
          gstPercent: row.gstpercent,
          tlcAmount: row.tlcAmount,
          gstAmount: row.gstAmount,
          ledger: row.ledger,
          govChargeCode: row.govChargeCode,
          exempted: row.exempted,
          qty: row.qty,
          rate: row.rate,
          taxable: row.taxable,
        }))
      );

      setTdsCostInvoiceDTO(
        (selectedBill.tdsCostInvoiceVO || []).map((row) => ({
          id: row.id,
          section: row.section,
          tdsWithHolding: row.tdsWithHolding,
          tdsWithHoldingPer: row.tdsWithHoldingPer,
          totTdsWhAmnt: row.totTdsWhAmnt,
        }))
      );

      setChargeDetails(
        (selectedBill.gstLines || []).map((row) => ({
          id: row.id,
          chargeCode: row.chargeCode,
          chargeDesc: row.chargeName,
          gChargeCode: row.govChargeCode,
          gstPercent: row.gstpercent,
          sac: row.sac,
          lcAmount: row.lcAmt,
        }))
      );

      setShowChargeDetails(true);
      console.log('DataToEdit', selectedBill);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const getOrginBillNoByParty = async (partyName) => {
    try {
      console.log(`Fetching OriginBillNo for partyCode: ${partyName}`);
      const response = await apiCalls(
        'get', `/costdebitnote/getOriginBillNofromCostInvoiceByParty?branchCode=${branchCode}&orgId=${orgId}&party=${partyName}`
      );

      console.log('API Response:', response);

      if (response?.status && Array.isArray(response.paramObjectsMap?.costInvoiceVO)) {
        setOriginBillVo(response.paramObjectsMap.costInvoiceVO);
      } else {
        console.warn('No data found for given parameters');
        setOriginBillVo([]); // Set empty array instead of null
      }
    } catch (error) {
      console.error('Error fetching Origin Bill No:', error);
      setOriginBillVo([]);
    }
  };

  const getCurrencyAndExratesForMatchingParties = async () => {
    if (!orgId) {
      console.error('Error: orgId is null or undefined');
      return;
    }
    try {
      const response = await apiCalls('get', `/costdebitnote/getCurrencyAndExrateDetails?orgId=${orgId}`);

      if (response?.paramObjectsMap?.currencyVO) {
        setExRates(response.paramObjectsMap.currencyVO);
      } else {
        console.error('Error: currencyVO not found in response');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const handleSelectStateChange = (e) => {
    const value = e.target.value;
    console.log('Selected GST State Code:', value);

    // Find the selected state in originBillVo instead of stateName
    const selectedState = originBillVo.find((state) => state.supplierGstInCode === value);

    if (selectedState) {
      setFormData((prevData) => {
        const updatedFormData = {
          ...prevData,
          supplierGstInCode: selectedState.supplierGstInCode, // Set the correct value
          stateNo: selectedState.stateNo || '', // Ensure values are valid
          supplierGstIn: selectedState.recipientGSTIN || ''
        };
        console.log('Updated FormData:', updatedFormData); // Debugging log
        return updatedFormData;
      });

      // If needed, update any dependent state variables
      setStateCode(selectedState.supplierGstInCode);

      // Call related functions
      getPlaceOfSupply(selectedState.supplierGstInCode);
      getGSTType(selectedState.supplierGstInCode);
    } else {
      console.log('No matching state found for code:', value);
    }
  };

  const handleSelectPlaceChange = (e) => {
    const value = e.target.value;
    console.log('Selected Supplier Place:', value);

    // Find the matching supplier place
    const selectedPlace = originBillVo.find((item) => item.supplierPlace === value);

    if (selectedPlace) {
      setFormData((prevData) => {
        const updatedFormData = {
          ...prevData,
          supplierPlace: selectedPlace.supplierPlace, // Ensure it's correctly set
        };
        console.log('Updated FormData:', updatedFormData); // Debugging log
        return updatedFormData;
      });
    } else {
      console.log('No matching supplier place found for:', value);
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

    setShowChargeDetails(false);

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
            govChargeCode: selectedChargeCodeData ? selectedChargeCodeData.govChargeCode : '',
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
    setShowChargeDetails(false);
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

  const handleFullGrid = async () => {
    if (!formData.gstType) {
      showToast('error', 'Please select a GST Type before proceeding!');
      console.error('Error: gstType is not selected in formData.');
      return;
    }

    if (chargerCostInvoice.length === 0) {
      showToast('error', 'No GST details found!');
      console.error('Error: chargerCostInvoice is empty.');
      setShowChargeDetails(false);
      return;
    }

    const uniqueGstPercents = [
      ...new Set(chargerCostInvoice.map((row) => row.gstPercent).filter((gstPercent) => gstPercent && gstPercent.length > 0))
    ];

    if (uniqueGstPercents.length === 0) {
      showToast('error', 'No valid GST percentages found!');
      console.error('Error: uniqueGstPercents is empty.');
      setShowChargeDetails(false);
      return;
    }

    try {
      let apiEndpoint = '';
      if (formData.gstType === 'INTER') {
        apiEndpoint = `/costInvoice/getChargeNameAndChargeCodeForIgst?orgId=${orgId}&gstTax=${uniqueGstPercents.join('&gstTax=')}`;
      } else if (formData.gstType === 'INTRA') {
        const cgstAndSgstPercents = uniqueGstPercents.flatMap((gstPercent) => {
          const half = (parseFloat(gstPercent) / 2).toFixed(1);
          return [half, half];
        });
        apiEndpoint = `/costInvoice/getChargeNameAndChargeCodeForCgstAndSgst?orgId=${orgId}&gstTax=${cgstAndSgstPercents.join('&gstTax=')}`;
      } else {
        showToast('error', 'Invalid GST Type selected!');
        console.error('Error: Invalid gstType in formData.');
        setShowChargeDetails(false);
        return;
      }

      const response = await apiCalls('get', apiEndpoint);
      const fetchedChargeDetails = response.paramObjectsMap?.chargeDetails || [];

      const groupedByGstPercent = chargerCostInvoice.reduce((acc, row) => {
        if (!row.gst || isNaN(Number(row.gst))) {
          showToast('error', 'Invalid or missing GST value.');
          console.error('Error: Invalid gst value in chargerCostInvoice.');
          setShowChargeDetails(false);
          return acc;
        }
        if (row.gstPercent && row.gstPercent.length > 0) {
          acc[row.gstPercent] = (acc[row.gstPercent] || 0) + parseFloat(row.gst || 0);
        }
        return acc;
      }, {});

      let updatedChargeDetails = [];

      if (formData.gstType === 'INTER') {
        updatedChargeDetails = Object.entries(groupedByGstPercent)
          .map(([gstPercent, gst]) => {
            const fetchedDetail = fetchedChargeDetails.find((detail) => Number(detail.gstPercent) === Number(gstPercent));

            if (!fetchedDetail) {
              console.error(`No fetched detail found for gstPercent: ${gstPercent}`);
              return null;
            }

            return {
              gstPercent: Number(gstPercent),
              lcAmount: gst.toFixed(2),
              ...fetchedDetail,
              chargeCode: fetchedDetail.chargeCode
            };
          })
          .filter(Boolean);
      } else if (formData.gstType === 'INTRA') {
        updatedChargeDetails = Object.entries(groupedByGstPercent).flatMap(([gstPercent, gst]) => {
          console.log('groupedByGstPercent', groupedByGstPercent);

          const halfGst = (gst / 2).toFixed(2);
          const halfGstPercent = (gstPercent / 2).toFixed(2);
          const fetchedDetails = fetchedChargeDetails.filter((detail) => Number(detail.gstPercent) === Number(halfGstPercent));
          console.log('fetchedDetails', fetchedDetails);
          if (!fetchedDetails.length) {
            console.error(`No fetched details found for gstPercent: ${gstPercent}`);
            return [];
          }

          return fetchedDetails.map((detail) => ({
            gstPercent: Number(detail.gstPercent),
            lcAmount: halfGst,
            ...detail,
            chargeCode: detail.chargeCode
          }));
        });
      }

      console.log('updatedChargeDetails', updatedChargeDetails);
      // setChargeDetails(updatedChargeDetails);
      setChargeDetails((prevDetails) => [...prevDetails, ...updatedChargeDetails]);
      setShowChargeDetails(true);
    } catch (error) {
      console.error('Error fetching charge details:', error);
      showToast('error', 'Failed to fetch charge details. Please try again.');
    }
  };

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
      fcAmount: '',
      lcAmount: '',
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
        fcAmount: '',
        lcAmount: '',
        taxable: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === chargerCostInvoice) {
      return (
        !lastRow.chargeCode ||
        // !lastRow.chargeLedger ||
        // !lastRow.chargeName ||
        !lastRow.currency ||
        // !lastRow.exRate ||
        // !lastRow.fcAmt ||
        // !lastRow.sac ||
        // !lastRow.gst ||
        // !lastRow.houseNo ||
        !lastRow.jobNo ||
        !lastRow.qty ||
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
          jobNo: !table[table.length - 1].jobNo ? 'Job No is required' : '',
          chargeCode: !table[table.length - 1].chargeCode ? 'Charge Code is required' : '',
          // chargeLedger: !table[table.length - 1].chargeLedger ? 'Charge Ledger is required' : '',
          // chargeName: !table[table.length - 1].chargeName ? 'Charge Name is required' : '',
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          // exRate: !table[table.length - 1].exRate ? 'EX Rate is required' : '',
          // fcAmt: !table[table.length - 1].fcAmt ? 'FC Amt is required' : '',
          // sac: !table[table.length - 1].sac ? 'SAC is required' : '',
          // gst: !table[table.length - 1].gst ? 'GST is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : '',
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

  const handleSave = async () => {
    console.log('save clicked');

    const errors = {};
    if (!formData.accuralid) {
      errors.accuralid = 'Accural ID is required';
    }
    if (!formData.creditDays) {
      errors.creditDays = 'Credit Days is required';
    }
    if (!formData.currency) {
      errors.currency = 'currency is required';
    }
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
    // if (!formData.supplierPlace) {
    //   errors.supplierPlace = 'Supplier Place is required';
    // }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }
    if (!formData.utrRef) {
      errors.utrRef = 'UTR Ref is required';
    }

    let CostInvoiceValid = true;
    const newTableErrors = chargerCostInvoice.map((row) => {
      const rowErrors = {};
      if (!row.chargeCode) {
        rowErrors.chargeCode = 'Charge Code is required';
        CostInvoiceValid = false;
      }
      if (!row.rate) {
        rowErrors.rate = 'Rate is required';
        CostInvoiceValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        CostInvoiceValid = false;
      }
      if (!row.currency) {
        rowErrors.currency = 'Currency is required';
        CostInvoiceValid = false;
      }
      if (!row.jobNo) {
        rowErrors.jobNo = 'Job No is required';
        CostInvoiceValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setCostInvoiceErrors(newTableErrors);

    let tdsValid = true;
    const tdsTableErrors = costDebitNoteTaxPrtculDTO.map((row) => {
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
        chargeCode: row.chargeCode,
        chargeLedger: row.chargeLedger,
        chargeName: row.chargeName,
        currency: row.currency,
        exRate: row.exRate,
        exempted: row.exempted,
        govChargeCode: row.govChargeCode,
        gst: row.gst,
        gstPercent: row.gstPercent,
        jobNo: row.jobNo,
        ledger: row.ledger,
        qty: row.qty,
        rate: row.rate,
        sac: row.sac,
        taxable: row.taxable
      }));
      const tdsVO = costDebitNoteTaxPrtculDTO.map((row) => ({
        ...(editId && { id: row.id }),
        section: row.section,
        tdsWithHolding: row.tdsWithHolding,
        tdsWithHoldingPer: row.tdsWithHoldingPer
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        accuralid: formData.accuralid,
        address: formData.address,
        approved: true,
        branch: branch,
        branchCode: branchCode,
        cancelRemarks: '',
        client: formData.client,
        costDebitChargesDTO: costVO,
        costDebitNoteTaxPrtculDTO: tdsVO,
        costType: formData.costType,
        createdBy: loginUserName,
        creditDays: formData.creditDays,
        currency: formData.currency,
        customer: formData.customer,
        dueDate: formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : dayjs(),
        exRate: formData.exRate,
        finYear: finYear,
        gstType: formData.gstType,
        invoiceDate: formData.invoiceDate,
        invoiceNo: formData.invoiceNo,
        mode: formData.mode,
        orginBill: formData.originBill,
        originBillDate: formData.originBillDate,
        orgId: orgId,
        otherInfo: formData.otherInfo,
        payment: formData.payment,
        product: formData.product,
        remarks: formData.remarks,
        shipperRefNo: formData.shipperRefNo,
        supplierBillNo: formData.supplierBillNo,
        supplierCode: formData.supplierCode,
        supplierGstIn: formData.supplierGstIn,
        supplierGstInCode: formData.supplierGstInCode,
        supplierName: formData.supplierName,
        supplierPlace: formData.supplierPlace,
        supplierType: formData.supplierType,
        utrRef: formData.utrRef,
        purVoucherDate: dayjs(formData.purVoucherDate).format('YYYY-MM-DD'),
        purVoucherNo: formData.purVoucherNo,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/costdebitnote/updateCreateCostDebitNote`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Cost Invoice Updated Successfully' : 'Cost Invoice Created successfully');
          getAllCostDebitNoteByOrgId();
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
          <div className="d-flex flex-wrap justify-content-between mb-4" style={{ marginBottom: '20px' }}>
            <div className="d-flex">
              <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            </div>

            {editId && showForm && (
              <>
                {formData.approveStatus === 'Approved' ? (
                  <Stack direction="row" spacing={2}>
                    <Chip label={`Approved By: ${formData.approveBy}`} variant="outlined" color="success" />
                    <Chip label={`Approved On: ${formData.approveOn}`} variant="outlined" color="success" />
                  </Stack>
                ) : formData.approveStatus === 'Rejected' ? (
                  <Stack direction="row" spacing={2}>
                    <Chip label={`Rejected By: ${formData.approveBy}`} variant="outlined" color="error" />
                    <Chip label={`Rejected On: ${formData.approveOn}`} variant="outlined" color="error" />
                  </Stack>
                ) : (
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
          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Document Id"
                    // label="Cost Invoice No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
                        // label="Cost Invoice Date"
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
                    <Select labelId="mode-label" label="Select Mode" name="mode" value={formData.mode || ''} onChange={handleInputChange}>
                      <MenuItem value="SUBMIT">SUBMIT</MenuItem>
                      <MenuItem value="EDIT">EDIT</MenuItem>
                    </Select>
                    {fieldErrors.mode && <FormHelperText style={{ color: 'red' }}>{fieldErrors.mode}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Pur Voucher No"
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
                      disabled={formData.mode === 'SUBMIT'}
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
                      disabled={formData.mode === 'SUBMIT'}
                      error={!!fieldErrors.supplierName}
                      helperText={fieldErrors.supplierName}
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
                    <InputLabel id="demo-simple-select-label-party">Origin Bill No</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-party"
                      id="demo-simple-select-party"
                      label="Origin Bill No"
                      required
                      value={formData.originBill || ''}
                      onChange={handleOriginBillChange}
                      disabled={formData.mode === 'SUBMIT'}
                      error={!!fieldErrors.originBill}
                      helperText={fieldErrors.originBill}
                    >
                      {originBillVo &&
                        originBillVo.map((par, index) => (
                          <MenuItem key={index} value={par.docId}>
                            {par.docId}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.originBill && <FormHelperText style={{ color: 'red' }}>{fieldErrors.originBill}</FormHelperText>}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="supplierGSTInCode">Supplier GST State Code</InputLabel>
                    <Select
                      labelId="supplierGSTInCode"
                      name="supplierGstInCode"
                      value={formData.supplierGstInCode || ''}
                      onChange={handleSelectStateChange}
                      label="Supplier GST Code"
                      disabled={!!formData.originBill} // Disable when originBill has a value
                      error={!!fieldErrors.supplierGstInCode}
                    >
                      {originBillVo &&
                        originBillVo.map((par, index) => (
                          <MenuItem key={index} value={par.supplierGstInCode}>
                            {par.supplierGstInCode}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.supplierGstInCode && (
                      <FormHelperText style={{ color: 'red' }}>
                        {fieldErrors.supplierGstInCode}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Supplier GSTIN"
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
                    <InputLabel id="supplierPlace">Supplier Place</InputLabel>
                    <Select
                      labelId="supplierPlace"
                      value={formData.supplierPlace || ''} // Ensure controlled value
                      name="supplierPlace"
                      onChange={handleSelectPlaceChange}
                      disabled={!!formData.originBill}
                      error={!!fieldErrors.supplierPlace}
                    >
                      {originBillVo && originBillVo.length > 0 ? (
                        originBillVo.map((par, index) => (
                          <MenuItem key={index} value={par.supplierPlace}>
                            {par.supplierPlace}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Options Available</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.supplierPlace && (
                      <FormHelperText style={{ color: 'red' }}>
                        {fieldErrors.supplierPlace}
                      </FormHelperText>
                    )}
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
                      disabled={!!formData.originBill}
                      error={!!fieldErrors.supplierBillNo}
                      helperText={fieldErrors.supplierBillNo}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                    <InputLabel id="demo-simple-select-label">
                      <span>
                        Currency
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Currency"
                      onChange={handleInputChange}
                      name="currency"
                      value={formData.currency || ''}
                      disabled={!!formData.originBill}
                    >
                      {originBillVo &&
                        originBillVo.map((par, index) => (
                          <MenuItem key={index} value={par.currency}>
                            {par.currency}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.currency && (
                      <FormHelperText style={{ color: 'red' }}>
                        Currency is required
                      </FormHelperText>
                    )}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                      disabled={!!formData.originBill}
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
                    <Tab value={0} label="Master/House Charges" />
                    <Tab value={1} label="TDS" />
                    <Tab value={2} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        {formData.mode === 'SUBMIT' ? (
                          ''
                        ) : (
                          <div className="mb-1">
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                          </div>
                        )}
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive mb-3">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    {formData.mode === 'SUBMIT' ? (
                                      ''
                                    ) : (
                                      <th className="table-header" style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    )}
                                    <th className="table-header" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header" >Job No</th>
                                    <th className="table-header">Charge Code</th>
                                    <th className="table-header">G-Charge Code</th>
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
                                  {formData.mode === 'SUBMIT' ? (
                                    <>
                                      {chargerCostInvoice.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="text-center">{index + 1}</td>

                                          {/* JobNo */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.jobNo}
                                              disabled
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* ChargeCode */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.chargeCode}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* govChargeCode */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.govChargeCode}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* chargeName */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.chargeName}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* taxable */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.taxable}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* qty */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.qty}
                                              style={{ whiteSpace: 'nowrap', width: '100px' }}
                                              disabled={formData.mode === 'SUBMIT'}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const numericRegex = /^[0-9]*$/;
                                                if (numericRegex.test(value)) {
                                                  handleRowUpdate(index, 'qty', value);
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
                                            />
                                          </td>
                                          {/* rate */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.rate}
                                              style={{ width: '100px' }}
                                              disabled={formData.mode === 'SUBMIT'}
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
                                          {/* currency */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.currency}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* exRate */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.exRate}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* fcAmount */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.fcAmount}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* lcAmount */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.lcAmount}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* billAmt */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.billAmt}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* sac */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.sac}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* gstPercent */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.gstPercent}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          {/* gst */}
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.gst}
                                              disabled={!!formData.originBill}
                                              style={{ whiteSpace: 'nowrap', width: '150px' }}
                                              className={costInvoiceErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </>
                                  ) : (
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
                                              value={row.jobNo}
                                              style={{ width: '150px' }}
                                              disabled={!!formData.originBill}
                                              onChange={(e) => {
                                                const selectedJobNo = e.target.value;
                                                const selectedCurrencyData = jobNoList.find((job) => job.jobNo === selectedJobNo);
                                                const updatedJobNoData = [...chargerCostInvoice];
                                                updatedJobNoData[index] = {
                                                  ...updatedJobNoData[index],
                                                  jobNo: selectedJobNo
                                                };
                                                setChargerCostInvoice(updatedJobNoData);
                                              }}
                                              className={costInvoiceErrors[index]?.jobNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {jobNoList &&
                                                jobNoList.map((job) => (
                                                  <option key={job.id} value={job.jobNo}>
                                                    {job.jobNo}
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
                                              disabled={!!formData.originBill}
                                              onChange={(e) => handleChargeCodeChange(e, index)}
                                              className={costInvoiceErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {chargeCode?.map((item, index) => (
                                                <option key={index} value={item.chargeCode}>
                                                  {item.chargeCode}
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
                                              disabled={formData.mode === 'SUBMIT'}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const numericRegex = /^[0-9]*$/;
                                                if (numericRegex.test(value)) {
                                                  handleRowUpdate(index, 'qty', value);
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
                                            />
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.rate}
                                              style={{ width: '100px' }}
                                              disabled={formData.mode === 'SUBMIT'}
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
                                            <select
                                              value={row.currency}
                                              style={{ width: '150px' }}
                                              disabled={!!formData.originBill}
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
                                              // value={row.gst ? row.gst.toFixed(2) : '0.00'}
                                              value={row.gst ? row.gst : '0.00'}
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
                                    </>
                                  )}
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
                                        <th style={{ textAlign: 'center' }}>Tax Code</th>
                                        <th style={{ textAlign: 'center' }}>Tax Desc</th>
                                        <th style={{ textAlign: 'center' }}>G-Tax Code</th>
                                        <th style={{ textAlign: 'center' }}>GST %</th>
                                        <th style={{ textAlign: 'center' }}>SAC</th>
                                        <th style={{ textAlign: 'center' }}>LC Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {chargeDetails.map((detail, idx) => (
                                        <tr key={idx}>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{idx + 1}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.chargeCode}</td>
                                          <td style={{ width: '300px', textAlign: 'center' }}>{detail.chargeDesc}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.gChargeCode}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.gstPercent}</td>
                                          <td style={{ width: '150px', textAlign: 'center' }}>{detail.sac}</td>
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
                      {costDebitNoteTaxPrtculDTO.map((row, index) => (
                        <div className="row mt-3">
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth size="small">
                              <InputLabel id="demo-simple-select-label">TDS / WH</InputLabel>
                              <Select
                                labelId="tds/wh"
                                name="tdsWithHolding"
                                value={costDebitNoteTaxPrtculDTO[index]?.tdsWithHolding || ''}
                                onChange={(e) => handleInputChange(e, 'costDebitNoteTaxPrtculDTO', index)}
                                disabled={formData.mode === 'SUBMIT' || !!formData.originBill}
                                // disabled={!!formData.originBill}
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
                                disabled
                                inputProps={{ maxLength: 30 }}
                                value={costDebitNoteTaxPrtculDTO[index]?.tdsWithHoldingPer || ''}
                                onChange={(e) => handleInputChange(e, 'costDebitNoteTaxPrtculDTO', index)}
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
                                value={costDebitNoteTaxPrtculDTO[index]?.section || ''}
                                onChange={(e) => handleInputChange(e, 'costDebitNoteTaxPrtculDTO', index)}
                                // disabled={formData.mode === 'SUBMIT'}
                                disabled={formData.mode === 'SUBMIT' || !!formData.originBill}
                                error={!!tdsCostErrors[index]?.section}
                                helperText={tdsCostErrors[index]?.section}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <TextField
                              label="Tot TDS/WH Amt"
                              size="small"
                              name="totTdsWhAmnt"
                              type="number"
                              disabled
                              inputProps={{ maxLength: 30 }}
                              value={costDebitNoteTaxPrtculDTO[index]?.totTdsWhAmnt || ''}
                              onChange={(e) => handleInputChange(e, 'costDebitNoteTaxPrtculDTO', index)}
                              error={!!tdsCostErrors[index]?.totTdsWhAmnt}
                              helperText={tdsCostErrors[index]?.totTdsWhAmnt}
                            />

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
                              label="Tot. Charge Amt.(Bill Curr)"
                              name="totChargesBillCurrAmt"
                              value={formData.totChargesBillCurrAmt}
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
                              name="netBillLcAmt"
                              value={formData.netBillLcAmt}
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
                              label="GST Input Amt(LC)"
                              name="gstInputLcAmt"
                              value={formData.gstInputLcAmt}
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
                              label="Tot. Charge Amt.(LC)"
                              name="totChargesLcAmt"
                              value={formData.totChargesLcAmt}
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
          ) : (
            // <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllCostInvoiceById} />
            <CommonListViewTable
              data={data && data}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getAllCostDebitNoteById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
          )}
          {downloadPdf && <GeneratePdfTemp row={pdfData} />}
        </div>
      </div>
      <ConfirmationModal
        open={modalOpen}
        title="Cost Debit Note Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this invoice?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseModal}
      />
    </>
  );
};
export default CostDebitNote;
