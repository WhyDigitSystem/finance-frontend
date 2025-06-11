import React from 'react';
import { FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
// check box
const APaging = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [partyNameList, setpartyNameList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true
    // division: false,
    // option: false,
    // branchName: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));

    if (name === 'date' && checked) {
      const today = dayjs().format('YYYY-MM-DD');
      setFormData((prev) => ({
        ...prev,
        date: today
      }));
      setFieldErrors((prev) => ({
        ...prev,
        date: ''
      }));
    }
  };

  // input label
  const [formData, setFormData] = useState({
    partyName: 'All',
    date: dayjs().format('YYYY-MM-DD')
    // division: 'All',
    // option: 'All',
    // branchName: 'All'
  });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value
  //   }));
  // };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prev) => ({ ...prev, date: '' }));
  };

  const allClearData = () => {
    setFormData({ partyName: 'All', date: dayjs().format('YYYY-MM-DD') });
    setSelectedSections({ partyName: false, date: true });
    setFieldErrors({});
    setRowData([]);
  };

  useEffect(() => {
    getpartyName();
  }, []);

  const getpartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=VENDOR`);
      setpartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleSelectPartyName = (e) => {
    const value = e.target.value;
    if (value === 'All') {
      setFormData((prevData) => ({
        ...prevData,
        partyName: 'All'
      }));
    } else {
      const selectedEmp = partyNameList.find((emp) => emp.partyName === value);

      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          partyName: selectedEmp.partyName
        }));
      } else {
        console.log('No Account found with the given code:', value);
      }
    }
  };
  const reportColumns = [
    { accessorKey: 'subledgerCode', header: 'Vendor Code', size: 140 },
    { accessorKey: 'name', header: 'Vendor', size: 140 },
    { accessorKey: 'amount', header: 'Amount', size: 140 },
    { accessorKey: 'outstanding', header: 'Outstanding', size: 140 },
    { accessorKey: 'unadjusted', header: 'Unadjusted', size: 140 },
    { accessorKey: 'totalDue', header: 'Total Due', size: 140 },
    { accessorKey: 'mslab1', header: 'Below 30 Days', size: 140 },
    { accessorKey: 'mslab2', header: 'Days 30 - 60', size: 140 },
    { accessorKey: 'mslab3', header: 'Days 60 - 90', size: 140 },
    { accessorKey: 'mslab4', header: 'Days 90 - 120', size: 140 },
    { accessorKey: 'mslab5', header: 'Days 120+', size: 140 }
  ];

  const handleSearch = async () => {
    if (selectedSections.date && !formData.date) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        date: selectedSections.date && !formData.date ? 'Date is required' : ''
      }));
      return;
    } else {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `/payable/getAPOutstanding?Asondate=${formData.date}&orgId=${orgId}&partyname=${formData.partyName}`
        );
        // setpartyNameList(response.paramObjectsMap.APOutstanding);
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.APOutstanding);
          console.log(rowData);
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.APOutstanding.errorMessage || 'Report Fetch failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row">
          <div className="row">
            <div className="col-md-2  mb-3">
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

            {/* <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.division} onChange={handleChange} name="division" color="secondary" />}
                label="Division"
              />
            </div> */}

            {/* <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.option} onChange={handleChange} name="option" color="secondary" />}
                label="Option"
              />
            </div> */}

            {/* <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.branchName} onChange={handleChange} name="branchName" color="secondary" />}
                label="Branch Name"
              />
            </div> */}
          </div>
          {/*  */}

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
                  {partyNameList?.map((row) => (
                    <MenuItem key={row.id} value={row.partyName}>
                      {row.partyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {/* {selectedSections.division && (
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
          )} */}
          {/* 
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
          )} */}

          {/* {selectedSections.branchName && (
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
          )} */}

          {(selectedSections.partyName || selectedSections.date) && (
            // selectedSections.division ||
            // selectedSections.option ||
            // selectedSections.branchName
            <div className="col-md-3 mb-3">
              <div className="row d-flex ml">
                <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                  <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
                  <ActionButton title="Clear" icon={ClearIcon} onClick={allClearData} />
                </div>
              </div>
            </div>
          )}

          {/*  */}
        </div>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName={'AP Outstanding'} />
          </div>
        )}
      </div>
    </>
  );
};

export default APaging;
