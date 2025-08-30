import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, ButtonGroup } from '@mui/material'; // ← missing imports
import { Autocomplete, FormControl, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer } from 'react-toastify';
import { showToast } from 'utils/toast-component';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import CommonReportTable from 'utils/CommonReportTable';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import dayjs from 'dayjs';
import apiCalls from 'apicall';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// only import once
const GSTRegister = () => {
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
      partyName: null,
      viewMode: 'Revenue'
    }
  });
  const viewMode = watch('viewMode');
  const [partyNameList, setPartyNameList] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getData, setGetData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [listView, setListView] = useState(false);
  const [headerFields, setHeaderFields] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const finYear = localStorage.getItem('finYear');
  const [listViewData, setListViewData] = useState([]);

  const revenueColumns = [
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
    //  {
    //   accessorKey: 'partyCode',
    //   header: 'Party Code',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },

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
    // {
    //   accessorKey: 'partyType',
    //   header: 'Party Type',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
    // {
    //   accessorKey: 'gstNo',
    //   header: 'Gst No',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
    {
      accessorKey: 'currency',
      header: 'Currency',
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
      accessorKey: 'exRate',
      header: 'Ex Rate',
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
      accessorKey: 'gstPercent',
      header: 'Gst %',
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
    }
  ];

  const costColumns = [
    {
      accessorKey: 'docId',
      header: 'Doc Id',
      size: 110,
      Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
      size: 110,
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
    // {
    //   accessorKey: 'partyCode',
    //   header: 'Party Code',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
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
    // {
    //   accessorKey: 'partyType',
    //   header: 'Party Type',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
    // {
    //   accessorKey: 'gstNo',
    //   header: 'Gst No',
    //   size: 110,
    //   Cell: ({ cell }) => <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>,
    //   muiTableHeadCellProps: {
    //     align: 'center',
    //     sx: {
    //       backgroundColor: '#34449B',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       fontSize: '0.875rem',
    //       padding: '12px 8px'
    //     }
    //   }
    // },
    {
      accessorKey: 'currency',
      header: 'Currency',
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
      accessorKey: 'exRate',
      header: 'Ex Rate',
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
      accessorKey: 'gstPercent',
      header: 'Gst %',
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
    }
  ];

  const reportColumns = useMemo(() => {
    return viewMode === 'Revenue' ? revenueColumns : costColumns;
  }, [viewMode]);

  // useEffect(() => {
  //   const fetchDropdowns = async () => {
  //     try {
  //       const branches = await getAllActiveBranches(orgId);
  //       setBranchCodeList(branches);

  //       const response = await apiCalls(
  //         'get',
  //         `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`
  //       );
  //       const allOption = { partyName: 'All' };
  //       const parties = [allOption, ...(response?.paramObjectsMap?.partyMasterVO || [])];
  //       setPartyNameList(parties);
  //       setValue('partyName', allOption);
  //     } catch (error) {
  //       console.error('Error fetching dropdowns:', error);
  //     }
  //   };
  //   fetchDropdowns();
  // }, [orgId, setValue]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const branches = await getAllActiveBranches(orgId);
        setBranchCodeList(branches);

        const partyType = viewMode === 'Revenue' ? 'customer' : 'vendor';

        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${partyType}`);

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
    setValue('viewMode', 'Revenue');
    clearErrors();
    setIsLoading(false);
    setListView(false);
    setOpenModal(false);
    setHeaderFields([]);
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const { partyName, fromDate, toDate, viewMode } = formData;

    const formattedFromDate = dayjs(fromDate).format('YYYY-MM-DD');
    const formattedToDate = dayjs(toDate).format('YYYY-MM-DD');

    try {
      let response;

      if (viewMode === 'Revenue') {
        response = await apiCalls(
          'get',
          `/taxInvoice/getRevenueGstReport?finYear=${finYear}&fromDate=${formattedFromDate}&orgId=${orgId}&partyName=${partyName?.partyName || ''}&toDate=${formattedToDate}`
        );
      } else {
        response = await apiCalls(
          'get',
          `/costInvoice/getCostGstReport?finYear=${finYear}&fromDate=${formattedFromDate}&orgId=${orgId}&partyName=${partyName?.partyName || ''}&toDate=${formattedToDate}`
        );
      }

      setGetData(response?.paramObjectsMap?.mapp);
      setOpenModal(true);
      setListView(true);

      const headers = [
        { label: 'Range', value: `${dayjs(fromDate).format('DD-MM-YYYY')} to ${dayjs(toDate).format('DD-MM-YYYY')}` },
        { label: 'Party Name', value: partyName?.partyName || 'All' },
        { label: 'View Mode', value: viewMode }
      ];
      setHeaderFields(headers);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Report Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  };

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

  //
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
  //

  // excel download

  const handleDownloadExcel = async ({ logo }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GST Register');

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
    titleCell.value = 'GST Register';
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
    const numberFields = ['gstAmount', 'totalAmountLc', 'billAmount', 'chargeAmount'];

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
    saveAs(blob, `GST_Register_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
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

            <div className="col-md-2 mb-4 d-flex align-items-center">
              <Controller
                name="viewMode"
                control={control}
                render={({ field }) => (
                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      variant={field.value === 'Revenue' ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => field.onChange('Revenue')}
                    >
                      Revenue
                    </Button>
                    <Button
                      variant={field.value === 'Cost' ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => field.onChange('Cost')}
                    >
                      Cost
                    </Button>
                  </ButtonGroup>
                )}
              />
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

      {/* Modal for Report Table */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        //  handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
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
          <span>GST Register</span>
          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* <DialogContent sx={{ padding: 0 }}>
         { <CommonReportTable ?(
            data={getData}
            columns={reportColumns}
            fileName={'GST Register'}
            tableOptions={tableOptions}
            headerFields={headerFields}
          />):(
               <div style={{ textAlign: 'center', padding: '20px' }}>
      No data found
    </div>
          )}
        </DialogContent> */}
        <DialogContent sx={{ padding: 0 }}>
          {getData && getData.length > 0 ? (
            <CommonReportTable
              data={getData}
              columns={reportColumns}
              fileName={'GST Register'}
              tableOptions={tableOptions}
              headerFields={headerFields}
              handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
              showDownloadButtonsPdf={false}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>No data found</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Optional list view */}
      {listView && (
        <div className="mt-4">
          <CommonReportTable
            data={getData}
            columns={reportColumns}
            fileName={'GST Register'}
            headerFields={headerFields}
            handleDownloadExcel={() => handleDownloadExcel({ logo: listViewData[0]?.companyLogo })}
            isListView={true}
            showDownloadButtonsPdf={false}
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

export default GSTRegister;
