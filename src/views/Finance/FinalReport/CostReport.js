import React, { useEffect, useState } from 'react';
import {
  TextField,
  Checkbox,
  Box,
  Typography,
  Button,
  FormControlLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle
} from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import FileDownload from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import CommonReportTableGrouped from '../../../utils/CommonReportTableGrouped';
import ActionButton from 'utils/ActionButton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function CostReport() {
  const [userName] = useState(localStorage.getItem('userName'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [logo, setLogo] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  useEffect(() => {
    getPartyName();
    getAllBranches();
  }, []);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    vendor: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSections((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    branchCode: 'All',
    vendor: 'All',
    viewMode: 'details'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    vendor: ''
  });
  const handleClear = () => {
    setFormData({
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      vendor: 'All',
      viewMode: 'details'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      vendor: '',
      branchCode: ''
    });
    setSelectedSections({});
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
    if (value === 'All') {
      setFormData((prevData) => ({
        ...prevData,
        vendor: 'All'
      }));
    } else {
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          vendor: selectedEmp.partyName
        }));
      } else {
        console.log('No party found with the given code:', value);
      }
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
    if (name === 'branchCode') {
      if (value === 'All') {
        setFormData((prevData) => ({
          ...prevData,
          branchCode: 'All'
        }));
      } else {
        const selectedBranch = branchCodeList.find((br) => br.branchCode === value);
        setFormData((prevData) => ({
          ...prevData,
          branchCode: selectedBranch ? selectedBranch.branchCode : ''
        }));
      }
    } else {
      let inputValue = value;
      if (type === 'text' || type === 'textarea') {
        inputValue = value.toUpperCase();
      }
      setFormData((prevData) => ({ ...prevData, [name]: inputValue }));

      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    setFieldErrors((prevData) => ({
      ...prevData,
      [field]: ''
    }));
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
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
  const handleGo = async () => {
    const errors = {};
    if (selectedSections.date) {
      if (!formData.toDate) {
        errors.toDate = 'To Date is required';
      }
      if (!formData.fromDate) {
        errors.fromDate = 'From Date is required';
      }
    }
    if (selectedSections.branchCode) {
      if (!formData.branchCode) {
        errors.branchCode = 'Branch is required';
      }
    }
    if (selectedSections.vendor) {
      if (!formData.vendor) {
        errors.vendor = 'Vendor name is required';
      }
    }
    console.log('go error', errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/costInvoice/getCostInvoiceSummaryDetails?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyName=${formData.vendor}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/costInvoice/getCostInvoiceSummaryDetails?branchCode=${formData.branchCode}&orgId=${orgId}&partyName=${formData.vendor}&finYear=${finYear}`
            );
          }
        } else {
          if (selectedSections.date) {
            response = await apiCalls(
              'get',
              `/costInvoice/getCostInvoiceSummary?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&finYear=${finYear}&orgId=${orgId}&partyName=${formData.vendor}&toDate=${formData.toDate}`
            );
          } else {
            response = await apiCalls(
              'get',
              `/costInvoice/getCostInvoiceSummary?branchCode=${formData.branchCode}&orgId=${orgId}&partyName=${formData.vendor}&finYear=${finYear}`
            );
          }
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.cost || []);
          setIsLoading(false);
          setOpen(true);
          const newHeaderFields = [];
          if (selectedSections.date) {
            newHeaderFields.push({
              label: 'Date Range',
              value: `${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`
            });
          }
          // if (selectedSections.branchCode) {
          newHeaderFields.push({
            label: 'Branch',
            value: formData.branchCode
          });
          // }
          // if (selectedSections.customer) {
          newHeaderFields.push({
            label: 'Vendor',
            value: formData.vendor
          });
          // }
          setHeaderFields(newHeaderFields);
        } else {
          showToast('error', response.paramObjectsMap.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', rowData.paramObjectsMap.message);
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD-MM-YYYY');
  };

  const getColumns = () => {
    return formData.viewMode === 'details'
      ? [
          { accessorKey: 'docId', header: 'Doc ID', size: 80 },
          { accessorKey: 'docDate', header: 'Date', size: 80 },
          { accessorKey: 'vId', header: 'Invoice No', size: 80 },
          { accessorKey: 'vDate', header: 'Invoice Date', size: 120 },
          { accessorKey: 'supplierName', header: 'Vendor', size: 120 },
          { accessorKey: 'jobNo', header: 'Job No', size: 80 },
          // { accessorKey: 'gstType', header: 'Tax Type', size: 80 },
          { accessorKey: 'ledger', header: 'Ledger', size: 80 },
          { accessorKey: 'chargerName', header: 'Charge Name', size: 80 },
          { accessorKey: 'chargeCode', header: 'Charge Code', size: 80 },
          { accessorKey: 'gstPercentage', header: 'Tax %', size: 80 },
          // { accessorKey: 'totalTds', header: 'Tds ', size: 80 },
          {
            accessorKey: 'qty',
            header: 'Qty',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'rate',
            header: 'Rate',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'lcAmt',
            header: 'Bill Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'gst',
            header: 'Tax Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'totalTds',
            header: 'Tds Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'netAmount',
            header: 'Total Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          }
        ]
      : [
          { accessorKey: 'docId', header: 'Doc Id', size: 100 },
          { accessorKey: 'docDate', header: 'Date', size: 100 },
          { accessorKey: 'vId', header: 'Invoice No', size: 100 },
          { accessorKey: 'vDate', header: 'Date', size: 100 },
          { accessorKey: 'supplierName', header: 'Vendor', size: 200 },
          // { accessorKey: 'gstType', header: 'Tax Type', size: 100 },
          {
            accessorKey: 'totChargeLcAmt',
            header: 'Bill Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'gstAmount',
            header: 'Tax Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'red' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'tdsAmount',
            header: 'Tds Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          },
          {
            accessorKey: 'totalAmount',
            header: 'Total Amt',
            size: 80,
            Cell: ({ cell }) => (
              <div style={{ textAlign: 'right', width: '100%', color: 'green' }}>
                {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
              </div>
            ),
            muiTableHeadCellProps: {
              align: 'right'
            }
          }
        ];
  };

  const getSumFields = () => {
    return formData.viewMode === 'details' ? ['lcAmt', 'gst', 'netAmount'] : ['totChargeLcAmt', 'gstAmount', 'tdsAmount', 'totalAmount'];
  };
  const handleDownloadExcel = async () => {
    try {
      const logoBase64 = await getLogo();
      const workbook = new ExcelJS.Workbook();
      const reportType = formData.viewMode === 'details' ? 'Detailed Cost Report' : 'Summary Cost Report';

      const sheet = workbook.addWorksheet(reportType);
      let currentRow = 1;

      // Add logo if available
      if (logoBase64) {
        try {
          const logoId = workbook.addImage({
            base64: logoBase64,
            extension: 'png'
          });
          sheet.mergeCells('A1:A2');
          // No merging — place and size logo in A1 neatly
          sheet.addImage(logoId, {
            tl: { col: 0, row: 0 }, // top-left corner
            ext: { width: 90, height: 50 } // Logo size: adjust to your needs
          });

          // Optional: set row height and column width for better fit
          sheet.getRow(1).height = 28; // 20-30 is good
          sheet.getColumn(1).width = 18; // Only Column A (index 1)
        } catch (logoError) {
          console.error('Error adding logo:', logoError);
        }
      }
      sheet.mergeCells('B1:P1');
      // Company Name (Row 1, centered)
      const companyCell = sheet.getCell('B1');
      companyCell.value = companyName;
      companyCell.font = { bold: true, size: 14, color: { argb: '1F4E78' } };
      companyCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      sheet.mergeCells('B2:P2');
      // Report Title (Row 2, centered)
      const titleCell = sheet.getCell('B2');
      titleCell.value = reportType;
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      currentRow = 3;
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      // New parameters section
      const parameters = [];
      if (selectedSections.date) {
        parameters.push(`Date Range: ${formatDate(formData.fromDate)} to ${formatDate(formData.toDate)}`);
      }
      if (formData.branchCode) parameters.push(`Branch: ${formData.branchCode}`);
      if (formData.vendor) parameters.push(`Vendor: ${formData.vendor}`);

      if (parameters.length > 0) {
        //  Parameters heading
        // const paramHeading = sheet.addRow(['Report Parameters']);
        // paramHeading.font = { bold: true, color: { argb: '1F4E78' } };
        sheet.mergeCells(`A${currentRow}:Q${currentRow}`);
        currentRow++;

        // Parameters values
        const paramsRow = sheet.addRow([parameters.join(' | ')]);
        paramsRow.font = { bold: true, color: { argb: 'black' } };
        sheet.mergeCells(`A${currentRow}:Q${currentRow}`);
        currentRow++;

        // Empty row for spacing
        sheet.addRow([]);
        currentRow++;
      }

      // Timestamp
      const timestamp = `Generated on: ${dayjs().format('DD-MM-YYYY HH:mm:ss')}`;
      const timeRow = sheet.addRow([timestamp]);
      timeRow.font = { color: { argb: '7F7F7F' } };
      timeRow.alignment = { horizontal: 'right' };
      sheet.mergeCells(`A${currentRow}:Q${currentRow}`);
      currentRow++;

      // Headers
      const headers =
        formData.viewMode === 'details'
          ? [
              'Doc ID',
              'Date',
              'Job No',
              'Vendor',
              'Invoice No',
              'Date',
              'Charge Code',
              'Charge Name',
              'Ledger',
              'Tax Type',
              'Tax %',
              'Qty',
              'Rate',
              'Charge Amt',
              'Tax Amt',
              'Tds Amt',
              'Total Amt'
            ]
          : [
              'Doc ID',
              'Date',
              'Invoice No',
              'Invoice Date',
              'Tax Type',
              'Vendor',
              'Supply Place',
              'Bill Amount',
              'Tax Amount',
              'Tds Amount',
              'Total Amt'
            ];

      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1F4E78' }
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;
      currentRow++;

      // Data Rows
      let dataStartRow = currentRow; // Remember where data starts

      // Details Report
      if (formData.viewMode === 'details') {
        const groups = rowData.reduce((acc, item) => {
          const key = item.docId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        Object.entries(groups).forEach(([docid, items], groupIndex) => {
          const startRow = currentRow;

          items.forEach((item, idx) => {
            const row = [
              item.docId,
              dayjs(item.docDate).format('DD-MM-YYYY'),
              item.jobNo,
              item.supplierName,
              item.vId || '-',
              dayjs(item.vDate).format('DD-MM-YYYY'),
              item.chargeCode,
              item.chargerName,
              item.ledger,
              item.gstType,
              item.gstPercentage,
              item.qty,
              item.rate,
              item.lcAmt,
              item.gst,
              item.totalTds,
              item.netAmount
            ];
            const dataRow = sheet.addRow(row);

            // Apply zebra striping
            dataRow.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: groupIndex % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
            };

            // Color coding
            dataRow.getCell('N').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
            dataRow.getCell('O').font = { color: { argb: 'FF00B050' } }; // Total - Green
            dataRow.getCell('P').font = { color: { argb: 'FF00B050' } }; // Total - Green
            dataRow.getCell('Q').font = { color: { argb: 'FFFF0000' } }; // Tax - Red

            // Format numbers
            dataRow.getCell('M').numFmt = '#,##0.00';
            dataRow.getCell('N').numFmt = '#,##0.00';
            dataRow.getCell('O').numFmt = '#,##0.00';
            dataRow.getCell('P').numFmt = '#,##0.00';
            dataRow.getCell('Q').numFmt = '#,##0.00';
            currentRow++;
          });

          // Only merge if group has >1 row
          if (items.length > 1) {
            const endRow = currentRow - 1;
            for (let col = 1; col <= 6; col++) {
              const colChar = String.fromCharCode(64 + col);
              sheet.mergeCells(`${colChar}${startRow}:${colChar}${endRow}`);
              const cell = sheet.getCell(`${colChar}${startRow}`);
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          }
        });
      }
      // Summary Report
      else {
        rowData.forEach((item, index) => {
          const row = sheet.addRow([
            item.docId,
            dayjs(item.docdate).format('DD-MM-YYYY'),
            item.vId || '-',
            dayjs(item.vDate).format('DD-MM-YYYY'),
            item.gstType,
            item.supplierName,
            item.supplierPlace,
            item.totChargeLcAmt,
            item.gstAmount,
            item.tdsAmount,
            item.totalLcAmount
          ]);

          // Apply zebra striping
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
          };

          // Color coding
          row.getCell('I').font = { color: { argb: 'FFFF0000' } }; // Tax - Red
          row.getCell('J').font = { color: { argb: 'FF00B050' } };
          row.getCell('K').font = { color: { argb: 'FF00B050' } };

          // Format numbers
          row.getCell('I').numFmt = '#,##0.00'; // Amount
          row.getCell('J').numFmt = '#,##0.00'; // Tax
          row.getCell('K').numFmt = '#,##0.00'; // Total
          row.getCell('H').numFmt = '#,##0.00';

          currentRow++;
        });
      }

      // Add totals
      const totals = rowData.reduce(
        (acc, item) => {
          acc.totalCharge += Number(item.lcAmt || 0);
          acc.totalTax += Number(item.gst || 0);
          acc.totalTds += Number(item.totalTds || 0);
          acc.totalInvoice += Number(item.netAmount || 0);
          return acc;
        },
        { totalCharge: 0, totalTax: 0, totalInvoice: 0, totalTds: 0 }
      );

      const totalSummary = rowData.reduce(
        (acc, item) => {
          acc.totChargeLcAmt += Number(item.totChargeLcAmt || 0);
          acc.gstAmount += Number(item.gstAmount || 0);
          acc.tdsAmount += Number(item.tdsAmount || 0);
          acc.totalLcAmount += Number(item.totalLcAmount || 0);
          return acc;
        },
        { totChargeLcAmt: 0, gstAmount: 0, tdsAmount: 0, totalLcAmount: 0 }
      );
      const totalRow = sheet.addRow([]);

      if (formData.viewMode === 'details') {
        totalRow.values = [
          'Grand Total',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          totals.totalCharge,
          totals.totalTax,
          totals.totalTds,
          totals.totalInvoice
        ];
        sheet.mergeCells(`A${currentRow}:J${currentRow}`);
      } else {
        totalRow.values = [
          'Grand Total',
          '',
          '',
          '',
          '',
          '',
          '',
          totalSummary.totChargeLcAmt,
          totalSummary.gstAmount,
          totalSummary.tdsAmount,
          totalSummary.totalLcAmount
        ];
        sheet.mergeCells(`A${currentRow}:G${currentRow}`);
      }

      // Style totals row
      totalRow.font = { bold: true };
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DDEBF7' } // Light blue background
      };
      totalRow.getCell(1).alignment = { horizontal: 'right' };

      // Format totals numbers
      if (formData.viewMode === 'details') {
        totalRow.getCell('K').numFmt = '#,##0';
        totalRow.getCell('K').alignment = { horizontal: 'right' };
        ['O', 'P', 'Q', 'N'].forEach((col) => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('N').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('O').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('P').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('Q').font = { color: { argb: 'FFFF0000' } };
      } else {
        ['I', 'J', 'K', 'H'].forEach((col) => {
          const cell = totalRow.getCell(col);
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        });
        totalRow.getCell('H').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('I').font = { color: { argb: 'FFFF0000' } };
        totalRow.getCell('J').font = { color: { argb: 'FF00B050' } };
        totalRow.getCell('K').font = { color: { argb: 'FF00B050' } };
      }
      currentRow++;

      // Set column widths and borders
      sheet.columns.forEach((column) => {
        column.width = 18;
        column.alignment = { vertical: 'middle' };
      });

      // sheet.eachRow(row => {
      //   row.eachCell(cell => {
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' }
      //     };
      //   });
      // });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${reportType.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
      console.error('Excel generation failed:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };
  const handleDownloadPdf = ({ logo, columns, data, fileName, userName, formData }) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // 1) COMPANY LOGO (top-left)
    const logoBase64 = logo;
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 10, 10, 30, 23);
    }

    // 2) TITLE BOX
    const title = `${fileName}`;
    const textW = doc.getTextWidth(title);
    const boxW = textW + 20;
    const boxX = (pageW - boxW) / 2;
    doc
      .setFillColor('#e7ebeb')
      .roundedRect(boxX, 18, boxW, 10, 4, 4, 'F')
      .setTextColor('#34449B')
      .setFontSize(12)
      .text(title, pageW / 2, 25, { align: 'center' });

    // 3) FILTER METADATA
    const { fromDate, toDate, branchCode, vendor, viewMode } = formData;
    doc.setFontSize(9);
    doc.setTextColor('#000000');
    doc.setFillColor(231, 235, 235);
    doc.roundedRect(2, 35, 206, 12, 2, 2, 'F');

    // Row 1: Labels
    doc.setFont(undefined, 'bold');
    doc.text('From Date', 8, 40);
    doc.text('To Date', 37, 40);
    doc.text('vendor', 58, 40);
    doc.text('Branch Code', 153, 40);
    doc.text('View Mode', 184, 40);

    // Row 2: Values
    doc.setFont(undefined, 'normal');
    doc.text(dayjs(fromDate).format('DD-MM-YYYY'), 8, 45);
    doc.text(dayjs(toDate).format('DD-MM-YYYY'), 37, 45);
    doc.text(String(vendor ?? '-'), 58, 45);
    doc.text(String(branchCode ?? '-'), 153, 45);
    doc.text(String(viewMode ?? '-'), 184, 45);

    // 4) Build Table Body
    const headerLabels = columns.map((c) => c.header);
    const numericFields = columns
      .map((c) => c.accessorKey)
      .filter((k) => k && /(gstPercentage|totalTds|gst|lcAmt|rate|netAmount|toalLcAmount|totChargesLcAmt|gstAmount|totalAmount)/i.test(k));

    const body = data.map((row) =>
      columns.map((col) => {
        const key = col.accessorKey;
        const raw = key ? row[key] : '';
        if (key?.toLowerCase().includes('date')) {
          const d = dayjs(raw);
          return d.isValid() ? d.format('DD-MM-YYYY') : '-';
        }
        if (typeof raw === 'number') {
          return raw === 0 ? '' : raw.toLocaleString('en-IN');
        }
        return raw ?? '';
      })
    );

    // 5) Add Total Row
    const totalFields =
      viewMode === 'details' ? ['lcAmt', 'gst', 'totalTds', 'netAmount'] : ['totChargeLcAmt', 'gstAmount', 'tdsAmount', 'totalAmount'];

    const totalRow = columns.map((col, index) => {
      const key = col.accessorKey;
      if (index === 0) return 'Total';
      if (totalFields.includes(key)) {
        const sum = data.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0);
        return Math.round(sum).toLocaleString('en-IN');
      }
      return '';
    });

    body.push(totalRow);

    // 6) Render Table
    autoTable(doc, {
      startY: 50,
      head: [headerLabels],
      body,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [52, 68, 155],
        textColor: 255,
        halign: 'center'
      },
      bodyStyles: {
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 5, right: 5 },
      tableWidth: 'auto',
      columnStyles: generateFullWidthColumnStyles(columns, doc),
      didDrawPage: (data) => {
        doc.setFontSize(8).setTextColor('#555555');
        doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
        doc.text(`Generated By: ${userName}`, 15, pageH - 10, { align: 'left' });
      },
      didParseCell: (cellHookData) => {
        const { cell, column, section, row } = cellHookData;
        const key = columns[column.index]?.accessorKey;

        // Skip color change for total row
        if (section === 'body' && row.raw !== totalRow) {
          if (['lcAmt', 'totChargeLcAmt'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          } else if (['gst', 'gstAmount'].includes(key)) {
            cell.styles.textColor = [255, 0, 0];
          } else if (['totalTds', 'tdsAmount'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          } else if (['netAmount', 'totalAmount'].includes(key)) {
            cell.styles.textColor = [0, 128, 0];
          }
        }

        if (section === 'body' && numericFields.includes(key)) {
          cell.styles.halign = 'right';
        }
      }
    });
    doc.save(`${fileName}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };
  const generateFullWidthColumnStyles = (columns, doc) => {
    const totalColumns = columns.length;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10; // left + right total margin (10 on each side)
    const usableWidth = pageWidth - margin;

    const colWidth = usableWidth / totalColumns;

    const styles = {};
    columns.forEach((_, index) => {
      styles[index] = { cellWidth: colWidth };
    });

    return styles;
  };
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl" style={{ padding: '10px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div
                className="col-md-2
               mb-2"
              >
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.vendor} onChange={handleCheckboxChange} name="vendor" color="secondary" />}
                  label="Vendor"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedSections.branchCode} onChange={handleCheckboxChange} name="branchCode" color="secondary" />
                  }
                  label="Branch"
                />
              </div>
              <div className="col-md-2 mb-4 d-flex align-items-center">
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={formData.viewMode === 'details' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        viewMode: 'details'
                      }))
                    }
                  >
                    Details
                  </Button>
                  <Button
                    variant={formData.viewMode === 'summary' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        viewMode: 'summary'
                      }))
                    }
                  >
                    Summary
                  </Button>
                </ButtonGroup>
              </div>
              <div className="col-md-3 mb-2">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
              </div>
            </div>
            {selectedSections.date && (
              <>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From Date"
                        value={formData.fromDate ? dayjs(formData.fromDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('fromDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true, error: fieldErrors.fromDate, helperText: fieldErrors.fromDate }
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
                          textField: { size: 'small', clearable: true, error: fieldErrors.toDate, helperText: fieldErrors.toDate }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </>
            )}
            {selectedSections.branchCode && (
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branchCode}>
                  <InputLabel id="branchCode-label">Branch Code</InputLabel>
                  <Select
                    labelId="branchCode-label"
                    label="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
                    name="branchCode"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {branchCodeList?.map((row) => (
                      <MenuItem key={row.id} value={row.branchCode}>
                        {row.branchCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branchCode && <FormHelperText>{fieldErrors.branchCode}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {selectedSections.vendor && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vendor}>
                  <InputLabel id="vendor-label">Vendor</InputLabel>
                  <Select labelId="vendor-label" label="vendor" value={formData.vendor} onChange={handleSelectPartyChange} name="vendor">
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.vendor && <FormHelperText>{fieldErrors.vendor}</FormHelperText>}
                </FormControl>
              </div>
            )}
          </div>
        </>
      </div>
      <Dialog
        open={open}
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
          {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6"> */}
          {formData.viewMode === 'details' ? 'Detailed Cost Report' : 'Summary Cost Report'}
          {/* </Typography>*/}
          <Box>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {/* </Box> */}
        </DialogTitle>
        <DialogContent>
          {rowData.length > 0 && (
            <CommonReportTableGrouped
              columns={getColumns()}
              data={rowData}
              fileName={`${formData.viewMode === 'details' ? 'Detailed' : 'Summary'} Cost Report`}
              handleDownloadExcel={handleDownloadExcel}
              sumFields={getSumFields()}
              headerFields={headerFields}
              handleDownloadPDF={async () => {
                const logoBase64 = await getLogo();
                handleDownloadPdf({
                  logo: logoBase64,
                  columns: getColumns(),
                  data: rowData,
                  fileName: 'Cost Report',
                  userName,
                  formData
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CostReport;
