import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';

const APaging = () => {
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowData, setRowData] = useState([]);
  const [formData, setFormData] = useState({
    partyName: 'All',
    date: dayjs().format('YYYY-MM-DD')
  });

  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSections((prev) => ({ ...prev, [name]: checked }));

    if (name === 'date' && checked) {
      const today = dayjs().format('YYYY-MM-DD');
      setFormData((prev) => ({ ...prev, date: today }));
      setFieldErrors((prev) => ({ ...prev, date: '' }));
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prev) => ({ ...prev, [field]: formattedDate }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const allClearData = () => {
    setFormData({ partyName: 'All', date: dayjs().format('YYYY-MM-DD') });
    setSelectedSections({ partyName: false, date: true });
    setFieldErrors({});
    setListView(false);
    setRowData([]);
  };

  useEffect(() => {
    getPartyName();
  }, []);

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO || []);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };

  const handleSelectPartyName = (e) => {
    const value = e.target.value;
    if (value === 'All') {
      setFormData((prev) => ({ ...prev, partyName: 'All' }));
    } else {
      const selected = partyNameList.find((item) => item.partyName === value);
      if (selected) {
        setFormData((prev) => ({ ...prev, partyName: selected.partyName }));
      }
    }
  };

  const handleSearch = async () => {
    if (selectedSections.date && !formData.date) {
      setFieldErrors((prev) => ({
        ...prev,
        date: 'Date is required'
      }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCalls(
        'get',
        `/payable/getAPAgeing?Asondate=${formData.date}&orgId=${orgId}&partyname=${formData.partyName}`
      );

      if (response.status === true) {
        setRowData(response.paramObjectsMap.mapp || []);
        setListView(true);
      } else {
        showToast('error', response.paramObjectsMap.getAPAgeing?.errorMessage || 'Report Fetch failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Report Fetch failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reportColumns = [
    { accessorKey: 'docid', header: 'Cost Inv. No', size: 140 },
    { accessorKey: 'docdate', header: 'Cost Inv. Date', size: 140 },
    { accessorKey: 'amount', header: 'Cost Inv. Amount', size: 140 },
    { accessorKey: 'outstanding', header: 'Outstanding', size: 140 },
    { accessorKey: 'totaldue', header: 'Total Due', size: 140 },
    { accessorKey: 'unadjusted', header: 'Unadjusted', size: 140 },
    { accessorKey: 'mslab1', header: 'Below 30 Days', size: 140 },
    { accessorKey: 'mslab2', header: 'Days 30 - 60', size: 140 },
    { accessorKey: 'mslab3', header: 'Days 60 - 90', size: 140 },
    { accessorKey: 'mslab4', header: 'Days 90 - 120', size: 140 },
    { accessorKey: 'mslab5', header: 'Days 120+', size: 140 }
  ];

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
      <div className="row">
        <div className="row">
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.date} onChange={handleChange} name="date" color="secondary" />}
              label="Date"
            />
          </div>

          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.partyName} onChange={handleChange} name="partyName" color="secondary" />}
              label="Party Name"
            />
          </div>
        </div>

        {selectedSections.date && (
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="As on Date"
                  format="DD-MM-YYYY"
                  onChange={(date) => handleDateChange('date', date)}
                  value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                  slotProps={{
                    textField: {
                      size: 'small',
                      clearable: true,
                      error: !!fieldErrors.date,
                      helperText: fieldErrors.date
                    }
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
        )}

        {selectedSections.partyName && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="partyName-label">Party Name</InputLabel>
              <Select
                labelId="partyName-label"
                label="PartyName"
                name="partyName"
                onChange={handleSelectPartyName}
                value={formData.partyName}
              >
                <MenuItem value="All">All</MenuItem>
                {partyNameList.map((row) => (
                  <MenuItem key={row.id} value={row.partyName}>
                    {row.partyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {(selectedSections.partyName || selectedSections.date) && (
          <div className="col-md-3 mb-3">
            <div className="row d-flex ml">
              <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
                <ActionButton title="Clear" icon={ClearIcon} onClick={allClearData} />
              </div>
            </div>
          </div>
        )}
      </div>

      {listView && (
        <div className="mt-4">
          <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName="AP Outstanding" />
        </div>
      )}
    </div>
  );
};

export default APaging;
