import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'react-tabs/style/react-tabs.css';
import Checkbox from '@mui/material/Checkbox';

const BRSOpening = () => {
  const buttonStyle = {
    fontSize: '20px' // Adjust the font size as needed save
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        {/* <div className="d-flex flex-wrap justify-content-start mb-2">
          <button className="btn btn-ghost btn-sm normal-case col-xs-2">
            <AiOutlineWallet style={buttonStyle} />
            <span className="ml-1">New</span>
          </button>
          <button className="btn btn-ghost btn-sm normal-case col-xs-2">
            <AiOutlineSearch style={buttonStyle} />
            <span className="ml-1">Search</span>
          </button>
          <button className="btn btn-ghost btn-sm normal-case col-xs-2">
            <BsListTask style={buttonStyle} />
            <span className="ml-1">List View</span>
          </button>
        </div> */}
        <div className="row d-flex mt-3">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Branch/Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-label"
                // value={age}
                label="Branch/Location"
                // onChange={handleChange}
              >
                <MenuItem value={20}>Head Office</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <TextField id="outlined-textarea" label="Bill No." placeholder="Bill No." variant="outlined" size="small" required fullWidth />
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
            <TextField id="Old Rate" label="Ref./Chq.No" placeholder="Ref./Chq.No" variant="outlined" size="small" fullWidth />
          </div>

          <div className="col-md-4 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ref./Chq.Date"
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
            <TextField
              id="outlined-textarea"
              label="Bank/Cash/A/C"
              placeholder="Bank/Cash/A/C"
              variant="outlined"
              size="small"
              required
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField id="outlined-textarea" label="Currency" placeholder="Currency" variant="outlined" size="small" fullWidth />
          </div>
          <div className="col-md-4 mb-3">
            <TextField id="outlined-textarea" label="Ex.rate" placeholder="Ex.rate" variant="outlined" size="small" fullWidth required />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Receipt Amount"
              placeholder="Receipt Amount"
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Payment Amount"
              placeholder="Payment Amount"
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Reconcile" />
            </FormGroup>
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
      </div>
    </>
  );
};

export default BRSOpening;
