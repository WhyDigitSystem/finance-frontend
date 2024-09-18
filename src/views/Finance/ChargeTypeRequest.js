import ClearIcon from '@mui/icons-material/Clear';
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
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';

export const ChargeTypeRequest = () => {
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [formData, setFormData] = useState({
    active: true,
    chargeType: '',
    chargeCode: '',
    product: '',
    chargeDescription: '',
    localChargeDescripition: '',
    serviceAccountCode: '',
    sACDescription: '',
    salesAccount: '',
    purchaseAccount: '',
    taxType: '',
    ccFeeApplicable: '',
    taxable: '',
    taxablePercentage: '',
    ccJob: '',
    govtSac: '',
    excempted: '',
    orgId: orgId,
    gstTax: '',
    gstControl: '',
    service: '',
    type: ''
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
    taxType: '',
    taxablePercentage: '',
    ccFeeApplicable: '',
    ccJob: '',
    govtSac: '',
    excempted: '',
    gstTax: '',
    gstControl: '',
    service: '',
    type: ''
  });

  const validateForm = () => {
    let errors = {};
    let hasError = false;

    if (!formData.chargeType) {
      errors.chargeType = '* Field is required';
      hasError = true;
    }
    if (!formData.chargeCode) {
      errors.chargeCode = '* Field is required';
      hasError = true;
    }
    if (!formData.product) {
      errors.product = '* Field is required';
      hasError = true;
    }
    if (!formData.chargeDescription) {
      errors.chargeDescription = '* Field is required';
      hasError = true;
    }
    if (!formData.localChargeDescripition) {
      errors.localChargeDescripition = '* Field is required';
      hasError = true;
    }
    if (!formData.serviceAccountCode) {
      errors.serviceAccountCode = '* Field is required';
      hasError = true;
    }
    if (!formData.sacDescripition) {
      errors.sacDescripition = '* Field is required';
      hasError = true;
    }
    if (!formData.salesAccount) {
      errors.salesAccount = '* Field is required';
      hasError = true;
    }
    if (!formData.purchaseAccount) {
      errors.purchaseAccount = '* Field is required';
      hasError = true;
    }
    if (!formData.taxable) {
      errors.taxable = '* Field is required';
      hasError = true;
    }
    if (!formData.taxablePercentage) {
      errors.taxablePercentage = '* Field is required';
      hasError = true;
    }

    if (!formData.taxType) {
      errors.taxType = '* Field is required';
      hasError = true;
    }
    if (!formData.ccFeeApplicable) {
      errors.ccFeeApplicable = '* Field is required';
      hasError = true;
    }
    if (!formData.ccJob) {
      errors.ccJob = '* Field is required';
      hasError = true;
    }
    if (!formData.govtSac) {
      errors.govtSac = '* Field is required';
      hasError = true;
    }
    if (!formData.excempted) {
      errors.excempted = '* Field is required';
      hasError = true;
    }
    if (!formData.gstTax) {
      errors.gstTax = '* Field is required';
      hasError = true;
    }
    if (!formData.gstControl) {
      errors.gstControl = '* Field is required';
      hasError = true;
    }
    if (!formData.service) {
      errors.service = '* Field is required';
      hasError = true;
    }
    if (!formData.type) {
      errors.type = '* Field is required';
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission with formData
    console.log(formData);
    // Example: Submit formData to backend or perform further actions
  };

  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  // useEffect(() => {
  //   getSetTaxRate();
  // }, []);

  const getSetTaxRate = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllChargeTypeRequestByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.chargeTypeRequestVO);

        console.log('Test', response.data.paramObjectsMap.chargeTypeRequestVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = () => {
    const formDataToSend = {
      ...formData,
      taxablePercentage: formData.taxablePercentage ? parseInt(formData.taxablePercentage, 10) : 0
    };

    if (validateForm()) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateChargeTypeRequest`, formDataToSend)
        .then((response) => {
          if (response.data.status) {
            console.log('Response:', response.data);
            handleClear();
            toast.success('Set Tax Rate Created Successfully', {
              autoClose: 2000,
              theme: 'colored'
            });
          } else {
            console.error('API Error:', response.data);
            toast.error('Error in creating/updating charge type request', {
              autoClose: 2000,
              theme: 'colored'
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('An error occurred while saving', {
            autoClose: 2000,
            theme: 'colored'
          });
        });
    } else {
      toast.error('Please fill in all required fields', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  const handleRowEdit = (rowId, newData) => {
    console.log('Edit', rowId, newData);
    // Send PUT request to update the row
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateChargeTypeRequest/${rowId}`, newData)
      .then((response) => {
        console.log('Edit successful:', response.data);
        // Handle any further actions after successful edit
        toast.success('Set Tax Rate Updated Successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
      })
      .catch((error) => {
        console.error('Error editing row:', error);
        // Handle error scenarios
        toast.error('Failed to Update Set Tax Rate', {
          autoClose: 2000,
          theme: 'colored'
        });
      });
  };

  const getAllChargeTypeById = async (emitterId) => {
    console.log('first', emitterId);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getAllChargeTypeRequestById?id=${emitterId.original.id}`
      );
      console.log('API Response:', response);

      if (response.status === 200) {
        const chargeTypeRequestVO = response.data.paramObjectsMap.chargeTypeRequestVO[0];
        setShowForm(true);

        setFormData({
          active: chargeTypeRequestVO.active,
          chargeType: chargeTypeRequestVO.chargeType || '',
          chargeCode: chargeTypeRequestVO.chargeCode || '',
          product: chargeTypeRequestVO.product || '',
          chargeDescription: chargeTypeRequestVO.chargeDescripition || '',
          localChargeDescripition: chargeTypeRequestVO.localChargeDescripition || '',
          serviceAccountCode: chargeTypeRequestVO.serviceAccountCode || '',
          sACDescription: chargeTypeRequestVO.sacDescripition || '',
          salesAccount: chargeTypeRequestVO.salesAccount || '',
          purchaseAccount: chargeTypeRequestVO.purchaseAccount || '',
          taxType: chargeTypeRequestVO.taxType || '',
          ccFeeApplicable: chargeTypeRequestVO.ccFeeApplicable || '',
          taxable: chargeTypeRequestVO.taxable || '',
          taxablePercentage: chargeTypeRequestVO.taxablePercentage || '',
          ccJob: chargeTypeRequestVO.ccJob || '',
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
        // Handle error
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

    getSetTaxRate();
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
      sACDescription: '',
      salesAccount: '',
      purchaseAccount: '',
      taxType: '',
      ccFeeApplicable: '',
      taxable: '',
      taxablePercentage: '',
      ccJob: '',
      govtSac: '',
      excempted: '',
      orgId: orgId,
      gstTax: '',
      gstControl: '',
      service: '',
      type: ''
    });

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
      taxType: '',
      taxablePercentage: '',
      ccFeeApplicable: '',
      ccJob: '',
      govtSac: '',
      excempted: '',
      gstTax: '',
      gstControl: '',
      service: '',
      type: ''
    });
  };

  const columns = [
    { accessorKey: 'chargeType', header: 'Charge Type', size: 140 },
    { accessorKey: 'chargeCode', header: 'Charge Code', size: 140 },
    { accessorKey: 'product', header: 'Product', size: 140 },
    { accessorKey: 'chargeDescription', header: 'Charge Description', size: 140 },
    // { accessorKey: 'localChargeDescripition', header: 'Local Charge Description', size: 140 },
    // { accessorKey: 'serviceAccountCode', header: 'Service Account Code', size: 140 },
    // { accessorKey: 'sACDescription', header: 'SAC Description', size: 140 },
    // { accessorKey: 'salesAccount', header: 'Sales Account', size: 140 },
    // { accessorKey: 'purchaseAccount', header: 'Purchase Account', size: 140 },
    // { accessorKey: 'taxType', header: 'Tax Type', size: 140 },
    // { accessorKey: 'ccFeeApplicable', header: 'CC Fee Applicable', size: 140 },
    // { accessorKey: 'taxable', header: 'Taxable', size: 140 },
    // { accessorKey: 'taxablePercentage', header: 'Taxable Percentage', size: 140 },
    // { accessorKey: 'ccJob', header: 'CC Job', size: 140 },
    // { accessorKey: 'govtSac', header: 'Govt SAC', size: 140 },
    // { accessorKey: 'excempted', header: 'Exempted', size: 140 },
    { accessorKey: 'gSTTax', header: 'GST Tax', size: 140 },
    { accessorKey: 'gSTControl', header: 'GST Control', size: 140 },
    { accessorKey: 'service', header: 'Service', size: 140 },
    { accessorKey: 'type', header: 'Type', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} margin="0 10px 0 10px" />
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
                    <MenuItem value="string">String</MenuItem>
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
                  placeholder="Placeholder"
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
                <FormControl fullWidth size="small" error={!!fieldErrors.product}>
                  <InputLabel id="demo-simple-select-label">Product</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Product"
                    required
                    value={formData.product}
                    name="product"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.product && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.product}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Charge Description"
                  placeholder="Placeholder"
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
                  placeholder="Placeholder"
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
                <FormControl fullWidth size="small" error={!!fieldErrors.serviceAccountCode}>
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
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.serviceAccountCode && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.serviceAccountCode}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="SAC Description"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
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
                    <MenuItem value="string">String</MenuItem>
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
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.purchaseAccount && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.purchaseAccount}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Taxable"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="taxable"
                  value={formData.taxable}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.taxable}
                  helperText={fieldErrors.taxable}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.taxType}>
                  <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Tax Type"
                    required
                    value={formData.taxType}
                    name="taxType"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.taxType && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.taxType}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="CC Fee Applicable"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="ccFeeApplicable"
                  value={formData.ccFeeApplicable}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.ccFeeApplicable}
                  helperText={fieldErrors.ccFeeApplicable}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="taxable100%"
                  label="Taxable %"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="taxablePercentage"
                  value={formData.taxablePercentage}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.taxablePercentage}
                  helperText={fieldErrors.taxablePercentage}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="CC Job"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="ccJob"
                  value={formData.ccJob}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.ccJob}
                  helperText={fieldErrors.ccJob}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Govt. SAC"
                  placeholder="Placeholder"
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
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
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
                  label="GST Tax"
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  name="gstTax"
                  value={formData.gstTax}
                  onChange={handleInputChange}
                  className="w-100"
                  error={!!fieldErrors.gstTax}
                  helperText={fieldErrors.gstTax}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.gstControl}>
                  <InputLabel id="demo-simple-select-label">GST Control</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="GST Control"
                    required
                    value={formData.gstControl}
                    name="gstControl"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.gstControl && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.gstControl}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.service}>
                  <InputLabel id="demo-simple-select-label">Service</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Service"
                    required
                    value={formData.service}
                    name="service"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.service && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.service}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.type}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    required
                    value={formData.type}
                    name="type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                  {fieldErrors.type && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.type}
                    </p>
                  )}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="active" checked={formData.active} onChange={handleInputChange} />}
                    label="Active"
                  />
                </FormGroup>
              </div>
            </div>
          ) : (
            <CommonTable data={data} columns={columns} onRowEditTable={handleRowEdit} blockEdit={true} toEdit={getAllChargeTypeById} />
          )}
        </div>
      </div>
    </>
  );
};
export default ChargeTypeRequest;
