import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import GridOnIcon from '@mui/icons-material/GridOn'; // For FillGrid
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Checkbox,
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
    Radio,
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
import EditIcon from "@mui/icons-material/Edit";
import { styled } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useMemo, useState } from 'react';
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
    kitNo: '',
    kitDesc: '',
    projectCode: '',
    partBox: '',
    inventoryBoxes: '',
    scheduleQty: '',
    nov25: '',
    boxReqDay: '',
    boxesRequired: '',
    shortageMonth: '',
    short: '',
    adherence: '',
    allot: ''
};

// Custom DateRangePicker component using react-datepicker
const DateRangePicker = ({
    startDate,
    endDate,
    onChange,
    minDate,
    popperPlacement,
    popperProps,
    portalId
}) => {
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
                    popperPlacement={popperPlacement}
                    popperProps={popperProps}
                    portalId={portalId}
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
                    popperPlacement={popperPlacement}
                    popperProps={popperProps}
                    portalId={portalId}
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

export const KitDetailsPopup = ({ open, onClose, onSelect, kitList }) => {

    const [selectedKits, setSelectedKits] = useState([]);

    const handleSelectKit = (kit) => {
        const exists = selectedKits.find(k => k.id === kit.id);

        if (exists) {
            setSelectedKits(selectedKits.filter(k => k.id !== kit.id));
        } else {
            setSelectedKits([...selectedKits, kit]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedKits(kitList);
        } else {
            setSelectedKits([]);
        }
    };

    const handleApply = () => {
        if (selectedKits.length) {
            onSelect(selectedKits);
            onClose();
        }
    };

    const isAllSelected = kitList.length && selectedKits.length === kitList.length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={600}>Select Kit</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">

                        <TableHead>
                            <TableRow>

                                {/* Select All */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={
                                            selectedKits.length > 0 &&
                                            selectedKits.length < kitList.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>

                                <TableCell>S.No</TableCell>
                                <TableCell>Kit No</TableCell>
                                <TableCell>Description</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {kitList.map((kit, index) => {

                                const isChecked = selectedKits.some(k => k.id === kit.id);

                                return (
                                    <TableRow key={kit.id} hover>

                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={() => handleSelectKit(kit)}
                                            />
                                        </TableCell>

                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{kit.kitNo}</TableCell>
                                        <TableCell>{kit.kitDesc}</TableCell>

                                    </TableRow>
                                );
                            })}
                        </TableBody>


                    </Table>
                </TableContainer>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                <Button
                    variant="contained"
                    disabled={!selectedKits.length}
                    onClick={handleApply}
                >
                    Apply Kit ({selectedKits.length})
                </Button>
            </DialogActions>

        </Dialog>
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
    const [kitPopupOpen, setKitPopupOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [kitList, setKitList] = useState([]);
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [branch, setBranch] = useState(localStorage.getItem('branch'));
    const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
    const [rows, setRows] = useState([{ ...emptyRow }]);
    const [popupRows, setPopupRows] = useState([]);
    const [editId, setEditId] = useState(null);

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

    useEffect(() => {
        getAllKitDetails();
        getAllAllotmentByOrgId();
    }, []);

    // Generate dynamic columns based on mode and date selection
    const dynamicColumns = useMemo(() => {
        if (!mode || (!selectedDate && !dateRange[0])) return [];

        const columns = [];

        if (mode === 'Daily' && selectedDate) {
            const dateStr = selectedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            columns.push({
                field: `day_${dateStr}`,
                label: `Day (${dateStr})`,
                tooltip: `Values for ${dateStr}`
            });
        }

        if (mode === 'Weekly' && dateRange[0] && dateRange[1]) {
            let currentDate = new Date(dateRange[0]);
            while (currentDate <= dateRange[1]) {
                const dateStr = currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                columns.push({
                    field: `week_${dateStr}`,
                    label: `${dateStr}`,
                    tooltip: `Values for ${dateStr}`
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return columns;
        }

        if (mode === 'Monthly' && dateRange[0] && dateRange[1]) {
            let currentDate = new Date(dateRange[0]);
            while (currentDate <= dateRange[1]) {
                const dateStr = currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                columns.push({
                    field: `month_${dateStr}`,
                    label: `${dateStr}`,
                    tooltip: `Values for ${dateStr}`
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return columns;
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
        setRows([...rows, { ...emptyRow }]);
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

    const handleKitSelect = (kits) => {

        const newRows = kits.map(k => ({
            ...getEmptyRowWithDynamicFields(),
            kitNo: k.kitNo,
            kitDesc: k.kitDesc
        }));

        setPopupRows(newRows);
        showSnackbar(`${kits.length} Kit(s) loaded`, 'success');
    };

    const handlePopupChange = (index, field, value) => {
        const updatedRows = [...popupRows];
        updatedRows[index][field] = value;
        setPopupRows(updatedRows);
    };

    const handlePopupAddRow = () => {
        setPopupRows([...popupRows, getEmptyRowWithDynamicFields()]);
    };

    const handlePopupRemoveRow = (index) => {
        if (popupRows.length === 1) return;

        setPopupRows(popupRows.filter((_, i) => i !== index));
    };

    const handleAllotment = async () => {
        if (customer && mode) {
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
        setPopupRows([]);
        setEditId(null);
        setSearchTerm('');
        showSnackbar('Form cleared', 'info');
    };

    const getAllKitDetails = async () => {
        try {
            const result = await apiCalls('get', `/kitController/getKitByOrgId?orgid=${orgId}`);

            setKitList(result.paramObjectsMap.kitVO || []);
        } catch (err) {
            console.log(err);
        }
    };

    const getAllAllotmentByOrgId = async () => {
        try {
            const result = await apiCalls(
                "get",
                `/allotment/getAllAllotmentByOrgId?orgId=${orgId}`
            );

            const allotments = result?.paramObjectsMap?.allotment || [];

            if (!allotments.length) return;

            // Flatten allotmentDetailsVO
            const mappedRows = allotments.flatMap(allot =>
                (allot.allotmentDetailsVO || []).map(detail => ({
                    id: allot.id,
                    ...emptyRow,
                    kitNo: detail.kitNo,
                    kitDesc: detail.kitDesc,
                    projectCode: detail.projectCode,
                    partBox: detail.part,
                    inventoryBoxes: detail.inventory,
                    scheduleQty: detail.schedule,
                    nov25: detail.month,
                    boxReqDay: detail.day,
                    boxesRequired: detail.boxesReq,
                    shortageMonth: detail.shortage,
                    short: detail.shorted,
                    adherence: detail.adherence,
                    allot: detail.allot
                }))
            );

            setRows(mappedRows);

        } catch (err) {
            console.log(err);
        }
    };

    const handleEditAllotment = async (row) => {
        try {
            const res = await apiCalls(
                "get",
                `/allotment/getAllotmentById?id=${row.id}`
            );

            const allotment = res?.paramObjectsMap?.allotment;

            if (!allotment) return;

            setEditId(allotment.id)

            // Fill header fields
            setCustomer(allotment.customer);
            setSupplier(allotment.supplier);
            setMode(allotment.mode);

            setSelectedDate(new Date(allotment.startDate));
            setDateRange([
                new Date(allotment.startDate),
                new Date(allotment.endDate)
            ]);

            // Fill popup rows
            const details = allotment.allotmentDetailsResponseDTO || [];

            setPopupRows(
                details.map(d => ({
                    ...emptyRow,
                    kitNo: d.kitNo,
                    kitDesc: d.kitDesc,
                    projectCode: d.projectCode,
                    partBox: d.part,
                    inventoryBoxes: d.inventory,
                    scheduleQty: d.schedule,
                    boxesRequired: d.boxesReq,
                    shortageMonth: d.shortage,
                    short: d.shorted,
                    adherence: d.adherence,
                    allot: d.allot
                }))
            );

            setOpen(true);

        } catch (err) {
            console.error(err);
            showSnackbar("Failed to load allotment", "error");
        }
    };

    const handleSave = async () => {
        if (!popupRows.length) {
            showSnackbar("No allotment data", "warning");
            return;
        }

        const allotmentDetailsDTO = popupRows.map(row => ({
            kitNo: row.kitNo || "",
            kitDesc: row.kitDesc || "",
            projectCode: row.projectCode || "",
            part: Number(row.partBox || 0),
            inventory: row.inventoryBoxes || "",
            schedule: row.scheduleQty || "",
            boxesReq: Number(row.boxesRequired || 0),
            shortage: Number(row.shortageMonth || 0),
            shorted: Number(row.short || 0),
            adherence: row.adherence || "",
            allot: Number(row.allot || 0),
            day:
                mode === "Daily" && selectedDate
                    ? selectedDate.getDate()
                    : 0,

            month:
                (mode === "Daily" && selectedDate) ||
                    (mode !== "Daily" && dateRange[0])
                    ? ((mode === "Daily" ? selectedDate : dateRange[0]).getMonth() + 1)
                    : 0
        }));

        const payload = {
            ...(editId && { id: editId }),
            active: true,
            cancel: false,
            orgId: Number(orgId),
            customer,
            supplier,
            mode,
            startDate:
                mode === "Daily"
                    ? selectedDate?.toISOString().split("T")[0]
                    : dateRange[0]?.toISOString().split("T")[0],

            endDate:
                mode === "Daily"
                    ? selectedDate?.toISOString().split("T")[0]
                    : dateRange[1]?.toISOString().split("T")[0],

            createdBy: loginUserName,
            updatedBy: loginUserName,
            branchCode: loginBranchCode,
            branchName: branch,

            allotmentDetailsDTO
        };

        try {
            const res = await apiCalls("put", "/allotment/createUpdateAllotment", payload);

            if (res.status === true) {
                setEditId(null);
                showSnackbar("Allotment saved successfully", "success");
                setOpen(false);
                getAllAllotmentByOrgId();
            } else {
                showSnackbar(res.paramObjectsMap?.message || "Save failed", "error");
            }
        } catch (err) {
            console.error(err);
            showSnackbar("Save failed", "error");
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleExport = () => {
        showSnackbar('Preparing export...', 'info');
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
            if (newValue[0] && newValue[1]) {
                const diffTime = Math.abs(newValue[1] - newValue[0]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays !== 6) {
                    showSnackbar('Please select exactly 7 days for weekly view', 'warning');
                }
            }
        } else if (mode === 'Monthly') {
            setDateRange(newValue);
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

    // Get all table headers with S.No at the beginning
    const tableHeaders = useMemo(() => [
        { label: 'S.No', tooltip: 'Serial Number', field: 'sno', width: 60 },
        { label: 'Kit No', field: 'kitNo' },
        { label: 'Kit Description', field: 'kitDesc' },
        { label: 'Project Code', tooltip: 'Unique project identifier', field: 'projectCode' },
        { label: 'Part/Box', tooltip: 'Part or box number', field: 'partBox' },
        { label: 'Inventory', tooltip: 'Current inventory count', field: 'inventoryBoxes' },
        { label: 'Schedule', tooltip: 'Scheduled quantity', field: 'scheduleQty' },
        { label: 'Nov-25', tooltip: 'November 2025 projection', field: 'nov25' },
        { label: 'Box/Day', tooltip: 'Boxes per day', field: 'boxReqDay' },
        { label: 'Boxes Req', tooltip: 'Total boxes required', field: 'boxesRequired' },
        { label: 'Shortage', tooltip: 'Monthly shortage', field: 'shortageMonth' },
        { label: 'Short', tooltip: 'Shortage status', field: 'short' },
        { label: 'Adherence', tooltip: 'Adherence percentage', field: 'adherence' },
        { label: 'Allot', tooltip: 'Allot', field: 'allot' },
    ], []);

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
            <KitDetailsPopup
                open={kitPopupOpen}
                onClose={() => setKitPopupOpen(false)}
                onSelect={handleKitSelect}
                kitList={kitList}
            />
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
                            <Grid container spacing={2} alignItems="center">
                                {/* Customer */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Customer</InputLabel>
                                        <Select
                                            value={customer}
                                            label="Customer"
                                            onChange={(e) => setCustomer(e.target.value)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {customerList.map((item) => (
                                                <MenuItem key={item.id} value={item.name}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <span>{item.name}</span>
                                                        <Chip label={item.tier} size="small" color="primary" variant="outlined" />
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Mode */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small">
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
                                        >
                                            {modeList.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <span>{item.icon}</span>
                                                        <span>{item.value}</span>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Date */}
                                <Grid item xs={12} sm={6} md={3}>
                                    {mode === "Daily" && (
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            popperPlacement="bottom-start"
                                            popperProps={{ strategy: "fixed" }}
                                            portalId="root-portal"
                                            customInput={<TextField size="small" fullWidth label="Select Date" />}
                                        />
                                    )}

                                    {(mode === "Weekly" || mode === "Monthly") && (
                                        <DateRangePicker
                                            startDate={dateRange[0]}
                                            endDate={dateRange[1]}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            popperPlacement="bottom-start"
                                            popperProps={{ strategy: "fixed" }}
                                            portalId="root-portal"
                                        />
                                    )}
                                </Grid>

                                {/* Buttons */}
                                <Grid item xs={12} sm={6} md={4}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                                        <Button
                                            variant="contained"
                                            onClick={handleAllotment}
                                            disabled={!customer || !mode || loading}
                                            startIcon={<AutoAwesomeIcon />}
                                            sx={{ borderRadius: 2, px: 3 }}
                                        >
                                            Generate
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={handleClear}
                                            startIcon={<RefreshIcon />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Clear
                                        </Button>

                                        {/* <IconButton onClick={handleExport}>
                                            <DownloadIcon />
                                        </IconButton> */}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Allotment Details Header */}
                        <Box sx={{ px: 3, pb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Allotment Details
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {customerList.find((c) => c.id === customer)?.name || 'Customer'} •{' '}
                                        {getSelectedModeDetails()?.icon} {mode || 'Mode'}
                                        {mode === 'Daily' && selectedDate && ` • ${selectedDate.toLocaleDateString()}`}
                                        {mode === 'Weekly' && dateRange[0] && dateRange[1] &&
                                            ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                        {mode === 'Monthly' && dateRange[0] && dateRange[1] &&
                                            ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                    </Typography>
                                </Box>

                                {/* FillGrid Icon Button */}
                                <Tooltip title="Fill Grid with Kit Details" arrow>
                                    <IconButton
                                        onClick={() => setKitPopupOpen(true)}
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                            }
                                        }}
                                    >
                                        <GridOnIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        {/* Table Section */}
                        <Box sx={{ px: 3, pb: 3 }}>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {tableHeaders.map((header) => (
                                                <StyledTableCell
                                                    key={header.label}
                                                    sx={header.width ? { minWidth: header.width } : {}}
                                                >
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
                                                    {/* S.No Column */}
                                                    <TableCell sx={{ py: 1, px: 1, fontWeight: 500, textAlign: 'center' }}>
                                                        {index + 1}
                                                    </TableCell>

                                                    {/* Other Columns (Read Only) */}
                                                    {tableHeaders.slice(1).map((header) => (
                                                        <TableCell
                                                            key={header.field}
                                                            sx={{ py: 1, px: 1, textAlign: "center" }}
                                                        >
                                                            {row[header.field] || "-"}
                                                        </TableCell>
                                                    ))}

                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={1} justifyContent="center">

                                                            {/* EDIT */}
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditAllotment(row)}
                                                                sx={{ color: theme.palette.primary.main }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>

                                                        </Stack>
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
                            </TableContainer>
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
                                    {customerList.find((c) => c.id === customer)?.name || 'Customer'} •{' '}
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
                                    {popupRows.length > 0 ? (
                                        popupRows.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <TableCell sx={{ py: 1, px: 1, fontWeight: 500, textAlign: 'center' }}>
                                                    {index + 1}
                                                </TableCell>

                                                {tableHeaders.slice(1).map((header) => (
                                                    <TableCell key={header.field} sx={{ py: 1, px: 1 }}>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={popupRows[index][header.field] || ''}
                                                            onChange={(e) =>
                                                                handlePopupChange(index, header.field, e.target.value)
                                                            }
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
                                                                onClick={() => handlePopupRemoveRow(index)}
                                                                disabled={popupRows.length === 1}
                                                                size="small"
                                                                sx={{
                                                                    color: theme.palette.error.main,
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1)
                                                                    }
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
                                                <Typography color="text.secondary">
                                                    No matching records found
                                                </Typography>
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
                                onClick={handlePopupAddRow}
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