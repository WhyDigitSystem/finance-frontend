import React from 'react';
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
  Radio,
  TableContainer,
  Switch,
  ButtonGroup,
  Divider,
  DialogTitle
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Dialog, DialogContent } from '@mui/material';
import { IconButton } from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Slide from '@mui/material/Slide';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="down"
      ref={ref}
      {...props}
      timeout={{
        appear: 1000,
        enter: 1000,
        exit: 1000
      }}
    />
  );
});

function MimRimRegister() {
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [open, setOpen] = useState(false);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [isLoading, setIsLoading] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedSections, setSelectedSections] = useState({
    date: false,
    branchCode: false,
    customer: false,
    mim: true,
    rim: false
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'mim' || name === 'rim') {
      const selectedType = name.toUpperCase();

      setSelectedSections((prev) => ({
        ...prev,
        mim: name === 'mim' ? checked : false,
        rim: name === 'rim' ? checked : false
      }));

      setFormData((prev) => ({
        ...prev,
        mim: name === 'mim' ? checked : false,
        rim: name === 'rim' ? checked : false,
        type: checked ? selectedType : ''
      }));
    } else {
      setSelectedSections((prevState) => ({
        ...prevState,
        [name]: checked
      }));
    }
  };

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    mim: true,
    rim: false,
    type: 'MIM',
    branchCode: 'All',
    customer: 'All',
    customerCode: 'All',
    viewMode: 'details'
  });
  const [fieldErrors, setFieldErrors] = useState({
    fromDate: '',
    toDate: '',
    branchCode: '',
    customer: '',
    customerCode: ''
  });
  const handleClear = () => {
    setListView(false);
    setFormData({
      mim: true,
      rim: false,
      fromDate: null,
      toDate: null,
      branchCode: 'All',
      customer: 'All',
      customerCode: 'All'
    });
    setFieldErrors({
      fromDate: '',
      toDate: '',
      customer: '',
      customerCode: '',
      branchCode: ''
    });
    setRowData([]);
  };
  const handleSelectPartyChange = (e) => {
    const value = e.target.value;
    console.log('Selected employeeCode value:', value);
    const selectedEmp = partyNameList.find((emp) => (formData.type === 'MIM' ? emp.partyShortName === value : emp.name === value));
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
          customer: formData.type === 'MIM' ? selectedEmp.partyShortName : selectedEmp.name
          // customerCode: selectedEmp.partyCode,
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
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD') || null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  useEffect(() => {
    getAllBranches();
    if (formData.type === 'MIM') {
      setPartyNameList([]);
      getPartyName();
    } else if (formData.type === 'RIM') {
      setPartyNameList([]);
      getAllCustomerDetails();
    }
  }, [formData.type]);

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
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
      setPartyNameList(response.paramObjectsMap.partyMasterVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/warehouser/getAllWarehouseByOrgId?orgId=${orgId}`);
      setPartyNameList(response.paramObjectsMap.warehouseVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const handleGo = async () => {
    const errors = {};
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setOpen(true);
      setListView(false);
      try {
        let response;
        if (formData.viewMode === 'details') {
          if (formData.type === 'MIM')
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findMIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findMIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          else {
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findRIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findRIMReports?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          }
        } else {
          if (formData.type === 'MIM')
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findMimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findMimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          else {
            if (formData.fromDate && formData.toDate) {
              response = await apiCalls(
                'get',
                `/reportController/findRimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}&fromDate=${formData.fromDate}&toDate=${formData.toDate}`
              );
            } else {
              response = await apiCalls(
                'get',
                `/reportController/findRimSummaryReport?customerName=${formData.customer}&finYear=${finYear}&orgId=${orgId}&type=${formData.type}`
              );
            }
          }
        }

        if (response.status === true) {
          console.log('Response:', response);
          {
            formData.type === 'MIM' && setRowData(response.paramObjectsMap.mimReportFillGrid || []);
          }
          {
            formData.type === 'RIM' && setRowData(response.paramObjectsMap.rimReportFillGrid || []);
          }
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
  const handleClose = () => {
    setOpen(false);
    setRowData([]);
  };

  //

  const handleDownloadExcel = async ({ logo, headerFields = [] }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Report');
      const reportType = formData.type === 'MIM' ? 'MIM Report' : 'RM Report';

      // ====== TITLE ======
      sheet.mergeCells('A1:K1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = reportType;
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: 'center' };

      // ====== LOGO ======
      sheet.mergeCells('A2:B6');
      if (logo) {
        try {
          const base64Data = logo.split(',')[1] || logo;
          if (base64Data.length >= 100) {
            const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
            const imageId = workbook.addImage({
              base64: base64Data,
              extension,
              type: 'image'
            });
            sheet.addImage(imageId, {
              tl: { col: 0, row: 1 },
              ext: { width: 120, height: 80 }
            });
          }
        } catch (err) {
          console.error('Error adding logo:', err);
        }
      }

      // ====== HEADER INFO ======
      const headerInfo = [
        ...headerFields,
        { label: 'Generated By', value: localStorage.getItem('userName') || 'Admin' },
        { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm:ss A') }
      ];

      for (let i = 0; i < headerInfo.length; i += 2) {
        const rowIndex = i / 2 + 3;
        const row = sheet.getRow(rowIndex);
        const label1 = row.getCell(3);
        const value1 = row.getCell(4);
        label1.value = headerInfo[i].label + ':';
        label1.font = { bold: true };
        value1.value = headerInfo[i].value;

        if (headerInfo[i + 1]) {
          const label2 = row.getCell(6);
          const value2 = row.getCell(7);
          label2.value = headerInfo[i + 1].label + ':';
          label2.font = { bold: true };
          value2.value = headerInfo[i + 1].value;
        }
      }

      // ====== TABLE HEADERS ======
      const headers =
        formData.viewMode === 'details'
          ? ['#', 'Trans No', 'Date', 'Sender', 'Receiver', 'Kit No', 'Kit Name', 'Kit Qty', 'Product Code', 'Product Name', 'Product Qty']
          : ['#', 'Trans No', 'Date', 'Sender', 'Receiver', 'Transporter Name', 'Kit Qty'];
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
      headerRow.alignment = { horizontal: 'center' };

      let rowIndex = sheet.lastRow.number + 1;
      let totalKitQty = 0;
      let totalProductQty = 0;
      let amount = 0;

      rowData.forEach((transaction, trxIndex) => {
        const details =
          formData.type === 'MIM' ? transaction.issueManifestProviderDetailsVOs : transaction.retrievalManifestProviderDetailsVOs;

        if (formData.viewMode === 'summary') {
          const summaryRow = [
            trxIndex + 1,
            transaction.transactionNo || '',
            transaction.transactionDate ? dayjs(transaction.transactionDate).format('DD-MM-YYYY') : '',
            // transaction.sender || '',
            transaction.wareHouse,
            transaction.receiver || '',
            // transaction.hsnCode || '',
            transaction.transporterName || '',
            Number(transaction.kitQty) || 0
          ];
          totalKitQty += Number(transaction.kitQty) || 0;
          sheet.addRow(summaryRow);
          rowIndex++;
          return;
        }

        if (!details) return;

        const kitGroups = details.reduce((groups, item) => {
          const kitId = item.kitId;
          if (!groups[kitId]) {
            groups[kitId] = {
              kitId,
              kitName: item.kitName,
              assets: []
            };
          }
          groups[kitId].assets.push(item);
          return groups;
        }, {});

        const kitGroupsArray = Object.values(kitGroups);
        const seenKitIds = new Set();
        const transactionStartRow = rowIndex;

        kitGroupsArray.forEach((kitGroup) => {
          if (seenKitIds.has(kitGroup.kitId)) return;
          seenKitIds.add(kitGroup.kitId);

          const kitStartRow = rowIndex;
          totalKitQty += Number(kitGroup.assets[0]?.kitQty) || 0;

          kitGroup.assets.forEach((asset, index) => {
            totalProductQty += Number(asset.assetQty) || 0;

            const row = [
              trxIndex + 1,
              index === 0 ? transaction.transactionNo : '',
              index === 0 ? dayjs(transaction.transactionDate).format('DD-MM-YYYY') : '',
              index === 0 ? transaction.sender : '',
              index === 0 ? transaction.receiver : '',
              index === 0 ? kitGroup.kitId : '',
              index === 0 ? kitGroup.kitName : '',
              Number(index === 0 ? asset.kitQty : ''),
              asset.assetCode,
              asset.asset,
              Number(asset.assetQty)
            ];
            sheet.addRow(row);
            rowIndex++;
          });

          if (kitGroup.assets.length > 1) {
            for (let col = 6; col <= 8; col++) {
              sheet.mergeCells(kitStartRow, col, rowIndex - 1, col);
            }
          }
        });

        const transactionRowCount = rowIndex - transactionStartRow;
        if (transactionRowCount > 1) {
          for (let i = 1; i <= 5; i++) {
            sheet.mergeCells(transactionStartRow, i, transactionStartRow + transactionRowCount - 1, i);
          }
        }
      });

      // ====== TOTAL ROW ======
      const totalRow =
        formData.viewMode === 'details'
          ? sheet.addRow(['', '', '', '', '', '', 'Total', totalKitQty, '', '', totalProductQty])
          : sheet.addRow(['', '', '', '', '', 'Total', totalKitQty]);
      totalRow.font = { bold: true };
      totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };

      // ====== Align cells ======
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 7) {
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };

            // ✅ Right align numeric columns
            const isNumericColumn =
              (formData.viewMode === 'details' && [8, 11].includes(colNumber)) || // Kit Qty, Product Qty
              (formData.viewMode === 'summary' && [7, 8].includes(colNumber)); // Kit Qty, Amount

            cell.alignment = {
              vertical: 'middle',
              wrapText: true,
              horizontal: isNumericColumn ? 'right' : 'left'
            };

            // ✅ Add comma format
            if (formData.viewMode === 'summary' && colNumber === 8 && typeof cell.value === 'number') {
              cell.numFmt = '#,##0.00';
            }
          });
        }
      });

      // ====== Auto Width ======
      sheet.columns.forEach((column) => {
        const maxLength = column.values.reduce((max, val) => {
          const len = val ? val.toString().length : 0;
          return Math.max(max, len);
        }, 0);
        column.width = Math.max(10, maxLength + 2);
      });

      // ====== Save File ======
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${reportType.replace(' ', '_')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      showToast('error', 'Failed to generate Excel file');
    }
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

  useEffect(() => {
    getCompanyDetails();
  }, []);

  // pdf

  const handleExportToPDF = async ({ logo, headerFields = [], rowData = [], formData = {} }) => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });
      const reportType = formData.type === 'MIM' ? 'MIM Report' : 'RM Report';
      const generatedOn = dayjs().format('DD-MM-YYYY hh:mm:ss A');
      const generatedBy = localStorage.getItem('userName') || 'Admin';

      // === Report Title ===
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(reportType, 148, 10, { align: 'center' });

      // === Logo (if available) ===
      if (logo) {
        doc.addImage(logo, 'PNG', 10, 0, 30, 23);
      }

      // === Header Box Design ===
      const headersList = [...headerFields];
      doc.setFontSize(9);
      doc.setTextColor('#000000');
      doc.setFillColor(231, 235, 235);
      doc.roundedRect(5, 20, 287, 12, 2, 2, 'F'); // Full width in landscape

      // Row 1: Labels (bold)
      doc.setFont('helvetica', 'bold');
      doc.text(headersList[0]?.label || 'Date', 8, 25);
      doc.text(headersList[1]?.label || 'Party Name', 80, 25);
      doc.text(headersList[2]?.label || 'Branch', 160, 25);
      doc.text(headersList[3]?.label || 'Currency Type', 235, 25);

      // Row 2: Values (normal)
      doc.setFont('helvetica', 'normal');
      doc.text(headersList[0]?.value || '-', 8, 30);
      doc.text(headersList[1]?.value || '-', 80, 30);
      doc.text(headersList[2]?.value || '-', 160, 30);
      doc.text((headersList[3]?.value || '-').toUpperCase(), 235, 30);

      // === Table Columns ===
      const isDetails = formData.viewMode === 'details';
      const isMIM = formData.type === 'MIM';

      const headers = isDetails
        ? ['#', 'Trans No', 'Date', 'Sender', 'Receiver', 'Kit No', 'Kit Name', 'Kit Qty', 'Product Code', 'Product Name', 'Product Qty']
        : ['#', 'Trans No', 'Date', 'Sender', 'Receiver', 'Transporter Name', 'Kit Qty'];

      const body = [];
      let totalKitQty = 0;
      let totalProductQty = 0;
      let totalAmount = 0;

      rowData.forEach((transaction, trxIndex) => {
        if (!transaction) return;

        if (!isDetails) {
          const row = [
            trxIndex + 1,
            transaction.transactionNo || '',
            transaction.transactionDate ? dayjs(transaction.transactionDate).format('DD-MM-YYYY') : '',
            // transaction.sender || '',
            transaction.wareHouse || '',
            transaction.receiver || '',
            // transaction.hsnCode || '',
            transaction.transporterName || '',
            Number(transaction.kitQty) || 0
          ];
          totalKitQty += Number(transaction.kitQty) || 0;

          body.push(row);
        } else {
          const details = isMIM ? transaction.issueManifestProviderDetailsVOs : transaction.retrievalManifestProviderDetailsVOs;
          if (!details) return;

          const grouped = details.reduce((acc, item) => {
            const kitId = item.kitId;
            if (!acc[kitId]) acc[kitId] = { kitName: item.kitName, kitQty: item.kitQty, assets: [] };
            acc[kitId].assets.push(item);
            return acc;
          }, {});

          Object.keys(grouped).forEach((kitId) => {
            const kit = grouped[kitId];
            totalKitQty += Number(kit.kitQty) || 0;

            kit.assets.forEach((asset, index) => {
              totalProductQty += Number(asset.assetQty) || 0;
              body.push([
                trxIndex + 1,
                index === 0 ? transaction.transactionNo : '',
                index === 0 ? dayjs(transaction.transactionDate).format('DD-MM-YYYY') : '',
                // index === 0 ? transaction.fromWarehouse : '',
                index === 0 ? transaction.sender : '',
                index === 0 ? transaction.receiver : '',
                index === 0 ? kitId : '',
                index === 0 ? kit.kitName : '',
                index === 0 ? kit.kitQty : '',
                asset.assetCode,
                asset.asset,
                asset.assetQty
              ]);
            });
          });
        }
      });

      // === Total Row ===
      if (isDetails) {
        body.push([
          '',
          '',
          '',
          '',
          '',
          '',
          { content: 'Total', styles: { fontStyle: 'bold' } },
          { content: totalKitQty.toString(), styles: { fontStyle: 'bold' } },
          '',
          { content: '', styles: { fontStyle: 'bold' } },
          { content: totalProductQty.toString(), styles: { fontStyle: 'bold' } }
        ]);
      } else {
        const row = [
          '',
          '',
          '',
          '',
          '',
          { content: 'Total', styles: { fontStyle: 'bold' } },
          { content: totalKitQty.toString(), styles: { fontStyle: 'bold' } }
        ];
        if (isMIM) row.push({ content: totalAmount.toFixed(2), styles: { fontStyle: 'bold' } });
        body.push(row);
      }

      // === AutoTable with Footer ===
      autoTable(doc, {
        head: [headers],
        body,
        startY: 37,
        margin: { left: 10, right: 10 },
        headStyles: {
          fillColor: [31, 78, 120],
          textColor: 255,
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 1,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        didParseCell: (data) => {
          const numericCols = isDetails ? [7, 10] : [6, 7];
          if (numericCols.includes(data.column.index)) {
            data.cell.styles.halign = 'right';
          }
        },
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.getHeight();
          const pageWidth = doc.internal.pageSize.getWidth();
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');

          const leftText = `Generated on: ${generatedOn}`;
          const rightText = `Generated by: ${generatedBy}`;
          const rightTextWidth = doc.getTextWidth(rightText);

          doc.text(leftText, 10, pageHeight - 5);
          doc.text(rightText, pageWidth - rightTextWidth - 10, pageHeight - 5);
        }
      });

      // === Save PDF ===
      doc.save(`${reportType.replace(' ', '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF file.');
    }
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
                  control={
                    <Checkbox checked={selectedSections.customer} onChange={handleCheckboxChange} name="customer" color="secondary" />
                  }
                  label="Customer"
                />
              </div>
              <div className="col-md-1 mb-1">
                <FormControlLabel
                  control={<Radio checked={selectedSections.mim} onChange={handleCheckboxChange} name="mim" color="secondary" />}
                  label="MIM"
                />
              </div>
              <div className="col-md-1 mb-1">
                <FormControlLabel
                  control={<Radio checked={selectedSections.rim} onChange={handleCheckboxChange} name="rim" color="secondary" />}
                  label="RM"
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
              {/* )} */}
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
                  <InputLabel id="customer-label">Customer</InputLabel>
                  <Select
                    labelId="customer-label"
                    label="customer"
                    value={formData.customer}
                    onChange={handleSelectPartyChange}
                    name="customer"
                  >
                    <MenuItem value="All">All</MenuItem>

                    {partyNameList?.map((row) => (
                      <MenuItem key={row.id} value={formData.type === 'MIM' ? row.partyShortName : row.name}>
                        {formData.type === 'MIM' ? row.partyShortName : row.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                </FormControl>
              </div>
            )}
          </div>
        </>
        <>
          {isLoading === false && (
            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="xl"
              fullWidth
              TransitionComponent={Transition}
              sx={{
                '& .MuiDialog-paper': {
                  borderRadius: 2,
                  overflow: 'hidden'
                }
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: '#673ab7',
                  color: 'white',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                  Report
                </Typography>
                <Box display="flex" alignItems="center">
                  {
                    userType === 'OPERATIONS' || userType === 'FINANCE MANAGER' ?
                      '' :
                      <ActionButton
                        title="Download Excel"
                        icon={FileDownloadIcon}
                        onClick={() =>
                          handleDownloadExcel({
                            logo: listViewData[0]?.companyLogo,
                            headerFields: [
                              {
                                label: 'From Date',
                                value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : '-'
                              },
                              {
                                label: 'To Date',
                                value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : '-'
                              },
                              { label: 'Customer', value: formData.customer },
                              { label: 'View Mode', value: formData.viewMode.toUpperCase() }
                            ]
                          })
                        }
                      />
                  }
                  {
                    userType === 'OPERATIONS' || userType === 'FINANCE MANAGER' ?
                      '' :
                      <ActionButton
                        title="Download PDF"
                        icon={PictureAsPdfIcon}
                        onClick={() =>
                          handleExportToPDF({
                            logo: listViewData[0]?.companyLogo,
                            headerFields: [
                              {
                                label: 'From Date',
                                value: formData.fromDate ? dayjs(formData.fromDate).format('DD-MM-YYYY') : '-'
                              },
                              {
                                label: 'To Date',
                                value: formData.toDate ? dayjs(formData.toDate).format('DD-MM-YYYY') : '-'
                              },
                              { label: 'Customer', value: formData.customer },
                              { label: 'View Mode', value: formData.viewMode.toUpperCase() }
                            ],
                            rowData, // ✅ This line is correct
                            formData
                          })
                        }
                      />
                  }
                  <ActionButton onClick={handleClose} icon={CloseIcon} title="Close"></ActionButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ padding: 0 }}>
                <TableContainer
                  sx={{
                    maxHeight: 'calc(100vh - 150px)',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#bdbdbd',
                      borderRadius: '4px'
                    }
                  }}
                >
                  <Table
                    size="small"
                    stickyHeader
                    sx={{
                      '& .MuiTableCell-root': {
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        '&:last-child': {
                          borderRight: 'none'
                        }
                      },
                      '& .MuiTableHead-root': {
                        '& .MuiTableCell-root': {
                          backgroundColor: '#f5f5f5',
                          color: '#424242',
                          fontWeight: 600,
                          borderBottom: '2px solid #e0e0e0'
                        }
                      },
                      '& .MuiTableBody-root': {
                        '& .MuiTableRow-root': {
                          '&:nth-of-type(even)': {
                            backgroundColor: 'rgba(245, 245, 245, 0.5)'
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(103, 58, 183, 0.04)'
                          }
                        }
                      }
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {formData.viewMode === 'details' ? (
                          <>
                            <TableCell align="center" sx={{ width: '40px' }}>
                              #
                            </TableCell>
                            <TableCell align="center">Trans No</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Sender</TableCell>
                            <TableCell align="center">Receiver</TableCell>
                            <TableCell align="center">Kit No</TableCell>
                            <TableCell align="center">Kit Name</TableCell>
                            <TableCell align="center">Kit Qty</TableCell>
                            <TableCell align="center">Product Code</TableCell>
                            <TableCell align="center">Product Name</TableCell>
                            <TableCell align="center">Product Qty</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="center" sx={{ width: '40px' }}>
                              #
                            </TableCell>
                            <TableCell align="center">Trans No</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Sender</TableCell>
                            <TableCell align="center">Receiver</TableCell>
                            {/* <TableCell align="center">HSN Code</TableCell> */}
                            <TableCell align="center">Transporter Name</TableCell>
                            <TableCell align="center">Kit Qty</TableCell>
                            {/* {formData.mim && <TableCell align="right">Amount</TableCell>} */}
                          </>
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {formData.viewMode === 'details'
                        ? rowData.map((transaction, trxIndex) => {
                          const details =
                            formData.type === 'MIM'
                              ? transaction.issueManifestProviderDetailsVOs
                              : transaction.retrievalManifestProviderDetailsVOs;

                          if (!details) return null;

                          const kitGroups = details.reduce((groups, item) => {
                            const kitId = item.kitId;
                            if (!groups[kitId]) {
                              groups[kitId] = {
                                kitId,
                                kitName: item.kitName,
                                kitQty: item.kitQty,
                                assets: []
                              };
                            }
                            groups[kitId].assets.push(item);
                            return groups;
                          }, {});

                          const kitGroupsArray = Object.values(kitGroups);
                          const totalAssetsInTransaction = details.length;

                          return (
                            <React.Fragment key={transaction.id}>
                              {kitGroupsArray.map((kitGroup, kitIndex) =>
                                kitGroup.assets.map((asset, assetIndex) => (
                                  <TableRow key={`${transaction.id}-${kitGroup.kitId}-${asset.id}`}>
                                    {/* Transaction-level data */}
                                    {kitIndex === 0 && assetIndex === 0 && (
                                      <>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {trxIndex + 1}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {transaction.transactionNo}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction} align="center">
                                          {dayjs(transaction.transactionDate).format('DD-MM-YYYY')}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction}>
                                          {transaction.sender}
                                          {/* {transaction.fromWarehouse} */}
                                        </TableCell>
                                        <TableCell rowSpan={totalAssetsInTransaction}>{transaction.receiver}</TableCell>
                                      </>
                                    )}

                                    {/* Kit-level data */}
                                    {assetIndex === 0 && (
                                      <>
                                        <TableCell rowSpan={kitGroup.assets.length} align="center">
                                          {kitGroup.kitId}
                                        </TableCell>
                                        <TableCell rowSpan={kitGroup.assets.length}>{kitGroup.kitName}</TableCell>
                                        <TableCell rowSpan={kitGroup.assets.length} align="center">
                                          {kitGroup.kitQty}
                                        </TableCell>
                                      </>
                                    )}

                                    {/* Asset-level data */}
                                    <TableCell align="center">{asset.assetCode}</TableCell>
                                    <TableCell>{asset.asset}</TableCell>
                                    <TableCell align="center">{asset.assetQty}</TableCell>
                                  </TableRow>
                                ))
                              )}

                              {/* Separator */}
                              {trxIndex < rowData.length - 1 && (
                                <TableRow>
                                  <TableCell colSpan={11} sx={{ padding: 0 }}>
                                    <Divider />
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })
                        : rowData.map((transaction, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{transaction.transactionNo}</TableCell>
                            <TableCell align="center">{dayjs(transaction.transactionDate).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>
                              {/* {transaction.sender} */}
                              {transaction.wareHouse}
                            </TableCell>
                            <TableCell>{transaction.receiver}</TableCell>
                            {/* <TableCell align="center">{transaction.hsnCode}</TableCell> */}
                            <TableCell>{transaction.transporterName || '-'}</TableCell>
                            <TableCell align="center">{transaction.kitQty}</TableCell>
                            {/* {formData.mim && (
                                <TableCell align="right">
                                  ₹{transaction.amount ? Number(transaction.amount).toLocaleString('en-IN') : '0'}
                                </TableCell>
                              )} */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
            </Dialog>
          )}
        </>
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
              width: '100%'
            }}
          >
            <CircularProgress size={40} />
          </div>
        )}
      </div>
    </>
  );
}

export default MimRimRegister;
