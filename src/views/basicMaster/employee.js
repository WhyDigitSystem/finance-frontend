import React, { useState, useRef, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Checkbox, FormControlLabel, FormHelperText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import CommonListViewTable from '../basicMaster/CommonListViewTable';
import { ToastContainer, toast } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import COASample from '../../assets/sample-files/COASample.xlsx';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const Employee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [showForm, setShowForm] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    empCode: '',
    empName: '',
    gender: '',
    branch: '',
    branchCode: '',
    department: '',
    designation: '',
    dob: null,
    doj: null,
    active: true,
    salesFlag: true,
    email: ''
  });

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    empCode: '',
    empName: '',
    gender: '',
    branch: '',
    branchCode: '',
    department: '',
    designation: '',
    dob: '',
    doj: '',
    email: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    getAllBranches();
    getAllEmployees();
    getAllDesignation();
    getAllDepartment();
  }, []);
  const getAllDesignation = async () => {
    try {
      const response = await apiCalls('get', `master/getDesignationNameForEmployee?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setDesignationList(response.paramObjectsMap.designationName);
        console.log('fin', response.paramObjectsMap.designationName);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleExcelFileDownload = () => {
    console.log("Downloading Employee Excel...");  // Debugging step
    console.log("List View Data:", listViewData); // Check if data exists

    if (!listViewData || listViewData.length === 0) {
      showToast('error', 'No employee data available to download');
      return;
    }

    try {
      // Extracting employee-specific fields
      const filteredData = listViewData.map(({ employeeCode, employeeName, branch, department, designation, joiningDate, active }) => ({
        'Employee Code': employeeCode,
        'Employee Name': employeeName,
        'Branch': branch,
        'Department': department,
        'Designation': designation,
        'Joining Date': joiningDate,
        'Active': (active === true || active === 'Active') ? 'Yes' : 'No'
      }));

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee_List');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, 'Employee_List.xlsx');
      showToast('success', 'Employee Excel file downloaded successfully');
    } catch (error) {
      console.error('Error generating Employee Excel:', error);
      showToast('error', 'Failed to generate Employee Excel');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type, selectionStart, selectionEnd } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const codeRegex = /^[a-zA-Z0-9- ]*$/;
    let errorMessage = '';

    if (name === 'empCode' && !codeRegex.test(value)) {
      errorMessage = 'Only AlphaNumerics are Allowed';
    } else if (name === 'empCode' && value.length > 10) {
      errorMessage = 'Exceeded Max Length';
    } else if (name === 'empName' && !nameRegex.test(value)) {
      errorMessage = 'Only Alphabets Allowed';
    } else if (name === 'empName' && value.length > 50) {
      errorMessage = 'Exceeded Max Length';
    }
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Branch-specific logic
      if (name === 'branch') {
        const selectedBranch = branchList.find((br) => br.branch === value);
        setFormData((prevData) => ({
          ...prevData,
          branch: value,
          branchCode: selectedBranch ? selectedBranch.branchCode : ''
        }));
      } else if (type === 'checkbox') {
        // Checkbox handling
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else {
        // Handle text or textarea
        let inputValue = value;

        if (name === 'email') {
          // Store email in lowercase
          inputValue = value.toLowerCase();
        } else if (type === 'text' || type === 'textarea') {
          // Convert other inputs to uppercase
          inputValue = value.toUpperCase();
        }

        setFormData((prevData) => ({ ...prevData, [name]: inputValue }));

        // Maintain cursor position for seamless typing
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
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const maxDate = dayjs().subtract(18, 'years');

  const handleClear = () => {
    setFormData({
      empCode: '',
      empName: '',
      gender: '',
      branch: '',
      branchCode: '',
      department: '',
      designation: '',
      dob: null,
      doj: null,
      active: true,
      email: ''
    });
    setFieldErrors({
      empCode: '',
      empName: '',
      gender: '',
      branch: '',
      branchCode: '',
      department: '',
      designation: '',
      dob: '',
      doj: '',
      email: ''
    });
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getAllEmployees = async () => {
    try {
      const response = await apiCalls('get', `master/getAllEmployeeByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.employeeVO.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getEmployeeById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `master/employee/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularEmp = response.paramObjectsMap.Employee;
        const selectedBranch = branchList.find((br) => br.branch === particularEmp.branch);
        console.log('THE SELECTED BRANCH IS:', selectedBranch);

        setFormData({
          empCode: particularEmp.employeeCode,
          email: particularEmp.email,
          empName: particularEmp.employeeName,
          gender: particularEmp.gender,
          department: particularEmp.department,
          designation: particularEmp.designation,
          branch: particularEmp.branch,
          branchCode: selectedBranch ? selectedBranch.branchCode : '', // Handle case where selectedBranch might be undefined
          dob: particularEmp.dateOfBirth,
          doj: particularEmp.joiningDate,
          active: particularEmp.active === 'Active' ? true : false,
          salesFlag: particularEmp.salesFlag === true ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.empCode) {
      errors.empCode = 'Employee Code is required';
    } else if (formData.empCode.length < 2) {
      errors.empCode = 'Min Length is 2';
    }

    if (!formData.empName) {
      errors.empName = 'Employee Name is required';
    } else if (formData.empName.length < 3) {
      errors.empName = 'Min Length is 3';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    if (!formData.branch) {
      errors.branch = 'Branch is required';
    }
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    if (!formData.designation) {
      errors.designation = 'Designation is required';
    }
    if (!formData.dob) {
      errors.dob = 'Date of Birth is required';
    }
    if (!formData.doj) {
      errors.doj = 'Date of Joining is required';
    }
    if (!formData.email) {
      errors.email = 'Email ID is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid Mail ID Format';
    }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        salesFlag: formData.salesFlag,
        email: formData.email,
        employeeCode: formData.empCode,
        employeeName: formData.empName,
        gender: formData.gender,
        branch: formData.branch,
        branchCode: formData.branchCode,
        department: formData.department,
        designation: formData.designation,
        dateOfBirth: formData.dob,
        joiningdate: formData.doj,
        orgId: orgId,
        createdBy: loginUserName
      };
      console.log('DATA TO SAVE', saveFormData);

      try {
        const response = await apiCalls('put', `master/createUpdateEmployee`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Employee Updated Successfully' : 'Employee created successfully');
          handleClear();
          getAllEmployees();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Employee creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Employee creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'employeeCode', header: 'Emp Code', size: 140 },
    { accessorKey: 'employeeName', header: 'Employee', size: 140 },
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'designation', header: 'Designation', size: 140 },
    { accessorKey: 'joiningDate', header: 'Joining Date', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];


  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handlePDFDownload = async () => {
    setLoading(true);

    if (!listViewData || listViewData.length === 0) {
      showToast('error', 'No employee data available to download');
      setLoading(false);
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text('Employee List', 14, 10);

      // Define table headers for Employee List
      const tableColumn = ['Employee Code', 'Employee Name', 'Branch', 'Department', 'Designation', 'Joining Date', 'Active'];
      const tableRows = [];

      // Format data for the PDF table
      listViewData.forEach(({ employeeCode, employeeName, branch, department, designation, joiningDate, active }) => {
        tableRows.push([
          employeeCode,
          employeeName,
          branch,
          department,
          designation,
          joiningDate,
          (active === true || active === 'Active') ? 'Yes' : 'No'
        ]);
      });

      // Generate the table inside the PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save('Employee_List.pdf');
      showToast('success', 'Employee PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating Employee PDF:', error);
      showToast('error', 'Failed to generate Employee PDF');
    }

    setLoading(false);
  };


  return (
    <>
      <div>{/* <ToastContainer /> */}</div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
            {uploadOpen && (
              <CommonBulkUpload
                open={uploadOpen}
                handleClose={handleBulkUploadClose}
                title="Upload Files"
                uploadText="Upload file"
                downloadText="Sample File"
                onSubmit={handleSubmit}
                sampleFileDownload={COASample}
                handleFileUpload={handleFileUpload}
                apiUrl={`master/excelUploadForGroupLedger`}
                screen="COA"
                loginUser={loginUserName}
                orgId={orgId}
              ></CommonBulkUpload>
            )}
            {/* <ActionButton icon={FaFileExcel} title="Excel Download" onClick={handleExcelFileDownload} />
            <ActionButton icon={FaFilePdf} title="PDF Download" onClick={handlePDFDownload} /> */}
            {listView && (
              < div className='ps-2'>
                <ActionButton icon={FaFileExcel} title="Excel Download" onClick={handleExcelFileDownload} />
                <ActionButton icon={FaFilePdf} title="PDF Download" onClick={handlePDFDownload} />
              </div>
            )}
          </div>
        </div>
        {listView ? (
          <div className="">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getEmployeeById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="empName"
                  value={formData.empName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.empName}
                  helperText={fieldErrors.empName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="empCode"
                  value={formData.empCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.empCode}
                  helperText={fieldErrors.empCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gender}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select labelId="gender-label" label="Gender" value={formData.gender} onChange={handleInputChange} name="gender">
                    <MenuItem value="MALE">MALE</MenuItem>
                    <MenuItem value="FEMALE">FEMALE</MenuItem>
                  </Select>
                  {fieldErrors.gender && <FormHelperText>{fieldErrors.gender}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.branch}>
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select labelId="branch-label" label="Branch" value={formData.branch} onChange={handleInputChange} name="branch">
                    {branchList?.map((row) => (
                      <MenuItem key={row.id} value={row.branch}>
                        {row.branch}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.branch && <FormHelperText>{fieldErrors.branch}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.department}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id='department'
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.designation}>
                  <InputLabel id="designation-label">Designation</InputLabel>
                  <Select
                    labelId="designation-label"
                    id='designation'
                    label="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    name="designation"
                  // disabled={isEditMode}
                  >
                    {designationList?.map((row) => (
                      <MenuItem key={row.id} value={row.designationName}>
                        {row.designationName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.designation && <FormHelperText>{fieldErrors.designation}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob ? dayjs(formData.dob, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('dob', date)}
                      maxDate={maxDate}
                      slotProps={{
                        textField: { size: 'small', clearable: true, error: fieldErrors.dob, helperText: fieldErrors.dob }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Join"
                      value={formData.doj ? dayjs(formData.doj, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('doj', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true, error: fieldErrors.doj, helperText: fieldErrors.doj }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Email ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.salesFlag} onChange={handleInputChange} name="salesFlag" />}
                  label="Sales Flag"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Employee;
