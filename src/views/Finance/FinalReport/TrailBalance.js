import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { FormControl, Dialog, DialogTitle, DialogContent, IconButton, Autocomplete, TextField } from '@mui/material';
import CommonReportTable from 'utils/CommonReportTable';
import apiCalls from 'apicall';
import CloseIcon from '@mui/icons-material/Close';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const TrailBalance = () => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fromDate: dayjs().subtract(1, 'month'),
      toDate: dayjs(),
      branch: null,
      details: null
    }
  });

  const formDate = watch('fromDate');
  const toDate = watch('toDate');
  const branch = watch('branch');
  const details = watch('details');
  const orgId = localStorage.getItem('orgId');
  const finYear = localStorage.getItem('finYear');
  const [listViewData, setListViewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [data, setData] = useState(null);
  const DetailsCode = [
    { value: 'YES', label: 'YES' },
    { value: 'NO', label: 'NO' }
  ];

  const handleClear = () => {
    reset({
      fromDate: dayjs().subtract(1, 'month'),
      toDate: dayjs(),
      branch: null,
      details: null
    });
    setListView(false);
    setIsLoading(false);
    setOpenModal(false);
    setData(null);
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchCodeList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  useEffect(() => {
    getAllBranches();
    getCompanyDetails();
  }, []);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const { fromDate, toDate, branch, details } = formData;
    const formattedFromDate = fromDate.format('YYYY-MM-DD');
    const formattedToDate = toDate.format('YYYY-MM-DD');
    try {
      const res = await apiCalls(
        'get',
        `/taxInvoice/getTrailBalance?branch=${branch?.branch}&details=${details?.value}&finYear=${finYear}&fromDate=${formattedFromDate}&orgId=${orgId}&toDate=${formattedToDate}`
      );

      setData(res?.paramObjectsMap?.mapp);
      setListView(true);
      setOpenModal(true);
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const headerFields = [
    {
      label: 'Range',
      value: `${dayjs(formDate).format('DD-MM-YYYY')} to ${dayjs(toDate).format('DD-MM-YYYY')}`
    },
    {
      label: 'Branch',
      value: watch('branch')?.branch || '-'
    },
    {
      label: 'Details',
      value: watch('details')?.label || '-'
    }
  ];

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
      sx: { maxHeight: '70vh' }
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
        '&:hover': { backgroundColor: '#f0f7ff' }
      }
    }),
    enableStickyHeader: true,
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid #e0e0e0 !important'
        }
      }
    }
  };

  const reportColumns = [
    {
      accessorKey: 'accountCode',
      header: 'Account Code',
      size: 90,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'accountName',
      header: 'Account Name',
      size: 90,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      size: 90,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'partyCode',
      header: 'Party Code',
      size: 90,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'partyName',
      header: 'Party Name',
      size: 90,
      Cell: ({ cell }) => (
        <div
          style={{
            textAlign: 'left',
            padding: '8px'
          }}
        >
          {cell.getValue() || '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'odbamount',
      header: 'Opening Debit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'ocramount',
      header: 'Opening Credit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'cdbamount',
      header: 'Current Debit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'ccramount',
      header: 'Current Credit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'tdbamount',
      header: 'Total Debit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    },
    {
      accessorKey: 'tcramount',
      header: 'Total Credit',
      size: 90,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', padding: '8px' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null
            ? Number(cell.getValue()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right',
        sx: {
          backgroundColor: '#34449B',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          padding: '12px 8px'
        }
      }
    }
  ];

  // pdf & excel download
  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      console.log('API Response:', response);
      setListViewData(response.paramObjectsMap.companyVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Trail Balance');

    // ====== LOGO (A1:B4) ======
    worksheet.mergeCells('A1:B4');
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
            tl: { col: 0, row: 0 }, // A1
            ext: { width: 140, height: 100 }
          });
        }
      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }

    const titleRow = worksheet.getRow(2);
    worksheet.mergeCells('C2:E3');
    const titleCell = worksheet.getCell('C2');
    titleCell.value = 'Trail Balance';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // ====== HEADER FIELDS (ROW 5) ======
    const headerRowNumber = 5;

    const excelHeaderFields = [
      ...headerFields,
      { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
      { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
    ];

    excelHeaderFields.forEach(({ label, value }, index) => {
      const colLetter = String.fromCharCode(65 + index); // A, B, C...
      const cellAddress = `${colLetter}${headerRowNumber}`;
      const cell = worksheet.getCell(cellAddress);

      cell.value = `${label}: ${value}`;
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' } // White text
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF593C8F' } // Purple background
      };
    });

    // ====== COLUMN HEADERS (ROW 6) ======
    const headers = reportColumns.map((col) => col.header);
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 20;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B76E2' } // Blue background
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        bold: true
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // ====== FREEZE HEADER ROW ======
    worksheet.views = [{ state: 'frozen', ySplit: worksheet.rowCount }];

    const numberFields = ['odbamount', 'ocramount', 'cdbamount', 'ccramount', 'tdbamount', 'tcramount'];

    // ====== DATA ROWS (Excludes Total) ======
    const dataWithoutTotal = data.filter((row) => row?.docId !== 'Total');
    dataWithoutTotal.forEach((row) => {
      const rowData = reportColumns.map((col) => row[col.accessorKey]);
      const addedRow = worksheet.addRow(rowData);
      reportColumns.forEach((col, colIndex) => {
        const fieldKey = col.accessorKey;
        const cell = addedRow.getCell(colIndex + 1); // +1 because ExcelJS is 1-based index

        if (numberFields.includes(fieldKey)) {
          cell.numFmt = '#,##0.00'; // or use '#,##0' if you want no decimals
        }
      });
    });

    // ====== AUTO WIDTH ======
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, value.length);
      });
      column.width = maxLength + 2;
    });

    // ====== EXPORT FILE ======
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `Trail Balance_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  const handleDownloadPdf = ({ logo, headerFields, data, reportColumns }) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // ====== LOGO ======
    if (logo) {
      try {
        const base64Data = logo.includes(',') ? logo : `data:image/png;base64,${logo}`;
        doc.addImage(base64Data, 'PNG', 10, 8, 30, 20);
      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }

    // ====== TITLE ======
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Trail Balance', 150, 20, { align: 'center' });

    // ====== HEADER FIELDS (Column-wise) ======
    const headerY = 35;
    const excelHeaderFields = [...headerFields];
    let xPos = 14; // X-axis start
    const gap = 60; // ஒவ்வொரு column க்கு இடைவேள

    doc.setFontSize(10);

    excelHeaderFields.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`, xPos, headerY);
      xPos += gap; // அடுத்த column
    });

    // ====== TABLE DATA ======
    const tableColumns = reportColumns.map((col) => ({
      header: col.header,
      dataKey: col.accessorKey
    }));

    const sourceData = data.filter((row) => row?.docId !== 'Total');

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    autoTable(doc, {
      startY: headerY + 10, // header கீழே space விட்டு table ஆரம்பிக்குது
      columns: tableColumns,
      body: sourceData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 118, 226],
        textColor: [255, 255, 255],
        halign: 'center',
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        valign: 'middle'
      },
      columnStyles: {
        accountCode: { halign: 'left' },
        accountName: { halign: 'left' },
        groupName: { halign: 'left' },
        partyCode: { halign: 'left' },
        partyName: { halign: 'left' },
        odbamount: { halign: 'right' },
        ocramount: { halign: 'right' },
        cdbamount: { halign: 'right' },
        ccramount: { halign: 'right' },
        tdbamount: { halign: 'right' },
        tcramount: { halign: 'right' }
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      didParseCell: (data) => {
        if (
          data.column.dataKey === 'odbamount' ||
          data.column.dataKey === 'ocramount' ||
          data.column.dataKey === 'cdbamount' ||
          data.column.dataKey === 'ccramount' ||
          data.column.dataKey === 'tdbamount' ||
          data.column.dataKey === 'tcramount'
        ) {
          const val = data.cell.raw;
          if (!isNaN(val) && val !== null && val !== '') {
            data.cell.text = [Number(val).toLocaleString('en-IN')];
          }
        }
      },
      didDrawPage: () => {
        doc.setFontSize(8).setTextColor('#555555');
        doc.text(`Generated On: ${dayjs().format('DD-MM-YYYY hh:mm A')}`, pageW - 15, pageH - 10, { align: 'right' });
        doc.text(`Generated By: ${localStorage.getItem('userName') || ''}`, 15, pageH - 10, { align: 'left' });
      }
    });

    // ====== SAVE PDF ======
    doc.save(`Trail_Balance_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  //

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row d-flex">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="fromDate"
                    control={control}
                    rules={{ required: 'From Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="From Date"
                        format="DD-MM-YYYY"
                        value={field.value || null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!errors.fromDate,
                            helperText: errors.fromDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            {/*  */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="toDate"
                    control={control}
                    rules={{ required: 'To Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="To Date"
                        format="DD-MM-YYYY"
                        value={field.value || null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!errors.toDate,
                            helperText: errors.toDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            {/*  */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: 'Branch is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={branchCodeList}
                      getOptionLabel={(option) => option?.branch || ''}
                      isOptionEqualToValue={(o, v) => o?.branch === v?.branch}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Branch" error={!!errors.branch} helperText={errors.branch?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>
            {/*  */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="details"
                  control={control}
                  rules={{ required: 'Details is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={DetailsCode}
                      getOptionLabel={(option) => option?.label || ''}
                      isOptionEqualToValue={(o, v) => o?.value === v?.value}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Details" error={!!errors.details} helperText={errors.details?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>
            {/*  */}
            <div className="col-12 col-md-3 mb-3">
              <div className="d-flex flex-wrap ">
                <ActionButton title="Search" icon={SearchIcon} type="submit" />
                <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              </div>
            </div>
          </div>
        </form>
        {isLoading && (
          <div className="d-flex justify-content-center items-center">
            <CircularProgress />
          </div>
        )}
      </div>
      {/*  */}

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
          <span>Trail Balance</span>
          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          {data && data.length > 0 ? (
            <CommonReportTable
              data={data}
              columns={reportColumns}
              fileName={'Trail Balance'}
              tableOptions={tableOptions}
              headerFields={headerFields}
              handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
              handleDownloadPdf={() =>
                handleDownloadPdf({
                  logo: listViewData[0]?.companyLogo,
                  headerFields,
                  data,
                  reportColumns
                })
              }
              showDownloadButtonsPdf={true}
              showDownloadButtonsExcel={true}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>No data found</div>
          )}
        </DialogContent>
      </Dialog>
      {listView && (
        <div className="mt-4">
          <CommonReportTable
            data={data}
            columns={reportColumns}
            fileName={'Trail Balance'}
            headerFields={headerFields}
            showDownloadButtonsPdf={true}
            showDownloadButtonsExcel={true}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            handleDownloadPdf={() =>
              handleDownloadPdf({
                logo: listViewData[0]?.companyLogo,
                headerFields,
                data,
                reportColumns
              })
            }
            isListView={true}
            tableOptions={{
              ...tableOptions,
              muiTableContainerProps: { sx: { maxHeight: '60vh' } }
            }}
          />
        </div>
      )}
    </>
  );
};

export default TrailBalance;
