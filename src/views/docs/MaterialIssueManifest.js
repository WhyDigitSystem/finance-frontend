import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

export const MaterialIssueManifest = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [allReceiver, setAllReceiver] = useState([]);
  const [allWarehouse, setAllWarehouse] = useState([]);
  const [allKitId, setAllKitId] = useState([]);
  const [allHsnSacCode, setAllHsnSacCode] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editId, setEditId] = useState('');
  const [data, setData] = useState(true);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    orgId: orgId,
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: '',
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: '',
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
  });
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '',
    }
  ]);

  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '',
    }
  ]);

  const listViewColumns = [
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'exchangeRate', header: 'Ex.Rate', size: 140 },
    { accessorKey: 'chequeNo', header: 'Ref No', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 }
  ];
  useEffect(() => {
    getAllServiceAccountCode();
    getAllCustomerDetails();
  }, []);

  const handleClear = () => {
    setFormData({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: 0,
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
    });
    getAllActiveCurrency(orgId);
    setFieldErrors({
    transactionNo: '',
    transactionDate: dayjs(),
    dispatchDate: dayjs(),
    transactionType: '',
    fromWarehouse: '',
    warehouseAddress: '',
    customer: '',
    customerAddress: '',
    receiverRegIn: '',
    // sender: sender,
    amount: 0,
    amountInWords: '',
    transporterName: '',
    vehicleNo: '',
    driverNo: '',
    });
    setDetailsTableData([{ 
      id: 1,      
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '', 
    }]);
    setDetailsTableErrors('');
    setEditId('');
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    // if (isLastRowEmpty(detailsTableData)) {
    //   displayRowError(detailsTableData);
    //   return;
    // }
    const newRow = {
      id: Date.now(),
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: '',
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, {       
      kitNo: '',
      kitName: '',
      kitQty: '',
      hsnsacCode: '',
      productCode: '',
      productName: '',
      productQty: ''
    }]);
  };

  // const isLastRowEmpty = (table) => {
  //   const lastRow = table[table.length - 1];
  //   if (!lastRow) return false;

  //   if (table === detailsTableData) {
  //     return !lastRow.accountName || !lastRow.narration;
  //     // !lastRow.credit || !lastRow.debit ||
  //   }
  //   return false;
  // };

  // const displayRowError = (table) => {
  //   if (table === detailsTableData) {
  //     setDetailsTableErrors((prevErrors) => {
  //       const newErrors = [...prevErrors];
  //       newErrors[table.length - 1] = {
  //         ...newErrors[table.length - 1],
  //         accountName: !table[table.length - 1].accountName ? 'Account Name is required' : '',
  //         // credit: !table[table.length - 1].credit ? 'Credit is required' : '',
  //         // debit: !table[table.length - 1].debit ? 'Debit is required' : '',
  //         narration: !table[table.length - 1].narration ? 'Narration is required' : ''
  //       };
  //       return newErrors;
  //     });
  //   }
  // };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
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
  const getAllServiceAccountCode = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllActiveSacCodeByOrgId?orgId=${orgId}`);
      setAllHsnSacCode(result.paramObjectsMap.hSNSacCodeVO || []);
      console.log('Test sac', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllCustomerDetails = async () => {
    try {
      const response = await apiCalls('get', `/master/getAllCustomers?orgId=${orgId}`);
      setAllReceiver(response.paramObjectsMap.masterVOs);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getAllManifestByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllBankingDepositByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.bankingDepositVO.reverse() || []);
      console.log('bankingDepositVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllDepositById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getBankingDepositById?id=${row.original.id}`);

      if (result) {
        const DepVO = result.paramObjectsMap.bankingDepositVO[0];
        setEditId(row.original.id);
        setFormData({
          depositMode: DepVO.depositMode,
          // id: DepVO.id,
          docDate: DepVO.docDate ? dayjs(DepVO.docDate, 'YYYY-MM-DD') : dayjs(),
          // docId: DepVO.docId,
          receivedFrom: DepVO.receivedFrom,
          chequeNo: DepVO.chequeNo,
          chequeDate: DepVO.chequeDate ? dayjs(DepVO.chequeDate, 'YYYY-MM-DD') : dayjs(),
          chequeBank: DepVO.chequeBank,
          bankName: DepVO.bankAccount,
          currency: DepVO.currency,
          exRate: DepVO.exchangeRate,
          depositAmount: DepVO.depositAmount,
          totalAmount: DepVO.totalAmount,
          remarks: DepVO.remarks,
          orgId: DepVO.orgId,
          totalDebitAmount: DepVO.totalDebitAmount,
          totalCreditAmount: DepVO.totalCreditAmount
          // active: DepVO.active || false,
        });
        setDetailsTableData(
          DepVO.depositparticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            debit: row.debit,
            credit: row.credit,
            narration: row.narration
          }))
        );

        console.log('DataToEdit', DepVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    // if (!formData.chequeNo) {
    //   errors.chequeNo = 'Cheque No is required';
    // }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      // if (!row.accountName) {
      //   rowErrors.accountName = 'Account Name is required';
      //   detailTableDataValid = false;
      // }
      return rowErrors;
    });
    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);
    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const materialIssueVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        kitNo: row.kitNo,
        kitName: row.kitName,
        kitQty: row.kitQty,
        hsnsacCode: row.hsnsacCode,
        productCode: row.productCode,
        productName: row.productName,
        productQty: row.productQty,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        // active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        depositParticularsDTO: materialIssueVO,
        transactionNo: formData.transactionNo,
        transactionDate: dayjs(formData.transactionDate).format('YYYY-MM-DD'),
        dispatchDate: dayjs(formData.dispatchDate).format('YYYY-MM-DD'),
        transactionType: formData.transactionType,
        fromWarehouse: formData.fromWarehouse,
        warehouseAddress: formData.warehouseAddress,
        customer: formData.customer,
        customerAddress: formData.customerAddress,
        receiverRegIn: formData.receiverRegIn,
        sender: companyName,
        amount: parseInt(formData.amount),
        amountInWords: formData.amountInWords,
        transporterName: formData.transporterName,
        vehicleNo: formData.vehicleNo,
        driverNo: formData.driverNo,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateBankingDeposit`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Material Issue Manifest Updated Successfully' : 'Material Issue Manifest Created successfully');
          getAllManifestByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Material Issue Manifest creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Material Issue Manifest creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onBeforeGetContent: async () => {
  //     // Ensure watermark is rendered before capturing content
  //     await new Promise(resolve => setTimeout(resolve, 50));
  //     return true;
  //   },
  //   onAfterPrint: () => {
  //     // Reset watermark after printing (optional)
  //     setWatermark('');
  //   }
  // });

  // const handleDownloadPdf = async (watermarkText) => {
  //   setWatermark(watermarkText);
  //   await new Promise(resolve => setTimeout(resolve, 50));

  //   const element = componentRef.current;
  //   const canvas = await html2canvas(element);
  //   const data = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF();
  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //   pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`MaterialIssueManifest_${pdfData.transactionNo}_${watermarkText.replace(' ', '_')}.pdf`);

  //   setWatermark('');
  // };

  // const handlePrintWithWatermark = async (watermarkText) => {
  //   setWatermark(watermarkText);
  //   // Wait for React to render the updated watermark
  //   await new Promise(resolve => setTimeout(resolve, 50));
  //   handlePrint(); // Trigger print
  // };

  // const handleDownloadClick = (row) => {
  //   getAllIssueManifestProviderById(row.original.id);
  //   setOpenDialog(true);
  // };
  // const handleEditRow = (row) => {
  //   getAllIssueManifestProviderById(row.original.id);
  //   setSelectedRowId(row.original.id);
  //   setEditMim(true);
  // };
  // const transformProductDetails = (details) => {
  //   const groupedDetails = details.reduce((acc, detail) => {
  //     const existingKit = acc.find((kit) => kit.kitId === detail.kitId);
  //     const asset = {
  //       assetCode: detail.assetCode,
  //       assetName: detail.asset,
  //       assetQty: detail.assetQty
  //     };

  //     if (existingKit) {
  //       existingKit.assets.push(asset);
  //     } else {
  //       acc.push({
  //         kitId: detail.kitId,
  //         kitName: detail.kitName,
  //         kitQty: detail.kitQty,
  //         hsnCode: detail.hsnCode,
  //         assets: [asset]
  //       });
  //     }

  //     return acc;
  //   }, []);

  //   return groupedDetails;
  // };

  // const getAllIssueManifestProviderById = async (selectedRowId) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reportController/getAllIssueManifestProviderById?id=${selectedRowId}`);
  //     if (response.status === 200) {
  //       const mimData = response.data.paramObjectsMap.IssueManifestProviderVO;
  //       setPdfData(mimData);
  //       const transformedDetails = transformProductDetails(mimData.issueManifestProviderDetailsVOs);
  //       setProductDetails(transformedDetails);
  //       const concatenatedData = {
  //         TransactionNo: mimData.transactionNo,
  //         TransactionDate: mimData.transactionDate,
  //         DispatchDate: mimData.dispatchDate,
  //         Receiver: mimData.receiver
  //       };

  //       const formattedData = `
  //         TransactionNo: ${concatenatedData.TransactionNo},
  //         TransactionDate: ${concatenatedData.TransactionDate},
  //         DispatchDate: ${concatenatedData.DispatchDate},
  //         Receiver: ${concatenatedData.Receiver}
  //      `;

  //       setQrCodeValue(formattedData);
  //       console.log('THE QRCODE DATA IS:', formattedData);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // const handleBack = () => {
  //   setAddMim(false);
  //   setEditMim(false);
  //   getAllIssueManifestProvider();
  // };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField id="transactionNo" label="Transaction No" variant="outlined" size="small" fullWidth name="transactionNo" value={formData.transactionNo} />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Transaction Date"
                        value={formData.transactionDate}
                        onChange={(date) => handleDateChange('transactionDate', date)}
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
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Dispatch Date"
                        value={formData.dispatchDate}
                        onChange={(date) => handleDateChange('dispatchDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="transactionType"
                    label="Transaction Type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.transactionType ? fieldErrors.transactionType : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.transactionType}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={allWarehouse}
                    getOptionLabel={(option) => option?.warehouseName || ''}
                    // sx={{ width: '100%' }}
                    size="small"
                    value={formData.warehouseName ? allWarehouse.find((c) => c.warehouseName === formData.warehouseName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'warehouseName',
                          value: newValue ? newValue.warehouseName : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                    label="Warehouse Name"
                        name="warehouseName"
                        error={!!fieldErrors.warehouseName}
                        helperText={fieldErrors.warehouseName ? fieldErrors.warehouseName : ''}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="warehouseAddress"
                    label="WareHouse Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="warehouseAddress"
                    value={formData.warehouseAddress}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.warehouseddress ? fieldErrors.warehouseddress : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.warehouseAddress}
                  />
                </div>
                {/* <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={allReceiver}
                    getOptionLabel={(option) => option?.customer || ''}
                    // sx={{ width: '100%' }}
                    size="small"
                    value={formData.customer ? allReceiver.find((c) => c.customer === formData.customer) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customer',
                          value: newValue ? newValue.customer : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                    label="Receiver"
                        name="customer"
                        error={!!fieldErrors.customer}
                        helperText={fieldErrors.customer ? fieldErrors.customer : ''}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div> */}
                <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={allReceiver.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyShortName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.customer ? allReceiver.find((c) => c.partyShortName === formData.customer) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'customer', value: newValue ? newValue.partyShortName : ''
                      }
                    });
                    const address = newValue?.partyAddressVO?.[0];
                    const fullAddress = address
                      ? [address.addressLine1, address.addressLine2, address.addressLine3]
                        .filter(Boolean)
                        .join(', ')
                      : '';
                    handleInputChange({
                      target: {
                        name: 'customerAddress',
                        value: fullAddress
                      }
                    });
                    handleInputChange({
                      target: {
                        name: 'receiverRegIn',
                        value: newValue ? newValue.gstIn : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="customer"
                      label= "Receiver"
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerAddress"
                    label="Receiver Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerAddress ? fieldErrors.customerAddress : ''}</span>}
                    disabled
                    multiline
                    error={!!fieldErrors.customerAddress}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="receiverRegIn"
                    label="Receiver Reg In"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="receiverRegIn"
                    value={formData.receiverRegIn}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.receiverRegIn ? fieldErrors.receiverRegIn : ''}</span>}
                    inputProps={{ maxLength: 15 }}
                    error={!!fieldErrors.receiverRegIn}
                    disabled
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="sender"
                    label="Sender"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="sender"
                    disabled
                    value={companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="amount"
                    type='number'
                    label="Amount"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.amount ? fieldErrors.amount : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.amount}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="amountInWords"
                    label="Amount In Words"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="amountInWords"
                    value={formData.amountInWords}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="transporterName"
                    label="Transporter Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="transporterName"
                    value={formData.transporterName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.transporterName ? fieldErrors.transporterName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.transporterName}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="vehicleNo"
                    label= "Vehicle No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.vehicleNo ? fieldErrors.vehicleNo : ''}</span>}
                    // inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.vehicleNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="driverNo"
                    label= "Driver No"
                    type='number'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="driverNo"
                    value={formData.driverNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.driverNo ? fieldErrors.driverNo : ''}</span>}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.driverNo}
                  />
                </div>
              </div>
              <>
                <div className="row mt-2">
                  <Box sx={{ width: '100%' }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value={0} label="Account Particulars" />
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
                                      <th className="table-header">S.No</th>
                                      <th className="table-header">Kit No</th>
                                      <th className="table-header">Kit Name</th>
                                      <th className="table-header">Kit Qty</th>
                                      <th className="table-header">HSN/SAC Code</th>
                                      <th className="table-header">Product Code</th>
                                      <th className="table-header">Product Name</th>
                                      <th className="table-header">Product Qty</th>
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
                                        <td>
                                          <Autocomplete
                                            options={allKitId}
                                            getOptionLabel={(option) => option.kitNo || ''}
                                            value={
                                              row.kitNo
                                                ? allKitId.find((a) => a.kitNo === row.kitNo) || null
                                                : allKitId.length === 1
                                                  ? allKitId
                                                  : null
                                            }
                                            onChange={(event, newValue) => {
                                              const value = newValue ? newValue.kitNo : '';
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, kitNo: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  kitNo: !value ? 'Kit No is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                error={!!detailsTableErrors[index]?.kitNo}
                                                helperText={detailsTableErrors[index]?.kitNo}
                                              />
                                            )}
                                            sx={{ width: 100 }}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.kitName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, kitName: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  kitName: !value ? 'Kit Name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.kitName ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.kitName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].kitName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.kitQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, kitQty: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  kitQty: !value ? 'kit Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.kitQty ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.kitQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].kitQty}
                                            </div>
                                          )}
                                        </td>
                                        <td>
                                          <Autocomplete
                                            options={allHsnSacCode}
                                            getOptionLabel={(option) => option.code || ''}
                                            value={
                                              row.hsnsacCode
                                                ? allHsnSacCode.find((a) => a.code === row.hsnsacCode) || null
                                                : allHsnSacCode.length === 1
                                                  ? allHsnSacCode
                                                  : null
                                            }
                                            onChange={(event, newValue) => {
                                              const value = newValue ? newValue.code : '';
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, hsnsacCode: value } : r))
                                              );
                                            }}
                                            size="small"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                              />
                                            )}
                                            sx={{ width: 130 }}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.productCode}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, productCode: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  productCode: !value ? 'Product Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.productCode ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.productCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].productCode}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.productName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, productName: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  productName: !value ? 'Product Name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.productName ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.productName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].productName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.productQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, productQty: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  productQty: !value ? 'Product Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.productQty ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.productQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].productQty}
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
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllDepositById} />
          )}
        </div>
      </div>
    </>
  );
};

export default MaterialIssueManifest;
