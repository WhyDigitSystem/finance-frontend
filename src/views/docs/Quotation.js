import React from 'react';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import { FormControl, TextField, InputLabel, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormHelperText } from '@mui/material';
import apiCalls from 'apicall';
import MenuItem from '@mui/material/MenuItem';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import Quotationpdf from './Quotationpdf';
import { useMemo } from 'react';

const Quotation = () => {
  const orgId = localStorage.getItem('orgId');
  const createdBy = localStorage.getItem('userName');
  const modifiedBy = createdBy;
  const [pdfData, setPdfData] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);
  // const [customerList, setCustomerList] = useState([]);
  const [listView, setListView] = useState(true);
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    quotationNo: '',
    quotationDate: dayjs(),
    customerName: '',
    billAddress: '',
    deliveryAddress: '',
    companyAddress: `SCM AI PACKS PVT LTD
    8 B KHATHA NO. 175/3, FIRST FLOOR, 3RD MAIN ROAD, 3RD CROSS, HOYSALA NAGAR, RAMAMURTHI NAGAR
    BANGALORE - 560016
    CIN: U82920KA2023PTC181536`,
    totalAmount: 0
  });
  const [formDataErrors, setFormDataErrors] = useState({});
  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: '',
      quantity: 0,
      tax: 0,
      taxAmount: 0,
      rate: 0,
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

  const handleListView = () => {
    setListView(!listView);
  };

  const handleDeleteRow = (id) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
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

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      item: '',
      quantity: 0,
      tax: 0,
      taxAmount: 0,
      rate: 0,
      amount: 0
    };
    setTableData((prev) => [...prev, newRow]);
  };

  const handleClear = () => {
    setFormData({
      quotationNo: '',
      quotationDate: dayjs(),
      customerName: '',
      billAddress: '',
      deliveryAddress: '',
      totalAmount: 0,
      comapnayAddress: ''
    });
    setFormDataErrors({});
    setTableData([{ id: Date.now(), item: '', quantity: 0, tax: 0, taxAmount: 0, rate: 0, amount: 0, baseAmount: 0, totalAmount: 0 }]);
    setTableDataErrors([{}]);
  };

  const validForm = () => {
    let error = {};
    const tableErrors = [];
    if (!formData.quotationNo) {
      error.quotationNo = 'Quotation No is required';
    }
    if (!formData.customerName) {
      error.customerName = 'Customer Name is required';
    }
    if (!formData.billAddress) {
      error.billAddress = 'Bill Address is required';
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
    const detailVO = tableData.map((row) => ({
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
      modifiedBy: createdBy,
      orgId: orgId,
      quotationNo: formData.quotationNo,
      quotationDate: formData.quotationDate,
      customerName: formData.customerName,
      customerAddress: formData.billAddress,
      deliveryAddress: formData.deliveryAddress,
      comapnayAddress: formData.companyAddress,
      subTotal: parseInt(formData.totalAmount),
      quotationDetailsDTO: detailVO
    };

    try {
      const result = await apiCalls('put', '/reportController/createUpdateQuotatio', sendData);
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
      const res = await apiCalls('get', `/reportController/getQuotationByorgId?orgId=${orgId}`);
      setListViewData(res.paramObjectsMap.quotationVO);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const rowEditgetbyid = async (row) => {
    setEditId(row.original.id);
    setFormDataErrors({});
    setTableDataErrors([{}]);
    setListView(true);
    try {
      const results = await apiCalls('get', `/reportController/getQutationById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const item = results.paramObjectsMap.quotationVO;
        setFormData({
          createdBy: createdBy,
          modifiedBy: createdBy,
          orgId: orgId,
          quotationNo: item.quotationNo,
          quotationDate: dayjs(item.quotationDate),
          customerName: item.customerName,
          billAddress: item.customerAddress,
          deliveryAddress: item.deliveryAddress,
          comapnayAddress: item.companyAddress,
          totalAmount: item.subTotal
        });
        setTableData(
          item.quotationDetailsVO.map((data) => ({
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

  useEffect(() => {
    getAllData();
  }, []);

  // const calculateTotals = () => {
  //   const updatedTableData = tableData.map((row) => {
  //     const qty = parseInt(row.quantity) || 0;
  //     const rate = parseInt(row.rate) || 0;
  //     const tax = parseFloat(row.tax) || 0;

  //     const baseAmount = qty * rate;
  //     const taxAmount = (baseAmount * tax) / 100;
  //     const amount = baseAmount + taxAmount;

  //     return {
  //       ...row,
  //       baseAmount,
  //       taxAmount,
  //       amount
  //     };
  //   });
  //   setTableData(updatedTableData);

  //   const totalAmount = updatedTableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  //   setFormData((prev) => ({
  //     ...prev,
  //     totalAmount: totalAmount
  //   }));
  // };

  // useEffect(() => {
  //   calculateTotals();
  // }, [tableData]);

  const updatedTableData = useMemo(() => {
    return tableData.map((row) => {
      const qty = parseInt(row.quantity) || 0;
      const rate = parseInt(row.rate) || 0;
      const tax = parseFloat(row.tax) || 0;

      const baseAmount = qty * rate;
      const taxAmount = (baseAmount * tax) / 100;
      const amount = baseAmount + taxAmount;

      return {
        ...row,
        baseAmount,
        taxAmount,
        amount
      };
    });
  }, [tableData]);

  // 🧠 Memoized total amount
  const totalAmount = useMemo(() => {
    return updatedTableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  }, [updatedTableData]);

  // 🧩 Apply the calculated data to state (optional side effect)
  useEffect(() => {
    setTableData(updatedTableData);
    setFormData((prev) => ({
      ...prev,
      totalAmount: totalAmount
    }));
  }, [updatedTableData, totalAmount]);

  //
  const listViewColumns = [
    { accessorKey: 'quotationNo', header: 'Quotation No', size: 140 },
    { accessorKey: 'quotationDate', header: 'Quotation Date', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 }
  ];

  const generatePdf = async (row) => {
    try {
      const results = await apiCalls('get', `/reportController/getQutationById?id=${row.original.id}`);
      console.log('Edit API Response:', results);
      if (results.status === true) {
        const Quotationpdf = results.paramObjectsMap.quotationVO;
        setPdfData(Quotationpdf);
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

        {listView && (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="quotationNo"
                    label="Quotation No"
                    size="small"
                    name="quotationNo"
                    value={formData.quotationNo}
                    onChange={handleInputChange}
                    error={!!formDataErrors.quotationNo}
                    helperText={formDataErrors.quotationNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Quotation Date"
                      format="DD-MM-YYYY"
                      value={formData.quotationDate}
                      onChange={(newValue) => handleDate('quotationDate', newValue)}
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="customerName"
                    label="Customer Name"
                    size="small"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    error={!!formDataErrors.customerName}
                    helperText={formDataErrors.customerName}
                    multiline
                    rows={2}
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
                    value={formData.billAddress}
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
              {/*  */}
            </div>
            {/*  */}
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
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Rate
                                  </th>
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Tax %
                                  </th>
                                  <th className="table-header" style={{ width: '10%' }}>
                                    Tax Amount
                                  </th>

                                  <th className="table-header" style={{ width: '10%' }}>
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              {/*  */}
                              <tbody>
                                {tableData &&
                                  tableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
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
                                              setTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, item: value } : r)));
                                              setTableDataErrors((prev) => {
                                                const newErrors = Array.isArray(prev) ? [...prev] : [];
                                                newErrors[index] = { ...newErrors[index], item: '' };
                                                return newErrors;
                                              });
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
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, quantity: value } : rowData))
                                              );
                                            }}
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
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, rate: value } : rowData))
                                              );
                                            }}
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
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setTableData((prev) =>
                                                prev.map((rowData) => (rowData.id === row.id ? { ...rowData, tax: value } : rowData))
                                              );
                                            }}
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
                                            size="small"
                                            type="text"
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
                              {/*  */}
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
        )}
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
        {downloadPdf && <Quotationpdf row={pdfData} modalClose={() => setDownloadPdf(false)} />}
      </div>
    </>
  );
};

export default Quotation;
