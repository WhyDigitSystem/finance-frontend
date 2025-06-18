import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Button from '@mui/material/Button';
import { style, width } from '@mui/system';
function ArOutstanding() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [partyNameList, setpartyNameList] = useState([]);
  const [branchList, setbranchList] = useState([]);
  const [optionList, setoptionList] = useState([]);
  const [divisionList, setdivisionList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    partyName: false,
    branch: false,
    dueDate: false,
    slab: false
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    partyName: false,
    branch: false,
    dueDate: false,
    slab: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };
  const handleProceed = () => {
    setVisibleSections({ ...selectedSections });
  };

  const [formData, setFormData] = useState({
    asOnDate: dayjs().format('YYYY-MM-DD'),
    partyName: 'All',
    branch: 'All',
    dueDate: null,
    slab1: '',
    slab2: '',
    slab3: '',
    slab4: '',
    slab5: '',
    slab6: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    asOnDate: '',
    partyName: '',
    branch: '',
    dueDate: '',
    slab: ''
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      asOnDate: dayjs().format('YYYY-MM-DD'),
      partyName: 'All',
      branch: 'All',
      dueDate: null,
      slab: ''
    });
    setFieldErrors({
      asOnDate: '',
      partyName: '',
      branch: '',
      dueDate: '',
      slab: ''
    });
    setRowData([]);
  };
  useEffect(() => {
    getAllBranches();
    getpartyName();
  }, []);
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setbranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getpartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
      setpartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleSelectAccountChange = (e) => {
    const value = e.target.value;
    console.log('Selected Account value:', value);

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
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    if (name === 'branch') {
      if (value === 'All') {
        setFormData((prevData) => ({
          ...prevData,
          branch: 'All'
        }));
      } else {
        const selectedBranch = branchList.find((br) => br.branch === value);
        setFormData((prevData) => ({
          ...prevData,
          branch: selectedBranch ? selectedBranch.branch : ''
        }));
      }
    } else {
      let inputValue = value;
      if (type === 'text' || type === 'textarea') {
        inputValue = value.toUpperCase();
      }
      setFormData((prevData) => ({ ...prevData, [name]: inputValue }));
    }
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('AR Outstanding');

    // Title Row
    sheet.mergeCells('A1', 'K1'); // Adjust column span as per total columns
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'AR Outstanding Report';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF34449B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.addRow([]);

    // Headers from reportColumns
    const headers = reportColumns.map(col => col.header);
    const keys = reportColumns.map(col => col.accessorKey);
    const headerRow = sheet.addRow(headers);

    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF34449B' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Add data rows
    // Add data rows with formatting
    rowData.forEach((item) => {
      const row = keys.map((key) => {
        const value = item[key];
        if (
          typeof value === 'string' &&
          value !== '' &&
          !isNaN(value) &&
          value.trim() !== ''
        ) {
          return Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
        return value ?? '';
      });

      const dataRow = sheet.addRow(row);

      dataRow.eachCell((cell, colNumber) => {
        const key = keys[colNumber - 1];
        const isTextColumn = key === 'subledgerName';

        cell.alignment = {
          horizontal: isTextColumn ? 'left' : 'right',
          vertical: 'middle',
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Auto-fit column widths
    sheet.columns.forEach(col => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) maxLength = cellValue.length;
      });
      col.width = maxLength + 5;
    });

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'AR_Outstanding_Report.xlsx');
  };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));

    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const reportColumns = [
    // { accessorKey: 'branch', header: 'Branch', size: 100 },
    {
      accessorKey: 'branch',
      header: 'Branch',
      size: 80,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '0px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    {
      accessorKey: 'subledgerCode',
      header: 'Customer Code',
      size: 80,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // { accessorKey: 'subledgerCode', header: 'Customer Code', size: 100 },
    {
      accessorKey: 'subledgerName',
      header: 'Customer',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // { accessorKey: 'subledgerName', header: 'Customer', size: 140 },
    {
      accessorKey: 'creditDays',
      header: 'Credit Days',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'center', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // { accessorKey: 'creditDays', header: 'Credit Days', size: 60 },
    {
      accessorKey: 'creditLimit',
      header: 'Credit Limit',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      size: 80,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // { accessorKey: 'currency', header: 'Currency', size: 70 },
    {
      accessorKey: 'outstanding',
      header: 'Outstanding',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // {
    //   accessorKey: 'outstanding',
    //   header: 'Outstanding',
    //   size: 90,
    //   Cell: ({ cell }) => (
    //     <div style={{ textAlign: 'right' }}>
    //       {cell.getValue() !== undefined && cell.getValue() !== null
    //         ? Number(cell.getValue()).toLocaleString('en-IN')
    //         : '-'}
    //     </div>
    //   ),
    //   muiTableHeadCellProps: { align: 'right' },
    // },
    {
      accessorKey: 'unadjusted',
      header: 'Unadjusted',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // {
    //   accessorKey: 'unadjusted',
    //   header: 'Unadjusted',
    //   size: 90,
    //   Cell: ({ cell }) => (
    //     <div style={{ textAlign: 'right' }}>
    //       {cell.getValue() !== undefined && cell.getValue() !== null
    //         ? Number(cell.getValue()).toLocaleString('en-IN')
    //         : '-'}
    //     </div>
    //   ),
    //   muiTableHeadCellProps: { align: 'right' },
    // },
    {
      accessorKey: 'amount',
      header: 'Total Due',
      size: 80,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      },
      muiTableBodyCellProps: {
        sx: {
          padding: '8px',
          backgroundColor: '#ffffff'
        }
      }
    },
    // {
    //   accessorKey: 'amount',
    //   header: 'Total Due',
    //   size: 90,
    //   Cell: ({ cell }) => (
    //     <div style={{ textAlign: 'right' }}>
    //       {cell.getValue() !== undefined && cell.getValue() !== null
    //         ? Number(cell.getValue()).toLocaleString('en-IN')
    //         : '-'}
    //     </div>
    //   ),
    //   muiTableHeadCellProps: { align: 'right' },
    // }
  ];
  const handleGo = async () => {
    const errors = {};
    // if (!formData.partyName) {
    //   errors.partyName = 'Sub ledger name is required';
    // }
    // if (!formData.branch) {
    //   errors.branch = 'Branch Code is required';
    // }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.dueDate) {
          response = await apiCalls(
            'get',
            `/arapAdjustments/GetArapAdjustments?Asondate=${formData.asOnDate}&branch=${formData.branch}&orgId=${orgId}&partyname=${formData.partyName}&finyear=${finYear}&pdate=${formData.dueDate}`
          );
        } else {
          response = await apiCalls(
            'get',
            `/arapAdjustments/GetArapAdjustments?Asondate=${formData.asOnDate}&partyname=${formData.partyName}&orgId=${orgId}&branch=${formData.branch}&finyear=${finYear}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.mapp || '');
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        {/* <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Search" icon={SearchIcon} isLoading={isLoading} onClick={handleGo} margin="0 10px 0 10px" />
          </div>
        </div> */}
        <>
          <div className="row">
            <div className="row">
              <div
                className="col-md-2
               mb-3"
              >
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedSections.partyName} onChange={handleCheckboxChange} name="partyName" color="secondary" />
                  }
                  label="Party Name"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.branch} onChange={handleCheckboxChange} name="branch" color="secondary" />}
                  label="Branch"
                />
              </div>
              <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.dueDate} onChange={handleCheckboxChange} name="dueDate" color="secondary" />}
                  label="Due Date"
                />
              </div>
              {/* <div className="col-md-2 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.slab} onChange={handleCheckboxChange} name="slab" color="secondary" />}
                  label="Slab"
                />
              </div> */}
              {/* <div className="col-md-2 mb-3">
                <Button
                  onClick={handleProceed}
                  color="secondary"
                  variant="contained"
                  style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}
                  disabled={isLoading}
                >
                  Proceed
                </Button>
              </div> */}
            </div>
            {selectedSections.date && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="As On Date"
                        value={formData.asOnDate ? dayjs(formData.asOnDate) : null}
                        onChange={(date) => handleDateChange('asOnDate', date)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!fieldErrors.asOnDate,
                            helperText: fieldErrors.asOnDate
                          }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </>
            )}
            {selectedSections.dueDate && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Due Date"
                        value={formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true, error: fieldErrors.dueDate, helperText: fieldErrors.dueDate }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </>
            )}
            {selectedSections.partyName && (
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
                  <InputLabel id="partyName-label">Party Name</InputLabel>
                  <Select
                    type="text"
                    labelId="partyName-label"
                    label="partyName"
                    value={formData.partyName}
                    onChange={handleSelectAccountChange}
                    name="partyName"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.partyName && <FormHelperText>{fieldErrors.partyName}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {selectedSections.branch && (
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select labelId="branch-label" label="branch" value={formData.branch} onChange={handleInputChange} name="branch">
                    <MenuItem value="All">All</MenuItem>
                    {branchList?.map((row) => (
                      <MenuItem key={row.id} value={row.branch}>
                        {row.branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {selectedSections.slab && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 1</span>}
                      name="slab1"
                      size="small"
                      value={formData.slab1}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 2</span>}
                      name="slab2"
                      size="small"
                      value={formData.slab2}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 3</span>}
                      name="slab3"
                      size="small"
                      value={formData.slab3}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 4</span>}
                      name="slab4"
                      size="small"
                      value={formData.slab4}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 5</span>}
                      name="slab5"
                      size="small"
                      value={formData.slab5}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small">
                    <TextField
                      label={<span>Slab 6</span>}
                      name="slab6"
                      size="small"
                      value={formData.slab6}
                    />
                  </FormControl>
                </div>
              </>
            )}
            {(selectedSections.date || selectedSections.partyName || selectedSections.branch || selectedSections.dueDate) && (
              <div className="col-md-3 mb-3">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName={'AR Outstanding'} sumFields={['outstanding', 'totaldue']} handleDownloadExcel={handleDownloadExcel} />
          </div>
        )}
      </div>
    </>
  );
}

export default ArOutstanding;
