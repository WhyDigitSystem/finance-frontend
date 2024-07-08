import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
// import GstTable from './GstTable';
// import TableComponent from './TableComponent';

const CostDebitNote = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [listView, setlistView] = useState(false);
  const [data, setData] = useState(false);

  const [formData, setFormData] = useState({
    active: true,
    mode: '',
    product: '',
    purchaseVoucherNO: '',
    purchaseVoucherDate: null,
    costInvNo: '',
    docDate: null,
    supplierBillNo: '',
    docDate1: null,
    supplierType: '',
    supplierCode: '',
    creditDays: '',
    dueDate: null,
    supplierName: '',
    supplierLoc: '',
    currency: '',
    exRates: '',
    gstStateCode: '',
    supplierGstIn: '',
    remarks: '',
    address: '',
    shipperRefNo: '',
    otherInfo: '',
    gstType: '',
    payment: '',
    accrualId: '',
    utrRef: '',
    costType: '',
    orgId: orgId,
    updatedBy: ''
  });

  const [errors, setErrors] = useState({
    mode: '',
    product: '',
    purchaseVoucherNO: '',
    purchaseVoucherDate: new Date(),
    costInvNo: '',
    docDate: new Date(),
    supplierBillNo: '',
    docDate1: new Date(),
    supplierType: '',
    supplierCode: '',
    creditDays: '',
    dueDate: null,
    supplierName: '',
    supplierLoc: '',
    currency: '',
    exRates: '',
    gstStateCode: '',
    supplierGstIn: '',
    remarks: '',
    address: '',
    shipperRefNo: '',
    otherInfo: '',
    gstType: '',
    payment: '',
    accrualId: '',
    utrRef: '',
    costType: ''
  });

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});

  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);

  const handleListView = () => {
    setlistView(!listView);
  };

  const handleClear = () => {
    setFormData({
      active: true,
      address: '',
      addressType: '',
      billCurr: '',
      chargerTaxInvoiceDTO: [],
      createdBy: '',
      docDate: new Date(),
      dueDate: null,
      gstTaxInvoiceDTO: [],
      gsttype: '',
      headerColumns: '',
      id: 0,
      invoiceDate: new Date(),
      orgId: 0,
      partyCode: '',
      partyName: '',
      partyType: '',
      pincode: '',
      placeOfSupply: '',
      recipientGSTIN: '',
      salesType: '',
      status: '',
      summaryTaxInvoiceDTO: [],
      updatedBy: ''
    });
  };

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <ToastComponent />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row">
          {/* MENU BAR  */}
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <Tooltip title="Search" placement="top">
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SearchIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }} onClick={handleClear}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <ClearIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="List View" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} onClick={handleListView} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Save" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SaveIcon
                    size="1.3rem"
                    stroke={1.5}
                    //   onClick={handleSave}
                  />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>
          {/* FIELDS */}
          {!listView && (
            <div className="d-flex flex-wrap justify-content-start row">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Doc No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.docNo}
                    onChange={(e) => setFormData({ ...formData, docNo: e.target.value })}
                    error={!!errors.docNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Sub Type
                  </InputLabel>
                  <Select
                    labelId="subType"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    label="Select Type"
                    required
                    error={!!errors.mode}
                    helperText={errors.mode}
                  >
                    <MenuItem value="Customer">Debit Note</MenuItem>
                    <MenuItem value="Vendor">Credit Note</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Type Desc"
                    size="small"
                    inputProps={{ maxLength: 30 }}
                    value={formData.typeDesc}
                    error={!!errors.typeDesc}
                    disabled
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Product
                  </InputLabel>
                  <Select
                    labelId="product"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    label="Select product"
                    required
                    error={!!errors.product}
                    helperText={errors.product}
                  >
                    <MenuItem value="Customer">AI</MenuItem>
                    <MenuItem value="Vendor">---</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px'
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '10px 14px'
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(15px, 9px) scale(1)' // Adjust label position
                        },
                        '& .MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)' // Adjust label position when focused
                        }
                      }}
                      label="Doc Date"
                      value={formData.docDate}
                      onChange={(newValue) => setFormData({ ...formData, docDate: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Voucher No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.voucherNo}
                    onChange={(e) => setFormData({ ...formData, voucherNO: e.target.value })}
                    error={!!errors.voucherNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px'
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '10px 14px'
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(15px, 9px) scale(1)' // Adjust label position
                        },
                        '& .MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)' // Adjust label position when focused
                        }
                      }}
                      label="Voucher Date"
                      value={formData.voucherDate}
                      onChange={(newValue) => setFormData({ ...formData, voucherDate: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Party Type
                  </InputLabel>
                  <Select
                    labelId="partyType"
                    value={formData.partyType}
                    onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
                    label="Party Type"
                    required
                    error={!!errors.partyType}
                    helperText={errors.partyType}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Party Code"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.partyCode}
                    onChange={(e) => setFormData({ ...formData, partyCode: e.target.value })}
                    error={!!errors.partyCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier Ref No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierRefNo}
                    onChange={(e) => setFormData({ ...formData, supplierRefNo: e.target.value })}
                    error={!!errors.supplierRefNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px'
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '10px 14px'
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(15px, 9px) scale(1)' // Adjust label position
                        },
                        '& .MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)' // Adjust label position when focused
                        }
                      }}
                      label="Date"
                      value={formData.date}
                      onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label=""
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    // value={formData.voucherNo}
                    // onChange={(e) => setFormData({ ...formData, voucherNO: e.target.value })}
                    error={!!errors.voucherNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Party Name
                  </InputLabel>
                  <Select
                    labelId="partyName"
                    value={formData.partyName}
                    onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                    label="Party Name"
                    required
                    error={!!errors.partyName}
                    helperText={errors.partyName}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required></InputLabel>
                  <Select
                    labelId="partyType"
                    // value={formData.partyType}
                    // onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
                    label=""
                    required
                    error={!!errors.partyType}
                    helperText={errors.partyType}
                  >
                    <MenuItem value="Customer">PUDONG</MenuItem>
                    <MenuItem value="Vendor">---</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px'
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '10px 14px'
                        },
                        '& .MuiInputLabel-root': {
                          transform: 'translate(15px, 9px) scale(1)' // Adjust label position
                        },
                        '& .MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)' // Adjust label position when focused
                        }
                      }}
                      label="DueDate"
                      value={formData.dueDate}
                      onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <p>Tax Exempt</p>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Address"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    error={!!errors.address}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Currency
                  </InputLabel>
                  <Select
                    labelId="Currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    label="Currency"
                    required
                    error={!!errors.currency}
                    helperText={errors.currency}
                  >
                    <MenuItem value="Customer">INR</MenuItem>
                    <MenuItem value="Vendor">USD</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="ExRates"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.exRates}
                    onChange={(e) => setFormData({ ...formData, exRates: e.target.value })}
                    error={!!errors.exRates}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Job Status"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.jobStatus}
                    onChange={(e) => setFormData({ ...formData, jobStatus: e.target.value })}
                    error={!!errors.jobStatus}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Remarks"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    error={!!errors.remarks}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Other Info"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.otherInfo}
                    onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
                    error={!!errors.otherInfo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Shipper RefNo"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.shipperRefNo}
                    onChange={(e) => setFormData({ ...formData, shipperRefNo: e.target.value })}
                    error={!!errors.shipperRefNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Status
                  </InputLabel>
                  <Select
                    labelId="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                    required
                    error={!!errors.status}
                    helperText={errors.status}
                  >
                    <MenuItem value="Customer">Release</MenuItem>
                    <MenuItem value="Vendor">---</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Original Bill
                  </InputLabel>
                  <Select
                    labelId="Original Bill"
                    value={formData.supplierType}
                    onChange={(e) => setFormData({ ...formData, originalBill: e.target.value })}
                    label="Original Bill"
                    required
                    error={!!errors.originalBill}
                    helperText={errors.originalBill}
                  >
                    <MenuItem value="Customer">SampleBill1</MenuItem>
                    <MenuItem value="Vendor">SampleBill2</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="GST Type"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.gstType}
                    onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
                    error={!!errors.gstType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label=""
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    // value={formData.gstType}
                    // onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
                    error={!!errors.gstType}
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
                    <Tab label="Masters / House Charges" value="1" />
                    <Tab label="Tax Particulars" value="2" />
                    <Tab label="Summary" value="3" />
                    <Tab label="GST" value="4" /> {/* </Tab> */}
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {/* <TableComponent tableData={formData.chargerTaxInvoiceDTO} onCreateNewRow={handleCreateNewRow1} /> */}
                </TabPanel>

                <TabPanel value="2">
                  <div className="row d-flex mt-3">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" required>
                          TDS
                        </InputLabel>
                        <Select
                          labelId="tds"
                          value={formData.tds}
                          onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
                          label="TDS"
                          required
                          error={!!errors.tds}
                          helperText={errors.tds}
                        >
                          <MenuItem value="Inter">YES</MenuItem>
                          <MenuItem value="Intra">NO</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <TextField
                          label="TDS%"
                          size="small"
                          required
                          multiline
                          inputProps={{ maxLength: 30 }}
                          value={formData.tdsPercentage}
                          onChange={(e) => setFormData({ ...formData, tdsPercentage: e.target.value })}
                          error={!!errors.tdsPercentage}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <TextField
                          label=""
                          size="small"
                          required
                          multiline
                          inputProps={{ maxLength: 30 }}
                          //   value={formData.tdsWhPecentage}
                          //   onChange={(e) => setFormData({ ...formData, tdsWhPecentage: e.target.value })}
                          //   error={!!errors.tdsWhPecentage}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" required>
                          Section
                        </InputLabel>
                        <Select
                          labelId="section"
                          value={formData.section}
                          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                          label="Section"
                          required
                          error={!!errors.section}
                          helperText={errors.section}
                        >
                          <MenuItem value="Inter">---</MenuItem>
                          <MenuItem value="Intra">---</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <TextField
                          label="Tot TDS Amt"
                          size="small"
                          required
                          multiline
                          inputProps={{ maxLength: 30 }}
                          value={formData.totTdsAmt}
                          onChange={(e) => setFormData({ ...formData, totTdsAmt: e.target.value })}
                          error={!!errors.totTdsAmt}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="3">
                  <div className="row d-flex mt-3">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Charge Amt.(Bill Curr)"
                          name="chargeAmountBillCurr"
                          value={formData.billCurrChargeAmt}
                          onChange={(e) => setFormData({ ...formData, billCurrChargeAmt: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['summaryTaxInvoiceDTO.billCurrChargeAmt']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Charge Amt.(LC)"
                          name="lcChargeAmount"
                          value={formData.lcChargeAmount}
                          onChange={(e) => setFormData({ ...formData, lcChargeAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['summaryTaxInvoiceDTO.lcChargeAmount']}
                        />
                      </FormControl>
                    </div>

                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Gross Amt.(Bill Curr)"
                          name="totGrossAmtBillCurr"
                          value={formData.totGrossAmtBillCurr}
                          onChange={(e) => setFormData({ ...formData, totGrossAmtBillCurr: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['summaryTaxInvoiceDTO.totGrossAmtBillCurr']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Gross Amt.(LC)"
                          name="totGrossAmtLc"
                          value={formData.totGrossAmtLc}
                          onChange={(e) => setFormData({ ...formData, totGrossAmtLc: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['summaryTaxInvoiceDTO.totGrossAmtLc']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Net Amt.(Bill Curr)"
                          name="summaryTaxInvoiceDTO.netAmtBillCurr"
                          value={formData.netAmtBillCurr}
                          onChange={(e) => setFormData({ ...formData, netAmtBillCurr: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['netAmtBillCurr']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Net Amt.(LC)"
                          name="summaryTaxInvoiceDTO.netAmtLC"
                          value={formData.netAmtLC}
                          onChange={(e) => setFormData({ ...formData, netAmtLC: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['netAmtLC']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Net Amt.(LC)"
                          name="netAmtLC"
                          value={formData.netAmtLC}
                          onChange={(e) => setFormData({ ...formData, netAmtLC: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['netAmtLC']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Amount in Words"
                          name="amtWords"
                          value={formData.amtWords}
                          onChange={(e) => setFormData({ ...formData, amtWords: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['amtWords']}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="4"></TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
        {listView && (
          <div>
            {/* <CommonTable data={data} columns={columns} editCallback={editCity} countryVO={countryVO} stateVO={stateVO} /> */}
            {/* {data && <CommonTable data={data} columns={columns} />} */}
          </div>
        )}
      </div>
    </>
  );
};

export default CostDebitNote;
