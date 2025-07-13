import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { FormControl, FormHelperText, InputLabel, MenuItem, Autocomplete, Select, Button, Chip, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ConfirmationModal from 'utils/confirmationPopup';
import FancyLoader from 'utils/FancyLoader';
import { motion, AnimatePresence } from 'framer-motion';

// Add these animation variants
const buttonVariants = {
    hover: {
        scale: 1.05,
        boxShadow: "0px 0px 8px rgba(76, 175, 80, 0.6)",
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 },
    approved: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        boxShadow: "0px 0px 15px rgba(76, 175, 80, 0.8)",
        transition: { duration: 0.3 }
    },
    rejected: {
        backgroundColor: "#F44336",
        color: "#fff",
        boxShadow: "0px 0px 15px rgba(244, 67, 54, 0.8)",
        transition: { duration: 0.3 }
    }
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
    }
};

const CostEstimate = () => {
    const [showForm, setShowForm] = useState(true);
    const [data, setData] = useState(true);
    const [branch, setBranch] = useState(localStorage.getItem('branch'));
    const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
    const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [role] = useState(() => {
        const roles = JSON.parse(localStorage.getItem('ROLES'));
        return roles?.[0]?.role || null;
    });
    const [value, setValue] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [approveStatus, setApproveStatus] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [listViewData, setListViewData] = useState([]);
    const [editId, setEditId] = useState('');
    // const [departmentList, setDepartmentList] = useState([]);
    const [empCodeList, setEmpCode] = useState([]);
    const [docId, setDocId] = useState([]);
    const [formData, setFormData] = useState({
        docDate: dayjs(),
        id: '',
        // department: '',
        empCode: loginUserName,
        empName: '',
        totalAmt: '',
        status: 'DRAFT',
        approvedBy: '',
        approvedOn: '',
        // approveStatus: '',
        fromDate: dayjs(),
        toDate: dayjs(),
    });

    const [fieldErrors, setFieldErrors] = useState({
        // department: '',
        empCode: '',
        empName: '',
        status: '',
        totalAmt: '',
        approvedBy: '',
        approvedOn: '',
        // approveStatus: '',
        fromDate: '',
        toDate: '',
    });

    const listViewColumns = [
        { accessorKey: 'docId', header: 'Doc No', size: 140 },
        { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
        { accessorKey: 'employeeCode', header: 'Requested By', size: 140 },
        {
            accessorKey: 'totalAmount',
            header: 'Tot Amt',
            size: 80,
            Cell: ({ cell }) => (
                <div style={{ textAlign: 'right', width: '100%' }}>
                    {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
                </div>
            ),
            muiTableHeadCellProps: {
                align: 'right'
            }
        },
        { accessorKey: 'status', header: 'Status', size: 140 },
        { accessorKey: 'approveStatus', header: 'Approve Status', size: 140 },
    ];

    const [detailsTableData, setDetailsTableData] = useState([
        {
            id: 1,
            category: '',
            particulars: '',
            amount: '',
            remarks: '',
        }
    ]);
    const [detailsTableErrors, setDetailsTableErrors] = useState([
        {
            category: '',
            particulars: '',
            amount: '',
            remarks: '',
        }
    ]);
    const getEmpCode = async () => {
        try {
            const response = await apiCalls('get', `/costEstimation/getAllEmployees?orgId=${orgId}`);
            if (response.status === true) {
                setEmpCode(response.paramObjectsMap.EmployeeVO || []);
            } else {
                console.error('API Error:', response);
                return response;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return error;
        }
    };
    // const getAllDepartment = async () => {
    //     try {
    //         const response = await apiCalls('get', `master/getDepartmentNameForEmployee?orgId=${orgId}`);
    //         console.log('API Response:', response);

    //         if (response.status === true) {
    //             setDepartmentList(response.paramObjectsMap.departmentName);
    //             console.log('fin', response.paramObjectsMap.departmentName);
    //         } else {
    //             console.error('API Error:', response);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };
    useEffect(() => {
        // getAllDepartment();
        getEmpCode();
        getAllCostEstimateByOrgId();
        getCostEstimateDocId();
    }, []);
    const categoryOptions = [
        { category: 'Wages' },
        { category: 'Cleaning' },
        { category: 'Repair & Maintanance' },
        { category: 'Asset Purchase' },
        { category: 'Transport' },
        { category: 'Material Purchase' },
        { category: 'Admin' },
        { category: 'Insurance' },
        { category: 'Professional Services' },
        { category: 'Marketing & Advertising' },
        { category: 'Miscellaneous' }
    ];

    useEffect(() => {
        const totalAmount = detailsTableData.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        setFormData((prev) => ({
            ...prev,
            totalAmt: totalAmount,
        }));
    }, [detailsTableData]);

    const getAllCostEstimateByOrgId = async () => {
        setLoading(true);
        try {
            const result = await apiCalls('get', `/costEstimation/getAllCostEstimationByOrgId?orgId=${orgId}`);
            setData(result.paramObjectsMap.costEstimationVO.reverse() || []);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log('error', err);
        }
    };
    const getCostEstimateDocId = async () => {
        try {
            const response = await apiCalls(
                'get',
                `/costEstimation/getCostEstimationDocId?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
            );
            setDocId(response.paramObjectsMap.costEstimationDocId);
        } catch (error) {
            console.error('Error fetching gate passes:', error);
        }
    };
    const getCostEstimateById = async (row) => {
        setShowForm(true);
        setLoading(true);
        try {
            const result = await apiCalls('get', `/costEstimation/getAllCostEstimationById?id=${row.original.id}`);

            if (result) {
                const costEstimateVO = result.paramObjectsMap.costEstimationVO;
                setListViewData(result.paramObjectsMap.costEstimationVO);
                setEditId(row.original.id);
                setDocId(costEstimateVO.docId);
                setApproveStatus(costEstimateVO.approveStatus || '');
                // getEmpCode(costEstimateVO.department);
                setFormData({
                    id: costEstimateVO.id || '',
                    docDate: costEstimateVO.docDate ? dayjs(costEstimateVO.docDate, 'YYYY-MM-DD') : dayjs(),
                    empName: costEstimateVO.employeeName || '',
                    empCode: costEstimateVO.employeeCode || '',
                    // department: costEstimateVO.department || '',
                    totalAmt: costEstimateVO.totalAmount || '',
                    status: costEstimateVO.status || '',
                    fromDate: costEstimateVO.fromDate ? dayjs(costEstimateVO.fromDate, 'YYYY-MM-DD') : null,
                    toDate: costEstimateVO.toDate ? dayjs(costEstimateVO.toDate, 'YYYY-MM-DD') : null,
                    approvedBy: costEstimateVO.approveBy || '',
                    approvedOn: costEstimateVO.approveOn || '',
                });
                setDetailsTableData(
                    costEstimateVO.costEstimationDetailsVO.map((row) => ({
                        id: row.id,
                        category: row.category,
                        particulars: row.particulars,
                        remarks: row.remarks,
                        amount: row.amount
                    }))
                );
                setLoading(false);
            } else {
                setLoading(false);
                // Handle erro
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, selectionStart, selectionEnd, type } = e.target;

        let errorMessage = '';

        if (errorMessage) {
            setFieldErrors({ ...fieldErrors, [name]: errorMessage });
        } else {
            setFormData({ ...formData, [name]: value.toUpperCase() });
            setFieldErrors({ ...fieldErrors, [name]: '' });
            // if (name === 'department' && value) {
            //     getEmpCode(value);
            // }
            // Preserve the cursor position for text-based inputs
            if (type === 'text' || type === 'textarea') {
                setTimeout(() => {
                    const inputElement = document.getElementsByName(name)[0];
                    if (inputElement && inputElement.setSelectionRange) {
                        inputElement.setSelectionRange(selectionStart, selectionEnd);
                    }
                }, 0);
            }
        }
    };
    const handleDateChange = (field, date) => {
        const formattedDate = dayjs(date);
        console.log('formattedDate', formattedDate);
        setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
    };
    const handleClear = () => {
        setFormData({
            docDate: dayjs(),
            // department: '',
            empCode: loginUserName,
            empName: '',
            status: 'DRAFT',
            totalAmt: '',
            approvedBy: '',
            approvedOn: '',
            fromDate: dayjs(),
            toDate: dayjs(),
        });
        setFieldErrors({});
        setDetailsTableData([{
            id: 1,
            category: '',
            particulars: '',
            amount: '',
            remarks: '',
        }]);
        setDetailsTableErrors([
            {
                category: '',
                particulars: '',
                amount: '',
                remarks: '',
            }
        ]);
        setEditId('');
        getCostEstimateDocId();
    };
    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            category: '',
            particulars: '',
            amount: '',
            remarks: '',
        };
        setDetailsTableData([...detailsTableData, newRow]);
        setDetailsTableErrors([...detailsTableErrors, {
            category: '',
            particulars: '',
            amount: '',
            remarks: '',
        }]);
    };

    const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
        const rowIndex = table.findIndex((row) => row.id === id);
        if (rowIndex !== -1) {
            const updatedData = table.filter((row) => row.id !== id);
            const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
            setTable(updatedData);
            setErrorTable(updatedErrors);
        }
    };

    const handleView = () => {
        setShowForm(!showForm);
        handleClear();
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSave = async () => {
        setLoading(true);
        const errors = {};
        if (!formData.empCode) {
            errors.empCode = 'Requested By is required';
        }

        let detailTableDataValid = true;
        const newTableErrors = detailsTableData.map((row) => {
            const rowErrors = {};
            return rowErrors;
        });
        setFieldErrors(errors);

        setDetailsTableErrors(newTableErrors);

        if (Object.keys(errors).length === 0 && detailTableDataValid) {
            const costEstimateVO = detailsTableData.map((row) => ({
                ...(editId && { id: row.id }),
                amount: parseFloat(row.amount),
                category: row.category,
                particulars: row.particulars,
                remarks: row.remarks
            }));
            const saveFormData = {
                ...(editId && { id: editId }),
                branch: branch,
                branchCode: branchCode,
                finYear: finYear,
                orgId: orgId,
                createdBy: loginUserName,
                // department: formData.department,
                employeeCode: formData.empCode,
                employeeName: formData.empName,
                status: formData.status,
                fromDate: formData.fromDate?.format('YYYY-MM-DD'),
                toDate: formData.toDate?.format('YYYY-MM-DD'),
                active: true,
                costEstimationDetailsDTO: costEstimateVO,
            };
            console.log('DATA TO SAVE IS:', saveFormData);
            try {
                const response = await apiCalls('put', `/costEstimation/updateCreateCostEstimation`, saveFormData);
                if (response.status === true) {
                    console.log('Response:', response);
                    showToast('success', editId ? 'Cost Estimate Updated Successfully' : 'Cost Estimate Created successfully');
                    getAllCostEstimateByOrgId();
                    handleClear();
                    setLoading(false);
                } else {
                    showToast('error', response.paramObjectsMap.errorMessage || 'Cost Estimate creation failed');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
                showToast('error', 'Cost Estimate creation failed');
            }
        } else {
            setFieldErrors(errors);
            setLoading(false);
        }
    };
    const handleOpenModalApprove = () => {
        setModalOpen(true);
        setApproveStatus('Approved');
    };
    const handleOpenModalReject = () => {
        setModalOpen(true);
        setApproveStatus('Rejected');
    };

    const handleCloseModal = () => setModalOpen(false);
    const handleConfirmAction = async () => {
        setLoading(true);
        try {
            const result = await apiCalls(
                'put',
                `/costEstimation/approveCostEstimation?orgId=${orgId}&action=${approveStatus}&actionBy=${loginUserName}&docId=${docId}&id=${formData.id}`
            );
            if (result.status === true) {
                setLoading(false);
                setApproveStatus(result.paramObjectsMap.costEstimationVO.approveStatus);
                showToast(
                    result.paramObjectsMap.costEstimationVO.approveStatus === 'Approved' ? 'success' : 'error',
                    result.paramObjectsMap.costEstimationVO.approveStatus === 'Approved'
                        ? 'Cost Estimate Approved successfully'
                        : 'Cost Estimate Rejected successfully'
                );
                const listValueVO = result.paramObjectsMap.costEstimationVO;
                setIsAnimating(true);
                setDocId(listValueVO.docId);
                setFormData({
                    id: listValueVO.id || '',
                    docDate: listValueVO.docDate ? dayjs(listValueVO.docDate, 'YYYY-MM-DD') : dayjs(),
                    empName: listValueVO.employeeName || '',
                    empCode: listValueVO.employeeCode || '',
                    // department: listValueVO.department || '',
                    totalAmt: listValueVO.totalAmount || '',
                    status: listValueVO.status || '',
                    fromDate: listValueVO.fromDate ? dayjs(listValueVO.fromDate, 'YYYY-MM-DD') : null,
                    toDate: listValueVO.toDate ? dayjs(listValueVO.toDate, 'YYYY-MM-DD') : null,
                    approvedBy: listValueVO.approveBy || '',
                    approvedOn: listValueVO.approveOn || '',
                });
                setDetailsTableData(
                    listValueVO.costEstimationDetailsVO.map((row) => ({
                        id: row.id,
                        category: row.category,
                        particulars: row.particulars,
                        remarks: row.remarks,
                        amount: row.amount
                    }))
                );
                handleCloseModal();
                setTimeout(() => setIsAnimating(false), 1000);
                getAllCostEstimateByOrgId();
            } else {
                console.error('API Error:', result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <>
            {loading && (
                <div style={{ position: 'fixed', top: '45%', left: '45%', zIndex: 9999 }}>
                    <FancyLoader />
                </div>
            )}
            <ToastComponent />
            <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
                <div className="row">
                    <div className="d-flex justify-content-between align-items-center mb-4" style={{ width: '100%' }}>
                        <div className="d-flex align-items-center">
                            {editId && showForm && (formData.status.toUpperCase() === 'SUBMIT' || listViewData.status.toUpperCase() === 'SUBMIT') && (
                                <>
                                    {approveStatus === 'Approved' && (
                                        <Stack direction="row" spacing={2}>
                                            <Chip label={`Approved By: ${formData.approvedBy}`} variant="outlined" color="success" />
                                            <Chip label={`Approved On: ${formData.approvedOn}`} variant="outlined" color="success" />
                                        </Stack>
                                    )}
                                    {approveStatus === 'Rejected' && (
                                        <Stack direction="row" spacing={2}>
                                            <Chip label={`Rejected By: ${formData.approvedBy}`} variant="outlined" color="error" />
                                            <Chip label={`Rejected On: ${formData.approvedOn}`} variant="outlined" color="error" />
                                        </Stack>
                                    )}
                                    {listViewData.status === 'SUBMIT' &&
                                        approveStatus !== 'Approved' &&
                                        approveStatus !== 'Rejected' &&
                                        (role === 'FINANCE MANAGER' || role === 'ADMIN') && (
                                            <div className="d-flex" style={{ gap: '10px' }}>
                                                <motion.div
                                                    variants={buttonVariants}
                                                    animate={isAnimating && approveStatus === 'Approved' ? "approved" : ""}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<CheckCircleIcon />}
                                                        size="small"
                                                        style={{
                                                            borderColor: '#4CAF50',
                                                            color: '#4CAF50',
                                                            fontWeight: 'bold',
                                                            textTransform: 'none',
                                                            padding: '2px 8px',
                                                            fontSize: '0.8rem'
                                                        }}
                                                        onClick={handleOpenModalApprove}
                                                    >
                                                        Approve
                                                    </Button>
                                                </motion.div>

                                                <motion.div
                                                    variants={buttonVariants}
                                                    animate={isAnimating && approveStatus === 'Rejected' ? "rejected" : ""}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<CancelIcon />}
                                                        size="small"
                                                        style={{
                                                            borderColor: '#F44336',
                                                            color: '#F44336',
                                                            fontWeight: 'bold',
                                                            textTransform: 'none',
                                                            padding: '2px 8px',
                                                            fontSize: '0.8rem'
                                                        }}
                                                        onClick={handleOpenModalReject}
                                                    >
                                                        Reject
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                        <div className="d-flex">
                            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
                            {showForm && (
                                <>
                                    <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                                    <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
                                </>
                            )}
                        </div>
                    </div>
                    {showForm ? (
                        <>
                            <div className="row d-flex ml">
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        id="docId"
                                        label="Doc No"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="docId"
                                        value={docId}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <FormControl fullWidth variant="filled" size="small">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Doc Date"
                                                value={formData.docDate}
                                                onChange={(date) => handleDateChange('docDate', date)}
                                                disabled
                                                slotProps={{
                                                    textField: { size: 'small', clearable: true }
                                                }}
                                                format="DD-MM-YYYY"
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </div>
                                {/* <div className="col-md-3 mb-3">
                                    <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.department}>
                                        <InputLabel id="department-label">Department</InputLabel>
                                        <Select
                                            labelId="department-label"
                                            id="department"
                                            label="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            name="department"
                                        // disabled={isEditMode}
                                        >
                                            {departmentList?.map((row) => (
                                                <MenuItem key={row.id} value={row.departmentName}>
                                                    {row.departmentName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {fieldErrors.department && <FormHelperText>{fieldErrors.department}</FormHelperText>}
                                    </FormControl>
                                </div> */}
                                <div className="col-md-3 mb-3">
                                    <Autocomplete
                                        options={empCodeList}
                                        getOptionLabel={(option) =>
                                            option?.employeeCode && option?.employeeName
                                                ? `${option.employeeCode} - ${option.employeeName}`
                                                : ''
                                        }
                                        disabled={formData.status === 'SUBMIT'}
                                        value={
                                            empCodeList.find((item) => item.employeeCode === formData.empCode) || null
                                        }
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    empCode: newValue.employeeCode,
                                                    empName: newValue.employeeName,
                                                }));
                                                setFieldErrors((prev) => ({ ...prev, empCode: '', empName: '' }));
                                            } else {
                                                setFormData((prev) => ({ ...prev, empCode: '', empName: '' }));
                                                setFieldErrors((prev) => ({ ...prev, empCode: 'Requested By is required' }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={
                                                    <span>
                                                        Requested By <span className="asterisk">*</span>
                                                    </span>
                                                }
                                                disabled={formData.status === 'SUBMIT'}
                                                size="small"
                                                error={!!fieldErrors.empCode}
                                                helperText={fieldErrors.empCode}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </div>
                                {/* <div className="col-md-3 mb-3">
                                    <TextField
                                        id="empName"
                                        label={
                                            <span>
                                                Name <span className="asterisk">*</span>
                                            </span>
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="empName"
                                        disabled
                                        value={formData.empName}
                                        onChange={handleSelectDepart}
                                        helperText={<span style={{ color: 'red' }}>{fieldErrors.empName ? 'Emp Name is required' : ''}</span>}
                                    />
                                </div> */}
                                <div className="col-md-3 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Period From"
                                            value={formData.fromDate}
                                            maxDate={formData.toDate}
                                            disabled={formData.status === 'SUBMIT'}
                                            onChange={(date) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    fromDate: date,
                                                    // if fromDate > toDate, reset toDate
                                                    toDate: prev.toDate && dayjs(date).isAfter(prev.toDate) ? date : prev.toDate
                                                }));
                                            }}
                                            format="DD-MM-YYYY"
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Period To"
                                            value={formData.toDate}
                                            disabled={formData.status === 'SUBMIT'}
                                            minDate={formData.fromDate}
                                            onChange={(date) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    toDate: date,
                                                }));
                                            }}
                                            format="DD-MM-YYYY"
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </div>
                                {/* <div className="col-md-6 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateRangePicker
                                            value={[formData.fromDate, formData.toDate]}
                                            onChange={(newValue) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    fromDate: newValue[0],
                                                    toDate: newValue[1],
                                                }));
                                            }}
                                            localeText={{ start: 'From Date', end: 'To Date' }}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div> */}
                                <div className="col-md-3 mb-3">
                                    <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            label="Status"
                                            value={formData.status}
                                            disabled={formData.status === 'SUBMIT'}
                                            onChange={handleInputChange}
                                            name="status"
                                        >
                                            <MenuItem value="DRAFT">DRAFT</MenuItem>
                                            {(editId || (role === 'FINANCE MANAGER' || role === 'ADMIN')) && <MenuItem value="SUBMIT">SUBMIT</MenuItem>}
                                        </Select>
                                        {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                                    </FormControl>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <TextField
                                        id="totalAmt"
                                        label="Total Amt"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="totalAmt"
                                        disabled
                                        value={formData.totalAmt}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <Box sx={{ width: '100%' }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        textColor="secondary"
                                        indicatorColor="secondary"
                                        aria-label="secondary tabs example"
                                    >
                                        <Tab value={0} label="Details" />
                                    </Tabs>
                                </Box>
                                <Box sx={{ padding: 2 }}>
                                    {value === 0 && (
                                        <>
                                            <div className="row d-flex ml">
                                                <div className="mb-1">
                                                    <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-lg-12">
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered ">
                                                                <thead>
                                                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                                                        <th className="table-header">Action</th>
                                                                        <th className="table-header">#</th>
                                                                        <th className="table-header">Category</th>
                                                                        <th className="table-header">Particulars</th>
                                                                        <th className="table-header">Estimated Amt</th>
                                                                        <th className="table-header">Remarks</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {detailsTableData.map((row, index) => (
                                                                        <tr key={row.id}>
                                                                            <td className="border px-2 py-2 text-center">
                                                                                <ActionButton
                                                                                    title="Delete"
                                                                                    icon={DeleteIcon}
                                                                                    onClick={() =>
                                                                                        handleDeleteRow(
                                                                                            row.id,
                                                                                            detailsTableData,
                                                                                            setDetailsTableData,
                                                                                            detailsTableErrors,
                                                                                            setDetailsTableErrors
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <div className="pt-2">{index + 1}</div>
                                                                            </td>
                                                                            <td className="border px-2 py-2" style={{ width: '20%' }}>
                                                                                <Autocomplete
                                                                                    options={categoryOptions}
                                                                                    getOptionLabel={(option) => option.category || ''}
                                                                                    value={
                                                                                        categoryOptions.find(
                                                                                            (option) => option.category === row.category
                                                                                        ) || null
                                                                                    }
                                                                                    disabled={formData.status === 'SUBMIT'}
                                                                                    onChange={(event, newValue) => {
                                                                                        const newCategory = newValue?.category || '';
                                                                                        const updatedData = [...detailsTableData];
                                                                                        updatedData[index].category = newCategory;
                                                                                        setDetailsTableData(updatedData);

                                                                                        const updatedErrors = [...detailsTableErrors];
                                                                                        updatedErrors[index].category = newCategory ? '' : 'Category is required';
                                                                                        setDetailsTableErrors(updatedErrors);
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            placeholder="Select Category"
                                                                                            size="small"
                                                                                            error={!!detailsTableErrors[index]?.category}
                                                                                            helperText={detailsTableErrors[index]?.category}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </td>
                                                                            <td className="border px-2 py-2" style={{ width: '30%' }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={row.particulars}
                                                                                    disabled={formData.status === 'SUBMIT'}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        const updatedData = [...detailsTableData];
                                                                                        updatedData[index].particulars = value;
                                                                                        setDetailsTableData(updatedData);

                                                                                        const updatedErrors = [...detailsTableErrors];
                                                                                        updatedErrors[index].particulars = value ? '' : 'Particulars is required';
                                                                                        setDetailsTableErrors(updatedErrors);
                                                                                    }}
                                                                                    className={`form-control ${detailsTableErrors[index]?.particulars ? 'error' : ''}`}
                                                                                />
                                                                                {detailsTableErrors[index]?.particulars && (
                                                                                    <div className="text-danger" style={{ fontSize: '12px' }}>
                                                                                        {detailsTableErrors[index].particulars}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border px-2 py-2" style={{ width: '20%' }}>
                                                                                <input
                                                                                    type="number"
                                                                                    value={row.amount}
                                                                                    disabled={formData.status === 'SUBMIT'}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        const updatedData = [...detailsTableData];
                                                                                        updatedData[index].amount = value;
                                                                                        setDetailsTableData(updatedData);
                                                                                        const updatedErrors = [...detailsTableErrors];
                                                                                        updatedErrors[index].amount = value ? '' : 'Amount is required';
                                                                                        setDetailsTableErrors(updatedErrors);
                                                                                    }}
                                                                                    className={`form-control ${detailsTableErrors[index]?.amount ? 'error' : ''}`}
                                                                                />
                                                                                {detailsTableErrors[index]?.amount && (
                                                                                    <div className="text-danger" style={{ fontSize: '12px' }}>
                                                                                        {detailsTableErrors[index].amount}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border px-2 py-2" style={{ width: '30%' }}>
                                                                                <input
                                                                                    type="text"
                                                                                    value={row.remarks}
                                                                                    disabled={formData.status === 'SUBMIT'}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        const updatedData = [...detailsTableData];
                                                                                        updatedData[index].remarks = value;
                                                                                        setDetailsTableData(updatedData);

                                                                                        const updatedErrors = [...detailsTableErrors];
                                                                                        updatedErrors[index].remarks = value ? '' : 'Remarks is required';
                                                                                        setDetailsTableErrors(updatedErrors);
                                                                                    }}
                                                                                    className={`form-control ${detailsTableErrors[index]?.remarks ? 'error' : ''}`}
                                                                                />
                                                                                {detailsTableErrors[index]?.remarks && (
                                                                                    <div className="text-danger" style={{ fontSize: '12px' }}>
                                                                                        {detailsTableErrors[index].remarks}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Box>
                            </div>
                        </>
                    ) : (
                        <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getCostEstimateById} />
                    )}
                </div >
            </div >
            {/* <ConfirmationModal
                open={modalOpen}
                title="Cost Estimate Approval"
                message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this Cost Estimate?`}
                onConfirm={handleConfirmAction}
                onCancel={handleCloseModal}
            /> */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1300
                        }}
                    >
                        <ConfirmationModal
                            open={modalOpen}
                            title="Cost Estimate Approval"
                            message={`Are you sure you want to ${approveStatus === 'Approved' ? 'approve' : 'reject'} this Cost Estimate?`}
                            onConfirm={handleConfirmAction}
                            onCancel={handleCloseModal}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};
export default CostEstimate;
