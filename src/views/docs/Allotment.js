import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Styled components for modern look
const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: 12,
    maxHeight: 400,
    '&::-webkit-scrollbar': {
        width: 8,
        height: 8
    },
    '&::-webkit-scrollbar-track': {
        background: alpha(theme.palette.primary.light, 0.1),
        borderRadius: 4
    },
    '&::-webkit-scrollbar-thumb': {
        background: alpha(theme.palette.primary.main, 0.3),
        borderRadius: 4,
        '&:hover': {
            background: alpha(theme.palette.primary.main, 0.5)
        }
    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.light, 0.08),
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    color: theme.palette.text.primary,
    fontSize: "0.85rem",
    padding: "10px 8px",

    whiteSpace: "nowrap",
    minWidth: 80,
    textAlign: "center",

    position: "sticky",
    top: 0,
    zIndex: 10,

    backdropFilter: "blur(6px)"
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.05),
        transition: 'background-color 0.2s ease'
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 0
    }
}));

const emptyRow = {
    projectCode: '',
    partBox: '',
    inventoryBoxes: '',
    scheduleQty: '',
    nov25: '',
    boxReqDay: '',
    boxesRequired: '',
    shortageMonth: '',
    short: '',
    adherence: ''
};

// Custom DateRangePicker component using react-datepicker
const DateRangePicker = ({ startDate, endDate, onChange, minDate }) => {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const handleStartChange = (date) => {
        setStart(date);
        onChange([date, end]);
    };

    const handleEndChange = (date) => {
        setEnd(date);
        onChange([start, date]);
    };

    return (
        <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 1 }}>
                <DatePicker
                    selected={start}
                    onChange={handleStartChange}
                    selectsStart
                    startDate={start}
                    endDate={end}
                    minDate={minDate}
                    placeholderText="Start Date"
                    dateFormat="MMM dd, yyyy"
                    customInput={
                        <TextField
                            size="small"
                            fullWidth
                            label="Start Date"
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                        />
                    }
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <DatePicker
                    selected={end}
                    onChange={handleEndChange}
                    selectsEnd
                    startDate={start}
                    endDate={end}
                    minDate={start || minDate}
                    maxDate={start ? new Date(start.getTime() + (30 * 24 * 60 * 60 * 1000)) : undefined}
                    placeholderText="End Date"
                    dateFormat="MMM dd, yyyy"
                    customInput={
                        <TextField
                            size="small"
                            fullWidth
                            label="End Date"
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                        />
                    }
                />
            </Box>
        </Stack>
    );
};

const Allotment = () => {
    const theme = useTheme();
    const [supplier, setSupplier] = useState('');
    const [customer, setCustomer] = useState('');
    const [mode, setMode] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([{ ...emptyRow }]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const supplierList = [
        { id: 1, name: 'Supplier A', code: 'SUP001', category: 'Premium' },
        { id: 2, name: 'Supplier B', code: 'SUP002', category: 'Standard' },
        { id: 3, name: 'Supplier C', code: 'SUP003', category: 'Premium' }
    ];

    const customerList = [
        { id: 1, name: 'Customer X', code: 'CUST001', tier: 'Gold' },
        { id: 2, name: 'Customer Y', code: 'CUST002', tier: 'Silver' },
        { id: 3, name: 'Customer Z', code: 'CUST003', tier: 'Platinum' }
    ];

    const modeList = [
        { value: 'Daily', icon: '📅', color: '#2196f3' },
        { value: 'Weekly', icon: '📆', color: '#9c27b0' },
        { value: 'Monthly', icon: '📊', color: '#4caf50' }
    ];

    // Generate dynamic columns based on mode and date selection
    const dynamicColumns = useMemo(() => {
        if (!mode || (!selectedDate && !dateRange[0])) return [];

        const columns = [];

        if (mode === 'Daily' && selectedDate) {
            const dateStr = selectedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                // year: 'numeric'
            });
            columns.push({
                field: `day_${dateStr}`,
                label: `Day (${dateStr})`,
                tooltip: `Values for ${dateStr}`
            });
        }

        if (mode === 'Weekly' && dateRange[0] && dateRange[1]) {
            // Add columns for each day in the week
            const days = [];
            let currentDate = new Date(dateRange[0]);
            while (currentDate <= dateRange[1]) {
                const dateStr = currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    //   year: 'numeric'
                });
                days.push({
                    field: `week_${dateStr}`,
                    label: `${dateStr}`,
                    tooltip: `Values for ${dateStr}`
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return days;
        }

        if (mode === 'Monthly' && dateRange[0] && dateRange[1]) {
            // Add columns for each day in the month range
            const days = [];
            let currentDate = new Date(dateRange[0]);
            while (currentDate <= dateRange[1]) {
                const dateStr = currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    //   year: 'numeric'
                });
                days.push({
                    field: `month_${dateStr}`,
                    label: `${dateStr}`,
                    tooltip: `Values for ${dateStr}`
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return days;
        }

        return columns;
    }, [mode, selectedDate, dateRange]);

    // Update empty row to include dynamic fields
    const getEmptyRowWithDynamicFields = () => {
        const baseRow = { ...emptyRow };
        dynamicColumns.forEach(col => {
            baseRow[col.field] = '';
        });
        return baseRow;
    };

    // Initialize rows with dynamic fields when mode or dates change
    useMemo(() => {
        setRows(prevRows => {
            return prevRows.map(row => {
                const newRow = { ...row };
                // Add new dynamic fields if they don't exist
                dynamicColumns.forEach(col => {
                    if (!newRow[col.field]) {
                        newRow[col.field] = '';
                    }
                });
                return newRow;
            });
        });
    }, [dynamicColumns]);

    // Filter rows based on search term
    const filteredRows = useMemo(() => {
        if (!searchTerm) return rows;
        return rows.filter((row) => Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())));
    }, [rows, searchTerm]);

    const handleAddRow = () => {
        setRows([...rows, getEmptyRowWithDynamicFields()]);
        showSnackbar('New row added', 'success');
    };

    const handleRemoveRow = (index) => {
        if (rows.length === 1) {
            showSnackbar('Cannot remove the last row', 'warning');
            return;
        }
        setRows(rows.filter((_, i) => i !== index));
        showSnackbar('Row removed', 'info');
    };

    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleAllotment = async () => {
        if (supplier && customer && mode) {
            // Validate date selection based on mode
            if (mode === 'Daily' && !selectedDate) {
                showSnackbar('Please select a date', 'error');
                return;
            }
            if (mode === 'Weekly' && (!dateRange[0] || !dateRange[1])) {
                showSnackbar('Please select a date range (7 days)', 'error');
                return;
            }
            if (mode === 'Monthly' && (!dateRange[0] || !dateRange[1])) {
                showSnackbar('Please select a date range (max 31 days)', 'error');
                return;
            }

            setLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false);
            setOpen(true);
            showSnackbar('Allotment generated successfully', 'success');
        }
    };

    const handleClear = () => {
        setSupplier('');
        setCustomer('');
        setMode('');
        setSelectedDate(null);
        setDateRange([null, null]);
        setRows([getEmptyRowWithDynamicFields()]);
        setSearchTerm('');
        showSnackbar('All fields cleared', 'info');
    };

    const handleSave = () => {
        const isValid = rows.every((row) => row.projectCode && row.partBox && row.inventoryBoxes);

        if (!isValid) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }

        showSnackbar('Allotment saved successfully!', 'success');
        setOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleExport = () => {
        showSnackbar('Preparing export...', 'info');
        // Add export logic here
        setTimeout(() => {
            showSnackbar('Data exported successfully', 'success');
        }, 1500);
    };

    const getSelectedModeDetails = () => {
        return modeList.find((m) => m.value === mode) || modeList[0];
    };

    const handleDateChange = (newValue) => {
        if (mode === 'Daily') {
            setSelectedDate(newValue);
        } else if (mode === 'Weekly') {
            setDateRange(newValue);
            // Validate week range (7 days)
            if (newValue[0] && newValue[1]) {
                const diffTime = Math.abs(newValue[1] - newValue[0]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays !== 6) { // 6 days difference means 7 days total
                    showSnackbar('Please select exactly 7 days for weekly view', 'warning');
                }
            }
        } else if (mode === 'Monthly') {
            setDateRange(newValue);
            // Validate month range (max 31 days)
            if (newValue[0] && newValue[1]) {
                const diffTime = Math.abs(newValue[1] - newValue[0]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 30) {
                    showSnackbar('Maximum 31 days allowed for monthly view', 'warning');
                    setDateRange([newValue[0], null]);
                }
            }
        }
    };

    // Get all table headers
    const tableHeaders = useMemo(() => {
        const baseHeaders = [
            { label: 'Project Code', tooltip: 'Unique project identifier', field: 'projectCode' },
            { label: 'Part/Box', tooltip: 'Part or box number', field: 'partBox' },
            { label: 'Inventory', tooltip: 'Current inventory count', field: 'inventoryBoxes' },
            { label: 'Schedule', tooltip: 'Scheduled quantity', field: 'scheduleQty' },
            { label: 'Nov-25', tooltip: 'November 2025 projection', field: 'nov25' },
            { label: 'Box/Day', tooltip: 'Boxes per day', field: 'boxReqDay' },
            { label: 'Boxes Req', tooltip: 'Total boxes required', field: 'boxesRequired' },
            { label: 'Shortage', tooltip: 'Monthly shortage', field: 'shortageMonth' },
            { label: 'Short', tooltip: 'Shortage status', field: 'short' },
            { label: 'Adherence', tooltip: 'Adherence percentage', field: 'adherence' }
        ];

        // Insert dynamic columns after Nov-25 (index 4)
        const allHeaders = [...baseHeaders];
        if (dynamicColumns.length > 0) {
            allHeaders.splice(10, 0, ...dynamicColumns.map(col => ({
                label: col.label,
                tooltip: col.tooltip,
                field: col.field
            })));
        }

        return allHeaders;
    }, [dynamicColumns]);

    // Custom styles for react-datepicker
    const datePickerStyles = `
    .react-datepicker {
      font-family: inherit;
      border-radius: 12px;
      border: 1px solid ${alpha(theme.palette.primary.main, 0.2)};
      box-shadow: ${theme.shadows[8]};
    }
    .react-datepicker__header {
      background-color: ${alpha(theme.palette.primary.light, 0.1)};
      border-bottom: 1px solid ${alpha(theme.palette.primary.main, 0.2)};
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .react-datepicker__day--selected {
      background-color: ${theme.palette.primary.main};
      border-radius: 8px;
    }
    .react-datepicker__day--in-range {
      background-color: ${alpha(theme.palette.primary.main, 0.2)};
    }
  `;

    return (
        <>
            <style>{datePickerStyles}</style>
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <Fade in={true} timeout={800}>
                    <StyledPaper elevation={0}>
                        {/* Header Section */}
                        <Box sx={{ p: 3, pb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                                        <AutoAwesomeIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} color="text.primary">
                                            Allotment Configuration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Manage and allocate resources efficiently
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        <Divider sx={{ mx: 3 }} />

                        {/* Main Controls */}
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <InputLabel>Supplier</InputLabel>
                                        <Select value={supplier} label="Supplier" onChange={(e) => setSupplier(e.target.value)} sx={{ borderRadius: 2 }}>
                                            {supplierList.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <span>{item.name}</span>
                                                        <Chip label={item.code} size="small" variant="outlined" />
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <InputLabel>Customer</InputLabel>
                                        <Select value={customer} label="Customer" onChange={(e) => setCustomer(e.target.value)} sx={{ borderRadius: 2 }}>
                                            {customerList.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <span>{item.name}</span>
                                                        <Chip label={item.tier} size="small" color="primary" variant="outlined" />
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <InputLabel>Mode</InputLabel>
                                        <Select
                                            value={mode}
                                            label="Mode"
                                            onChange={(e) => {
                                                setMode(e.target.value);
                                                setSelectedDate(null);
                                                setDateRange([null, null]);
                                            }}
                                            sx={{ borderRadius: 2 }}
                                            renderValue={(selected) => {
                                                const modeItem = modeList.find((m) => m.value === selected);
                                                return (
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <span>{modeItem?.icon}</span>
                                                        <span>{selected}</span>
                                                    </Stack>
                                                );
                                            }}
                                        >
                                            {modeList.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <span>{item.icon}</span>
                                                        <span>{item.value}</span>
                                                        <Box sx={{ flex: 1 }} />
                                                        <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: item.color }} />
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    {mode === 'Daily' && (
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            placeholderText="Select Date"
                                            dateFormat="MMM dd, yyyy"
                                            customInput={
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    label="Select Date"
                                                    InputProps={{
                                                        sx: { borderRadius: 2 }
                                                    }}
                                                />
                                            }
                                        />
                                    )}

                                    {(mode === 'Weekly' || mode === 'Monthly') && (
                                        <DateRangePicker
                                            startDate={dateRange[0]}
                                            endDate={dateRange[1]}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Generate Allotment" TransitionComponent={Zoom}>
                                            <span>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleAllotment}
                                                    disabled={!supplier || !customer || !mode || loading}
                                                    startIcon={loading ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <AutoAwesomeIcon />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        px: 3,
                                                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                                                        '@keyframes spin': {
                                                            '0%': { transform: 'rotate(0deg)' },
                                                            '100%': { transform: 'rotate(360deg)' }
                                                        }
                                                    }}
                                                >
                                                    {loading ? 'Generating...' : 'Generate'}
                                                </Button>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Clear All" TransitionComponent={Zoom}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleClear}
                                                startIcon={<RefreshIcon />}
                                                sx={{ borderRadius: 2, textTransform: 'none' }}
                                            >
                                                Clear
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="Export Data" TransitionComponent={Zoom}>
                                            <IconButton onClick={handleExport} sx={{ borderRadius: 2 }}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </StyledPaper>
                </Fade>

                {/* Dialog */}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth={false}
                    fullWidth
                    scroll="body"
                    PaperProps={{
                        sx: {
                            width: "95vw",
                            maxHeight: "90vh",
                            borderRadius: 4,
                            overflow: "visible"
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            pb: 2
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                                <AutoAwesomeIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Allotment Details
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {supplierList.find((s) => s.id === supplier)?.name} → {customerList.find((c) => c.id === customer)?.name} •{' '}
                                    {getSelectedModeDetails()?.icon} {mode}
                                    {mode === 'Daily' && selectedDate && ` • ${selectedDate.toLocaleDateString()}`}
                                    {mode === 'Weekly' && dateRange[0] && dateRange[1] &&
                                        ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                    {mode === 'Monthly' && dateRange[0] && dateRange[1] &&
                                        ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton onClick={() => setOpen(false)} size="small" sx={{ borderRadius: 2 }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3 }}>
                        <StyledTableContainer>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders.map((header) => (
                                            <StyledTableCell key={header.label}>
                                                <Tooltip title={header.tooltip} arrow>
                                                    <span>{header.label}</span>
                                                </Tooltip>
                                            </StyledTableCell>
                                        ))}
                                        <StyledTableCell>
                                            <Tooltip title="Row operations" arrow>
                                                <span>Actions</span>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredRows.length > 0 ? (
                                        filteredRows.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                {tableHeaders.map((header) => (
                                                    <TableCell key={header.field} sx={{ py: 1, px: 1 }}>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={row[header.field] || ''}
                                                            onChange={(e) => handleChange(index, header.field, e.target.value)}
                                                            placeholder={header.label}
                                                            fullWidth
                                                            InputProps={{
                                                                sx: {
                                                                    height: 36,
                                                                    fontSize: '0.85rem',
                                                                    borderRadius: 2,
                                                                    '&:hover': {
                                                                        borderColor: theme.palette.primary.main
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                ))}

                                                <TableCell align="center" sx={{ py: 1 }}>
                                                    <Tooltip title="Delete Row" arrow>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleRemoveRow(index)}
                                                                disabled={rows.length === 1}
                                                                size="small"
                                                                sx={{
                                                                    color: theme.palette.error.main,
                                                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={tableHeaders.length + 1} align="center" sx={{ py: 3 }}>
                                                <Typography color="text.secondary">No matching records found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>

                        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                onClick={handleAddRow}
                                sx={{
                                    borderRadius: 2,
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2 }
                                }}
                            >
                                Add New Row
                            </Button>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Button variant="outlined" onClick={() => setOpen(false)} startIcon={<CloseIcon />} sx={{ borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            startIcon={<SaveIcon />}
                            sx={{
                                borderRadius: 2,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    TransitionComponent={Zoom}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: theme.shadows[8]
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default Allotment;