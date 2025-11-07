import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButton from 'utils/ActionButton';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import { TabContext } from '@mui/lab';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, Chip, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function CostRegister() {
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [fillGridData, setFillGridData] = useState({});
  const [value, setValue] = useState('1');
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [rowData, setRowData] = useState([]);

  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false
  });

  const [visibleSections, setVisibleSections] = useState({
    date: false,
    branchCode: false,
    customer: false
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
    // dateRange: [null, null],
    fromDate: null,
    toDate: null,
    branchCode: 'All',
    customer: 'All',
    customerCode: 'All'
  });
  const [fieldErrors, setFieldErrors] = useState({
    // dateRange: [null, null],
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: '',
    customerCode: ''
  });
  const handleClear = () => {
    // setVisibleSections({
    //   date: false,
    //   branchCode: false,
    //   customer: false,
    // });
    // setSelectedSections({
    //   date: false,
    //   branchCode: false,
    //   customer: false,
    // });
    setFormData({
      // dateRange: [null, null],
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      customer: 'All',
      customerCode: 'All'
    });
    setFieldErrors({
      // dateRange: [null, null],
      fromDate: '',
      toDate: '',
      branchCode: '',
      customer: '',
      customerCode: ''
    });
    setRowData([]);
    setListView(false);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected party value:', value);
    const selectedEmp = partyNameList.find((emp) => emp.partyName === value);
    if (value === 'All') {
      setFormData((prevData) => ({
        ...prevData,
        customer: 'All'
      }));
    } else {
      if (selectedEmp) {
        console.log('Selected party:', selectedEmp);
        setFormData((prevData) => ({
          ...prevData,
          customer: selectedEmp.partyName,
          customerCode: selectedEmp.partyCode
        }));
      } else {
        console.log('No party found with the given code:', value);
      }
    }
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
  // const handleDateChange = (newValue) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     dateRange: newValue,
  //   }));
  // };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  useEffect(() => {
    getAllBranches();
    getPartyName();
    getCompanyDetails();
  }, []);

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
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=VENDOR`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const reportColumns = [
    { accessorKey: 'Vid', header: 'Cost Invoice No', size: 80 },
    { accessorKey: 'Vdate', header: 'Date', size: 80 },
    {
      accessorKey: 'DocId',
      header: 'Doc Id',
      size: 100,
      Cell: ({ row }) => {
        const docId = row.original.DocId;
        const screenCode = row.original.ScreenCode;
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDocClick(docId, screenCode);
            }}
            style={{
              color: 'crimson',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s, text-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'red';
              // e.target.style.textShadow = '0 0 2px rgba(255, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'crimson';
              e.target.style.textShadow = 'none';
            }}
          >
            {docId}
          </a>
        );
      }
    },
    { accessorKey: 'DocDate', header: 'Doc Date', size: 80 },
    // { accessorKey: 'ScreenCode', header: 'Screen Code', size: 80 },
    { accessorKey: 'SupplierName', header: 'Party Name', size: 80 },
    { accessorKey: 'SupplierGstin', header: 'Reg In', size: 80 },
    { accessorKey: 'GstType', header: 'GST Type', size: 80 },
    {
      accessorKey: 'BillAmount',
      header: 'Bill Amount',
      size: 80,
      Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    },
    {
      accessorKey: 'OutputIgst',
      header: 'IGST',
      size: 80,
      Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    },
    {
      accessorKey: 'OutputCgst',
      header: 'CGST',
      size: 80,
      Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    },
    {
      accessorKey: 'OutputSgst',
      header: 'SGST',
      size: 80,
      Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    },
    // {
    //   accessorKey: 'Tax',
    //   header: 'TAX',
    //   size: 80,
    //   Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    // },
    {
      accessorKey: 'TotalAmount',
      header: 'Total Amount',
      size: 80,
      Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    }
    // {
    //   accessorKey: 'Tds',
    //   header: 'TDS',
    //   size: 80,
    //   Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    // },
    // {
    //   accessorKey: 'PartyPayable',
    //   header: 'Party Payable',
    //   size: 80,
    //   Cell: ({ cell }) => (cell.getValue() ? Number(cell.getValue()).toLocaleString('en-IN') : '-')
    // }
  ];
  const handleGo = async () => {
    const errors = {};
    if (!formData.customerCode) {
      errors.customerCode = 'Customer Code is required';
    }
    if (!formData.branchCode) {
      errors.branchCode = 'Branch Code is required';
    }
    const saveFormData = {
      branchCode: formData.branchCode,
      customer: formData.customerCode,
      fromDate: formData.fromDate,
      toDate: formData.toDate
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setListView(false);
      try {
        let response;
        if (formData.fromDate && formData.toDate) {
          response = await apiCalls(
            'get',
            `/rCostInvoiceGna/getRegisterCostInvoiceReport?branchCode=${formData.branchCode}&fromDate=${formData.fromDate}&orgId=${orgId}&toDate=${formData.toDate}&partyCode=${formData.customerCode}&finYear=${finYear}`
          );
        } else {
          response = await apiCalls(
            'get',
            `/rCostInvoiceGna/getRegisterCostInvoiceReport?branchCode=${formData.branchCode}&orgId=${orgId}&partyCode=${formData.customerCode}&finYear=${finYear}`
          );
        }
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.rCostinvoiceReport);
          setIsLoading(false);
          // showToast('succes', response.paramObjectsMap.message)
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
  const handleDocClick = async (docId, screenCode) => {
    setModalOpen(true);
    try {
      let response;
      if (screenCode === 'CI') {
        response = await apiCalls('get', `/costInvoice/getCostByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`);
      } else {
        response = await apiCalls('get', `/costInvoice/getDebitNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`);
      }

      if (response.status === true) {
        {
          screenCode === 'CI'
            ? setFillGridData(response.paramObjectsMap.costInvoiceVO || {})
            : setFillGridData(response.paramObjectsMap.costDebitNoteVO || {});
        }
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);
      setListViewData(response.paramObjectsMap.companyVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //
  // Excel Download
  const handleDownloadExcel = async ({ logo }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.created = new Date();
      const sheet = workbook.addWorksheet('Cost Register');
      sheet.state = 'visible';

      // ===== LOGO =====
      sheet.mergeCells('A1:B5');
      if (logo) {
        try {
          const base64Data = logo.split(',')[1] || logo;
          if (base64Data.length >= 100) {
            const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
            const imageId = workbook.addImage({ base64: base64Data, extension });
            sheet.addImage(imageId, {
              tl: { col: 0, row: 0 },
              ext: { width: 120, height: 80 }
            });
          }
        } catch (err) {
          console.error('Error adding logo:', err);
        }
      }

      // ===== TITLE =====
      sheet.mergeCells('C1:I1');
      const titleCell = sheet.getCell('C1');
      titleCell.value = 'COST REGISTER';
      titleCell.font = { size: 18, bold: true, color: { argb: 'FF34449B' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // ===== METADATA =====
      const metadata = [
        { label: 'From Date', value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : '' },
        { label: 'To Date', value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : '' },
        { label: 'Branch Code', value: formData.branchCode !== 'All' ? formData.branchCode : 'All' },
        { label: 'Vendor', value: formData.customer },
        { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
        { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
      ];

      metadata.forEach((meta, index) => {
        const rowIndex = (index % 4) + 2;
        const colGroup = Math.floor(index / 4);
        const colStart = 4 + colGroup * 2;
        const row = sheet.getRow(rowIndex);
        row.getCell(colStart).value = meta.label;
        row.getCell(colStart).font = { bold: true };
        row.getCell(colStart + 1).value = meta.value;
      });

      // ===== HEADERS =====
      const headerRowIndex = 7;
      const headers = [
        'Cost Invoice No',
        'Date',
        'Doc Id',
        'Doc Date',
        'Party Name',
        'Reg In',
        'GST Type',
        'Bill Amount',
        'IGST',
        'CGST',
        'SGST',
        'Total Amount'
      ];

      const headerRow = sheet.getRow(headerRowIndex);
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34449B' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // ===== DATA ROWS =====
      let totalBill = 0, totalIgst = 0, totalCgst = 0, totalSgst = 0, totalAmount = 0;

      rowData.forEach((item) => {
        const bill = parseFloat(item.BillAmount || 0);
        const igst = parseFloat(item.OutputIgst || 0);
        const cgst = parseFloat(item.OutputCgst || 0);
        const sgst = parseFloat(item.OutputSgst || 0);
        const total = parseFloat(item.TotalAmount || 0);

        totalBill += bill;
        totalIgst += igst;
        totalCgst += cgst;
        totalSgst += sgst;
        totalAmount += total;

        const row = sheet.addRow([
          item.Vid || '',
          item.Vdate ? dayjs(item.Vdate).format('DD-MM-YYYY') : '-',
          item.DocId || '-',
          item.DocDate ? dayjs(item.DocDate).format('DD-MM-YYYY') : '-',
          item.SupplierName || '',
          item.SupplierGstin || '',
          item.GstType || '',
          bill,
          igst,
          cgst,
          sgst,
          total
        ]);

        // numeric formatting
        [8, 9, 10, 11, 12].forEach((colIndex) => {
          const cell = row.getCell(colIndex);
          if (typeof cell.value === 'number') {
            cell.numFmt = '#,##0.00';
            cell.alignment = { horizontal: 'right' };
          }
        });

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });

      // ===== TOTAL ROW =====
      const totalRow = sheet.addRow(['Total', '', '', '', '', '', '', totalBill, totalIgst, totalCgst, totalSgst, totalAmount]);
      totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: colNumber >= 8 ? 'right' : 'left' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        if (colNumber >= 8) cell.numFmt = '#,##0.00';
      });

      // ===== COLUMN WIDTHS =====
      sheet.columns = [
        { width: 18 }, { width: 12 }, { width: 17 }, { width: 12 },
        { width: 35 }, { width: 18 }, { width: 12 },
        { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
      ];

      // ===== EXPORT =====
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Cost_Register_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      showToast('error', 'Failed to generate Excel file');
    }
  };
  const handleDownloadPdf = ({ logo, columns, data, fileName = 'Cost Register', loginUserName, formData }) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // LOGO
    if (logo) doc.addImage(logo, 'PNG', 10, 10, 30, 23);

    // TITLE
    const title = `${fileName}`;
    const boxW = doc.getTextWidth(title) + 20;
    const boxX = (pageW - boxW) / 2;
    doc.setFillColor('#e7ebeb')
      .roundedRect(boxX, 15, boxW, 10, 3, 3, 'F')
      .setTextColor('#34449B')
      .setFontSize(12)
      .text(title, pageW / 2, 22, { align: 'center' });

    // FOOTER
    const footer = () => {
      doc.setFontSize(8).setTextColor('#555555');
      doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
      doc.text(`Generated By: ${loginUserName}`, 15, pageH - 10, { align: 'left' });
    };

    // METADATA
    const { fromDate, toDate, branchCode, customer } = formData;
    const meta = [];
    if (fromDate) meta.push(`From: ${dayjs(fromDate).format('DD-MM-YYYY')}`);
    if (toDate) meta.push(`To: ${dayjs(toDate).format('DD-MM-YYYY')}`);
    if (branchCode) meta.push(`Branch: ${branchCode}`);
    if (customer) meta.push(`Vendor: ${customer}`);
    doc.setFontSize(9).setTextColor('#000');
    if (meta.length > 0) {
      doc.roundedRect(5, 30, pageW - 10, 10, 2, 2, 'S');
      doc.text(meta.join('   |   '), 10, 37);
    }

    // HEADERS
    const headerLabels = [
      'Cost Invoice No', 'Date', 'Doc Id', 'Doc Date', 'Party Name',
      'Reg In', 'GST Type', 'Bill Amount', 'IGST', 'CGST', 'SGST', 'Total Amount'
    ];

    // BODY
    const body = data.map((item) => [
      item.Vid || '',
      item.Vdate ? dayjs(item.Vdate).format('DD-MM-YYYY') : '-',
      item.DocId || '-',
      item.DocDate ? dayjs(item.DocDate).format('DD-MM-YYYY') : '-',
      item.SupplierName || '',
      item.SupplierGstin || '',
      item.GstType || '',
      (item.BillAmount || 0).toLocaleString('en-IN'),
      (item.OutputIgst || 0).toLocaleString('en-IN'),
      (item.OutputCgst || 0).toLocaleString('en-IN'),
      (item.OutputSgst || 0).toLocaleString('en-IN'),
      (item.TotalAmount || 0).toLocaleString('en-IN')
    ]);

    // TOTAL ROW
    const totalBill = data.reduce((a, b) => a + (b.BillAmount || 0), 0);
    const totalIgst = data.reduce((a, b) => a + (b.OutputIgst || 0), 0);
    const totalCgst = data.reduce((a, b) => a + (b.OutputCgst || 0), 0);
    const totalSgst = data.reduce((a, b) => a + (b.OutputSgst || 0), 0);
    const totalAmount = data.reduce((a, b) => a + (b.TotalAmount || 0), 0);

    const totalRow = ['Total', '', '', '', '', '', '',
      totalBill.toLocaleString('en-IN'),
      totalIgst.toLocaleString('en-IN'),
      totalCgst.toLocaleString('en-IN'),
      totalSgst.toLocaleString('en-IN'),
      totalAmount.toLocaleString('en-IN')
    ];
    body.push(totalRow);

    // TABLE
    autoTable(doc, {
      startY: 45,
      head: [headerLabels],
      body,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 220, 220], lineWidth: 0.1 },
      headStyles: { fillColor: [52, 68, 155], textColor: 255, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 22 },
        4: { cellWidth: 55 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' },
        11: { halign: 'right' }
      },
      didDrawPage: footer,
      didParseCell: (data) => {
        if (data.row.index === body.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    doc.save(`${fileName}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };


  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <>
          <div className="row">
            <div className="row">
              <div className="col-md-2 mb-2">
                <FormControlLabel
                  control={<Checkbox checked={selectedSections.date} onChange={handleCheckboxChange} name="date" color="secondary" />}
                  label="Date"
                />
              </div>
              <div className="col-md-2 mb-1">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />
                  }
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
              {/* <div className="col-md-2 mb-1">
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
            {selectedSections.customer && (
              <div className="col-md-3 mb-2">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customer}>
                  <InputLabel id="customer">Vendor</InputLabel>
                  <Select labelId="customer" label="customer" value={formData.customer} onChange={handleSelectPartyChange} name="customer">
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={row.partyName}>
                        {row.partyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                </FormControl>
              </div>
            )}
            {(selectedSections.date || selectedSections.branchCode || selectedSections.customer) && (
              <div className="col-md-3 mb-2">
                <div className="row d-flex ml">
                  <div className="d-flex flex-wrap justify-content-start mb-3 mt-1" style={{ marginBottom: '20px' }}>
                    <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} isLoading={isLoading} />
                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
        {listView && (
          <div>
            <CommonReportTable
              data={rowData}
              columns={reportColumns}
              isListView={listView}
              fileName={'Cost Register'}
              // sumFields={['TotalAmount', 'BillAmount']}
              handleDownloadPdf={() =>
                handleDownloadPdf({
                  logo: listViewData[0]?.companyLogo,
                  columns: reportColumns,
                  data: rowData,
                  formData,
                  fileName: 'Cost Register',
                  loginUserName
                })
              }
              handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            />
          </div>
        )}
        <>
          <Dialog
            open={modalOpen}
            maxWidth={'xl'}
            fullWidth={true}
            onClose={handleCloseModal}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <h6 style={{ margin: 0, textAlign: 'center' }}>Report Details</h6>
                <IconButton onClick={handleCloseModal} color="error">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent className="pb-0">
              <div className="row mb-2 mb-1">
                <div className="col-md-3 mb-1">
                  <strong>Doc ID:</strong> {fillGridData.docId}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Doc Date:</strong> {fillGridData.docDate ? dayjs(fillGridData.docDate).format('DD-MM-YYYY') : ''}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Invoice No:</strong> {fillGridData.vid}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Invoice Date:</strong> {fillGridData.vdate ? dayjs(fillGridData.vdate).format('DD-MM-YYYY') : ''}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Customer:</strong> {fillGridData.supplierName}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Gst In:</strong> {fillGridData.supplierGstIn}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Tax Type:</strong> {fillGridData.gstType}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Charge Amount:</strong> ₹{Number(fillGridData.totChargesLcAmt || 0).toLocaleString('en-IN')}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Tax Amount:</strong> ₹{Number(fillGridData.gstInputLcAmt || 0).toLocaleString('en-IN')}
                </div>
                <div className="col-md-3 mb-1">
                  <strong>Amount:</strong> ₹{Number(fillGridData.netBillLcAmt || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                        <Tab label="Charge Particulars" value="1" />
                        <Tab label="TDS" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">Job Order No</th>
                                  <th className="table-header">Charge Name</th>
                                  <th className="table-header">Charge Code</th>
                                  <th className="table-header">SAC Code</th>
                                  <th className="table-header">Vendor</th>
                                  <th className="table-header">Qty</th>
                                  <th className="table-header">Rate</th>
                                  <th className="table-header">Currency</th>
                                  <th className="table-header">Ex Rate</th>
                                  <th className="table-header">GST Amount</th>
                                  <th className="table-header">FC Amount</th>
                                  <th className="table-header">LC Amount</th>
                                  <th className="table-header">Bill Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.chargerCostInvoiceVO && fillGridData.chargerCostInvoiceVO.length > 0
                                  ? fillGridData.chargerCostInvoiceVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.jobNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeName || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.govChargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.party || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.qty || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.rate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.exRate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.gstAmount || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.fcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.lcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.billAmt || 0}
                                      </td>
                                    </tr>
                                  ))
                                  : fillGridData.chargerCostDebitNoteVO?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.jobNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeName || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.govChargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.party || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.qty || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.rate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.exRate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.gstpercent || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.fcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.lcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.billAmt || 0}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="2">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">Section</th>
                                  <th className="table-header">TDS</th>
                                  <th className="table-header">TDS Percent</th>
                                  <th className="table-header">TDS Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.tdsCostInvoiceVO && fillGridData.tdsCostInvoiceVO.length > 0
                                  ? fillGridData.tdsCostInvoiceVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.section || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.totTdsWhAmnt || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHoldingPer || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHolding || ''}
                                      </td>
                                    </tr>
                                  ))
                                  : fillGridData.taxInvoiceGstVO?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHolding || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHoldingPer || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.section || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.totTdsWhAmnt || ''}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  );
}

export default CostRegister;
