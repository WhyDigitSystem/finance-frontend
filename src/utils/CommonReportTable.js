import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';

// CSV Configuration
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true
});

const formatDate = (value) => {
  return value ? dayjs(value).format('DD-MM-YYYY') : '-';
};

const applyDateFormattingToColumns = (columns) => {
  return columns.map((column) => {
    if (column.accessorKey && column.accessorKey.toLowerCase().includes('date')) {
      return {
        ...column,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return formatDate(value);
        }
      };
    }
    return column;
  });
};

const CommonReportTable = ({ columns, data }) => {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const formattedColumns = applyDateFormattingToColumns(columns);

  return (
    <MaterialReactTable
      columns={formattedColumns} // Use formatted columns
      data={data}
      enableRowSelection={true} // Enable row selection
      columnFilterDisplayMode="popover" // Display filter in popover
      paginationDisplayMode="pages" // Use paginated view
      positionToolbarAlertBanner="bottom" // Position toolbar alert at the bottom
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap'
          }}
        >
          <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Export Page Rows
          </Button>
          <Button
            disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
          >
            Export Selected Rows
          </Button>
        </Box>
      )}
    />
  );
};

export default CommonReportTable;
