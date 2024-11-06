import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveCurrency } from 'utils/CommonFunctions';

const AdjustmentJournal = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    currency: '',
    docDate: dayjs(),
    docId: '',
    exRate: '',
    orgId: orgId,
    refDate: null,
    refNo: '',
    suppRefDate: null,
    suppRefNo: '',
    remarks: '',
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    adjustmentType: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    currency: '',
    docDate: new Date(),
    exRate: '',
    orgId: orgId,
    refDate: null,
    refNo: '',
    remarks: '',
    suppRefNo: '',
    suppRefDate: null,
    totalCreditAmount: 0,
    totalDebitAmount: 0
  });

  const listViewColumns = [
    { accessorKey: 'adjustmentType', header: 'Adjustment Type', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'exRate', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'docId', header: 'Document Id', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      accountsName: '',
      creditAmount: '',
      debitAmount: '',
      creditBase: '',
      debitBase: '',
      subLedgerCode: '',
      subledgerName: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      accountsName: '',
      creditAmount: '',
      debitAmount: '',
      creditBase: '',
      debitBase: '',
      subLedgerCode: '',
      subledgerName: ''
    }
  ]);

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
    getAdjustmentJournalDocId();
    getAllAdjustmentJournalByOrgId();
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.debitAmount || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.creditAmount || 0), 0);

    setFormData((prev) => ({
      ...prev,
      totalDebitAmount: totalDebit,
      totalCreditAmount: totalCredit
    }));
  }, [detailsTableData]);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      docId: '',
      exRate: '',
      orgId: orgId,
      refDate: null,
      refNo: '',
      remarks: '',
      suppRefNo: '',
      suppRefDate: null,
      totalCreditAmount: 0,
      totalDebitAmount: 0
      // voucherSubType: ''
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
      currency: '',
      docDate: null,
      // docId: '24GJ0001',
      exRate: '',
      orgId: orgId,
      refDate: '',
      refNo: '',
      remarks: '',
      // voucherSubType: ''
    });
    setDetailsTableData([
      { id: 1, accountsName: '', creditAmount: '', debitAmount: '', creditBase: '', debitBase: '', subLedgerCode: '', subledgerName: '' }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getAdjustmentJournalDocId();
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      accountsName: '',
      creditAmount: '',
      debitAmount: '',
      creditBase: '',
      debitBase: '',
      subLedgerCode: '',
      subledgerName: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { accountsName: '', subLedgerCode: '', subledgerName: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.accountsName || !lastRow.subLedgerCode || !lastRow.subledgerName;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          accountsName: !table[table.length - 1].accountsName ? 'Account Name is required' : '',
          subLedgerCode: !table[table.length - 1].subLedgerCode ? 'Sub Ledger Code is required' : '',
          subledgerName: !table[table.length - 1].subledgerName ? 'Sub Ledger Name is required' : ''
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

  const handleDebitChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debitAmount: value, creditAmount: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          debitAmount: !value ? 'Debit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, creditAmount: value, debitAmount: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          creditAmount: !value ? 'Credit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exRate) {
      errors.exRate = 'Ex Rate is required';
    }
    if (!formData.refNo) {
      errors.refNo = 'Ref No is required';
    }
    if (!formData.refDate) {
      errors.refDate = 'Ref Date is required';
    }
    if (!formData.suppRefNo) {
      errors.suppRefNo = 'Supp Ref No is required';
    }
    if (!formData.suppRefDate) {
      errors.suppRefDate = 'SuppRef Date is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.accountsName) {
        rowErrors.accountsName = 'Account Name is required';
        detailTableDataValid = false;
      }
      if (!row.creditAmount) {
        rowErrors.creditAmount = 'Credit is required';
        detailTableDataValid = false;
      }
      if (!row.debitAmount) {
        rowErrors.debitAmount = 'Debit is required';
        detailTableDataValid = false;
      }
      if (!row.creditBase) {
        rowErrors.creditBase = 'creditBase is required';
        detailTableDataValid = false;
      }
      if (!row.debitBase) {
        rowErrors.debitBase = 'debitBase is required';
        detailTableDataValid = false;
      }
      if (!row.subLedgerCode) {
        rowErrors.subLedgerCode = 'Sub Ledger Code is required';
        detailTableDataValid = false;
      }
      if (!row.subledgerName) {
        rowErrors.subledgerName = 'Sub Ledger Name is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const AdjustmentJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountsName,
        creditAmount: row.creditAmount,
        debitAmount: row.debitAmount,
        debitBase: row.debitBase,
        creditBase: row.creditBase,
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        accountParticularsDTO: AdjustmentJournalVO,
        adjustmentType: formData.adjustmentType,
        // docId: formData.docId,
        // docDate: formData.docDate,
        currency: formData.currency,
        exRate: formData.exRate,
        refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
        suppRefNo: formData.suppRefNo,
        remarks: formData.remarks,
        // totalCreditAmount: formData.totalCreditAmount,
        // totalDebitAmount: formData.totalDebitAmount
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Adjustment Journal Updated Successfully' : 'Adjustment Journal Created successfully');
          getAllAdjustmentJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Adjustment Journal creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Adjustment Journal creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const getAdjustmentJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      console.log('docid working');

      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.adjustmentJournalDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllAdjustmentJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.adjustmentJournalVO || []);
      // showForm(true);
      console.log('adjustmentJournalVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalById?id=${row.original.id}`);

      if (result) {
        const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
        setEditId(row.original.id);

        setFormData({
          // voucherSubType: adVO.voucherSubType || '',
          id: adVO.id || '',
          docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          docId: adVO.docId || '',
          currency: adVO.currency || '',
          exRate: adVO.exRate || '',
          refNo: adVO.refNo || '',
          refDate: adVO.refDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          suppRefNo: adVO.suppRefNo || '',
          suppRefDate: adVO.suppRefDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: adVO.remarks || '',
          orgId: adVO.orgId || '',
          totalDebitAmount: adVO.totalDebitAmount || '',
          totalCreditAmount: adVO.totalCreditAmount || ''
          // active: adVO.active || false,
        });
        setDetailsTableData(
          adVO.accountParticularsVO.map((row) => ({
            id: row.id,
            accountsName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            debitBase: row.debitBase,
            creditBase: row.creditBase,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', adVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.adjustmentType}>
                    <InputLabel id="AdjustmentType-label">Adjustment Type</InputLabel>
                    <Select
                      labelId="AdjustmentType-label"
                      label="Adjustment Type"
                      // type='string'
                      value={formData.adjustmentType}
                      onChange={handleInputChange}
                      name="adjustmentType"
                    >
                      <MenuItem value="GENERAL">GENERAL</MenuItem>
                      <MenuItem value="EXPENSE">EXPENSE</MenuItem>
                    </Select>
                    {fieldErrors.adjustmentType && <FormHelperText>{fieldErrors.adjustmentType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
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
                  <TextField
                    id="outlined-textarea-zip"
                    label="Document Id"
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
                      // type='string'
                      onChange={handleInputChange}
                      name="currency"
                      value={formData.currency}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.currency}>
                          {item.currency}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label={
                      <span>
                        Ex. Rate <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="exRate"
                    // type="number"
                    value={formData.exRate}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.exRate ? 'Ex. Rate is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label={
                      <span>
                        Reference No <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    // type='string'
                    fullWidth
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.refNo ? 'Ref No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Reference Date"
                        value={formData.refDate}
                        onChange={(date) => handleDateChange('refDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.refDate && <p className="dateErrMsg">Ref Date is required</p>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label={
                      <span>
                        Supp. Reference No. <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    // type='string'
                    fullWidth
                    name="suppRefNo"
                    value={formData.suppRefNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.suppRefNo ? 'suppRef No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Supp. Reference No. Date"
                        value={formData.suppRefDate}
                        onChange={(date) => handleDateChange('suppRefDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.suppRefDate && <p className="dateErrMsg">suppRef Date is required</p>}
                  </FormControl>
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-md-8">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="remarks"
                      label="Remarks"
                      size="small"
                      name="remarks"
                      // type='string'
                      value={formData.remarks}
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 30 }}
                      onChange={handleInputChange}
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
                    <Tab value={0} label="Account Particulars" />
                    <Tab value={1} label="Total Summary" />
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
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Account Name</th>
                                    <th className="table-header">Sub Ledger Name</th>
                                    <th className="table-header">Sub Ledger Code</th>
                                    <th className="table-header">Debit</th>
                                    <th className="table-header">Credit</th>
                                    <th className="table-header">Debit (Base)</th>
                                    <th className="table-header">Credit (Base)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              detailsTableData,
                                              setDetailsTableData,
                                              detailsTableErrors,
                                              setDetailsTableErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.accountsName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, accountsName: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                accountsName: !value ? 'Account Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.accountsName ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.accountsName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].accountsName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                        // type='string'
                                          value={row.subledgerName}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, subledgerName: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                subledgerName: !value ? 'Sub Ledger Name is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.subledgerName ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.subledgerName && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].subledgerName}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                        // type='string'
                                          value={row.subLedgerCode}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, subLedgerCode: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                subLedgerCode: !value ? 'Sub Ledger Code is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.subLedgerCode ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.subLedgerCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].subLedgerCode}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          // type="number"
                                          value={row.debitAmount}
                                          onChange={(e) => handleDebitChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.debitAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.debitAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].debitAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          // type='number'
                                          value={row.creditAmount}
                                          onChange={(e) => handleCreditChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.creditAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.creditAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].creditAmount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          // type="number"
                                          value={row.creditBase}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, creditBase: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                creditBase: !value ? 'creditBase is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.creditBase ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.creditBase && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].creditBase}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          // type="number"
                                          value={row.debitBase}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debitBase: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                debitBase: !value ? 'debitBase is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.debitBase ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.debitBase && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].debitBase}
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
                      <div className="row mt-2">
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Total Debit Amount"
                            variant="outlined"
                            size="small"
                            
                            fullWidth
                            name="totalDebitAmount"
                            value={formData.totalDebitAmount}
                            onChange={handleInputChange}
                            disabled
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.totalDebitAmount ? 'Total Debit Amount is required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Total Credit Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalCreditAmount"
                            value={formData.totalCreditAmount}
                            onChange={handleInputChange}
                            disabled
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.totalCreditAmount ? 'Total Credit Amount is required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllAdjustmentJournalById} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdjustmentJournal;
