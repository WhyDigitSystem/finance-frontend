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

const CostInvoice = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [listView, setlistView] = useState(false);
  const [data, setData] = useState(false);

  //   const [formData, setFormData] = useState({
  //     mode: '',
  //     product: '',

  //     active: true,
  //     address: '',
  //     addressType: '',
  //     billCurr: '',
  //     chargerTaxInvoiceDTO: [],
  //     createdBy: '',
  //     docDate: new Date(),
  //     dueDate: null,
  //     gstTaxInvoiceDTO: [],
  //     gsttype: '',
  //     headerColumns: '',
  //     invoiceDate: new Date(),
  //     orgId: orgId,
  //     partyCode: '',
  //     partyName: '',
  //     partyType: '',
  //     pincode: '',
  //     placeOfSupply: '',
  //     recipientGSTIN: '',
  //     salesType: '',
  //     status: '',
  //     updatedBy: '',
  //     summaryTaxInvoiceDTO: []
  //   });

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

  //   const handleCreateNewRow = (values) => {
  //     // Ensure that relevant fields in gstTaxInvoiceDTO are integers
  //     const updatedValues = {
  //       ...values,
  //       gstBdBillAmount: parseInt(values.gstBdBillAmount, 10),
  //       gstCrBillAmount: parseInt(values.gstCrBillAmount, 10),
  //       gstCrLcAmount: parseInt(values.gstCrLcAmount, 10),
  //       gstDbLcAmount: parseInt(values.gstDbLcAmount, 10)
  //     };

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       gstTaxInvoiceDTO: [...prevData.gstTaxInvoiceDTO, updatedValues]
  //     }));
  //   };
  const handleListView = () => {
    setlistView(!listView);
    // getAllTaxInvoice();
  };

  //   const getAllTaxInvoice = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transaction/getTaxInvoiceByActive`);
  //       console.log('API Response:', response);

  //       if (response.status === 200) {
  //         setData(response.data.paramObjectsMap.taxInvoiceVO);
  //       } else {
  //         // Handle error
  //         console.error('API Error:', response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   const handleCreateNewRow1 = (values) => {
  //     // Ensure that 'qty' is an integer
  //     const updatedValues = {
  //       ...values,
  //       qty: parseInt(values.qty, 10)
  //     };

  //     setTableData1((prevData) => {
  //       const updatedData = [...prevData, updatedValues];

  //       // Update formData with the new tableData1
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         chargerTaxInvoiceDTO: updatedData
  //       }));

  //       console.log('Updated GSTTableData1', updatedData);
  //       return updatedData;
  //     });
  //   };
  const columns = [
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'partyCode', header: 'Code', size: 140 },
    { accessorKey: 'partyType', header: 'Type', size: 140 },
    { accessorKey: 'address', header: 'Address Type', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
    // { accessorKey: 'active', header: 'Recipient', size: 140 }
  ];

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

  //   const handleChangeField = (e) => {
  //     const { name, value } = e.target;
  //     const gstTaxInvoiceFields = ['gstdbBillAmount', 'gstcrBillAmount', 'gstDbLcAmount', 'gstCrLcAmount'];
  //     if (name.startsWith('summaryTaxInvoiceDTO.')) {
  //       const summaryField = name.split('.')[1];
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         summaryTaxInvoiceDTO: {
  //           ...prevData.summaryTaxInvoiceDTO,
  //           [summaryField]: ['amountInWords', 'billingRemarks'].includes(summaryField) ? value : parseInt(value, 10)
  //         }
  //       }));
  //     } else if (name.startsWith('gstTaxInvoiceDTO.')) {
  //       const gstField = name.split('.')[1];
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         gstTaxInvoiceDTO: {
  //           ...prevData.gstTaxInvoiceDTO,
  //           [gstField]: gstTaxInvoiceFields.includes(gstField) ? parseInt(value, 10) : value
  //         }
  //       }));
  //     } else {
  //       setFormData({
  //         ...formData,
  //         [name]: value
  //       });
  //     }
  //   };
  //   const validateForm = () => {
  //     let formValid = true;
  //     const newErrors = { ...errors };

  //     // Validation logic for each field

  //     // Party Name
  //     if (!formData.partyName) {
  //       newErrors.partyName = 'Party Name is required';
  //       formValid = false;
  //     } else {
  //       newErrors.partyName = '';
  //     }

  //     // Party Code
  //     if (!formData.partyCode) {
  //       newErrors.partyCode = 'Party Code is required';
  //       formValid = false;
  //     } else {
  //       newErrors.partyCode = '';
  //     }

  //     // Party Type
  //     if (!formData.partyType) {
  //       newErrors.partyType = 'Party Type is required';
  //       formValid = false;
  //     } else {
  //       newErrors.partyType = '';
  //     }

  //     // Address Type
  //     if (!formData.addressType) {
  //       newErrors.addressType = 'Address Type is required';
  //       formValid = false;
  //     } else {
  //       newErrors.addressType = '';
  //     }

  //     // Recipient GSTIN
  //     if (!formData.recipientGSTIN) {
  //       newErrors.recipientGSTIN = 'Recipient GSTIN is required';
  //       formValid = false;
  //     } else {
  //       newErrors.recipientGSTIN = '';
  //     }

  //     // Place of Supply
  //     if (!formData.placeOfSupply) {
  //       newErrors.placeOfSupply = 'Place of Supply is required';
  //       formValid = false;
  //     } else {
  //       newErrors.placeOfSupply = '';
  //     }

  //     // Address
  //     if (!formData.address) {
  //       newErrors.address = 'Address is required';
  //       formValid = false;
  //     } else {
  //       newErrors.address = '';
  //     }

  //     // Pincode
  //     if (!formData.pincode) {
  //       newErrors.pincode = 'Pincode is required';
  //       formValid = false;
  //     } else {
  //       newErrors.pincode = '';
  //     }

  //     // Status
  //     if (!formData.status) {
  //       newErrors.status = 'Status is required';
  //       formValid = false;
  //     } else {
  //       newErrors.status = '';
  //     }

  //     // GST Type
  //     if (!formData.gsttype) {
  //       newErrors.gsttype = 'GST Type is required';
  //       formValid = false;
  //     } else {
  //       newErrors.gsttype = '';
  //     }

  //     // Due Date
  //     if (!formData.dueDate) {
  //       newErrors.dueDate = 'Due Date is required';
  //       formValid = false;
  //     } else {
  //       newErrors.dueDate = '';
  //     }

  //     // Bill Curr
  //     if (!formData.billCurr) {
  //       newErrors.billCurr = 'Bill Curr is required';
  //       formValid = false;
  //     } else {
  //       newErrors.billCurr = '';
  //     }

  //     // Sales Type
  //     if (!formData.salesType) {
  //       newErrors.salesType = 'Sales Type is required';
  //       formValid = false;
  //     } else {
  //       newErrors.salesType = '';
  //     }

  //     setErrors(newErrors);
  //     return formValid;
  //   };

  //   const handleSave = () => {
  //     console.log('handleSave', formData);

  //     if (validateForm()) {
  //       axios
  //         .put(`${process.env.REACT_APP_API_URL}/api/transaction/updateCreateTaxInvoice`, formData)
  //         .then((response) => {
  //           console.log('Response:', response.data);
  //           showToast('success', 'Tax Invoice Created Successfully');
  //           handleClear();
  //         })
  //         .catch((error) => {
  //           console.error('Error:', error);
  //         });
  //     }
  //   };

  return (
    <>
      <ToastComponent />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row">
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
          {!listView && (
            <div className="d-flex flex-wrap justify-content-start row">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Mode
                  </InputLabel>
                  <Select
                    labelId="mode"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    label="Select Mode"
                    required
                    error={!!errors.mode}
                    helperText={errors.mode}
                  >
                    <MenuItem value="Customer">Submit</MenuItem>
                    <MenuItem value="Vendor">Edit</MenuItem>
                  </Select>
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
                    <MenuItem value="Customer">SO</MenuItem>
                    <MenuItem value="Vendor">---</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Pur Voucher No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.partyName}
                    onChange={(e) => setFormData({ ...formData, purchaseVoucherNO: e.target.value })}
                    error={!!errors.purchaseVoucherNO}
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
                      label="Purchase Voucher Date"
                      value={formData.purchaseVoucherDate}
                      onChange={(newValue) => setFormData({ ...formData, purchaseVoucherDate: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Cost Invoice No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.costInvNo}
                    onChange={(e) => setFormData({ ...formData, costInvNo: e.target.value })}
                    error={!!errors.costInvNo}
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
                    label="Supplier Bill No"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierBillNo}
                    onChange={(e) => setFormData({ ...formData, supplierBillNo: e.target.value })}
                    error={!!errors.supplierBillNo}
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
                      value={formData.docDate1}
                      onChange={(newValue) => setFormData({ ...formData, docDate1: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Supplier Type
                  </InputLabel>
                  <Select
                    labelId="supplierTypeLabel"
                    value={formData.supplierType}
                    onChange={(e) => setFormData({ ...formData, supplierType: e.target.value })}
                    label="Supplier Type"
                    required
                    error={!!errors.supplierType}
                    helperText={errors.supplierType}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier Code"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    error={!!errors.supplierCode}
                  />
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
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier Name"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    error={!!errors.supplierName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required></InputLabel>
                  <Select
                    labelId="supplierLoc"
                    value={formData.supplierLoc}
                    onChange={(e) => setFormData({ ...formData, supplierLoc: e.target.value })}
                    // label="Place of Supply"
                    required
                    error={!!errors.supplierLoc}
                    helperText={errors.supplierLoc}
                  >
                    <MenuItem value="Customer">Ahmedabad</MenuItem>
                    <MenuItem value="Vendor">Chennai</MenuItem>
                  </Select>
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
                  <InputLabel id="demo-simple-select-label" required>
                    Supplier GST State Code
                  </InputLabel>
                  <Select
                    labelId="supplierGSTState"
                    value={formData.supplierGstCode}
                    onChange={(e) => setFormData({ ...formData, supplierGstCode: e.target.value })}
                    label="Supplier GSTIN"
                    required
                    error={!!errors.supplierGstCode}
                    helperText={errors.supplierGstCode}
                  >
                    <MenuItem value="Customer">TN</MenuItem>
                    <MenuItem value="Vendor">KA</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier GSTIN"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierGstIn}
                    onChange={(e) => setFormData({ ...formData, supplierGstIn: e.target.value })}
                    error={!!errors.supplierGstIn}
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
                  <InputLabel id="demo-simple-select-label" required>
                    GST Type
                  </InputLabel>
                  <Select
                    labelId="gstType"
                    value={formData.gsttype}
                    onChange={(e) => setFormData({ ...formData, gsttype: e.target.value })}
                    label="GST Type"
                    required
                    error={!!errors.gsttype}
                    helperText={errors.gsttype}
                  >
                    <MenuItem value="Inter">Inter</MenuItem>
                    <MenuItem value="Intra">Intra</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Payment
                  </InputLabel>
                  <Select
                    labelId="payment"
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                    label="Payment"
                    required
                    error={!!errors.payment}
                    helperText={errors.payment}
                  >
                    <MenuItem value="USD">Yet to Pay</MenuItem>
                    <MenuItem value="EUR">Paid</MenuItem>
                    <MenuItem value="INR">Pending</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Accrual ID"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.accrualId}
                    onChange={(e) => setFormData({ ...formData, accrualId: e.target.value })}
                    error={!!errors.accrualId}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="UTR Reference"
                    size="small"
                    required
                    multiline
                    inputProps={{ maxLength: 30 }}
                    value={formData.utrRef}
                    onChange={(e) => setFormData({ ...formData, utrRef: e.target.value })}
                    error={!!errors.utrRef}
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
                    <Tab label="TDS" value="2" />
                    <Tab label="Summary" value="3">
                      {' '}
                    </Tab>
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {/* <TableComponent tableData={formData.chargerTaxInvoiceDTO} onCreateNewRow={handleCreateNewRow1} /> */}
                </TabPanel>

                <TabPanel value="3">
                  <div className="row d-flex mt-3">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Charge Amt.(Bill Curr)"
                          name="lcChargeAmount"
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
                          label="Act Bill Amt.(Bill Curr)"
                          name="summaryTaxInvoiceDTO.accBillAmtBillCurr"
                          value={formData.accBillAmtBillCurr}
                          onChange={(e) => setFormData({ ...formData, accBillAmtBillCurr: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['accBillAmtBillCurr']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Act Bill Amt.(LC)"
                          name="summaryTaxInvoiceDTO.accBillAmtLC"
                          value={formData.accBillAmtLC}
                          onChange={(e) => setFormData({ ...formData, accBillAmtLC: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['accBillAmtLC']}
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
                          label="Net Amt.(Bill Curr)"
                          name="netAmtBillCurr"
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
                          label="Round Off"
                          name="roundOff"
                          value={formData.roundOff}
                          onChange={(e) => setFormData({ ...formData, roundOff: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['roundOff']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="GST Input Amt(LC)"
                          name="gstInputAmt"
                          value={formData.gstInputAmt}
                          onChange={(e) => setFormData({ ...formData, gstInputAmt: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['gstInputAmt']}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="2">
                  <div className="row d-flex mt-3">
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" required>
                          TDS / WH
                        </InputLabel>
                        <Select
                          labelId="tds/wh"
                          value={formData.tdsWh}
                          onChange={(e) => setFormData({ ...formData, tdsWh: e.target.value })}
                          label="TDS / WH"
                          required
                          error={!!errors.tdsWh}
                          helperText={errors.tdsWh}
                        >
                          <MenuItem value="Inter">YES</MenuItem>
                          <MenuItem value="Intra">NO</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <TextField
                          label="TDS / WH %"
                          size="small"
                          required
                          multiline
                          inputProps={{ maxLength: 30 }}
                          value={formData.tdsWhPecentage}
                          onChange={(e) => setFormData({ ...formData, tdsWhPecentage: e.target.value })}
                          error={!!errors.tdsWhPecentage}
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
                          value={formData.tdsWhPecentageAmt}
                          onChange={(e) => setFormData({ ...formData, tdsWhPecentageAmt: e.target.value })}
                          error={!!errors.tdsWhPecentageAmt}
                        />
                      </FormControl>
                    </div>

                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label" required>
                          TDS / WH %
                        </InputLabel>
                        <Select
                          labelId="tds/wh1"
                          value={formData.tdsWhPecentage}
                          onChange={(e) => setFormData({ ...formData, tdsWhPecentage: e.target.value })}
                          label="TDS / WH1"
                          required
                          error={!!errors.tdsWhPecentage}
                          helperText={errors.tdsWhPecentage}
                        >
                          <MenuItem value="Inter">YES</MenuItem>
                          <MenuItem value="Intra">NO</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth size="small">
                        <TextField
                          label="Tot TDS/WH Amt"
                          size="small"
                          required
                          multiline
                          inputProps={{ maxLength: 30 }}
                          value={formData.totTdsWhAmt}
                          onChange={(e) => setFormData({ ...formData, totTdsWhAmt: e.target.value })}
                          error={!!errors.totTdsWhAmt}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
        {listView && (
          <div>
            {/* <CommonTable data={data} columns={columns} editCallback={editCity} countryVO={countryVO} stateVO={stateVO} /> */}
            {data && <CommonTable data={data} columns={columns} />}
          </div>
        )}
      </div>
    </>
  );
};

export default CostInvoice;
