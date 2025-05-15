import React, { useEffect, useState } from 'react';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel } from '@mui/material';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
const StockBranch = () => {
  const [listView, setListView] = useState(true);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);
  const orgId = localStorage.getItem('orgId');
  const createdBy = localStorage.getItem('userName');
  const modifiedBy = createdBy;

  const [formData, setFormData] = useState({
    branch: '',
    branchCode: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({});

  let handleListView = () => {
    setListView(!listView);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value.toUpperCase();
    const branchRegex = /^[A-Za-z0-9 ]*$/;
    const codeRegex = /^[A-Za-z0-9_-]*$/;

    let errorMessage = { ...fieldErrors };
    if (name === 'branch') {
      if (!branchRegex.test(inputValue)) {
        errorMessage.branch = 'Only allowed alphanumeric, Space';
      } else if (inputValue.length > 50) {
        errorMessage.branch = 'Max Length 50';
      } else {
        errorMessage.branch = '';
      }
    }
    if (name === 'branchCode') {
      if (!codeRegex.test(inputValue)) {
        errorMessage.branchCode = 'Only allowed alphanumeric, underscore, hyphen';
      } else if (inputValue.length > 30) {
        errorMessage.branchCode = 'Max Length 30';
      } else {
        errorMessage.branchCode = '';
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
      branch: '',
      branchCode: '',
      active: true
    });
    setFieldErrors({});
    setEditId('');
  };

  const validForm = () => {
    let error = {};
    if (!formData.branch) {
      error.branch = 'Branch is Required';
    }
    if (!formData.branchCode) {
      error.branchCode = 'Code is Required';
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
      branchCode: formData.branchCode,
      branch: formData.branch,
      active: formData.active,
      orgId: parseInt(orgId),
      createdBy,
      modifiedBy
    };

    try {
      const result = await apiCalls('put', '/warehouser/createupdateStockBranch', formDataSendtoApi);
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
      const res = await apiCalls('get', `/warehouser/getAllStockBranchByOrgId?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setListViewData(res.paramObjectsMap.stockBranchVO.reverse());
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
      const results = await apiCalls('get', `/warehouser/getStockBranchById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const product = results.paramObjectsMap.stockBranchVO;
        setFormData({
          branch: product.branch || '',
          branchCode: product.branchCode || '',
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
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'branchCode', header: 'Code', size: 120 },
    { accessorKey: 'active', header: 'Active', size: 120 }
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
                id="branch"
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
                error={!!fieldErrors.branch}
                helperText={fieldErrors.branch}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="branchCode"
                label="Code"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
                error={!!fieldErrors.branchCode}
                helperText={fieldErrors.branchCode}
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

export default StockBranch;
