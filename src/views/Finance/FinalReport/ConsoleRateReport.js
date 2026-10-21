import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const ConsoleRateReport = () => {
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
      customer: null
    }
  });

  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const orgId = localStorage.getItem('orgId');

  // ====== TABLE COLUMNS ======
  const consoleRateColumns = useMemo(
    () =>
      [
        {
          accessorKey: 'customerName',
          header: 'Customer',
          size: 200,
          Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'billedMonthYear',
          header: 'Billed Month',
          size: 130
        },
        {
          accessorKey: 'chequeUtiNo',
          header: 'UTI',
          size: 180
        },
        {
          accessorKey: 'chequeUtiDate',
          header: 'UTI Date',
          size: 130,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}</div>
        },
        {
          accessorKey: 'receiptAmount',
          header: 'Receipt Amt',
          size: 120,
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right', padding: 8, color: '#1b5e20' }}>
              {cell.getValue() != null
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
            <div style={{ textAlign: 'right', padding: 8, color: '#b26a00' }}>
              {cell.getValue() != null
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
          size: 130
        },
        {
          accessorKey: 'businessCategory',
          header: 'Category',
          size: 130
        },
        {
          accessorKey: 'docId',
          header: 'Doc Id',
          size: 130
        },
        {
          accessorKey: 'docDate',
          header: 'Doc Date',
          size: 110,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}</div>
        },
        {
          accessorKey: 'statusDisplay',
          header: 'Status',
          size: 110,
          enableEditing: false,
          enableColumnActions: false,
          Cell: ({ row }) => {
            const status = row.original?.status;

            const colors = {
              Approved: { bg: '#e8f5e9', color: '#1b5e20' },
              Pending: { bg: '#fff8e1', color: '#b26a00' },
              Rejected: { bg: '#ffebee', color: '#b71c1c' }
            };

            const scheme = colors[status] || {
              bg: '#eeeeee',
              color: '#424242'
            };

            return (
              <div style={{ textAlign: 'center', padding: 8 }}>
                <Chip
                  label={status || '-'}
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
      ].map((column) => ({
        ...column,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            backgroundColor: '#34449B',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            padding: '12px 8px'
          }
        }
      })),
    []
  );

  // ====== CUSTOMER DROPDOWN ======
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);

        const allOption = { partyName: 'All' };
        const customers = response?.paramObjectsMap?.partyMasterVO || [];

        setCustomerList([allOption, ...customers]);
        setValue('customer', allOption);
      } catch (error) {
        console.error('Error fetching customers:', error);
        showToast('error', 'Failed to load customers');
      }
    };

    if (orgId) fetchCustomers();
  }, [orgId, setValue]);

  // ====== COMPANY DETAILS ======
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await apiCalls('get', `commonmaster/company/${orgId}`);

        setCompanyList(response?.paramObjectsMap?.companyVO || []);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    if (orgId) fetchCompanyDetails();
  }, [orgId]);

  // ====== CLEAR FORM ======
  const ClearForm = () => {
    setValue('customer', { partyName: 'All' });
    setValue('asOnDate', dayjs());
    clearErrors();
    setGetData([]);
    setHeaderFields([]);
    setOpenModal(false);
    setIsLoading(false);
  };

  // ====== FETCH CONSOLE RATE REPORT ======
  const onSubmit = async (formData) => {
    if (!formData.asOnDate || !dayjs(formData.asOnDate).isValid()) {
      showToast('error', 'Please select a valid As On Date');
      return;
    }

    setIsLoading(true);

    const formattedDate = dayjs(formData.asOnDate).format('YYYY-MM-DD');
    const partyName = formData.customer?.partyName || 'All';

    try {
      // Same API and data as Console Report
      const response = await apiCalls(
        'get',
        `/arreceivable/getConsoleReport?asOnDate=${formattedDate}&partyName=${encodeURIComponent(partyName)}`
      );

      const data = response?.paramObjectsMap?.mapp || [];

      setGetData(data);
      setHeaderFields([
        {
          label: 'As On Date',
          value: dayjs(formData.asOnDate).format('DD-MM-YYYY')
        },
        {
          label: 'Customer',
          value: partyName
        },
        {
          label: 'Total Records',
          value: data.length
        }
      ]);

      setOpenModal(true);

      if (data.length === 0) {
        showToast('info', 'No records found for selected filters');
      }
    } catch (error) {
      console.error('Error fetching Console Rate Report:', error);
      showToast('error', 'Report Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  // ====== TABLE OPTIONS ======
  const tableOptions = {
    muiTablePaperProps: {
      sx: {
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    muiTableContainerProps: {
      sx: { maxHeight: '70vh' }
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#fff',
        '&:hover': { backgroundColor: '#f0f7ff' }
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

  // ====== EXCEL DOWNLOAD ======
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Console Rate Report');

    // Company logo
    worksheet.mergeCells('A1:B4');

    const logo = companyList[0]?.companyLogo;

    if (logo) {
      try {
        const base64Data = logo.split(',')[1] || logo;

        if (base64Data.length >= 100) {
          const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
          const imageId = workbook.addImage({
            base64: base64Data,
            extension
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 140, height: 75 }
          });
        }
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // Report title
    worksheet.mergeCells('C2:E3');
    worksheet.getCell('C2').value = 'Console Rate Report';
    worksheet.getCell('C2').font = {
      size: 16,
      bold: true
    };
    worksheet.getCell('C2').alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // Report information
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
        color: { argb: 'FFFFFFFF' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF593C8F' }
      };
    });

    // Column headers
    const headerRow = worksheet.addRow(consoleRateColumns.map((column) => column.header));

    headerRow.height = 20;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B76E2' }
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const numberFields = ['receiptAmount', 'onAccount'];

    // Report data
    getData.forEach((row) => {
      const rowData = consoleRateColumns.map((column) => {
        const key = column.accessorKey;

        if (key === 'statusDisplay') {
          return row.status || '';
        }

        if (key === 'docDate' || key === 'chequeUtiDate') {
          return row[key] ? dayjs(row[key]).format('DD-MM-YYYY') : '';
        }

        return row[key] ?? '';
      });

      const addedRow = worksheet.addRow(rowData);

      consoleRateColumns.forEach((column, index) => {
        if (numberFields.includes(column.accessorKey)) {
          addedRow.getCell(index + 1).numFmt = '#,##0.00';
        }
      });
    });

    // Auto column width
    worksheet.columns.forEach((column) => {
      let maxLength = 10;

      column.eachCell({ includeEmpty: true }, (cell) => {
        maxLength = Math.max(maxLength, String(cell.value ?? '').length);
      });

      column.width = maxLength + 2;
    });

    worksheet.views = [{ state: 'frozen', ySplit: 6 }];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, `Console_Rate_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: 20, borderRadius: 10 }}>
          <div className="row d-flex">
            {/* As On Date */}
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

            {/* Customer */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
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
                      value={field.value || null}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Customer" error={!!errors.customer} helperText={errors.customer?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            {/* Search and Clear */}
            <div className="col-md-3 mb-2">
              <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
                <ActionButton title="Search" icon={SearchIcon} type="submit" />
                <ActionButton title="Clear" icon={ClearIcon} onClick={ClearForm} />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="d-flex justify-content-center align-items-center">
              <CircularProgress />
            </div>
          )}
        </div>
      </form>

      {/* Console Rate Report Modal */}
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
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Console Rate Report</span>

          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {getData.length > 0 ? (
            <CMRT2
              data={getData}
              columns={consoleRateColumns}
              fileName="Console Rate Report"
              tableOptions={tableOptions}
              headerFields={headerFields}
              handleDownloadExcel={handleDownloadExcel}
              showDownloadButtonsPdf={false}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#666'
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>No data found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting the As On Date or Customer filter.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsoleRateReport;
