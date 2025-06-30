import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Paper,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ArAging = () => {
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [partyNameList, setPartyNameList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowData, setRowData] = useState([]);
  const [branchNameList, setBranchNameList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [formData, setFormData] = useState({
    partyName: 'All',
    date: dayjs().format('YYYY-MM-DD'),
    branchCode: 'All',
    base: 'Yes'
  });

  const [selectedSections, setSelectedSections] = useState({
    partyName: false,
    date: true,
    branchCode: false,
    base: false
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
    setFormData({
      partyName: 'All',
      date: dayjs().format('YYYY-MM-DD'),
      branchCode: 'All',
      base: 'Yes'
    });
    setSelectedSections({
      partyName: false,
      date: true,
      branchCode: false,
      base: false
    });
    setFieldErrors({});
    setListView(false);
    setRowData([]);
    setOpenModal(false);
  };

  useEffect(() => {
    getPartyName();
    getAllBranches();
  }, []);

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO || []);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchNameList(branchData);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      showToast('error', 'Failed to load branches');
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const queryParams = new URLSearchParams({
        asOnDate: formData.date,
        base: formData.base,
        branch: formData.branchCode,
        orgId,
        partyName: formData.partyName
      });
      // if (selectedSections.branchCode && formData.branchCode !== 'All') {
      //   queryParams.append('branchCode', formData.branchCode);
      // }
      const response = await apiCalls('get', `/reportController/getARAgeingReport?${queryParams.toString()}`);
      if (response.status === true) {
        setRowData(response.paramObjectsMap.rimReportFillGrid || []);
        setHeaderFields([
          {
            label: 'As on Date',
            value: formData.date ? dayjs(formData.date).format('DD-MM-YYYY') : ''
          },
          {
            label: 'Party Name',
            value: formData.partyName
          },
          {
            label: 'Branch Name',
            value: formData.branchCode
          }
        ]);
        setListView(true);
        setOpenModal(true);
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
    {
      accessorKey: 'docId',
      header: 'Doc No',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'center', padding: '8px' }}>{cell.getValue() || ''}</div>,
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'docDate',
      header: 'Invoice Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return <div style={{ textAlign: 'center', paddingRight: '8px' }}>{value ? dayjs(value).format('DD-MM-YYYY') : ''}</div>;
      },
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return <div style={{ textAlign: 'center', padding: '8px' }}>{value ? dayjs(value).format('DD-MM-YYYY') : ''}</div>;
      },
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'amount',
      header: 'Inv Amt',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'outstanding',
      header: 'Outstanding',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'totalDue',
      header: 'Total Due',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'mSlab1',
      header: 'Below 30 Days',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'mSlab2',
      header: 'Days 31-60',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'mSlab3',
      header: 'Days 61-90',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'mSlab4',
      header: 'Days 91-120',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'mSlab5',
      header: 'Days 121+',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    }
  ];

  const tableOptions = {
    muiTablePaperProps: {
      sx: {
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    muiTableContainerProps: {
      sx: { maxHeight: '70vh' }
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
        '&:hover': { backgroundColor: '#f0f7ff' }
      }
    }),
    enableStickyHeader: true,
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid #e0e0e0 !important'
        }
      }
    }
  };
  const getLogo = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      return response.paramObjectsMap.companyVO[0]?.companyLogo || null;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
    }
  };
const handleDownloadExcel = async () => {
  const logoBase64 = await getLogo();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('AR Ageing Report');

  let startRow = 1;

  // Add Logo if available
  if (logoBase64) {
    try {
      const logoId = workbook.addImage({
        base64: logoBase64,
        extension: 'png',
      });

      // Neatly position the logo
      sheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 100, height: 50 },
      });

      // Add padding row below logo
      sheet.getRow(1).height = 40;
      startRow = 2;
    } catch (logoError) {
      console.error('Error adding logo:', logoError);
    }
  }

  // Title Row
  const titleRowIndex = startRow;
  sheet.mergeCells(`A${titleRowIndex}:L${titleRowIndex}`);
  const titleCell = sheet.getCell(`A${titleRowIndex}`);
  titleCell.value = 'Accounts Receivable Ageing Report';
  titleCell.font = { size: 16, bold: true, color: { argb: 'FF34449B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(titleRowIndex).height = 24;

  // Header Info (parameters)
  const headerInfo = [
    ...headerFields,
    { label: 'Generated By', value: localStorage.getItem('userName') || 'Admin' },
    { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
  ];

  const infoStartRow = titleRowIndex + 1;

  for (let i = 0; i < headerInfo.length; i += 2) {
    const rowIndex = infoStartRow + i / 2;
    const row = sheet.getRow(rowIndex);

    row.getCell(1).value = headerInfo[i].label + ':';
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = headerInfo[i].value;

    if (headerInfo[i + 1]) {
      row.getCell(4).value = headerInfo[i + 1].label + ':';
      row.getCell(4).font = { bold: true };
      row.getCell(5).value = headerInfo[i + 1].value;
    }
  }

  const dataStartRow = infoStartRow + Math.ceil(headerInfo.length / 2) + 1;

  // Column Headers
  const headers = [
    'Invoice No',
    'Invoice Date',
    'Due Date',
    'Inv Amt',
    'Outstanding',
    'Total Due',
    'Unadjusted',
    'Below 30 Days',
    'Days 31-60',
    'Days 61-90',
    'Days 91-120',
    'Days 121+'
  ];

  const headerRow = sheet.getRow(dataStartRow);
  headerRow.values = headers;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34449B' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Data Rows
  rowData.forEach((item, index) => {
    const row = sheet.getRow(dataStartRow + 1 + index);

    row.values = [
      item.docId || '-',
      item.docDate ? dayjs(item.docDate).format('DD-MM-YYYY') : '-',
      item.dueDate ? dayjs(item.dueDate).format('DD-MM-YYYY') : '-',
      item.amount ?? 0,
      item.outstanding ?? 0,
      item.totalDue ?? 0,
      item.unadjusted ?? 0,
      item.mSlab1 ?? 0,
      item.mSlab2 ?? 0,
      item.mSlab3 ?? 0,
      item.mSlab4 ?? 0,
      item.mSlab5 ?? 0
    ];

    // Format numeric columns
    for (let col = 4; col <= 12; col++) {
      const cell = row.getCell(col);
      cell.numFmt = '#,##,##0.00';
      cell.alignment = { horizontal: 'right' };
    }

    // Border & alternate background
    const bgColor = index % 2 === 0 ? 'FFF3F4F6' : 'FFFFFFFF'; // Zebra effect
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Set Column Widths
  const widths = [20, 15, 15, 12, 14, 14, 12, 12, 12, 12, 12, 12];
  widths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });

  // Optional: Freeze header
  sheet.views = [{ state: 'frozen', ySplit: dataStartRow }];

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `AR_Ageing_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
};
  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
      <div className="row">
        {/* Section checkboxes */}
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
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.branchCode} onChange={handleChange} name="branchCode" color="secondary" />}
              label="Branch Name"
            />
          </div>
          <div className="col-md-2 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedSections.base} onChange={handleChange} name="base" color="secondary" />}
              label="Base"
            />
          </div>
        </div>

        {/* Date Picker */}
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

        {/* Party Name Dropdown */}
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

        {/* Branch Name Dropdown */}
        {selectedSections.branchCode && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="branchCode-label">Branch Name</InputLabel>
              <Select
                labelId="branchCode-label"
                label="Branch Name"
                value={formData.branchCode}
                onChange={handleInputChange}
                name="branchCode"
              >
                <MenuItem value="All">All</MenuItem>
                {branchNameList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.branch}>
                    {branch.branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {selectedSections.base && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="base-label">Base</InputLabel>
              <Select labelId="base-label" label="Base" value={formData.base} onChange={handleInputChange} name="base">
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        {/* Action Buttons */}
        {(selectedSections.partyName || selectedSections.date || selectedSections.branchCode) && (
          <div className="col-md-3 mb-3">
            <div className="row d-flex ml">
              <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
                <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
                <ActionButton title="Clear" icon={ClearIcon} onClick={allClearData} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog for popup */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xl"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 1,
            backgroundColor: '#34449B',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Accounts Receivable Ageing Report</span>
          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={'AP Ageing Report'}
            tableOptions={tableOptions}
            handleDownloadExcel={handleDownloadExcel}
            headerFields={headerFields}
          // sumFields={['amount', 'outstanding', 'totaldue']}
          />
        </DialogContent>
      </Dialog>

      {listView && (
        <div className="mt-4">
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={'AP Ageing Report'}
            isListView={true}
            handleDownloadExcel={handleDownloadExcel}
            tableOptions={{
              ...tableOptions,
              muiTableContainerProps: { sx: { maxHeight: '60vh' } }
            }}
            headerFields={headerFields}
          // sumFields={['amount', 'outstanding', 'totaldue',]}
          />
        </div>
      )}
    </div>
  );
};

export default ArAging;
