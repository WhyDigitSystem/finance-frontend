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
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import GstTable from './GstTable';
import TableComponent from './TableComponent';

const CreditNoteDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [listView, setlistView] = useState(false);
  const [data, setData] = useState(false);
  const [editMode, setEditMode] = useState();

  const [formData, setFormData] = useState({
    active: true,
    address: '',
    addressType: '',
    billCurr: '',
    chargerIrnCreditDTO: [],
    createdBy: '',
    docDate: new Date(),
    dueDate: null,
    gstIrnCreditDTO: [],
    gsttype: '',
    headerColumns: '',
    invoiceDate: new Date(),
    orgId: orgId,
    partyCode: '',
    partyName: '',
    partyType: '',
    pincode: '',
    placeOfSupply: '',
    recipientGSTIN: '',
    salesType: '',
    status: '',
    originBill: '',
    updatedBy: '',
    summaryTaxInvoiceDTO: []
  });

  const [errors, setErrors] = useState({
    partyName: '',
    partyCode: '',
    partyType: '',
    addressType: '',
    recipientGSTIN: '',
    placeOfSupply: '',
    address: '',
    pincode: '',
    status: '',
    gsttype: '',
    dueDate: '',
    billCurr: '',
    salesType: '',
    originBill: ''
  });

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);

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
  const handleListView = () => {
    setlistView(!listView);
    getAllTaxInvoice();
  };

  const getAllTaxInvoice = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transaction/getAllIrnCreditByOrgId?orgId=0`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.irnCreditVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateNewRow1 = (values) => {
    // Ensure that 'qty' is an integer
    const updatedValues = {
      ...values,
      qty: parseInt(values.qty, 10)
    };

    setTableData1((prevData) => {
      const updatedData = [...prevData, updatedValues];

      // Update formData with the new tableData1
      setFormData((prevData) => ({
        ...prevData,
        chargerTaxInvoiceDTO: updatedData
      }));

      console.log('Updated GSTTableData1', updatedData);
      return updatedData;
    });
  };
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
      chargerIrnCreditDTO: [],
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
  //   const gstTaxInvoiceFields = ['gstdbBillAmount', 'gstcrBillAmount', 'gstDbLcAmount', 'gstCrLcAmount'];
  //   if (name.startsWith('summaryTaxInvoiceDTO.')) {
  //     const summaryField = name.split('.')[1];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       summaryTaxInvoiceDTO: {
  //         ...prevData.summaryTaxInvoiceDTO,
  //         [summaryField]: ['amountInWords', 'billingRemarks'].includes(summaryField) ? value : parseInt(value, 10)
  //       }
  //     }));
  //   } else if (name.startsWith('gstTaxInvoiceDTO.')) {
  //     const gstField = name.split('.')[1];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       gstTaxInvoiceDTO: {
  //         ...prevData.gstTaxInvoiceDTO,
  //         [gstField]: gstTaxInvoiceFields.includes(gstField) ? parseInt(value, 10) : value
  //       }
  //     }));
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value
  //     });
  //   }
  // };

  const getCreditNoteById = async (id) => {
    console.log('first', id);
    setlistView(false);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transaction/getAllIrnCreditById?id=${id.original.id}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        const irnCreditVO = response.data.paramObjectsMap.irnCreditVO[0];
        setEditMode(true);

        setFormData({
          active: irnCreditVO.active,
          address: irnCreditVO.address,
          addressType: irnCreditVO.addressType,
          billCurr: irnCreditVO.billCurr,
          chargerTaxInvoiceDTO: irnCreditVO.chargerIrnCreditVO || [],
          createdBy: irnCreditVO.createdBy,
          docDate: dayjs(irnCreditVO.docDate),
          dueDate: irnCreditVO.dueDate ? dayjs(irnCreditVO.dueDate) : null,
          gstTaxInvoiceDTO: irnCreditVO.gstIrnCreditVO || [],
          gsttype: irnCreditVO.gsttype,
          headerColumns: irnCreditVO.headerColumns,
          invoiceDate: dayjs(irnCreditVO.invoiceDate),
          orgId: irnCreditVO.orgId,
          partyCode: irnCreditVO.partyCode,
          partyName: irnCreditVO.partyName,
          partyType: irnCreditVO.partyType,
          pincode: irnCreditVO.pincode,
          placeOfSupply: irnCreditVO.placeOfSupply,
          recipientGSTIN: irnCreditVO.recipientGSTIN,
          salesType: irnCreditVO.salesType,
          status: irnCreditVO.status,
          originBill: irnCreditVO.originBill,
          updatedBy: irnCreditVO.updatedBy,
          summaryTaxInvoiceDTO: [] // Add any necessary mapping for this field if available
        });

        handleChange(1);

        console.log('DataToEdit', irnCreditVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { ...errors };
    // Party Name
    if (!formData.partyName) {
      newErrors.partyName = 'Party Name is required';
      formValid = false;
    } else {
      newErrors.partyName = '';
    }

    // Party Code
    if (!formData.partyCode) {
      newErrors.partyCode = 'Party Code is required';
      formValid = false;
    } else {
      newErrors.partyCode = '';
    }

    // Party Type
    if (!formData.partyType) {
      newErrors.partyType = 'Party Type is required';
      formValid = false;
    } else {
      newErrors.partyType = '';
    }

    // Address Type
    if (!formData.addressType) {
      newErrors.addressType = 'Address Type is required';
      formValid = false;
    } else {
      newErrors.addressType = '';
    }

    // Recipient GSTIN
    if (!formData.recipientGSTIN) {
      newErrors.recipientGSTIN = 'Recipient GSTIN is required';
      formValid = false;
    } else {
      newErrors.recipientGSTIN = '';
    }

    // Place of Supply
    if (!formData.placeOfSupply) {
      newErrors.placeOfSupply = 'Place of Supply is required';
      formValid = false;
    } else {
      newErrors.placeOfSupply = '';
    }

    // Address
    if (!formData.address) {
      newErrors.address = 'Address is required';
      formValid = false;
    } else {
      newErrors.address = '';
    }

    // Pincode
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
      formValid = false;
    } else {
      newErrors.pincode = '';
    }

    // Status
    if (!formData.status) {
      newErrors.status = 'Status is required';
      formValid = false;
    } else {
      newErrors.status = '';
    }

    // GST Type
    if (!formData.gsttype) {
      newErrors.gsttype = 'GST Type is required';
      formValid = false;
    } else {
      newErrors.gsttype = '';
    }

    // Due Date
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due Date is required';
      formValid = false;
    } else {
      newErrors.dueDate = '';
    }

    // Bill Curr
    if (!formData.billCurr) {
      newErrors.billCurr = 'Bill Curr is required';
      formValid = false;
    } else {
      newErrors.billCurr = '';
    }

    // Sales Type
    if (!formData.salesType) {
      newErrors.salesType = 'Sales Type is required';
      formValid = false;
    } else {
      newErrors.salesType = '';
    }

    setErrors(newErrors);
    return formValid;
  };

  const handleSave = () => {
    console.log('handleSave', formData);

    if (validateForm()) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/api/transaction/updateCreateIrnCredit`, formData)
        .then((response) => {
          if (response.data.statusFlag === 'Error') {
            showToast('error', 'IRN Credit Note Creation Failed');
          } else {
            console.log('Response:', response.data);
            showToast('success', 'IRN Credit Note Created Successfully');
            // handleClear();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

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
                  <SaveIcon size="1.3rem" stroke={1.5} onClick={handleSave} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>
          {!listView && (
            <div className="d-flex flex-wrap justify-content-start row">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Party Name"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.partyName}
                    onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                    error={!!errors.partyName}
                    // helperText={errors.partyName}
                  />
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
                    // helperText={errors.partyCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Party Type
                  </InputLabel>
                  <Select
                    labelId="partyTypeLabel"
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
                  <InputLabel id="demo-simple-select-label" required>
                    Address Type
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    value={formData.addressType}
                    onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                    label="Address Type"
                    required
                    error={!!errors.addressType}
                    helperText={errors.addressType}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Recipient GSTIN"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.recipientGSTIN}
                    onChange={(e) => setFormData({ ...formData, recipientGSTIN: e.target.value })}
                    error={!!errors.recipientGSTIN}
                    // helperText={errors.recipientGSTIN}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Place of Supply
                  </InputLabel>
                  <Select
                    labelId="placeOfSupplyLabel"
                    value={formData.placeOfSupply}
                    onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                    label="Place of Supply"
                    required
                    error={!!errors.placeOfSupply}
                    helperText={errors.placeOfSupply}
                  >
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
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
                    // helperText={errors.address}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Pincode"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    error={!!errors.pincode}
                    // helperText={errors.pincode}
                  />
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
                    // helperText={errors.status}
                  >
                    <MenuItem value="Tax">Tax</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Orgin Bill"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.originBill}
                    onChange={(e) => setFormData({ ...formData, originBill: e.target.value })}
                    error={!!errors.originBill}
                    // helperText={errors.originBill}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    GST Type
                  </InputLabel>
                  <Select
                    labelId="gstTypeLabel"
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
                      label="Due Date"
                      value={formData.dueDate}
                      onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Bill Curr
                  </InputLabel>
                  <Select
                    labelId="billCurrLabel"
                    value={formData.billCurr}
                    onChange={(e) => setFormData({ ...formData, billCurr: e.target.value })}
                    label="Bill Curr"
                    required
                    error={!!errors.billCurr}
                    helperText={errors.billCurr}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="INR">INR</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Sales Type
                  </InputLabel>
                  <Select
                    labelId="salesTypeLabel"
                    value={formData.salesType}
                    onChange={(e) => setFormData({ ...formData, salesType: e.target.value })}
                    label="Sales Type"
                    required
                    error={!!errors.salesType}
                    helperText={errors.salesType}
                  >
                    <MenuItem value="Retail">Retail</MenuItem>
                    <MenuItem value="Wholesale">Wholesale</MenuItem>
                  </Select>
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
                    <Tab label="Summary" value="2" />
                    <Tab label="GST" value="3">
                      {' '}
                    </Tab>
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <TableComponent tableData={formData.chargerTaxInvoiceDTO} onCreateNewRow={handleCreateNewRow1} />
                </TabPanel>
                <TabPanel value="2">
                  <div className="row d-flex mt-3">
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
                          label="Tot. Tax Amt.(LC)"
                          name="summaryTaxInvoiceDTO.lcTaxAmount"
                          value={formData.lcTaxAmount}
                          onChange={(e) => setFormData({ ...formData, lcTaxAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['lcTaxAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot. Inv Amt.(LC)"
                          name="lcInvAmount"
                          value={formData.lcInvAmount}
                          onChange={(e) => setFormData({ ...formData, lcInvAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['lcInvAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Round Off Amt.(LC)"
                          name="lcRoundOffAmount"
                          value={formData.lcRoundOffAmount}
                          onChange={(e) => setFormData({ ...formData, lcRoundOffAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['lcRoundOffAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Charge Amt.(Bill Curr.)"
                          name="billlcChargeAmount"
                          value={formData.billlcChargeAmount}
                          onChange={(e) => setFormData({ ...formData, billlcChargeAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['billlcChargeAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Tax Amt.(Bill Curr.)"
                          name="billTaxAmount"
                          value={formData.billTaxAmount}
                          onChange={(e) => setFormData({ ...formData, billTaxAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['billTaxAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Inv Amt.(Bill Curr.)"
                          name="billInvAmount"
                          value={formData.billInvAmount}
                          onChange={(e) => setFormData({ ...formData, billInvAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['billInvAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-3 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Tot Taxable Amt.(Bill Curr.)"
                          name="lcTaxableAmount"
                          value={formData.lcTaxableAmount}
                          onChange={(e) => setFormData({ ...formData, lcTaxableAmount: e.target.value })}
                          size="small"
                          placeholder="0.00"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['lcTaxableAmount']}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-6 mb-3">
                      <FormControl fullWidth variant="filled">
                        <TextField
                          label="Amount In Words"
                          name="amountInWords"
                          value={formData.amountInWords}
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
                          onChange={(e) => setFormData({ ...formData, billingRemarks: e.target.value })}
                          size="small"
                          inputProps={{ maxLength: 30 }}
                          error={fieldErrors['billingRemarks']}
                        />
                      </FormControl>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="3">
                  {' '}
                  <GstTable tableData={formData.gstTaxInvoiceDTO} onCreateNewRow={handleCreateNewRow} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
        {listView && (
          <div>
            {/* <CommonTable data={data} columns={columns} editCallback={editCity} countryVO={countryVO} stateVO={stateVO} /> */}
            {data && <CommonTable data={data} columns={columns} blockEdit={true} toEdit={getCreditNoteById} />}
          </div>
        )}
      </div>
    </>
  );
};

export default CreditNoteDetails;
