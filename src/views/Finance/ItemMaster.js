import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import CommonTable from 'views/basicMaster/CommonTable';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import { showToast } from 'utils/toast-component';
import { useState, useEffect } from 'react';
import apiCalls from 'apicall';

const ItemMaster = () => {
  const orgId = localStorage.getItem('orgId');
  const branch = localStorage.getItem('branch');
  const branchCode = localStorage.getItem('branchcode');
  const finYear = localStorage.getItem('finYear');
  const createdBy = localStorage.getItem('createdBy');
  const modifiedBy = createdBy;
  const [listView, setListView] = useState(true);
  const [editId, setEditId] = useState(null);
  const [listViewData, setListViewData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [formData, setFormData] = useState({
    itemType: '',
    partNo: '',
    partDesc: '',
    custPartNo: '',
    unit: '',
    hsnCode: '',
    weight: '',
    customer: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value.toUpperCase();
    const itemRegex = /^[A-Za-z0-9\s\-()]*$/;
    const partNoRegex = /^[A-Za-z0-9\-_.]*$/;
    const desRegex = /^[A-Za-z0-9\s\-.,()\/]*$/;
    const weightRegex = /^[0-9 .]*$/;
    let errorMessage = { ...fieldErrors };

    if (name === 'itemType') {
      if (!itemRegex.test(inputValue)) {
        errorMessage.itemType = 'Only allowed alphanumeric, space, hyphen, parentheses';
      } else if (inputValue.length > 50) {
        errorMessage.itemType = 'Max Length 50';
      } else {
        errorMessage.itemType = '';
      }
    }
    if (name === 'partNo') {
      if (!partNoRegex.test(inputValue)) {
        errorMessage.partNo = 'Only allowed alphanumeric, dash, underscore, dot';
      } else if (inputValue.length > 30) {
        errorMessage.partNo = 'Max Length 30';
      } else {
        errorMessage.partNo = '';
      }
    }
    if (name === 'partDesc') {
      if (!desRegex.test(inputValue)) {
        errorMessage.partDesc = 'Only allowed alphanumeric, space, punctuation';
      } else if (inputValue.length > 100) {
        errorMessage.partDesc = 'Max Length 100';
      } else {
        errorMessage.partDesc = '';
      }
    }

    if (name === 'custPartNo') {
      if (!partNoRegex.test(inputValue)) {
        errorMessage.custPartNo = 'Only allowed alphanumeric, dash, underscore, dot';
      } else if (inputValue.length > 30) {
        errorMessage.custPartNo = 'Max Length 30';
      } else {
        errorMessage.custPartNo = '';
      }
    }
    if (name === 'weight') {
      if (!weightRegex.test(inputValue)) {
        errorMessage.weight = 'Only allowed numeric, dot';
      } else if (inputValue.length > 10) {
        errorMessage.weight = 'Max Length 10';
      } else {
        errorMessage.weight = '';
      }
    }

    if (name === 'unit') {
      if (!inputValue) {
        errorMessage.unit = 'Unit is required';
      } else {
        errorMessage.unit = '';
      }
    }
    if (name === 'hsnCode') {
      if (!inputValue) {
        errorMessage.hsnCode = 'hsnCode is required';
      } else {
        errorMessage.hsnCode = '';
      }
    }

    setFieldErrors(errorMessage);
    if (!errorMessage[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      active: event.target.checked
    }));
  };

  const handleAllClear = () => {
    setFormData({
      itemType: '',
      partNo: '',
      partDesc: '',
      custPartNo: '',
      unit: '',
      hsnCode: '',
      weight: '',
      customer: '',
      active: true
    });
    setFieldErrors({});
    setEditId(null);
  };

  const validForm = () => {
    let error = {};
    if (!formData.itemType) {
      error.itemType = 'Item Type is Required';
    }
    if (!formData.partNo) {
      error.partNo = 'Part No is Required';
    }
    if (!formData.partDesc) {
      error.partDesc = 'Part Description is Required';
    }
    if (!formData.unit) {
      error.unit = 'unit is Required';
    }
    if (!formData.hsnCode) {
      error.hsnCode = 'Hsn Code is Required';
    }
    setFieldErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validForm()) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    const formDataSendtoApi = {
      ...(editId && { id: editId }),
      itemType: formData.itemType,
      partNo: formData.partNo,
      partDesc: formData.partDesc,
      custPartNo: formData.custPartNo,
      unit: formData.unit,
      hsnCode: formData.hsnCode,
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      customer: formData.customer,
      active: formData.active,
      orgId: parseInt(orgId),
      createdBy,
      modifiedBy,
      branch,
      branchCode,
      finYear
    };

    try {
      const result = await apiCalls('put', 'master/updateCreateItemMaster', formDataSendtoApi);
      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        handleAllClear();
        getAllData();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Creation failed');
      }
    } catch (error) {
      showToast('error', 'API call failed');
    }
  };

  const getAllData = async () => {
    try {
      const res = await apiCalls('get', `master/getAllItemMasterByOrgId?branchCode=${branchCode}&id=${orgId}`);
      console.log('Fetching data for orgId&branchcode:', orgId, branchCode);
      setListViewData(res.paramObjectsMap.ItemMasterVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const unitAllList = async () => {
    try {
      const res = await apiCalls('get', `/master/getUomByOrgId?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setUnitList(res.paramObjectsMap.uomVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getAllData();
    unitAllList();
  }, []);

  const rowEditgetbyid = async (row) => {
    setEditId(row.original.id);
    setFieldErrors({});
    setListView(true);
    try {
      const results = await apiCalls('get', `master/getAllItemMasterById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const item = results.paramObjectsMap.ItemMasterVO[0];
        setFormData({
          custPartNo: item.custPartNo || '',
          hsnCode: item.hsnCode || '',
          itemType: item.itemType || '',
          partDesc: item.partDesc || '',
          partNo: item.partNo || '',
          unit: item.unit || '',
          customer: item.customer || '',
          weight: item.weight || '',
          active: item.active === true || item.active === 'Active',

          orgId: orgId,
          branchCode,
          branch,
          finYear,
          createdBy
        });
      } else {
        console.warn('Error fetching product details:', results.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const listViewColumns = [
    { accessorKey: 'itemType', header: 'Item Type', size: 130 },
    { accessorKey: 'partNo', header: 'Part No', size: 130 },
    { accessorKey: 'partDesc', header: 'Part Description', size: 150 },
    { accessorKey: 'unit', header: 'Unit', size: 130 },
    { accessorKey: 'hsnCode', header: 'HSN Code', size: 130 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];
  let handleListView = () => {
    setListView(!listView);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleAllClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>
        </div>
        {listView ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="itemType"
                    label="Item Type"
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    size="small"
                    required
                    error={!!fieldErrors.itemType}
                    helperText={fieldErrors.itemType}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partNo"
                    label="Part No"
                    name="partNo"
                    size="small"
                    value={formData.partNo}
                    onChange={handleChange}
                    error={!!fieldErrors.partNo}
                    helperText={fieldErrors.partNo}
                    required
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partDesc"
                    label="Part Description"
                    name="partDesc"
                    size="small"
                    value={formData.partDesc}
                    onChange={handleChange}
                    error={!!fieldErrors.partDesc}
                    helperText={fieldErrors.partDesc}
                    required
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="custPartNo"
                    label="Custpart No"
                    name="custPartNo"
                    size="small"
                    value={formData.custPartNo}
                    onChange={handleChange}
                    error={!!fieldErrors.custPartNo}
                    helperText={fieldErrors.custPartNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.unit}>
                  <InputLabel htmlFor="type" required>
                    Unit
                  </InputLabel>
                  <Select labelId="unit-label" id="unit" label="Unit" name="unit" value={formData.unit} onChange={handleChange} required>
                    {unitList.map((unit) => (
                      <MenuItem key={unit.uomCode} value={unit.uomCode}>
                        {unit.uomCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.unit && <FormHelperText>{fieldErrors.unit}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.hsnCode}>
                  <InputLabel htmlFor="type" required>
                    Hsn Code
                  </InputLabel>
                  <Select
                    labelId="hsncode-label"
                    id="hsnCode"
                    label="Hsn Code"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="PRODUCT">PRODUCT</MenuItem>
                    <MenuItem value="SERVICES">SERVICES</MenuItem>
                  </Select>
                  {fieldErrors.hsnCode && <FormHelperText>{fieldErrors.hsnCode}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="weight"
                    label="Weight"
                    name="weight"
                    size="small"
                    value={formData.weight}
                    onChange={handleChange}
                    error={!!fieldErrors.weight}
                    helperText={fieldErrors.weight}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel htmlFor="customer">Customer</InputLabel>
                  <Select
                    labelId="customer-label"
                    id="customer"
                    label="Customer"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                  >
                    <MenuItem value="PRODUCT">PRODUCT</MenuItem>
                    <MenuItem value="SERVICES">SERVICES</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    name="active"
                    label="Active"
                    control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                  />
                </FormGroup>
              </div>
            </div>
          </>
        ) : (
          <>
            <CommonTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={rowEditgetbyid} />
          </>
        )}
      </div>
    </>
  );
};

export default ItemMaster;
