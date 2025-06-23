import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Chip, useTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
// import * as XLSX from 'xlsx-js-style';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ActionButton from 'utils/ActionButton';
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';

const defaultStyles = {
  tableContainer: {
    width: '100vw',
    maxWidth: '100%',
    maxHeight: '100%',
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB'
  },
  headerCell: {
    backgroundColor: '#2d3e98',
    padding: '0px 4px',
    lineHeight: '1',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '10px',
    borderBottom: '1px solid #D1D5DB',
    borderRight: '1px solid #f0eded',
    '&:last-child': {
      borderRight: 'none'
    }
  },
  bodyCell: {
    fontSize: '12px',
    color: '#374151',
    padding: '2px 4px',
    paddingLeft: '8px',
    borderBottom: '1px solid #E5E7EB',
    borderRight: '1px solid #f0eded',
    '&:last-child': {
      borderRight: 'none'
    }
  },
  numericCell: {
    textAlign: 'right',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    paddingRight: '10px',
    borderRight: '1px solid #E5E7EB',
    '&:last-child': {
      borderRight: 'none'
    }
  },
  row: {
    height: '10px',
    padding: '2px 4px',
    '&:hover': {
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      transition: '0.2s ease-in-out'
    }
  },
  openingBalanceRow: {
    backgroundColor: '#D1E7DD',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#D1E7DD'
    },
    '& td': {
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
      '&:last-child': {
        borderRight: 'none'
      }
    }
  },
  closingBalanceRow: {
    backgroundColor: '#FCD1D1',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#CDC1FF'
    }
  },
  totalBalanceRow: {
    backgroundColor: '#f5d9b0',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#f5d9b0'
    }
  },
  summaryFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 20px',
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    borderTop: '1px solid #E5E7EB'
  },
  exportButton: {
    width: '30px',
    height: '30px',
    minWidth: '30px',
    borderRadius: '4px',
    padding: '0',
    marginTop: '6px',
    color: 'white',
    backgroundColor: '#34449b',
    '&:hover': { backgroundColor: '#2d3e98' }
  }
};

const formatDate = (value) => {
  return value ? dayjs(value).format('DD-MM-YYYY') : '';
};

const formatNumberWithCommas = (value) => {
  if (value === null || value === undefined || value === 0) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

const CommonFilePL = ({
  formData,
  columns,
  data,
  isListView,
  fileName,
  sumFields = [],
  filters = {},
  styles = {},
  numericFields = ['debit', 'credit', 'amount', 'balance']
}) => {
  const mergedStyles = {
    ...defaultStyles,
    ...styles
  };

  //
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [userName] = useState(localStorage.getItem('userName'));
  const [listViewData, setListViewData] = useState([]);
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
  //

  const theme = useTheme();

  const sums = sumFields.reduce((acc, field) => {
    acc[field] = data.reduce((total, row) => total + parseFloat(row[field] || 0), 0);
    return acc;
  }, {});

  const sumFieldLabels = {
    TotalInvAmountLC: 'Total Amount',
    TotalTaxAmountLC: 'Total Tax Amount',
    BillAmount: 'Bill Amount',
    outstanding: 'OutStanding'
  };
  //
  const handleExportToPDF = ({ columns, data, fileName = 'Report', filters = {}, logo }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Image
    const logoBase64 = logo;
    const logoWidth = 30;
    const logoHeight = 23;
    const logoX = 10;
    const logoY = 10;
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
    //

    const title = `${fileName} Report`;
    const textWidth = doc.getTextWidth(title);
    const paddingX = 12;
    const boxHeight = 10;
    const posY = 20;
    const boxWidth = textWidth + paddingX * 2;
    const boxX = (pageWidth - boxWidth) / 2;
    const centerX = pageWidth / 2;

    const bgColor = '#e7ebeb';

    doc.setFillColor(bgColor);
    doc.roundedRect(boxX, posY - boxHeight + 3.5, boxWidth, boxHeight, 5, 5, 'F');

    doc.setTextColor('#000000');
    doc.setFontSize(12);
    doc.text(title, centerX, posY, { align: 'center' });

    // Time and Date
    const printedAt = `Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`;
    doc.setFontSize(8);
    doc.setTextColor('#555555');

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(printedAt, pageWidth - 15, pageHeight - 10, { align: 'right' });

    //
    // set in usertype
    if (userName) {
      const userText = `Report Generated By: ${userName}`;
      doc.setFontSize(8);
      doc.setTextColor('#555555');
      doc.text(userText, 15, pageHeight - 10, { align: 'left' });
    }
    //

    const fromDate = filters.fromDate ? dayjs(filters.fromDate).format('DD-MM-YYYY') : '-';
    const toDate = filters.toDate ? dayjs(filters.toDate).format('DD-MM-YYYY') : '-';
    const branch = filters.branch || '-';
    const partyType = filters.partyType || '-';
    const partyName = filters.partyName || '-';

    doc.setFontSize(10);
    doc.text(`${fromDate} To ${toDate} | ${branch} | ${partyType} | ${partyName}`, 15, 35);

    const headers = [columns.map((col) => col.header || col.accessorKey)];
    const body = data.map((row) =>
      columns.map((col) => {
        const key = col.accessorKey;
        let value = row[key];
        if (key?.toLowerCase().includes('date')) {
          const parsedDate = dayjs(value);
          value = parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : '';
        } else if (typeof value === 'number') {
          if (value === 0) {
            value = '';
          } else {
            value = value.toLocaleString('en-IN');
          }
        }
        return value ?? '';
      })
    );

    autoTable(doc, {
      startY: 37,
      head: headers,
      body: body,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [229, 231, 235]
      },
      headStyles: {
        fillColor: [40, 78, 142],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        halign: 'left'
      },
      didParseCell: function (data) {
        const colKey = columns[data.column.index]?.accessorKey?.toLowerCase();

        if (data.section === 'body' && numericFields.some((field) => colKey?.includes(field))) {
          data.cell.styles.halign = 'right';
        }

        if (data.section === 'body') {
          const rowIndex = data.row.index;
          const particularsIndex = columns.findIndex((col) => col.accessorKey?.toLowerCase() === 'particulars');
          const cellText = body[rowIndex]?.[particularsIndex]?.toLowerCase() || '';

          if (cellText.includes('opening balance')) {
            data.cell.styles.fillColor = [209, 231, 221];
            data.cell.styles.fontStyle = 'bold';
          } else if (cellText.includes('closing balance')) {
            data.cell.styles.fillColor = [252, 209, 209];
            data.cell.styles.fontStyle = 'bold';
          } else if (cellText.includes('total')) {
            data.cell.styles.fillColor = [245, 217, 176];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      didDrawCell: function (data) {
        const { cell, doc } = data;
        const x = cell.x;
        const y = cell.y;
        const w = cell.width;
        const h = cell.height;

        doc.setDrawColor(0);
        doc.setLineWidth(0.1);
        doc.line(x + w, y, x + w, y);
      }
    });

    doc.save(`${fileName}.pdf`);
  };

  //Excel
  const handleExportToExcel = async ({ columns, data, fileName = 'Report', filters = {}, logo, userName }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');
      const colCount = columns.length;
      const lastColLetter = String.fromCharCode(65 + colCount - 1);
      let currentRow = 1;

      // 1. Add logo (top-left)
      if (logo) {
        try {
          const base64Data = logo.split(',')[1] || logo;
          if (base64Data.length >= 100) {
            const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
            const imageId = workbook.addImage({ base64: base64Data, extension });
            worksheet.addImage(imageId, {
              tl: { col: 0, row: currentRow - 1 },
              ext: { width: 130, height: 70 }
            });
          }
        } catch (err) {
          console.warn('Logo insertion failed:', err);
        }
      }

      // 2. Header layout (logo left, title center, info right)
      const titleStartCol = logo ? 1 : 0;
      const titleEndCol = colCount - 2;
      const titleRange = `${String.fromCharCode(65 + titleStartCol)}${currentRow}:${String.fromCharCode(65 + titleEndCol)}${currentRow}`;

      // Title (centered)
      const titleCell = worksheet.getCell(titleRange.split(':')[0]);
      titleCell.value = `${fileName} Report`;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: 'center' };
      worksheet.mergeCells(titleRange);

      // User info (right)
      const userInfoCell = worksheet.getCell(`${lastColLetter}${currentRow}`);
      userInfoCell.value = `Generated By: ${userName}`;
      userInfoCell.alignment = { horizontal: 'right' };
      userInfoCell.font = { bold: true, size: 10 };
      currentRow++;

      // Date (right below user info)
      const dateCell = worksheet.getCell(`${lastColLetter}${currentRow}`);
      dateCell.value = `Generated on: ${dayjs().format('DD-MM-YYYY hh:mm A')}`;
      dateCell.alignment = { horizontal: 'right' };
      dateCell.font = { bold: true, size: 10 };
      currentRow += 2;

      // 3. Position filter at row 5
      while (currentRow < 4) worksheet.addRow([]).currentRow++;

      // Filter row (row 5)
      const filterRow = worksheet.getRow(5);
      filterRow.values = [
        `${filters.branch || '-'}`,
        `${filters.partyType || '-'}`,
        `${filters.partyName || '-'}`,
        `${filters.fromDate ? dayjs(filters.fromDate).format('DD-MM-YYYY') : '-'}`,
        'To',
        `${filters.toDate ? dayjs(filters.toDate).format('DD-MM-YYYY') : '-'}`
      ];
      filterRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F0F0' } };
      });

      // 4. Header row (row 7)
      currentRow = 7;
      const headerRow = worksheet.getRow(currentRow);
      headerRow.values = columns.map((col) => col.header || col.accessorKey);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '34449B' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: 'thin', bottom: 'thin', left: 'thin', right: 'thin' };
      });
      currentRow++;

      // 5. Data rows
      const numericColumns = columns
        .map((col, idx) => ({ key: col.accessorKey, index: idx }))
        .filter((col) =>
          ['amount', 'credit', 'debit', 'balance', 'qty', 'quantity', 'total'].some((field) => col.key?.toLowerCase().includes(field))
        )
        .map((col) => col.index);

      data.forEach((row) => {
        const newRow = worksheet.addRow(
          columns.map((col) => {
            const value = row[col.accessorKey];
            if (!col.accessorKey) return '';
            if (col.accessorKey.toLowerCase().includes('date') && value) {
              return dayjs(value).format('DD-MM-YYYY');
            }
            if (typeof value === 'number') {
              return value === 0 ? '' : value;
            }
            return value ?? '';
          })
        );

        // Format numbers
        numericColumns.forEach((index) => {
          const cell = newRow.getCell(index + 1);
          cell.alignment = { horizontal: 'right' };
          if (typeof cell.value === 'number') cell.numFmt = '#,##0.00';
        });

        // Highlight rows
        const highlights = [
          { text: 'opening balance', color: 'D1E7DD' },
          { text: 'closing balance', color: 'FCD1D1' },
          { text: 'total', color: 'F5D9B0' }
        ];

        const highlight = highlights.find((config) =>
          columns.some((col) => (row[col.accessorKey] || '').toString().toLowerCase().includes(config.text))
        );

        if (highlight) {
          newRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: highlight.color } };
            cell.font = { bold: true };
          });
        }

        // Add borders
        newRow.eachCell((cell) => {
          cell.border = { top: 'thin', bottom: 'thin', left: 'thin', right: 'thin' };
        });
      });

      // 6. Auto column width
      worksheet.columns.forEach((column, idx) => {
        let maxLength = 15;
        const header = columns[idx]?.header || columns[idx]?.accessorKey || '';
        maxLength = Math.max(maxLength, header.length);

        worksheet.getColumn(idx + 1).eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value?.toString().length || 0;
          maxLength = Math.min(Math.max(maxLength, length), 50);
        });

        column.width = maxLength + 2;
      });

      // 7. Export
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        `${fileName}.xlsx`
      );
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw error;
    }
  };
  //

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light,
    marginRight: '5px'
  };

  const processedColumns = columns.map((column) => {
    const columnConfig = { ...column };
    columnConfig.size = 50;

    if (column.accessorKey?.toLowerCase() === 'particulars') {
      columnConfig.size = 30;
    }

    if (column.accessorKey?.toLowerCase().includes('date')) {
      columnConfig.size = 50;
      columnConfig.Cell = ({ cell }) => formatDate(cell.getValue());
    }

    if (column.accessorKey === 'active') {
      columnConfig.Cell = ({ cell }) => (
        <Chip label={cell.getValue() ? 'Active' : 'Inactive'} sx={cell.getValue() ? chipSuccessSX : chipErrorSX} />
      );
    }

    if (column.accessorKey === 'closed') {
      columnConfig.Cell = ({ cell }) => (
        <Chip label={cell.getValue() === 'Yes' ? 'Yes' : 'No'} sx={cell.getValue() === 'Yes' ? chipSuccessSX : chipErrorSX} />
      );
    }

    if (column.accessorKey && numericFields.some((field) => column.accessorKey.toLowerCase().includes(field))) {
      columnConfig.size = 80;
      columnConfig.Cell = ({ cell }) => {
        const value = cell.getValue();
        return formatNumberWithCommas(value);
      };
      columnConfig.muiTableBodyCellProps = {
        ...column.muiTableBodyCellProps,
        align: 'right',
        sx: {
          ...mergedStyles.numericCell,
          ...(column.muiTableBodyCellProps?.sx || {})
        }
      };
    }

    return columnConfig;
  });

  return (
    <MaterialReactTable
      columns={processedColumns.map((col) => ({
        ...col,
        muiTableHeadCellProps: {
          align: 'center',
          sx: mergedStyles.headerCell
        },
        muiTableBodyCellProps: {
          ...col.muiTableBodyCellProps,
          sx: {
            ...mergedStyles.bodyCell,
            ...(col.muiTableBodyCellProps?.sx || {})
          }
        }
      }))}
      data={data}
      enablePagination={true}
      enableColumnOrdering={false}
      enableColumnActions={false}
      enableFullScreenToggle={true}
      initialState={{
        pagination: { pageSize: 20, pageIndex: 0 },
        isFullScreen: isListView,
        density: 'compact'
      }}
      muiTablePaginationProps={{
        rowsPerPageOptions: [10, 20, 50, 100]
      }}
      localization={{
        toggleDensity: 'Wide View'
      }}
      muiTableContainerProps={{
        sx: mergedStyles.tableContainer
      }}
      muiTableProps={{
        sx: {
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #E5E7EB'
        }
      }}
      muiTableBodyRowProps={({ row }) => {
        const rowData = row.original;
        const particulars = rowData?.Particulars?.toLowerCase() || '';

        const isOpeningBalance = particulars.includes('opening balance');
        const isClosingBalance = particulars.includes('closing balance');
        const totalBalance = particulars.includes('total');

        return {
          sx: {
            ...mergedStyles.row,
            ...(isOpeningBalance && mergedStyles.openingBalanceRow),
            ...(isClosingBalance && mergedStyles.closingBalanceRow),
            ...(totalBalance && mergedStyles.totalBalanceRow)
          }
        };
      }}
      renderBottomToolbarCustomActions={() => (
        <Box sx={mergedStyles.summaryFooter}>
          {sumFields.map((field) => (
            <Box key={field} sx={{ marginLeft: 3 }}>
              {sumFieldLabels[field] || field}: {formatNumberWithCommas(sums[field])}
            </Box>
          ))}
        </Box>
      )}
      renderTopToolbarCustomActions={() => (
        <Box sx={{ marginLeft: '20px' }}>
          <ActionButton
            title="Download Excel"
            icon={FileDownloadIcon}
            onClick={() => handleExportToExcel({ columns, data, fileName, filters, logo: listViewData[0]?.companyLogo, userName })}
          />
          <ActionButton
            title="Download PDF"
            icon={PictureAsPdfIcon}
            onClick={() => handleExportToPDF({ columns, data, fileName, filters, logo: listViewData[0]?.companyLogo })}
          />
          <Box
            sx={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
              padding: '6px 8px',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px'
            }}
          >
            {filters.branch && (
              <Tooltip title="Branch">
                <Box sx={{ cursor: 'pointer', fontSize: '10px' }}>
                  <strong>{filters.branch}</strong>
                </Box>
              </Tooltip>
            )}
            {filters.partyType && filters.partyType !== 'All' && (
              <Tooltip title="Party Type">
                <Box sx={{ cursor: 'pointer', fontSize: '10px' }}>
                  <strong>{filters.partyType}</strong>
                </Box>
              </Tooltip>
            )}

            {filters.partyName && filters.partyName !== 'All' && (
              <Tooltip title="Party Name">
                <Box sx={{ cursor: 'pointer', fontSize: '10px' }}>
                  <strong>{filters.partyName}</strong>
                </Box>
              </Tooltip>
            )}

            {filters.fromDate && (
              <Tooltip title="From Date">
                <Box sx={{ cursor: 'pointer', fontSize: '10px' }}>
                  <strong>{dayjs(filters.fromDate).format('DD-MM-YYYY')}</strong>
                </Box>
              </Tooltip>
            )}

            <span style={{ fontSize: '10px' }}>To</span>

            {filters.toDate && (
              <Tooltip title="To Date">
                <Box sx={{ cursor: 'pointer', fontSize: '10px' }}>
                  <strong>{dayjs(filters.toDate).format('DD-MM-YYYY')}</strong>
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export default CommonFilePL;
