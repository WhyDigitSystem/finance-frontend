import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getCurrencyByOrgId } from 'utils/common-functions';
import CommonTable from 'views/basicMaster/CommonTable';

const ExRates = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const [formData, setFormData] = useState({
    docDate: null,
    docMonth: null,
    currency: '',
    sellRate: '',
    buyRate: '',
    avgRate: '',
    orgId: orgId
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your orgId or fetch it from somewhere
        const currencyData = await getCurrencyByOrgId(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getExRates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const getExRates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllExRatesByOrgId?orgId=${orgId}`);
      if (response.status === 200) {
        setData(response.data.paramObjectsMap.exRatesVO);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const visibleFields = ['docDate', 'docMonth', 'currency', 'sellRate', 'buyRate', 'avgRate'];
    const errors = {};

    visibleFields.forEach((key) => {
      if (!formData[key]) {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Saving Exchange Rate with payload:', formData);

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/master/updateCreateExRates`, formData);

      if (response.status === 200) {
        if (response.data.status === true || response.data.statusFlag === 'Ok') {
          handleClear();
          toast.success(editMode ? 'Exchange Rate Updated Successfully' : 'Exchange Rate Created Successfully', {
            autoClose: 2000,
            theme: 'colored'
          });

          getExRates();
          setEditMode(false);
        } else {
          console.error('API Error:', response.data);
          toast.error(response.data.message || 'Failed to Save Exchange Rate', {
            autoClose: 2000,
            theme: 'colored'
          });
        }
      } else {
        console.error('API Error:', response.data);
        toast.error(response.data.message || 'Failed to Save Exchange Rate', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to Save Exchange Rate', {
        autoClose: 2000,
        theme: 'colored'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'docMonth', header: 'Doc Month', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 100 },
    { accessorKey: 'sellRate', header: 'sell Rate', size: 100 },
    { accessorKey: 'buyRate', header: 'Buy Rate', size: 100 },
    { accessorKey: 'avgRate', header: 'Avg Rate', size: 100 }
  ];

  const handleClear = () => {
    setFormData({
      docDate: null,
      docMonth: null,
      currency: '',
      sellRate: '',
      buyRate: '',
      avgRate: ''
    });
    setFieldErrors({});
  };

  const handleList = () => {
    setShowForm(!showForm);
    setFieldErrors({});
  };

  const getExRateById = async (row) => {
    console.log('Editing Exchange Rate:', row);
    setShowForm(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/master/getAllExRatesById?id=${row.original.id}`);

      console.log('API Response:', response);

      if (response.status === 200) {
        const exRate = response.data.paramObjectsMap.exRatesVO[0];
        setEditMode(true);

        setFormData({
          docDate: exRate.docDate ? dayjs(exRate.docDate) : null,
          docMonth: exRate.docMonth ? dayjs(exRate.docMonth) : null,
          currency: exRate.currency || '',
          sellRate: exRate.sellRate || '',
          buyRate: exRate.buyRate || '',
          id: exRate.id || 0,
          avgRate: exRate.avgRate || '',
          orgId: orgId
        });

        console.log('DataToEdit', exRate);
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          &nbsp;{' '}
        </div>
        <div className="row d-flex mt-3">
          {showForm ? (
            <>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      value={formData.docDate}
                      onChange={(newValue) => handleDateChange('docDate', newValue)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                    />
                  </LocalizationProvider>
                  {fieldErrors.docDate && <span style={{ color: 'red' }}>This field is required</span>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Month"
                      openTo="month"
                      views={['year', 'month']}
                      value={formData.docMonth}
                      onChange={(newValue) => handleDateChange('docMonth', newValue)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                    />
                  </LocalizationProvider>
                  {fieldErrors.docMonth && <span style={{ color: 'red' }}>This field is required</span>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Currency"
                    onChange={handleInputChange}
                    name="currency"
                    value={formData.currency}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>This field is required</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    label="Sell Rate"
                    size="small"
                    required
                    name="sellRate"
                    value={formData.sellRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                  />
                  {fieldErrors.sellRate && <span style={{ color: 'red' }}>This field is required</span>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    label="Buy Rate"
                    size="small"
                    required
                    name="buyRate"
                    value={formData.buyRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                  />
                  {fieldErrors.buyRate && <span style={{ color: 'red' }}>This field is required</span>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    label="Avg Rate"
                    size="small"
                    required
                    name="avgRate"
                    value={formData.avgRate}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                  />
                  {fieldErrors.avgRate && <span style={{ color: 'red' }}>This field is required</span>}
                </FormControl>
              </div>
            </>
          ) : (
            <CommonTable columns={columns} data={data} blockEdit={true} toEdit={getExRateById} />
          )}
        </div>
      </div>
    </>
  );
};

export default ExRates;
