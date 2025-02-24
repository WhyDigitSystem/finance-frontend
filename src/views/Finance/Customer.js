import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, FormHelperText, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { getAllActiveCitiesByState, getAllActiveStatesByCountry, getAllActiveCurrency } from 'utils/CommonFunctions';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import UploadIcon from '@mui/icons-material/Upload';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SampleFile from '../../assets/sample-files/customer.xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileExcel } from 'react-icons/fa';

export const Customer = () => {
  const [stateList, setStateList] = useState([]);
  const [editId, setEditId] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [currencyExRates, setCurrencyExRates] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const gstRegex = /^[0-9A-Z]{15}$/;
  const [formData, setFormData] = useState({
    active: true,
    customerName: '',
    customerCode: '',
    gstIn: '',
    panNo: '',
    creditLimit: '',
    creditDays: '',
    creditTerms: '',
    gstRegistered: '',
    bussinessType: '',
    bussinessCate: '',
    accType: 'RECEIVABLE',
    currency: '',
    createdBy: loginUserName,
    orgId: orgId
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const listViewColumns = [
    { accessorKey: 'partyCode', header: 'Customer Code', size: 140 },
    { accessorKey: 'partyName', header: 'Customer Name', size: 140 },
    { accessorKey: 'gstIn', header: 'Reg No', size: 140 },
    { accessorKey: 'panNo', header: 'Pan No', size: 140 },
    { accessorKey: 'creditLimit', header: 'Credit Limit', size: 140 },
    { accessorKey: 'creditDays', header: 'Credit Days', size: 140 },
    { accessorKey: 'creditTerms', header: 'Credit Terms', size: 140 },
    { accessorKey: 'gstRegistered', header: 'Tax Registered', size: 140 },
    { accessorKey: 'bussinessType', header: 'Business Type', size: 140 },
    { accessorKey: 'bussinessCate', header: 'Business Category', size: 140 },
    { accessorKey: 'accountType', header: 'Account Type', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 }
    // { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleView = () => {
    setListView(!listView);
  };

  const [fieldErrors, setFieldErrors] = useState({
    customerCode: '',
    customerName: '',
    gstIn: '',
    panNo: '',
    creditLimit: '',
    creditDays: '',
    creditTerms: '',
    gstRegistered: '',
    bussinessType: '',
    bussinessCate: '',
    accType: '',
    currency: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getAllCustomerByOrgId();
    getAllCurrencyForExRate();
    getAllStates();
    getAllBranches();
    getAllSalesPerson();
  }, []);

  useEffect(() => {
    if (currencies.length === 1) {
      handleInputChange({ target: { name: 'currency', value: currencies[0].currency } });
    }
  }, [currencies]);

  const handleCurrencyChange = (row, index, event) => {
    const value = event.target.value;

    setPartyCurrencyMapping((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              transCurrency: value
            }
          : r
      )
    );

    setPartyCurrencyMappingErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        transCurrency: !value ? 'Transaction Currency is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableCurrencies = (currentRowId) => {
    const selectedCurrencies = partyCurrencyMapping.filter((row) => row.id !== currentRowId).map((row) => row.transCurrency);

    return currencyExRates.filter((currency) => !selectedCurrencies.includes(currency.currency));
  };

  const getAllCurrencyForExRate = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/getAllCurrencyForExRate?&orgId=${orgId}`);
      console.log('getAllCurrencyForExRate:', response);
      if (response.status === true) {
        const exRates = response.paramObjectsMap.currencyVO;

        setCurrencyExRates(
          exRates.map((row) => ({
            id: row.id,
            currency: row.currency,
            currencyDescription: row.currencyDescription
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getAllCustomerByOrgId = async () => {
    try {
      const response = await apiCalls('get', `master/getAllCustomers?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.masterVOs.reverse());
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExcelFileDownload = async () => {
    try {
      setLoading(true);

      const result = await apiCalls('get', `/master/getAllCustomers?orgId=${orgId}`);

      console.log('API Response:', result);

      const customerData = result?.paramObjectsMap?.masterVOs;

      if (customerData && Array.isArray(customerData)) {
        const filteredData = customerData.map(({ partyName, partyCode, gstIn, panNo, creditLimit }) => ({
          partyName,
          partyCode,
          gstIn,
          panNo,
          creditLimit
        }));

        const partyStateData = customerData.flatMap(
          ({ partyStateVO }) =>
            partyStateVO?.map(({ state, gstIn, stateNo, contactPerson, contactPhoneNo, email }) => ({
              state,
              gstIn,
              stateNo,
              contactPerson,
              contactPhoneNo,
              email
            })) || []
        );

        const partyAddressData = customerData.flatMap(
          ({ partyAddressVO }) =>
            partyAddressVO?.map(
              ({ state, businessPlace, stateGstIn, city, addressType, addressLine1, addressLine2, addressLine3, pincode, contact }) => ({
                state,
                businessPlace,
                stateGstIn,
                city,
                addressType,
                addressLine1,
                addressLine2,
                addressLine3,
                pincode,
                contact
              })
            ) || []
        );

        const partySalesPersonTaggingData = customerData.flatMap(
          ({ partySalesPersonTaggingVO }) =>
            partySalesPersonTaggingVO?.map(({ salesPerson, empCode, salesBranch, effectiveFrom, effectiveTill }) => ({
              salesPerson,
              empCode,
              salesBranch,
              effectiveFrom,
              effectiveTill
            })) || []
        );

        const partyCurrencyMappingData = customerData.flatMap(
          ({ partyCurrencyMappingVO }) =>
            partyCurrencyMappingVO?.map(({ transCurrency }) => ({
              transCurrency
            })) || []
        );

        const workbook = XLSX.utils.book_new();

        // Create and append worksheets
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(filteredData), 'Header Details');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(partyStateData), 'Party State');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(partyAddressData), 'Party Address');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(partySalesPersonTaggingData), 'Party Sales');
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(partyCurrencyMappingData), 'Party Currency');

        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        saveAs(blob, 'CUSTOMER.xlsx');

        console.log('Download triggered');
      } else {
        console.error('Invalid or empty API response.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      setLoading(false);
    }
  };

  const getAllStates = async () => {
    try {
      const stateData = await getAllActiveStatesByCountry('INDIA', orgId);
      setStateList(stateData || []);
    } catch (error) {
      console.error('Error fetching states:', error);
      setStateList([]);
    }
  };

  const getAllCities = async (selectedState, rowId) => {
    try {
      const cityData = await getAllActiveCitiesByState(selectedState, orgId);
      setPartyAddressData((prevData) => prevData.map((row) => (row.id === rowId ? { ...row, cityOptions: cityData } : row)));
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const response = await apiCalls('get', `master/branch?orgid=${orgId}`);
      console.log('API Response for branch:', response);

      if (response.status === true) {
        const branchData = response.paramObjectsMap.branchVO.filter((row) => row.active === 'Active');
        setBranchData(branchData);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllSalesPerson = async () => {
    try {
      const response = await apiCalls('get', `master/getSalesPersonForCustomer?orgId=${orgId}`);

      if (response.status === true) {
        const empData = response.paramObjectsMap.salesPerson.map((row) => ({
          salesPerson: row.salesPerson,
          employeeCode: row.salesPersonCode,
          active: row.active
        }));
        setEmpData(empData);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCustomerById = async (row) => {
    console.log('THE SELECTED getPartyMasterById IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `master/getCustomersById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const customer = response.paramObjectsMap.customersVO;

        setFormData({
          customerName: customer.partyName,
          customerCode: customer.partyCode,
          gstIn: customer.gstIn,
          panNo: customer.panNo,
          active: customer.active,
          creditLimit: customer.creditLimit,
          creditDays: customer.creditDays,
          creditTerms: customer.creditTerms,
          gstRegistered: customer.gstRegistered,
          bussinessType: customer.bussinessType,
          bussinessCate: customer.bussinessCate,
          accType: customer.accountType,
          currency: customer.currency
        });

        setPartyStateData(
          customer.partyStateVO.map((detail) => ({
            id: detail.id,
            state: detail.state || '',
            gstIn: detail.gstIn || '',
            stateNo: detail.stateNo || '',
            contactPerson: detail.contactPerson || '',
            contactPhoneNo: parseInt(detail.contactPhoneNo) || '',
            email: detail.email || '',
            stateCode: detail.stateCode || ''
          }))
        );

        const addressData = await Promise.all(
          customer.partyAddressVO.map(async (detail) => {
            const cityOptions = detail.state ? await getAllActiveCitiesByState(detail.state, orgId) : [];
            return {
              id: detail.id,
              addressType: detail.addressType || '',
              addressLine1: detail.addressLine1 || '',
              addressLine2: detail.addressLine2 || '',
              addressLine3: detail.addressLine3 || '',
              businessPlace: detail.businessPlace || '',
              sez: detail.sez === 'T' ? true : false,
              city: detail.city || '',
              contact: detail.contact || '',
              pincode: detail.pincode || '',
              state: detail.state || '',
              stateGstIn: detail.stateGstIn || '',
              cityOptions
            };
          })
        );

        setPartySalesPersonTagging(
          customer.partySalesPersonTaggingVO.map((detail) => ({
            id: detail.id,
            salesPerson: detail.salesPerson || '',
            empCode: detail.empCode || '',
            salesBranch: detail.salesBranch || '',
            effectiveFrom: detail.effectiveFrom || '',
            effectiveTill: detail.effectiveTill || ''
          }))
        );
        const CurrencyMappingData = customer.partyCurrencyMappingVO.map((detail) => ({
          id: detail.id,
          transCurrency: detail.transCurrency || ''
        }));

        for (const row of addressData) {
          if (row.state) {
            const cityData = await getAllActiveCitiesByState(row.state, orgId);
            row.cityOptions = cityData;
          }
        }

        setPartyAddressData(addressData);
        // setPartySalesPersonTagging(SalesPersonTaggingData);
        setPartyCurrencyMapping(CurrencyMappingData);
      }
      console.log('Currency Mapping Data:', partyCurrencyMapping);
    } catch (error) {
      console.error('Error fetching PartyMaster:', error);
    }
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
    getAllCustomerByOrgId();
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    // const codeRegex = /^[a-zA-Z0-9- ]*$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    let formattedValue = value;

    if (name === 'panNo' || name === 'gstIn') {
      formattedValue = value.toUpperCase();
    }

    if (name === 'panNo' && formattedValue.length > 11) return;

    let errorMessage = '';

    // PAN validation
    if (name === 'panNo') {
      if (formattedValue.length === 11 && !panRegex.test(formattedValue)) {
        errorMessage = 'Invalid PAN format (e.g., ABCDE1234F)';
      }
    }

    // Customer Code validation
    // if (name === "customerCode") {
    //   if (!codeRegex.test(value)) {
    //     errorMessage = "Only Alphanumeric characters and Hyphen (-) allowed";
    //   } else if (value.length > 10) {
    //     errorMessage = "Exceeded Maximum Length (10)";
    //   }
    // }

    // Customer Name validation
    if (name === 'customerName') {
      if (!nameRegex.test(value)) {
        errorMessage = 'Only Alphabets Allowed';
      } else if (value.length > 50) {
        errorMessage = 'Exceeded Maximum Length (50)';
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      let inputValue = value;

      if (name === 'email') {
        inputValue = value.toLowerCase();
      } else if (type === 'text' || type === 'textarea') {
        inputValue = value.toUpperCase();
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : inputValue
      }));

      // Maintain cursor position for smooth user experience
      // setTimeout(() => {
      //   const inputElement = document.getElementsByName(name)[0];
      //   if (inputElement && inputElement.setSelectionRange) {
      //     inputElement.setSelectionRange(selectionStart, selectionEnd);
      //   }
      // }, 0);
    }
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      customerName: '',
      active: '',
      customerCode: '',
      gstIn: '',
      panNo: '',
      creditLimit: '',
      creditDays: '',
      creditTerms: '',
      gstRegistered: '',
      bussinessType: '',
      bussinessCate: '',
      accType: 'RECEIVABLE',
      currency: ''
    });
    setFieldErrors({
      customerName: '',
      customerCode: '',
      gstIn: '',
      panNo: '',
      creditLimit: '',
      creditDays: '',
      creditTerms: '',
      gstRegistered: '',
      bussinessType: '',
      bussinessCate: '',
      accType: '',
      currency: ''
    });
    setPartyStateData([
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        email: '',
        stateCode: ''
      }
    ]);
    setPartyStateDataErrors([]);
    setPartyAddressData([
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        sez: '',
        city: '',
        contact: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
    setPartyAddressDataErrors([]);

    setPartySalesPersonErrors([]);
    setPartySalesPersonTagging([
      {
        salesPerson: '',
        empCode: '',
        salesBranch: '',
        effectiveFrom: null,
        effectiveTill: null
      }
    ]);

    setPartyCurrencyMappingErrors([]);
    setPartyCurrencyMapping([
      {
        transCurrency: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === partyStateData) {
      return !lastRow.state;
    }
    if (table === partyAddressData) {
      return !lastRow.state;
    }
    if (table === partySalesPersonTagging) {
      return !lastRow.salesPerson;
    }
    if (table === partyCurrencyMapping) {
      return !lastRow.transCurrency;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === partyStateData) {
      setPartyStateDataErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          state: !table[table.length - 1].state ? 'State is required' : ''
        };
        return newErrors;
      });
    }
    if (table === partyAddressData) {
      setPartyAddressDataErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          state: !table[table.length - 1].state ? 'State is required' : ''
        };
        return newErrors;
      });
    }
    if (table === partySalesPersonTagging) {
      setPartySalesPersonErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          salesPerson: !table[table.length - 1].salesPerson ? 'Sales Person is required' : ''
        };
        return newErrors;
      });
    }
    if (table === partyCurrencyMapping) {
      setPartyCurrencyMapping((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          transCurrency: !table[table.length - 1].transCurrency ? 'Transaction Currency is required' : ''
        };
        return newErrors;
      });
    }
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

  const handleStateChange = (row, index, event) => {
    const value = event.target.value;
    const selectedState = stateList.find((state) => state.stateName === value);

    setPartyStateData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              state: value,
              stateCode: selectedState ? selectedState.stateCode : '',
              stateNo: selectedState ? selectedState.stateNumber : ''
            }
          : r
      )
    );

    setPartyStateDataErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        state: !value ? 'State is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableStates = (currentRowId) => {
    if (!Array.isArray(stateList)) {
      console.error('stateList is not an array:', stateList);
      return [];
    }

    return stateList.map((state) => ({
      id: state.id,
      stateName: state.stateName
    }));
  };

  const handleEmployeeChange = (row, index, event) => {
    const selectedName = event.target.value;
    const selectedEmployee = empData.find((item) => item.salesPerson === selectedName);

    setPartySalesPersonTagging((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              salesPerson: selectedName,
              empCode: selectedEmployee ? selectedEmployee.employeeCode : ''
            }
          : r
      )
    );

    setPartySalesPersonErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        salesPerson: !selectedName ? 'Sales Person is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableEmp = (currentRowId) => {
    const selectedEmployees = partySalesPersonTagging.filter((row) => row.id !== currentRowId).map((row) => row.salesPerson);

    return empData.filter((item) => !selectedEmployees.includes(item.salesPerson));
  };

  const [partyStateData, setPartyStateData] = useState([
    {
      id: 1,
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      email: '',
      stateCode: ''
    }
  ]);

  const [partyStateDataErrors, setPartyStateDataErrors] = useState([
    {
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      email: '',
      stateCode: ''
    }
  ]);

  const handleAddRowPartyState = () => {
    if (isLastRowEmpty(partyStateData)) {
      displayRowError(partyStateData);
      return;
    }
    const newRow = {
      id: Date.now(),
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      email: '',
      stateCode: ''
    };
    setPartyStateData([...partyStateData, newRow]);
    setPartyStateDataErrors([
      ...partyStateDataErrors,
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        email: '',
        stateCode: ''
      }
    ]);
  };

  const [partyAddressData, setPartyAddressData] = useState([
    {
      id: 1,
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      sez: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: '',
      cityOptions: []
    }
  ]);

  const [partyAddressDataErrors, setPartyAddressDataErrors] = useState([
    {
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      sez: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    }
  ]);

  const handleAddRowPartyAddress = () => {
    if (isLastRowEmpty(partyAddressData)) {
      displayRowError(partyAddressData);
      return;
    }
    const newRow = {
      id: Date.now(),
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      sez: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: '',
      cityOptions: [] // Initialize city options as empty
    };
    setPartyAddressData([...partyAddressData, newRow]);
    setPartyAddressDataErrors([
      ...partyAddressDataErrors,
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        sez: '',
        city: '',
        contact: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
  };

  const [partySalesPersonTagging, setPartySalesPersonTagging] = useState([
    {
      id: Date.now(),
      effectiveFrom: null,
      effectiveTill: null,
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    }
  ]);

  const [partySalesPersonErrors, setPartySalesPersonErrors] = useState([
    {
      salesPerson: '',
      empCode: '',
      salesBranch: '',
      effectiveFrom: null,
      effectiveTill: null
    }
  ]);

  const handleAddRowSalesPerson = () => {
    if (isLastRowEmpty(partySalesPersonTagging)) {
      displayRowError(partySalesPersonTagging);
      return;
    }
    const newRow = {
      id: Date.now(),
      effectiveFrom: null,
      effectiveTill: null,
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    };
    setPartySalesPersonTagging([...partySalesPersonTagging, newRow]);
  };

  const [partyCurrencyMapping, setPartyCurrencyMapping] = useState([
    {
      id: Date.now(),
      transCurrency: ''
    }
  ]);

  const [partyCurrencyMappingErrors, setPartyCurrencyMappingErrors] = useState([
    {
      transCurrency: ''
    }
  ]);

  const handleAddRowCurrencyMapping = () => {
    if (isLastRowEmpty(partyCurrencyMapping)) {
      displayRowError(partyCurrencyMapping);
      return;
    }
    const newRow = {
      id: Date.now(),
      transCurrency: ''
    };
    setPartyCurrencyMapping([...partyCurrencyMapping, newRow]);
    setPartyCurrencyMappingErrors([
      ...partyCurrencyMappingErrors,
      {
        transCurrency: ''
      }
    ]);
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    } else if (formData.customerName.length < 3) {
      errors.customerName = 'Min Length is 3';
    }
    // if (!formData.customerCode) {
    //   errors.customerCode = 'Customer Name is required';
    // } else if (formData.customerCode.length < 2) {
    //   errors.customerCode = 'Min Length is 2';
    // }
    setFieldErrors(errors);

    let partyAddressDataValid = true;
    const newTableErrors1 = partyAddressData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyAddressDataValid = false;
      }
      return rowErrors;
    });
    setPartyAddressDataErrors(newTableErrors1);

    let partyStateDataValid = true;
    const newTableErrors2 = partyStateData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyStateDataValid = false;
      }
      return rowErrors;
    });
    setPartyStateDataErrors(newTableErrors2);

    if (Object.keys(errors).length === 0 && partyAddressDataValid) {
      const customersAddressVO = partyAddressData.map((row) => ({
        addressType: row.addressType,
        addressLane1: row.addressLine1,
        addressLane2: row.addressLine2,
        addressLane3: row.addressLine3,
        bussinesPlace: row.businessPlace,
        sez: false,
        city: row.city,
        contact: row.contact,
        contactNo: row.contact,
        pinCode: parseInt(row.pincode),
        state: row.state,
        gstnIn: row.stateGstIn
      }));

      const customersStateVO = partyStateData.map((row) => ({
        email: row.email,
        contactPerson: row.contactPerson,
        phoneNo: parseInt(row.contactPhoneNo),
        gstIn: row.gstIn,
        state: row.state,
        stateCode: row.stateCode,
        stateNo: parseInt(row.stateNo)
      }));

      const customerSalesPersonVO = partySalesPersonTagging.map((row) => ({
        effectiveFrom: row.effectiveFrom ? dayjs(row.effectiveFrom).format('YYYY-MM-DD') : null,
        effectiveTill: row.effectiveTill ? dayjs(row.effectiveTill).format('YYYY-MM-DD') : null,
        empCode: row.empCode,
        salesBranch: row.salesBranch,
        salesPerson: row.salesPerson
      }));

      const partyCurrencyMappingDTO = partyCurrencyMapping.map((row) => ({
        transCurrency: row.transCurrency
      }));

      const saveData = {
        ...(editId && { id: editId }),
        customerName: formData.customerName,
        customerCode: formData.customerCode,
        gstIn: formData.gstIn,
        panNo: formData.panNo,
        creditLimit: formData.creditLimit,
        creditDays: formData.creditDays,
        creditTerms: formData.creditTerms,
        taxRegistered: formData.gstRegistered,
        bussinessType: formData.bussinessType,
        bussinessCategory: formData.bussinessCate,
        accountsType: formData.accType,
        currency: formData.currency,
        active: true,
        approved: true,
        createdBy: loginUserName,
        orgId: orgId,
        customersAddressDTO: customersAddressVO,
        customersStateDTO: customersStateVO,
        customerSalesPersonDTO: customerSalesPersonVO,
        customerCurrencyMappingDTO: partyCurrencyMappingDTO
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `master/createUpdateCustomer`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Customer Updated Successfully' : 'Customer created successfully');
          handleClear();
          getAllCustomerByOrgId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Customer creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while saving the Customer');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
          {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          <ActionButton icon={UploadIcon} title="Upload" onClick={handleBulkUploadOpen} />

          {uploadOpen && (
            <CommonBulkUpload
              open={uploadOpen}
              handleClose={handleBulkUploadClose}
              title="Upload Files"
              uploadText="Upload file"
              downloadText="Sample File"
              fileName="sampleFileForCustomer.xlsx"
              onSubmit={handleSubmit}
              sampleFileDownload={SampleFile}
              handleFileUpload={handleFileUpload}
              apiUrl={`/master/customerUpload`}
              screen="PutAway"
              loginUser={loginUserName}
              orgId={orgId}
            />
          )}
          {listView ? <ActionButton icon={FaFileExcel} title="Excel Download" onClick={handleExcelFileDownload} /> : ''}
          {/* {listView ? <ActionButton icon={FaFilePdf} title="PDF Download" onClick={handlePDFDownload} /> : ''} */}
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCustomerById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <TextField
                  id="customerName"
                  fullWidth
                  name="customerName"
                  label="Customer Name"
                  size="small"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  error={fieldErrors.customerName}
                  helperText={fieldErrors.customerName}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="customerCode"
                  fullWidth
                  name="customerCode"
                  label="Customer Code"
                  size="small"
                  value={formData.customerCode}
                  onChange={handleInputChange}
                  disabled
                  // error={fieldErrors.customerCode}
                  // helperText={fieldErrors.customerCode}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="gstIn"
                  fullWidth
                  name="gstIn"
                  label="Reg No"
                  size="small"
                  value={formData.gstIn}
                  onChange={handleInputChange}
                  // error={fieldErrors.gstIn}
                  // helperText={fieldErrors.gstIn}
                  inputProps={{ maxLength: 15 }}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="panNo"
                  fullWidth
                  name="panNo"
                  label="PAN No"
                  size="small"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  // error={Boolean(fieldErrors.panNo)}
                  // helperText={fieldErrors.panNo}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="creditLimit"
                  fullWidth
                  name="creditLimit"
                  label="Credit Limit"
                  size="small"
                  type="number"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  // error={fieldErrors.creditLimit}
                  // helperText={fieldErrors.creditLimit}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="creditDays"
                  fullWidth
                  name="creditDays"
                  label="Credit Days"
                  size="small"
                  type="number"
                  value={formData.creditDays}
                  onChange={handleInputChange}
                  // error={fieldErrors.creditDays}
                  // helperText={fieldErrors.creditDays}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="creditTerms">Credit Terms</InputLabel>
                  <Select
                    labelId="creditTerms"
                    label="Credit Terms"
                    name="creditTerms"
                    value={formData.creditTerms}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PREPAID">PREPAID</MenuItem>
                    <MenuItem value="IMMEDIATE">IMMEDIATE</MenuItem>
                    <MenuItem value="CREDIT">CREDIT</MenuItem>
                  </Select>
                  {/* {fieldErrors.creditTerms && <FormHelperText>{fieldErrors.creditTerms}</FormHelperText>} */}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="gstRegistered">Tax Registered</InputLabel>
                  <Select
                    labelId="gstRegistered"
                    label="Tax Registered"
                    name="gstRegistered"
                    value={formData.gstRegistered}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {/* {fieldErrors.gstRegistered && <FormHelperText>{fieldErrors.gstRegistered}</FormHelperText>} */}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.bussinessType}>
                  <InputLabel id="bussinessType">Business Type</InputLabel>
                  <Select
                    labelId="bussinessType"
                    label="Business Type"
                    name="bussinessType"
                    value={formData.bussinessType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PROPRIETORSHIP">PROPRIETORSHIP</MenuItem>
                    <MenuItem value="PARTNERSHIP">PARTNERSHIP</MenuItem>
                    <MenuItem value="PRIVATE LIMITED">PRIVATE LIMITED</MenuItem>
                    <MenuItem value="LLP">LLP</MenuItem>
                    <MenuItem value="GOVTFIRM">GOVT FIRM</MenuItem>
                    <MenuItem value="LIMITED">LIMITED</MenuItem>
                    <MenuItem value="NGO">NGO</MenuItem>
                  </Select>
                  {fieldErrors.bussinessType && <FormHelperText>{fieldErrors.bussinessType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.bussinessCate}>
                  <InputLabel id="bussinessCate">Business Category</InputLabel>
                  <Select
                    labelId="bussinessCate"
                    label="Business Category"
                    name="bussinessCate"
                    value={formData.bussinessCate}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="MANUFACTURER">MANUFACTURER</MenuItem>
                    <MenuItem value="TRADER">TRADER</MenuItem>
                    <MenuItem value="SERVICE PROVIDER">SERVICE PROVIDER</MenuItem>
                    <MenuItem value="WORKS CONTRACTOR">WORKS CONTRACTOR</MenuItem>
                    <MenuItem value="TRANSPORTER">TRANSPORTER</MenuItem>
                    <MenuItem value="OTHERS">OTHERS</MenuItem>
                  </Select>
                  {fieldErrors.bussinessCate && <FormHelperText>{fieldErrors.bussinessCate}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="accType"
                  fullWidth
                  name="accType"
                  label="Account Type"
                  size="small"
                  disabled
                  // value={formData.accType}
                  value={formData.accType}
                  onChange={handleInputChange}
                  error={fieldErrors.accType}
                  helperText={fieldErrors.accType}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.currency}>
                  <InputLabel id="demo-simple-select-label">
                    <span>Currency</span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Currency"
                    onChange={handleInputChange}
                    name="currency"
                    value={formData.currency}
                  >
                    {/* Automatically select the single option if only one currency exists */}
                    {currencies.length === 1 ? (
                      // .filter((row) => row.currency === 'INR')
                      <MenuItem key={currencies[0].id} value={currencies[0].currency}>
                        {currencies[0].currency}
                      </MenuItem>
                    ) : (
                      currencies.map((item) => (
                        <MenuItem key={item.id} value={item.currency}>
                          {item.currency}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                </FormControl>
              </div>
            </div>

            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
                  <Tab label="Party State" />
                  <Tab label="Address" />
                  <Tab label="Sales Person Tagging" />
                  <Tab label="Currency Mapping" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {tabValue === 0 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyState} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">State</th>
                                <th className="table-header">State Code</th>
                                <th className="table-header">State No</th>
                                <th className="table-header">Reg No</th>
                                <th className="table-header">Contact Person</th>
                                <th className="table-header">Contact Phone No</th>
                                <th className="table-header">Contact Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyStateData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id,
                                          partyStateData,
                                          setPartyStateData,
                                          partyStateDataErrors,
                                          setPartyStateDataErrors
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => handleStateChange(row, index, e)}
                                      className={partyStateDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">Select State</option>
                                      {getAvailableStates(row.id).map((state) => (
                                        <option key={state.id} value={state.stateName}>
                                          {state.stateName}
                                        </option>
                                      ))}
                                    </select>
                                    {partyStateDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyStateDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateCode}
                                      style={{ width: '150px' }}
                                      maxLength={3}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateCode: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateCode: !value ? 'State Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateCode ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateCode}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.stateNo}
                                      style={{ width: '150px' }}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateNo: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateNo: !value ? 'State No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateNo}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gstIn}
                                      maxLength={15}
                                      style={{ width: '180px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gstIn: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            gstIn: !value
                                              ? 'Reg No is required'
                                              : !gstRegex.test(value)
                                                ? 'Reg No must be exactly 15 alphanumeric characters'
                                                : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.gstIn ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.gstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].gstIn}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPerson}
                                      maxLength="50"
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^[a-zA-Z\s]*$/.test(value)) {
                                          // Allows only letters and spaces
                                          setPartyStateData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, contactPerson: value } : r))
                                          );

                                          setPartyStateDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              contactPerson: !value
                                                ? 'Contact Person is required'
                                                : value.length > 50
                                                  ? 'Name should not exceed 50 characters'
                                                  : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setPartyStateDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              contactPerson: 'Only letters and spaces are allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={partyStateDataErrors[index]?.contactPerson ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPerson}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPhoneNo}
                                      maxLength="10"
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^\d*$/.test(value)) {
                                          setPartyStateData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, contactPhoneNo: value } : r))
                                          );

                                          setPartyStateDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              contactPhoneNo: !value ? 'Phone number is required' : value.length !== 10 ? '' : ''
                                            };
                                            return newErrors;
                                          });
                                        } else {
                                          setPartyStateDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              contactPhoneNo: 'Only Numbers are Allowed'
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className={partyStateDataErrors[index]?.contactPhoneNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPhoneNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPhoneNo}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.email}
                                      style={{ width: '220px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isValidEmail = emailRegex.test(value);
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, email: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            email: !value ? 'Email is required' : !isValidEmail ? 'Invalid Email Address' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.email ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.email && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].email}</div>
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
                )}
                {tabValue === 1 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyAddress} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">State</th>
                                <th className="table-header">City</th>
                                <th className="table-header">Business Place</th>
                                <th className="table-header">State Reg No</th>
                                <th className="table-header">Tax Exempted</th>
                                <th className="table-header">Address Type</th>
                                <th className="table-header">Address Line1</th>
                                <th className="table-header">Address Line2</th>
                                <th className="table-header">Address Line3</th>
                                <th className="table-header">Pin Code</th>
                                <th className="table-header">Contact Person</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyAddressData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id,
                                          partyAddressData,
                                          setPartyAddressData,
                                          partyAddressDataErrors,
                                          setPartyAddressDataErrors
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].state = e.target.value;
                                        updatedPartyAddressData[index].city = '';
                                        setPartyAddressData(updatedPartyAddressData);
                                        getAllCities(e.target.value, row.id);
                                      }}
                                      className={partyAddressDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select--</option>
                                      {stateList?.map((state) => (
                                        <option key={state.id} value={state.stateName}>
                                          {state.stateName}
                                        </option>
                                      ))}
                                    </select>

                                    {partyAddressDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.city}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].city = e.target.value;
                                        setPartyAddressData(updatedPartyAddressData);
                                      }}
                                      className={partyAddressDataErrors[index]?.city ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">--Select City--</option>
                                      {row.cityOptions?.map((city) => (
                                        <option key={city.id} value={city.cityName}>
                                          {city.cityName}
                                        </option>
                                      ))}
                                    </select>

                                    {partyAddressDataErrors[index]?.city && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].city}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.businessPlace}
                                      maxLength={15}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, businessPlace: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            businessPlace: !value ? 'Business Place In is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.businessPlace ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.businessPlace && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].businessPlace}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateGstIn}
                                      maxLength={15}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateGstIn: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], stateGstIn: !value ? 'State Gst In is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.stateGstIn ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.stateGstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].stateGstIn}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Checkbox
                                        id={`tax-${row.id}`}
                                        checked={row.sez}
                                        disabled
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          // Update the state with the new value for the specific row
                                          setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, sez: isChecked } : r)));
                                        }}
                                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' }, marginLeft: '25px' }}
                                      />
                                    </div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressType}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressType: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressType: !value ? 'Address  Type is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressType ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressType && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressType}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine1}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine1: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine1: !value ? 'Address Line1 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine1 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine1 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine1}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine2}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine2: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine2: !value ? 'Address Line2 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine2 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine2 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine2}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine3}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine3: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine3: !value ? 'Address Line3 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine3 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine3 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine3}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.pincode}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^\d{0,6}$/.test(value)) {
                                          setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, pincode: value } : r)));

                                          setPartyAddressDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              pincode: !value
                                                ? 'Pin Code is required'
                                                : value.length !== 6
                                                  ? 'Pin Code must be exactly 6 digits'
                                                  : ''
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      maxLength="6"
                                      className={partyAddressDataErrors[index]?.pincode ? 'error form-control' : 'form-control'}
                                    />
                                    {partyAddressDataErrors[index]?.pincode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].pincode}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contact}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contact: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contact: !value ? 'Contact is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.contact ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.contact && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].contact}</div>
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
                )}
                {tabValue === 2 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSalesPerson} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Sales Person</th>
                                <th className="table-header">Emp Code</th>
                                <th className="table-header">Sales Branch</th>
                                <th className="table-header">Effective From</th>
                                <th className="table-header">Effective Till</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partySalesPersonTagging.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id,
                                          partySalesPersonTagging,
                                          setPartySalesPersonTagging,
                                          partySalesPersonErrors,
                                          setPartySalesPersonErrors
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      className={partySalesPersonErrors[index]?.salesPerson ? 'error form-control' : 'form-control'}
                                      value={row.salesPerson}
                                      onChange={(e) => handleEmployeeChange(row, index, e)}
                                    >
                                      <option value="">-- Select --</option>
                                      {getAvailableEmp(row.id).map((item) => (
                                        <option key={item.employeeCode} value={item.salesPerson}>
                                          {item.salesPerson}
                                        </option>
                                      ))}
                                    </select>

                                    {partySalesPersonErrors[index]?.salesPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesPerson}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.empCode}
                                      disabled
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, empCode: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            empCode: !value ? 'Emp Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.empCode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.empCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].empCode}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      className={partySalesPersonErrors[index]?.salesBranch ? 'error form-control' : 'form-control'}
                                      value={row.salesBranch}
                                      onChange={(e) =>
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, salesBranch: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      {branchData.map((item) => (
                                        <option key={item.id} value={item.branch}>
                                          {item.branch}
                                        </option>
                                      ))}
                                    </select>
                                    {partySalesPersonErrors[index]?.salesBranch && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesBranch}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <div className="w-100">
                                      <DatePicker
                                        selected={row.effectiveFrom}
                                        // selected={
                                        //     row.effectiveFrom
                                        //         ? dayjs(row.effectiveFrom, 'YYYY-MM-DD').isValid()
                                        //             ? dayjs(row.effectiveFrom, 'YYYY-MM-DD').toDate()
                                        //             : null
                                        //         : null
                                        // }
                                        className={partySalesPersonErrors[index]?.effectiveFrom ? 'error form-control' : 'form-control'}
                                        onChange={(date) => {
                                          setPartySalesPersonTagging((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? {
                                                    ...r,
                                                    effectiveFrom: date,
                                                    effectiveTill: date > r.effectiveTill ? null : r.effectiveTill
                                                  }
                                                : r
                                            )
                                          );
                                          setPartySalesPersonErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              effectiveFrom: !date ? 'Effective From is required' : '',
                                              effectiveTill:
                                                date && row.effectiveTill && date > row.effectiveTill ? '' : newErrors[index]?.effectiveTill
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date()}
                                      />
                                      {partySalesPersonErrors[index]?.effectiveFrom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {partySalesPersonErrors[index].effectiveFrom}
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <DatePicker
                                      selected={row.effectiveTill}
                                      // selected={
                                      //     row.effectiveTill
                                      //         ? dayjs(row.effectiveTill, 'YYYY-MM-DD').isValid()
                                      //             ? dayjs(row.effectiveTill, 'YYYY-MM-DD').toDate()
                                      //             : null
                                      //         : null
                                      // }
                                      className={partySalesPersonErrors[index]?.effectiveTill ? 'error form-control' : 'form-control'}
                                      onChange={(date) => {
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, effectiveTill: date } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            effectiveTill: !date ? 'Effective Till is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      dateFormat="dd-MM-yyyy"
                                      minDate={row.effectiveFrom || new Date()}
                                      disabled={!row.effectiveFrom}
                                    />
                                    {partySalesPersonErrors[index]?.effectiveTill && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partySalesPersonErrors[index].effectiveTill}
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
                )}
                {tabValue === 3 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowCurrencyMapping} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Transaction Currency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyCurrencyMapping.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() =>
                                        handleDeleteRow(
                                          row.id,
                                          partyCurrencyMapping,
                                          setPartyCurrencyMapping,
                                          partyCurrencyMappingErrors,
                                          setPartyCurrencyMappingErrors
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      className={partyCurrencyMappingErrors[index]?.transCurrency ? 'error form-control' : 'form-control'}
                                      value={row.transCurrency}
                                      onChange={(e) => handleCurrencyChange(row, index, e)}
                                    >
                                      <option value="">-- Select --</option>
                                      {getAvailableCurrencies(row.id).map((item) => (
                                        <option key={item.id} value={item.currency}>
                                          {item.currency}
                                        </option>
                                      ))}
                                    </select>
                                    {partyCurrencyMappingErrors[index]?.transCurrency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyCurrencyMappingErrors[index].transCurrency}
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
                )}
              </Box>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Customer;
