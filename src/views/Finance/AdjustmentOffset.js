import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import { Button, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Draggable from 'react-draggable';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'react-tabs/style/react-tabs.css';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { Chip, Stack } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationModal from 'utils/confirmationPopup';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const AdjustmentOffset = () => {
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [data, setData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [allCustomerName, setAllCustomerName] = useState([]);
  const [allReceiptDocId, setAllReceiptDocId] = useState([]);
  const [branchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [branch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [selectedDocId, setSelectedDocId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [modalApprove, setModalApprove] = useState(false);
  const [confirmData, setConfirmData] = useState([]);
  const [approveStatus, setApproveStatus] = useState('');
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    receiptDocId: '',
    receiptDocDate: null,
    currency: '',
    exRate: 1.0,
    amount: '',
    gainorLoss: '',
    roundOfAmount: '',
    onAccount: '',
    narration: '',
    customerName: '',
    partyCode: '',
    totalSettled: '',
    status: 'EDIT',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    docNo: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    receiptDocId: '',
    receiptDocDate: null,
    currency: '',
    exRate: '',
    amount: '',
    gainorLoss: '',
    totalSettled: '',
    roundOfAmount: '',
    onAccount: '',
    narration: '',
    customerName: '',
    partyCode: '',
    totalSettled: '',
    status: '',
    approveStatus: '',
    approveBy: '',
    approveOn: '',
    docNo: ''
  });

  const [inVoiceDetailsData, setInVoiceDetailsData] = useState([]);
  const [invoiceDetailsError, setInvoiceDetailsError] = useState([
    {
      invNo: '',
      invDate: null,
      refNo: '',
      refDate: null,
      currency: '',
      exRate: '',
      amount: '',
      outStanding: '',
      settled: '',
      setExRate: '',
      tnxSettled: '',
      gstAmount: '',
      chargeAmt: '',
      gainAmt: ''
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    if (name === 'customerName' && value) {
      const selectedCustomer = allCustomerName.find((customer) => customer.partyName === value);
      if (selectedCustomer) {
        setFormData({
          ...formData,
          customerName: value,
          partyCode: selectedCustomer.partyCode
        });
        setFieldErrors({
          ...fieldErrors,
          customerName: false,
          partyCode: false
        });
      }
    } else {
      setFormData({ ...formData, [name]: inputValue });
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
    setFieldErrors((prev) => ({
      ...prev,
      [name]: false
    }));
  };
  useEffect(() => {
    if (!editId) {
      calculateTotals();
    }
  }, [inVoiceDetailsData, formData.amount]);
  const calculateTotals = () => {
    let totalChargeAmt = 0;
    let totalSettledAmt = 0;

    const updatedInvoiceDetails = inVoiceDetailsData.map((row, index) => {
      const billAmount = parseFloat(row.amount || 0);
      const gstAmount = parseFloat(row.gstAmount || 0);
      const chargeAmt = parseFloat(row.chargeAmt || 0);
      const tdsPercent = parseFloat(row.tds || 0);
      const settledAmt = parseFloat(row.settled || 0);
      totalSettledAmt += settledAmt;
      const gross = billAmount + gstAmount;
      let tdsAmt = 0;
      if (tdsPercent) {
        tdsAmt = (gross * tdsPercent) / 100;
      }
      const netReceivable = chargeAmt - tdsAmt;
      const outstandingAmt = netReceivable - settledAmt;
      totalChargeAmt += netReceivable;
      return {
        ...row,
        tdsAmt: netReceivable.toFixed(2),
        outStanding: outstandingAmt.toFixed(2),
        gstAmount: gstAmount.toFixed(2)
      };
    });

    const amount = parseFloat(formData.amount || 0);
    const onAccount = amount >= totalSettledAmt ? amount - totalSettledAmt : 0;
    setInVoiceDetailsData(updatedInvoiceDetails);
    setFormData((prev) => ({
      ...prev,
      totalSettled: totalSettledAmt.toFixed(2),
      netAmount: totalChargeAmt.toFixed(2),
      onAccount: onAccount.toFixed(2)
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setData('');
    setEditId();
    setFormData({
      active: true,
      docDate: dayjs(),
      docNo: '',
      receiptDocId: '',
      receiptDocDate: null,
      currency: '',
      exRate: 1.0,
      amount: '',
      gainorLoss: '',
      totalSettled: '',
      roundOfAmount: '',
      onAccount: '',
      narration: '',
      customerName: '',
      status: 'EDIT',
      approveStatus: '',
      approveBy: '',
      approveOn: ''
    });
    setFieldErrors({
      active: true,
      receiptDocId: '',
      receiptDocDate: null,
      currency: '',
      exRate: '',
      amount: '',
      gainorLoss: '',
      totalSettled: '',
      roundOfAmount: '',
      onAccount: '',
      narration: '',
      customerName: '',
      totalSettled: '',
      status: '',
      docNo: ''
    });
    setInVoiceDetailsData([]);
    setInvoiceDetailsError([
      {
        invNo: '',
        invDate: null,
        refNo: '',
        refDate: null,
        currency: '',
        exRate: '',
        amount: '',
        outStanding: '',
        settled: '',
        setExRate: '',
        tnxSettled: '',
        // gainAmt: '',
        gstAmount: '',
        chargeAmt: ''
      }
    ]);
    getArOffsetDocId();
    setFillGridData([]);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleView = () => {
    setListView(!listView);
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
  }, []);

  useEffect(() => {
    getArOffsetDocId();
    getAllCustomerName();
    getAllARAdjustmentOffset();
  }, []);
  const getArOffsetDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/aradjustmentoffset/getApAdjustmentOffSetDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docNo: response.paramObjectsMap.apAdjustmentOffSetDocId
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllReceiptId = async (customerName) => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getAllPaymentByOrgIdAndBranchCode?branchCode=${branchCode}&orgId=${orgId}&partyName=${customerName}`
      );
      if (response.status === true) {
        setAllReceiptDocId(response.paramObjectsMap.paymentVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDocIdChange = (event) => {
    const selectedId = event.target.value;
    const selectedReceipt = allReceiptDocId.find((item) => item.docId === selectedId);
    if (selectedReceipt) {
      setFormData((prev) => ({
        ...prev,
        receiptDocId: selectedId,
        receiptDocDate: selectedReceipt.docDate,
        amount: selectedReceipt.netAmount,
        currency: selectedReceipt.currency
      }));
    }
  };
  const getAllARAdjustmentOffset = async () => {
    try {
      const response = await apiCalls('get', `/aradjustmentoffset/getAllApAdjustmentOffSetByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.apAdjustmentOffSetVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getARAdjustmentOffsetById = async (row) => {
    console.log('first', row);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `/aradjustmentoffset/getApAdjustmentOffSetById?id=${row.original.id}`);
      if (response.status === true) {
        setListView(false);

        const receiptVO = response.paramObjectsMap.apAdjustmentOffSetVO[0];
        setData(receiptVO);
        setFormData({
          docNo: receiptVO.docId,
          // docDate: dayjs(receiptVO.docDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          docDate: dayjs(receiptVO.docDate),
          receiptDocId: receiptVO.paymentDocId,
          // receiptDocDate: dayjs(receiptVO.receiptDocDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          receiptDocDate: dayjs(receiptVO.receiptDocDate),
          currency: receiptVO.currency,
          exRate: receiptVO.exRate,
          amount: receiptVO.amount,
          gainorLoss: receiptVO.forexGainOrLoss,
          totalSettled: receiptVO.netAmount,
          roundOfAmount: receiptVO.roundOffAmount,
          onAccount: receiptVO.onAccount,
          narration: receiptVO.narration,
          customerName: receiptVO.subLedgerName,
          partyCode: receiptVO.subLedgerCode,
          status: receiptVO.status,
          approveBy: receiptVO.approveBy,
          approveOn: receiptVO.approveOn,
          approveStatus: receiptVO.approveStatus
        });
        setInVoiceDetailsData(
          receiptVO.apOffSetInvoiceDetailsVO.map((invoiceData) => ({
            id: invoiceData.id,
            invNo: invoiceData.invoiceNo,
            invDate: dayjs(invoiceData.invoiceDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            refNo: invoiceData.refNo,
            refDate: dayjs(invoiceData.refDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            currency: invoiceData.curr,
            exRate: invoiceData.exRate,
            amount: invoiceData.invAmount,
            outStanding: invoiceData.outStanding,
            settled: invoiceData.settled,
            setExRate: invoiceData.setExRate,
            tnxSettled: invoiceData.tnxSettled,
            gainAmt: invoiceData.gainOrLoss,
            gstAmount: invoiceData.gstAmount,
            chargeAmt: invoiceData.chargeAmt
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
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const handleSave = async () => {
    const errors = {};
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const receiptInvDetailVo = inVoiceDetailsData.map((row) => ({
        ...(editId && { id: row.id }),
        curr: row.currency,
        exRate: parseInt(row.exRate),
        gainOrLoss: parseInt(row.gainAmt),
        invAmount: parseInt(row.amount),
        invoiceDate: formatDate(new Date(row.invDate)),
        invoiceNo: row.invNo,
        outStanding: parseInt(row.outStanding),
        refDate: formatDate(new Date(row.refDate)),
        refNo: row.refNo,
        setExRate: parseInt(row.setExRate),
        settled: parseInt(row.settled),
        tnxSettled: parseInt(row.tnxSettled),
        gstAmount: parseFloat(row.gstAmount),
        chargeAmt: parseInt(row.chargeAmt)
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        amount: formData.amount,
        // arOffSetInvoiceDetailsDTO: receiptInvDetailVo,
        apOffSetInvoiceDetailsDTO: receiptInvDetailVo,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        currency: formData.currency,
        exRate: formData.exRate,
        finYear: finYear,
        narration: formData.narration,
        orgId: parseInt(orgId),
        paymentDocDate: formData.receiptDocDate,
        paymentDocId: formData.receiptDocId,
        subLedgerName: formData.customerName,
        subLedgerCode: formData.partyCode,
        totalSettled: formData.totalSettled,
        status: formData.status,
        docId: formData.docNo
      };

      try {
        const response = await apiCalls('put', `/aradjustmentoffset/updateCreateApAdjustmentOffSet`, saveFormData);
        if (response.status === true) {
          showToast(
            'success',
            editId ? 'Payment Adjustment offset Updated Successfully' : 'Payment Adjustment offset created successfully'
          );
          handleClear();
          getAllARAdjustmentOffset();
          getArOffsetDocId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'AR-Adjustment Offset creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'AR-Adjustment Offset creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls('get', `/payable/getPartyNameAndCodeForApBillBalance?orgId=${orgId}`);
      if (response.status === true) {
        setAllCustomerName(response.paramObjectsMap.PartyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllReceiptId(formData.customerName);
  }, [formData.customerName]);

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'paymentDocId', header: 'Payment Doc Id', size: 140 },
    { accessorKey: 'paymentDocDate', header: 'Payment Doc Date', size: 140 },
    { accessorKey: 'netAmount', header: 'Total Settled', size: 140 },
    { accessorKey: 'onAccount', header: 'On Account', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 100 },
    { accessorKey: 'approveStatus', header: 'Approve Status', size: 140 }
  ];

  const handleFullGrid = () => {
    if (formData.customerName) {
      setModalOpen(true);
      getAllFillGrid();
    } else {
      setModalOpen(false);
      showToast('warning', formData.customerName ? `${formData.customerName} has No Data` : 'Please Select Customer Name');
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(fillGridData.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };
  const handleSubmitSelectedRows = async () => {
    const selectedData = selectedRows.map((index) => fillGridData[index]);
    console.log('charge amt', selectedData);
    const newData = selectedData
      .filter((data) => {
        return !inVoiceDetailsData.some((item) => item.invNo === data.vid && item.invDate === data.vdate);
      })
      .map((data) => ({
        id: Date.now() + Math.random(),
        invNo: data.vid || '',
        invDate: data.vdate ? dayjs(data.vdate).format('YYYY-MM-DD') : null,
        refNo: data.refno || '',
        refDate: data.refdate ? dayjs(data.refdate).format('YYYY-MM-DD') : null,
        amount: data.billamount || '',
        gstAmount: data.gstamount || '',
        chargeAmt: data.chargeAmt || '',
        currency: data.acccurrency || '',
        exRate: data.exrate || ''
      }));

    if (newData.length < selectedData.length) {
      showToast('warning', 'Some of the selected items are already added!');
    }

    if (newData.length === 0) {
      return;
    }
    setInVoiceDetailsData((prev) => [...prev, ...newData]);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };
  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/payable/getPaymentFillGrid?orgId=${orgId}&branchCode=${branchCode}&partyCode=${formData.partyCode}`
      );
      if (response.status === true) {
        setFillGridData(response.paramObjectsMap.paymentfillgrid);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //
  const handleNew = () => {
    setListView(!listView);
    handleClear();
  };
  const handleOpenModalApprove = () => {
    setModalApprove(true);
    setApproveStatus('Approved');
  };
  const handleOpenModalReject = () => {
    setModalApprove(true);
    setApproveStatus('Rejected');
  };
  const handleCloseApprove = () => setModalApprove(false);

  const handleConfirmAction = async () => {
    try {
      const result = await apiCalls(
        'put',
        `aradjustmentoffset/approveApAdjustmentOffSet?action=${approveStatus}&actionBy=${loginUserName}&docId=${formData.docNo}&id=${editId}&orgId=${orgId}`
      );
      console.log('API Response:==>', result);
      if (result.status === true) {
        setFormData({ ...formData, approveStatus: result.paramObjectsMap.taxInvoiceVO.approveStatus });
        showToast(
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved' ? 'success' : 'error',
          result.paramObjectsMap.taxInvoiceVO.approveStatus === 'Approved'
            ? ' Ap Offset Approved Successfully'
            : 'Ap Offset Rejected Successfully'
        );
        const listValueVO = result.paramObjectsMap.taxInvoiceVO;
        setConfirmData(result.paramObjectsMap.taxInvoiceVO);
        setFormData({
          active: listValueVO.active,
          amount: listValueVO.amount,
          // apOffSetInvoiceDetailsDTO: receiptInvDetailVo,
          branch: branch,
          branchCode: branchCode,
          createdBy: loginUserName,
          currency: listValueVO.currency,
          exRate: listValueVO.exRate,
          finYear: finYear,
          narration: listValueVO.narration,
          orgId: parseInt(orgId),
          paymentDocDate: listValueVO.receiptDocDate,
          paymentDocId: listValueVO.receiptDocId,
          subLedgerName: listValueVO.customerName,
          subLedgerCode: listValueVO.partyCode,
          totalSettled: listValueVO.totalSettled,
          status: listValueVO.status,
          status: listValueVO.status,
          approveBy: listValueVO.approveBy,
          approveOn: listValueVO.approveOn,
          approveStatus: listValueVO.approveStatus,
          docNo: listValueVO.docId
        });
        setInVoiceDetailsData(
          listValueVO.inVoiceDetailsData.map((cl) => ({
            curr: cl.currency,
            exRate: cl.exRate,
            gainOrLoss: cl.gainAmt,
            invAmount: cl.amount,
            invoiceDate: cl.invDate,
            invoiceNo: cl.invNo,
            outStanding: cl.outStanding,
            refDate: cl.refDate,
            refNo: cl.refNo,
            setExRate: cl.setExRate,
            settled: cl.settled,
            tnxSettled: cl.tnxSettled,
            gstAmount: cl.gstAmount,
            chargeAmt: cl.chargeAmt
          }))
        );
        getAllFillGrid();
        console.log('Payment:==>', result);
      } else {
        console.error('API Error:', result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      handleCloseApprove();
      getAllFillGrid();
    }
  };
  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row align-items-center mb-3">
          {/* Left section - Chips or Approve/Reject buttons */}
          <div className="col d-flex align-items-center">
            {editId && !listView && (data.status === 'SUBMIT' || formData.status === 'SUBMIT') && (
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
                {data.status === 'SUBMIT' && formData.approveStatus !== 'Approved' && formData.approveStatus !== 'Rejected' && (
                  <div className="d-flex align-items-center">
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

          {/* Right section - Action buttons */}
          <div className="col-auto d-flex align-items-center">
            {!listView && <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />}
            {!listView && <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />}
            {data.approveStatus === 'Approved' || listView ? (
              ''
            ) : (
              <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
            )}
          </div>
        </div>

        <div className="col d-flex justify-content-end align-items-center">
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
                  color: '#1565c0'
                }
              }}
              onClick={handleNew}
            >
              New
            </Button>
          )}
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getARAdjustmentOffsetById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    label="Doc No"
                    size="small"
                    name="receiptDocId"
                    disabled
                    value={formData.docNo}
                    onChange={(e) => setFormData({ ...formData, docNo: e.target.value })}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      value={formData.docDate ? dayjs(formData.docDate) : null}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      disabled
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="supplierName-label">Supplier Name</InputLabel>
                  <Select
                    labelId="supplierName-label"
                    id="supplierName"
                    label="Supplier Name"
                    disabled={editId}
                    name="customerName"
                    onChange={handleInputChange}
                    value={formData.customerName}
                  >
                    {allCustomerName &&
                      allCustomerName.map((customer, index) => (
                        <MenuItem key={index} value={customer.partyName}>
                          {customer.partyName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}{' '}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.receiptDocId}>
                  <InputLabel id="receiptDocId">Payment Doc ID</InputLabel>
                  <Select
                    labelId="receiptDocId"
                    id="receiptDocId"
                    label="Receipt Doc ID"
                    onChange={handleDocIdChange}
                    name="receiptDocId"
                    disabled={editId}
                    value={formData.receiptDocId}
                  >
                    {allReceiptDocId.map((doc) => (
                      <MenuItem key={doc.id} value={doc.docId}>
                        {doc.docId}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.receiptDocId && <FormHelperText>{fieldErrors.receiptDocId}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Receipt Doc Date"
                      value={formData.receiptDocDate ? dayjs(formData.receiptDocDate) : null}
                      onChange={(date) => handleDateChange('receiptDocDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                      error={!!fieldErrors.receiptDocDate}
                      helperText={fieldErrors.receiptDocDate ? fieldErrors.receiptDocDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="amount"
                    name="amount"
                    label="Amount"
                    size="small"
                    value={formData.amount}
                    disabled
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.amount}
                    helperText={fieldErrors.amount}
                  />
                </FormControl>
              </div>
              {/*  */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="status-label" required>
                    Status
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    label="Status"
                    name="status"
                    value={formData.status}
                    disabled={formData.status === 'SUBMIT' || !editId}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value });
                      setFieldErrors({ ...fieldErrors, status: '' });
                    }}
                  >
                    {editId && <MenuItem value="SUBMIT">SUBMIT</MenuItem>}
                    <MenuItem value="EDIT">EDIT</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/*  */}
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.currency}>
                  <InputLabel id="currency">Currency</InputLabel>
                  <Select
                    labelId="currency"
                    id="currency"
                    label="Currency"
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
                    id="exRate"
                    name="exRate"
                    label="Ex. rate"
                    size="small"
                    value={formData.exRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    // error={!!fieldErrors.exRate}
                    // helperText={fieldErrors.exRate}
                    disabled
                  />
                </FormControl>
              </div> */}
            </div>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value={0} label="Invoice Details" />
              <Tab value={1} label="Summary" />
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {value === 0 && (
                <div className="row d-flex ml" style={{ marginTop: '5px' }}>
                  <div className="mb-1">
                    {/* <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} /> */}
                    {!editId && <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />}
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
                              <th className="px-2 py-2 text-white text-center"># Invoice</th>
                              <th className="px-2 py-2 text-white text-center" style={{ border: 'none' }}>
                                Date
                              </th>
                              <th className="px-2 py-2 text-white text-center">Ref No</th>
                              <th className="px-2 py-2 text-white text-center">Ref Date</th>
                              <th className="px-2 py-2 text-white text-center">Currency</th>
                              <th className="px-2 py-2 text-white text-center">Ex. Rate</th>
                              <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                              <th className="px-2 py-2 text-white text-center">TAX</th>
                              <th className="px-2 py-2 text-white text-center">Net Receivable</th>
                              <th className="px-2 py-2 text-white text-center">Outstanding Bal</th>
                              <th className="px-2 py-2 text-white text-center">Settled Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {inVoiceDetailsData.map((row, index) => ( */}
                            {Array.isArray(inVoiceDetailsData) &&
                              inVoiceDetailsData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id,
                                          inVoiceDetailsData,
                                          setInVoiceDetailsData,
                                          invoiceDetailsError,
                                          setInvoiceDetailsError
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.invNo}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s/-]*$/;
                                      }}
                                      className={invoiceDetailsError[index]?.invNo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.invNo && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].invNo}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ border: 'none', padding: '1px 2px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        value={
                                          row.invDate
                                            ? dayjs(row.invDate, 'YYYY-MM-DD').isValid()
                                              ? dayjs(row.invDate, 'YYYY-MM-DD')
                                              : null
                                            : null
                                        }
                                        disabled
                                        format="DD-MM-YYYY"
                                        onChange={(newValue) => {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id ? { ...r, invDate: newValue ? newValue.format('YYYY-MM-DD') : null } : r
                                            )
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              invDate: !newValue ? 'Inv Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        slotProps={{
                                          textField: {
                                            InputProps: {
                                              sx: {
                                                '& input': {
                                                  padding: '9px 8px',
                                                  fontSize: '14px'
                                                }
                                              }
                                            },
                                            sx: {
                                              width: '200px',
                                              padding: '8px'
                                            }
                                          }
                                        }}
                                      />
                                      {invoiceDetailsError[index]?.invDate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {invoiceDetailsError[index].invDate}
                                        </div>
                                      )}
                                    </LocalizationProvider>
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.refNo}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, refNo: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], refNo: !value ? 'Ref No is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], refNo: 'Only alphabets and numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.refNo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.refNo && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].refNo}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="date"
                                      value={row.refDate}
                                      disabled
                                      onChange={(e) => {
                                        const date = e.target.value;

                                        setInVoiceDetailsData((prev) =>
                                          prev.map((r) =>
                                            r.id === row.id ? { ...r, refDate: date, refDate: date > r.refDate ? '' : r.refDate } : r
                                          )
                                        );

                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            refDate: !date ? 'Ref Date is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={invoiceDetailsError[index]?.refDate ? 'error form-control' : 'form-control'}
                                    />
                                    {invoiceDetailsError[index]?.refDate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].refDate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.currency}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z0-9\s-]*$/;
                                        if (regex.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], currency: !value ? 'Currency is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              currency: 'Only alphabets and numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.currency ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.currency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].currency}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.exRate}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;

                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, exRate: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], exRate: !value ? 'Ex Rate is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], exRate: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.exRate ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.exRate && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].exRate}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.amount}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9.]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r)));
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], amount: !value ? 'Bill Amount is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], amount: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.amount ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.amount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].amount}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gstAmount}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, gstAmount: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], gstAmount: !value ? 'Tax Amt is required' : '' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              gstAmount: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.gstAmount ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.gstAmount && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].gstAmount}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.chargeAmt}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, chargeAmt: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], chargeAmt: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              chargeAmt: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.chargeAmt ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.chargeAmt && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].chargeAmt}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.outStanding}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9]*$/;
                                        if (isNumeric.test(value)) {
                                          setInVoiceDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, outStanding: value } : r))
                                          );
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              outStanding: !value ? 'Outstanding is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              outStanding: 'Only numbers are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={invoiceDetailsError[index]?.outStanding ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError[index]?.outStanding && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].outStanding}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.settled}
                                      disabled={editId}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isNumeric = /^[0-9.]*$/;

                                        if (!isNumeric.test(value)) {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], settled: 'Only numbers are allowed' };
                                            return newErrors;
                                          });
                                          return;
                                        }

                                        const newValue = parseFloat(value || 0);
                                        const totalOtherSettled = inVoiceDetailsData.reduce(
                                          (sum, r) => (r.id !== row.id ? sum + parseFloat(r.settled || 0) : sum),
                                          0
                                        );

                                        const totalSettledAfterChange = totalOtherSettled + newValue;
                                        const maxReceiptAmt = parseFloat(formData.amount || 0);
                                        const maxChargeAmt = parseFloat(row.chargeAmt || 0);

                                        let errorMsg = '';
                                        if (newValue > maxChargeAmt) {
                                          errorMsg = `Settled cannot exceed Net Receivable (${maxChargeAmt})`;
                                        } else if (totalSettledAfterChange > maxReceiptAmt) {
                                          errorMsg = `Total settled exceeds Amount (${maxReceiptAmt})`;
                                        }

                                        if (errorMsg) {
                                          setInvoiceDetailsError((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], settled: errorMsg };
                                            return newErrors;
                                          });
                                          return;
                                        }

                                        setInVoiceDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, settled: value } : r)));

                                        setInvoiceDetailsError((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], settled: '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={invoiceDetailsError?.[index]?.settled ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {invoiceDetailsError?.[index]?.settled && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {invoiceDetailsError[index].settled}
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
              )}
            </Box>
            <Box>
              {value === 1 && (
                <div>
                  <div className="row d-flex mt-4">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="totalSettled"
                          name="totalSettled"
                          label="Net Amount"
                          size="small"
                          disabled
                          value={formData.totalSettled}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.totalSettled}
                          helperText={fieldErrors.totalSettled}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField id="onAccount" name="onAccount" label="On Account" size="small" value={formData.onAccount} disabled />
                      </FormControl>
                    </div>
                    <div className="col-md-6 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          id="narration"
                          name="narration"
                          label="Narration"
                          multiline
                          size="small"
                          value={formData.narration}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 30 }}
                          error={!!fieldErrors.narration}
                          helperText={fieldErrors.narration}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}
            </Box>
            <Dialog
              open={modalOpen}
              maxWidth={'md'}
              fullWidth={true}
              onClose={handleCloseModal}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                <h6>Grid Details</h6>
              </DialogTitle>
              <DialogContent className="pb-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr style={{ backgroundColor: '#673AB7' }}>
                            <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                              <Checkbox
                                sx={{
                                  color: 'white',
                                  '&.Mui-checked': {
                                    color: 'white'
                                  }
                                }}
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                              S.No
                            </th>
                            <th className="table-header"># Invoice</th>
                            <th className="table-header">Date</th>
                            <th className="table-header">Bill Amount</th>
                            <th className="table-header">Tax</th>
                            <th className="table-header">Net Receivable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fillGridData?.map((row, index) => (
                            <tr key={row.id}>
                              <td className="border p-0 text-center">
                                <Checkbox
                                  sx={{
                                    backgroundColor: 'white'
                                  }}
                                  checked={selectedRows.includes(index)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                  }}
                                />
                              </td>
                              <td className="text-center">{index + 1}</td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.vid || ''}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : ''}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.billamount || ''}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.gstamount || ''}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.chargeAmt || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                <Button onClick={handleCloseModal} sx={{ color: '#673AB7' }}>
                  Cancel
                </Button>
                <Button color="secondary" onClick={handleSubmitSelectedRows} variant="contained" sx={{ backgroundColor: '#673AB7' }}>
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {/*  */}
        <ConfirmationModal
          open={modalApprove}
          title="AP Offset Approval"
          message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this ApOffset?`}
          onConfirm={handleConfirmAction}
          onCancel={handleCloseApprove}
        />
        {/*  */}
      </div>
      <ToastContainer />
    </div>
  );
};
export default AdjustmentOffset;
