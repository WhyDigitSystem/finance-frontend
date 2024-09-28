import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { showToast } from 'utils/toast-component';
import { getAllActiveCurrency } from 'utils/CommonFunctions';

const DailyRate = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    date: '',
    month: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    date: '',
    month: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [detailsTableData, setDetailsTableData] = useState([
    // {
    //   id: 1,
    //   currency: '',
    //   currencyDescripition: '',
    //   sellingExrate: '',
    //   buyingExrate: ''
    // }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    // {
    //   currency: '',
    //   currencyDescripition: '',
    //   sellingExrate: '',
    //   buyingExrate: ''
    // }
  ]);
  const columns = [
    { accessorKey: 'date', header: 'Date', size: 140 },
    { accessorKey: 'month', header: 'Month', size: 140 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);
        console.log('currencyData', currencyData);

        const updatedTableData = currencyData.map((currency, index) => ({
          id: index + 1,
          currency: currency.currency,
          currencyDescripition: currency.currencySymbol,
          sellingExRate: currency.sellingExrate,
          buyingExrate: currency.buyingExrate
        }));

        setDetailsTableData(updatedTableData);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };

    fetchData();
    getAllDailyMonthlyExRatesByOrgId();
  }, []);

  const getAllDailyMonthlyExRatesByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllDailyMonthlyExRatesByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.dailyMonthlyExRatesVO || []);
      // showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;
    const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
    const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'customer':
      case 'shortName':
      case 'contactPerson':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });

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

  // const handleKeyDown = (e, row, table) => {
  //   if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
  //     e.preventDefault();
  //     if (isLastRowEmpty(table)) {
  //       displayRowError(table);
  //     } else {
  //       handleAddRow();
  //     }
  //   }
  // };

  // const handleAddRow = () => {
  //   if (isLastRowEmpty(detailsTableData)) {
  //     displayRowError(detailsTableData);
  //     return;
  //   }
  //   const newRow = {
  //     id: Date.now(),
  //     currency: '',
  //     currencyDescripition: '',
  //     sellingExRate: '',
  //     buyingExrate: ''
  //   };
  //   setDetailsTableData([...detailsTableData, newRow]);
  //   setDetailsTableErrors([...detailsTableErrors, { currency: '', currencyDescripition: '', sellingExRate: '', buyingExrate: '' }]);
  // };
  // const isLastRowEmpty = (table) => {
  //   const lastRow = table[table.length - 1];
  //   if (!lastRow) return false;

  //   if (table === detailsTableData) {
  //     return !lastRow.currency || !lastRow.currencyDescripition || !lastRow.sellingExRate || !lastRow.buyingExrate;
  //   }
  //   return false;
  // };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          currency: !table[table.length - 1].currency ? 'Currency is required' : '',
          currencyDescripition: !table[table.length - 1].currencyDescripition ? 'Currency Desc is required' : '',
          sellingExRate: !table[table.length - 1].sellingExRate ? 'Selling Exrate is required' : '',
          buyingExrate: !table[table.length - 1].buyingExrate ? 'Buying Exrate is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleDateChange = (name, value) => {
    const formattedDate = value ? dayjs(value).format('YYYY-MM-DD') : null;

    setFormData({ ...formData, [name]: formattedDate });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  // const handleCurrencyChange = (row, index, event) => {
  //   const value = event.target.value;
  //   const selectedCurrency = currencies.find((currency) => currency.currency === value);
  //   setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r)));
  //   setDetailsTableErrors((prev) => {
  //     const newErrors = [...prev];
  //     newErrors[index] = {
  //       ...newErrors[index],
  //       currency: !value ? 'Currency is required' : ''
  //     };
  //     return newErrors;
  //   });
  // };

  const handleList = () => {
    setShowForm(!showForm);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClear = () => {
    setFormData({
      date: '',
      month: ''
    });
    setFieldErrors({});
    setDetailsTableData([
      {
        id: 1,
        currency: '',
        currencyDescripition: '',
        sellingExrate: '',
        buyingExrate: ''
      }
    ]);
    setDetailsTableErrors('');
  };

  const getAllDailyMonthlyExRatesById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAllDailyMonthlyExRatesById?id=${row.original.id}`);

      if (result) {
        const dailyRateVO = result.paramObjectsMap.dailyMonthlyExRatesVO[0];
        setEditId(row.original.id);

        setFormData({
          date: dailyRateVO.date || '',
          month: dailyRateVO.month || '',
          active: dailyRateVO.active || false,
          id: dailyRateVO.id || 0
        });
        setDetailsTableData(
          dailyRateVO.dailyMonthlyExRatesDtlVO.map((cl) => ({
            id: cl.id,
            currency: cl.currency,
            currencyDescripition: cl.currencyDescripition,
            sellingExRate: cl.sellingExRate,
            buyingExrate: cl.buyingExrate
          }))
        );

        console.log('DataToEdit', dailyRateVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.month) errors.month = 'Month is required';

    let detailsTableDataValid = true;
    if (!detailsTableData || !Array.isArray(detailsTableData) || detailsTableData.length === 0) {
      detailsTableDataValid = false;
      setDetailsTableErrors([{ general: 'Detail Table Data is required' }]);
    } else {
      const newTableErrors = detailsTableData.map((row, index) => {
        const rowErrors = {};
        if (!row.currency) {
          rowErrors.currency = 'Currency is required';
          detailsTableDataValid = false;
        }
        if (!row.currencyDescripition) {
          rowErrors.currencyDescripition = 'Currency Descripition is required';
          detailsTableDataValid = false;
        }
        if (!row.sellingExrate) {
          rowErrors.sellingExrate = 'Selling Exrate is required';
          detailsTableDataValid = false;
        }
        if (!row.buyingExrate) {
          rowErrors.buyingExrate = 'Buying Exrate is required';
          detailsTableDataValid = false;
        }

        return rowErrors;
      });
      setDetailsTableErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && detailsTableDataValid) {
      setIsLoading(true);

      const detailsVo = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        currency: row.currency,
        currencyDescripition: row.currencyDescripition,
        sellingExRate: row.sellingExrate,
        buyingExrate: row.buyingExrate
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        date: formData.date,
        month: formData.month,
        dailyMonthlyExRatesDtlDTO: detailsVo,
        createdBy: loginUserName,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', 'transaction/updateCreateDailyMonthlyExRates', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast(
            'success',
            editId ? 'Daily / Monthly Ex. Rates updated successfully' : 'Daily / Monthly Ex. Rates created successfully'
          );
          getAllDailyMonthlyExRatesByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Daily / Monthly Ex. Rates creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Daily / Monthly Ex. Rates creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('date', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                  {fieldErrors.date && <p className="dateErrMsg">Date is required</p>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Month"
                      openTo="month"
                      views={['year', 'month']}
                      value={formData.month ? dayjs(formData.month, 'YYYY-MM-DD') : null}
                      onChange={(newValue) => handleDateChange('month', newValue)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                    />
                  </LocalizationProvider>
                  {fieldErrors.month && <p className="dateErrMsg">Month is required</p>}
                </FormControl>
              </div>
            </div>
            {/* <TableComponent formData={formData} setFormData={setFormData} /> */}
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
                      {/* <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div> */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Currency
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Currency Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '120px' }}>
                                    Selling Ex. Rate
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '120px' }}>
                                    Buying Ex. Rate
                                  </th>
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
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.currency}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, currency: value } : r)));
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              currency: !value ? 'Currency is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.currency ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.currency && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].currency}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.currencyDescripition}
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, currencyDescripition: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              currencyDescripition: !value ? 'Currency Desc is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.currencyDescripition ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.currencyDescripition && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].currencyDescripition}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.sellingExrate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sellingExrate: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sellingExrate: !value ? 'Selling Ex. Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.sellingExrate ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.sellingExrate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].sellingExrate}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.buyingExrate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, buyingExrate: value } : r))
                                          );
                                          setDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              buyingExrate: !value ? 'Buying Ex. Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors[index]?.buyingExrate ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors[index]?.buyingExrate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors[index].buyingExrate}
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
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getAllDailyMonthlyExRatesById} />
        )}
      </div>
    </div>
  );
};

export default DailyRate;
