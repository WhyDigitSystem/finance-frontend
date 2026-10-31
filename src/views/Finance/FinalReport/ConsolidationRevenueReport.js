import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Autocomplete, FormControl, TextField, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer } from 'react-toastify';
import { showToast } from 'utils/toast-component';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import CMRT2 from 'utils/CMRT2';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const fmt = (v) =>
  v !== undefined && v !== null && v !== ''
    ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '-';

const headProps = (align = 'center') => ({
  align,
  sx: {
    backgroundColor: '#34449B',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    padding: '12px 8px'
  }
});

const ALL_OPTION = { partyName: 'All' };

const ConsolidationRevenueReport = () => {
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
      customer: ALL_OPTION
    }
  });

  const [customerList, setCustomerList] = useState([ALL_OPTION]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [listView, setListView] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const orgId = localStorage.getItem('orgId');

  // ====== SUMMARY ======
  // `totalinvamountlc` is the invoice-level total and is repeated on every line of the same invoice (vid),
  // so it is de-duplicated by `vid` to avoid double counting.
  const summary = useMemo(() => {
    const invoiceTotals = {};
    let billAmount = 0;
    let gstAmount = 0;
    let qty = 0;
    (getData || []).forEach((row) => {
      billAmount += Number(row.billamount || 0);
      gstAmount += Number(row.gstamount || 0);
      qty += Number(row.qty || 0);
      invoiceTotals[row.vid] = Number(row.totalinvamountlc || 0);
    });
    const invoiceCount = Object.keys(invoiceTotals).length;
    const totalInvoiceAmount = Object.values(invoiceTotals).reduce((a, b) => a + b, 0);
    return { billAmount, gstAmount, qty, invoiceCount, totalInvoiceAmount };
  }, [getData]);

  // ====== COLUMNS ======
  const columns = useMemo(
    () => [
      {
        accessorKey: 'entity',
        header: 'Entity',
        size: 140,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
        muiTableHeadCellProps: headProps()
      },
      {
        accessorKey: 'partyname',
        header: 'Customer',
        size: 240,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
        muiTableHeadCellProps: headProps()
      },
      {
        accessorKey: 'vid',
        header: 'Invoice No',
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: 'left', padding: '8px', fontWeight: 600, color: '#34449B' }}>{cell.getValue() || '-'}</div>
        ),
        muiTableHeadCellProps: headProps()
      },
      {
        accessorKey: 'vdate',
        header: 'Invoice Date',
        size: 120,
        Cell: ({ cell }) => (
          <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}</div>
        ),
        muiTableHeadCellProps: headProps()
      },
      {
        accessorKey: 'mn',
        header: 'Month',
        size: 100,
        Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
        muiTableHeadCellProps: headProps()
      },
      {
        accessorKey: 'qty',
        header: 'Qty',
        size: 90,
        Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: '8px' }}>{cell.getValue() ?? '-'}</div>,
        muiTableHeadCellProps: headProps('right')
      },
      {
        accessorKey: 'billamount',
        header: 'Bill Amount',
        size: 130,
        Cell: ({ cell }) => (
          <div style={{ textAlign: 'right', padding: '8px', fontWeight: 600, color: '#1b5e20' }}>{fmt(cell.getValue())}</div>
        ),
        muiTableHeadCellProps: headProps('right')
      },
      {
        accessorKey: 'gstamount',
        header: 'GST Amount',
        size: 130,
        Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: '8px', color: '#b26a00' }}>{fmt(cell.getValue())}</div>,
        muiTableHeadCellProps: headProps('right')
      },
      {
        accessorKey: 'totalinvamountlc',
        header: 'Total Invoice Amt',
        size: 150,
        Cell: ({ cell }) => <div style={{ textAlign: 'right', padding: '8px', fontWeight: 600 }}>{fmt(cell.getValue())}</div>,
        muiTableHeadCellProps: headProps('right')
      }
    ],
    []
  );

  // ====== CUSTOMER DROPDOWN ======
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);

        // Drop placeholder / inactive / cancelled parties
        const parties = (response?.paramObjectsMap?.partyMasterVO || []).filter(
          (p) => p.partyName && p.partyName.trim().toUpperCase() !== 'NONE' && p.active === 'Active' && !p.cancel
        );

        // De-duplicate by name (the report API filters by partyName)
        const unique = Array.from(new Map(parties.map((p) => [p.partyName, p])).values());

        setCustomerList([ALL_OPTION, ...unique]);
        setValue('customer', ALL_OPTION);
      } catch (error) {
        console.error('Error fetching dropdowns:', error);
      }
    };
    if (orgId) fetchDropdowns();
  }, [orgId, setValue]);

  // ====== COMPANY (LOGO) ======
  useEffect(() => {
    const getCompanyDetails = async () => {
      try {
        const response = await apiCalls('get', `/commonmaster/company/${orgId}`);
        setCompanyData([...(response?.paramObjectsMap?.companyVO || [])].reverse());
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    };
    if (orgId) getCompanyDetails();
  }, [orgId]);

  // ====== CLEAR ======
  const ClearForm = () => {
    setValue('customer', ALL_OPTION);
    setValue('asOnDate', dayjs());
    clearErrors();
    setIsLoading(false);
    setListView(false);
    setHeaderFields([]);
    setGetData([]);
  };

  // ====== SUBMIT ======
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const { customer, asOnDate } = formData;
    const formattedAsOnDate = dayjs(asOnDate).format('YYYY-MM-DD');
    const party = !customer?.partyName || customer.partyName === 'All' ? 'all' : customer.partyName;

    try {
      const response = await apiCalls(
        'get',
        `/reportController/getConsolidationRevenueReport?asondate=${formattedAsOnDate}&party=${encodeURIComponent(party)}`
      );

      if (response?.status === false) throw new Error('API returned failure');

      // Enforce as-on date on the client, then newest first
      const data = (response?.paramObjectsMap?.consolidationRevenueReport || [])
        .filter((r) => !r.vdate || !dayjs(r.vdate).isAfter(dayjs(asOnDate), 'day'))
        .sort((a, b) => dayjs(b.vdate).valueOf() - dayjs(a.vdate).valueOf() || String(b.vid).localeCompare(String(a.vid)));

      setGetData(data);
      setListView(true);

      setHeaderFields([
        { label: 'As On Date', value: dayjs(asOnDate).format('DD-MM-YYYY') },
        { label: 'Customer', value: customer?.partyName || 'All' },
        { label: 'Total Records', value: data.length }
      ]);

      if (data.length === 0) showToast('info', 'No records found for selected filters');
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Report Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ====== TABLE OPTIONS ======
  const tableOptions = {
    muiTablePaperProps: {
      sx: {
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    muiTableContainerProps: { sx: { maxHeight: '60vh' } },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
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
  const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Consolidation Revenue');

    // LOGO (A1:B4)
    worksheet.mergeCells('A1:B4');
    if (logo) {
      try {
        const base64Data = logo.split(',')[1] || logo;
        if (base64Data.length >= 100) {
          const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
          const imageId = workbook.addImage({ base64: base64Data, extension });
          worksheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 140, height: 75 } });
        }
      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }

    // TITLE
    worksheet.mergeCells('C2:F3');
    const titleCell = worksheet.getCell('C2');
    titleCell.value = 'Consolidation Revenue Report';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // HEADER FIELDS (ROW 5)
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

    // COLUMN HEADERS (ROW 6)
    const headerRow = worksheet.addRow(columns.map((c) => c.header));
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
    worksheet.views = [{ state: 'frozen', ySplit: worksheet.rowCount }];

    const numberFields = ['billamount', 'gstamount', 'totalinvamountlc'];

    // DATA ROWS
    (getData || []).forEach((row) => {
      const rowData = columns.map((col) => {
        if (col.accessorKey === 'vdate') return row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : '';
        return row[col.accessorKey];
      });
      const addedRow = worksheet.addRow(rowData);
      columns.forEach((col, i) => {
        if (numberFields.includes(col.accessorKey)) addedRow.getCell(i + 1).numFmt = '#,##0.00';
      });
    });

    // TOTAL ROW (invoice total de-duplicated by invoice no)
    const totalValues = columns.map((col) => {
      switch (col.accessorKey) {
        case 'entity':
          return 'Total';
        case 'qty':
          return summary.qty;
        case 'billamount':
          return summary.billAmount;
        case 'gstamount':
          return summary.gstAmount;
        case 'totalinvamountlc':
          return summary.totalInvoiceAmount;
        default:
          return '';
      }
    });
    const totalRow = worksheet.addRow(totalValues);
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
      if (numberFields.includes(columns[colNumber - 1]?.accessorKey)) cell.numFmt = '#,##0.00';
    });

    // AUTO WIDTH (skip logo/title/header-field rows 1-5 so they don't distort columns)
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (Number(cell.row) <= 5) return;
        const value = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, Math.min(value.length, 45));
      });
      column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `Consolidation_Revenue_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  const SummaryBar = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '12px 16px', background: '#f5f7ff' }}>
      <SummaryCard label="Invoices" value={summary.invoiceCount} color="#34449B" />
      <SummaryCard label="Total Qty" value={summary.qty.toLocaleString('en-IN')} color="#00695c" />
      <SummaryCard label="Bill Amount" value={fmt(summary.billAmount)} color="#1b5e20" />
      <SummaryCard label="GST Amount" value={fmt(summary.gstAmount)} color="#b26a00" />
      <SummaryCard label="Total Invoice Amount" value={fmt(summary.totalInvoiceAmount)} color="#6a1b9a" />
    </div>
  );

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
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

            {/* Customer */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="customer"
                  control={control}
                  rules={{ required: 'Customer is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={customerList}
                      getOptionLabel={(option) => option?.partyName || ''}
                      isOptionEqualToValue={(o, v) => o?.partyName === v?.partyName}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Customer" error={!!errors.customer} helperText={errors.customer?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            {/* Buttons */}
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

      {/* Report (rendered once, below the form) */}
      {listView && (
        <div className="mt-4">
          {getData.length > 0 ? (
            <>
              <SummaryBar />
              <CMRT2
                data={getData}
                columns={columns}
                fileName={'Consolidation Revenue Report'}
                headerFields={headerFields}
                handleDownloadExcel={() => handleDownloadExcel({ logo: companyData[0]?.companyLogo })}
                isListView={true}
                showDownloadButtonsPdf={false}
                tableOptions={tableOptions}
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>No data found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting the As On Date or Customer filter.</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

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
    <div style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
  </div>
);

export default ConsolidationRevenueReport;
