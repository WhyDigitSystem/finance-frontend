import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import apiCalls from 'apicall';
const AssetType = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState('');
  const [data, setData] = useState(true);
  const [formData, setFormData] = useState({
    name:'',
    code:''
  });
  const [fieldErrors, setFieldErrors] = useState({
    name:'',
    code:''
  });
  const handleView = () => {
    setShowForm(!showForm);
  };
  const handleClear = () => {
    setFormData({
      name:'',
      code:''
    });
    setFieldErrors({
      name:'',
      code:''
    });
    setEditId('');
  };
  useEffect(() => {
    getAllAssetTypeByOrgId();
  }, []);
  const listViewColumns = [
    { accessorKey: 'assetType', header: 'Name', size: 140 },
    { accessorKey: 'typeCode', header: 'Code', size: 140 },
  ];
  const handleInputChange = (e) => {
  const { name, value, type, selectionStart, selectionEnd } = e.target;
  let errorMessage = '';
  if (name === 'name' && !/^[A-Za-z ]*$/.test(value)) {
    errorMessage = 'Only Alphabets Allowed';
  }
  if (name === 'code' && !/^[A-Za-z0-9]*$/.test(value)) {
    errorMessage = 'Only Alphanumeric Characters Allowed';
  }
  setFieldErrors((prevErrors) => ({
    ...prevErrors,
    [name]: errorMessage
  }));
  if (!errorMessage) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase()
    }));
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };
  const getAllAssetTypeByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetTypeByOrgId?orgid=${orgId}`);
      setData(result.paramObjectsMap.assetTypeVO.reverse() || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAssetTypeById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/kitController/getAssetTypeById?id=${row.original.id}`);

      if (result) {
        const assetTypeVO = result.paramObjectsMap.assetTypeVO;
        setEditId(row.original.id);
        setFormData({
          // branch: assetTypeVO.branch,
          // branchCode:assetTypeVO. branchCode,
          createdBy: assetTypeVO.loginUserName,
          orgId: assetTypeVO.orgId,
          name: assetTypeVO.assetType,
          code: assetTypeVO.typeCode
        });
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        // branchCode: branchCode,
        active: true,
        createdBy: loginUserName,
        orgId: orgId,
        assetType: formData.name,
        typeCode: formData.code,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/kitController/updateCreateAssetType`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Asset Type Updated Successfully' : 'Asset Type Created successfully');
          getAllAssetTypeByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Asset Type creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Asset Type creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="name"
                    label= "Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.name ? fieldErrors.name : ''}</span>}
                    error={!!fieldErrors.name}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="code"
                    label= "Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="code"
                    value={formData.code}
                    inputProps={{ maxLength: 10 }}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.code ? fieldErrors.code : ''}</span>}
                    error={!!fieldErrors.code}
                  />
                </div>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAssetTypeById} />
          )}
        </div>
      </div>
    </>
  )
}

export default AssetType