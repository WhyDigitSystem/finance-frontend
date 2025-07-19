import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, InputLabel, Autocomplete } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { FormHelperText } from '@mui/material';
import POpdf from './POpdf';
const PurchaseOrder = () => {
  const [pdfData, setPdfData] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const orgId = localStorage.getItem('orgId');
  const createdBy = localStorage.getItem('userName');
  const finYear = localStorage.getItem('finYear');
  const modifiedBy = createdBy;
  const [value, setValue] = useState(0);
  const [listViewData, setListViewData] = useState([]);
  const [vendorList, setVendorlist] = useState([]);
  const [listView, setListView] = useState(true);
  const [formData, setFormData] = useState({
    poNo: '',
    poDate: dayjs(),
    vendorName: '',
    billAddress: '',
    deliveryAddress: '',
    companyAddress: `SCM AI PACKS PVT LTD
8 B KHATHA NO. 175/3, FIRST FLOOR, 3RD MAIN ROAD, 3RD CROSS, HOYSALA NAGAR, RAMAMURTHI NAGAR
BANGALORE - 560016
CIN: U82920KA2023PTC181536`,
    totalAmount: 0
  });
  const [formDataErrors, setFormDataErrors] = useState({});
  const [editId, setEditId] = useState(null);

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: '',
      quantity: 0,
      rate: 0,
      tax: 0,
      taxAmount: 0,
      amount: 0,
      baseAmount: 0
    }
  ]);
  const [tableDataErrors, setTableDataErrors] = useState([{}]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDate = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const inputValue = value.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue
    }));

    setFormDataErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // const handleDeleteRow = (id) => {
  //   const updatedData = tableData.filter((row) => row.id !== id);
  //   setTableData(updatedData);
  // };
  const handleDeleteRow = (id) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      item: '',
      quantity: 0,
      rate: 0,
      tax: 0,
      taxAmount: 0,
      amount: 0
    };
    setTableData((prev) => [...prev, newRow]);
  };
  const handleClear = () => {
    setFormData({
      poNo: '',
      poDate: dayjs(),
      vendorName: '',
      billAddress: '',
      deliveryAddress: '',
      totalAmount: 0,
      comapnayAddress: ''
    });

    setFormDataErrors({});
    setTableData([
      {
        id: Date.now(),
        item: '',
        quantity: 0,
        rate: 0,
        tax: 0,
        taxAmount: 0,
        amount: 0,
        baseAmount: 0
      }
    ]);
    setTableDataErrors([{}]);
  };

  const vendorName = async () => {
    try {
      const res = await apiCalls('get', `/master/getVedorsAddressDetails?orgId=${orgId}`);
      console.log('Fetching data for orgId:', orgId);
      setVendorlist(res.paramObjectsMap.partyMasterVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    vendorName();
    getAllData();
  }, []);

  useEffect(() => {
    const selectedVendor = vendorList.find((vendor) => vendor.partyName === formData.vendorName);

    const address = selectedVendor?.FullAddress || '';

    setFormData((prev) => ({
      ...prev,
      billAddress: address
    }));
  }, [formData.vendorName, vendorList]);

  const calculateRowTotal = (row) => {
    const qty = parseInt(row.quantity) || 0;
    const rate = parseInt(row.rate) || 0;
    const tax = parseFloat(row.tax) || 0;

    const baseAmount = qty * rate;
    const taxAmount = (baseAmount * tax) / 100;
    const amount = baseAmount + taxAmount;

    return { ...row, baseAmount, taxAmount, amount };
  };

  const handleQuantityChange = (id, value) => {
    setTableData((prev) => prev.map((row) => (row.id === id ? calculateRowTotal({ ...row, quantity: value }) : row)));
  };

  const handleRateChange = (id, value) => {
    setTableData((prev) => prev.map((row) => (row.id === id ? calculateRowTotal({ ...row, rate: value }) : row)));
  };

  const handleTaxChange = (id, value) => {
    setTableData((prev) => prev.map((row) => (row.id === id ? calculateRowTotal({ ...row, tax: value }) : row)));
  };
  // useEffect(() => {
  //   calculateTotals();
  // }, [tableData]);

  const handleListView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'poNumber', header: 'Po No', size: 140 },
    { accessorKey: 'poDate', header: 'Po Date', size: 140 },
    { accessorKey: 'vendorName', header: 'Vendor Name', size: 140 }
  ];

  const validForm = () => {
    let error = {};
    const tableErrors = [];
    if (!formData.poNo) {
      error.poNo = 'Po No is required';
    }
    if (!formData.vendorName) {
      error.vendorName = 'Vendor Name is required';
    }
    if (!formData.deliveryAddress) {
      error.deliveryAddress = 'Delivery Address is required';
    }

    tableData.forEach((row, index) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'Item is required';
      }

      tableErrors[index] = rowErrors;
    });
    const hasTableErrors = tableErrors.some((row) => Object.keys(row).length > 0);

    setFormDataErrors(error);
    setTableDataErrors(tableErrors);

    return Object.keys(error).length === 0 && !hasTableErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validForm()) {
      showToast('error', 'Please fill in all required fields');
      return;
    }
    const detailsVo = tableData.map((row) => ({
      ...(editId && { id: row.id }),
      description: row.item,
      quantity: parseInt(row.quantity),
      rate: parseInt(row.rate),
      tax: parseInt(row.tax),
      // taxAmount: parseInt(row.taxAmount),
      amount: parseInt(row.amount),
      baseAmount: parseInt(row.baseAmount)
    }));
    const sendData = {
      ...(editId && { id: editId }),
      createdBy: createdBy,
      modifiedBy: modifiedBy,
      orgId: orgId,
      poNumber: formData.poNo,
      poDate: formData.poDate,
      vendorName: formData.vendorName,
      vendorAddress: formData.billAddress,
      deliveryAddress: formData.deliveryAddress,
      comapnayAddress: formData.companyAddress,
      subTotal: parseInt(formData.totalAmount),
      finYear: finYear,
      items: detailsVo
    };
    try {
      const result = await apiCalls('put', '/reportController/createUpdateInvoice', sendData);
      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        handleClear();
        getAllData();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Creation failed');
      }
    } catch (error) {
      showToast('error', 'API call failed');
    }
  };

  const getAllData = async () => {
    try {
      const res = await apiCalls('get', `/reportController/getAllInvoiceByOrgId?orgId=${orgId}`);
      setListViewData(res.paramObjectsMap.invoiceVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const rowEditgetbyid = async (row) => {
    setEditId(row.original.id);
    setFormDataErrors({});
    setTableDataErrors([]);
    setListView(true);
    try {
      const results = await apiCalls('get', `/reportController/getInvoiceById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const item = results.paramObjectsMap.invoiceVO;
        setFormData({
          createdBy: createdBy,
          modifiedBy: createdBy,
          orgId: orgId,
          poNo: item.poNumber,
          poDate: dayjs(item.poDate),
          vendorName: item.vendorName,
          billAddress: item.vendorAddress,
          deliveryAddress: item.deliveryAddress,
          comapnayAddress: item.companyAddress,
          totalAmount: item.subTotal,
          finYear: item.finYear
        });
        setTableData(
          item.productLines.map((data) => ({
            id: data.id,
            item: data.description,
            quantity: data.quantity,
            rate: data.rate,
            tax: data.tax,
            taxAmount: data.taxValue,
            amount: data.amount,
            baseAmount: data.baseAmount
          }))
        );
      } else {
        console.warn('Error fetching product details:', results.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  const generatePdf = async (row) => {
    try {
      const results = await apiCalls('get', `/reportController/getInvoiceById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const POData = results.paramObjectsMap.invoiceVO;
        setPdfData(POData);
        setDownloadPdf(true);
      } else {
        console.warn('Error fetching product details:', results.paramObjectsMap?.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-2 " style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleListView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>
        </div>

        <>
          {listView && (
            <>
              <div className="row d-flex">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="poNo"
                      label="Po No"
                      size="small"
                      name="poNo"
                      value={formData.poNo}
                      onChange={handleInputChange}
                      error={!!formDataErrors.poNo}
                      helperText={formDataErrors.poNo}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Po Date"
                        format="DD-MM-YYYY"
                        value={formData.poDate}
                        onChange={(newValue) => handleDate('poDate', newValue)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="outlined" size="small" error={!!formDataErrors.vendorName}>
                    <InputLabel htmlFor="type">Vendor Name</InputLabel>
                    <Select
                      labelId="name-label"
                      id="name"
                      label="Vendor Name"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                    >
                      {vendorList.map((name) => (
                        <MenuItem key={name.partyName} value={name.partyName}>
                          {name.partyName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formDataErrors.vendorName && <FormHelperText>{formDataErrors.vendorName}</FormHelperText>}
                  </FormControl>
                </div> */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth size="small" error={!!formDataErrors.vendorName}>
                    <Autocomplete
                      size="small"
                      options={vendorList || []}
                      getOptionLabel={(option) => option?.partyName || ''}
                      value={vendorList.find((v) => v.partyName === formData.vendorName) || null}
                      onChange={(event, newValue) => {
                        const value = newValue ? newValue.partyName : '';
                        setFormData((prev) => ({
                          ...prev,
                          vendorName: value
                        }));
                        setFormDataErrors((prevErrors) => ({
                          ...prevErrors,
                          vendorName: ''
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
                          name="vendorName"
                          error={!!formDataErrors.vendorName}
                          helperText={formDataErrors.vendorName}
                        />
                      )}
                    />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="billAddress"
                      label="Bill Address"
                      size="small"
                      name="billAddress"
                      value={formData.billAddress.toLocaleUpperCase()}
                      onChange={handleInputChange}
                      error={!!formDataErrors.billAddress}
                      helperText={formDataErrors.billAddress}
                      multiline
                      rows={2}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="deliveryAddress"
                      label="Delivery Address"
                      size="small"
                      name="deliveryAddress"
                      onChange={handleInputChange}
                      value={formData.deliveryAddress}
                      error={!!formDataErrors.deliveryAddress}
                      helperText={formDataErrors.deliveryAddress}
                      multiline
                      rows={2}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="row mt-2">
                {/* <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Details" />
                  </Tabs>
                </Box> */}
                <Box sx={{ padding: 2 }}>
                  {/* {value === 0 && ( */}
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
                                  <th className="table-header" style={{ width: '5%' }}>
                                    Action
                                  </th>
                                  <th className="table-header" style={{ width: '5%' }}>
                                    S.No
                                  </th>
                                  <th className="table-header" style={{ width: '40%' }}>
                                    Item
                                  </th>
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Qty
                                  </th>
                                  <th className="table-header" style={{ width: '75px' }}>
                                    Rate
                                  </th>
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Tax %
                                  </th>
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Tax Amount
                                  </th>
                                  <th className="table-header" style={{ width: '75px' }}>
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData &&
                                  tableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={
                                            () => handleDeleteRow(row.id)
                                            // handleDeleteRow(row.id, tableData, setTableData, tableDataErrors, setTableDataErrors)
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            size="small"
                                            type="text"
                                            value={row.item}
                                            name="item"
                                            error={!!tableDataErrors[index]?.item}
                                            helperText={tableDataErrors[index]?.item}
                                            onChange={(e) => {
                                              const value = e.target.value.toUpperCase();
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, item: value } : rowData))
                                              );

                                              setTableDataErrors((prev) => {
                                                const newErrors = Array.isArray(prev) ? [...prev] : [];
                                                if (newErrors[index]) {
                                                  newErrors[index] = { ...newErrors[index], item: '' };
                                                } else {
                                                  newErrors[index] = { item: '' };
                                                }
                                                return newErrors;
                                              });
                                              //
                                            }}
                                          />
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            size="small"
                                            type="text"
                                            value={row.quantity ? `${parseInt(row.quantity)}` : 0}
                                            onChange={(e) => handleQuantityChange(row.id, e.target.value)}
                                            name="quantity"
                                          />
                                        </FormControl>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            size="small"
                                            type="text"
                                            value={row.rate ? `${parseInt(row.rate)}` : 0}
                                            name="rate"
                                            onChange={(e) => handleRateChange(row.id, e.target.value)}
                                          />
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            size="small"
                                            type="text"
                                            value={row.tax ? `${parseInt(row.tax)}` : 0}
                                            name="tax"
                                            onChange={(e) => handleTaxChange(row.id, e.target.value)}
                                          />
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            size="small"
                                            type="text"
                                            value={row.taxAmount ? `${parseInt(row.taxAmount)}` : 0}
                                            name="taxAmount"
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, taxAmount: value } : rowData))
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <FormControl fullWidth variant="filled">
                                          <TextField
                                            type="text"
                                            size="small"
                                            value={row.amount ? `${parseInt(row.amount)}` : 0}
                                            name="amount"
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, amount: value } : rowData))
                                              );
                                            }}
                                          />
                                        </FormControl>
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
                  {/* )} */}
                </Box>
              </div>
            </>
          )}
        </>
        {!listView && (
          <CommonListViewTable
            data={listViewData}
            columns={listViewColumns}
            blockEdit={true}
            toEdit={rowEditgetbyid}
            isPdf={true}
            GeneratePdf={generatePdf}
          />
        )}
        {downloadPdf && <POpdf row={pdfData} modalClose={() => setDownloadPdf(false)} />}
      </div>
    </>
  );
};

export default PurchaseOrder;
