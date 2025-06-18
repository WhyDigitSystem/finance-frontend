import React from 'react';
import { FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText } from '@mui/material';
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
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getAllActiveBranches } from 'utils/CommonFunctions';
// check box
const APaging = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [partyNameList, setpartyNameList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowData, setRowData] = useState([]);
  const [branchList, setbranchList] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true,
    slab: false,
    branch: false,
    // division: false,
    // option: false,
    // branchName: false
  });

  const capitalizeHeader = (text) => text.replace(/\b\w/g, char => char.toUpperCase());

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
    date: dayjs().format('YYYY-MM-DD'),
    branch: 'All',
    slab1: '',
    slab2: '',
    slab3: '',
    slab4: '',
    slab5: '',
    slab6: '',
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

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('AP Outstanding');

    // Title Row
    sheet.mergeCells('A1', 'K1'); // Adjust column span as per total columns
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'AP Outstanding Report';
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
    saveAs(blob, 'AP_Outstanding_Report.xlsx');
  };

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prev) => ({ ...prev, date: '' }));
  };

  const allClearData = () => {
    setFormData({ partyName: 'All', date: dayjs().format('YYYY-MM-DD'), branch: 'ALL' });
    setSelectedSections({ partyName: false, date: true });
    setFieldErrors({});
    setRowData([]);
  };

  useEffect(() => {
    getpartyName();
    getAllBranches();
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
        // const selectedBranch = branchList.find((br) => br.branch === value);
        // setFormData((prevData) => ({
        //   ...prevData,
        //   branch: selectedBranch ? selectedBranch.branch : ''
        // }));
      }
    } else {
      let inputValue = value;
      if (type === 'text' || type === 'textarea') {
        inputValue = value.toUpperCase();
      }
      setFormData((prevData) => ({ ...prevData, [name]: inputValue }));
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const reportColumns = [
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
      accessorKey: 'subledgerCode',
      header: 'Vendor Code',
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
    {
      accessorKey: 'subledgerName',
      header: 'Vendor',
      size: 120,
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
    {
      accessorKey: 'creditDays',
      header: 'Credit Days',
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
    {
      accessorKey: 'totaldue',
      header: 'Total Due',
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
          `/payable/getAPOutstanding?Asondate=${formData.date}&orgId=${orgId}&partyname=${formData.partyName}&branch=${formData.branch}&finyear=${finYear}`
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
            <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.branch} onChange={handleCheckboxChange} name="branch" color="secondary" />}
                label="Branch"
              />
            </div>
            {/* <div className="col-md-2 mb-3">
              <FormControlLabel
                control={<Checkbox checked={selectedSections.slab} onChange={handleChange} name="slab" color="secondary" />}
                label="Slab"
              />
            </div> */}

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
              <FormControl
                size="small"
                variant="outlined"
                fullWidth
                error={!!fieldErrors.partyName}
              >
                <InputLabel id="partyName-label">Party Name</InputLabel>
                <Select
                  labelId="partyName-label"
                  label="Party Name"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleSelectPartyName}
                  onBlur={() => {
                    if (!formData.partyName) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        partyName: "Party Name is required",
                      }));
                    }
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {partyNameList?.map((row) => (
                    <MenuItem key={row.id} value={row.partyName}>
                      {row.partyName}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.partyName && (
                  <FormHelperText>{fieldErrors.partyName}</FormHelperText>
                )}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                  />
                </FormControl>
              </div>
            </>
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
            <CommonReportTable data={rowData} columns={reportColumns} isListView={listView} fileName={'AP Outstanding'} sumFields={['outstanding', 'totaldue']} handleDownloadExcel={handleDownloadExcel} />
          </div>
        )}
      </div>
    </>
  );
};

export default APaging;
