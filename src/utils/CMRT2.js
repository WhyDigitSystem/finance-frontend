import React, { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Chip } from '@mui/material';
import { generateCsv, mkConfig, download } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import ActionButton from 'utils/ActionButton';
import { useTheme } from '@mui/material/styles';

const formatDate = (value) => (value ? dayjs(value).format('DD-MM-YYYY') : '-');

const CMRT2 = ({
  columns = [],
  data = [],
  isListView,
  fileName,
  handleDownloadExcel,
  handleDownloadPdf,
  sumFields = [],
  headerFields = [],
  showDownloadButtonsPdf = true,
  showDownloadButtonsExcel = true,
  filters = [],
  onFilterDone = () => {}
}) => {
  const [isLoading] = useState(false);
  const [userType] = useState(localStorage.getItem('userType'));

  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };

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

  const sums = sumFields.reduce((acc, field) => {
    acc[field] = data.reduce((total, row) => total + (parseFloat(row[field]) || 0), 0);

    return acc;
  }, {});

  const sumFieldLabels = {
    TotalInvAmountLC: 'Total Amount',
    TotalTaxAmountLC: 'Tax Amount',
    TotalAmount: 'Total Amount',
    Tax: 'Tax Amount',
    BillAmount: 'Bill Amount',
    outstanding: 'OutStanding'
  };

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

  // ============================================================
  // EXCEL DOWNLOAD
  // Pass actual Material React Table instance to parent.
  // ============================================================

  const handleExcelClick = (table) => {
    if (typeof handleDownloadExcel !== 'function') {
      return;
    }

    handleDownloadExcel({ table });
  };

  return (
    <MaterialReactTable
      data={data}
      columns={customColumns.map((col) => ({
        ...col,

        muiTableHeadCellProps: {
          ...col.muiTableHeadCellProps,
          sx: {
            ...col.muiTableHeadCellProps?.sx,
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
          ...col.muiTableBodyCellProps,
          sx: {
            ...col.muiTableBodyCellProps?.sx,
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
      initialState={{
        density: 'compact'
      }}
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
      muiTableBodyRowProps={({ row }) => {
        const isLastRow = row.index === data.length - 1;

        return {
          sx: {
            height: '26px',

            ...(!isLastRow && {
              '&:nth-of-type(even)': {
                backgroundColor: '#F9FAFB'
              },

              '&:hover': {
                backgroundColor: '#E5E7EB',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                transition: '0.2s ease-in-out'
              }
            }),

            ...(isLastRow && {
              backgroundColor: '#FBEFEF',
              fontWeight: 'bold',
              border: 'none',

              '& td': {
                backgroundColor: '#FBEFEF',
                fontWeight: 'bold',
                fontSize: '12px',
                border: 'none'
              }
            })
          }
        };
      }}
      // ==========================================================
      // TOP TOOLBAR
      // ==========================================================

      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            width: '100%',
            flexWrap: 'wrap'
          }}
        >
          {userType !== 'OPERATIONS' && userType !== 'FINANCE MANAGER' && showDownloadButtonsExcel && (
            <Box>
              <ActionButton
                title="Download Excel"
                icon={FileDownloadIcon}
                onClick={() => handleExcelClick(table)}
                isLoading={isLoading}
                margin="0 8px 0 8px"
              />
            </Box>
          )}

          {showDownloadButtonsPdf && userType !== 'OPERATIONS' && userType !== 'FINANCE MANAGER' && (
            <Box>
              <ActionButton
                title="Download PDF"
                icon={PictureAsPdfIcon}
                onClick={handleDownloadPdf}
                isLoading={isLoading}
                margin="0 8px 0 8px"
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '32px',
              rowGap: '10px'
            }}
          >
            {headerFields.map(({ label, value }, idx) => (
              <Box
                key={idx}
                sx={{
                  fontSize: '14px',
                  minWidth: '160px',
                  marginTop: '8px'
                }}
              >
                {label ? (
                  <>
                    <strong
                      style={{
                        color: '#171c24',
                        fontWeight: '700'
                      }}
                    >
                      {label}:
                    </strong>{' '}
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
      // ==========================================================
      // BOTTOM TOOLBAR - SUMMARY TOTALS
      // ==========================================================

      renderBottomToolbarCustomActions={() => (
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
              {sums[field].toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </Box>
          ))}
        </Box>
      )}
    />
  );
};

export default CMRT2;
