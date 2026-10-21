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

// The report API returns each row as an array. Index -> field name.
const mapReportRow = (r) => ({
  supplierName: r[0],
  docId: r[1],
  docDate: r[2],
  vid: r[3],
  vdate: r[4],
  totChargesLcAmt: r[5],
  gstInputLcAmt: r[6],
  netBillCurrAmt: r[7],
  status: r[8],
  purVoucherNo: r[9],
  purVoucherDate: r[10],
  entity: r[11],
  finYear: r[12],
  billedMonthYear: r[13],
  businessCate: r[14],
  reportTime: r[15]
});

const formatAmount = (value) =>
  value != null
    ? Number(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : '-';

const formatDate = (value) => (value ? dayjs(value).format('DD-MM-YYYY') : '-');

const ConsolidationCostInvoiceReport = () => {
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
      supplier: { partyName: 'All' }
    }
  });

  const [supplierList, setSupplierList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const orgId = localStorage.getItem('orgId');

  // ====== TABLE COLUMNS ======
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'supplierName',
          header: 'Supplier',
          size: 220,
          Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        { accessorKey: 'vid', header: 'Invoice No', size: 150 },
        {
          accessorKey: 'vdate',
          header: 'Invoice Date',
          size: 120,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{formatDate(cell.getValue())}</div>
        },
        {
          accessorKey: 'totChargesLcAmt',
          header: 'Total Amt',
          size: 130,
          Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: 8 }}>{formatAmount(cell.getValue())}</div>
        },
        {
          accessorKey: 'gstInputLcAmt',
          header: 'GST Input',
          size: 120,
          Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: 8 }}>{formatAmount(cell.getValue())}</div>
        },
        {
          accessorKey: 'netBillCurrAmt',
          header: 'Net Amt',
          size: 130,
          Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: 8, fontWeight: 600 }}>{formatAmount(cell.getValue())}</div>
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
            const scheme = colors[status] || { bg: '#eeeeee', color: '#424242' };

            return (
              <div style={{ textAlign: 'center', padding: 8 }}>
                <Chip
                  label={status || '-'}
                  size="small"
                  sx={{ backgroundColor: scheme.bg, color: scheme.color, fontWeight: 600, fontSize: '0.72rem' }}
                />
              </div>
            );
          }
        },
        {
          accessorKey: 'purVoucherNo',
          header: 'Pur Voucher No',
          size: 170,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{cell.getValue() || '-'}</div>
        },
        {
          accessorKey: 'purVoucherDate',
          header: 'Pur Voucher Date',
          size: 140,
          Cell: ({ cell }) => <div style={{ padding: 8 }}>{formatDate(cell.getValue())}</div>
        },
        { accessorKey: 'entity', header: 'Entity', size: 130 },
        { accessorKey: 'billedMonthYear', header: 'Billed Month', size: 140 },
        { accessorKey: 'docId', header: 'Doc Id', size: 130 },
        {
          accessorKey: 'docDate',
          header: 'Doc Date',
          size: 110,
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

  // ====== SUPPLIER DROPDOWN (getPartyNameByPartyType, partyType=vendor) ======
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=vendor`);

        const vendors = response?.paramObjectsMap?.partyMasterVO || [];

        // Vendor master also holds expense heads (STAFF SALARY, FUEL EXPENSES...).
        // Keep only real suppliers / transporters. Remove this filter to list everything.
        const suppliers = vendors.filter((v) => ['SUPPLIER', 'TRANSPORTER'].includes(v.bussinessCate));

        const allOption = { partyName: 'All' };
        setSupplierList([allOption, ...suppliers]);
        setValue('supplier', allOption);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        showToast('error', 'Failed to load suppliers');
      }
    };

    if (orgId) fetchSuppliers();
  }, [orgId, setValue]);

  // ====== COMPANY DETAILS (for Excel logo) ======
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
    setValue('supplier', { partyName: 'All' });
    setValue('asOnDate', dayjs());
    clearErrors();
    setGetData([]);
    setHeaderFields([]);
    setOpenModal(false);
    setIsLoading(false);
  };

  // ====== FETCH REPORT (findConsolidationCostInvoiceReports) ======
  const onSubmit = async (formData) => {
    if (!formData.asOnDate || !dayjs(formData.asOnDate).isValid()) {
      showToast('error', 'Please select a valid As On Date');
      return;
    }

    setIsLoading(true);

    // API expects asondate as YYYY/MM/DD and supplier as "all" or a supplier name
    const formattedDate = dayjs(formData.asOnDate).format('YYYY/MM/DD');
    const partyName = formData.supplier?.partyName || 'All';
    const supplierParam = partyName === 'All' ? 'all' : partyName;

    try {
      const response = await apiCalls(
        'get',
        `/reportController/findConsolidationCostInvoiceReports?asondate=${encodeURIComponent(
          formattedDate
        )}&orgId=${orgId}&supplier=${encodeURIComponent(supplierParam)}`
      );

      const rows = response?.paramObjectsMap?.costInvoiceReportList || [];
      const data = rows.map(mapReportRow);

      setGetData(data);
      setHeaderFields([
        { label: 'As On Date', value: dayjs(formData.asOnDate).format('DD-MM-YYYY') },
        { label: 'Supplier', value: partyName },
        { label: 'Total Records', value: data.length }
      ]);

      setOpenModal(true);

      if (data.length === 0) {
        showToast('info', 'No records found for selected filters');
      }
    } catch (error) {
      console.error('Error fetching Consolidation Cost Invoice Report:', error);
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
    muiTableContainerProps: { sx: { maxHeight: '70vh' } },
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
        '& .MuiTableCell-root': { border: '1px solid #e0e0e0 !important' }
      }
    }
  };

  // ====== EXCEL DOWNLOAD ======
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Consolidation Cost Invoice');

    worksheet.mergeCells('A1:B4');

    const logo = companyList[0]?.companyLogo;

    if (logo) {
      try {
        const base64Data = logo.split(',')[1] || logo;

        if (base64Data.length >= 100) {
          const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
          const imageId = workbook.addImage({ base64: base64Data, extension });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 140, height: 75 }
          });
        }
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    worksheet.mergeCells('C2:G3');
    worksheet.getCell('C2').value = 'Consolidation Cost Invoice Report';
    worksheet.getCell('C2').font = { size: 16, bold: true };
    worksheet.getCell('C2').alignment = { horizontal: 'center', vertical: 'middle' };

    const excelHeaderFields = [
      ...headerFields,
      { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
      { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
    ];

    excelHeaderFields.forEach(({ label, value }, index) => {
      const cell = worksheet.getCell(5, index + 1);
      cell.value = `${label}: ${value}`;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF593C8F' } };
    });

    const headerRow = worksheet.addRow(columns.map((column) => column.header));
    headerRow.height = 20;

    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B76E2' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const numberFields = ['totChargesLcAmt', 'gstInputLcAmt', 'netBillCurrAmt'];
    const dateFields = ['docDate', 'vdate', 'purVoucherDate'];

    getData.forEach((row) => {
      const rowData = columns.map((column) => {
        const key = column.accessorKey;

        if (key === 'statusDisplay') return row.status || '';
        if (dateFields.includes(key)) return row[key] ? dayjs(row[key]).format('DD-MM-YYYY') : '';
        if (numberFields.includes(key)) return row[key] != null ? Number(row[key]) : '';

        return row[key] ?? '';
      });

      const addedRow = worksheet.addRow(rowData);

      columns.forEach((column, index) => {
        if (numberFields.includes(column.accessorKey)) {
          addedRow.getCell(index + 1).numFmt = '#,##0.00';
        }
      });
    });

    // Total row
    const totalRowData = columns.map((column) => {
      if (column.accessorKey === 'supplierName') return 'Total';
      if (numberFields.includes(column.accessorKey)) {
        return getData.reduce((sum, row) => sum + (Number(row[column.accessorKey]) || 0), 0);
      }
      return '';
    });
    const totalRow = worksheet.addRow(totalRowData);
    totalRow.font = { bold: true };
    columns.forEach((column, index) => {
      if (numberFields.includes(column.accessorKey)) {
        totalRow.getCell(index + 1).numFmt = '#,##0.00';
      }
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        maxLength = Math.max(maxLength, String(cell.value ?? '').length);
      });
      column.width = Math.min(maxLength + 2, 45);
    });

    worksheet.views = [{ state: 'frozen', ySplit: 6 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, `Consolidation_Cost_Invoice_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
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

            {/* Supplier */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth size="small">
                <Controller
                  name="supplier"
                  control={control}
                  rules={{ required: 'Supplier is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={supplierList}
                      getOptionLabel={(option) => option?.partyName || ''}
                      isOptionEqualToValue={(option, value) => option?.partyName === value?.partyName}
                      value={field.value || null}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Supplier" error={!!errors.supplier} helperText={errors.supplier?.message} />
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

      {/* Report Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', overflow: 'hidden' } }}
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
          <span>Consolidation Cost Invoice Report</span>

          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          {getData.length > 0 ? (
            <CMRT2
              data={getData}
              columns={columns}
              fileName="Consolidation Cost Invoice Report"
              tableOptions={tableOptions}
              headerFields={headerFields}
              handleDownloadExcel={handleDownloadExcel}
              showDownloadButtonsPdf={false}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>No data found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting the As On Date or Supplier filter.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsolidationCostInvoiceReport;
