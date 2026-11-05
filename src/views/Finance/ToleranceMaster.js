import React, { useEffect, useState } from 'react';

import { TextField, Checkbox, FormControlLabel, MenuItem } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import apiCalls from 'apicall';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

export const ToleranceMaster = () => {
  // LOCAL STORAGE
  const orgId = localStorage.getItem('orgId');
  const loginUserName = localStorage.getItem('userName');
  const branchCode = localStorage.getItem('branchcode') || '';
  const branchName = localStorage.getItem('branchName') || localStorage.getItem('branch') || '';

  // STATES
  const [editId, setEditId] = useState('');

  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);

  // SCREEN NAME DROPDOWN DATA
  const [screenNamesList, setScreenNamesList] = useState([]);

  // INITIAL FORM DATA
  const initialFormData = {
    screenCode: '',
    screenName: '',
    active: true,
    lowerTolerance: '',
    upperTolerance: '',
    tolerance: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // FIELD ERRORS
  const [fieldErrors, setFieldErrors] = useState({
    screenCode: '',
    screenName: '',
    lowerTolerance: '',
    upperTolerance: '',
    tolerance: ''
  });

  // NORMALIZE ACTIVE VALUE
  const isRecordActive = (value) => {
    return value === true || String(value).trim().toLowerCase() === 'true' || String(value).trim().toLowerCase() === 'active';
  };

  // LIST VIEW COLUMNS
  const listViewColumns = [
    {
      accessorKey: 'screenName',
      header: 'Screen Name',
      size: 180
    },
    {
      accessorKey: 'screenCode',
      header: 'Screen Code',
      size: 140
    },
    {
      accessorKey: 'lowerTolerance',
      header: 'Lower Tolerance (LT)',
      size: 150
    },
    {
      accessorKey: 'upperTolerance',
      header: 'Upper Tolerance (UT)',
      size: 150
    },
    {
      accessorKey: 'tolerance',
      header: 'Tolerance (TOL)',
      size: 150
    },
    {
      accessorKey: 'active',
      header: 'Active',
      size: 100
    }
  ];

  // GET ALL SCREEN NAMES
  const getAllScreenNames = async () => {
    try {
      const response = await apiCalls('get', 'commonmaster/getAllScreenNames');

      console.log('All Screen Names Response:', response);

      if (response?.status === true) {
        const records = response?.paramObjectsMap?.screenNamesVO || [];

        // ONLY ACTIVE SCREEN NAMES
        const activeRecords = records.filter((item) => isRecordActive(item.active));

        setScreenNamesList(activeRecords);
      } else {
        setScreenNamesList([]);

        showToast('error', 'Unable to fetch Screen Names');
      }
    } catch (error) {
      console.error('Error fetching Screen Names:', error);

      setScreenNamesList([]);

      showToast('error', 'Error fetching Screen Names');
    }
  };

  // GET ALL TOLERANCE MASTER
  const getAllToleranceMaster = async () => {
    try {
      const response = await apiCalls(
        'get',
        `businesscontroller/getAllToleranceMaster?branchCode=${encodeURIComponent(branchCode)}&orgid=${orgId}`
      );

      console.log('Tolerance Master List Response:', response);

      if (response?.status === true) {
        const records = response?.paramObjectsMap?.toleranceMasterVO || [];

        const formattedRecords = records.map((item) => ({
          ...item,
          active: isRecordActive(item.active) ? 'Active' : 'Inactive'
        }));

        setListViewData(formattedRecords);
      } else {
        setListViewData([]);

        showToast('error', response?.paramObjectsMap?.errorMessage || 'Unable to fetch Tolerance Master records');
      }
    } catch (error) {
      console.error('Error fetching Tolerance Master:', error);

      setListViewData([]);

      showToast('error', 'Error fetching Tolerance Master records');
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    getAllToleranceMaster();
    getAllScreenNames();
  }, []);

  // SCREEN NAME SELECTION
  const handleScreenChange = (e) => {
    const selectedScreenName = e.target.value;

    const selectedScreen = screenNamesList.find((item) => item.screenName === selectedScreenName);

    setFormData((prev) => ({
      ...prev,
      screenName: selectedScreen?.screenName || '',
      screenCode: selectedScreen?.screenCode || ''
    }));

    setFieldErrors((prev) => ({
      ...prev,
      screenName: '',
      screenCode: ''
    }));
  };

  // HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    // DECIMAL VALIDATION
    if (['lowerTolerance', 'upperTolerance', 'tolerance'].includes(name)) {
      if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      ...initialFormData
    });

    setFieldErrors({
      screenCode: '',
      screenName: '',
      lowerTolerance: '',
      upperTolerance: '',
      tolerance: ''
    });
  };

  // NEW ENTRY
  const handleNewEntry = () => {
    handleClear();
    setListView(false);
  };

  // LIST VIEW / FORM VIEW TOGGLE
  const handleView = async () => {
    if (!listView) {
      await getAllToleranceMaster();
      setListView(true);
    } else {
      setListView(false);
    }
  };

  // EDIT RECORD - GET BY ID
  const getToleranceMasterById = async (row) => {
    const id = row?.original?.toleranceid;

    if (!id) {
      showToast('error', 'Tolerance Master ID not found');
      return;
    }

    try {
      const response = await apiCalls('get', `businesscontroller/getToleranceMasterById?toleranceid=${id}`);

      console.log('Tolerance Master By ID Response:', response);

      if (response?.status === true) {
        const data = response?.paramObjectsMap?.toleranceMasterVO;

        if (!data) {
          showToast('error', 'Tolerance Master record not found');
          return;
        }

        setEditId(data.toleranceid);

        setFormData({
          screenCode: data.screenCode || '',
          screenName: data.screenName || '',
          active: isRecordActive(data.active),
          lowerTolerance: data.lowerTolerance ?? '',
          upperTolerance: data.upperTolerance ?? '',
          tolerance: data.tolerance ?? ''
        });

        setFieldErrors({
          screenCode: '',
          screenName: '',
          lowerTolerance: '',
          upperTolerance: '',
          tolerance: ''
        });

        setListView(false);
      } else {
        showToast('error', response?.paramObjectsMap?.errorMessage || 'Unable to fetch Tolerance Master record');
      }
    } catch (error) {
      console.error('Error fetching Tolerance Master by ID:', error);

      showToast('error', 'Error fetching Tolerance Master record');
    }
  };

  // VALIDATION
  const validateForm = () => {
    const errors = {};

    if (!formData.screenName.trim()) {
      errors.screenName = 'Screen Name is required';
    }

    if (!formData.screenCode.trim()) {
      errors.screenCode = 'Screen Code is required';
    }

    if (formData.lowerTolerance === '') {
      errors.lowerTolerance = 'Lower Tolerance is required';
    } else if (!Number.isFinite(Number(formData.lowerTolerance))) {
      errors.lowerTolerance = 'Enter a valid Lower Tolerance';
    }

    if (formData.upperTolerance === '') {
      errors.upperTolerance = 'Upper Tolerance is required';
    } else if (!Number.isFinite(Number(formData.upperTolerance))) {
      errors.upperTolerance = 'Enter a valid Upper Tolerance';
    }

    if (formData.tolerance === '') {
      errors.tolerance = 'Tolerance is required';
    } else if (!Number.isFinite(Number(formData.tolerance))) {
      errors.tolerance = 'Enter a valid Tolerance';
    }

    if (
      formData.lowerTolerance !== '' &&
      formData.upperTolerance !== '' &&
      Number(formData.lowerTolerance) > Number(formData.upperTolerance)
    ) {
      errors.lowerTolerance = 'Lower Tolerance cannot exceed Upper Tolerance';
    }

    setFieldErrors({
      screenCode: errors.screenCode || '',
      screenName: errors.screenName || '',
      lowerTolerance: errors.lowerTolerance || '',
      upperTolerance: errors.upperTolerance || '',
      tolerance: errors.tolerance || ''
    });

    return Object.keys(errors).length === 0;
  };

  // SAVE / UPDATE
  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    if (!orgId || !branchCode) {
      showToast('error', 'Organization ID or Branch Code is missing');
      return;
    }

    const saveData = {
      ...(editId ? { toleranceid: Number(editId) } : {}),

      active: formData.active,

      branch: branchName,
      branchCode: branchCode,

      cancel: false,

      createdBy: loginUserName || '',
      updatedBy: loginUserName || '',

      lowerTolerance: Number(formData.lowerTolerance),
      upperTolerance: Number(formData.upperTolerance),
      tolerance: Number(formData.tolerance),

      orgid: Number(orgId),

      screenCode: formData.screenCode.trim().toUpperCase(),
      screenName: formData.screenName.trim()
    };

    console.log('Tolerance Master Save Request:', saveData);

    try {
      const response = await apiCalls('post', 'businesscontroller/createUpdateToleranceMaster', saveData);

      console.log('Tolerance Master Save Response:', response);

      if (response?.status === true) {
        showToast('success', editId ? 'Tolerance Master Updated Successfully' : 'Tolerance Master Created Successfully');

        handleClear();

        await getAllToleranceMaster();
        await getAllScreenNames();
      } else {
        showToast(
          'error',
          response?.paramObjectsMap?.errorMessage || response?.errors?.[0]?.shortMessage || 'Tolerance Master Save Failed'
        );
      }
    } catch (error) {
      console.error('Error saving Tolerance Master:', error);

      showToast('error', error?.response?.data?.paramObjectsMap?.errorMessage || 'An error occurred while saving Tolerance Master');
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        {/* ACTION BUTTONS - VISIBLE IN BOTH VIEWS */}
        <div
          className="d-flex flex-wrap justify-content-end mb-4"
          style={{
            marginBottom: '20px',
            gap: '8px'
          }}
        >
          {/* NEW ENTRY BUTTON */}
          <ActionButton title="New Entry" icon={AddIcon} onClick={handleNewEntry} />

          {/* LIST VIEW / FORM VIEW BUTTON */}
          <ActionButton title={listView ? 'Form View' : 'List View'} icon={FormatListBulletedTwoToneIcon} onClick={handleView} />

          {/* CLEAR AND SAVE - ONLY FORM VIEW */}
          {!listView && (
            <>
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />

              <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            </>
          )}
        </div>

        {/* LIST VIEW */}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getToleranceMasterById} />
          </div>
        ) : (
          /* FORM VIEW */
          <div className="row d-flex ml">
            {/* SCREEN NAME DROPDOWN */}
            <div className="col-md-3 mb-3">
              <TextField
                select
                fullWidth
                size="small"
                name="screenName"
                label="Screen Name"
                value={formData.screenName}
                onChange={handleScreenChange}
                error={!!fieldErrors.screenName}
                helperText={fieldErrors.screenName}
              >
                {screenNamesList.map((item) => (
                  <MenuItem key={item.id || item.screenCode} value={item.screenName}>
                    {item.screenName}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* SCREEN CODE - DISABLED */}
            <div className="col-md-3 mb-3">
              <TextField
                fullWidth
                size="small"
                name="screenCode"
                label="Screen Code"
                value={formData.screenCode}
                disabled
                error={!!fieldErrors.screenCode}
                helperText={fieldErrors.screenCode}
              />
            </div>

            {/* LOWER TOLERANCE */}
            <div className="col-md-3 mb-3">
              <TextField
                fullWidth
                size="small"
                name="lowerTolerance"
                label="Lower Tolerance (LT)"
                value={formData.lowerTolerance}
                onChange={handleInputChange}
                inputProps={{ inputMode: 'decimal' }}
                error={!!fieldErrors.lowerTolerance}
                helperText={fieldErrors.lowerTolerance}
              />
            </div>

            {/* UPPER TOLERANCE */}
            <div className="col-md-3 mb-3">
              <TextField
                fullWidth
                size="small"
                name="upperTolerance"
                label="Upper Tolerance (UT)"
                value={formData.upperTolerance}
                onChange={handleInputChange}
                inputProps={{ inputMode: 'decimal' }}
                error={!!fieldErrors.upperTolerance}
                helperText={fieldErrors.upperTolerance}
              />
            </div>

            {/* TOLERANCE */}
            <div className="col-md-3 mb-3">
              <TextField
                fullWidth
                size="small"
                name="tolerance"
                label="Tolerance (TOL)"
                value={formData.tolerance}
                onChange={handleInputChange}
                inputProps={{ inputMode: 'decimal' }}
                error={!!fieldErrors.tolerance}
                helperText={fieldErrors.tolerance}
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
        )}
      </div>
    </>
  );
};

export default ToleranceMaster;
