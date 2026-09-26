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
    Chip,
    Tooltip,
    Box
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
            customer: null
        }
    });

    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [getData, setGetData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [listView, setListView] = useState(false);
    const [headerFields, setHeaderFields] = useState([]);
    const [listViewData, setListViewData] = useState([]);

    const orgId = localStorage.getItem('orgId');
    const finYear = localStorage.getItem('finYear');

    // ====== SUMMARY COMPUTATION ======
    const summary = useMemo(() => {
        if (!getData || getData.length === 0) {
            return { totalReceipt: 0, totalOnAccount: 0, count: 0 };
        }
        return getData.reduce(
            (acc, row) => {
                acc.totalReceipt += Number(row.receiptAmount || 0);
                acc.totalOnAccount += Number(row.onAccount || 0);
                acc.count += 1;
                return acc;
            },
            { totalReceipt: 0, totalOnAccount: 0, count: 0 }
        );
    }, [getData]);

    // ====== COLUMNS (based on new API response) ======
    const consoleColumns = useMemo(
        () => [
            {
                accessorKey: 'customerName',
                header: 'Customer',
                size: 200,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
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
                accessorKey: 'billedMonthYear',
                header: 'Billed Month',
                size: 130,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
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
                accessorKey: 'chequeUtiNo',
                header: 'UTI',
                size: 180,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px', fontSize: '0.8rem' }}>
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
                accessorKey: 'chequeUtiDate',
                header: 'UTI Date',
                size: 130,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>
                        {cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}
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
                accessorKey: 'receiptAmount',
                header: 'Receipt Amt',
                size: 120,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'right', padding: '8px', fontWeight: 600, color: '#1b5e20' }}>
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
                accessorKey: 'onAccount',
                header: 'On Account',
                size: 110,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'right', padding: '8px', color: '#b26a00' }}>
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
                accessorKey: 'entity',
                header: 'Entity',
                size: 130,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
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
                accessorKey: 'businessCategory',
                header: 'Category',
                size: 130,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>{cell.getValue() || '-'}</div>
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
                accessorKey: 'docId',
                header: 'Doc Id',
                size: 130,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px', fontWeight: 600, color: '#34449B' }}>
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
                accessorKey: 'docDate',
                header: 'Doc Date',
                size: 110,
                Cell: ({ cell }) => (
                    <div style={{ textAlign: 'left', padding: '8px' }}>
                        {cell.getValue() ? dayjs(cell.getValue()).format('DD-MM-YYYY') : '-'}
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
            // ✅ FIXED: renamed accessorKey so CMRT2 doesn't hijack it
            {
                accessorKey: 'statusDisplay',
                header: 'Status',
                size: 110,
                enableEditing: false,        // stop MRT from making it editable
                enableColumnActions: false,  // no column menu
                enableSorting: true,
                Cell: ({ row }) => {
                    const value = row.original?.status;   // read real value from original row
                    const colorMap = {
                        Approved: { bg: '#e8f5e9', color: '#1b5e20' },
                        Pending: { bg: '#fff8e1', color: '#b26a00' },
                        Rejected: { bg: '#ffebee', color: '#b71c1c' }
                    };
                    const scheme = colorMap[value] || { bg: '#eeeeee', color: '#424242' };
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
                },
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
            }
        ],
        []
    );

    // ====== FETCH CUSTOMER DROPDOWN ======
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const response = await apiCalls(
                    'get',
                    `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`
                );
                const allOption = { partyName: 'All' };
                const parties = [allOption, ...(response?.paramObjectsMap?.partyMasterVO || [])];
                setCustomerList(parties);
                setValue('customer', allOption);
            } catch (error) {
                console.error('Error fetching dropdowns:', error);
            }
        };
        if (orgId) fetchDropdowns();
    }, [orgId, setValue]);

    // ====== CLEAR FORM ======
    const ClearForm = () => {
        setValue('customer', { partyName: 'All' });
        setValue('asOnDate', dayjs());
        clearErrors();
        setIsLoading(false);
        setListView(false);
        setOpenModal(false);
        setHeaderFields([]);
        setGetData([]);
    };

    // ====== SUBMIT ======
    const onSubmit = async (formData) => {
        setIsLoading(true);
        const { customer, asOnDate } = formData;
        const formattedAsOnDate = dayjs(asOnDate).format('YYYY-MM-DD');

        try {
            const response = await apiCalls(
                'get',
                `/arreceivable/getConsoleReport?asOnDate=${formattedAsOnDate}&partyName=${customer?.partyName || ''}`
            );

            const data = response?.paramObjectsMap?.mapp || [];
            setGetData(data);
            setOpenModal(true);
            setListView(true);

            const headers = [
                { label: 'As On Date', value: dayjs(asOnDate).format('DD-MM-YYYY') },
                { label: 'Customer', value: customer?.partyName || 'All' },
                { label: 'Total Records', value: data.length }
            ];
            setHeaderFields(headers);

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
        muiTableContainerProps: { sx: { maxHeight: '70vh' } },
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                backgroundColor: row.index % 2 ? '#f9f9f9' : '#ffffff',
                '&:hover': { backgroundColor: '#f0f7ff' }
            }
        }),
        enableStickyHeader: true,
        // ✅ Stop CMRT2 from injecting row actions / edit column
        enableEditing: false,
        enableRowActions: false,
        muiTableProps: {
            sx: {
                borderCollapse: 'collapse',
                '& .MuiTableCell-root': { border: '1px solid #e0e0e0 !important' }
            }
        }
    };

    // ====== FETCH COMPANY DETAILS ======
    const getCompanyDetails = async () => {
        try {
            const response = await apiCalls('get', `commonmaster/company/${orgId}`);
            setListViewData(response.paramObjectsMap.companyVO.reverse());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getCompanyDetails();
    }, []);

    // ====== EXCEL DOWNLOAD ======
    const handleDownloadExcel = async ({ logo }) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Console Report');

        // LOGO (A1:B4)
        worksheet.mergeCells('A1:B4');
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
            } catch (err) {
                console.error('Error adding logo:', err);
            }
        }

        // TITLE
        worksheet.mergeCells('C2:E3');
        const titleCell = worksheet.getCell('C2');
        titleCell.value = 'Console Report';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // HEADER FIELDS (ROW 5)
        const headerRowNumber = 5;
        const excelHeaderFields = [
            ...headerFields,
            { label: 'Generated By', value: localStorage.getItem('userName') || 'System' },
            { label: 'Generated On', value: dayjs().format('DD-MM-YYYY HH:mm') }
        ];

        excelHeaderFields.forEach(({ label, value }, index) => {
            const colLetter = String.fromCharCode(65 + index);
            const cellAddress = `${colLetter}${headerRowNumber}`;
            const cell = worksheet.getCell(cellAddress);
            cell.value = `${label}: ${value}`;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF593C8F' }
            };
        });

        // COLUMN HEADERS (ROW 6)
        const headers = consoleColumns.map((col) => col.header);
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 20;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3B76E2' }
            };
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

        const numberFields = ['receiptAmount', 'onAccount'];

        // ✅ DATA ROWS — map statusDisplay back to real `status` for export
        (getData || []).forEach((row) => {
            const rowData = consoleColumns.map((col) => {
                if (col.accessorKey === 'statusDisplay') return row.status;
                if (col.accessorKey === 'docDate' || col.accessorKey === 'chequeUtiDate') {
                    return row[col.accessorKey] ? dayjs(row[col.accessorKey]).format('DD-MM-YYYY') : '';
                }
                return row[col.accessorKey];
            });

            const addedRow = worksheet.addRow(rowData);
            consoleColumns.forEach((col, colIndex) => {
                const fieldKey = col.accessorKey;
                const cell = addedRow.getCell(colIndex + 1);
                if (numberFields.includes(fieldKey)) {
                    cell.numFmt = '#,##0.00';
                }
            });
        });

        // AUTO WIDTH
        worksheet.columns.forEach((column) => {
            let maxLength = 10;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, value.length);
            });
            column.width = maxLength + 2;
        });

        // EXPORT
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `Console_Report_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    };

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="card w-full p-6 bg-base-100 shadow-xl"
                    style={{ padding: '20px', borderRadius: '10px' }}
                >
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

                        {/* Customer Dropdown */}
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
                                                <TextField
                                                    {...params}
                                                    label="Customer"
                                                    error={!!errors.customer}
                                                    helperText={errors.customer?.message}
                                                />
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

            {/* Modal for Report Table */}
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
                    <span>Console Report — Receivable</span>
                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: 0 }}>
                    {getData && getData.length > 0 ? (
                        <CMRT2
                            data={getData}
                            columns={consoleColumns}
                            fileName={'Console Report'}
                            tableOptions={tableOptions}
                            headerFields={headerFields}
                            handleDownloadExcel={() =>
                                handleDownloadExcel({ logo: listViewData[0]?.companyLogo })
                            }
                            showDownloadButtonsPdf={false}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>No data found</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>
                                Try adjusting the As On Date or Customer filter.
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Optional list view */}
            {listView && getData && getData.length > 0 && (
                <div className="mt-4">
                    <CMRT2
                        data={getData}
                        columns={consoleColumns}
                        fileName={'Console Report'}
                        headerFields={headerFields}
                        handleDownloadExcel={() =>
                            handleDownloadExcel({ logo: listViewData[0]?.companyLogo })
                        }
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

// ====== Reusable Summary Card ======
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

export default ConsoleReport;