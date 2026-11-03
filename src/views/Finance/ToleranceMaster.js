import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import apiCalls from 'apicall';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

export const ToleranceMaster = () => {
  const orgId = localStorage.getItem('orgId');
  const loginUserName = localStorage.getItem('userName');

  const [editId, setEditId] = useState('');

  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);

  const [formData, setFormData] = useState({
    screenId: '',
    screen: '',
    active: true,
    lt: '',
    ut: '',
    tol: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    screenId: '',
    screen: '',
    lt: '',
    ut: '',
    tol: ''
  });

  // LIST VIEW COLUMNS
  const listViewColumns = [
    { accessorKey: 'screen', header: 'Screen Name', size: 180 },
    { accessorKey: 'screenId', header: 'Screen ID', size: 140 },
    { accessorKey: 'lt', header: 'Lower Tolerance (LT)', size: 150 },
    { accessorKey: 'ut', header: 'Upper Tolerance (UT)', size: 150 },
    { accessorKey: 'tol', header: 'Tolerance (TOL)', size: 150 },
    { accessorKey: 'active', header: 'Active', size: 100 }
  ];

  // GET ALL TOLERANCE MASTER
  const getAllToleranceMaster = async () => {
    try {
      const response = await apiCalls('get', `master/getAllToleranceMaster?orgId=${orgId}`);

      console.log('Tolerance Master Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.toleranceMasterVOs || []);
      } else {
        setListViewData([]);
      }
    } catch (error) {
      console.error('Error fetching Tolerance Master:', error);
    }
  };

  useEffect(() => {
    getAllToleranceMaster();
  }, []);

  // HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    let updatedValue = value;

    if (name === 'screenId') {
      updatedValue = value.toUpperCase();

      if (updatedValue.length > 10) return;
    }

    if (name === 'screen' && value.length > 50) return;

    if (['lt', 'ut', 'tol'].includes(name)) {
      if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : updatedValue
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  // CLEAR FORM
  const handleClear = () => {
    setEditId('');

    setFormData({
      screenId: '',
      screen: '',
      active: true,
      lt: '',
      ut: '',
      tol: ''
    });

    setFieldErrors({
      screenId: '',
      screen: '',
      lt: '',
      ut: '',
      tol: ''
    });
  };

  // LIST VIEW
  const handleView = () => {
    setListView((prev) => !prev);

    if (!listView) {
      getAllToleranceMaster();
    }
  };

  // EDIT RECORD
  const getToleranceMasterById = async (row) => {
    const id = row.original.id;

    setEditId(id);

    try {
      const response = await apiCalls('get', `master/getToleranceMasterById?id=${id}`);

      console.log('Tolerance Master By ID:', response);

      if (response.status === true) {
        const data = response.paramObjectsMap.toleranceMasterVO;

        setFormData({
          screenId: data.screenId || '',
          screen: data.screen || '',
          active: data.active === true || data.active === 'true',
          lt: data.lt ?? '',
          ut: data.ut ?? '',
          tol: data.tol ?? ''
        });

        setListView(false);
      } else {
        showToast('error', response.paramObjectsMap?.errorMessage || 'Unable to fetch record');
      }
    } catch (error) {
      console.error('Error fetching Tolerance Master:', error);
      showToast('error', 'Error fetching Tolerance Master');
    }
  };

  // VALIDATION
  const validateForm = () => {
    const errors = {};

    if (!formData.screenId.trim()) {
      errors.screenId = 'Screen ID is required';
    } else if (formData.screenId.length > 10) {
      errors.screenId = 'Maximum 10 characters allowed';
    }

    if (!formData.screen.trim()) {
      errors.screen = 'Screen Name is required';
    } else if (formData.screen.length > 50) {
      errors.screen = 'Maximum 50 characters allowed';
    }

    if (formData.lt === '') {
      errors.lt = 'Lower Tolerance is required';
    }

    if (formData.ut === '') {
      errors.ut = 'Upper Tolerance is required';
    }

    if (formData.tol === '') {
      errors.tol = 'Tolerance is required';
    }

    if (formData.lt !== '' && formData.ut !== '' && Number(formData.lt) > Number(formData.ut)) {
      errors.lt = 'Lower Tolerance cannot exceed Upper Tolerance';
    }

    setFieldErrors({
      screenId: errors.screenId || '',
      screen: errors.screen || '',
      lt: errors.lt || '',
      ut: errors.ut || '',
      tol: errors.tol || ''
    });

    return Object.keys(errors).length === 0;
  };

  // SAVE / UPDATE
  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    const saveData = {
      ...(editId && { id: editId }),

      screenId: formData.screenId.trim(),
      screen: formData.screen.trim(),

      active: formData.active,

      lt: Number(formData.lt),
      ut: Number(formData.ut),
      tol: Number(formData.tol),

      createdBy: loginUserName,
      orgId: parseInt(orgId)
    };

    console.log('Tolerance Master Save Data:', saveData);

    try {
      const response = await apiCalls('put', 'master/createUpdateToleranceMaster', saveData);

      console.log('Save Response:', response);

      if (response.status === true) {
        showToast('success', editId ? 'Tolerance Master Updated Successfully' : 'Tolerance Master Created Successfully');

        handleClear();
        getAllToleranceMaster();
      } else {
        showToast('error', response.paramObjectsMap?.errorMessage || 'Tolerance Master Save Failed');
      }
    } catch (error) {
      console.error('Error saving Tolerance Master:', error);
      showToast('error', 'An error occurred while saving Tolerance Master');
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        {/* ACTION BUTTONS */}
        <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />

          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />

          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
        </div>

        {listView ? (
          // LIST VIEW
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getToleranceMasterById} />
          </div>
        ) : (
          // FORM VIEW
          <>
            <div className="row d-flex ml">
              {/* SCREEN NAME */}
              <div className="col-md-3 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  name="screen"
                  label="Screen Name"
                  value={formData.screen}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 50 }}
                  error={!!fieldErrors.screen}
                  helperText={fieldErrors.screen}
                />
              </div>
              {/* SCREEN ID */}
              <div className="col-md-3 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  name="screenId"
                  label="Screen ID"
                  value={formData.screenId}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.screenId}
                  helperText={fieldErrors.screenId}
                />
              </div>
              {/* LOWER TOLERANCE */}
              <div className="col-md-3 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  name="lt"
                  label="Lower Tolerance (LT)"
                  type="number"
                  value={formData.lt}
                  onChange={handleInputChange}
                  error={!!fieldErrors.lt}
                  helperText={fieldErrors.lt}
                />
              </div>

              {/* UPPER TOLERANCE */}
              <div className="col-md-3 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  name="ut"
                  label="Upper Tolerance (UT)"
                  type="number"
                  value={formData.ut}
                  onChange={handleInputChange}
                  error={!!fieldErrors.ut}
                  helperText={fieldErrors.ut}
                />
              </div>

              {/* TOLERANCE */}
              <div className="col-md-3 mb-3">
                <TextField
                  fullWidth
                  size="small"
                  name="tol"
                  label="Tolerance (TOL)"
                  type="number"
                  value={formData.tol}
                  onChange={handleInputChange}
                  error={!!fieldErrors.tol}
                  helperText={fieldErrors.tol}
                />
              </div>

              {/* ACTIVE */}
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      sx={{
                        color: '#673AB7',
                        '&.Mui-checked': {
                          color: '#673AB7'
                        }
                      }}
                    />
                  }
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ToleranceMaster;
