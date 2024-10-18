import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import GstTable from './GstTable';

const TaxInvoiceDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const [listView, setlistView] = useState(false);
  const [data, setData] = useState(false);

  const [formData, setFormData] = useState({
    bizType: '',
    bizMode: '',
    partyCode: '',
    partyName: '',
    partyType: '',
    stateNo: '',
    stateCode: '',
    address: '',
    addressType: '',
    gstType: '',
    pinCode: '',
    placeOfSupply: '',
    recipientGSTIN: '',
    status: '',
    docId: '',
    docDate: new Date(),

    active: true,

    orgId: orgId,

    salesType: '',

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
    gstType: '',
    dueDate: '',
    billCurr: '',
    salesType: ''
  });

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});

  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);

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
      gstpercent: '',
      ledger: '',
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
      gstpercent: '',
      ledger: '',
      qty: '',
      rate: '',
      sac: '',
      taxable: ''
    }
  ]);

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
      gstpercent: '',
      ledger: '',
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
        gstpercent: '',
        ledger: '',
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
        !lastRow.gstpercent ||
        !lastRow.ledger ||
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
          gstpercent: !table[table.length - 1].gstpercent ? 'gstpercent is required' : '',
          ledger: !table[table.length - 1].ledger ? 'ledger is required' : '',
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transaction/getTaxInvoiceByActive`);
      // const result = await apiCalls('get', `/payable/getAllPaymentByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.taxInvoiceVO);
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
      chargerTaxInvoiceDTO: [],
      createdBy: '',
      docDate: new Date(),
      dueDate: null,
      gstTaxInvoiceDTO: [],
      gstType: '',
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
  const validateForm = () => {
    let formValid = true;
    const newErrors = { ...errors };

    // Validation logic for each field

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
    if (!formData.gstType) {
      newErrors.gstType = 'GST Type is required';
      formValid = false;
    } else {
      newErrors.gstType = '';
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
        .put(`${process.env.REACT_APP_API_URL}/api/transaction/updateCreateTaxInvoice`, formData)
        .then((response) => {
          console.log('Response:', response.data);
          showToast('success', 'Tax Invoice Created Successfully');
          handleClear();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleList = () => {
    setlistView(!listView);
  };

  return (
    <>
      <ToastComponent />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>
          {!listView && (
            <div className="d-flex flex-wrap justify-content-start row">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Biz Type"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.bizType}
                    onChange={(e) => setFormData({ ...formData, bizType: e.target.value })}
                    error={!!errors.bizType}
                    // helperText={errors.partyName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Biz Mode"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.bizMode}
                    onChange={(e) => setFormData({ ...formData, bizMode: e.target.value })}
                    error={!!errors.bizMode}
                    // helperText={errors.partyName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Doc Id"
                    size="small"
                    disabled
                    value={formData.docId}
                    onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                    error={!!errors.docId}
                    // helperText={errors.partyName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Doc Date"
                    size="small"
                    disabled
                    value={formData.docDate}
                    onChange={(e) => setFormData({ ...formData, docDate: e.target.value })}
                    error={!!errors.docDate}
                    // helperText={errors.partyName}
                  />
                </FormControl>
              </div>
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
                  <TextField
                    label="State No"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.stateNo}
                    onChange={(e) => setFormData({ ...formData, stateNo: e.target.value })}
                    error={!!errors.stateNo}
                    // helperText={errors.partyCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    State Code
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    label="State Code"
                    required
                    error={!!errors.stateCode}
                    helperText={errors.stateCode}
                  >
                    <MenuItem value="BLR">BLR</MenuItem>
                    <MenuItem value="GJ">GJ</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Recipient GSTIN"
                    size="small"
                    disabled
                    inputProps={{ maxLength: 30 }}
                    value={formData.recipientGSTIN}
                    onChange={(e) => setFormData({ ...formData, recipientGSTIN: e.target.value })}
                    error={!!errors.recipientGSTIN}
                    // helperText={errors.partyCode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Place Of Supply
                  </InputLabel>
                  <Select
                    labelId="addressTypeLabel"
                    value={formData.placeOfSupply}
                    onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                    label="Place Of Supply"
                    required
                    error={!!errors.placeOfSupply}
                    helperText={errors.placeOfSupply}
                  >
                    <MenuItem value="BLR">BLR</MenuItem>
                    <MenuItem value="GJ">GJ</MenuItem>
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
                    GST Type
                  </InputLabel>
                  <Select
                    labelId="gstTypeLabel"
                    value={formData.gstType}
                    onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
                    label="GST Type"
                    required
                    error={!!errors.gstType}
                    helperText={errors.gstType}
                  >
                    <MenuItem value="Inter">Inter</MenuItem>
                    <MenuItem value="Intra">Intra</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier BillNo"
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
                <FormControl fullWidth size="small">
                  <TextField
                    label="Supplier BillDate"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.supplierBillDate}
                    onChange={(e) => setFormData({ ...formData, supplierBillDate: e.target.value })}
                    error={!!errors.supplierBillDate}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

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
                  <TextField
                    label="Bill Curr Rate"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.billCurrRate}
                    onChange={(e) => setFormData({ ...formData, billCurrRate: e.target.value })}
                    error={!!errors.billCurrRate}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Ex Amount"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.exAmount}
                    onChange={(e) => setFormData({ ...formData, exAmount: e.target.value })}
                    error={!!errors.exAmount}
                    // helperText={errors.pincode}
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
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Contact Person"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    error={!!errors.contactPerson}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Shipper InvoiceNo"
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
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.billOfEntry}
                    onChange={(e) => setFormData({ ...formData, billOfEntry: e.target.value })}
                    error={!!errors.billOfEntry}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Bill Month"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.billMonth}
                    onChange={(e) => setFormData({ ...formData, billMonth: e.target.value })}
                    error={!!errors.billMonth}
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>
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
                    // helperText={errors.pincode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField
                    label="Invoice Date"
                    size="small"
                    required
                    inputProps={{ maxLength: 30 }}
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    error={!!errors.invoiceDate}
                    // helperText={errors.pincode}
                  />
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
                                <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                  Action
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="px-2 py-2 text-white text-center">Charge Code</th>
                                <th className="px-2 py-2 text-white text-center">GCharge Code</th>
                                <th className="px-2 py-2 text-white text-center">Charge Name</th>
                                <th className="px-2 py-2 text-white text-center">Charge Type</th>
                                <th className="px-2 py-2 text-white text-center">Taxable</th>
                                <th className="px-2 py-2 text-white text-center">Qty</th>
                                <th className="px-2 py-2 text-white text-center">Rate</th>
                                <th className="px-2 py-2 text-white text-center">Currency</th>
                                <th className="px-2 py-2 text-white text-center">Ex Rate</th>
                                <th className="px-2 py-2 text-white text-center">FC Amount</th>
                                <th className="px-2 py-2 text-white text-center">LC Amount</th>
                                <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                                <th className="px-2 py-2 text-white text-center">sac</th>
                                <th className="px-2 py-2 text-white text-center">GST %</th>
                                <th className="px-2 py-2 text-white text-center">GST</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(withdrawalsTableData) &&
                                withdrawalsTableData.map((row, index) => (
                                  <tr key={row.id}>
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
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.chargeCode}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, chargeCode: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                chargeCode: !value ? 'chargeCode is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                chargeCode: 'Only numeric characters are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={withdrawalsTableErrors[index]?.chargeCode ? 'error form-control' : 'form-control'}
                                      />
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
                                                chargeName: !value ? 'chargeName is required' : ''
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
                                        value={row.chargeType}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, chargeType: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                chargeType: !value ? 'chargeType is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], chargeType: 'Only numeric characters are allowed' };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={withdrawalsTableErrors[index]?.chargeType ? 'error form-control' : 'form-control'}
                                      />
                                      {withdrawalsTableErrors[index]?.chargeType && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {withdrawalsTableErrors[index].chargeType}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.taxable}
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
                                                taxable: !value ? 'taxable is required' : ''
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
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.qty}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: 'Only numeric characters are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
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
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rate: !value ? 'rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                rate: 'Only numeric characters are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
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
                                      <input
                                        type="text"
                                        value={row.currency}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], currency: !value ? 'Eds is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                currency: 'Only numeric characters are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={withdrawalsTableErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                      />
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
                                        value={row.fcAmount}
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
                                        value={row.lcAmount}
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
                                        value={row.billAmount}
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
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sac: value } : r))
                                            );
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
                                        value={row.gstpercent}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, gstpercent: value } : r))
                                            );
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                gstpercent: !value ? 'gstpercent is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setWithdrawalsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                gstpercent: 'Only numeric characters are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        className={withdrawalsTableErrors[index]?.gstpercent ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, withdrawalsTableData)}
                                      />
                                      {withdrawalsTableErrors[index]?.gstpercent && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {withdrawalsTableErrors[index].gstpercent}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.gst}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(value)) {
                                            setWithdrawalsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, gst: value } : r))
                                            );
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
            {<CommonTable data={data} columns={columns} />}
          </div>
        )}
      </div>
    </>
  );
};

export default TaxInvoiceDetails;
