import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';

const ArApBill = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed
  //   };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Branch/Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Branch/Location"
                // onChange={handleChange}
              >
                <MenuItem value={20}>HEAD OFFICE</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Party Name" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField disabled label="Party Code" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField disabled label="Currency" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField disabled label="Credit Days" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Bill No" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Bill Date"
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
            <FormControl fullWidth size="small">
              <TextField label="Bill Ex. Rate" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Supp. Ref. No" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Supp. Ref Date"
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
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
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
            <FormControl fullWidth size="small">
              <TextField label="Debit Amount" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Credit Amount" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControlLabel control={<Checkbox defaultChecked />} label="Adjustments Done" />
          </div>
        </div>
        <div className="d-flex flex-row mt-4">
          <button type="button" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Save
          </button>
          <button type="button" className="btn btn-primary">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ArApBill;
