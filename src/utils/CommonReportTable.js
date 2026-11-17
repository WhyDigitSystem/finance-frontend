import React, { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Typography, Chip, Paper, Grid } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import ActionButton from 'utils/ActionButton';
import { useTheme } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const formatDate = (value) => (value ? dayjs(value).format('DD-MM-YYYY') : '-');

const CommonReportTable = ({
  columns,
  data,
  isListView,
  fileName,
  handleDownloadExcel,
  handleDownloadPdf,
  sumFields = [],
  headerFields = [],
  showDownloadButtonsPdf = true,
  showDownloadButtonsExcel = true,

  // ✅ API-provided totals + flag to suppress the bottom totals row
  totals = {},
  hideTotals = false,

  // ✅ NEW: Show cards on top
  showTopCards = true,

  filters = [],
  onFilterDone = () => { }
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const theme = useTheme();

  const chipSX = { height: 24, padding: '0 6px' };
  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 18,
    fontSize: '11px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light,
    marginRight: '5px',
    height: 18,
    fontSize: '10px',
    textAlign: 'center'
  };
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: fileName
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  // ✅ Internal calc as fallback (only used when API totals not provided)
  const sums = sumFields.reduce((acc, field) => {
    acc[field] = data.reduce((total, row) => total + parseFloat(row[field] || 0), 0);
    return acc;
  }, {});

  // ✅ Prefer API-provided totals; fall back to internal sums
  const resolvedTotals = sumFields.reduce((acc, field) => {
    const apiValue = totals?.[field];
    acc[field] = apiValue !== undefined && apiValue !== null ? Number(apiValue) : sums[field];
    return acc;
  }, {});

  const sumFieldLabels = {
    TotalInvAmountLC: 'Total Amount',
    TotalTaxAmountLC: 'Tax Amount',
    TotalAmount: 'Total Amount',
    Tax: 'Tax Amount',
    BillAmount: 'Bill Amount',
    outstanding: 'OutStanding',
    receiptAmt: 'Total Receipt Amount',
    onAccount: 'Total On Account'
  };

  // ✅ Generate Top Cards dynamically based on sumFields
  const topCardsData = [];
  if (showTopCards) {
    sumFields.forEach((field, index) => {
      const colors = ['#3f8600', '#d46b08', '#cf1322']; // Green, Orange, Red
      topCardsData.push({
        label: sumFieldLabels[field] || field,
        value: (resolvedTotals[field] ?? 0).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        color: colors[index % colors.length],
      });
    });
  }

  const customColumns = columns.map((column) => {
    if (column.accessorKey?.toLowerCase().includes('date')) {
      return {
        ...column,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value ? formatDate(value) : '';
        }
      };
    }

    if (column.accessorKey === 'active') {
      return {
        ...column,
        Cell: ({ cell }) => (
          <Chip label={cell.getValue() === true ? 'Active' : 'Inactive'} sx={cell.getValue() === true ? chipSuccessSX : chipErrorSX} />
        )
      };
    }
    if (column.accessorKey === 'status') {
      return {
        ...column,
        Cell: ({ cell }) => (
          <Chip label={cell.getValue() === 'SUBMIT' ? 'SUBMIT' : 'EDIT'} sx={cell.getValue() === 'SUBMIT' ? chipSuccessSX : chipErrorSX} />
        )
      };
    }
    if (column.accessorKey === 'closed') {
      return {
        ...column,
        Cell: ({ cell }) => (
          <Chip label={cell.getValue() === 'Yes' ? 'Yes' : 'No'} sx={cell.getValue() === 'Yes' ? chipSuccessSX : chipErrorSX} />
        )
      };
    }

    return column;
  });

  const customLocalization = {
    toggleDensity: 'Wide View'
  };

  return (
    // Changed gap: 0 so it sits flush inside the table container if wrapped
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>

      {/* ✅ TOP SUMMARY CARDS */}
      {showTopCards && topCardsData.length > 0 && (
        <Grid
          container
          spacing={1.5}
          sx={{
            mb: 1.5,
            mt: 0.5,
            px: 1 // slight padding to align with table
          }}
        >
          {topCardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '8px 14px', // Reduced padding
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  borderLeft: `4px solid ${card.color}`, // Thinner left border
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
                  height: '100%',
                  minHeight: '56px' // Reduced height
                }}
              >
                {/* Smaller label font */}
                <Typography sx={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, mb: 0.25 }}>
                  {card.label}
                </Typography>
                {/* Smaller value font */}
                <Typography sx={{ fontSize: '16px', color: card.color, fontWeight: 700, lineHeight: 1.1 }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Data Table */}
      <MaterialReactTable
        data={data}
        columns={customColumns.map((col) => ({
          ...col,
          muiTableHeadCellProps: {
            sx: {
              backgroundColor: '#2d3e98',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '12px',
              borderBottom: '2px solid #D1D5DB',
              borderRight: '1px solid #D1D5DB',
              borderLeft: '1px solid #D1D5DB'
            },
            align: 'center'
          },
          muiTableBodyCellProps: {
            sx: {
              fontSize: '11px',
              color: '#374151',
              borderBottom: '1px solid #E5E7EB',
              borderRight: '1px solid #E5E7EB',
              borderLeft: '1px solid #E5E7EB',
              padding: '2px 4px'
            }
          }
        }))}
        enableColumnOrdering={false}
        enableColumnActions={false}
        enableFullScreenToggle={true}
        initialState={{ density: 'compact' }}
        localization={customLocalization}
        muiTableContainerProps={{
          sx: {
            width: '100vw',
            maxWidth: '100%',
            maxHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }
        }}
        muiTableProps={{
          sx: {
            backgroundColor: '#FFFFFF',
            color: 'black',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB'
          }
        }}
        muiTableBodyRowProps={{
          sx: {
            height: '26px',
            '&:nth-of-type(even)': { backgroundColor: '#F9FAFB' },
            '&:hover': {
              backgroundColor: '#E5E7EB',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              transition: '0.2s ease-in-out'
            }
          }
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {userType !== 'OPERATIONS' && userType !== 'FINANCE MANAGER' && showDownloadButtonsExcel && (
                <ActionButton
                  title="Download Excel"
                  icon={FileDownloadIcon}
                  onClick={handleDownloadExcel}
                  isLoading={isLoading}
                  margin="0 8px 0 8px"
                />
              )}
              {userType !== 'OPERATIONS' && userType !== 'FINANCE MANAGER' && showDownloadButtonsPdf && (
                <ActionButton
                  title="Download PDF"
                  icon={PictureAsPdfIcon}
                  onClick={handleDownloadPdf}
                  isLoading={isLoading}
                  margin="0 8px 0 8px"
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: '32px',
                rowGap: '10px'
              }}
            >
              {headerFields.map(({ label, value }, idx) => (
                <Box key={idx} sx={{ fontSize: '14px', minWidth: '160px', marginTop: '8px' }}>
                  {label ? (
                    <>
                      <strong style={{ color: '#171c24', fontWeight: '700' }}>{label}:</strong>{' '}
                      <span style={{ color: '#374151' }}>{value}</span>
                    </>
                  ) : (
                    <span style={{ color: '#374151' }}>{value}</span>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
        // ✅ Hide the bottom totals row when API already returned a TOTAL row
        renderBottomToolbarCustomActions={() =>
          hideTotals ? null : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 20px',
                fontWeight: 'bold'
              }}
            >
              {sumFields.map((field) => (
                <Box key={field} sx={{ marginLeft: 3 }}>
                  {sumFieldLabels[field] || field}:{' '}
                  {(resolvedTotals[field] ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </Box>
              ))}
            </Box>
          )
        }
      />
    </Box>
  );
};

export default CommonReportTable;