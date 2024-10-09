import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import ActionButton from 'utils/ActionButton';
import PhysicalCountComponent from './PhysicalCount';

const ReconcileCash = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  // Handle tab changes
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // Placeholder action handlers
  const handleSearch = () => {
    console.log('Search action');
  };

  const handleSave = () => {
    console.log('Save action');
  };

  const [withdrawalsTableData, setWithdrawalsTableData] = useState([
    {
      sno: '',
      voucherNo: '',
      voucherDate: '',
      chqNo: '',
      chqDate: '',
      clearedDate: '',
      paymentAmount: '',
      paymentName: '',
      narration: ''
    }
  ]);

  const [withdrawalsTableErrors, setWithdrawalsTableErrors] = useState([
    {
      sno: '',
      voucherNo: '',
      voucherDate: '',
      chqNo: '',
      chqDate: '',
      clearedDate: '',
      paymentAmount: '',
      paymentName: '',
      narration: ''
    }
  ]);

  const handleAddRow = () => {
    setWithdrawalsTableData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1, // Or use a better ID generation method
        voucherNo: '',
        voucherDate: '',
        chqNo: '',
        chqDate: '',
        clearedDate: '',
        paymentAmount: '',
        paymentName: '',
        narration: ''
      }
    ]);
  };

  // const handleAddRow = () => {
  //   if (isLastRowEmpty(withdrawalsTableData)) {
  //     displayRowError(withdrawalsTableData);
  //     return;
  //   }
  //   const newRow = {
  //     id: Date.now(),
  //     sno: '',
  //     voucherNo: '',
  //     voucherDate: '',
  //     chqNo: '',
  //     chqDate: '',
  //     clearedDate: '',
  //     paymentAmount: '',
  //     paymentName: '',
  //     narration: ''
  //   };
  //   setWithdrawalsTableData([...withdrawalsTableData, newRow]);
  //   setWithdrawalsTableErrors([
  //     ...withdrawalsTableErrors,
  //     {
  //       sno: '',
  //       voucherNo: '',
  //       voucherDate: '',
  //       chqNo: '',
  //       chqDate: '',
  //       clearedDate: '',
  //       paymentAmount: '',
  //       paymentName: '',
  //       narration: ''
  //     }
  //   ]);
  // };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === withdrawalsTableData) {
      return (
        !lastRow.voucherNo ||
        !lastRow.voucherDate ||
        !lastRow.chqNo ||
        !lastRow.chqDate ||
        !lastRow.clearedDate ||
        !lastRow.narration ||
        !lastRow.paymentAmount ||
        !lastRow.paymentName
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
          voucherNo: !table[table.length - 1].voucherNo ? 'voucherNo is required' : '',
          voucherDate: !table[table.length - 1].voucherDate ? 'voucherDate is required' : '',
          chqNo: !table[table.length - 1].chqNo ? 'chqNo is required' : '',
          chqDate: !table[table.length - 1].chqDate ? 'chqDate is required' : '',
          clearedDate: !table[table.length - 1].clearedDate ? 'clearedDate is required' : '',
          paymentAmount: !table[table.length - 1].paymentAmount ? 'paymentAmount is required' : '',
          paymentName: !table[table.length - 1].paymentName ? 'paymentName is required' : '',
          narration: !table[table.length - 1].narration ? 'narration is required' : ''
        };
        return newErrors;
      });
    }
  };

  // const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
  //   const rowIndex = table.findIndex((row) => row.id === id);
  //   // If the row exists, proceed to delete
  //   if (rowIndex !== -1) {
  //     const updatedData = table.filter((row) => row.id !== id);
  //     const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
  //     setTable(updatedData);
  //     setErrorTable(updatedErrors);
  //   }
  // };

  const handleClear = () => {
    // setFormValues({
    //   section: '',
    //   sectionName: '',
    //   active: true
    // });

    // Set the table to only have one empty row
    setWithdrawalsTableData([
      {
        id: 1,
        sno: '',
        voucherNo: '',
        voucherDate: '',
        chqNo: '',
        chqDate: '',
        clearedDate: '',
        paymentAmount: '',
        paymentName: '',
        narration: ''
      }
    ]);

    // Reset table errors for just one row
    setWithdrawalsTableErrors([
      {
        sno: '',
        voucherNo: '',
        voucherDate: '',
        chqNo: '',
        chqDate: '',
        clearedDate: '',
        paymentAmount: '',
        paymentName: '',
        narration: ''
      }
    ]);

    // setValidationErrors({});
    // setEditId('');
  };

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    // setFormValues((prev) => ({
    //   ...prev,
    //   [id]: type === 'checkbox' ? checked : value
    // }));

    // Validate the input fields
    if (id === 'section' || id === 'sectionName') {
      if (!value.trim()) {
        setValidationErrors((prev) => ({
          ...prev,
          [id]: 'This field is required'
        }));
      } else {
        setValidationErrors((prev) => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const headers = [
    { label: 'Action', field: 'action', width: '68px', inputType: 'text' },
    { label: 'S.No', field: 'sno', width: '50px', inputType: 'text' },
    { label: 'Voucher No', field: 'voucherNo', inputType: 'text' },
    { label: 'Voucher Date', field: 'voucherDate', inputType: 'date' },
    { label: 'chq/DD No', field: 'chqNo', inputType: 'text' },
    { label: 'chq/DD Date', field: 'chqDate', inputType: 'date' },
    { label: 'Cleared Date', field: 'clearedDate', inputType: 'date' },
    { label: 'PaymentAmount', field: 'paymentAmount', inputType: 'text' },
    { label: 'PaymentName', field: 'paymentName', inputType: 'text' },
    { label: 'Narration', field: 'narration', inputType: 'text' }
  ];

  // const [withdrawalsTableData, setWithdrawalsTableData] = useState([]);
  // const [withdrawalsTableErrors, setWithdrawalsTableErrors] = useState([]);

  // Example of handling change dynamically
  const handleChange = (e, rowId, field, index) => {
    const value = e.target.value;
    setWithdrawalsTableData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));

    // Validation logic here
    const numericRegex = /^[0-9]*$/;
    if (field === 'voucherNo' && !numericRegex.test(value)) {
      setWithdrawalsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], [field]: 'Only numeric characters are allowed' };
        return newErrors;
      });
    } else {
      setWithdrawalsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], [field]: '' };
        return newErrors;
      });
    }
  };

  // Delete row handler
  const handleDeleteRow = (rowId) => {
    setWithdrawalsTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <div className="d-flex flex-wrap justify-content-start p-2">
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={''} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={''} />
            <ActionButton title="Save" icon={SaveIcon} onClick={''} />
          </div>
        </Grid>

        {/* Form Section */}
        <Grid container spacing={2} mt={2}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Branch/Location</InputLabel>
              <Select label="Branch/Location">
                <MenuItem value={20}>HEAD OFFICE</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Doc ID" size="small" disabled fullWidth required placeholder="Auto" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Doc Date"
                disabled
                slotProps={{
                  textField: { size: 'small', clearable: true }
                }}
                format="DD-MM-YYYY"
                value={dayjs()}
                //onChange={(newValue) => setBoDate(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Bank Stmt Date"
                slotProps={{
                  textField: { size: 'small', clearable: true }
                }}
                format="DD-MM-YYYY"
                // value={''}
                //onChange={(newValue) => setBoDate(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Bank Account" size="small" fullWidth required placeholder="Auto" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Remarks" size="small" fullWidth required placeholder="Auto" />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Last Reconciled On"
                slotProps={{
                  textField: { size: 'small', clearable: true }
                }}
                format="DD-MM-YYYY"
                // value={''}
                //onChange={(newValue) => setBoDate(newValue)}
              />
            </LocalizationProvider>
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Cleared Date"
                slotProps={{
                  textField: { size: 'small', clearable: true }
                }}
                format="DD-MM-YYYY"
                // value={''}
                //onChange={(newValue) => setBoDate(newValue)}
              />
            </LocalizationProvider>
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField label="Ledger Balance" size="small" fullWidth required placeholder="Auto" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Begining Balance" size="small" fullWidth required placeholder="Auto" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Ending Balance" size="small" fullWidth required placeholder="Auto" />
          </Grid> */}
        </Grid>
      </div>

      {/* Tabs Section */}
      <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} textColor="secondary" indicatorColor="secondary">
                <Tab label="withdrawals" value="1" />
                {/* <Tab label="Deposits" value="2" />
                <Tab label="Summary" value="3" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              {/* <TableComponent formValues={formValues} setFormValues={setFormValues} /> */}
              <PhysicalCountComponent />
            </TabPanel>
            {/* <TabPanel value="2">
              <ReusableTable
                data={withdrawalsTableData}
                errors={withdrawalsTableErrors}
                headers={headers}
                onAddRow={handleAddRow}
                onDeleteRow={handleDeleteRow}
                onChange={handleChange}
              />
            </TabPanel> */}
            {/* <TabPanel value="3">
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Total withdrawal" size="small" fullWidth placeholder="Auto" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Total Deposit" size="small" fullWidth placeholder="Auto" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Ending Balance" size="small" fullWidth placeholder="Auto" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Cleared Balance" size="small" fullWidth placeholder="Auto" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Difference" size="small" fullWidth placeholder="Auto" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField label="Narration" size="small" fullWidth placeholder="Auto" />
                </Grid>
              </Grid>
            </TabPanel> */}
          </TabContext>
        </Box>
      </div>
    </>
  );
};

export default ReconcileCash;
