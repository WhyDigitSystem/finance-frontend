import React, { useEffect, useState } from 'react';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
const Unit = () => {
  const [listView, setListView] = useState(true);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);
  const orgId = localStorage.getItem('orgId');
  const createdBy = localStorage.getItem('userName');
  const modifiedBy = createdBy;

  const [formData, setFormData] = useState({
    uomCode: '',
    uomDesc: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});

  let handleListView = () => {
    setListView(!listView);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value.toUpperCase();
    const codeRegex = /^[A-Za-z]*$/;
    const descRegex = /^[A-Za-z ]*$/;

    let errorMessage = { ...fieldErrors };
    if (name === 'uomCode') {
      if (!codeRegex.test(inputValue)) {
        errorMessage.uomCode = 'Only Allowed Characters';
      } else if (inputValue.length > 5) {
        errorMessage.uomCode = 'Max Length 5';
      } else {
        errorMessage.uomCode = '';
      }
    }
    if (name === 'uomDesc') {
      if (!descRegex.test(inputValue)) {
        errorMessage.uomDesc = 'Only Allowed Alphabets and Spaces';
      } else if (inputValue.length > 30) {
        errorMessage.uomDesc = 'Max Length 30';
      } else {
        errorMessage.uomDesc = '';
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

  const handleClearAll = () => {
    setFormData({
      uomCode: '',
      uomDesc: '',
      active: true
    });
    setFieldErrors({});
    setEditId('');
  };

  const validForm = () => {
    let error = {};
    if (!formData.uomCode) {
      error.uomCode = 'Uom Code is Required';
    }
    if (!formData.uomDesc) {
      error.uomDesc = 'Uom Description is Required';
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
      uomCode: formData.uomCode,
      uomDesc: formData.uomDesc,
      active: formData.active,
      orgId: parseInt(orgId),
      createdBy,
      modifiedBy
    };

    try {
      const result = await apiCalls('put', '/master/updateCreateUom', formDataSendtoApi);
      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        handleClearAll();
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
      const res = await apiCalls('get', `/master/getUomByOrgId?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setListViewData(res.paramObjectsMap.uomVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getAllData();
  }, []);

  const rowEditgetbyid = async (row) => {
    setEditId(row.original.id);
    setFieldErrors({});
    setListView(true);
    try {
      const results = await apiCalls('get', `/master/getUomById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const product = results.paramObjectsMap.uomVO[0];
        setFormData({
          uomCode: product.uomCode || '',
          uomDesc: product.uomDesc || '',
          active: product.active === 'Active' ? true : false,
          orgId: parseInt(orgId),
          createdBy,
          modifiedBy
        });
      } else {
        console.warn('Error fetching product details:', results.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  const listViewColumns = [
    { accessorKey: 'uomCode', header: 'Uom Code', size: 140 },
    { accessorKey: 'uomDesc', header: 'Uom Description', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
      <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
        <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClearAll} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
        </div>
      </div>
      {listView ? (
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="uomCode"
                label="Uom Code"
                name="uomCode"
                value={formData.uomCode}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
                error={!!fieldErrors.uomCode}
                helperText={fieldErrors.uomCode}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="uomDesc"
                label="Uom Description"
                name="uomDesc"
                value={formData.uomDesc}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
                error={!!fieldErrors.uomDesc}
                helperText={fieldErrors.uomDesc}
              />
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
      ) : (
        <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={rowEditgetbyid} />
      )}
    </div>
  );
};

export default Unit;
