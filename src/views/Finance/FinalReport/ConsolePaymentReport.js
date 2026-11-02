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

const ALL_CATEGORY = { category: 'All' };
const ALL_SUPPLIER = { partyName: 'All' };

// ================= MAP API RESPONSE =================
const mapPaymentRow = (row) => ({
  partyName: row.partyname,
  docId: row.docid,
  docDate: row.docdate,
  purVoucherNo: row.purvoucherno,
  purVoucherDate: row.purvoucherdate,
  paymentAmt: row.paymentamt,
  chequeNo: row.chequeno,
  chequeDate: row.chequedate,
  payTo: row.payto,
  onAccount: row.onaccount,
  paymentStatus: row.status,
  entity: row.entity,
  finYear: row.finyear,
  billedMonthYear: row.billedmonthyear,
  businessCate: row.bussinesscate
});

// ================= FORMAT HELPERS =================
const formatAmount = (value) =>
  value != null && value !== ''
    ? Number(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : '-';

const formatDate = (value) => (value && dayjs(value).isValid() ? dayjs(value).format('DD-MM-YYYY') : '-');

const STATUS_COLORS = {
  Approved: { bg: '#e8f5e9', color: '#1b5e20' },
  Pending: { bg: '#fff8e1', color: '#b26a00' },
  Rejected: { bg: '#ffebee', color: '#b71c1c' }
};

// ================= SUMMARY CARD =================
const SummaryCard = ({ label, value, color }) => (
  <div
    style={{
      flex: '1 1 180px',
      minWidth: 160,
      background: '#fff',
      borderRadius: 8,
      padding: '12px 16px',
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
    }}
  >
    <div
      style={{
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        fontWeight: 500
      }}
    >
      {label}
    </div>

    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        color
      }}
    >
      {value}
    </div>
  </div>
);

const ConsolePaymentReport = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      asOnDate: dayjs(),
      category: ALL_CATEGORY,
      supplier: ALL_SUPPLIER
    }
  });

  const [categoryList, setCategoryList] = useState([ALL_CATEGORY]);
  const [supplierList, setSupplierList] = useState([ALL_SUPPLIER]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const selectedCategory = watch('category');

  // ================= SUMMARY CALCULATIONS =================
  const summary = useMemo(() => {
    const total = (field) => getData.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);

    return {
      count: getData.length,
      totalPayment: total('paymentAmt'),
      totalOnAccount: total('onAccount')
    };
  }, [getData]);

  // ================= SUMMARY BAR =================
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
      <SummaryCard label="Total Records" value={summary.count} color="#34449B" />

      <SummaryCard label="Total Payment Amount" value={formatAmount(summary.totalPayment)} color="#1b5e20" />

      <SummaryCard label="Total On Account" value={formatAmount(summary.totalOnAccount)} color="#b26a00" />
    </div>
  );

  // ================= TABLE COLUMNS =================
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'partyName',
          header: 'Party Name',
          size: 220,
          Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'businessCate',
          header: 'Category',
          size: 140,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'purVoucherNo',
          header: 'Pur Voucher No',
          size: 180,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'purVoucherDate',
          header: 'Pur Voucher Date',
          size: 150,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{formatDate(cell.getValue())}</div>
        },
        {
          accessorKey: 'paymentAmt',
          header: 'Payment Amt',
          size: 150,
          Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: 8 }}>{formatAmount(cell.getValue())}</div>
        },
        {
          accessorKey: 'chequeNo',
          header: 'Cheque No',
          size: 150,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'chequeDate',
          header: 'Cheque Date',
          size: 130,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{formatDate(cell.getValue())}</div>
        },
        {
          accessorKey: 'payTo',
          header: 'Pay To',
          size: 240,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'paymentStatus',
          header: 'Status',
          size: 110,
          enableEditing: false,
          enableColumnActions: false,
          Cell: ({ row }) => {
            const status = row.original?.paymentStatus;
            const scheme = STATUS_COLORS[status] || {
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
        },
        {
          accessorKey: 'entity',
          header: 'Entity',
          size: 150
        },
        {
          accessorKey: 'billedMonthYear',
          header: 'Billed Month',
          size: 150
        },
        {
          accessorKey: 'docId',
          header: 'Doc ID',
          size: 150
        },
        {
          accessorKey: 'docDate',
          header: 'Doc Date',
          size: 120,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{formatDate(cell.getValue())}</div>
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

  // ================= CATEGORY DROPDOWN =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiCalls('get', '/reportController/getAllCategoryList');

        const categories = response?.paramObjectsMap?.mapp || [];
        setCategoryList([ALL_CATEGORY, ...categories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('error', 'Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // ================= PARTY DROPDOWN =================
  useEffect(() => {
    const fetchSuppliers = async () => {
      const categoryName = selectedCategory?.category || 'All';
      const typeParam = categoryName === 'All' ? 'all' : categoryName;

      try {
        const response = await apiCalls('get', `/reportController/getAllVendorListCostReport?type=${encodeURIComponent(typeParam)}`);

        const vendors = response?.paramObjectsMap?.mapp || [];
        const seen = new Set();

        const parties = vendors
          .filter((vendor) => {
            const name = vendor?.partyName?.trim();

            if (!name || name.toLowerCase() === 'none') return false;
            if (seen.has(name)) return false;

            seen.add(name);
            return true;
          })
          .map((vendor) => ({
            partyName: vendor.partyName
          }))
          .sort((a, b) => a.partyName.trim().localeCompare(b.partyName.trim()));

        setSupplierList([ALL_SUPPLIER, ...parties]);
        setValue('supplier', ALL_SUPPLIER);
      } catch (error) {
        console.error('Error fetching payment parties:', error);
        setSupplierList([ALL_SUPPLIER]);
        showToast('error', 'Failed to load parties');
      }
    };

    fetchSuppliers();
  }, [selectedCategory?.category, setValue]);

  // ================= COMPANY DETAILS =================
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await apiCalls('get', `commonmaster/company/${orgId}`);

        setCompanyList(response?.paramObjectsMap?.companyVO || []);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    if (orgId) {
      fetchCompanyDetails();
    }
  }, [orgId]);

  // ================= CLEAR FORM =================
  const ClearForm = () => {
    setValue('category', ALL_CATEGORY);
    setValue('supplier', ALL_SUPPLIER);
    setValue('asOnDate', dayjs());

    clearErrors();
    setGetData([]);
    setHeaderFields([]);
    setOpenModal(false);
    setIsLoading(false);
  };

  // ================= FETCH PAYMENT REPORT =================
  const onSubmit = async (formData) => {
    if (!formData.asOnDate || !dayjs(formData.asOnDate).isValid()) {
      showToast('error', 'Please select a valid As On Date');
      return;
    }

    setIsLoading(true);

    const categoryName = formData.category?.category || 'All';
    const partyName = formData.supplier?.partyName || 'All';

    const query = new URLSearchParams({
      asonDate: dayjs(formData.asOnDate).format('YYYY/MM/DD'),
      partyName: partyName.trim().toLowerCase() === 'all' ? 'ALL' : partyName,
      type: categoryName === 'All' ? 'all' : categoryName
    }).toString();

    try {
      const response = await apiCalls('get', `/reportController/ConsolidationPaymentReports?${query}`);

      if (response?.status === false) {
        showToast('error', response?.paramObjectsMap?.errorMessage || response?.statusFlag || 'Failed to fetch payment report');
        return;
      }

      const rows = response?.paramObjectsMap?.paymentReportList || [];

      const data = rows.map(mapPaymentRow);

      setGetData(data);

      setHeaderFields([
        {
          label: 'As On Date',
          value: dayjs(formData.asOnDate).format('DD-MM-YYYY')
        },
        {
          label: 'Category',
          value: categoryName
        },
        {
          label: 'Party Name',
          value: partyName.trim()
        },
        {
          label: 'Total Records',
          value: data.length
        },
        {
          label: 'Total Payment',
          value: formatAmount(data.reduce((sum, row) => sum + (Number(row.paymentAmt) || 0), 0))
        }
      ]);

      if (data.length === 0) {
        showToast('info', 'No records found for selected filters');
        return;
      }

      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching Console Payment Report:', error);
      showToast('error', 'Payment Report Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  // ================= TABLE OPTIONS =================
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

  // ================= EXCEL DOWNLOAD =================
  const handleDownloadExcel = async ({ table } = {}) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Console Payment');

      // Use current visible columns from CMRT2
      const visibleTableColumns = table ? table.getVisibleLeafColumns() : columns;

      const visibleColumns = visibleTableColumns
        .map((tableColumn) => {
          const columnId = tableColumn.columnDef?.accessorKey || tableColumn.id;

          return columns.find((column) => column.accessorKey === columnId);
        })
        .filter(Boolean);

      if (!visibleColumns.length) {
        showToast('error', 'No visible columns available for Excel export');
        return;
      }

      // ================= COMPANY LOGO =================
      worksheet.mergeCells('A1:B4');

      const logo = companyList[0]?.companyLogo;

      if (logo) {
        try {
          const base64Data = logo.split(',')[1] || logo;

          if (base64Data.length >= 100) {
            const extension = logo.includes('jpeg') || logo.includes('jpg') ? 'jpeg' : 'png';

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
          console.error('Error adding company logo:', error);
        }
      }

      // ================= REPORT TITLE =================
      worksheet.mergeCells('C2:G3');

      worksheet.getCell('C2').value = 'Console Payment';
      worksheet.getCell('C2').font = {
        size: 16,
        bold: true
      };
      worksheet.getCell('C2').alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      // ================= FILTER DETAILS =================
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
          horizontal: 'center',
          wrapText: true
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF593C8F' }
        };
      });

      // ================= TABLE HEADER =================
      const headerRow = worksheet.addRow(visibleColumns.map((column) => column.header));

      headerRow.height = 25;

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

      const numberFields = ['paymentAmt', 'onAccount'];
      const dateFields = ['docDate', 'purVoucherDate', 'chequeDate'];

      // ================= DATA ROWS =================
      getData.forEach((row) => {
        const rowData = visibleColumns.map((column) => {
          const key = column.accessorKey;
          const value = row[key];

          if (dateFields.includes(key)) {
            return value && dayjs(value).isValid() ? dayjs(value).format('DD-MM-YYYY') : '';
          }

          if (numberFields.includes(key)) {
            return value != null && value !== '' ? Number(value) : '';
          }

          return value ?? '';
        });

        const addedRow = worksheet.addRow(rowData);

        visibleColumns.forEach((column, index) => {
          if (numberFields.includes(column.accessorKey)) {
            addedRow.getCell(index + 1).numFmt = '#,##0.00';
            addedRow.getCell(index + 1).alignment = {
              horizontal: 'right',
              vertical: 'middle'
            };
          }
        });
      });

      // ================= TOTAL ROW =================
      const totalRowData = visibleColumns.map((column) => {
        const key = column.accessorKey;

        if (key === 'partyName') {
          return 'Total';
        }

        if (numberFields.includes(key)) {
          return getData.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
        }

        return '';
      });

      const totalRow = worksheet.addRow(totalRowData);

      totalRow.font = { bold: true };

      totalRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8EAF6' }
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

      // ================= COLUMN WIDTH =================
      worksheet.columns.forEach((column) => {
        let maxLength = 10;

        column.eachCell({ includeEmpty: true }, (cell) => {
          maxLength = Math.max(maxLength, String(cell.value ?? '').length);
        });

        column.width = Math.min(maxLength + 3, 45);
      });

      // ================= FREEZE HEADER =================
      worksheet.views = [
        {
          state: 'frozen',
          ySplit: 6
        }
      ];

      // ================= DOWNLOAD =================
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, `Console_Payment_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    } catch (error) {
      console.error('Error downloading payment report:', error);
      showToast('error', 'Excel download failed');
    }
  };

  // ================= UI =================
  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: 20, borderRadius: 10 }}>
          <div className="row d-flex">
            {/* AS ON DATE */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="asOnDate"
                    control={control}
                    rules={{ required: 'As On Date is required' }}
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

            {/* CATEGORY */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={categoryList}
                      getOptionLabel={(option) => option?.category || ''}
                      isOptionEqualToValue={(option, value) => option?.category === value?.category}
                      value={field.value || ALL_CATEGORY}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Category" error={!!errors.category} helperText={errors.category?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            {/* PARTY NAME */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <Controller
                  name="supplier"
                  control={control}
                  rules={{ required: 'Party Name is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={supplierList}
                      getOptionLabel={(option) => option?.partyName?.trim() || ''}
                      isOptionEqualToValue={(option, value) => option?.partyName === value?.partyName}
                      value={field.value || ALL_SUPPLIER}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Party Name" error={!!errors.supplier} helperText={errors.supplier?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            {/* SEARCH AND CLEAR */}
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

      {/* ================= PAYMENT REPORT MODAL ================= */}
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
          <span>Console Payment</span>

          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {getData.length > 0 ? (
            <>
              <SummaryBar />

              <CMRT2
                data={getData}
                columns={columns}
                fileName="Console Payment"
                tableOptions={tableOptions}
                headerFields={headerFields}
                handleDownloadExcel={handleDownloadExcel}
                showDownloadButtonsPdf={false}
              />
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#666'
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>

              <div style={{ fontWeight: 600, fontSize: 16 }}>No data found</div>

              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting the As On Date, Category or Party Name filter.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsolePaymentReport;
