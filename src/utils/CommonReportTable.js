import React, { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import ActionButton from 'utils/ActionButton';
import { useTheme } from '@mui/material/styles';

const formatDate = (value) => (value ? dayjs(value).format('DD-MM-YYYY') : '-');

const CommonReportTable = ({
  columns,
  data,
  isListView,
  fileName,
  handleDownloadExcel,
  sumFields = [],
  headerFields = [],
  filters = [], // [{ label, value, options, onChange }]
  onFilterDone = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const chipSX = { height: 24, padding: '0 6px' };
  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28,
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light,
    marginRight: '5px',
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: fileName,
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const sums = sumFields.reduce((acc, field) => {
    acc[field] = data.reduce((total, row) => total + parseFloat(row[field] || 0), 0);
    return acc;
  }, {});

  const sumFieldLabels = {
    TotalInvAmountLC: 'Total Amount',
    TotalTaxAmountLC: 'Total Tax Amount',
    TotalAmount: 'Total Amount',
    Tax: 'Total Tax Amount',
    BillAmount: 'Bill Amount',
    outstanding: 'OutStanding',
    ndbAmnt: 'Debit',
    ncrAmnt: 'Credit',
    
  };

  const customColumns = columns.map((column) => {
    if (column.accessorKey?.toLowerCase().includes('date')) {
      return {
        ...column,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      };
    }

    if (column.accessorKey === 'active') {
      return {
        ...column,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() === true ? 'Active' : 'Inactive'}
            sx={cell.getValue() === true ? chipSuccessSX : chipErrorSX}
          />
        ),
      };
    }

    if (column.accessorKey === 'closed') {
      return {
        ...column,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() === 'Yes' ? 'Yes' : 'No'}
            sx={cell.getValue() === 'Yes' ? chipSuccessSX : chipErrorSX}
          />
        ),
      };
    }

    return column;
  });

  const customLocalization = {
    toggleDensity: 'Wide View',
  };

  return (
    <>
      {/* Header Fields (Filter Info) */}
      {/* {headerFields.length > 0 && (
        <Box
          sx={{
            margin: '3px 3px 10px',
            padding: '10px',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            backgroundColor: '#FAFAFA',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>Report Summary:</span>
            <Chip
              label={fileName || 'Generated Report'}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            />
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '32px',
              rowGap: '10px',
            }}
          >
            {headerFields.map(({ label, value }, idx) => (
              <Box key={idx} sx={{ fontSize: '14px', minWidth: '160px', marginTop: '8px' }}>
                <strong>{label}:</strong> <span style={{ color: '#374151' }}>{value}</span>
              </Box>
            ))}
          </Box>
        </Box>
      )} */}

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
              borderLeft: '1px solid #D1D5DB',
            },
            align: 'center',
          },
          muiTableBodyCellProps: {
            sx: {
              fontSize: '11px',
              color: '#374151',
              borderBottom: '1px solid #E5E7EB',
              borderRight: '1px solid #E5E7EB',
              borderLeft: '1px solid #E5E7EB',
              padding: '0px 0px',
            },
          },
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
            border: '1px solid #E5E7EB',
          },
        }}
        muiTableProps={{
          sx: {
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            height: '26px',
            '&:nth-of-type(even)': { backgroundColor: '#F9FAFB' },
            '&:hover': {
              backgroundColor: '#E5E7EB',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              transition: '0.2s ease-in-out',
            },
          },
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  gap: 1,}}>
            <Box>
              <ActionButton
                title="Download Excel"
                icon={FileDownloadIcon}
                onClick={handleDownloadExcel}
                isLoading={isLoading}
                margin="0 8px 0 8px"
              />
            </Box>  
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: '32px',
                rowGap: '10px',
              }}
            >
              {headerFields.map(({ label, value }, idx) => (
                <Box key={idx} sx={{ fontSize: '14px', minWidth: '160px', marginTop: '8px', }}>
                  <strong style={{color:'#171c24', fontWeight:'700'}}>{label}:</strong> <span style={{ color: '#374151' }}>{value}</span>
                </Box>
              ))}
            </Box>

          </Box>
        )}
        renderBottomToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '8px 20px',
              fontWeight: 'bold',
              backgroundColor: '#F3F4F6',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            {sumFields.map((field) => (
              <Box key={field} sx={{ marginLeft: 3 }}>
                {sumFieldLabels[field] || field}:{' '}
                {sums[field].toLocaleString('en-IN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ))}
          </Box>
        )}
      />
    </>
  );
};

export default CommonReportTable;
