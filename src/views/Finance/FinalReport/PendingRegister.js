import React, { useState, useEffect } from 'react';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import { FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const PendingRegister = () => {
  const [partyTypeList, setPartyTypeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));

  const [formData, setFormData] = useState({
    partyType: 'All',
    partyName: 'All',
    screenCodes: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    partyType: '',
    partyName: '',
    screenCodes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleClear = () => {
    setFormData({
      partyType: 'All',
      partyName: 'All',
      screenCodes: ''
    });
    setPartyNameList([]);
  };

  useEffect(() => {
    getAllPartyMasterByOrgId();
  }, []);

  useEffect(() => {
    if (formData.partyType && formData.partyType !== 'All') {
      getPartyName();
    } else {
      setPartyNameList([{ id: 0, partyName: 'All' }]);
    }
  }, [formData.partyType]);

  const getAllPartyMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllPartyTypeByOrgId?orgid=${orgId}`);
      const partyTypes = result.paramObjectsMap.partyTypeVO || [];
      setPartyTypeList([{ id: 0, partyType: 'All' }, ...partyTypes]);
    } catch (err) {
      console.error('Error fetching party types:', err);
    }
  };

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${formData.partyType}`);
      const partyNames = response.paramObjectsMap.partyMasterVO || [];
      setPartyNameList([{ id: 0, partyName: 'All' }, ...partyNames]);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };

  const handleGo = async () => {
    const { partyType, partyName, screenCodes } = formData;
    try {
      const response = await apiCalls(
        'get',
        `arapAdjustments/GetPendingRegisterDetails?orgId=${orgId}&PartyName=${partyName}&Partytype=${partyType}&ScreenName=${screenCodes}`
      );
      console.log('Response:', response);
      showToast('success', 'Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Error fetching data');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row mb-2">
          {/* Party Type */}
          <div className="col-md-4 mb-1">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyType}>
              <InputLabel id="partyType-label">Party Type</InputLabel>
              <Select labelId="partyType-label" label="Party Type" value={formData.partyType} onChange={handleInputChange} name="partyType">
                {partyTypeList.map((row) => (
                  <MenuItem key={row.id} value={row.partyType}>
                    {row.partyType}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
            </FormControl>
          </div>

          {/* Party Name */}
          <div className="col-md-4 mb-1">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
              <InputLabel id="partyName-label">Party Name</InputLabel>
              <Select labelId="partyName-label" label="Party Name" value={formData.partyName} onChange={handleInputChange} name="partyName">
                {partyNameList.map((row) => (
                  <MenuItem key={row.id} value={row.partyName}>
                    {row.partyName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.partyName && <FormHelperText>{fieldErrors.partyName}</FormHelperText>}
            </FormControl>
          </div>

          {/* Buttons */}
          <div className="col-md-3 mb-2">
            <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
              <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            </div>
          </div>
        </div>
        {/*  */}

        {/*  */}
      </div>
    </>
  );
};

export default PendingRegister;
