import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import CommonReportTable from 'utils/CommonReportTable';

import { showToast } from 'utils/toast-component';

export const PaymentRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [branchList, setBranchList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  const [formData, setFormData] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
    customerName: '',
    branchCode: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    branchCode: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const reportColumns = [
    { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'bankCash', header: 'Bank/Cash A/C', size: 140 },
    { accessorKey: 'receiptAmount', header: 'Receipt Amount', size: 140 },
    { accessorKey: 'bankCharges', header: 'Bank Charges', size: 140 },
    { accessorKey: 'taxAmount', header: 'S. Tax Amount', size: 140 },
    { accessorKey: 'tdsAmount', header: 'TDS Amount', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
    { accessorKey: 'chequeBank', header: 'Cheque Bank', size: 140 },
    { accessorKey: 'chequeNo', header: 'Cheque No', size: 140 },
    { accessorKey: 'amount', header: 'Amount', size: 140 },
    { accessorKey: 'outstanding', header: 'Outstanding', size: 140 },
    { accessorKey: 'setteled', header: 'Settled', size: 140 },
    { accessorKey: 'createdOn', header: 'Created On', size: 140 },
    { accessorKey: 'createdBy', header: 'Created By', size: 140 }
  ];
  useEffect(() => {
    getAllBranches();
    getAllCustomerName();
  }, []);

  // const getAllPartNo = async () => {
  //   try {
  //     const partData = await getAllActivePartDetails(loginBranchCode, loginClient, orgId);
  //     console.log('THE PART DATA ARE:', partData);
  //     const allParts = [{ partno: 'ALL', partDesc: 'All Parts', id: null }, ...partData];

  //     setPartList(allParts);
  //   } catch (error) {
  //     console.error('Error fetching part data:', error);
  //   }
  // };
  const handleInputChange = (fieldName) => (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value[fieldName] // Dynamically set the correct field
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: '' // Clear the field if no value is selected
      }));
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '' // Reset error for the field
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date ? dayjs(date).format('YYYY-MM-DD') : null // Format to 'YYYY-MM-DD'
    }));
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = 'Sub ledger name is required';
    }
    if (!formData.branchCode) {
      errors.branchCode = 'Branch Code is required';
    }
    const saveFormData = {
      subLedgerName: formData.customerName,
      branchCode: formData.branchCode,
      fromDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
      toDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `/arreceivable/getAllReceiptRegister?branchCode=${'MAAW'}&toDate=${saveFormData.toDate}&orgId=${orgId}&finYear=${'2024'}&subLedgerName=${saveFormData.subLedgerName}&fromDate=${saveFormData.fromDate}&branch=${'CHENNAI'}`
        );
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.PartyMasterVO);
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      startDate: dayjs(),
      endDate: dayjs(),
      customerName: '',
      branchCode: ''
    });
    setFieldErrors({
      startDate: '',
      customerName: '',
      branchCode: ''
    });
    setListView(false);
  };

  const handleView = () => {
    setListView(!listView);
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arreceivable/getCustomerNameAndCodeForReceipt?orgId=${orgId}&branch=${'CHENNAI'}&branchCode=${'MAAW'}&finYear=${'2024'}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setCustomerList(response.paramObjectsMap.PartyMasterVO);
        console.log('Test===>', response.paramObjectsMap.PartyMasterVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} isLoading={isLoading} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                  error={fieldErrors.startDate}
                  helperText={fieldErrors.startDate && 'Required'}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate ? dayjs(formData.endDate, 'YYYY-MM-DD') : null}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                  // disabled
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <Autocomplete
              disablePortal
              options={customerList}
              getOptionLabel={(option) => option.customerName}
              sx={{ width: '100%' }}
              size="small"
              value={formData.customerName ? customerList.find((p) => p.customerName === formData.customerName) : null}
              onChange={handleInputChange('customerName')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="SubLedger Name"
                  error={!!fieldErrors.customerName}
                  helperText={fieldErrors.customerName}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
                />
              )}
            />
          </div>
          <div className="col-md-3 mb-3">
            <Autocomplete
              disablePortal
              options={branchList}
              getOptionLabel={(option) => option.branchCode}
              sx={{ width: '100%' }}
              size="small"
              value={formData.branchCode ? branchList.find((c) => c.branchCode === formData.branchCode) : null}
              onChange={handleInputChange('branchCode')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branch Code"
                  error={!!fieldErrors.branchCode}
                  helperText={fieldErrors.branchCode}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
                />
              )}
            />
          </div>
        </div>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentRegister;


// import React, { useState, useEffect } from 'react';
// import ActionButton from 'utils/ActionButton';
// import FormControl from '@mui/material/FormControl';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import ClearIcon from '@mui/icons-material/Clear';
// import SaveIcon from '@mui/icons-material/Save';
// import SearchIcon from '@mui/icons-material/Search';
// import apiCalls from 'apicall';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import { getAllActiveBranches } from 'utils/CommonFunctions';

// const ReceiptRegister = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
//   const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
//   const [allCustomerName, setAllCustomerName] = useState([]);
//   const [branchList, setBranchList] = useState([]);
//   const [branch, setBranch] = useState('Chennai');
//   const [branchCode, setBranchCode] = useState('MAAW');
//   const [finYear, setFinYear] = useState('2024');
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [subLedgerName, setSubLedgerName] = useState('');
//   const [data, setData] = useState([]);
//   const [noData, setNoData] = useState(false); // New state for "No data found" condition

//   useEffect(() => {
//     getAllCustomerName();
//     getAllBranches();
//   }, []);

//   const getAllCustomerName = async () => {
//     try {
//       const response = await apiCalls(
//         'get',
//         `arreceivable/getCustomerNameAndCodeForReceipt?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
//       );
//       if (response.status === true) {
//         setAllCustomerName(response.paramObjectsMap.PartyMasterVO);
//       } else {
//         console.error('API Error:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const getAllBranches = async () => {
//     try {
//       const branchData = await getAllActiveBranches(orgId);
//       setBranchList(branchData);
//     } catch (error) {
//       console.error('Error fetching branch data:', error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await apiCalls(
//         'get',
//         `arreceivable/getAllReceiptRegister?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&fromDate=${dayjs(fromDate).format(
//           'YYYY-MM-DD'
//         )}&toDate=${dayjs(toDate).format('YYYY-MM-DD')}&subLedgerName=${subLedgerName}&orgId=${orgId}`
//       );
//       if (response.status === true && response.paramObjectsMap.PartyMasterVO.length > 0) {
//         setData(response.paramObjectsMap.PartyMasterVO);
//         setNoData(false); // Data found
//       } else {
//         setData([]); // Clear the table if no data is found
//         setNoData(true); // Show "No data found"
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setData([]); // Clear the table in case of error
//       setNoData(true); // Show "No data found" in case of error
//     }
//   };

//   const handleClear = () => {
//     setFromDate(null);
//     setToDate(null);
//     setSubLedgerName('');
//     setBranch(''); // Clear the branch field
//     setBranchCode(''); // Clear the branchCode field
//     setFinYear('2024'); // Reset finYear or set to empty if needed
//     setData([]); // Clear table data
//     setNoData(false); // Reset the "No data found" state
//   };

//   return (
//     <>
//       <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
//         <div className="row d-flex ml">
//           <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
//             <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
//             <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} /> {/* Clear button */}
//             {/* <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} /> */}
//           </div>
//         </div>

//         <div className="row d-flex mt-3">
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DatePicker
//                   label="From Date"
//                   value={fromDate}
//                   slotProps={{
//                     textField: { size: 'small', clearable: true }
//                   }}
//                   onChange={(newValue) => setFromDate(newValue)}
//                   format="DD-MM-YYYY"
//                 />
//               </LocalizationProvider>
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DatePicker
//                   label="To Date"
//                   value={toDate}
//                   slotProps={{
//                     textField: { size: 'small', clearable: true }
//                   }}
//                   onChange={(newValue) => setToDate(newValue)}
//                   format="DD-MM-YYYY"
//                 />
//               </LocalizationProvider>
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth size="small">
//               <InputLabel required>SubLedger Name</InputLabel>
//               <Select label="SubLedger Name" value={subLedgerName} onChange={(e) => setSubLedgerName(e.target.value)}>
//                 {allCustomerName.map((customer) => (
//                   <MenuItem key={customer.id} value={customer.customerName}>
//                     {customer.customerName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth size="small">
//               <InputLabel required>Branch Code</InputLabel>
//               <Select label="Branch Code" onChange={(e) => setBranchCode(e.target.value)}>
//                 {branchList.map((branch) => (
//                   <MenuItem key={branch.id} value={branch.branchCode}>
//                     {branch.branchCode}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//         </div>

//         <div className="row mt-2">
//           <div className="col-lg-12">
//             <div className="table-responsive">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr style={{ backgroundColor: '#673AB7' }}>
//                     <th className="px-2 py-2 text-white text-center">Doc Id</th>
//                     <th className="px-2 py-2 text-white text-center">Doc Date</th>
//                     <th className="px-2 py-2 text-white text-center">SubLedger Name</th>
//                     <th className="px-2 py-2 text-white text-center">Bank / Cash A/C</th>
//                     <th className="px-2 py-2 text-white text-center">Receipt Amount</th>
//                     <th className="px-2 py-2 text-white text-center">Bank Charges</th>
//                     <th className="px-2 py-2 text-white text-center">S. Tax Amount</th>
//                     <th className="px-2 py-2 text-white text-center">TDS Amount</th>
//                     <th className="px-2 py-2 text-white text-center">Invoice No</th>
//                     <th className="px-2 py-2 text-white text-center">Invoice Date</th>
//                     <th className="px-2 py-2 text-white text-center">Ref No</th>
//                     <th className="px-2 py-2 text-white text-center">Ref Date</th>
//                     <th className="px-2 py-2 text-white text-center">Cheque Bank</th>
//                     <th className="px-2 py-2 text-white text-center">Cheque No</th>
//                     <th className="px-2 py-2 text-white text-center">Amount</th>
//                     <th className="px-2 py-2 text-white text-center">Outstanding</th>
//                     <th className="px-2 py-2 text-white text-center">Settled</th>
//                     <th className="px-2 py-2 text-white text-center">Created On</th>
//                     <th className="px-2 py-2 text-white text-center">Created By</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {noData ? (
//                     <tr>
//                       <td colSpan="19" className="text-center py-3">
//                         No data found
//                       </td>
//                     </tr>
//                   ) : (
//                     data.map((record, index) => (
//                       <tr key={index}>
//                         <td className="px-2 py-2 text-center">{record.docId}</td>
//                         <td className="px-2 py-2 text-center">{record.docDate}</td>
//                         <td className="px-2 py-2 text-center">{record.subLedgerName}</td>
//                         <td className="px-2 py-2 text-center">{record.bankCash}</td>
//                         <td className="px-2 py-2 text-center">{record.receiptAmount}</td>
//                         <td className="px-2 py-2 text-center">{record.bankCharges}</td>
//                         <td className="px-2 py-2 text-center">{record.taxAmount}</td>
//                         <td className="px-2 py-2 text-center">{record.tdsAmount}</td>
//                         <td className="px-2 py-2 text-center">{record.invoiceNo}</td>
//                         <td className="px-2 py-2 text-center">{record.invoiceDate}</td>
//                         <td className="px-2 py-2 text-center">{record.refNo}</td>
//                         <td className="px-2 py-2 text-center">{record.refDate}</td>
//                         <td className="px-2 py-2 text-center">{record.chequeBank}</td>
//                         <td className="px-2 py-2 text-center">{record.chequeNo}</td>
//                         <td className="px-2 py-2 text-center">{record.amount}</td>
//                         <td className="px-2 py-2 text-center">{record.outstanding}</td>
//                         <td className="px-2 py-2 text-center">{record.setteled}</td>
//                         <td className="px-2 py-2 text-center">{record.createdOn}</td>
//                         <td className="px-2 py-2 text-center">{record.createdBy}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReceiptRegister;
