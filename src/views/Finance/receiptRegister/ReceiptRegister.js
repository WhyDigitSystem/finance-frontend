import React, { useState, useEffect } from 'react';
import ActionButton from 'utils/ActionButton';
import FormControl from '@mui/material/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import apiCalls from 'apicall';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getAllActiveBranches } from 'utils/CommonFunctions';

const ReceiptRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [allCustomerName, setAllCustomerName] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState('Chennai');
  const [branchCode, setBranchCode] = useState('MAAW');
  const [finYear, setFinYear] = useState('2024');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [subLedgerName, setSubLedgerName] = useState('');
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false); // New state for "No data found" condition

  useEffect(() => {
    getAllCustomerName();
    getAllBranches();
  }, []);

  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls(
        'get',
        `arreceivable/getCustomerNameAndCodeForReceipt?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&orgId=${orgId}`
      );
      if (response.status === true) {
        setAllCustomerName(response.paramObjectsMap.PartyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching branch data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await apiCalls(
        'get',
        `arreceivable/getAllReceiptRegister?branch=${branch}&branchCode=${branchCode}&finYear=${finYear}&fromDate=${dayjs(fromDate).format(
          'YYYY-MM-DD'
        )}&toDate=${dayjs(toDate).format('YYYY-MM-DD')}&subLedgerName=${subLedgerName}&orgId=${orgId}`
      );
      if (response.status === true && response.paramObjectsMap.PartyMasterVO.length > 0) {
        setData(response.paramObjectsMap.PartyMasterVO);
        setNoData(false); // Data found
      } else {
        setData([]); // Clear the table if no data is found
        setNoData(true); // Show "No data found"
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]); // Clear the table in case of error
      setNoData(true); // Show "No data found" in case of error
    }
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setSubLedgerName('');
    setBranch(''); // Clear the branch field
    setBranchCode(''); // Clear the branchCode field
    setFinYear('2024'); // Reset finYear or set to empty if needed
    setData([]); // Clear table data
    setNoData(false); // Reset the "No data found" state
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} /> {/* Clear button */}
            {/* <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} /> */}
          </div>
        </div>

        <div className="row d-flex mt-3">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  onChange={(newValue) => setFromDate(newValue)}
                  format="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  value={toDate}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  onChange={(newValue) => setToDate(newValue)}
                  format="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel required>SubLedger Name</InputLabel>
              <Select label="SubLedger Name" value={subLedgerName} onChange={(e) => setSubLedgerName(e.target.value)}>
                {allCustomerName.map((customer) => (
                  <MenuItem key={customer.id} value={customer.customerName}>
                    {customer.customerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel required>Branch Code</InputLabel>
              <Select label="Branch Code" onChange={(e) => setBranchCode(e.target.value)}>
                {branchList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.branchCode}>
                    {branch.branchCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#673AB7' }}>
                    <th className="px-2 py-2 text-white text-center">Doc Id</th>
                    <th className="px-2 py-2 text-white text-center">Doc Date</th>
                    <th className="px-2 py-2 text-white text-center">SubLedger Name</th>
                    <th className="px-2 py-2 text-white text-center">Bank / Cash A/C</th>
                    <th className="px-2 py-2 text-white text-center">Receipt Amount</th>
                    <th className="px-2 py-2 text-white text-center">Bank Charges</th>
                    <th className="px-2 py-2 text-white text-center">S. Tax Amount</th>
                    <th className="px-2 py-2 text-white text-center">TDS Amount</th>
                    <th className="px-2 py-2 text-white text-center">Invoice No</th>
                    <th className="px-2 py-2 text-white text-center">Invoice Date</th>
                    <th className="px-2 py-2 text-white text-center">Ref No</th>
                    <th className="px-2 py-2 text-white text-center">Ref Date</th>
                    <th className="px-2 py-2 text-white text-center">Cheque Bank</th>
                    <th className="px-2 py-2 text-white text-center">Cheque No</th>
                    <th className="px-2 py-2 text-white text-center">Amount</th>
                    <th className="px-2 py-2 text-white text-center">Outstanding</th>
                    <th className="px-2 py-2 text-white text-center">Settled</th>
                    <th className="px-2 py-2 text-white text-center">Created On</th>
                    <th className="px-2 py-2 text-white text-center">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {noData ? (
                    <tr>
                      <td colSpan="19" className="text-center py-3">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    data.map((record, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 text-center">{record.docId}</td>
                        <td className="px-2 py-2 text-center">{record.docDate}</td>
                        <td className="px-2 py-2 text-center">{record.subLedgerName}</td>
                        <td className="px-2 py-2 text-center">{record.bankCash}</td>
                        <td className="px-2 py-2 text-center">{record.receiptAmount}</td>
                        <td className="px-2 py-2 text-center">{record.bankCharges}</td>
                        <td className="px-2 py-2 text-center">{record.taxAmount}</td>
                        <td className="px-2 py-2 text-center">{record.tdsAmount}</td>
                        <td className="px-2 py-2 text-center">{record.invoiceNo}</td>
                        <td className="px-2 py-2 text-center">{record.invoiceDate}</td>
                        <td className="px-2 py-2 text-center">{record.refNo}</td>
                        <td className="px-2 py-2 text-center">{record.refDate}</td>
                        <td className="px-2 py-2 text-center">{record.chequeBank}</td>
                        <td className="px-2 py-2 text-center">{record.chequeNo}</td>
                        <td className="px-2 py-2 text-center">{record.amount}</td>
                        <td className="px-2 py-2 text-center">{record.outstanding}</td>
                        <td className="px-2 py-2 text-center">{record.setteled}</td>
                        <td className="px-2 py-2 text-center">{record.createdOn}</td>
                        <td className="px-2 py-2 text-center">{record.createdBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptRegister;
