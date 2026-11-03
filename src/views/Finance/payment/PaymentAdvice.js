import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, FormHelperText } from '@mui/material';
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
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const AMOUNT_REGEX = /^[0-9]*\.?[0-9]*$/;

const initialFormData = () => ({
  active: true,
  docId: '',
  docDate: dayjs().format('YYYY-MM-DD'),
  partyName: '',
  partyCode: '',
  state: '',
  paymentMode: 'NEFT',
  transferredToAcNo: '',
  transferredToBank: '',
  transferDate: dayjs().format('YYYY-MM-DD'),
  issuedFrom: '',
  paymentAmt: '',
  totalAmt: '0.00',
  balance: '0.00'
});

const initialErrors = () => ({
  docDate: '',
  partyName: '',
  partyCode: '',
  state: '',
  paymentMode: '',
  transferredToAcNo: '',
  transferredToBank: '',
  transferDate: '',
  issuedFrom: '',
  paymentAmt: ''
});

const emptyRow = () => ({
  id: Date.now() + Math.random(),
  billReference: '',
  billDate: null,
  amount: '',
  gst: '',
  totAmt: '0.00'
});

const PaymentAdvice = () => {
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName] = useState(localStorage.getItem('userName'));
  const [branchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear] = useState(localStorage.getItem('finYear'));
  const [branch] = useState(localStorage.getItem('branch'));
  const [partyList, setPartyList] = useState([]);
  const [bankList, setBankList] = useState([]);

  const [formData, setFormData] = useState(initialFormData());
  const [fieldErrors, setFieldErrors] = useState(initialErrors());
  const [billTableData, setBillTableData] = useState([emptyRow()]);
  const [billTableErrors, setBillTableErrors] = useState([{}]);

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc ID', size: 140 },
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'paymentMode', header: 'Mode', size: 140 },
    { accessorKey: 'totalAmt', header: 'Total', size: 140 },
    { accessorKey: 'paymentAmt', header: 'Amount', size: 140 },
    { accessorKey: 'balance', header: 'Balance', size: 140 }
  ];

  // ---------- API calls (endpoints are assumed - align with your backend) ----------
  useEffect(() => {
    getAllPartyName();
    getAllBanks();
    getAllPaymentAdvice();
    getPaymentAdviceDocId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllPartyName = async () => {
    try {
      const response = await apiCalls('get', `payable/getPartyNameAndPartyCode?orgId=${orgId}`);
      if (response.status === true) {
        setPartyList(response.paramObjectsMap.PartyMasterVO || []);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const getAllBanks = async () => {
    try {
      const response = await apiCalls('get', `transaction/getBankNameForGroupLedger?orgId=${orgId}`);
      if (response.status === true) {
        setBankList(response.paramObjectsMap.accountName || []);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const getPaymentAdviceDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `payable/getPaymentAdviceDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      if (response.status === true) {
        setFormData((prev) => ({ ...prev, docId: response.paramObjectsMap.paymentAdviceDocId }));
      }
    } catch (error) {
      console.error('Error fetching doc id:', error);
    }
  };

  const getAllPaymentAdvice = async () => {
    try {
      const response = await apiCalls('get', `payable/getAllPaymentAdviceByOrgId?orgId=${orgId}`);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.paymentAdviceVO || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPaymentAdviceById = async (row) => {
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `payable/getPaymentAdviceById?id=${row.original.id}`);
      if (response.status === true) {
        setListView(false);
        const vo = response.paramObjectsMap.paymentAdviceVO[0];
        setFormData({
          active: vo.active,
          docId: vo.docId,
          docDate: dayjs(vo.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          partyName: vo.partyName,
          partyCode: vo.partyCode,
          state: vo.state,
          paymentMode: vo.paymentMode,
          transferredToAcNo: vo.transferredToAcNo,
          transferredToBank: vo.transferredToBank,
          transferDate: dayjs(vo.transferDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          issuedFrom: vo.issuedFrom,
          paymentAmt: vo.paymentAmt,
          totalAmt: vo.totalAmt,
          balance: vo.balance
        });
        const rows = (vo.paymentAdviceDtlsVO || []).map((d) => ({
          id: d.id || Date.now() + Math.random(),
          billReference: d.billReference,
          billDate: d.billDate ? dayjs(d.billDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
          amount: d.amount,
          gst: d.gst,
          totAmt: d.totAmt
        }));
        setBillTableData(rows.length ? rows : [emptyRow()]);
        setBillTableErrors(rows.map(() => ({})));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ---------- totals: Total = sum of TOT AMT, Balance = Amount - Total ----------
  useEffect(() => {
    const total = billTableData.reduce((sum, r) => sum + toNum(r.totAmt), 0);
    setFormData((prev) => ({
      ...prev,
      totalAmt: total.toFixed(2),
      paymentAmt: total > 0 && !editId ? total.toFixed(2) : prev.paymentAmt
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billTableData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, balance: (toNum(prev.paymentAmt) - toNum(prev.totalAmt)).toFixed(2) }));
  }, [formData.paymentAmt, formData.totalAmt]);

  useEffect(() => {
    if (partyList.length === 1 && !formData.partyName) {
      handlePartyChange(partyList[0].partyName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyList]);

  // ---------- handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'paymentAmt' && !AMOUNT_REGEX.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only numbers are allowed' });
      return;
    }
    if (name === 'transferredToAcNo' && !/^[0-9]*$/.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only numbers are allowed' });
      return;
    }
    if (name === 'transferredToBank' && !/^[A-Za-z0-9\s\-&.]*$/.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Only alphabets, numbers, hyphen, and spaces are allowed' });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePartyChange = (partyNameValue) => {
    const selectedParty = partyList.find((p) => p.partyName === partyNameValue);
    setFormData((prev) => ({
      ...prev,
      partyName: partyNameValue,
      partyCode: selectedParty ? selectedParty.partyCode : '',
      state: selectedParty ? selectedParty.stateName || selectedParty.state || '' : ''
    }));
    setFieldErrors((prev) => ({ ...prev, partyName: '', partyCode: '', state: '' }));
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date ? dayjs(date).format('YYYY-MM-DD') : null });
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  // ----- bill table -----
  const handleBillChange = (index, field, value) => {
    if ((field === 'amount' || field === 'gst') && !AMOUNT_REGEX.test(value)) {
      setBillTableErrors((prev) => prev.map((err, i) => (i === index ? { ...err, [field]: 'Numbers only' } : err)));
      return;
    }
    setBillTableData((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [field]: value };
        updated.totAmt = (toNum(updated.amount) + toNum(updated.gst)).toFixed(2);
        return updated;
      })
    );
    setBillTableErrors((prev) => prev.map((err, i) => (i === index ? { ...err, [field]: '' } : err)));
  };

  const handleAddRow = () => {
    setBillTableData((prev) => [...prev, emptyRow()]);
    setBillTableErrors((prev) => [...prev, {}]);
  };

  const handleDeleteRow = (index) => {
    setBillTableData((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((_, i) => i !== index)));
    setBillTableErrors((prev) => (prev.length === 1 ? [{}] : prev.filter((_, i) => i !== index)));
  };

  const handleView = () => setListView(!listView);

  const handleClear = () => {
    setFormData(initialFormData());
    setFieldErrors(initialErrors());
    setBillTableData([emptyRow()]);
    setBillTableErrors([{}]);
    setEditId('');
    getPaymentAdviceDocId();
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.docDate) errors.docDate = 'Date is required';
    if (!formData.partyName) errors.partyName = 'Party Name is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.paymentMode) errors.paymentMode = 'Mode is required';
    if (!formData.transferredToAcNo) errors.transferredToAcNo = 'A/C No is required';
    if (!formData.transferredToBank) errors.transferredToBank = 'Bank is required';
    if (!formData.transferDate) errors.transferDate = 'Transfer Date is required';
    if (!formData.issuedFrom) errors.issuedFrom = 'Issued From is required';
    if (!formData.paymentAmt) errors.paymentAmt = 'Amount is required';

    let detailsValid = true;
    const rowErrs = billTableData.map((row) => {
      const e = {};
      if (!row.billReference) e.billReference = 'Required';
      if (!row.billDate) e.billDate = 'Required';
      if (!row.amount) e.amount = 'Required';
      if (row.gst === '' || row.gst === null) e.gst = 'Required';
      if (Object.keys(e).length) detailsValid = false;
      return e;
    });
    setBillTableErrors(rowErrs);

    if (Object.keys(errors).length > 0 || !detailsValid) {
      setFieldErrors({ ...initialErrors(), ...errors });
      return;
    }

    setIsLoading(true);

    const detailsDto = billTableData.map((row) => ({
      ...(editId && { id: row.id }),
      billReference: row.billReference,
      billDate: dayjs(row.billDate).format('YYYY-MM-DD'),
      amount: toNum(row.amount),
      gst: toNum(row.gst),
      totAmt: toNum(row.totAmt)
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      active: formData.active,
      docId: formData.docId,
      docDate: dayjs(formData.docDate).format('YYYY-MM-DD'),
      partyName: formData.partyName,
      partyCode: formData.partyCode,
      state: formData.state,
      paymentMode: formData.paymentMode,
      transferredToAcNo: formData.transferredToAcNo,
      transferredToBank: formData.transferredToBank,
      transferDate: dayjs(formData.transferDate).format('YYYY-MM-DD'),
      issuedFrom: formData.issuedFrom,
      paymentAmt: toNum(formData.paymentAmt),
      totalAmt: toNum(formData.totalAmt),
      balance: toNum(formData.balance),
      paymentAdviceDtlsDTO: detailsDto,
      orgId: parseInt(orgId),
      createdBy: loginUserName,
      branch: branch,
      branchCode: branchCode,
      finYear: finYear
    };

    try {
      const response = await apiCalls('put', `payable/updateCreatePaymentAdvice`, saveFormData);
      if (response.status === true) {
        showToast('success', editId ? 'Payment Advice Updated Successfully' : 'Payment Advice created successfully');
        handleClear();
        getAllPaymentAdvice();
      } else {
        showToast('error', response.paramObjectsMap?.errorMessage || 'Payment Advice creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Payment Advice creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getPaymentAdviceById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  id="docId"
                  label="Doc ID"
                  name="docId"
                  variant="outlined"
                  size="small"
                  value={formData.docId}
                  fullWidth
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          clearable: true,
                          error: !!fieldErrors.docDate,
                          helperText: fieldErrors.docDate
                        }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList}
                  getOptionLabel={(option) => option.partyName}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.partyName ? partyList.find((c) => c.partyName === formData.partyName) || null : null}
                  onChange={(event, newValue) => handlePartyChange(newValue ? newValue.partyName : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Party Name"
                      name="partyName"
                      required
                      error={!!fieldErrors.partyName}
                      helperText={fieldErrors.partyName}
                      InputProps={{ ...params.InputProps, style: { height: 40 } }}
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
                    error={!!fieldErrors.partyCode}
                    helperText={fieldErrors.partyCode}
                    disabled
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="state"
                  label="State"
                  name="state"
                  variant="outlined"
                  size="small"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.state}
                  helperText={fieldErrors.state ? fieldErrors.state : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.paymentMode}>
                  <InputLabel id="paymentMode" required>
                    Mode
                  </InputLabel>
                  <Select
                    labelId="paymentMode"
                    id="paymentMode"
                    name="paymentMode"
                    required
                    value={formData.paymentMode}
                    label="Mode"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="NEFT">NEFT</MenuItem>
                    <MenuItem value="RTGS">RTGS</MenuItem>
                    <MenuItem value="IMPS">IMPS</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                    <MenuItem value="CASH">CASH</MenuItem>
                  </Select>
                  {fieldErrors.paymentMode && <FormHelperText>{fieldErrors.paymentMode}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="transferredToAcNo"
                  label="Transferred To (A/C No)"
                  name="transferredToAcNo"
                  variant="outlined"
                  size="small"
                  value={formData.transferredToAcNo}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  inputProps={{ maxLength: 30 }}
                  error={!!fieldErrors.transferredToAcNo}
                  helperText={fieldErrors.transferredToAcNo ? fieldErrors.transferredToAcNo : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="transferredToBank"
                  label="Transferred To (Bank)"
                  name="transferredToBank"
                  variant="outlined"
                  size="small"
                  value={formData.transferredToBank}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  error={!!fieldErrors.transferredToBank}
                  helperText={fieldErrors.transferredToBank ? fieldErrors.transferredToBank : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Transfer Date"
                      value={formData.transferDate ? dayjs(formData.transferDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('transferDate', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          clearable: true,
                          error: !!fieldErrors.transferDate,
                          helperText: fieldErrors.transferDate
                        }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.issuedFrom}>
                  <InputLabel id="issuedFrom" required>
                    Issued From
                  </InputLabel>
                  <Select
                    labelId="issuedFrom"
                    id="issuedFrom"
                    name="issuedFrom"
                    required
                    value={formData.issuedFrom}
                    label="Issued From"
                    onChange={handleInputChange}
                  >
                    {bankList.map((bank, index) => (
                      <MenuItem key={index} value={bank.accountgroupname}>
                        {bank.accountgroupname}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.issuedFrom && <FormHelperText>{fieldErrors.issuedFrom}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="paymentAmt"
                  label="Amount"
                  name="paymentAmt"
                  variant="outlined"
                  size="small"
                  value={formData.paymentAmt}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={!!fieldErrors.paymentAmt}
                  helperText={fieldErrors.paymentAmt ? fieldErrors.paymentAmt : ''}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField id="totalAmt" name="totalAmt" label="Total" size="small" value={formData.totalAmt} disabled />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField id="balance" name="balance" label="Balance" size="small" value={formData.balance} disabled />
                </FormControl>
              </div>
            </div>

            {/* ---------- Bill details ---------- */}
            <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
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
                          <th className="px-2 py-2 text-white text-center">Bill Reference</th>
                          <th className="px-2 py-2 text-white text-center">Bill Date</th>
                          <th className="px-2 py-2 text-white text-center">Amount</th>
                          <th className="px-2 py-2 text-white text-center">GST</th>
                          <th className="px-2 py-2 text-white text-center">TOT AMT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billTableData.map((row, index) => (
                          <tr key={row.id}>
                            <td className="border px-2 py-2 text-center">
                              <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(index)} />
                            </td>
                            <td className="text-center">
                              <div className="pt-2">{index + 1}</div>
                            </td>
                            <td className="border px-2 py-2">
                              <input
                                type="text"
                                value={row.billReference}
                                onChange={(e) => handleBillChange(index, 'billReference', e.target.value)}
                                className={billTableErrors[index]?.billReference ? 'error form-control' : 'form-control'}
                              />
                              {billTableErrors[index]?.billReference && (
                                <div style={{ color: 'red', fontSize: '12px' }}>{billTableErrors[index].billReference}</div>
                              )}
                            </td>
                            <td className="border px-2 py-2">
                              <input
                                type="date"
                                value={row.billDate ? dayjs(row.billDate).format('YYYY-MM-DD') : ''}
                                onChange={(e) => handleBillChange(index, 'billDate', e.target.value)}
                                className={billTableErrors[index]?.billDate ? 'error form-control' : 'form-control'}
                              />
                              {billTableErrors[index]?.billDate && (
                                <div style={{ color: 'red', fontSize: '12px' }}>{billTableErrors[index].billDate}</div>
                              )}
                            </td>
                            <td className="border px-2 py-2">
                              <input
                                type="text"
                                value={row.amount}
                                onChange={(e) => handleBillChange(index, 'amount', e.target.value)}
                                className={billTableErrors[index]?.amount ? 'error form-control text-end' : 'form-control text-end'}
                              />
                              {billTableErrors[index]?.amount && (
                                <div style={{ color: 'red', fontSize: '12px' }}>{billTableErrors[index].amount}</div>
                              )}
                            </td>
                            <td className="border px-2 py-2">
                              <input
                                type="text"
                                value={row.gst}
                                onChange={(e) => handleBillChange(index, 'gst', e.target.value)}
                                className={billTableErrors[index]?.gst ? 'error form-control text-end' : 'form-control text-end'}
                              />
                              {billTableErrors[index]?.gst && (
                                <div style={{ color: 'red', fontSize: '12px' }}>{billTableErrors[index].gst}</div>
                              )}
                            </td>
                            <td className="border px-2 py-2">
                              <input type="text" value={row.totAmt} disabled readOnly className="form-control text-end" />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={6} className="text-end fw-bold px-2 py-2">
                            Total
                          </td>
                          <td className="text-end fw-bold px-2 py-2">{formData.totalAmt}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentAdvice;
