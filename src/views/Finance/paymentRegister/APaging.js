import React from 'react';
import { FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
// check box
const APaging = () => {
  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: false,
    division: false,
    option: false,
    branchName: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  // input label
  const [formData, setFormData] = useState({
    partyName: 'All',
    date: null,
    division: 'All',
    option: 'All',
    branchName: 'All'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  // clear button
  const allClearData = () => {
    setFormData({ partyName: 'All', date: null, division: 'All', option: 'All', branchName: 'All' });
    setSelectedSections({ partyName: false, date: false, division: false, option: false, branchName: false });
  };

  // List View Headers:
  const reportColumns = [
    { accessorKey: 'partyName', header: 'Party Name', size: 110 },
    { accessorKey: 'docdate', header: 'Date', size: 90 },
    { accessorKey: 'division', header: 'Division', size: 120 },
    { accessorKey: 'option', header: 'Option', size: 110 },
    { accessorKey: 'branchName', header: 'Branch Name', size: 110 }
  ];

  const [listView, setListView] = useState(false);
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row">
          <div className="row">
            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.partyName} onChange={handleChange} name="partyName" color="secondary" />}
                label="Party Name"
              />
            </div>

            <div className="col-md-2  mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.date} onChange={handleChange} name="date" color="secondary" />}
                label="Date"
              />
            </div>

            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.division} onChange={handleChange} name="division" color="secondary" />}
                label="Division"
              />
            </div>

            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.option} onChange={handleChange} name="option" color="secondary" />}
                label="Option"
              />
            </div>

            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.branchName} onChange={handleChange} name="branchName" color="secondary" />}
                label="Branch Name"
              />
            </div>
          </div>
          {/*  */}

          {selectedSections.partyName && (
            <div className="col-md-3 mb-3">
              <FormControl size="small" variant="outlined" fullWidth>
                <InputLabel id="partyName-label">Party Name</InputLabel>
                <Select
                  labelId="partyName-label"
                  label="PartyName"
                  name="partyName"
                  onChange={handleInputChange}
                  value={formData.partyName}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="supply">Supply</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {selectedSections.date && (
            <div className="col-md-3 mb-3">
              <FormControl fullWidth variant="filled" size="small">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="As on Date"
                    slotProps={{
                      textField: { size: 'small', clearable: true }
                    }}
                    format="DD-MM-YYYY"
                    onChange={(date) => handleDateChange('date', date)}
                    value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                    clearable
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
          )}

          {selectedSections.division && (
            <div className="col-md-3 mb-3">
              <FormControl size="small" variant="outlined" fullWidth>
                <InputLabel id="division-label">Division</InputLabel>
                <Select labelId="division-label" label="Division" name="division" onChange={handleInputChange} value={formData.division}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="supply">Supply</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {selectedSections.option && (
            <div className="col-md-3 mb-3">
              <FormControl size="small" variant="outlined" fullWidth>
                <InputLabel id="option-label">Option</InputLabel>
                <Select labelId="option-label" label="Option" name="option" onChange={handleInputChange} value={formData.option}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="supply">Supply</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {selectedSections.branchName && (
            <div className="col-md-3 mb-3">
              <FormControl size="small" variant="outlined" fullWidth>
                <InputLabel id="branchName-label">Branch Name</InputLabel>
                <Select
                  labelId="branchName-label"
                  label="Branch Name"
                  name="branchName"
                  onChange={handleInputChange}
                  value={formData.branchName}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="supply">Supply</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {(selectedSections.partyName ||
            selectedSections.date ||
            selectedSections.division ||
            selectedSections.option ||
            selectedSections.branchName) && (
            <div className="col-md-3 mb-3">
              <div className="row d-flex ml">
                <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                  <ActionButton title="Search" icon={SearchIcon} />
                  <ActionButton title="Clear" icon={ClearIcon} onClick={allClearData} />
                </div>
              </div>
            </div>
          )}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default APaging;
