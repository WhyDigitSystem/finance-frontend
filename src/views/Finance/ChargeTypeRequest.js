import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import ChargeCodeSample from '../../assets/sample-files/ChargeCodeSample.xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileExcel } from 'react-icons/fa';
import CommonBulkUpload from 'utils/CommonBulkUpload';

export const ChargeTypeRequest = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [editId, setEditId] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [listValues, setListValues] = useState([]);
  const [serviceCode, setServiceCode] = useState([]);
  const [salesCode, setSalesCode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    chargeType: '',
    chargeCode: '',
    product: '',
    chargeDescription: '',
    localChargeDescripition: '',
    serviceAccountCode: '',
    sacDescripition: '',
    salesAccount: '',
    purchaseAccount: '',
    taxable: '',
    taxablePercentage: '',
    govtSac: '',
    excempted: '',
    orgId: orgId,
    gstTax: '',
    gstControl: '',
    service: '',
    type: '',
    approved: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    chargeType: '',
    chargeCode: '',
    product: '',
    chargeDescription: '',
    localChargeDescripition: '',
    serviceAccountCode: '',
    sacDescripition: '',
    salesAccount: '',
    purchaseAccount: '',
    taxable: '',
    taxablePercentage: '',
    govtSac: '',
    excempted: '',
    gstTax: '',
    gstControl: '',
    service: '',
    type: '',
    approved: false
  });

  const columns = [
    { accessorKey: 'chargeType', header: 'Charge Type', size: 140 },
    { accessorKey: 'chargeCode', header: 'Charge Code', size: 140 },
    { accessorKey: 'chargeDescription', header: 'Charge Description', size: 140 },
    // { accessorKey: 'localChargeDescripition', header: 'Local Charge Description', size: 140 },
    // { accessorKey: 'serviceAccountCode', header: 'Service Account Code', size: 140 },
    // { accessorKey: 'sACDescription', header: 'SAC Description', size: 140 },
    // { accessorKey: 'salesAccount', header: 'Sales Account', size: 140 },
    // { accessorKey: 'purchaseAccount', header: 'Purchase Account', size: 140 },
    // { accessorKey: 'ccFeeApplicable', header: 'CC Fee Applicable', size: 140 },
    // { accessorKey: 'taxable', header: 'Taxable', size: 140 },
    // { accessorKey: 'taxablePercentage', header: 'Taxable Percentage', size: 140 },
    // { accessorKey: 'govtSac', header: 'Govt SAC', size: 140 },
    // { accessorKey: 'excempted', header: 'Exempted', size: 140 },
    { accessorKey: 'gstTax', header: 'GST Tax', size: 140 },
    // { accessorKey: 'gSTControl', header: 'GST Control', size: 140 },
    // { accessorKey: 'service', header: 'Service', size: 140 },
    // { accessorKey: 'type', header: 'Type', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'serviceAccountCode') {
      const selectedService = serviceCode.find((item) => item.serviceAccountCode === value);
      const sacDescription = selectedService ? selectedService.sacDescription : '';

      setFormData({
        ...formData,
        [name]: newValue,
        sacDescripition: sacDescription
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  useEffect(() => {
    getAllChargeTypeRequestByOrgId();
    getChargeType();
    getAllServiceAccountCode();
    getAllSalesAccount();
    getAllPurchaseAccount();
  }, []);

  const getAllChargeTypeRequestByOrgId = async () => {
    try {
      const response = await apiCalls('get', `master/getAllChargeTypeRequestByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);
      setData(response.paramObjectsMap.chargeTypeRequestVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExcelFileDownload = async () => {
    try {
      setLoading(true);

      const result = await apiCalls('get', `/master/getAllChargeTypeRequestByOrgId?orgId=${orgId}`);

      console.log('API Response:', result);

      const coaData = result?.paramObjectsMap?.chargeTypeRequestVO;

      if (coaData && Array.isArray(coaData)) {
        const filteredData = coaData
          // .filter(({ type, active }) => type === 'Account' && active === true)
          .filter(({ type, active }) => active === true)
          .map(({ chargeType, chargeCode, chargeDescription, gstTax, localChargeDescripition, govtSac }) => ({
            chargeType,
            chargeCode,
            chargeDescription,
            gstTax,
            localChargeDescripition,
            govtSac
          }));

        console.log('Filtered Data:', filteredData);

        if (filteredData.length === 0) {
          console.error('No valid data to export.');
          setLoading(false);
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        saveAs(blob, 'Charge Code.xlsx');

        console.log('Download triggered');
      } else {
        console.error('Invalid or empty API response.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllChargeTypeRequestByOrgId?orgId=${orgId}`);

      console.log('API Response:', result);

      const coaData = result?.paramObjectsMap?.chargeTypeRequestVO;

      if (coaData && Array.isArray(coaData)) {
        // Filter only active accounts where type is "account"
        return (
          coaData
            // .filter(({ type, active }) => type === 'Account' && active === true)
            .filter(({ type, active }) => active === true)
            .map(({ chargeType, chargeCode, chargeDescription, gstTax, localChargeDescripition, govtSac }) => ({
              chargeType,
              chargeCode,
              chargeDescription,
              gstTax,
              localChargeDescripition,
              govtSac
            }))
        );
      } else {
        console.error('Invalid or empty API response.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const handlePDFDownload = async () => {
    setLoading(true);

    const data = await fetchData();
    if (data.length === 0) {
      setLoading(false);
      alert('No active accounts available for download.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Charge Code', 14, 10);

    // Define table headers
    const tableColumn = ['Charge Type', 'Charge Code', 'Charge Desc', 'GST Tax', 'Local Charge Desc', 'HSN/SAC'];
    const tableRows = [];

    // Add data rows
    data.forEach(({ chargeType, chargeCode, chargeDescription, gstTax, localChargeDescripition, govtSac }) => {
      tableRows.push([chargeType, chargeCode, chargeDescription, gstTax, localChargeDescripition, govtSac]);
    });

    // Generate table using autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    // Save PDF file
    doc.save('Charge Code.pdf');

    console.log('PDF Download triggered for active accounts');
    setLoading(false);
  };

  const getChargeType = async () => {
    try {
      const result = await apiCalls('get', `/master/getChargeType?orgId=${orgId}`);
      setListValues(result.paramObjectsMap.chargeTypeDetails || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllServiceAccountCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllActiveSacCodeByOrgId?orgId=${orgId}`);
      setServiceCode(result.paramObjectsMap.sacCodeVO || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllSalesAccount = async () => {
    try {
      const result = await apiCalls('get', `/master/getSalesAccountFromGroup?orgId=${orgId}`);
      setSalesCode(result.paramObjectsMap.salesAccount || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllPurchaseAccount = async () => {
    try {
      const result = await apiCalls('get', `/master/getPurchaseAccountFromGroup?orgId=${orgId}`);
      setPurchaseCode(result.paramObjectsMap.purchaseAccount || []);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllChargeTypeById = async (row) => {
    handleClear();
    console.log('THE SELECTED ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `master/getAllChargeTypeRequestById?id=${row.original.id}`);

      if (response.status === true) {
        const chargeTypeRequestVO = response.paramObjectsMap.chargeTypeRequestVO[0];
        setShowForm(true);

        setFormData({
          active: chargeTypeRequestVO.active,
          chargeType: chargeTypeRequestVO.chargeType || '',
          chargeCode: chargeTypeRequestVO.chargeCode || '',
          approved: chargeTypeRequestVO.approved || '',
          product: chargeTypeRequestVO.product || '',
          chargeDescription: chargeTypeRequestVO.chargeDescription || '',
          localChargeDescripition: chargeTypeRequestVO.localChargeDescripition || '',
          serviceAccountCode: chargeTypeRequestVO.serviceAccountCode || '',
          sacDescripition: chargeTypeRequestVO.sacDescripition || '',
          salesAccount: chargeTypeRequestVO.salesAccount || '',
          purchaseAccount: chargeTypeRequestVO.purchaseAccount || '',
          taxable: chargeTypeRequestVO.taxable || '',
          taxablePercentage: chargeTypeRequestVO.taxablePercentage || '',
          id: chargeTypeRequestVO.id || 0,
          govtSac: chargeTypeRequestVO.govtSac || '',
          excempted: chargeTypeRequestVO.excempted || '',
          orgId: chargeTypeRequestVO.orgId || orgId,
          gstTax: chargeTypeRequestVO.gstTax || '',
          gstControl: chargeTypeRequestVO.gstControl || '',
          service: chargeTypeRequestVO.service || '',
          type: chargeTypeRequestVO.type || ''
        });

        console.log('DataToEdit', chargeTypeRequestVO);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleList = () => {
    setShowForm(!showForm);
    // setFieldErrors({
    //   chapter: false,
    //   subChapter: false,
    //   hsnCode: false,
    //   branch: false,
    //   newRate: false,
    //   excepmted: false
    // });
    getAllChargeTypeRequestByOrgId();
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleClear = () => {
    setFormData({
      active: true,
      chargeType: '',
      chargeCode: '',
      product: '',
      chargeDescription: '',
      localChargeDescripition: '',
      serviceAccountCode: '',
      sacDescripition: '',
      salesAccount: '',
      purchaseAccount: '',
      taxable: '',
      taxablePercentage: '',
      govtSac: '',
      excempted: '',
      orgId: orgId,
      gstTax: '',
      gstControl: '',
      service: '',
      type: '',
      approved: false
    });

    setEditId('');

    setFieldErrors({
      chargeType: '',
      chargeCode: '',
      product: '',
      chargeDescription: '',
      localChargeDescripition: '',
      serviceAccountCode: '',
      sacDescripition: '',
      salesAccount: '',
      purchaseAccount: '',
      taxable: '',
      taxablePercentage: '',
      govtSac: '',
      excempted: '',
      gstTax: '',
      gstControl: '',
      service: '',
      type: '',
      approved: false
    });
  };

  const validateForm = () => {
    let errors = {};
    let hasError = false;

    if (!formData.chargeType) {
      errors.chargeType = 'Charge Type is required';
      hasError = true;
    }
    if (!formData.chargeCode) {
      errors.chargeCode = 'Charge Code is required';
      hasError = true;
    }
    // if (!formData.product) {
    //   errors.product = 'Product is required';
    //   hasError = true;
    // }
    if (!formData.chargeDescription) {
      errors.chargeDescription = 'Charge Desc is required';
      hasError = true;
    }
    if (!formData.localChargeDescripition) {
      errors.localChargeDescripition = 'Local Charge Desc is required';
      hasError = true;
    }
    if (!formData.serviceAccountCode) {
      errors.serviceAccountCode = 'Service Account Code is required';
      hasError = true;
    }
    if (!formData.sacDescripition) {
      errors.sacDescripition = 'Sac Desc is required';
      hasError = true;
    }
    if (!formData.salesAccount) {
      errors.salesAccount = 'Sales Account is required';
      hasError = true;
    }
    if (!formData.purchaseAccount) {
      errors.purchaseAccount = 'Purchase Account is required';
      hasError = true;
    }
    if (!formData.taxable) {
      errors.taxable = 'Taxable is required';
      hasError = true;
    }
    // if (!formData.taxablePercentage) {
    //   errors.taxablePercentage = 'Taxable Percentage is required';
    //   hasError = true;
    // }

    if (!formData.govtSac) {
      errors.govtSac = 'Govt Sac is required';
      hasError = true;
    }
    if (!formData.excempted) {
      errors.excempted = 'Excempted is required';
      hasError = true;
    }
    if (!formData.gstTax) {
      errors.gstTax = 'GST Tax is required';
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const formDataToSend = {
        ...(editId && { id: editId }),
        taxablePercentage: formData.taxablePercentage ? parseInt(formData.taxablePercentage, 10) : 0,
        chargeType: formData.chargeType,
        chargeCode: formData.chargeCode,
        chargeDescription: formData.chargeDescription,
        approved: formData.approved,
        localChargeDescripition: formData.localChargeDescripition,
        serviceAccountCode: formData.serviceAccountCode,
        sacDescripition: formData.sacDescripition,
        salesAccount: formData.salesAccount,
        purchaseAccount: formData.purchaseAccount,
        taxable: formData.taxable,
        govtSac: formData.govtSac,
        excempted: formData.excempted,
        gstTax: formData.gstTax,
        orgId: orgId,
        active: formData.active
      };

      console.log('Data to save is:', formDataToSend);

      try {
        const result = await apiCalls('put', `master/updateCreateChargeTypeRequest`, formDataToSend);
        console.log('API Response:', result); // Log the complete result object

        if (result.status === true) {
          console.log('Response:', result.data);
          showToast('success', editId ? 'Charge Type Updated Successfully' : 'Charge Type created successfully');
          handleClear();
          getAllChargeTypeRequestByOrgId();
        } else if (result.status === false) {
          // Check for error message within result object
          console.log('Error Response:', result);
          showToast('error', result.paramObjectsMap?.errorMessage || 'Charge Type creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      showToast('error', 'Please fill in all required fields');
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            {showForm ? <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} /> : ''}

            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                title="Upload Files"
                uploadText="Upload file"
                downloadText="Sample File"
                onSubmit={handleSubmit}
                sampleFileDownload={ChargeCodeSample}
                handleFileUpload={handleFileUpload}
                apiUrl={`master/excelUploadForChargeCode`}
                screen="Charge Code"
                loginUser={loginUserName}
                orgId={orgId}
              ></CommonBulkUpload>
            )}
            {!showForm ? <ActionButton icon={FaFileExcel} title="Excel Download" onClick={handleExcelFileDownload} /> : ''}
            {!showForm ? <ActionButton icon={FaFilePdf} title="PDF Download" onClick={handlePDFDownload} /> : ''}
          </div>

          {showForm ? (
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.chargeType}>
                  <InputLabel id="demo-simple-select-label">Charge Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Charge Type"
                    required
                    value={formData.chargeType}
                    name="chargeType"
                    onChange={handleInputChange}
                  >
                    {listValues.map((item) => (
                      <MenuItem key={item.id} value={item.chargeType}>
                        {item.chargeType}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.chargeType && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.chargeType}
                    </p>
                  )}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Charge Code"
                  variant="outlined"
                  size="small"
                  name="chargeCode"
                  value={formData.chargeCode}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.chargeCode}
                  helperText={fieldErrors.chargeCode}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Charge Description"
                  variant="outlined"
                  size="small"
                  name="chargeDescription"
                  value={formData.chargeDescription}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.chargeDescription}
                  helperText={fieldErrors.chargeDescription}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Local Charge Description"
                  variant="outlined"
                  size="small"
                  name="localChargeDescripition"
                  value={formData.localChargeDescripition}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.localChargeDescripition}
                  helperText={fieldErrors.localChargeDescripition}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.chargeType}>
                  <InputLabel id="demo-simple-select-label">Service Account Code</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Service Account Code"
                    required
                    value={formData.serviceAccountCode}
                    name="serviceAccountCode"
                    onChange={handleInputChange}
                  >
                    {serviceCode.map((item) => (
                      <MenuItem key={item.id} value={item.serviceAccountCode}>
                        {item.serviceAccountCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.chargeType && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.chargeType}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="SAC Description"
                  variant="outlined"
                  size="small"
                  disabled
                  name="sacDescripition"
                  value={formData.sacDescripition}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.sacDescripition}
                  helperText={fieldErrors.sacDescripition}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.salesAccount}>
                  <InputLabel id="demo-simple-select-label">Sales Account</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Sales Account"
                    required
                    value={formData.salesAccount}
                    name="salesAccount"
                    onChange={handleInputChange}
                  >
                    {salesCode.map((item) => (
                      <MenuItem key={item.index} value={item.salesAccount}>
                        {item.salesAccount}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.salesAccount && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.salesAccount}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.purchaseAccount}>
                  <InputLabel id="demo-simple-select-label">Purchase Account</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Purchase Account"
                    required
                    value={formData.purchaseAccount}
                    name="purchaseAccount"
                    onChange={handleInputChange}
                  >
                    {purchaseCode.map((item) => (
                      <MenuItem key={item.index} value={item.purchaseAccount}>
                        {item.purchaseAccount}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.purchaseAccount && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.purchaseAccount}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.taxable}>
                  <InputLabel id="demo-simple-select-labeltax">Taxable</InputLabel>
                  <Select
                    labelId="demo-simple-select-labeltax"
                    id="demo-simple-selecttax"
                    label="Taxable"
                    required
                    value={formData.taxable}
                    name="taxable"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.taxable && (
                    <p className="error-text ml-2 " style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.taxable}
                    </p>
                  )}
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  id="taxable100%"
                  label='Taxable %'
                  variant="outlined"
                  size="small"
                  type='number'
                  name="taxablePercentage"
                  value={formData.taxablePercentage}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.taxablePercentage}
                  helperText={fieldErrors.taxablePercentage}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.excempted}>
                  <InputLabel id="demo-simple-select-label">Exempted</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Exempted"
                    required
                    value={formData.excempted}
                    name="excempted"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.excempted && (
                    <p className="error-text ml-2 " style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.excempted}
                    </p>
                  )}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="HSN/SAC"
                  variant="outlined"
                  size="small"
                  name="govtSac"
                  value={formData.govtSac}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.govtSac}
                  helperText={fieldErrors.govtSac}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="GST Tax"
                  variant="outlined"
                  size="small"
                  name="gstTax"
                  type="number"
                  value={formData.gstTax}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.gstTax}
                  helperText={fieldErrors.gstTax}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="active" checked={formData.active} onChange={handleInputChange} />}
                    label="Active"
                  />
                </FormGroup>
              </div>
              <div className="col-md-3 mb-2">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.approved}
                        onChange={handleInputChange}
                        name="approved"
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Approved"
                  />
                </FormGroup>
              </div>
            </div>
          ) : (
            <CommonTable data={data} columns={columns} blockEdit={true} toEdit={getAllChargeTypeById} />
          )}
        </div>
      </div>
    </>
  );
};
export default ChargeTypeRequest;
