import React from 'react';
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
  Avatar,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function LedgerReport() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [isLoading, setIsLoading] = useState(false);
  const [accountNameList, setAccountNameList] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logo, setLogo] = useState(null);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    accountName: false,
    branchCode: false,
  });
  const [headerFields, setHeaderFields] = useState([]);
  const [companyName, setCompanyName] = useState('');

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    accountName: 'All',
    branchCode: 'All',
    withDetails: 'YES',
  });

  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    accountName: '',
    branchCode: '',
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const [listViewData, setListViewData] = useState([]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setLogo(file);
    } else {
      showToast('error', 'Please upload a valid image (PNG or JPEG).');
    }
  };

  const handleClear = () => {
    setListView(false);
    setFormData({
      fromDate: null,
      toDate: null,
      accountName: 'All',
      branchCode: 'All',
      withDetails: 'YES',
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      accountName: '',
      branchCode: '',
    });
    setRowData([]);
    setHeaderFields([]);
  };

  useEffect(() => {
    getAllBranches();
    getAccountName();
    getCompanyDetails();
  }, []);

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const particularCompany = response.paramObjectsMap.companyVO[0];
        setListViewData(response.paramObjectsMap.companyVO.reverse());
        setCompanyName(particularCompany.companyName || '');

        // ✅ Process and store company logo as ArrayBuffer
        if (
          particularCompany.companyLogo &&
          particularCompany.companyLogo.startsWith('data:image')
        ) {
          const base64Data = particularCompany.companyLogo.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          setCompanyLogo(byteArray.buffer); // ✅ Set as ArrayBuffer
        }

        setFormData({
          ...formData,
          companyCode: particularCompany.companyCode,
          companyName: particularCompany.companyName
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      showToast('error', 'Failed to load branches');
    }
  };

  const getAccountName = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllGroupLedgerByOrgId?orgId=${orgId}`);
      if (response.status === true && response.paramObjectsMap?.groupLedgerVO) {
        setAccountNameList(response.paramObjectsMap.groupLedgerVO);
      }
    } catch (error) {
      console.error('Error fetching account names:', error);
      showToast('error', 'Failed to load account names');
    }
  };

  const handleSelectAccountChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      accountName: value,
    }));
  };

  const handleWithDetailsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      withDetails: e.target.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const reportColumns = [
    {
      accessorKey: 'Vid',
      header: 'Invoice No',
      size: 110,
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
      }
    },
    {
      accessorKey: 'Vdate',
      header: 'Invoice Date',
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return (
          <div style={{ textAlign: 'center', padding: '8px' }}>
            {value ? dayjs(value).format('DD-MM-YYYY') : '-'}
          </div>
        );
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
      accessorKey: 'PartyName',
      header: 'Particulars',
      size: 250,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', paddingLeft: '10px', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'left',
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
      accessorKey: 'ndAmount',
      header: 'Debit(INR)',
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
      accessorKey: 'NcAmount',
      header: 'Credit(INR)',
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
      accessorKey: 'Currency',
      header: 'Currency',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', padding: '8px' }}>
          {cell.getValue() || '-'}
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
      accessorKey: 'dbAmount',
      header: 'Debit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', color: '#d32f2f', fontWeight: '500', padding: '8px' }}>
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
      accessorKey: 'CrAmount',
      header: 'Credit',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', paddingRight: '20px', color: '#2e7d32', fontWeight: '500', padding: '8px' }}>
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
      accessorKey: 'Narration',
      header: 'Narration',
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'left', paddingLeft: '10px', padding: '8px' }}>
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'left',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
  ];

  const handleGo = async () => {
    const errors = {};

    if (!formData.fromDate) {
      errors.fromDate = 'From Date is required';
      showToast('error', errors.fromDate);
    }
    if (!formData.toDate) {
      errors.toDate = 'To Date is required';
      showToast('error', errors.toDate);
    }
    if (formData.fromDate && formData.toDate) {
      const fromDate = dayjs(formData.fromDate);
      const toDate = dayjs(formData.toDate);
      if (toDate.isBefore(fromDate)) {
        errors.toDate = 'To Date cannot be before From Date';
        showToast('error', errors.toDate);
      }
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        // Prepare parameters for API
        const params = {
          accountName: formData.accountName === 'All' ? '' : formData.accountName,
          branch: formData.branchCode === 'All' ? '' : formData.branchCode,
          details: formData.withDetails,
          finYear: finYear,
          fromdate: formData.fromDate,
          orgId: orgId,
          toDate: formData.toDate
        };

        // Build query string
        const queryString = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');

        const response = await apiCalls('get', `/master/getLedgerReport?${queryString}`);

        if (response.status === true) {
          const reportData = response.paramObjectsMap?.ledgerReport || [];

          // Map API fields to table columns
          const mappedData = reportData.map(item => ({
            Vid: item.voucherNumber || '',
            Vdate: item.voucherDate || '',
            PartyName: item.partyName || '',
            ndAmount: parseFloat(item.ndbAmnt) || 0,
            NcAmount: parseFloat(item.ncrAmnt) || 0,
            Currency: item.currency || '',
            dbAmount: parseFloat(item.dbAmnt) || 0,
            CrAmount: parseFloat(item.crAmnt) || 0,
            Narration: item.narration || '',
          }));

          // Set header fields dynamically
          const generatedBy = localStorage.getItem('userName') || 'Admin';
          const headers = [
            {
              // Combined date range value without a label
              value: formData.fromDate && formData.toDate
                ? `${dayjs(formData.fromDate).format('DD-MM-YYYY')} to ${dayjs(formData.toDate).format('DD-MM-YYYY')}`
                : ''
            },
            {
              label: "Account Name",
              value: formData.accountName !== 'All' ? formData.accountName : 'All'
            },
            {
              label: "Branch Code",
              value: formData.branchCode !== 'All' ? formData.branchCode : 'All'
            },
            {
              label: "With Details",
              value: formData.withDetails
            },
          ];

          setHeaderFields(headers);
          setRowData(mappedData);
          setListView(true);
          setOpenModal(true);
        } else {
          const errorMsg = response.paramObjectsMap?.errorMessage || 'Failed to fetch report data';
          showToast('error', errorMsg);
        }
      } catch (error) {
        console.error('API Error:', error);
        showToast('error', 'Failed to fetch report data');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Ledger Report');

    sheet.views = [{ state: 'frozen', ySplit: 12, activeCell: 'A13' }]; // Freeze after headers

    // ====== MERGE CELLS FOR IMAGE AND TITLE ======
    sheet.mergeCells('A1:B6'); // For Logo
    sheet.mergeCells('C1:I1'); // For Company Name
    sheet.mergeCells('A7:I7'); // For Report Title

    // ====== LOGO ======
    try {
      if (companyLogo) {
        const logoId = workbook.addImage({
          buffer: companyLogo,
          extension: 'png', // or 'jpeg'
        });

        sheet.addImage(logoId, {
          tl: { col: 0, row: 0 },
          ext: { width: 160, height: 80 },
        });
      } else {
        const logoPlaceholder = sheet.getCell('A1');
        logoPlaceholder.value = 'Company Logo';
        logoPlaceholder.font = { bold: true, color: { argb: 'FF34449B' } };
        logoPlaceholder.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    } catch (err) {
      console.error('Error adding logo to Excel:', err);
    }

    // ====== COMPANY NAME ======
    const companyCell = sheet.getCell('C1');
    companyCell.value = companyName || 'Company Name';
    companyCell.font = { size: 16, bold: true, color: { argb: 'FF34449B' } };
    companyCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // ====== REPORT TITLE ======
    const titleCell = sheet.getCell('A7');
    titleCell.value = 'LEDGER REPORT';
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF34449B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // ====== HEADER INFORMATION ======
    const headers = [
      { label: 'From Date', value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : '' },
      { label: 'To Date', value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : '' },
      { label: 'Account Name', value: formData.accountName !== 'All' ? formData.accountName : 'All' },
      { label: 'Branch Code', value: formData.branchCode !== 'All' ? formData.branchCode : 'All' },
      { label: 'With Details', value: formData.withDetails },
      { label: 'Generated By', value: localStorage.getItem('userName') || 'Admin' },
      { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
    ];

    for (let i = 0; i < headers.length; i += 2) {
      const rowIndex = Math.floor(i / 2) + 8; // Start from row 8 (after title)
      const row = sheet.getRow(rowIndex);

      const labelCell1 = row.getCell(1);
      const valueCell1 = row.getCell(2);
      labelCell1.value = headers[i].label;
      labelCell1.font = { bold: true };
      valueCell1.value = headers[i].value;

      if (headers[i + 1]) {
        const labelCell2 = row.getCell(5);
        const valueCell2 = row.getCell(6);
        labelCell2.value = headers[i + 1].label;
        labelCell2.font = { bold: true };
        valueCell2.value = headers[i + 1].value;
      }
    }

    // ====== TABLE HEADERS ======
    const headerRow = sheet.getRow(12); // Row 12 (after header info)
    reportColumns.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = col.header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF34449B' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 20;

    // ====== DATA ROWS ======
    rowData.forEach((item) => {
      const row = sheet.addRow([
        item.Vid || '-',
        item.Vdate ? dayjs(item.Vdate).format('DD-MM-YYYY') : '-',
        item.PartyName || '-',
        item.ndAmount,
        item.NcAmount,
        item.Currency || '-',
        item.dbAmount,
        item.CrAmount,
        item.Narration || '-'
      ]);

      [3, 4, 6, 7].forEach(colIdx => {
        const cell = row.getCell(colIdx + 1);
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        }
      });

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // ====== COLUMN WIDTHS ======
    sheet.columns = [
      { width: 15 },
      { width: 15 },
      { width: 40 },
      { width: 15 },
      { width: 15 },
      { width: 12 },
      { width: 15 },
      { width: 15 },
      { width: 40 }
    ];

    // ====== DOWNLOAD EXCEL ======
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `Ledger_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  // Common table options
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
    },
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
      <div className="row">
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox
                checked={selectedSections.accountName}
                onChange={handleCheckboxChange}
                name="accountName"
                color="secondary"
              />}
              label="Account Name"
            />
          </div>
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox
                checked={selectedSections.branchCode}
                onChange={handleCheckboxChange}
                name="branchCode"
                color="secondary"
              />}
              label="Branch Code"
            />
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl fullWidth variant="filled" size="small">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={formData.fromDate ? dayjs(formData.fromDate, 'YYYY-MM-DD') : null}
                onChange={(date) => handleDateChange('fromDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldErrors.fromDate,
                    helperText: fieldErrors.fromDate
                  }
                }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl fullWidth variant="filled" size="small">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={formData.toDate ? dayjs(formData.toDate, 'YYYY-MM-DD') : null}
                onChange={(date) => handleDateChange('toDate', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldErrors.toDate,
                    helperText: fieldErrors.toDate
                  }
                }}
                format="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </FormControl>
        </div>

        <div className="col-md-3 mb-3">
          <FormControl size="small" variant="outlined" fullWidth>
            <InputLabel id="withDetails-label">With Details</InputLabel>
            <Select
              labelId="withDetails-label"
              label="With Details"
              value={formData.withDetails}
              onChange={handleWithDetailsChange}
              name="withDetails"
            >
              <MenuItem value="YES">Yes</MenuItem>
              <MenuItem value="NO">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {selectedSections.accountName && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="accountName-label">Account Name</InputLabel>
              <Select
                labelId="accountName-label"
                label="Account Name"
                value={formData.accountName}
                onChange={handleSelectAccountChange}
                name="accountName"
              >
                <MenuItem value="All">All</MenuItem>
                {accountNameList.map((account) => (
                  <MenuItem key={account.id} value={account.accountGroupName}>
                    {account.accountGroupName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {selectedSections.branchCode && (
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel id="branchCode-label">Branch Code</InputLabel>
              <Select
                labelId="branchCode-label"
                label="Branch Code"
                value={formData.branchCode}
                onChange={handleInputChange}
                name="branchCode"
              >
                <MenuItem value="All">All</MenuItem>
                {branchCodeList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.branchCode}>
                    {branch.branchCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        <div className="col-md-3">
          <div className="d-flex flex-wrap justify-content-start mt-1">
            <ActionButton
              title="Search"
              icon={SearchIcon}
              onClick={handleGo}
              isLoading={isLoading}
              disabled={isLoading}
            />
            <ActionButton
              title="Clear"
              icon={ClearIcon}
              onClick={handleClear}
            />
          </div>
        </div>
      </div>

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
        <DialogTitle sx={{
          m: 0,
          p: 0,
          px: 3,
          backgroundColor: '#34449B',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Ledger Report</span>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={"Ledger Report"}
            tableOptions={tableOptions}
            handleDownloadExcel={handleDownloadExcel}
            headerFields={headerFields}
          />
        </DialogContent>
      </Dialog>

      {listView && (
        <div className="mt-4">
          <CommonReportTable
            data={rowData}
            columns={reportColumns}
            fileName={"Ledger Report"}
            isListView={true}
            handleDownloadExcel={handleDownloadExcel}
            tableOptions={{
              ...tableOptions,
              muiTableContainerProps: { sx: { maxHeight: '60vh' } }
            }}
            headerFields={headerFields}
          />
        </div>
      )}
    </div>
  )
}

export default LedgerReport;