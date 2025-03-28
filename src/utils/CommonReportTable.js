import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MaterialReactTable } from 'material-react-table';
import dayjs from 'dayjs';
import {
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

const CommonReportTable = ({ columns, data,isListView  }) => {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };
  const theme = useTheme();

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
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };
  const formattedColumns = applyDateFormattingToColumns(columns);
  // const customColumns = columns.map((column) => {
  //   if (column.accessorKey === 'active') {
  //     return {
  //       ...column,

  //       Cell: ({ cell }) => (
  //         <Chip 
  //           label={cell.getValue() === true 
  //             ? 'Active' 
  //             : cell.getValue() 
  //               ? dayjs(cell.getValue()).format('DD-MM-YYYY') 
  //               : 'Inactive'}
  //           sx={cell.getValue() === true ? chipSuccessSX : chipErrorSX} 
  //         />

  //         // <Chip label={cell.getValue() === true ? 'Active' : 'Inactive'} sx={cell.getValue() === true ? chipSuccessSX : chipErrorSX} />
  //       )
  //     };
  //   }
  //   // if (column.accessorKey && column.accessorKey.toLowerCase().includes('date')) {
  //   //   return {
  //   //     ...column,
  //   //     Cell: ({ cell }) => {
  //   //       const value = cell.getValue();
  //   //       return value ? dayjs(value).format('DD-MM-YYYY') : '-';
  //   //     }
  //   //   };
  //   // }
  //   return column;
  // });
  const customColumns = formattedColumns.map((column) => {
    if (column.accessorKey === 'active') {
      return {
        ...column,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Chip 
              label={value === true ? 'Active' : value === false ? 'Inactive' : formatDate(value)}
              sx={value === true ? chipSuccessSX : chipErrorSX} 
            />
          );
        }
      };
    } else if (column.accessorKey && column.accessorKey.toLowerCase().includes('date')) {
      return {
        ...column,
        Cell: ({ cell }) => formatDate(cell.getValue())
      };
    }
    return column;
  }); 
  const customLocalization = {
    toggleDensity: "Wide View",
  };
  return (
    <MaterialReactTable
      displayColumnDefOptions={{
        "mrt-row-actions": {
          muiTableHeadCellProps: {
            align: "center",
            sx: {
              backgroundColor: "#2d3e98",
              color: "white",
              fontWeight: "bold",
              // height: "40px",
              borderBottom: "2px solid #D1D5DB",
            },
          },
          size: 100,
        },
      }}

      columns={customColumns.map((col) => ({
        ...col,
        muiTableHeadCellProps: {
          sx: {
            backgroundColor: "#2d3e98",
            color: "white",
            fontWeight: "bold",
            fontSize: "13px",
            textAlign: "left",
            borderBottom: "2px solid #D1D5DB",
          },
        },
        muiTableBodyCellProps: {
          sx: {
            fontSize: "14px",
            color: "#374151",
            textAlign: "left",
            borderBottom: "1px solid #E5E7EB",
          },
        },
      }))}
      data={data}
      enableColumnOrdering={false}
      enableColumnActions={false}
      enableFullScreenToggle={true}
      // enableEditing={enableEditing}
      // renderRowActions={renderRowActions}
      initialState={{
        isFullScreen: isListView ? true : false,
        density: "compact",
      }}
      localization={customLocalization}
      muiTableContainerProps={{
        sx: {
          width: "100vw",
          height: "100vh",
          maxWidth: "100%",
          maxHeight: "100%",
          background: "#FFFFFF",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E5E7EB",
        },
      }}
      muiTableProps={{
        sx: {
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
        },
      }}
      muiTableBodyRowProps={{
        sx: {
          height: "42px",
          "&:nth-of-type(even)": { backgroundColor: "#F9FAFB" },
          "&:hover": {
            backgroundColor: "#E5E7EB",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "0.2s ease-in-out",
          },
        },
      }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
          // <Stack
          direction="row"
          spacing={2}
          sx={{
            marginLeft: "20px",
          }}
        // </Stack>
          >
            <Button onClick={handleExportData} startIcon={<FileDownloadIcon />} color="#34449b" variant="outlined"
                  style={{ textTransform: 'none', padding: '4px 8px', marginTop: '6px' }}>
              Download
            </Button>
            {/* <Button
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
            </Button> */}
          </Box>
      )}
    />
  );
};

export default CommonReportTable;
