import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, IconButton, Chip, useTheme } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import ActionButton from 'utils/ActionButton';
import Tooltip from '@mui/material/Tooltip';

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
    padding: '1px 2px',
    lineHeight: '1.2',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '11px',
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
  //
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
  // partyName,
  // partyType,
  formData,
  columns,
  data,
  isListView,
  fileName,
  sumFields = [],
  filters = {},
  styles = {},
  numericFields = ['debit', 'credit', 'amount', 'balance'] // Default numeric fields to format
}) => {
  const mergedStyles = {
    ...defaultStyles,
    ...styles
  };

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

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: fileName
  });

  // const handleExportToExcel = ({ columns, data, fileName = 'Report', filters = {} }) => {
  //   const header = columns.map((col) => col.header || col.accessorKey);
  //   const exportData = data.map((row) =>
  //     columns.map((col) => {
  //       const key = col.accessorKey;
  //       let value = row[key];
  //       if (key?.toLowerCase().includes('date')) {
  //         value = formatDate(value);
  //       } else if (numericFields.some((field) => key.toLowerCase().includes(field))) {
  //         value = formatNumberWithCommas(value);
  //       }
  //       return value ?? '';
  //     })
  //   );

  //   const filterRows = [
  //     [`${fileName} Report`],
  //     // [`Customer: ${filters.customer || '-'}`],
  //     [`Party Type: ${filters.partyType || '-'}`],
  //     [`Party Name: ${filters.partyName || '-'}`],
  //     // [`Branch: ${filters.branch || '-'}`],
  //     [],
  //     header
  //   ];

  //   const finalData = [...filterRows, ...exportData];
  //   const worksheet = XLSX.utils.aoa_to_sheet(finalData);

  //   worksheet['A1'].s = {
  //     font: { sz: 16, bold: true },
  //     alignment: { horizontal: 'left' }
  //   };

  //   header.forEach((_, idx) => {
  //     const cellRef = XLSX.utils.encode_cell({ r: 4, c: idx });
  //     worksheet[cellRef].s = {
  //       font: { bold: true, color: { rgb: 'FFFFFF' } },
  //       fill: { fgColor: { rgb: '34449B' }, patternType: 'solid' },
  //       alignment: { horizontal: 'center' }
  //     };
  //   });

  //   exportData.forEach((row, rowIndex) => {
  //     const dataRowIndex = rowIndex + 5;
  //     const particularsIndex = columns.findIndex((col) => col.accessorKey === 'Particulars');
  //     const particularsValue = row[particularsIndex]?.toLowerCase?.() || '';

  //     if (particularsValue.includes('opening balance') || particularsValue.includes('closing balance')) {
  //       const bgColor = particularsValue.includes('opening') ? 'D1E7DD' : 'F8D7DA';

  //       row.forEach((_, colIndex) => {
  //         const cellRef = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });
  //         if (worksheet[cellRef]) {
  //           worksheet[cellRef].s = {
  //             ...worksheet[cellRef].s,
  //             fill: { fgColor: { rgb: bgColor }, patternType: 'solid' },
  //             font: { bold: true }
  //           };
  //         }
  //       });
  //     }
  //   });

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName}.xlsx`);
  // };

  const handleExportToExcel = ({ columns, data, fileName = 'Report', filters = {} }) => {
    const header = columns.map((col) => col.header || col.accessorKey);

    // Identify numeric columns (based on known numeric field names)
    const numericColumns = columns
      .filter((col) => numericFields.some((field) => col.accessorKey?.toLowerCase().includes(field)))
      .map((col) => columns.findIndex((c) => c.accessorKey === col.accessorKey));

    // Transform data rows to match export format
    const exportData = data.map((row) =>
      columns.map((col) => {
        const key = col.accessorKey;
        let value = row[key];
        if (key?.toLowerCase().includes('date')) {
          value = formatDate(value);
        } else if (numericFields.some((field) => key.toLowerCase().includes(field))) {
          value = formatNumberWithCommas(value);
        }
        return value ?? '';
      })
    );

    // Add filters and headers
    const filterRows = [
      [`${fileName} Report`],
      [
        `${filters.partyType || '-'}`,
        `${filters.partyName || '-'}`,
        `${filters.fromDate ? dayjs(filters.fromDate).format('DD-MM-YYYY') : '-'}`,
        `To`,
        `${filters.toDate ? dayjs(filters.toDate).format('DD-MM-YYYY') : '-'}`
      ],
      [],
      header
    ];

    const finalData = [...filterRows, ...exportData];
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // Style title row (first row)
    worksheet['A1'].s = {
      font: { name: 'Calibri', sz: 16, bold: true },
      // font: { sz: 16, bold: true },
      alignment: { horizontal: 'left' }
    };

    // Style header row (row 6 = index 5)
    header.forEach((_, idx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 3, c: idx });
      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '34449B' }, patternType: 'solid' },
        alignment: { horizontal: 'center' }
      };
    });

    // Style data rows
    exportData.forEach((row, rowIndex) => {
      const dataRowIndex = rowIndex + 4; // Data starts after 7th row (0-indexed)

      // Right-align numeric columns
      numericColumns.forEach((colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            ...(worksheet[cellRef].s || {}),
            alignment: { horizontal: 'right' }
          };
        }
      });

      // Style Opening/Closing/Total rows
      const particularsIndex = columns.findIndex((col) => col.accessorKey?.toLowerCase() === 'particulars');
      const particularsValue = row[particularsIndex]?.toString().toLowerCase() || '';

      if (
        particularsValue.includes('opening balance') ||
        particularsValue.includes('closing balance') ||
        particularsValue.includes('total')
      ) {
        let bgColor = '';
        if (particularsValue.includes('opening')) {
          bgColor = '#D1E7DD';
        } else if (particularsValue.includes('closing')) {
          bgColor = '#FCD1D1';
        } else if (particularsValue.includes('total')) {
          bgColor = '#f5d9b0';
        }

        const excelColor = bgColor.replace('#', '');

        // Apply background to all columns in the row
        columns.forEach((_, colIndex) => {
          const cellRef = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = {
              ...(worksheet[cellRef].s || {}),
              fill: { fgColor: { rgb: excelColor }, patternType: 'solid' },
              font: { bold: true }
            };
          }
        });
      }
    });

    // Column widths
    const colWidths = header.map(() => ({ wch: 20 }));
    worksheet['!cols'] = colWidths;

    // Create and export workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      `${fileName}.xlsx`
    );
  };

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

    if (column.accessorKey?.toLowerCase().includes('date')) {
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

    // Format numeric fields with commas
    if (column.accessorKey && numericFields.some((field) => column.accessorKey.toLowerCase().includes(field))) {
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
        //

        //
        muiTableBodyCellProps: {
          ...col.muiTableBodyCellProps,
          sx: {
            ...mergedStyles.bodyCell,
            ...(col.muiTableBodyCellProps?.sx || {})
          }
        }
      }))}
      data={data}
      //
      enablePagination={true}
      //
      enableColumnOrdering={false}
      enableColumnActions={false}
      enableFullScreenToggle={true}
      initialState={{
        //
        pagination: { pageSize: 20, pageIndex: 0 },
        //
        isFullScreen: isListView,
        density: 'compact'
      }}
      //
      muiTablePaginationProps={{
        rowsPerPageOptions: [10, 20, 50, 100]
      }}
      //
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
          {/* <IconButton
            onClick={() => handleExportToExcel({ columns, data, fileName, filters })}
            // sx={mergedStyles.exportButton}
            title="Download"
          > */}
          {/* <FileDownloadIcon /> */}
          <ActionButton
            title="Download"
            icon={FileDownloadIcon}
            onClick={() => handleExportToExcel({ columns, data, fileName, filters })}
          />
          {/* </IconButton> */}
          {/*  */}
          {/* <Box
            sx={{
              display: 'inline-flex',
              gap: 2,
              ml: 2,
              fontSize: '10px'
            }}
          >
            {filters.partyType && filters.partyType !== 'All' && (
              <Tooltip title={`Party Type`}>
                <Box sx={{ marginTop: '8px', cursor: 'pointer' }}>
                  <strong>{filters.partyType}</strong>
                </Box>
              </Tooltip>
            )}
            {filters.partyName && filters.partyName !== 'All' && (
              <Tooltip title={`Party Name`}>
                <Box sx={{ marginTop: '8px', cursor: 'pointer' }}>
                  <strong>{filters.partyName}</strong>
                </Box>
              </Tooltip>
            )}
          </Box>
          {filters.fromDate && (
            <Tooltip title={`From Date`}>
              <Box
                sx={{
                  marginTop: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  marginRight: '8px',
                  marginLeft: '12px',
                  fontSize: '10px'
                }}
              >
                <strong>{dayjs(filters.fromDate).format('DD-MM-YYYY')}</strong>
              </Box>
            </Tooltip>
          )}

          <span style={{ marginRight: '8px' }}>To</span>

          {filters.toDate && (
            <Tooltip title={`To Date`}>
              <Box sx={{ marginTop: '8px', cursor: 'pointer', display: 'inline-block', fontSize: '10px' }}>
                <strong>{dayjs(filters.toDate).format('DD-MM-YYYY')}</strong>
              </Box>
            </Tooltip>
          )} */}

          {/* {filters.fromDate && (
              <Tooltip title={`From Date`}>
                <Box sx={{ marginTop: '8px', cursor: 'pointer' }}>
                  <strong>{dayjs(filters.fromDate).format('DD-MM-YYYY')}</strong>
                </Box>
              </Tooltip>
            )}
            'To'
            {filters.toDate && (
              // <Tooltip title={`To Date: ${dayjs(filters.toDate).format('DD-MM-YYYY')}`}>
              <Tooltip title={`To Date`}>
                <Box sx={{ marginTop: '8px', cursor: 'pointer' }}>
                  <strong>{dayjs(filters.toDate).format('DD-MM-YYYY')}</strong>
                </Box>
              </Tooltip>
            )} */}
          {/*  */}
          <Box
            sx={{
              // display: 'flex',
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
              padding: '6px 8px',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px'
              // margin: '10px 0'
            }}
          >
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

          {/*  */}
        </Box>
      )}
    />
  );
};

export default CommonFilePL;
