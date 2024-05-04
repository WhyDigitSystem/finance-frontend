import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';

const ExRates = () => {
  //   const buttonStyle = {
  //     fontSize: '20px'
  //   };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        {/* <div className="d-flex justify-content-between">
          <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1>
        </div> */}
        {/* <div className="d-flex flex-wrap justify-content-start mb-2">
          <button
            className="btn btn-ghost btn-sm normal-case col-xs-2"
            //onClick={handleNew}
          >
            <AiOutlineWallet style={buttonStyle} />
            <span className="ml-1">New</span>
          </button>
          <button className="btn btn-ghost btn-sm normal-case col-xs-2">
            <AiOutlineSearch style={buttonStyle} />
            <span className="ml-1">Search</span>
          </button>
          <button
            className="btn btn-ghost btn-sm normal-case col-xs-2"
            //onClick={getAllCompanyFields}
          >
            <BsListTask style={buttonStyle} />
            <span className="ml-1">List View</span>
          </button>
        </div> */}
        <div className="row d-flex mt-3">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Doc Date"
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>

          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Doc Month"
                  openTo="month"
                  views={['year', 'month']}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="currency"
                label="Currency"
                size="small"
                required
                //placeholder="40003600104"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="sellrate"
                label="Sell Rate"
                size="small"
                required
                //placeholder="40003600104"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="buyrate"
                label="Buy Rate"
                size="small"
                required
                //placeholder="40003600104"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="avgrate"
                label="Avg Rate"
                size="small"
                required
                //placeholder="40003600104"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-row mt-3">
          <button
            type="button"
            //onClick={handleCustomer}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            Save
          </button>
          <button
            type="button"
            //onClick={handleCustomerClose}
            className="btn btn-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ExRates;
