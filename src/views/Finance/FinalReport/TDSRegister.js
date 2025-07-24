import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { getAllActiveBranches } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import ActionButton from 'utils/ActionButton';
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="down"
      ref={ref}
      {...props}
      timeout={{
        appear: 1000,
        enter: 1000,
        exit: 1000
      }}
    />
  );
});
const TDSRegister = () => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fromDate: null,
      toDate: null,
      branch: null,
      partyName: null
    }
  });
  const [partyNameList, setPartyNameList] = useState([]);
  const [branchCodeList, setBranchCodeList] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const branches = await getAllActiveBranches(orgId);
        setBranchCodeList(branches);

        const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=customer`);
        const allOption = { partyName: 'All' };
        const parties = [allOption, ...(response?.paramObjectsMap?.partyMasterVO || [])];
        setPartyNameList(parties);
        setValue('partyName', allOption);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDropdowns();
  }, [orgId, setValue]);

  const ClearForm = () => {
    setValue('partyName', { partyName: 'All' });
    setValue('fromDate', null);
    setValue('toDate', null);
    setValue('branch', null);
    clearErrors();
  };

  const onSubmit = (formData) => {
    console.log('Submitted Data:', formData);
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
          <div className="row d-flex">
            {/* From Date */}

            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="fromDate"
                    control={control}
                    rules={{ required: 'From Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="From Date"
                        format="DD-MM-YYYY"
                        value={field.value || null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!errors.fromDate,
                            helperText: errors.fromDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>

            {/* To Date */}
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="toDate"
                    control={control}
                    rules={{ required: 'To Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        label="To Date"
                        format="DD-MM-YYYY"
                        value={field.value || null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: 'small',
                            error: !!errors.toDate,
                            helperText: errors.toDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>

            {/* Branch Dropdown */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: 'Branch is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={branchCodeList}
                      getOptionLabel={(option) => option?.branchCode || ''}
                      isOptionEqualToValue={(o, v) => o?.branchCode === v?.branchCode}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Branch" error={!!errors.branch} helperText={errors.branch?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>

            {/* Party Dropdown */}
            <div className="col-md-3 mb-3">
              <FormControl size="small" fullWidth>
                <Controller
                  name="partyName"
                  control={control}
                  rules={{ required: 'Party Name is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      size="small"
                      options={partyNameList}
                      getOptionLabel={(option) => option?.partyName || ''}
                      isOptionEqualToValue={(o, v) => o?.partyName === v?.partyName}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField {...params} label="Party" error={!!errors.partyName} helperText={errors.partyName?.message} />
                      )}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-2">
              <div className="row d-flex ml">
                <div className="d-flex flex-wrap justify-content-start mb-4 mt-1" style={{ marginBottom: '20px' }}>
                  <ActionButton title="Search" icon={SearchIcon} type="submit" />
                  <ActionButton title="Clear" icon={ClearIcon} onClick={ClearForm} />
                </div>
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </form>
    </>
  );
};
export default TDSRegister;
