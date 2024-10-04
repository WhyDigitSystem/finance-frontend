import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ToastContainer, toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { recomposeColor, useTheme } from '@mui/material/styles';
import React, { useState, useRef, useEffect } from 'react';
import ActionButton from 'utils/ActionButton';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { FormHelperText } from '@mui/material';
import dayjs from 'dayjs';
import CommonListViewTable from '../basicMaster/CommonListViewTable';

const FundTransfer = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    active: true,
    branch: '',
    docId: '',
    paymentType: '',
    docDate: null,
    referenceNo: '',
    referenceDate: '',
    fromAccount: '',
    balance: '',
    currency: '',
    exRate: '',
    toBranch: '',
    toBank: '',
    chequeBook: '',
    chequeNo: '',
    chequeDate: null,
    paymentAmount: '',
    conversionRate: '',
    receiptAmount: '',
    gainLoss: '',
    remarks: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    branch: '',
    docId: '',
    paymentType: '',
    docDate: null,
    referenceNo: '',
    referenceDate: '',
    fromAccount: '',
    balance: '',
    currency: '',
    exRate: '',
    toBranch: '',
    toBank: '',
    chequeBook: '',
    chequeNo: '',
    chequeDate: null,
    paymentAmount: '',
    conversionRate: '',
    receiptAmount: '',
    gainLoss: '',
    remarks: ''
  });

  const listViewColumns = [
    { accessorKey: 'branch', header: 'Branch/Location', size: 140 },
    { accessorKey: 'docId', header: 'Doc ID', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'fromAccount', header: 'From Account', size: 140 },
    { accessorKey: 'toBranch', header: 'To Branch/Location', size: 140 },
    { accessorKey: 'toBank', header: 'To Bank', size: 140 },
    { accessorKey: 'chequeNo', header: 'Cheque No', size: 140 },
    { accessorKey: 'paymentAmount', header: 'Payment Amt', size: 140 },
    { accessorKey: 'receiptAmount', header: 'Receipt Amt', size: 140 }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleClear = () => {
    setFormData({
      active: true,
      branch: '',
      docId: '',
      paymentType: '',
      docDate: null,
      referenceNo: '',
      referenceDate: '',
      fromAccount: '',
      balance: '',
      currency: '',
      exRate: '',
      toBranch: '',
      toBank: '',
      chequeBook: '',
      chequeNo: '',
      chequeDate: null,
      paymentAmount: '',
      conversionRate: '',
      receiptAmount: '',
      gainLoss: '',
      remarks: ''
    });
    setFieldErrors({
      branch: '',
      docId: '',
      paymentType: '',
      docDate: null,
      referenceNo: '',
      referenceDate: '',
      fromAccount: '',
      balance: '',
      currency: '',
      exRate: '',
      toBranch: '',
      toBank: '',
      chequeBook: '',
      chequeNo: '',
      chequeDate: null,
      paymentAmount: '',
      conversionRate: '',
      receiptAmount: '',
      gainLoss: '',
      remarks: ''
    });
  };

  const handleView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    getAllFundTransfer();
  }, []);

  const getAllFundTransfer = async () => {
    try {
      const response = await apiCalls('get', `transaction/getAllFundTransferByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.fundTransferVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};

    // Check for empty fields and set error messages
    if (!formData.branch) {
      errors.branch = 'Branch / Location is required';
    }
    if (!formData.docId) {
      errors.docId = 'Document ID is required';
    }
    if (!formData.paymentType) {
      errors.paymentType = 'Payment Type is required';
    }
    if (!formData.docDate) {
      errors.docDate = 'Document Date is required';
    }
    if (!formData.referenceNo) {
      errors.referenceNo = 'Reference No is required';
    }
    if (!formData.chequeNo) {
      errors.chequeNo = 'Cheque Number is required';
    }
    if (!formData.chequeBook) {
      errors.chequeBook = 'Cheque Book is required';
    }
    if (!formData.chequeNo) {
      errors.chequeNo = 'Cheque Number is required';
    }
    if (!formData.chequeDate) {
      errors.chequeDate = 'Cheque Date is required';
    }
    if (!formData.fromAccount) {
      errors.fromAccount = 'From Account is required';
    }
    if (!formData.balance) {
      errors.balance = 'Balance is required';
    }
    if (!formData.toBranch) {
      errors.toBranch = 'To Bank / Location is required';
    }
    if (!formData.toBank) {
      errors.toBank = 'To Bank is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exRate) {
      errors.exRate = 'Exchange Rate is required';
    }
    if (!formData.paymentAmount) {
      errors.paymentAmount = 'Payment Amount is required';
    }
    if (!formData.receiptAmount) {
      errors.receiptAmount = 'Receipt Amount is required';
    }
    if (!formData.conversionRate) {
      errors.conversionRate = 'Conversion Rate is required';
    }
    if (!formData.gainLoss) {
      errors.gainLoss = 'Gain Loss is required';
    }

    // If errors exist, update fieldErrors state and don't proceed with save
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    // Prepare the API payload with the necessary fields
    const saveFormData = {
      active: formData.active,
      branch: formData.branch || '',
      docId: formData.docId,
      paymentType: formData.paymentType || '',
      docDate: formData.docDate,
      referenceNo: formData.referenceNo || '',
      referenceDate: formData.referenceDate || '',
      fromAccount: formData.fromAccount,
      balance: formData.balance || '', // Ensure fields are mapped correctly
      currency: formData.currency,
      exRate: formData.exRate,
      toBranch: formData.toBranch || '',
      toBank: formData.toBank,
      chequeBook: formData.chequeBook || '',
      chequeNo: formData.chequeNo,
      chequeDate: formData.chequeDate,
      paymentAmount: formData.paymentAmount,
      conversionRate: formData.conversionRate || '',
      receiptAmount: formData.receiptAmount,
      gainLoss: formData.gainLoss || '',
      remarks: formData.remarks || '',
      createdBy: loginUserName,
      orgId: orgId
    };

    try {
      const response = await apiCalls('put', `transaction/updateCreateFundTransfer`, saveFormData);
      if (response.status === true) {
        showToast('success', editId ? 'Fund Transfer Updated Successfully' : 'Fund Transfer created successfully');
        handleClear();
        getAllFundTransfer();
        setIsLoading(false);
      } else {
        showToast('error', response.paramObjectsMap.errorMessage || 'Fund Transfer creation failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Fund Transfer creation failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-start mb-2 " style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              // toEdit={getBrsOpeningsById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="branch" required>
                    Branch/Location
                  </InputLabel>
                  <Select
                    labelId="branch"
                    id="branch"
                    name="branch"
                    required
                    value={formData.branch}
                    label="Branch/Location"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="HEAD OFFICE">HEAD OFFICE</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="docId"
                  label="Doc ID"
                  name="docId"
                  variant="outlined"
                  size="small"
                  value={formData.docId}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.docId}
                  helperText={fieldErrors.docId ? fieldErrors.docId : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.paymentType}>
                  <InputLabel id="paymentType" required>
                    Payment Type
                  </InputLabel>
                  <Select
                    labelId="paymentType"
                    id="paymentType"
                    name="paymentType"
                    required
                    value={formData.paymentType}
                    label="Payment Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="HEAD OFFICE">HEAD OFFICE</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.paymentType && <FormHelperText>{fieldErrors.paymentType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
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
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="referenceNo"
                  label="Reference No."
                  name="referenceNo"
                  variant="outlined"
                  size="small"
                  value={formData.referenceNo}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.referenceNo}
                  helperText={fieldErrors.referenceNo ? fieldErrors.referenceNo : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Reference Date"
                      value={formData.referenceDate ? dayjs(formData.referenceDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('referenceDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.referenceDate}
                      helperText={fieldErrors.referenceDate ? fieldErrors.referenceDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="fromAccount"
                  label="From Account"
                  name="fromAccount"
                  variant="outlined"
                  size="small"
                  value={formData.fromAccount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.fromAccount}
                  helperText={fieldErrors.fromAccount ? fieldErrors.fromAccount : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="balance"
                  label="Balance"
                  name="balance"
                  variant="outlined"
                  size="small"
                  value={formData.balance}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.balance}
                  helperText={fieldErrors.balance ? fieldErrors.balance : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="currency"
                  label="Currency"
                  name="currency"
                  variant="outlined"
                  size="small"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.currency}
                  helperText={fieldErrors.currency ? fieldErrors.currency : ''}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="exRate"
                  label="Ex. Rate"
                  name="exRate"
                  variant="outlined"
                  size="small"
                  value={formData.exRate}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.exRate}
                  helperText={fieldErrors.exRate ? fieldErrors.exRate : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="toBranch"
                  label="To Branch/Location"
                  name="toBranch"
                  variant="outlined"
                  size="small"
                  value={formData.toBranch}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.toBranch}
                  helperText={fieldErrors.toBranch ? fieldErrors.toBranch : ''}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="toBank"
                  label="To Bank"
                  name="toBank"
                  variant="outlined"
                  size="small"
                  value={formData.toBank}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.toBank}
                  helperText={fieldErrors.toBank ? fieldErrors.toBank : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="chequeBook"
                  label="Cheque Book"
                  name="chequeBook"
                  variant="outlined"
                  size="small"
                  value={formData.chequeBook}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.chequeBook}
                  helperText={fieldErrors.chequeBook ? fieldErrors.chequeBook : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="chequeNo"
                  label="Cheque No"
                  name="chequeNo"
                  variant="outlined"
                  size="small"
                  value={formData.chequeNo}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.chequeNo}
                  helperText={fieldErrors.chequeNo ? fieldErrors.chequeNo : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Cheque Date"
                      value={formData.chequeDate ? dayjs(formData.chequeDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('chequeDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.chequeDate}
                      helperText={fieldErrors.chequeDate ? fieldErrors.chequeDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="paymentAmount"
                  label="Payment Amt."
                  name="paymentAmount"
                  variant="outlined"
                  size="small"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.paymentAmount}
                  helperText={fieldErrors.paymentAmount ? fieldErrors.paymentAmount : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="conversionRate"
                  label="Conversion Rate"
                  name="conversionRate"
                  variant="outlined"
                  size="small"
                  value={formData.conversionRate}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.conversionRate}
                  helperText={fieldErrors.conversionRate ? fieldErrors.conversionRate : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="receiptAmount"
                  label="Receipt Amt."
                  name="receiptAmount"
                  variant="outlined"
                  size="small"
                  value={formData.receiptAmount}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.receiptAmount}
                  helperText={fieldErrors.receiptAmount ? fieldErrors.receiptAmount : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="gainLoss"
                  label="Gain/Loss"
                  name="gainLoss"
                  variant="outlined"
                  size="small"
                  value={formData.gainLoss}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.gainLoss}
                  helperText={fieldErrors.gainLoss ? fieldErrors.gainLoss : ''}
                />
              </div>
              <div className="col-md-8 mb-3">
                <TextField
                  id="remarks"
                  label="Remarks"
                  name="remarks"
                  variant="outlined"
                  size="small"
                  multiline
                  minRows={2}
                  value={formData.remarks}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default FundTransfer;
