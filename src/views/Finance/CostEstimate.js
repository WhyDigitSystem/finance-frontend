import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { FormControl, FormHelperText, InputLabel, MenuItem, Autocomplete, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

const CostEstimate = () => {
    const [showForm, setShowForm] = useState(true);
    const [data, setData] = useState(true);
    const [branch, setBranch] = useState(localStorage.getItem('branch'));
    const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
    const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
    const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
    const [value, setValue] = useState(0);
    const [editId, setEditId] = useState('');
    const [departmentList, setDepartmentList] = useState([]);
    const [empCodeList, setEmpCode] = useState([]);
    const [docId, setDocId] = useState([]);
    const [formData, setFormData] = useState({
        docDate: dayjs(),
        department: '',
        empCode: '',
        empName: '',
        totalAmt: '',
        status: 'DRAFT',
        approvedBy: '',
        approvedOn: '',
        approveStatus: ''
    });

    const [fieldErrors, setFieldErrors] = useState({
        department: '',
        empCode: '',
        empName: '',
        status: '',
        totalAmt: '',
        approvedBy: '',
        approvedOn: '',
        approveStatus: ''
    });

    const listViewColumns = [
        { accessorKey: 'docId', header: 'Doc No', size: 140 },
        { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
        { accessorKey: 'status', header: 'Status', size: 140 },
        { accessorKey: 'employeeCode', header: 'Emp Code', size: 140 },
        { accessorKey: 'employeeName', header: 'Name', size: 140 },
        { accessorKey: 'totalAmount', header: 'Tot Amt', size: 140 },
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
    const getEmpCode = async (department) => {
        try {
            const response = await apiCalls('get', `/costEstimation/getAllEmployees?department=${department}&orgId=${orgId}`);
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
    const getAllDepartment = async () => {
        try {
            const response = await apiCalls('get', `master/getDepartmentNameForEmployee?orgId=${orgId}`);
            console.log('API Response:', response);

            if (response.status === true) {
                setDepartmentList(response.paramObjectsMap.departmentName);
                console.log('fin', response.paramObjectsMap.departmentName);
            } else {
                console.error('API Error:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        getAllDepartment();
        getAllCostEstimateByOrgId();
        getCostEstimateDocId();
    }, []);
    const handleSelectDepart = (e) => {
        const value = e.target.value;
        empCodeList.forEach((emp, index) => {
            console.log(`Emp ${index}:`, emp);
        });
        const selectedEmpCode = empCodeList.find((emcode) => emcode.employeeCode === value);
        if (selectedEmpCode) {
            console.log('Selected Employee:', selectedEmpCode);
            setFormData((prevData) => ({
                ...prevData,
                empCode: selectedEmpCode.employeeCode,
                empName: selectedEmpCode.employeeName,
            }));
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                empCode: '',
                empName: ''
            }));
        } else {
            console.log('No Emp found', value);
        }
    };
    const categoryOptions = [
        { category: 'Wages' },
        { category: 'Transport' },
        { category: 'Material Purchase' },
        { category: 'Admin' },
    ];

    useEffect(() => {
        const totalAmount = detailsTableData.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        setFormData((prev) => ({
            ...prev,
            totalAmt: totalAmount,
        }));
    }, [detailsTableData]);

    const getAllCostEstimateByOrgId = async () => {
        try {
            const result = await apiCalls('get', `/costEstimation/getAllCostEstimationByOrgId?orgId=${orgId}`);
            setData(result.paramObjectsMap.costEstimationVO.reverse() || []);
        } catch (err) {
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
        try {
            const result = await apiCalls('get', `/costEstimation/getAllCostEstimationById?id=${row.original.id}`);

            if (result) {
                const costEstimateVO = result.paramObjectsMap.costEstimationVO;
                setEditId(row.original.id);
                setDocId(costEstimateVO.docId);
                getEmpCode(costEstimateVO.department);
                setFormData({
                    id: costEstimateVO.id || '',
                    docDate: costEstimateVO.docDate ? dayjs(costEstimateVO.docDate, 'YYYY-MM-DD') : dayjs(),
                    empName: costEstimateVO.employeeName || '',
                    empCode: costEstimateVO.employeeCode || '',
                    department: costEstimateVO.department || '',
                    totalAmt: costEstimateVO.totalAmount || ''
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
            } else {
                // Handle erro
            }
        } catch (error) {
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
            if (name === 'department' && value) {
                getEmpCode(value);
            }
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
            department: '',
            empCode: '',
            empName: '',
            status: 'DRAFT',
            totalAmt: '',
            approvedBy: '',
            approvedOn: '',
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
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSave = async () => {
        const errors = {};
        if (!formData.department) {
            errors.department = 'Department is required';
        }
        if (!formData.empCode) {
            errors.empCode = 'Emp Code is required';
        }
        if (!formData.empName) {
            errors.empName = 'Emp Name is required';
        }
        // if (!formData.totalAmt) {
        //     errors.totalAmt = 'Total Amt is required';
        // }

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
                department: formData.department,
                employeeCode: formData.empCode,
                employeeName: formData.empName,
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
                } else {
                    showToast('error', response.paramObjectsMap.errorMessage || 'Cost Estimate creation failed');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('error', 'Cost Estimate creation failed');
            }
        } else {
            setFieldErrors(errors);
        }
    };

    return (
        <>
            <div>
                <ToastComponent />
            </div>
            <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
                <div className="row d-flex ml">
                    <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
                        <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
                        <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
                        <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
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
                                <div className="col-md-3 mb-3">
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
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Autocomplete
                                        options={empCodeList}
                                        getOptionLabel={(option) =>
                                            option?.employeeCode && option?.employeeName
                                                ? `${option.employeeCode} - ${option.employeeName}`
                                                : ''
                                        }
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
                                                setFieldErrors((prev) => ({ ...prev, empCode: 'Emp Code is required', empName: 'Emp Name is required' }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={
                                                    <span>
                                                        Emp Code <span className="asterisk">*</span>
                                                    </span>
                                                }
                                                size="small"
                                                error={!!fieldErrors.empCode}
                                                helperText={fieldErrors.empCode}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
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
                                </div>
                                {/* <div className="col-md-3 mb-3">
                                    <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            label="Status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            name="status"
                                        >
                                            <MenuItem value="DRAFT">DRAFT</MenuItem>
                                            <MenuItem value="SUBMIT">SUBMIT</MenuItem>
                                        </Select>
                                        {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                                    </FormControl>
                                </div> */}
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
                                                                        <th className="table-header">Amount</th>
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
                </div>
            </div>
        </>
    );
};
export default CostEstimate;
