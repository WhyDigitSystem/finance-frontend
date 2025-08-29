import React from 'react';
import { useState, useEffect,useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete, FormControl, TextField, Dialog,
  DialogTitle,DialogContent,IconButton } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, ButtonGroup } from '@mui/material';
import { showToast } from 'utils/toast-component';
import CommonReportTable from 'utils/CommonReportTable';
import CloseIcon from '@mui/icons-material/Close';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const TDSRegister = () => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fromDate: null,
      toDate: null,
      branch: null,
      partyName: null,
      viewMode: 'Receivable'
    }
  });
  const viewMode = watch('viewMode');
  const [partyNameList, setPartyNameList] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listView, setListView] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const finYear = localStorage.getItem('finYear');
  const [getData, setGetData] = useState(null);
    const [listViewData, setListViewData] = useState([]);
  
  

  // 
    const receivableColumns = [
    {
      accessorKey: 'docId',
      header: 'Doc Id',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'docDate',
      header: 'Doc Date',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'refNo',
      header: 'Ref No',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'refDate',
      header: 'Ref Date',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'customerName',
      header: 'Customer Name',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'tdsAmount',
      header: 'TDS Amt',
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
  ]
    const payableColumns = [
    {
      accessorKey: 'docId',
      header: 'Doc Id',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'docDate',
      header: 'Doc Date',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'refNo',
      header: 'Ref No',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'refDate',
      header: 'Ref Date',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
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
      accessorKey: 'billAmount',
      header: 'Bill Amt',
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
      accessorKey: 'chargeAmount',
      header: 'Charge Amt',
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
      accessorKey: 'gstAmount',
      header: 'Gst Amt',
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
      accessorKey: 'totalAmountLc',
      header: 'Total Amt',
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
  ]
  // 
 const reportColumns = useMemo(() => {
  return viewMode === 'Receivable' ? receivableColumns : payableColumns;
}, [viewMode]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const branches = await getAllActiveBranches(orgId);
        setBranchCodeList(branches);
  
        const partyType = viewMode === 'Receivable' ? 'customer' : 'vendor';
  
        const response = await apiCalls(
          'get',
          `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${partyType}`
        );
  
        const allOption = { partyName: 'All' };
        const parties = [allOption, ...(response?.paramObjectsMap?.partyMasterVO || [])];
  
        setPartyNameList(parties);
        setValue('partyName', allOption);
      } catch (error) {
        console.error('Error fetching dropdowns:', error);
      }
    };
  
    if (orgId && viewMode) {
      fetchDropdowns();
    }
  }, [orgId, viewMode, setValue]);
  const ClearForm = () => {
    setValue('partyName', { partyName: 'All' });
    setValue('fromDate', null);
    setValue('toDate', null);
    setValue('branch', null);
    setValue('viewMode','Receivable');
    clearErrors();
    setListView(false);
    setOpenModal(false);
     setHeaderFields([]);
  };
 

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const {fromDate, toDate, partyName, branch} = formData;
    const formattedFromDate = dayjs(fromDate).format('YYYY-MM-DD');
    const formattedToDate = dayjs(toDate).format('YYYY-MM-DD');
     
  try {
    let response;

    if (viewMode === 'Receivable') {
      response = await apiCalls(
        'get',
        `/arreceivable/getReceivableTdsDetailsReport?branchName=${branch?.branch}&finYear=${finYear}&fromDate=${formattedFromDate}&orgId=${orgId}&partyName=${partyName?.partyName}&toDate=${formattedToDate}`
      );
    } else {
      response = await apiCalls(
        'get',
        `/payable/getPaybaleTdsDetailsReport?branchName=${branch?.branch}&finYear=${finYear}&fromDate=${formattedFromDate}&orgId=${orgId}&partyName=${partyName?.partyName}&toDate=${formattedToDate}`
      );
    }

    setGetData(response?.paramObjectsMap?.mapp);
    setOpenModal(true);
    setListView(true);

    const headers = [
      { label: 'Range', value: `${dayjs(fromDate).format('DD-MM-YYYY')} to ${dayjs(toDate).format('DD-MM-YYYY')}` },
      { label: 'Party Name', value: partyName?.partyName || 'All' },
      { label: 'Branch', value: branch?.branch || ''},
      { label: 'View Mode', value: viewMode }
    ];
    setHeaderFields(headers);
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast('error', 'Report Fetch Failed');
  } finally {
    setIsLoading(false);
  }
;  };

 const handleCloseModal = () => {
    setOpenModal(false);
  };

  
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

  // company logo
   const getCompanyDetails = async () => {
        try {
          const response = await apiCalls('get', `commonmaster/company/${orgId}`);
          console.log('API Response:', response);
          setListViewData(response.paramObjectsMap.companyVO.reverse());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      useEffect(() => {
        getCompanyDetails();
      }, []);

  // Excel

   const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TDS Register');
  
    // ====== LOGO (A1:B4) ======
    worksheet.mergeCells('A1:B4');
    if (logo) {
      try {
        const base64Data = logo.split(',')[1] || logo;
        if (base64Data.length >= 100) {
          const extension = logo.includes('jpeg') ? 'jpeg' : 'png';
          const imageId = workbook.addImage({
            base64: base64Data,
            extension,
          });
          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 }, // A1
            ext: { width: 140, height: 100 },
          });
        }
      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }
  
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

    const numberFields = ['tdsAmount', 'gstAmount', 'totalAmountLc', 'billAmount','tdsAmount','chargeAmount'];
  
    // ====== DATA ROWS (Excludes Total) ======
    const dataWithoutTotal = getData.filter((row) => row?.docId !== 'Total');
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
    saveAs(blob, `TDS_Register_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };


  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
          <div className="row d-flex">
            {/* From Date */}

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

            {/* To Date */}
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

            {/* Branch Dropdown */}
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
                      getOptionLabel={(option) => option?.branchCode || ''}
                      isOptionEqualToValue={(o, v) => o?.branchCode === v?.branchCode}
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

            {/* Party Dropdown */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="partyName"
                  control={control}
                  rules={{ required: 'Party Name is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={partyNameList}
                      getOptionLabel={(option) => option?.partyName || ''}
                      isOptionEqualToValue={(o, v) => o?.partyName === v?.partyName}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Party" error={!!errors.partyName} helperText={errors.partyName?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>
            
            <div className="col-md-3 mb-3 d-flex align-items-center">
            <Controller
              name="viewMode"
              control={control}
              render={({ field }) => (
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={field.value === 'Receivable' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => field.onChange('Receivable')}
                  >
                    Receivable
                  </Button>
                  <Button
                    variant={field.value === 'Payable' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => field.onChange('Payable')}
                  >
                    Payable
                  </Button>
                </ButtonGroup>
              )}
            />
            
                </div>
           <div className="col-12 col-md-3 mb-3">
  <div className="d-flex flex-wrap ">
    <ActionButton title="Search" icon={SearchIcon} type="submit" />
    <ActionButton title="Clear" icon={ClearIcon} onClick={ClearForm} />
  </div>
</div>

            {/*  */}
          </div>
           {isLoading && (
              <div className="d-flex justify-content-center items-center">
                  <CircularProgress />
                </div>
               )}
        </div>
      </form>
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
                <span>TDS Register</span>
                <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
        {getData && getData.length > 0 ? (
          <CommonReportTable
            data={getData}
            columns={reportColumns}
            fileName={'TDS Register'}
            tableOptions={tableOptions}
            headerFields={headerFields}
            showDownloadButtonsPdf = {false}

            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}

          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            No data found
          </div>
        )}
      </DialogContent>
      
            </Dialog>
             {listView && (
                    <div className="mt-4">
                      <CommonReportTable
                        data={getData}
                        columns={reportColumns}
                        fileName={'TDS Register'}
                        headerFields={headerFields}
                        showDownloadButtonsPdf = {false}

                        handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
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
export default TDSRegister;
