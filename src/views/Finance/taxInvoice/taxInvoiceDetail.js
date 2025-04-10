import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toWords } from 'number-to-words';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormControl, FormHelperText, Box, Button, Chip, Stack, TextField, InputLabel, MenuItem, Select } from '@mui/material';
import Tab from '@mui/material/Tab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import ActionButton from 'utils/ActionButton';
import ConfirmationModal from 'utils/confirmationPopup';
import GeneratePdfTemp from 'utils/PdfTempTaxInvoice';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import GstTable from './GstTable';

const TaxInvoiceDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [confirmData, setConfirmData] = useState([]);
  const [listView, setlistView] = useState(false);
  const [editId, setEditId] = useState('');
  const [partyId, setPartyId] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [approveStatus, setApproveStatus] = useState('');
  const [data, setData] = useState([]);
  const [listViewData, setListViewData] = useState([]);
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [addressType, setAddressType] = useState([]);
  const [chargeType, setChargeType] = useState([]);
  const [chargeCodeList, setChargeCodeList] = useState([]);
  const [chargeCodeCache, setChargeCodeCache] = useState(new Map());
  const [partyCurrencyList, setPartyCurrencyList] = useState([]);
  const [jobCardNo, setJobCardNo] = useState([]);
  const [gstTableData, setGstTableData] = useState({});
  const [value, setValue] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});
  const [partyNameList, setPartyNameList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stateName, setStateName] = useState([]);
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [formData, setFormData] = useState({
    address: '',
    addressType: '',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    billCurr: 'INR',
    billCurrRate: 1,
    // billCurr: '',
    // billCurrRate: '',
    billOfEntry: '',
    bizMode: 'TAX',
    bizType: 'B2B',
    creditDays: '',
    docId: '',
    docDate: dayjs(),
    gstType: '',
    invoiceDate: null,
    invoiceNo: '',
    jobNo: '',
    orgId: orgId,
    partyCode: '',
    partyId: '',
    partyName: '',
    partyType: 'CUSTOMER',
    pinCode: '',
    placeOfSupply: '',
    recipientGSTIN: '',
    remarks: '',
    shipperInvoiceNo: '',
    stateCode: '',
    stateNo: '',
    status: 'PROFORMA',
    supplierBillDate: '',
    supplierBillNo: '',
    vid: '',
    vdate: null
  });

  const [errors, setErrors] = useState({
    address: '',
    addressType: '',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    billCurr: '',
    billCurrRate: '',
    billOfEntry: '',
    bizMode: '',
    bizType: '',
    creditDays: '',
    gstType: '',
    invoiceDate: '',
    invoiceNo: '',
    jobNo: '',
    orgId: orgId,
    partyCode: '',
    partyId: '',
    partyName: '',
    partyType: '',
    pinCode: '',
    placeOfSupply: '',
    recipientGSTIN: '',
    remarks: '',
    shipperInvoiceNo: '',
    stateCode: '',
    stateNo: '',
    status: '',
    supplierBillDate: '',
    supplierBillNo: '',
    vid: '',
    vdate: null
  });

  const [withdrawalsTableData, setWithdrawalsTableData] = useState([
    {
      sno: '',
      chargeCode: '',
      chargeName: '',
      chargeType: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      GSTPercent: '',
      ledger: '',
      description: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    }
  ]);

  const [withdrawalsTableErrors, setWithdrawalsTableErrors] = useState([
    {
      sno: '',
      chargeCode: '',
      chargeName: '',
      chargeType: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      GSTPercent: '',
      ledger: '',
      description: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    }
  ]);

  const [taxInvoiceAnnexure, setTaxInvoiceAnnexure] = useState([
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

  const [taxInvoiceAnnexureErrors, setTaxInvoiceAnnexureErrors] = useState([
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

  const columns = [
    { accessorKey: 'vid', header: 'Invoice No', size: 140 },
    { accessorKey: 'vdate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 },
    { accessorKey: 'approveStatus', header: 'Approve Status', size: 140 },
    // { accessorKey: 'docDate', header: 'Prof.Inv.Date', size: 140 },
    // { accessorKey: 'partyCode', header: 'Party Code', size: 140 }
  ];

  useEffect(() => {
    getAllTaxInvoice();
    getTaxInvoiceDocId();
    getAllType();
    // getAllCurrency();
    getPartyName();
    // getJobCardNo();
  }, []);

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
        `/taxInvoice/approveTaxInvoice?orgId=${orgId}&action=${approveStatus}&actionBy=${loginUserName}&docId=${formData.docId}&id=${formData.id}`
      );
      console.log('API Response:==>', result);

      if (result.status === true) {
        setFormData({ ...formData, approveStatus: result.paramObjectsMap.taxInvoiceVO.approveStatus });
        showToast(
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved' ? 'success' : 'error',
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved'
            ? 'TaxInvoice Approved successfully'
            : 'TaxInvoice Rejected successfully'
        );
        const listValueVO = result.paramObjectsMap.taxInvoiceVO;
        setConfirmData(result.paramObjectsMap.taxInvoiceVO);
        getAddessType(listValueVO.placeOfSupply, listValueVO.stateCode, listValueVO.partyId);
        setFormData({
          docId: listValueVO.docId,
          partyId: listValueVO.partyId,
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
          remarks: listValueVO.remarks,
          billCurr: listValueVO.billCurr,
          status: listValueVO.status,
          updatedBy: listValueVO.updatedBy,
          supplierBillNo: listValueVO.supplierBillNo,
          supplierBillDate: listValueVO.supplierBillDate,
          vid: listValueVO.vid,
          vdate: listValueVO.vdate,
          billCurrRate: listValueVO.billCurrRate,
          creditDays: listValueVO.creditDays,
          shipperInvoiceNo: listValueVO.shipperInvoiceNo,
          billOfEntry: listValueVO.billOfEntry,
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
          billingRemarks: listValueVO.billingRemarks
          // amountInWords: listValueVO.amountInWords
        });
        handleCloseModal();
        getAllTaxInvoice();
        // setlistView(!listView);
        console.log('TAX INVOICE:==>', result);
      } else {
        console.error('API Error:', result.data);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllTaxInvoice = async () => {
    try {
      const result = await apiCalls(
        'get',
        `/taxInvoice/getAllTaxInvoiceByFinYearAndBranchCode?orgId=${orgId}&branchCode=${loginBranchCode}&finYear=${finYear}`
      );
      console.log('API Response:==>', result);

      if (result.status === true) {
        setData(result.paramObjectsMap.taxInvoiceVO);
        setlistView(true);
        console.log('TAX INVOICE:==>', result);
      } else {
        // Handle error
        console.error('API Error:', result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getTaxInvoiceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/taxInvoice/getTaxInvoiceDocId?branchCode=${loginBranchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.taxInvoiceDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(withdrawalsTableData)) {
      displayRowError(withdrawalsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      sno: '',
      chargeCode: '',
      chargeName: '',
      chargeType: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      GSTPercent: '',
      ledger: '',
      description: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    };
    setWithdrawalsTableData([...withdrawalsTableData, newRow]);
    setWithdrawalsTableErrors([
      ...withdrawalsTableErrors,
      {
        sno: '',
        chargeCode: '',
        chargeName: '',
        chargeType: '',
        currency: '',
        exRate: '',
        exempted: '',
        govChargeCode: '',
        GSTPercent: '',
        ledger: '',
        description: '',
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

    if (table === withdrawalsTableData) {
      return (
        !lastRow.chargeCode ||
        !lastRow.chargeName ||
        !lastRow.chargeType ||
        !lastRow.currency ||
        !lastRow.exRate ||
        !lastRow.exempted ||
        !lastRow.govChargeCode ||
        !lastRow.GSTPercent ||
        !lastRow.ledger ||
        !lastRow.description ||
        !lastRow.qty ||
        !lastRow.rate ||
        !lastRow.sac ||
        !lastRow.taxable
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === withdrawalsTableErrors) {
      setWithdrawalsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          chargeCode: !table[table.length - 1].chargeCode ? 'chargeCode is required' : '',
          chargeName: !table[table.length - 1].chargeName ? 'chargeName is required' : '',
          chargeType: !table[table.length - 1].chargeType ? 'chargeType is required' : '',
          currency: !table[table.length - 1].currency ? 'currency is required' : '',
          exRate: !table[table.length - 1].exRate ? 'exRate is required' : '',
          exempted: !table[table.length - 1].exempted ? 'exempted is required' : '',
          govChargeCode: !table[table.length - 1].govChargeCode ? 'govChargeCode is required' : '',
          GSTPercent: !table[table.length - 1].GSTPercent ? 'GSTPercent is required' : '',
          ledger: !table[table.length - 1].ledger ? 'ledger is required' : '',
          description: !table[table.length - 1].description ? 'description is required' : '',
          qty: !table[table.length - 1].qty ? 'qty is required' : '',
          rate: !table[table.length - 1].rate ? 'rate is required' : '',
          sac: !table[table.length - 1].sac ? 'sac is required' : '',
          taxable: !table[table.length - 1].taxable ? 'taxable is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (rowId) => {
    setWithdrawalsTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleAddAnnexureRow = () => {
    if (isLastRowAnnexureEmpty(taxInvoiceAnnexure)) {
      displayRowAnnexureError(taxInvoiceAnnexure);
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
    setTaxInvoiceAnnexure([...taxInvoiceAnnexure, newRow]);
    setTaxInvoiceAnnexureErrors([
      ...taxInvoiceAnnexureErrors,
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

    if (table === taxInvoiceAnnexure) {
      return (
        // !lastRow.amount ||
        // !lastRow.dsec ||
        // !lastRow.kitId ||
        // !lastRow.qty ||
        // !lastRow.rate ||
        // !lastRow.skuType ||
        !lastRow.transDate || !lastRow.transNo
      );
    }
    return false;
  };

  const displayRowAnnexureError = (table) => {
    if (table === taxInvoiceAnnexureErrors) {
      setWithdrawalsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          // amount: !table[table.length - 1].amount ? 'amount is required' : '',
          // dsec: !table[table.length - 1].dsec ? 'dsec is required' : '',
          // kitId: !table[table.length - 1].kitId ? 'kitId is required' : '',
          // qty: !table[table.length - 1].qty ? 'qty is required' : '',
          // rate: !table[table.length - 1].rate ? 'rate is required' : '',
          // skuType: !table[table.length - 1].skuType ? 'skuType is required' : '',
          transDate: !table[table.length - 1].transDate ? 'transDate is required' : '',
          transNo: !table[table.length - 1].transNo ? 'transNo is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRowAnnexure = (rowId) => {
    setTaxInvoiceAnnexure((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleCreateNewRow = (values) => {
    // Ensure that relevant fields in gstTaxInvoiceDTO are integers
    const updatedValues = {
      ...values,
      gstBdBillAmount: parseInt(values.gstBdBillAmount, 10),
      gstCrBillAmount: parseInt(values.gstCrBillAmount, 10),
      gstCrLcAmount: parseInt(values.gstCrLcAmount, 10),
      gstDbLcAmount: parseInt(values.gstDbLcAmount, 10)
    };

    setFormData((prevData) => ({
      ...prevData,
      gstTaxInvoiceDTO: [...prevData.gstTaxInvoiceDTO, updatedValues]
    }));
  };

  // const handleCreateNewRow1 = (values) => {
  //   // Ensure that 'qty' is an integer
  //   const updatedValues = {
  //     ...values,
  //     qty: parseInt(values.qty, 10)
  //   };

  //   setTableData1((prevData) => {
  //     const updatedData = [...prevData, updatedValues];

  //     // Update formData with the new tableData1
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       chargerTaxInvoiceDTO: updatedData
  //     }));

  //     console.log('Updated GSTTableData1', updatedData);
  //     return updatedData;
  //   });
  // };

  const handleClear = () => {
    setFormData({
      address: '',
      addressType: '',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      billCurr: 'INR',
      billCurrRate: 1,
      billOfEntry: '',
      bizMode: 'TAX',
      bizType: 'B2B',
      creditDays: '',
      docId: '',
      docDate: dayjs(),
      gstType: '',
      invoiceDate: null,
      invoiceNo: '',
      jobNo: '',
      partyCode: '',
      partyId: '',
      partyName: '',
      partyType: 'CUSTOMER',
      pinCode: '',
      placeOfSupply: '',
      recipientGSTIN: '',
      remarks: '',
      shipperInvoiceNo: '',
      stateCode: '',
      stateNo: '',
      status: 'PROFORMA',
      supplierBillDate: '',
      supplierBillNo: '',
      vid: '',
      vdate: null,
      totalChargeAmountLc: '',
      totalTaxAmountLc: '',
      totalInvAmountLc: '',
      roundOffAmountLc: '',
      totalChargeAmountBc: '',
      totalTaxAmountBc: '',
      totalInvAmountBc: '',
      totalTaxableAmountLc: '',
      amountInWords: ''
    });
    getTaxInvoiceDocId();
    setErrors({
      address: '',
      addressType: '',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      billCurr: '',
      billCurrRate: '',
      billOfEntry: '',
      bizMode: '',
      bizType: '',
      creditDays: '',
      gstType: '',
      invoiceDate: '',
      invoiceNo: '',
      jobNo: '',
      partyCode: '',
      partyId: '',
      partyName: '',
      partyType: '',
      pinCode: '',
      placeOfSupply: '',
      recipientGSTIN: '',
      remarks: '',
      shipperInvoiceNo: '',
      stateCode: '',
      stateNo: '',
      status: '',
      supplierBillDate: '',
      supplierBillNo: '',
      vid: '',
      vdate: null
    });
    setEditId('');
    setAddressType([]);
    setStateName([]);
    setPlaceOfSupply([]);
    setJobCardNo([]);
    // setChargeType([]);
    setChargeCodeList([]);
    setChargeCodeCache(new Map());
    setPartyCurrencyList([]);
    setListViewData('');
    setWithdrawalsTableErrors({
      sno: '',
      chargeCode: '',
      chargeName: '',
      chargeType: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      GSTPercent: '',
      ledger: '',
      description: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    });

    setWithdrawalsTableData([
      {
        sno: '',
        chargeCode: '',
        chargeName: '',
        chargeType: '',
        currency: '',
        exRate: '',
        exempted: '',
        govChargeCode: '',
        GSTPercent: '',
        ledger: '',
        description: '',
        qty: '',
        rate: '',
        sac: '',
        taxable: ''
      }
    ]);

    setTaxInvoiceAnnexure([
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

    setTaxInvoiceAnnexureErrors([
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

  const handleSaveClear = () => {
    setFormData({
      address: '',
      // addressType: '',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      billCurr: 'INR',
      billCurrRate: 1,
      billOfEntry: '',
      bizMode: 'TAX',
      bizType: 'B2B',
      creditDays: '',
      docId: '',
      docDate: dayjs(),
      gstType: '',
      invoiceDate: null,
      invoiceNo: '',
      jobNo: '',
      partyCode: '',
      partyId: '',
      partyName: '',
      partyType: 'CUSTOMER',
      pinCode: '',
      // placeOfSupply: '',
      recipientGSTIN: '',
      remarks: '',
      shipperInvoiceNo: '',
      // stateCode: '',
      stateNo: '',
      status: 'PROFORMA',
      supplierBillDate: '',
      supplierBillNo: '',
      vid: '',
      vdate: '',
      totalChargeAmountLc: '',
      totalTaxAmountLc: '',
      totalInvAmountLc: '',
      roundOffAmountLc: '',
      totalChargeAmountBc: '',
      totalTaxAmountBc: '',
      totalInvAmountBc: '',
      totalTaxableAmountLc: '',
      amountInWords: ''
    });
    getTaxInvoiceDocId();
    setErrors({
      address: '',
      // addressType: '',
      approveStatus: '',
      approveBy: '',
      approveOn: '',
      billCurr: '',
      billCurrRate: '',
      billOfEntry: '',
      bizMode: '',
      bizType: '',
      creditDays: '',
      gstType: '',
      invoiceDate: '',
      invoiceNo: '',
      jobNo: '',
      partyCode: '',
      partyId: '',
      partyName: '',
      partyType: '',
      pinCode: '',
      // placeOfSupply: '',
      recipientGSTIN: '',
      remarks: '',
      shipperInvoiceNo: '',
      // stateCode: '',
      stateNo: '',
      status: '',
      supplierBillDate: '',
      supplierBillNo: '',
      vid: '',
      vdate: ''
    });
    setEditId('');
    // setAddressType('');
    // setStateName('');
    // setPlaceOfSupply('');
    setWithdrawalsTableErrors({
      sno: '',
      chargeCode: '',
      chargeName: '',
      chargeType: '',
      currency: '',
      exRate: '',
      exempted: '',
      govChargeCode: '',
      GSTPercent: '',
      ledger: '',
      description: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    });

    setWithdrawalsTableData([
      {
        sno: '',
        chargeCode: '',
        chargeName: '',
        chargeType: '',
        currency: '',
        exRate: '',
        exempted: '',
        govChargeCode: '',
        GSTPercent: '',
        ledger: '',
        description: '',
        qty: '',
        rate: '',
        sac: '',
        taxable: ''
      }
    ]);
  };

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (partyNameList.length === 1) {
      const defaultPartyName = partyNameList[0];
      setFormData((prevData) => ({
        ...prevData,
        partyName: defaultPartyName.partyName,
        partyCode: defaultPartyName.partyCode
      }));
      getStateName(defaultPartyName.id);
      getJobCardNo(defaultPartyName.partyCode);
      getCurrencyAndExratesForMatchingParties(defaultPartyName.partyCode);
      console.log('State Code id', defaultPartyName.id);

      setPartyId(defaultPartyName.id);
      console.log('defaultPartyName.partyName', defaultPartyName.partyName);
    }
  }, [partyNameList]);

  // useEffect(() => {
  //   if (currencyList.length === 1) {
  //     const defaultCurrency = currencyList[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       billCurr: defaultCurrency.currency,
  //       billCurrRate: defaultCurrency.sellingExRate
  //     }));
  //     console.log('defaultCurrency.currency', defaultCurrency.currency);
  //   }
  // }, [currencyList]);

  // useEffect(() => {
  //   if (partyCurrencyList.length === 1) {
  //     const defaultCurrency = partyCurrencyList[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       billCurr: defaultCurrency.currency,
  //       billCurrRate: defaultCurrency.sellingExRate
  //     }));
  //     console.log('defaultCurrency.currency', defaultCurrency.currency);
  //   }
  // }, [partyCurrencyList]);

  // useEffect(() => {
  //   if (stateName.length > 0 && formData.stateCode) {
  //     const isValidState = stateName.some(state => state.stateCode === formData.stateCode);
  //     if (!isValidState) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         stateCode: ''  // Reset to empty if not found
  //       }));
  //     }
  //   }
  // }, [stateName, formData.stateCode]);

  useEffect(() => {
    if (stateName.length === 1) {
      const defaultStateCode = stateName[0];
      setFormData((prevData) => ({
        ...prevData,
        stateCode: defaultStateCode.stateCode,
        stateNo: defaultStateCode.stateNo,
        recipientGSTIN: defaultStateCode.recipientGSTIN
      }));
      if (defaultStateCode.stateCode) {
        setErrors((prev) => ({ ...prev, stateCode: '' }));
      }
      getPlaceOfSupply(defaultStateCode.stateCode);
      setStateCode(defaultStateCode.stateCode);
      getGSTType(defaultStateCode.stateCode);
      console.log('state code', defaultStateCode.stateCode);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        stateNo: '',
        recipientGSTIN: ''
      }));
    }
  }, [stateName]);

  useEffect(() => {
    if (placeOfSupply.length === 1) {
      const defaultPlaceOfSupply = placeOfSupply[0];
      setFormData((prevData) => ({
        ...prevData,
        placeOfSupply: defaultPlaceOfSupply.placeOfSupply
      }));
      if (defaultPlaceOfSupply.placeOfSupply) {
        setErrors((prev) => ({ ...prev, placeOfSupply: '' }));
      }
      getAddessType(defaultPlaceOfSupply.placeOfSupply, stateCode);
    }
  }, [placeOfSupply]);

  useEffect(() => {
    if (jobCardNo.length === 1) {
      const defaultJobCardNo = jobCardNo[0];
      setFormData((prevData) => ({
        ...prevData,
        jobNo: defaultJobCardNo.jobCard
      }));
    }
  }, [jobCardNo]);

  useEffect(() => {
    if (addressType.length === 1) {
      const defaultAddressType = addressType[0];
      setFormData((prevData) => ({
        ...prevData,
        addressType: defaultAddressType.addressType,
        address: defaultAddressType.address,
        pinCode: defaultAddressType.pinCode
      }));
      if (defaultAddressType.addressType) {
        setErrors((prev) => ({ ...prev, addressType: '' }));
      }
    }
  }, [addressType]);

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', listViewData);
    // setPdfData(listViewData)
    { confirmData.approveStatus === "Approved" ? setPdfData(confirmData) : setPdfData(listViewData); }
    setDownloadPdf(true);
  };

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${formData.partyType}`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getCreditDays = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getCreditDaysFromCustomer?customerCode=${partyCode}&orgId=${orgId}`);
      console.log('creitDays', response.paramObjectsMap.creditdays[0].creditDays);

      setFormData((prevData) => ({
        ...prevData,
        creditDays: response.paramObjectsMap.creditdays[0].creditDays
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getJobCardNo = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getJobCardForTaxInvoice?orgId=${orgId}&partyCode=${partyCode}`);
      setJobCardNo(response.paramObjectsMap.taxInvoiceVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getStateName = async (partId) => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyStateDetails?orgId=${orgId}&id=${partId}`);
      setStateName(response.paramObjectsMap.partyStateVO);

      // setStateCode(response.paramObjectsMap.partyMasterVO.partyStateVO)
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getPlaceOfSupply = async (stateCode, partyNo) => {
    try {
      const response = await apiCalls(
        'get',
        `/taxInvoice/getPlaceOfSupply?orgId=${orgId}&id=${partyNo ? partyNo : partyId}&stateCode=${stateCode}`
      );
      setPlaceOfSupply(response.paramObjectsMap.placeOfSupplyDetails);
      // setStateCode(response.paramObjectsMap.partyMasterVO.partyStateVO)
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAddessType = async (place, stateC, partyI) => {
    try {
      const response = await apiCalls(
        'get',
        `/taxInvoice/getPartyAddress?orgId=${orgId}&id=${partyI ? partyI : partyId}&stateCode=${stateC ? stateC : stateCode}&placeOfSupply=${place}`
      );
      setAddressType(response.paramObjectsMap.partyAddress);

      // setStateCode(response.paramObjectsMap.partyMasterVO.partyStateVO)
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getGSTType = async (state) => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getGstType?orgId=${orgId}&branchCode=${loginBranchCode}&stateCode=${state}`);

      setFormData((prevData) => ({
        ...prevData,
        gstType: response.paramObjectsMap.gstTypeDetails[0].gstType
      }));

      // setStateCode(response.paramObjectsMap.partyMasterVO.partyStateVO)
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllType = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getChargeType?orgId=${orgId}`);
      setChargeType(response.paramObjectsMap.chargeTypeVO);

      console.log('Test===>', response.paramObjectsMap.chargeTypeVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  // const getAllCurrency = async () => {
  //   try {
  //     const response = await apiCalls('get', `/taxInvoice/getCurrencyAndExrateDetails?orgId=${orgId}`);
  //     setCurrencyList(response.paramObjectsMap.currencyVO);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       billCurrRate: response.paramObjectsMap.currencyVO.sellingExRate,
  //     }));

  //     console.log('Test===>', response.paramObjectsMap.currencyVO);
  //   } catch (error) {
  //     console.error('Error fetching gate passes:', error);
  //   }
  // };

  // const getAllCurrency = async () => {
  //   try {
  //     const response = await apiCalls('get', `/taxInvoice/getCurrencyAndExrateDetails?orgId=${orgId}`);

  //     if (response?.paramObjectsMap?.currencyVO) {
  //       setCurrencyList(response.paramObjectsMap.currencyVO);
  //     } else {
  //       setCurrencyList([]); // Set an empty array if data is missing
  //     }
  //   } catch (error) {
  //     console.error('Error fetching currency details:', error);
  //     setCurrencyList([]); // Prevent undefined state
  //   }
  // };

  const getCurrencyAndExratesForMatchingParties = async (partyCode) => {
    try {
      const response = await apiCalls('get', `/costInvoice/getCurrencyAndExratesForMatchingParties?orgId=${orgId}&partyCode=${partyCode}`);

      if (response?.paramObjectsMap?.currencyVO) {
        setPartyCurrencyList(response.paramObjectsMap.currencyVO);
      } else {
        setPartyCurrencyList([]); // Set an empty array if data is missing
      }
    } catch (error) {
      console.error('Error fetching currency details:', error);
      setPartyCurrencyList([]); // Prevent undefined state
    }
  };

  // const getAllCurrency = async () => {
  //   try {
  //     const response = await apiCalls('get', `/taxInvoice/getCurrencyAndExrateDetails?orgId=${orgId}`);
  //     const currencyList = response.paramObjectsMap.currencyVO;

  //     setCurrencyList(currencyList);

  //     // Automatically set default currency (first in the list)
  //     if (currencyList.length > 0) {
  //       const defaultCurrency = currencyList[0];

  //       // setFormData((prevFormData) => ({
  //       //   ...prevFormData,
  //       //   currency: defaultCurrency.currency,
  //       //   billCurrRate: defaultCurrency.sellingExRate[defaultCurrency.id],
  //       // }));
  //       setFieldErrors((prevFieldErrors) => ({
  //         ...prevFieldErrors,
  //         currency: false,
  //       }));
  //     }

  //     console.log('Currency List:', currencyList);
  //   } catch (error) {
  //     console.error('Error fetching currency details:', error);
  //   }
  // };

  // Function to handle currency selection
  // const handleCurrencyChange = (name, value) => {
  //   if (name === 'currency') {
  //     const selectedCurrency = currencyList.find((currency) => currency.currency === value);
  //     if (selectedCurrency) {
  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         currency: value,
  //         exRate: selectedCurrency.sellingExRate,
  //       }));

  //       setFieldErrors((prevFieldErrors) => ({
  //         ...prevFieldErrors,
  //         currency: false,
  //       }));
  //     }
  //   }
  // };
  const getChargeCodeDetail = async (type, rowIndex) => {
    // Check if chargeCodeList for the type is already cached
    if (chargeCodeCache.has(type)) {
      // Update only the specific row's chargeCodeList
      setChargeCodeList((prevLists) => {
        const updatedLists = [...prevLists];
        updatedLists[rowIndex] = chargeCodeCache.get(type);
        return updatedLists;
      });
      console.log('chargeCodeCache.has(type)', chargeCodeList);
      return;
    }

    try {
      const response = await apiCalls('get', `/taxInvoice/getChargeCodeDetailsByChargeType?orgId=${orgId}&chargeType=${type}`);
      const chargeCodes = response.paramObjectsMap.chargeCodeVO || [];

      // Cache the response for future use
      setChargeCodeCache((prevCache) => new Map(prevCache).set(type, chargeCodes));
      console.log('setChargeCodeCache', chargeCodeCache);
      // Update only the specific row's chargeCodeList
      setChargeCodeList((prevLists) => {
        const updatedLists = [...prevLists];
        updatedLists[rowIndex] = chargeCodes;
        return updatedLists;
      });
      console.log('setChargeCodeList', chargeCodeList);
    } catch (error) {
      console.error('Error fetching charge codes:', error);
    }
  };

  // const getChargeCodeDetail = async (type) => {
  //   // Check if chargeCodeList for the type is already cached
  //   if (chargeCodeCache.has(type)) {
  //     setChargeCodeList(chargeCodeCache.get(type)); // Use cached data if available
  //     return;
  //   }

  //   try {
  //     const response = await apiCalls('get', `/taxInvoice/getChargeCodeDetailsByChargeType?orgId=${orgId}&chargeType=${type}`);
  //     const chargeCodes = response.paramObjectsMap.chargeCodeVO || [];

  //     // Cache the response for future use
  //     setChargeCodeCache((prevCache) => new Map(prevCache).set(type, chargeCodes));

  //     // Set chargeCodeList for current selection
  //     setChargeCodeList(chargeCodes);
  //   } catch (error) {
  //     console.error('Error fetching charge codes:', error);
  //   }
  // };

  // const getChargeCodeDetail = async (type) => {
  //   try {
  //     const response = await apiCalls('get', `/taxInvoice/getChargeCodeDetailsByChargeType?orgId=${orgId}&chargeType=${type}`);
  //     setChargeCodeList(response.paramObjectsMap.chargeCodeVO);
  //   } catch (error) {
  //     console.error('Error fetching gate passes:', error);
  //   }
  // };
  const calculateTotals = (rows, setFormData) => {
    const totalChargeAmountLc = rows.reduce((sum, row) => sum + parseFloat(row.lcAmount || 0), 0);
    const totalTaxAmountLc = rows.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0);
    const totalInvAmountLc = parseInt(totalChargeAmountLc) + parseInt(totalTaxAmountLc);
    const roundOffAmountLc = totalInvAmountLc;
    const totalChargeAmountBc = rows.reduce((sum, row) => sum + parseFloat(row.billAmount || 0), 0);
    const totalTaxAmountBc = rows.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0);
    const totalInvAmountBc = parseInt(totalChargeAmountBc) + parseInt(totalTaxAmountBc);
    const totalTaxableAmountLc = 0;

    setFormData((prev) => ({
      ...prev,
      totalChargeAmountLc,
      totalTaxAmountLc,
      totalInvAmountLc,
      roundOffAmountLc,
      totalChargeAmountBc,
      totalTaxAmountBc,
      totalInvAmountBc,
      totalTaxableAmountLc,
      amountInWords: toWords(parseFloat(totalInvAmountLc)).toUpperCase()
    }));
  };

  const handleSelectPartyChange = (e) => {
    const value = e.target.value;  
    console.log('Selected employeeCode value:', value);
    partyNameList.forEach((emp, index) => {
      console.log(`Employee ${index}:`, emp);
    });
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        partyName: selectedEmp.partyName,
        partyCode: selectedEmp.partyCode,
        partyId: selectedEmp.id
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        partyName:''
      }));
      getCreditDays(selectedEmp.partyCode);
      getJobCardNo(selectedEmp.partyCode);
      getCurrencyAndExratesForMatchingParties(selectedEmp.partyCode);
      getStateName(selectedEmp.id);
      setPartyId(selectedEmp.id);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const handleSelectStateChange = (e) => {
    const value = e.target.value; // Get the selected value (employeeCode)
    console.log('Selected employeeCode value:', value);

    // Find the selected employee from empList based on employeeCode
    const selectedEmp = stateName.find((emp) => emp.stateCode === value); // Check if 'empCode' is correct

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
      getGSTType(selectedEmp.stateCode);
      if (formData.stateCode || stateName === 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          stateCode: ''
        }))}
    } else {
      console.log('No employee found with the given code:', value); // Log if no employee is found
    }
  };
  const handleJobOrderNo = (e) => {
    const value = e.target.value; // Get the selected value (employeeCode)
    console.log('Selected JobOrderNo value:', value);
    const selectedJobOrder = jobCardNo.find((job) => job.jobCard === value); // Check if 'empCode' is correct
    if (selectedJobOrder) {
      console.log('Selected JobOrderNo onchange:', selectedJobOrder);
      setFormData((prevData) => ({
        ...prevData,
        jobNo: selectedJobOrder.jobCard
      }));
      console.log('Onchange joborderno', formData.jobNo);
    } else {
      console.log('No JobOrderNo found with the given code:', value);
    }
  };

  const handleSelectPlaceChange = (e) => {
    const value = e.target.value; // Get the selected value (employeeCode)
    console.log('Selected employeeCode value:', value);

    // Find the selected employee from empList based on employeeCode
    const selectedEmp = placeOfSupply.find((emp) => emp.placeOfSupply === value); // Check if 'empCode' is correct

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        placeOfSupply: selectedEmp.placeOfSupply
      }));
      getAddessType(selectedEmp.placeOfSupply, stateCode);
    } else {
      console.log('No employee found with the given code:', value);
    }
  };

  const handleSelectAddressTypeChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = addressType.find((emp) => emp.addressType === value);

    if (selectedEmp) {
      console.log('Selected Employee:', selectedEmp);
      setFormData((prevData) => ({
        ...prevData,
        addressType: selectedEmp.addressType,
        address: selectedEmp.address,
        pinCode: selectedEmp.pinCode
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        addressType:''
      }));
    } else {
      console.log('No employee found with the given code:', value);
    }
    
      setErrors((prevErrors) => ({
        ...prevErrors,
        addressType: formData.addressType ? '' : 'Address Type is required',
      }));
    
  };

  // const handleChangeField = (e) => {
  //   const { name, value } = e.target;
  //   if (name.startsWith('summaryTaxInvoiceDTO.')) {
  //     const summaryField = name.split('.')[1];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       summaryTaxInvoiceDTO: {
  //         ...prevData.summaryTaxInvoiceDTO,
  //         [summaryField]: summaryField === 'amountInWords' || summaryField === 'billingRemarks' ? value : parseInt(value, 10)
  //       }
  //     }));
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value
  //     });
  //   }
  // };

  const handleChangeField = (e) => {
    const { name, value } = e.target;
    const gstTaxInvoiceFields = ['gstdbBillAmount', 'gstcrBillAmount', 'gstDbLcAmount', 'gstCrLcAmount'];
    if (name.startsWith('summaryTaxInvoiceDTO.')) {
      const summaryField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        summaryTaxInvoiceDTO: {
          ...prevData.summaryTaxInvoiceDTO,
          [summaryField]: ['amountInWords', 'billingRemarks'].includes(summaryField) ? value : parseInt(value, 10)
        }
      }));
    } else if (name.startsWith('gstTaxInvoiceDTO.')) {
      const gstField = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        gstTaxInvoiceDTO: {
          ...prevData.gstTaxInvoiceDTO,
          [gstField]: gstTaxInvoiceFields.includes(gstField) ? parseInt(value, 10) : value
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const getTaxInvoiceById = async (row) => {
    setErrors({});
    setlistView(false);
    try {
      const result = await apiCalls('get', `/taxInvoice/getTaxInvoiceById?id=${row.original.id}`);
      setListViewData(result.paramObjectsMap.taxInvoiceVO);
      if (result.status === true) {
        const listValueVO = result.paramObjectsMap.taxInvoiceVO;
        setEditId(row.original.id);
        getStateName(listValueVO.partyId);
        // setGstTableData(row.original.taxInvoiceGstVO);
        setGstTableData(listValueVO.taxInvoiceGstVO);
        setPartyId(listValueVO.partyId);
        getPlaceOfSupply(listValueVO.stateCode, listValueVO.partyId);
        getJobCardNo(listValueVO.partyCode);
        getCurrencyAndExratesForMatchingParties(listValueVO.partyCode);
        getAddessType(listValueVO.placeOfSupply, listValueVO.stateCode, listValueVO.partyId);
        console.log('DataToEdit ==>', listValueVO);

        setFormData({
          address: listValueVO.address,
          addressType: listValueVO.addressType,
          amountInWords: listValueVO.amountInWords,
          approveBy: listValueVO.approveBy,
          approveOn: listValueVO.approveOn,
          approveStatus: listValueVO.approveStatus,
          billCurr: listValueVO.billCurr,
          billCurrRate: listValueVO.billCurrRate,
          billOfEntry: listValueVO.billOfEntry,
          billingRemarks: listValueVO.billingRemarks,
          bizMode: listValueVO.bizMode,
          bizType: listValueVO.bizType,
          creditDays: listValueVO.creditDays,
          docDate: listValueVO.docDate ? dayjs(listValueVO.docDate) : null,
          docId: listValueVO.docId,
          dueDate: listValueVO.dueDate ? dayjs(listValueVO.dueDate) : null,
          gstType: listValueVO.gstType,
          invoiceDate: listValueVO.invoiceDate ? dayjs(listValueVO.invoiceDate) : null,
          invoiceNo: listValueVO.invoiceNo ? listValueVO.invoiceNo : '',
          jobNo: listValueVO.jobOrderNo,
          partyCode: listValueVO.partyCode,
          partyId: listValueVO.partyId,
          partyName: listValueVO.partyName,
          partyType: listValueVO.partyType,
          pinCode: listValueVO.pinCode,
          placeOfSupply: listValueVO.placeOfSupply,
          recipientGSTIN: listValueVO.recipientGSTIN,
          roundOffAmountLc: listValueVO.roundOffAmountLc,
          shipperInvoiceNo: listValueVO.shipperInvoiceNo,
          stateCode: listValueVO.stateCode,
          stateNo: listValueVO.stateNo,
          status: listValueVO.status,
          supplierBillDate: listValueVO.supplierBillDate ? dayjs(listValueVO.supplierBillDate) : null,
          supplierBillNo: listValueVO.supplierBillNo,
          remarks: listValueVO.remarks,
          id: listValueVO.id,
          totalChargeAmountBc: listValueVO.totalChargeAmountBc,
          totalChargeAmountLc: listValueVO.totalChargeAmountLc,
          totalInvAmountBc: listValueVO.totalInvAmountBc,
          totalInvAmountLc: listValueVO.totalInvAmountLc,
          totalTaxAmountBc: listValueVO.totalTaxAmountBc,
          totalTaxAmountLc: listValueVO.totalTaxAmountLc,
          totalTaxableAmountLc: listValueVO.totalTaxableAmountLc,
          vid: listValueVO.vid,
          vdate: listValueVO.vdate ? dayjs(listValueVO.vdate) : null
        });

        if (listValueVO.taxInvoiceAnnexureVO.length === 0) {
          handleAddAnnexureRow();
        } else {
          setTaxInvoiceAnnexure(
            listValueVO.taxInvoiceAnnexureVO.map((row) => ({
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
        }

        // getPartyName(listValueVO.partType);

        // const selectedEmp = partyName.find((emp) => emp.partyName === value); // Check if 'empCode' is correct

        if (!listValueVO?.taxInvoiceDetailsVO) return;

        const mappedData = listValueVO.taxInvoiceDetailsVO.map((cl, index) => {
          // Call getChargeCodeDetail for each chargeType
          getChargeCodeDetail(cl.chargeType, index);

          return {
            billAmount: cl.billAmount,
            chargeCode: cl.chargeCode,
            chargeName: cl.chargeName,
            chargeType: cl.chargeType,
            currency: cl.currency,
            description: cl.description,
            exRate: cl.exRate,
            exempted: cl.exempted,
            fcAmount: cl.fcAmount,
            govChargeCode: cl.govChargeCode,
            gst: cl.gstAmount,
            GSTPercent: cl.gstpercent ? cl.gstpercent : cl.GSTPercent,
            id: cl.id,
            lcAmount: cl.lcAmount,
            ledger: cl.ledger,
            qty: cl.qty,
            rate: cl.rate,
            sac: cl.sac,
            taxable: cl.taxable,
            tlcAmount: cl.tlcAmount
          };
        });
        console.log('getChargeCodeDetail', mappedData);
        // Update state with mapped data
        setWithdrawalsTableData(mappedData);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleList = () => {
    setlistView(!listView);
    handleClear();
    // getAllTaxInvoice();
  };
  // const handleSelectChange = (e) => {
  //   const value = e.target.value; // Get the selected value (employeeCode)
  //   console.log('Selected employeeCode value:', value);

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     partyType: value
  //   }));
  //   getPartyName(value);
  // };

  const handleSave = async () => {
    const errors = {};

    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.stateCode) {
      errors.stateCode = 'State Code is required';
    }
    if (!formData.addressType) {
      errors.addressType = 'Address Type is required';
    }
    if (!formData.placeOfSupply) {
      errors.placeOfSupply = 'Place of Supply is required';
    }
    if (!formData.vid) {
      errors.vid = 'V Id is required';
    }
    if (!formData.vdate) {
      errors.vdate = 'V Date is required';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    console.log('invoiceDate', formData.invoiceDate);

    const detailsVo = withdrawalsTableData.map((row) => ({
      ...(editId && { id: row.id }),
      chargeCode: row.chargeCode,
      chargeName: row.chargeName,
      chargeType: row.chargeType,
      currency: row.currency,
      exRate: parseFloat(row.exRate),
      exempted: row.exempted,
      govChargeCode: row.govChargeCode,
      gstpercent: parseFloat(row.GSTPercent),
      ledger: row.ledger,
      description: row.description,
      qty: parseInt(row.qty),
      rate: parseInt(row.rate),
      sac: row.sac,
      taxable: row.taxable
    }));

    const isAnnexureEmpty = taxInvoiceAnnexure.every(
      (row) => !row.amount && !row.dsec && !row.kitId && !row.qty && !row.rate && !row.skuType && !row.transDate && !row.transNo
    );

    const annexureVO = isAnnexureEmpty
      ? null
      : taxInvoiceAnnexure.map((row) => ({
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
      billCurr: formData.billCurr,
      billCurrRate: parseFloat(formData.billCurrRate),
      billOfEntry: formData.billOfEntry,
      bizMode: formData.bizMode,
      bizType: formData.bizType,
      branch: branch,
      branchCode: loginBranchCode,
      createdBy: loginUserName,
      creditDays: parseInt(formData.creditDays),
      finYear: finYear,
      gstType: formData.gstType,
      invoiceNo: formData.invoiceNo,
      jobOrderNo: formData.jobNo,
      orgId: orgId,
      partyCode: formData.partyCode,
      partyId: parseInt(partyId),
      partyName: formData.partyName,
      partyType: formData.partyType,
      pinCode: formData.pinCode,
      placeOfSupply: formData.placeOfSupply,
      recipientGSTIN: formData.recipientGSTIN,
      remarks: formData.remarks,
      shipperInvoiceNo: formData.shipperInvoiceNo,
      stateCode: formData.stateCode,
      stateNo: formData.stateNo,
      status: formData.status,
      supplierBillDate: formData.supplierBillDate ? dayjs(formData.supplierBillDate).format('YYYY-MM-DD') : null,
      supplierBillNo: formData.supplierBillNo,
      vid: formData.vid,
      vdate: formData.vdate ? dayjs(formData.vdate).format('YYYY-MM-DD') : null,
      taxInvoiceDetailsDTO: detailsVo,
      taxInvoiceAnnexureDTO: annexureVO
    };

    console.log('DATA TO SAVE:', saveFormData);

    try {
      const response = await apiCalls('put', '/taxInvoice/updateCreateTaxInvoice', saveFormData);
      if (response.status === true) {
        showToast('success', editId ? 'Tax Invoice updated successfully' : 'Tax Invoice created successfully');
        getAllTaxInvoice();
        handleClear();
      } else {
        showToast('error', response.paramObjectsMap.errorMessage || 'Tax Invoice creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Tax Invoice creation failed');
    }
  };

  const handleDescriptionChange = (index, newDescription) => {
    const updatedRows = [...withdrawalsTableData];
    updatedRows[index].description = newDescription;
    setWithdrawalsTableData(updatedRows);
  };

  const handleAnnexureDescriptionChange = (index, newDescription) => {
    const updatedRows = [...taxInvoiceAnnexure];
    updatedRows[index].dsec = newDescription;
    setTaxInvoiceAnnexure(updatedRows);
  };

  const handleAnnexureInputChange = (index, field, value) => {
    setTaxInvoiceAnnexure((prev) =>
      prev.map((row, i) => {
        if (i === index) {
          let updatedRow = { ...row, [field]: value };
          if (field === 'qty' || field === 'rate') {
            const qty = parseFloat(updatedRow.qty) || 0;
            const rate = parseFloat(updatedRow.rate) || 0;
            updatedRow.amount = qty * rate;
          }

          return updatedRow;
        }
        return row;
      })
    );

    // Error Handling
    setTaxInvoiceAnnexureErrors((prev) => {
      const newErrors = [...prev];
      if (field === 'qty') {
        if (value === '' || isNaN(value)) {
          newErrors[index] = {
            ...newErrors[index],
            [field]: `${field} must be a valid number`
          };
        } else {
          newErrors[index] = {
            ...newErrors[index],
            [field]: ''
          };
        }
      } else if (field === 'transNo') {
        if (value.length > 20) {
          newErrors[index] = {
            ...newErrors[index],
            transNo: 'Transaction No cannot exceed 20 characters'
          };
        } else {
          newErrors[index] = {
            ...newErrors[index],
            transNo: ''
          };
        }
      }
      // else if (field === 'kitId') {
      //   const duplicate = taxInvoiceAnnexure.some((row, i) => row.kitId === value && i !== index);
      //   if (duplicate) {
      //     newErrors[index] = {
      //       ...newErrors[index],
      //       kitId: 'Duplicate Kit ID not allowed'
      //     };
      //   } else {
      //     newErrors[index] = {
      //       ...newErrors[index],
      //       kitId: ''
      //     };
      //   }
      // }
      else {
        newErrors[index] = {
          ...newErrors[index],
          [field]: ''
        };
      }
      return newErrors;
    });
  };

  const handleTableInputChange = (index, field, value) => {
    const updatedTableData = [...withdrawalsTableData];

    // Ensure value is treated as a number
    const numericValue = parseFloat(value) || 0;

    updatedTableData[index] = {
      ...updatedTableData[index],
      [field]: numericValue // Update the changed field
    };

    // Extract required values for calculation
    const qty = parseFloat(updatedTableData[index].qty) || 0;
    const rate = parseFloat(updatedTableData[index].rate) || 0;
    const exRate = parseFloat(updatedTableData[index].exRate) || 1; // Avoid division by zero
    const gstPercent = parseFloat(updatedTableData[index].GSTPercent) || 0;

    // Perform calculations
    const billAmount = qty * rate;
    const lcAmount = billAmount * exRate;
    const gstAmount = (billAmount * gstPercent) / 100;

    // Update dependent fields
    updatedTableData[index] = {
      ...updatedTableData[index],
      billAmount,
      lcAmount,
      gst: gstAmount
    };

    // Update state
    setWithdrawalsTableData(updatedTableData);
  };

  const handleTypeChange = (e, index) => {
    const { value } = e.target;
    const updatedData = [...withdrawalsTableData];
    updatedData[index] = {
      ...updatedData[index],
      chargeType: value,
      chargeCode: '', // Clear chargeCode when chargeType changes
      GSTPercent: '',
      ccFeeApplicable: '',
      chargeName: '',
      exempted: '',
      govChargeCode: '',
      ledger: '',
      sac: '',
      taxable: '',
      qty: '',
      rate: '',
      billAmount: '',
      lcAmount: ''
    };
    setWithdrawalsTableData(updatedData);
    getChargeCodeDetail(value, index); // Pass row index
  };

  // const handleTypeChange = (event) => {
  //   const newType = event.target.value;

  //   // Clear withdrawalsTableData (table values)
  //   setWithdrawalsTableData([
  //     {
  //       sno: '',
  //       chargeCode: '',
  //       chargeName: '',
  //       currency: '',
  //       exRate: '',
  //       exempted: '',
  //       govChargeCode: '',
  //       GSTPercent: '',
  //       ledger: '',
  //       qty: '',
  //       rate: '',
  //       sac: '',
  //       taxable: '',
  //       chargeType: newType
  //     }
  //   ]);
  //   getChargeCodeDetail(newType);
  //   // Clear formData (summary section)
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     totalChargeAmountLc: '',
  //     totalTaxAmountLc: '',
  //     totalInvAmountLc: '',
  //     roundOffAmountLc: '',
  //     totalChargeAmountBc: '',
  //     totalTaxAmountBc: '',
  //     totalInvAmountBc: '',
  //     totalTaxableAmountLc: '',
  //     amountInWords: '',
  //     gstType: '',
  //     invoiceDate: null
  //   }));

  //   // Update the type value
  //   // setWithdrawalsTableData((prevData) => ({
  //   //   ...prevData,
  //   //   chargeType: newType,
  //   // }));
  // };

  return (
    <>
      <ToastComponent />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row">
          <div className="d-flex flex-wrap justify-content-between mb-4" >
            <div className="justify-content-start mb-0">
              {editId && !listView && (formData.status.toUpperCase() === 'TAX' || listViewData.status.toUpperCase() === 'TAX') && (
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
                  {/* {listViewData.status === 'TAX' && (formData.approveStatus === 'Rejected' || formData.approveStatus === 'Approved') &&( */}
                  {listViewData.status === 'TAX' && formData.approveStatus !== 'Approved' && formData.approveStatus !== 'Rejected' && (
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
            <div className="justify-content-end">
              {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
              {/* <ActionButton title="Add" icon={AddIcon} /> */}
              {listView && (
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
                      color: '#1565c0',
                    },
                  }}
                  onClick={handleList}
                >
                  New
                </Button>
              )}
              {!listView && (
                <ActionButton
                  title="List View"
                  icon={FormatListBulletedTwoToneIcon}
                  onClick={handleList}
                />
              )}
              {!listView && (<ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />)}
              {listViewData.approveStatus === 'Approved' || listView ? '' : <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />}
              {!listView && ((listViewData.approveStatus === 'Approved' || formData.approveStatus === 'Approved') && (<ActionButton title="Pdf" icon={PictureAsPdfIcon} onClick={GeneratePdf} />))}
            </div>

          </div>
          {listView && (
            <div>
              {/* <CommonTable data={data} columns={columns} editCallback={editCity} countryVO={countryVO} stateVO={stateVO} /> */}

              <CommonListViewTable
                data={data && data}
                columns={columns}
                blockEdit={true}
                toEdit={getTaxInvoiceById}
              // isPdf={true}
              // GeneratePdf={GeneratePdf}
              />

            </div>
          )}
          {!listView && (
            <div className="d-flex flex-wrap justify-content-start row mt-0">
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Biz Type"
                    size="small"
                    required
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.bizType}
                    onChange={(e) => setFormData({ ...formData, bizType: e.target.value })}
                    error={!!errors.bizType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Biz Mode"
                    size="small"
                    required
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.bizMode}
                    onChange={(e) => setFormData({ ...formData, bizMode: e.target.value })}
                    error={!!errors.bizMode}
                  />
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Doc No"
                    size="small"
                    disabled
                    value={formData.docId}
                    onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                    error={!!errors.docId}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      format="DD-MM-YYYY"
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      value={formData.docDate ? dayjs(formData.docDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
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
                    error={!!errors.status}
                    disabled={formData.status === 'TAX' || !editId}
                  >
                    {editId && <MenuItem value="TAX">TAX</MenuItem>}
                    <MenuItem value="PROFORMA">PROFORMA</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Party Type
                  </InputLabel>
                  <Select
                    labelId="partyTypeLabel"
                    value={formData.partyType}
                    onChange={handleSelectChange}
                    label="Party Type"
                    required
                    error={!!errors.partyType}
                    helperText={errors.partyType}
                    // disabled={formData.status === 'TAX'}
                    disabled
                  >
                    <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                    <MenuItem value="VENDOR">VENDOR</MenuItem>
                  </Select>
                  // {errors.partyType && <FormHelperText style={{ color: 'red' }}>{errors.partyType}</FormHelperText>}
                </FormControl>
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Party Type"
                    size="small"
                    required
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.partyType}
                    // onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
                    error={!!errors.partyType}
                    helperText={errors.partyType}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label-party" error={!!errors.partyName}>Party Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label-party"
                    id="demo-simple-select-party"
                    label="Party Name"
                    required
                    value={formData.partyName || (partyNameList.length === 1 ? partyNameList[0].partyName : '')}
                    onChange={handleSelectPartyChange}
                    error={!!errors.partyName}
                    disabled={formData.status === 'TAX'}
                  >
                    {partyNameList &&
                      partyNameList.map((par, index) => (
                        <MenuItem key={index} value={par.partyName}>
                          {par.partyName}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.partyName && <FormHelperText style={{ color: 'red' }}>{errors.partyName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Party Code"
                    size="small"
                    required
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.partyCode}
                    onChange={(e) => setFormData({ ...formData, partyCode: e.target.value })}
                    error={!!errors.partyCode}
                    helperText={errors.partyCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="V Id"
                    disabled={editId}
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.vid}
                    onChange={(e) => {
                      setFormData({ ...formData, vid: e.target.value });
                      if (e.target.value) {
                        setErrors((prev) => ({ ...prev, vid: '' }));
                      }
                    }}
                    error={!!errors.vid}
                    helperText={errors.vid}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="V Date"
                      disabled={editId}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: { size: 'small', clearable: true, error: errors.vdate, helperText: errors.vdate }
                      }}
                      value={formData.vdate ? dayjs(formData.vdate) : null}
                      onChange={(newValue) => {
                        setFormData({ ...formData, vdate: newValue })
                        if (newValue) {
                          setErrors((prev) => ({ ...prev, vdate: '' }));
                        }
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" error={!!errors.stateCode} required>
                    State Code
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    value={formData.stateCode || (stateName.length === 1 ? stateName[0].stateCode : '')}
                    onChange={handleSelectStateChange}
                    label="State Code"
                    required
                    error={!!errors.stateCode}
                    disabled={formData.status === 'TAX'}
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
                  {errors.stateCode && <FormHelperText style={{ color: 'red' }}>{errors.stateCode}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="State No"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.stateNo}
                    onChange={(e) => setFormData({ ...formData, stateNo: e.target.value })}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Recipient Reg No"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.recipientGSTIN}
                    onChange={(e) => setFormData({ ...formData, recipientGSTIN: e.target.value })}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" error={!!errors.placeOfSupply} required>
                    Place Of Supply
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    disabled={formData.status === 'TAX'}
                    value={formData.placeOfSupply || (placeOfSupply.length === 1 ? placeOfSupply[0].placeOfSupply : '')}
                    onChange={handleSelectPlaceChange}
                    label="Place Of Supply"
                    required
                    error={!!errors.placeOfSupply}
                  >
                    {placeOfSupply &&
                      placeOfSupply.map((par, index) => (
                        <MenuItem key={index} value={par.placeOfSupply}>
                          {par.placeOfSupply}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.placeOfSupply && <FormHelperText style={{ color: 'red' }}>{errors.placeOfSupply}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" error={!!errors.addressType} required>
                    Address Type
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    disabled={formData.status === 'TAX'}
                    value={formData.addressType || (addressType.length === 1 ? addressType[0].addressType : '')}
                    onChange={handleSelectAddressTypeChange}
                    label="Address Type"
                    required
                    error={!!errors.addressType}
                  >
                    {addressType &&
                      addressType.map((par, index) => (
                        <MenuItem key={index} value={par.addressType}>
                          {par.addressType}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.addressType && <FormHelperText style={{ color: 'red' }}>{errors.addressType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Address"
                    size="small"
                    required
                    multiline
                    disabled
                    inputProps={{ maxLength: 100 }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    error={!!errors.address}
                  // helperText={errors.address || `${formData.address.length}/50`}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Pin Code"
                    size="small"
                    required
                    disabled
                    name="pinCode"
                    inputProps={{ maxLength: 30 }}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    error={!!errors.pinCode}
                  // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="TAX Type"
                    size="small"
                    required
                    disabled
                    name="gstType"
                    inputProps={{ maxLength: 30 }}
                    value={formData.gstType}
                    // onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
                    error={!!errors.gstType}
                  // helperText={errors.pincode}
                  />
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier Bill No"
                    disabled={formData.status === 'TAX'}
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierBillNo}
                    onChange={(e) => setFormData({ ...formData, supplierBillNo: e.target.value })}
                    error={!!errors.supplierBillNo}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Supplier Bill Date"
                      disabled={formData.status === 'TAX'}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      value={formData.supplierBillDate ? dayjs(formData.supplierBillDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, supplierBillDate: newValue })}
                    />
                  </LocalizationProvider>
                  {errors.supplierBillDate && <FormHelperText style={{ color: 'red' }}>{errors.supplierBillDate}</FormHelperText>}
                </FormControl>
              </div> */}

              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate}
                      onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div> */}

              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Currency
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    // value={formData.stateCode}
                    value={formData.billCurr || (currencyList.length === 1 ? currencyList[0].currency : '')}
                    // onChange={handleSelectStateChange}
                    // onChange={(e) => setFormData({ ...formData, billCurr: e.target.value })}
                    onChange={(e) => {
                      const selectedBillCurrency = e.target.value;

                      if (!currencyList || currencyList.length === 0) {
                        console.error('Currency list is empty or undefined.');
                        return;
                      }
                      const selectedBillCurrencyData = currencyList.find((currency) => currency.currency === selectedBillCurrency);
                      setFormData((prevData) => ({
                        ...prevData,
                        billCurr: selectedBillCurrency,
                        billCurrRate: selectedBillCurrencyData?.sellingExRate || 0 // Handle missing data gracefully
                      }));
                    }}
                    label="Currency"
                    required
                    error={!!errors.billCurr}
                    helperText={errors.billCurr}
                    disabled={formData.status === 'TAX'}
                  >
                    {currencyList?.length > 0 ? (
                      currencyList.map((par, index) => (
                        <MenuItem key={index} value={par.currency}>
                          {par.currency}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Currency available</MenuItem> // Fallback option
                    )}
                  </Select>
                  {errors.billCurr && <FormHelperText style={{ color: 'red' }}>{errors.billCurr}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Bill Curr Rate"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.billCurrRate}
                    onChange={(e) => setFormData({ ...formData, billCurrRate: e.target.value })}
                    error={!!errors.billCurrRate}
                    disabled
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      disabled={formData.status === 'TAX'}
                      value={formData.dueDate ? dayjs(formData.dueDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                  {errors.dueDate && <p className="dateErrMsg">Due Date is required</p>}
                </FormControl>
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Credit Days"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.creditDays}
                    onChange={(e) => setFormData({ ...formData, creditDays: e.target.value })}
                    error={!!errors.creditDays}
                    disabled
                  // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Job Card No
                  </InputLabel>
                  <Select
                    labelId="jobCardNo"
                    value={formData.jobNo || (jobCardNo.length === 1 ? jobCardNo[0].jobCard : '')}
                    onChange={handleJobOrderNo}
                    label="Job Card No"
                    required
                    error={!!errors.jobNo}
                    helperText={errors.jobNo}
                    disabled={formData.status === 'TAX'}
                  >
                    {jobCardNo?.length > 0 ? (
                      jobCardNo.map((par, index) => (
                        <MenuItem key={index} value={par.jobCard}>
                          {par.jobCard}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Job Card no available</MenuItem>
                    )}
                  </Select>
                  {errors.jobNo && <FormHelperText style={{ color: 'red' }}>{errors.jobNo}</FormHelperText>}
                </FormControl>
              </div>

              {/* <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Shipper Invoice No"
                    disabled={formData.status === 'TAX'}
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.shipperInvoiceNo}
                    onChange={(e) => setFormData({ ...formData, shipperInvoiceNo: e.target.value })}
                    error={!!errors.shipperInvoiceNo}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Bill Of Entry"
                    disabled={formData.status === 'TAX'}
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.billOfEntry}
                    onChange={(e) => setFormData({ ...formData, billOfEntry: e.target.value })}
                    error={!!errors.billOfEntry}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Invoice No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    error={!!errors.invoiceNo}
                    disabled
                  // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Invoice Date"
                      format="DD-MM-YYYY"
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      value={formData.invoiceDate ? dayjs(formData.invoiceDate) : null}
                      onChange={(newValue) => setFormData({ ...formData, invoiceDate: newValue })}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Remarks"
                    size="small"
                    multiline
                    disabled={formData.status === 'TAX'}
                    inputProps={{ maxLength: 250 }}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    error={!!errors.remarks}
                  // helperText={errors.remarks || `${formData.remarks.length}/50`}
                  />
                </FormControl>
              </div>
            </div>
          )}
        </div>

        <br></br>
        {!listView && (
          <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                    <Tab label="Charge Particulars" value="1" />
                    <Tab label="Annexure" value="2" />
                    <Tab label="Summary" value="3" />
                    {editId ? (
                      <Tab label="TAX" value="4">
                        {' '}
                      </Tab>
                    ) : (
                      ''
                    )}
                  </TabList>
                </Box>
                <TabPanel value="1">
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
                                {formData.status !== 'TAX' && (
                                  <th className="table-header" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                )}
                                <th className="table-header" style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="table-header">Type</th>
                                <th className="table-header">Charge Code</th>
                                {/* <th className="table-header">GCharge Code</th>
                                <th className="table-header">Charge Name</th>
                                <th className="table-header">Taxable</th> */}
                                <th className="table-header" style={{ width: '250px' }}>
                                  Description
                                </th>
                                <th className="table-header" style={{ width: '100px' }}>
                                  Qty
                                </th>
                                <th className="table-header" style={{ width: '100px' }}>
                                  Rate
                                </th>
                                <th className="table-header">Currency</th>
                                <th className="table-header">Ex Rate</th>
                                <th className="table-header">FC Amount</th>
                                <th className="table-header">LC Amount</th>
                                <th className="table-header">Bill Amount</th>
                                <th className="table-header">SAC</th>
                                <th className="table-header">TAX %</th>
                                <th className="table-header">TAX</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {Array.isArray(withdrawalsTableData) && */}
                              {withdrawalsTableData.map((row, index) => (
                                <tr key={row.id}>
                                  {formData.status !== 'TAX' && (
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            withdrawalsTableData,
                                            setWithdrawalsTableData,
                                            withdrawalsTableErrors,
                                            setWithdrawalsTableErrors
                                          )
                                        }
                                      />
                                    </td>
                                  )}
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    {/* <select
                                      value={row.chargeType}
                                      style={{ width: '150px' }}
                                      disabled={formData.status === 'TAX'}
                                      onChange={handleTypeChange}
                                      className={withdrawalsTableErrors[index]?.chargeType ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {chargeType &&
                                        chargeType.map((currency) => (
                                          <option key={currency.id} value={currency.chargeType}>
                                            {currency.chargeType}
                                          </option>
                                        ))}
                                    </select> */}
                                    <select
                                      value={row.chargeType}
                                      style={{ width: '150px' }}
                                      disabled={formData.status === 'TAX'}
                                      onChange={(e) => handleTypeChange(e, index)}
                                      className={withdrawalsTableErrors[index]?.chargeType ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {chargeType &&
                                        chargeType.map((currency) => (
                                          <option key={currency.id} value={currency.chargeType}>
                                            {currency.chargeType}
                                          </option>
                                        ))}
                                    </select>

                                    {withdrawalsTableErrors[index]?.chargeType && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].chargeType}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.chargeCode}
                                      style={{ width: '150px' }}
                                      disabled={formData.status === 'TAX'}
                                      onChange={(e) => {
                                        const selectedCurrency = e.target.value;
                                        const selectedCurrencyData = chargeCodeList[index]?.find(
                                          (currency) => currency.chargeCode === selectedCurrency
                                        );
                                        const updatedCurrencyData = [...withdrawalsTableData];
                                        updatedCurrencyData[index] = {
                                          ...updatedCurrencyData[index],
                                          chargeCode: selectedCurrency,
                                          GSTPercent: selectedCurrencyData?.GSTPercent || '',
                                          ccFeeApplicable: selectedCurrencyData?.ccFeeApplicable || '',
                                          chargeName: selectedCurrencyData?.chargeName || '',
                                          exempted: selectedCurrencyData?.exempted || '',
                                          govChargeCode: selectedCurrencyData?.govChargeCode || '',
                                          ledger: selectedCurrencyData?.ledger || '',
                                          sac: selectedCurrencyData?.sac || '',
                                          taxable: selectedCurrencyData?.taxable || '',
                                          qty: '',
                                          rate: '',
                                          billAmount: '',
                                          lcAmount: ''
                                        };
                                        setWithdrawalsTableData(updatedCurrencyData);
                                      }}
                                      className={withdrawalsTableErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {chargeCodeList[index]?.map((currency, idx) => (
                                        <option key={idx} value={currency.chargeCode}>
                                          {currency.chargeCode}
                                        </option>
                                      ))}
                                    </select>
                                    {withdrawalsTableErrors[index]?.chargeCode && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].chargeCode}
                                      </div>
                                    )}
                                  </td>

                                  {/* <td className="border px-2 py-2">
                                    <select
                                      value={row.chargeCode}
                                      style={{ width: '150px' }}
                                      disabled={formData.status === 'TAX'}
                                      onChange={(e) => {
                                        const selectedCurrency = e.target.value;
                                        const selectedCurrencyData = chargeCodeList.find(
                                          (currency) => currency.chargeCode === selectedCurrency
                                        );
                                        const updatedCurrencyData = [...withdrawalsTableData];
                                        updatedCurrencyData[index] = {
                                          ...updatedCurrencyData[index],
                                          chargeCode: selectedCurrency,
                                          GSTPercent: selectedCurrencyData ? selectedCurrencyData.GSTPercent : '',
                                          ccFeeApplicable: selectedCurrencyData ? selectedCurrencyData.ccFeeApplicable : '',
                                          chargeName: selectedCurrencyData ? selectedCurrencyData.chargeName : '',
                                          exempted: selectedCurrencyData ? selectedCurrencyData.exempted : '',
                                          govChargeCode: selectedCurrencyData ? selectedCurrencyData.govChargeCode : '',
                                          ledger: selectedCurrencyData ? selectedCurrencyData.ledger : '',
                                          sac: selectedCurrencyData ? selectedCurrencyData.sac : '',
                                          taxable: selectedCurrencyData ? selectedCurrencyData.taxable : '',
                                          qty: '',
                                          rate: '',
                                          billAmount: '',
                                          lcAmount: ''
                                        };

                                        setWithdrawalsTableData(updatedCurrencyData);
                                      }}
                                      className={withdrawalsTableErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {chargeCodeList?.map((currency, index) => (
                                        <option key={index} value={currency.chargeCode}>
                                          {currency.chargeCode}
                                        </option>
                                      ))}
                                    </select>
                                    {withdrawalsTableErrors[index]?.chargeCode && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].chargeCode}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, govChargeCode: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              govChargeCode: !value ? 'govChargeCode is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              govChargeCode: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.govChargeCode ? 'error form-control' : 'form-control'}
                                    />
                                    {withdrawalsTableErrors[index]?.govChargeCode && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].govChargeCode}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, chargeName: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              chargeName: !value ? 'charge Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              chargeName: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.chargeName ? 'error form-control' : 'form-control'}
                                    />
                                    {withdrawalsTableErrors[index]?.chargeName && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].chargeName}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, taxable: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxable: !value ? 'Taxable is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxable: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.taxable ? 'error form-control' : 'form-control'}
                                      // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.taxable && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].taxable}
                                      </div>
                                    )}
                                  </td> */}

                                  {/* <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.description}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '250px' }}
                                      className={withdrawalsTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 250) {
                                          handleDescriptionChange(index, newValue);
                                        }
                                      }}
                                    />
                                    {withdrawalsTableErrors[index]?.description && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].description}
                                      </div>
                                    )}
                                  </td> */}

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.description}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '250px' }}
                                      className={withdrawalsTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 250) {
                                          handleDescriptionChange(index, newValue);
                                        } else {
                                          const updatedErrors = [...withdrawalsTableErrors];
                                          updatedErrors[index] = {
                                            ...updatedErrors[index],
                                            description: 'Description cannot exceed 250 characters.'
                                          };
                                          setWithdrawalsTableErrors(updatedErrors);
                                        }
                                      }}
                                    />
                                    {withdrawalsTableErrors[index]?.description && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].description}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    {/* <input
                                        type="number"
                                        value={row.qty}
                                        onChange={(e) => handleTableInputChange(index, "qty", e.target.value)}
                                        className="form-control"
                                        disabled={formData.status === 'TAX'}
                                      /> */}
                                    <input
                                      type="text"
                                      value={row.qty}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      // onChange={(e) => {
                                      //   const value = e.target.value;
                                      //   const numericRegex = /^[0-9]*$/;
                                      //   if (numericRegex.test(value)) {
                                      //     setWithdrawalsTableData((prev) =>
                                      //       prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                      //     );
                                      //     setWithdrawalsTableErrors((prev) => {
                                      //       const newErrors = [...prev];
                                      //       newErrors[index] = {
                                      //         ...newErrors[index],
                                      //         qty: !value ? 'qty is required' : ''
                                      //       };
                                      //       return newErrors;
                                      //     });
                                      //   } else {
                                      //     setWithdrawalsTableErrors((prev) => {
                                      //       const newErrors = [...prev];
                                      //       newErrors[index] = {
                                      //         ...newErrors[index],
                                      //         qty: 'Only numeric characters are allowed'
                                      //       };
                                      //       return newErrors;
                                      //     });
                                      //   }
                                      // }}
                                      onChange={(e) => handleTableInputChange(index, 'qty', e.target.value)}
                                      className={withdrawalsTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.qty && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].qty}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.rate}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      // onChange={(e) => {
                                      //   const value = e.target.value;
                                      //   const numericRegex = /^[0-9]*$/;
                                      //   if (numericRegex.test(value)) {
                                      //     setWithdrawalsTableData((prev) =>
                                      //       prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                      //     );
                                      //     setWithdrawalsTableErrors((prev) => {
                                      //       const newErrors = [...prev];
                                      //       newErrors[index] = {
                                      //         ...newErrors[index],
                                      //         rate: !value ? 'rate is required' : ''
                                      //       };
                                      //       return newErrors;
                                      //     });
                                      //   } else {
                                      //     setWithdrawalsTableErrors((prev) => {
                                      //       const newErrors = [...prev];
                                      //       newErrors[index] = {
                                      //         ...newErrors[index],
                                      //         rate: 'Only numeric characters are allowed'
                                      //       };
                                      //       return newErrors;
                                      //     });
                                      //   }
                                      // }}
                                      onChange={(e) => handleTableInputChange(index, 'rate', e.target.value)}
                                      className={withdrawalsTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.rate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].rate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.currency}
                                      style={{ width: '150px' }}
                                      disabled={formData.status === 'TAX'}
                                      onChange={(e) => {
                                        const selectedCurrency = e.target.value;
                                        const selectedCurrencyData = partyCurrencyList.find(
                                          (currency) => currency.currency === selectedCurrency
                                        );

                                        const updatedCurrencyData = [...withdrawalsTableData];
                                        updatedCurrencyData[index] = {
                                          ...updatedCurrencyData[index],
                                          currency: selectedCurrency,
                                          exRate: selectedCurrencyData.sellingExRate,
                                          fcAmount: selectedCurrency === 'INR' ? 0 : row.qty * row.rate,
                                          lcAmount:
                                            (Number(row.qty) || 0) *
                                            (Number(row.rate) || 0) *
                                            (Number(selectedCurrencyData.sellingExRate) || 0),
                                          billAmount:
                                            ((Number(row.qty) || 0) *
                                              (Number(row.rate) || 0) *
                                              (Number(selectedCurrencyData.sellingExRate) || 0)) /
                                            selectedCurrencyData.sellingExRate,
                                          gst:
                                            ((Number(row.qty) || 0) *
                                              (Number(row.rate) || 0) *
                                              (Number(selectedCurrencyData.sellingExRate) || 0) *
                                              row.GSTPercent) /
                                            100
                                        };
                                        calculateTotals(updatedCurrencyData, setFormData);
                                        setWithdrawalsTableData(updatedCurrencyData);
                                      }}
                                      className={withdrawalsTableErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {partyCurrencyList &&
                                        partyCurrencyList.map((currency) => (
                                          <option key={currency.id} value={currency.currency}>
                                            {currency.currency}
                                          </option>
                                        ))}
                                    </select>
                                    {withdrawalsTableErrors[index]?.currency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].currency}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], exRate: !value ? 'exRate is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              exRate: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.exRate ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.exRate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].exRate}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, fcAmount: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], fcAmount: !value ? 'fcAmount is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              fcAmount: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.fcAmount ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.fcAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].fcAmount}
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
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, lcAmount: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lcAmount: !value ? 'lcAmount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lcAmount: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.lcAmount ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.lcAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].lcAmount}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.billAmount ? row.billAmount : '0'}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numericRegex = /^[0-9]*$/;
                                        if (numericRegex.test(value)) {
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, billAmount: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], billAmount: !value ? 'Settled is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              billAmount: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.billAmount ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.billAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].billAmount}
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
                                          setWithdrawalsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, sac: value } : r)));
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sac: !value ? 'sac is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sac: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.sac ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.sac && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].sac}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      // value={row.GSTPercent}
                                      value={row.GSTPercent ? `${parseInt(row.GSTPercent)}%` : ''}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numericRegex = /^[0-9]*$/;
                                        if (numericRegex.test(value)) {
                                          setWithdrawalsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, GSTPercent: value } : r))
                                          );
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              GSTPercent: !value ? 'GSTPercent is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              GSTPercent: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.GSTPercent ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.GSTPercent && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].GSTPercent}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gst ? row.gst : '0'}
                                      disabled
                                      style={{ width: '100px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numericRegex = /^[0-9]*$/;
                                        if (numericRegex.test(value)) {
                                          setWithdrawalsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gst: value } : r)));
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              gst: !value ? 'gst is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setWithdrawalsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              gst: 'Only numeric characters are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={withdrawalsTableErrors[index]?.gst ? 'error form-control' : 'form-control'}
                                    // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                    />
                                    {withdrawalsTableErrors[index]?.gst && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {withdrawalsTableErrors[index].gst}
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
                  <div className="row d-flex ml">
                    <div className="mb-1">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddAnnexureRow} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                {formData.status !== 'TAX' && (
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                )}
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
                                <th className="px-2 py-2 text-white text-center">SKU Type</th>
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
                              {taxInvoiceAnnexure.map((row, index) => (
                                <tr key={row.id}>
                                  {formData.status !== 'TAX' && (
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRowAnnexure(
                                            row.id,
                                            taxInvoiceAnnexure,
                                            setTaxInvoiceAnnexure,
                                            taxInvoiceAnnexureErrors,
                                            setTaxInvoiceAnnexureErrors
                                          )
                                        }
                                      />
                                    </td>
                                  )}
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
                                        disabled={formData.status === 'TAX'}
                                        slotProps={{
                                          textField: { size: 'small', clearable: true }
                                        }}
                                        sx={{
                                          width: '200px'
                                        }}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue) => {
                                          setTaxInvoiceAnnexure((prev) =>
                                            prev.map((r, i) =>
                                              i === index ? { ...r, transDate: newValue ? newValue.format('YYYY-MM-DD') : null } : r
                                            )
                                          );
                                          setTaxInvoiceAnnexureErrors((prev) => {
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
                                            className={taxInvoiceAnnexureErrors[index]?.transDate ? 'error form-control' : 'form-control'}
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                    {taxInvoiceAnnexureErrors[index]?.transDate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].transDate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.transNo}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '150px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'transNo', e.target.value)}
                                      className={taxInvoiceAnnexureErrors[index]?.transNo ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.transNo && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].transNo}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.kitId}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'kitId', e.target.value)}
                                      className={taxInvoiceAnnexureErrors[index]?.kitId ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.kitId && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].kitId}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.dsec}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '250px' }}
                                      className={taxInvoiceAnnexureErrors[index]?.dsec ? 'error form-control' : 'form-control'}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 250) {
                                          handleAnnexureDescriptionChange(index, newValue);
                                        } else {
                                          const updatedErrors = [...taxInvoiceAnnexureErrors];
                                          updatedErrors[index] = {
                                            ...updatedErrors[index],
                                            dsec: 'Description cannot exceed 250 characters.'
                                          };
                                          setTaxInvoiceAnnexureErrors(updatedErrors);
                                        }
                                      }}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.dsec && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].dsec}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.skuType}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'skuType', e.target.value)}
                                      className={taxInvoiceAnnexureErrors[index]?.skuType ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.skuType && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].skuType}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.qty}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'qty', e.target.value)}
                                      className={taxInvoiceAnnexureErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.qty && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].qty}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.rate}
                                      disabled={formData.status === 'TAX'}
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleAnnexureInputChange(index, 'rate', e.target.value)}
                                      className={taxInvoiceAnnexureErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.rate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].rate}
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
                                      className={taxInvoiceAnnexureErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                    />
                                    {taxInvoiceAnnexureErrors[index]?.amount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {taxInvoiceAnnexureErrors[index].amount}
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
                <TabPanel value="3">
                  <div className="row d-flex mt-3">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Charge Amt.(LC)"
                          name="totalChargeAmountLc"
                          disabled
                          value={formData.totalChargeAmountLc}
                          onChange={(e) => setFormData({ ...formData, totalChargeAmountLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalChargeAmountLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Tax Amt.(LC)"
                          name="totalTaxAmountLc"
                          value={formData.totalTaxAmountLc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalTaxAmountLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalTaxAmountLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Inv Amt.(LC)"
                          name="totalInvAmountLc"
                          value={formData.totalInvAmountLc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalInvAmountLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalInvAmountLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Round Off Amt.(LC)"
                          name="roundOffAmountLc"
                          value={formData.roundOffAmountLc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, roundOffAmountLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['roundOffAmountLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Charge Amt.(Bill Curr.)"
                          name="totalChargeAmountBc"
                          value={formData.totalChargeAmountBc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalChargeAmountBc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalChargeAmountBc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Tax Amt.(Bill Curr.)"
                          name="totalTaxAmountBc"
                          value={formData.totalTaxAmountBc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalTaxAmountBc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalTaxAmountBc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Inv Amt.(Bill Curr.)"
                          name="totalInvAmountBc"
                          value={formData.totalInvAmountBc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalInvAmountBc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalInvAmountBc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Taxable Amt.(LC)"
                          name="totalTaxableAmountLc"
                          value={formData.totalTaxableAmountLc}
                          disabled
                          onChange={(e) => setFormData({ ...formData, totalTaxableAmountLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['totalTaxableAmountLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-6 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Amount In Words"
                          name="amountInWords"
                          value={formData.amountInWords}
                          disabled
                          onChange={(e) => setFormData({ ...formData, amountInWords: e.target.value })}
                          size="small"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['amountInWords']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-6 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Billing Remarks"
                          name="billingRemarks"
                          value={formData.billingRemarks}
                          disabled
                          onChange={(e) => setFormData({ ...formData, billingRemarks: e.target.value })}
                          size="small"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['billingRemarks']}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="4">
                  {' '}
                  <GstTable tableData={gstTableData} onCreateNewRow={handleCreateNewRow} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}

      </div>
      <ConfirmationModal
        open={modalOpen}
        title="Tax Invoice Approval"
        message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this invoice?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCloseModal}
      />
      {downloadPdf && <GeneratePdfTemp row={pdfData} modalClose={() => setDownloadPdf(false)} />}
    </>
  );
};

export default TaxInvoiceDetails;
