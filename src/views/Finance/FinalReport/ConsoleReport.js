import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Autocomplete,
  FormControl,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer } from 'react-toastify';
import { showToast } from 'utils/toast-component';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import CMRT2 from 'utils/CMRT2';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ALL_CUSTOMER = { partyName: 'All' };

const ConsoleReport = () => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      asOnDate: dayjs(),
      customer: ALL_CUSTOMER
    }
  });

  const [customerList, setCustomerList] = useState([ALL_CUSTOMER]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [listView, setListView] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [listViewData, setListViewData] = useState([]);

  const orgId = localStorage.getItem('orgId');

  // ============================================================
  // SUMMARY COMPUTATION
  // ============================================================

  const summary = useMemo(() => {
    return getData.reduce(
      (acc, row) => {
        acc.totalReceipt += Number(row.receiptAmount || 0);
        acc.totalOnAccount += Number(row.onAccount || 0);
        acc.count += 1;
        return acc;
      },
      {
        totalReceipt: 0,
        totalOnAccount: 0,
        count: 0
      }
    );
  }, [getData]);

  // ============================================================
  // TABLE COLUMNS
  // ============================================================

  const consoleColumns = useMemo(
    () => [
      {
        accessorKey: 'customerName',
        header: 'Customer',
        size: 200,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
      },
      {
        accessorKey: 'billedMonthYear',
        header: 'Billed Month',
        size: 130,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
      },
      {
        accessorKey: 'chequeUtiNo',
        header: 'UTI',
        size: 180,
        Cell: ({ cell }) => (
          <div
            style={{
              textAlign: 'left',
              padding: '8px',
              fontSize: '0.8rem'
            }}
          >
            {cell.getValue() || '-'}
          </div>
        )
      },
      {
        accessorKey: 'chequeUtiDate',
        header: 'UTI Date',
        size: 130,
        Cell: ({ cell }) => (
          <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}</div>
        )
      },
      {
        accessorKey: 'receiptAmount',
        header: 'Receipt Amt',
        size: 120,
        Cell: ({ cell }) => (
          <div
            style={{
              textAlign: 'right',
              padding: '8px',
              fontWeight: 600,
              color: '#1b5e20'
            }}
          >
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              : '-'}
          </div>
        )
      },
      {
        accessorKey: 'onAccount',
        header: 'On Account',
        size: 110,
        Cell: ({ cell }) => (
          <div
            style={{
              textAlign: 'right',
              padding: '8px',
              color: '#b26a00'
            }}
          >
            {cell.getValue() !== undefined && cell.getValue() !== null
              ? Number(cell.getValue()).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              : '-'}
          </div>
        )
      },
      {
        accessorKey: 'entity',
        header: 'Entity',
        size: 130,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
      },
      {
        accessorKey: 'docId',
        header: 'Doc Id',
        size: 130,
        Cell: ({ cell }) => (
          <div
            style={{
              textAlign: 'left',
              padding: '8px',
              fontWeight: 600,
              color: '#34449B'
            }}
          >
            {cell.getValue() || '-'}
          </div>
        )
      },
      {
        accessorKey: 'docDate',
        header: 'Doc Date',
        size: 110,
        Cell: ({ cell }) => (
          <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}</div>
        )
      },
      {
        accessorKey: 'statusDisplay',
        header: 'Status',
        size: 110,
        enableEditing: false,
        enableColumnActions: false,
        enableSorting: true,
        Cell: ({ row }) => {
          const value = row.original?.status;

          const colorMap = {
            Approved: {
              bg: '#e8f5e9',
              color: '#1b5e20'
            },
            Pending: {
              bg: '#fff8e1',
              color: '#b26a00'
            },
            Rejected: {
              bg: '#ffebee',
              color: '#b71c1c'
            }
          };

          const scheme = colorMap[value] || {
            bg: '#eeeeee',
            color: '#424242'
          };

          return (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Chip
                label={value || '-'}
                size="small"
                sx={{
                  backgroundColor: scheme.bg,
                  color: scheme.color,
                  fontWeight: 600,
                  fontSize: '0.72rem'
                }}
              />
            </div>
          );
        }
      }
    ],
    []
  );

  // ============================================================
  // FETCH CUSTOMER DROPDOWN
  // ============================================================

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);

        const parties = [ALL_CUSTOMER, ...(response?.paramObjectsMap?.partyMasterVO || [])];

        setCustomerList(parties);
        setValue('customer', ALL_CUSTOMER);
      } catch (error) {
        console.error('Error fetching customers:', error);
        showToast('error', 'Failed to load customers');
      }
    };

    if (orgId) {
      fetchDropdowns();
    }
  }, [orgId, setValue]);

  // ============================================================
  // FETCH COMPANY DETAILS
  // ============================================================

  useEffect(() => {
    const getCompanyDetails = async () => {
      try {
        const response = await apiCalls('get', `commonmaster/company/${orgId}`);

        const companyData = response?.paramObjectsMap?.companyVO || [];

        setListViewData(companyData);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    if (orgId) {
      getCompanyDetails();
    }
  }, [orgId]);

  // ============================================================
  // CLEAR FORM
  // ============================================================

  const ClearForm = () => {
    setValue('customer', ALL_CUSTOMER);
    setValue('asOnDate', dayjs());

    clearErrors();
    setIsLoading(false);
    setListView(false);
    setOpenModal(false);
    setHeaderFields([]);
    setGetData([]);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmit = async (formData) => {
    if (!formData.asOnDate || !dayjs(formData.asOnDate).isValid()) {
      showToast('error', 'Please select a valid As On Date');
      return;
    }

    setIsLoading(true);

    const { customer, asOnDate } = formData;
    const formattedAsOnDate = dayjs(asOnDate).format('YYYY-MM-DD');

    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getConsoleReport?asOnDate=${formattedAsOnDate}&partyName=${encodeURIComponent(customer?.partyName || 'All')}`
      );

      const data = response?.paramObjectsMap?.mapp || [];

      setGetData(data);
      setOpenModal(true);
      setListView(true);

      setHeaderFields([
        {
          label: 'As On Date',
          value: dayjs(asOnDate).format('DD-MM-YYYY')
        },
        {
          label: 'Customer',
          value: customer?.partyName || 'All'
        },
        {
          label: 'Total Records',
          value: data.length
        }
      ]);

      if (data.length === 0) {
        showToast('info', 'No records found for selected filters');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Report Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  // ============================================================
  // TABLE OPTIONS
  // ============================================================

  const tableOptions = {
    muiTablePaperProps: {
      sx: {
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },

    muiTableContainerProps: {
      sx: {
        maxHeight: '70vh'
      }
    },

    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
        '&:hover': {
          backgroundColor: '#f0f7ff'
        }
      }
    }),

    enableStickyHeader: true,
    enableEditing: false,
    enableRowActions: false,

    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid #e0e0e0 !important'
        }
      }
    }
  };

  // ============================================================
  // EXCEL DOWNLOAD - VISIBLE COLUMNS
  // ============================================================

  const handleDownloadExcel = async ({ table, logo } = {}) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Console Report');

      // Get currently visible columns from Material React Table
      const visibleTableColumns = typeof table?.getVisibleLeafColumns === 'function' ? table.getVisibleLeafColumns() : [];

      if (!visibleTableColumns.length) {
        showToast('error', 'Unable to identify visible table columns');
        return;
      }

      const visibleColumns = visibleTableColumns
        .map((tableColumn) => {
          const columnId = tableColumn.columnDef?.accessorKey || tableColumn.id;

          return consoleColumns.find((column) => column.accessorKey === columnId);
        })
        .filter(Boolean);

      if (!visibleColumns.length) {
        showToast('error', 'No visible columns available for Excel export');
        return;
      }

      // ========================================================
      // LOGO
      // ========================================================

      worksheet.mergeCells('A1:B4');

      if (logo) {
        try {
          const base64Data = logo.includes(',') ? logo.split(',')[1] : logo;

          if (base64Data && base64Data.length >= 100) {
            const extension = logo.includes('jpeg') || logo.includes('jpg') ? 'jpeg' : 'png';

            const imageId = workbook.addImage({
              base64: base64Data,
              extension
            });

            worksheet.addImage(imageId, {
              tl: {
                col: 0,
                row: 0
              },
              ext: {
                width: 140,
                height: 75
              }
            });
          }
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      }

      // ========================================================
      // TITLE
      // ========================================================

      worksheet.mergeCells('C2:E3');

      const titleCell = worksheet.getCell('C2');

      titleCell.value = 'Console Receipt';

      titleCell.font = {
        size: 16,
        bold: true
      };

      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      // ========================================================
      // HEADER DETAILS
      // ========================================================

      const excelHeaderFields = [
        ...headerFields,
        {
          label: 'Generated By',
          value: localStorage.getItem('userName') || 'System'
        },
        {
          label: 'Generated On',
          value: dayjs().format('DD-MM-YYYY HH:mm')
        }
      ];

      excelHeaderFields.forEach(({ label, value }, index) => {
        const cell = worksheet.getCell(5, index + 1);

        cell.value = `${label}: ${value}`;

        cell.font = {
          bold: true,
          color: {
            argb: 'FFFFFFFF'
          }
        };

        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FF593C8F'
          }
        };
      });

      // ========================================================
      // COLUMN HEADERS
      // ========================================================

      const headerRow = worksheet.addRow(visibleColumns.map((column) => column.header));

      headerRow.height = 25;

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FF3B76E2'
          }
        };

        cell.font = {
          color: {
            argb: 'FFFFFFFF'
          },
          bold: true
        };

        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true
        };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // ========================================================
      // FIELD TYPES
      // ========================================================

      const numberFields = ['receiptAmount', 'onAccount'];
      const dateFields = ['docDate', 'chequeUtiDate'];

      // ========================================================
      // DATA ROWS
      // ========================================================

      getData.forEach((row) => {
        const rowData = visibleColumns.map((column) => {
          const key = column.accessorKey;

          if (key === 'statusDisplay') {
            return row.status || '';
          }

          const value = row[key];

          if (dateFields.includes(key)) {
            return value && dayjs(value).isValid() ? dayjs(value).format('DD-MM-YYYY') : '';
          }

          if (numberFields.includes(key)) {
            return value !== undefined && value !== null && value !== '' ? Number(value) : 0;
          }

          return value ?? '';
        });

        const addedRow = worksheet.addRow(rowData);

        visibleColumns.forEach((column, index) => {
          const key = column.accessorKey;
          const cell = addedRow.getCell(index + 1);

          if (numberFields.includes(key)) {
            cell.numFmt = '#,##0.00';

            cell.alignment = {
              horizontal: 'right',
              vertical: 'middle'
            };
          }

          if (dateFields.includes(key)) {
            cell.alignment = {
              horizontal: 'center',
              vertical: 'middle'
            };
          }
        });
      });

      // ========================================================
      // TOTAL ROW
      // ========================================================

      const totalRowData = visibleColumns.map((column) => {
        const key = column.accessorKey;

        if (key === 'customerName') {
          return 'Total';
        }

        if (key === 'receiptAmount' || key === 'onAccount') {
          return getData.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
        }

        return '';
      });

      const totalRow = worksheet.addRow(totalRowData);

      totalRow.font = {
        bold: true
      };

      totalRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FFE8EAF6'
          }
        };

        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'double' }
        };
      });

      visibleColumns.forEach((column, index) => {
        if (numberFields.includes(column.accessorKey)) {
          totalRow.getCell(index + 1).numFmt = '#,##0.00';
        }
      });

      // ========================================================
      // AUTO COLUMN WIDTH
      // ========================================================

      worksheet.columns.forEach((column) => {
        let maxLength = 10;

        column.eachCell(
          {
            includeEmpty: true
          },
          (cell) => {
            const value = cell.value !== undefined && cell.value !== null ? cell.value.toString() : '';

            maxLength = Math.max(maxLength, value.length);
          }
        );

        column.width = Math.min(maxLength + 3, 45);
      });

      // ========================================================
      // FREEZE HEADER
      // ========================================================

      worksheet.views = [
        {
          state: 'frozen',
          ySplit: 6
        }
      ];

      // ========================================================
      // DOWNLOAD FILE
      // ========================================================

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, `Console_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);

      showToast('success', 'Excel downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      showToast('error', 'Excel download failed');
    }
  };

  // ============================================================
  // SUMMARY CARD
  // ============================================================

  const SummaryCard = ({ label, value, color }) => (
    <div
      style={{
        flex: '1 1 180px',
        background: '#fff',
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: '10px 16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        minWidth: 180
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: '#666',
          fontWeight: 500
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 18,
          color,
          fontWeight: 700,
          marginTop: 4
        }}
      >
        {value}
      </div>
    </div>
  );

  // ============================================================
  // SUMMARY BAR
  // ============================================================

  const SummaryBar = () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        padding: '12px 16px',
        background: '#f5f7ff'
      }}
    >
      <SummaryCard label="Total Items" value={summary.count} color="#34449B" />

      <SummaryCard
        label="Total Receipt Amount"
        value={summary.totalReceipt.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        color="#1b5e20"
      />

      <SummaryCard
        label="Total On Account"
        value={summary.totalOnAccount.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        color="#b26a00"
      />
    </div>
  );

  // ============================================================
  // EXCEL HANDLER FOR EACH TABLE
  // IMPORTANT: CMRT2 passes { table }, not the table directly.
  // ============================================================

  const downloadExcelForTable = ({ table } = {}) => {
    handleDownloadExcel({
      table,
      logo: listViewData[0]?.companyLogo
    });
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <ToastContainer />

      {/* FILTER FORM */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="card w-full p-6 bg-base-100 shadow-xl"
          style={{
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <div className="row d-flex">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="asOnDate"
                    control={control}
                    rules={{
                      required: 'As On Date is required'
                    }}
                    render={({ field }) => (
                      <DatePicker
                        label="As On Date"
                        format="DD-MM-YYYY"
                        value={field.value || null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!errors.asOnDate,
                            helperText: errors.asOnDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>

            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="customer"
                  control={control}
                  rules={{
                    required: 'Customer is required'
                  }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={customerList}
                      getOptionLabel={(option) => option?.partyName || ''}
                      isOptionEqualToValue={(option, value) => option?.partyName === value?.partyName}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || ALL_CUSTOMER}
                      renderInput={(params) => (
                        <TextField {...params} label="Customer" error={!!errors.customer} helperText={errors.customer?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            <div className="col-md-3 mb-2">
              <div className="row d-flex ml">
                <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
                  <ActionButton title="Search" icon={SearchIcon} type="submit" />

                  <ActionButton title="Clear" icon={ClearIcon} onClick={ClearForm} />
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="d-flex justify-content-center items-center">
              <CircularProgress />
            </div>
          )}
        </div>
      </form>

      {/* REPORT MODAL */}

      <Dialog
        open={openModal}
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
            p: 0,
            px: 3,
            backgroundColor: '#34449B',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Console Receipt</span>

          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {getData && getData.length > 0 ? (
            <>
              <SummaryBar />

              <CMRT2
                data={getData}
                columns={consoleColumns}
                fileName="Console Receipt"
                headerFields={headerFields}
                handleDownloadExcel={downloadExcelForTable}
                showDownloadButtonsPdf={false}
              />
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  marginBottom: 8
                }}
              >
                📭
              </div>

              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16
                }}
              >
                No data found
              </div>

              <div
                style={{
                  fontSize: 13
                }}
              >
                Try adjusting the As On Date or Customer filter.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* OPTIONAL LIST VIEW */}

      {listView && getData && getData.length > 0 && (
        <div className="mt-4">
          <SummaryBar />

          <CMRT2
            data={getData}
            columns={consoleColumns}
            fileName="Console Receipt"
            headerFields={headerFields}
            handleDownloadExcel={downloadExcelForTable}
            isListView={true}
            showDownloadButtonsPdf={false}
          />
        </div>
      )}
    </>
  );
};

export default ConsoleReport;
