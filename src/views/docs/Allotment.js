import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import GridOnIcon from '@mui/icons-material/GridOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Alert,
    alpha,
    Autocomplete,
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
    Zoom,
    TablePagination
} from '@mui/material';
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
    maxHeight: 500,
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
    const [view, setView] = useState('form'); // 'list' or 'form'
    const [supplier, setSupplier] = useState('');
    const [customer, setCustomer] = useState('');
    const [mode, setMode] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [kitList, setKitList] = useState([]);
    const [oemList, setOemList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [branch, setBranch] = useState(localStorage.getItem('branch'));
    const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
    const [rows, setRows] = useState([{ ...emptyRow }]);
    const [editId, setEditId] = useState(null);
    const [kitPopupOpen, setKitPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [allAllotments, setAllAllotments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const modeList = [
        { value: 'Daily', icon: '📅', color: '#2196f3' },
        { value: 'Weekly', icon: '📆', color: '#9c27b0' },
        { value: 'Monthly', icon: '📊', color: '#4caf50' }
    ];

    useEffect(() => {
        getAllKitDetails();
        getCustomerDetails();
        fetchAllAllotments();
        getOemDetails();
    }, []);

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    const fetchAllAllotments = async () => {
        try {
            const result = await apiCalls(
                "get",
                `/allotment/getAllAllotmentByOrgId?orgId=${orgId}`
            );
            setAllAllotments(result?.paramObjectsMap?.allotment || []);
        } catch (err) {
            console.log(err);
        }
    };

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
        }

        return columns;
    }, [mode, selectedDate, dateRange]);

    const getEmptyRowWithDynamicFields = () => {
        const baseRow = { ...emptyRow };
        dynamicColumns.forEach(col => {
            baseRow[col.field] = '';
        });
        return baseRow;
    };

    useEffect(() => {
        if (view === 'form') {
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
        }
    }, [dynamicColumns, view]);

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

    const handleKitSelect = (kits) => {
        const newRows = kits.map(k => ({
            ...getEmptyRowWithDynamicFields(),
            kitNo: k.kitNo,
            kitDesc: k.kitDesc
        }));

        setRows(prevRows => {
            if (prevRows.length === 1 && Object.values(prevRows[0]).every(val => !val)) {
                return newRows;
            }
            return [...prevRows, ...newRows];
        });

        showSnackbar(`${kits.length} Kit(s) loaded`, 'success');
    };

    const handleClear = () => {
        setSupplier('');
        setCustomer('');
        setMode('');
        setSelectedDate(null);
        setDateRange([null, null]);
        setRows([getEmptyRowWithDynamicFields()]);
        setEditId(null);
        setIsEditing(false);
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

    const getCustomerDetails = async () => {
        try {
            const result = await apiCalls(
                "get",
                `/allotment/getCustomer?orgId=${orgId}`
            );
            setCustomerList(result?.paramObjectsMap?.customer || []);
        } catch (err) {
            console.log(err);
        }
    };

    const getOemDetails = async () => {
        try {
            const result = await apiCalls(
                "get",
                `/allotment/getOemDetails?orgId=${orgId}`
            );

            const oem =
                result?.paramObjectsMap?.listOfValuesVO?.[0]?.listOfValues1VO || [];

            setOemList(oem);

        } catch (err) {
            console.log(err);
        }
    };

    const handleEditFromList = (allotment) => {
        setIsEditing(true);
        setEditId(allotment.id);
        setCustomer(allotment.customer);
        setSupplier(allotment.supplier);
        setMode(allotment.mode);

        if (allotment.startDate) {
            setSelectedDate(new Date(allotment.startDate));
            setDateRange([
                new Date(allotment.startDate),
                new Date(allotment.endDate || allotment.startDate)
            ]);
        }

        const details = allotment.allotmentDetailsVO || [];
        setRows(
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

        setView('form');
    };

    const handleSave = async () => {
        if (!rows.length) {
            showSnackbar("No allotment data", "warning");
            return;
        }

        if (!customer || !mode) {
            showSnackbar("Please select customer and mode", "warning");
            return;
        }

        if (mode === 'Daily' && !selectedDate) {
            showSnackbar('Please select a date', 'error');
            return;
        }

        if ((mode === 'Weekly' || mode === 'Monthly') && (!dateRange[0] || !dateRange[1])) {
            showSnackbar('Please select a date range', 'error');
            return;
        }

        const allotmentDetailsDTO = rows.map(row => ({
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
            day: mode === "Daily" && selectedDate ? selectedDate.getDate() : 0,
            month: (mode === "Daily" && selectedDate) || (mode !== "Daily" && dateRange[0])
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
            startDate: mode === "Daily"
                ? selectedDate?.toISOString().split("T")[0]
                : dateRange[0]?.toISOString().split("T")[0],
            endDate: mode === "Daily"
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
                showSnackbar("Allotment saved successfully", "success");

                // Clear the form and switch to list view
                handleClear();
                await fetchAllAllotments();
                setView('list');
                setIsEditing(false);
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
        { label: 'Available', tooltip: 'Available', field: 'allot' },
    ], []);

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

    const filteredAllotments = useMemo(() => {
        return allAllotments.filter(a =>
            !searchTerm ||
            a.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.mode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allAllotments, searchTerm]);

    const paginatedAllotments = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredAllotments.slice(start, start + rowsPerPage);
    }, [filteredAllotments, page, rowsPerPage]);

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
                                            {view === 'list' ? 'View all allotments' : 'Create/Edit allotment'}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1}>

                                    {view === "form" && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<ViewListIcon />}
                                            onClick={() => {
                                                handleClear();
                                                setView("list");
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                fontWeight: 600
                                            }}
                                        >
                                            List View
                                        </Button>
                                    )}

                                    {view === "list" && (
                                        <Button
                                            variant="contained"
                                            startIcon={<AddCircleIcon />}
                                            onClick={() => setView("form")}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                fontWeight: 600
                                            }}
                                        >
                                            Add New
                                        </Button>
                                    )}

                                </Stack>
                            </Stack>
                        </Box>

                        <Divider sx={{ mx: 3 }} />

                        {view === 'form' ? (
                            // Form View
                            <>
                                {/* Main Controls */}
                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6} md={2}>
                                            <Autocomplete
                                                size="small"
                                                options={customerList}
                                                getOptionLabel={(option) => option.customer || ""}
                                                value={customerList.find(c => c.customer === customer) || null}
                                                onChange={(event, newValue) => {
                                                    if (isEditing && !newValue) return;
                                                    setCustomer(newValue?.customer || "");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Customer"
                                                        placeholder="Search customer"
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box {...props} key={option.customerCode}>
                                                        <Typography variant="body2">{option.customer}</Typography>
                                                    </Box>
                                                )}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={2}>
                                            <Autocomplete
                                                size="small"
                                                options={oemList}
                                                getOptionLabel={(option) => option.valueDescription || ""}
                                                value={
                                                    oemList.find(o => o.valueDescription === supplier) || null
                                                }
                                                onChange={(event, newValue) => {
                                                    setSupplier(newValue?.valueDescription || "");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="OEM"
                                                        placeholder="Search OEM"
                                                    />
                                                )}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                            />
                                        </Grid>

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

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleClear}
                                                    startIcon={<RefreshIcon />}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Clear
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSave}
                                                    startIcon={<SaveIcon />}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {editId ? 'Update' : 'Save'}
                                                </Button>
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
                                                {customer || 'No customer selected'} •{' '}
                                                {getSelectedModeDetails()?.icon} {mode || 'No mode'}
                                                {mode === 'Daily' && selectedDate && ` • ${selectedDate.toLocaleDateString()}`}
                                                {mode === 'Weekly' && dateRange[0] && dateRange[1] &&
                                                    ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                                {mode === 'Monthly' && dateRange[0] && dateRange[1] &&
                                                    ` • ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Fill Grid with Kit Details" arrow>
                                                <IconButton
                                                    onClick={() => setKitPopupOpen(true)}
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                                    }}
                                                >
                                                    <GridOnIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Add New Row" arrow>
                                                <IconButton
                                                    onClick={handleAddRow}
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                        color: theme.palette.success.main,
                                                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                                    }}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Form Table Section */}
                                <Box sx={{ px: 3, pb: 3 }}>
                                    <StyledTableContainer>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {tableHeaders.map((header) => (
                                                        <StyledTableCell key={header.label} sx={header.width ? { minWidth: header.width } : {}}>
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
                                                {rows.length > 0 ? (
                                                    rows.map((row, index) => (
                                                        <StyledTableRow key={index}>
                                                            <TableCell sx={{ py: 1, px: 1, fontWeight: 500, textAlign: 'center' }}>
                                                                {index + 1}
                                                            </TableCell>

                                                            {tableHeaders.slice(1).map((header) => (
                                                                <TableCell key={header.field} sx={{ py: 1, px: 1 }}>
                                                                    <TextField
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={row[header.field] || ''}
                                                                        onChange={(e) => handleChange(index, header.field, e.target.value)}
                                                                        placeholder={header.label}
                                                                        fullWidth
                                                                        type={header.field === 'kitNo' || header.field === 'kitDesc' ? 'text' : 'text'}
                                                                        InputProps={{
                                                                            sx: {
                                                                                height: 36,
                                                                                width: 100,
                                                                                fontSize: '0.85rem',
                                                                                borderRadius: 2,
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                            ))}

                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleRemoveRow(index)}
                                                                    disabled={rows.length === 1}
                                                                    sx={{
                                                                        color: theme.palette.error.main,
                                                                        '&:disabled': { color: theme.palette.action.disabled }
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </StyledTableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={tableHeaders.length + 1} align="center" sx={{ py: 3 }}>
                                                            <Typography color="text.secondary">No records found</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </StyledTableContainer>
                                </Box>
                            </>
                        ) : (
                            // List View
                            <Box sx={{ p: 3 }}>
                                {/* Search + Title Bar */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={2}
                                >
                                    <Typography variant="h6" fontWeight={700}>
                                        All Allotments
                                    </Typography>

                                    <TextField
                                        size="small"
                                        placeholder="Search customer / supplier / mode..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{
                                            width: 260,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3
                                            }
                                        }}
                                    />
                                </Stack>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                        overflow: "hidden"
                                    }}
                                >
                                    <StyledTableContainer>
                                        <Table stickyHeader size="small">

                                            <TableHead>
                                                <TableRow>
                                                    {[
                                                        "S.No",
                                                        "Customer",
                                                        "Supplier",
                                                        "Mode",
                                                        "Start",
                                                        "End",
                                                        "Items",
                                                        "Action"
                                                    ].map(h => (
                                                        <StyledTableCell key={h}>{h}</StyledTableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {paginatedAllotments.map((a, i) => (
                                                    <StyledTableRow key={a.id} hover>

                                                        <TableCell align="center">{page * rowsPerPage + i + 1}</TableCell>

                                                        <TableCell>
                                                            <Typography fontWeight={600} fontSize="0.85rem">
                                                                {a.customer}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell>{a.supplier}</TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={a.mode}
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor:
                                                                        a.mode === "Daily"
                                                                            ? alpha(theme.palette.info.main, .15)
                                                                            : a.mode === "Weekly"
                                                                                ? alpha(theme.palette.secondary.main, .15)
                                                                                : alpha(theme.palette.success.main, .15),
                                                                    color:
                                                                        a.mode === "Daily"
                                                                            ? theme.palette.info.main
                                                                            : a.mode === "Weekly"
                                                                                ? theme.palette.secondary.main
                                                                                : theme.palette.success.main
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            {new Date(a.startDate).toLocaleDateString()}
                                                        </TableCell>

                                                        <TableCell>
                                                            {new Date(a.endDate).toLocaleDateString()}
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip
                                                                size="small"
                                                                label={a.allotmentDetailsVO?.length || 0}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, .15),
                                                                    color: theme.palette.primary.main,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditFromList(a)}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, .12),
                                                                    "&:hover": {
                                                                        bgcolor: alpha(theme.palette.primary.main, .25)
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>

                                                    </StyledTableRow>
                                                ))}

                                                {!allAllotments.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                                            <Typography color="text.secondary">
                                                                No allotments found
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </StyledTableContainer>
                                </Paper>
                            </Box>
                        )}
                    </StyledPaper>
                </Fade>

                <TablePagination
                    component="div"
                    count={filteredAllotments.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
                    }}
                />

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
                        sx={{ width: '100%', borderRadius: 2, boxShadow: theme.shadows[8] }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default Allotment;