import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import ActionButton from 'utils/action-button';
import TableComponent from './TableComponent';

const PaymentVoucher = () => {
  const [tabIndex, setTabIndex] = useState(0);
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4 " style={{ marginBottom: '20px' }}>
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={''} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={''} />
          <ActionButton title="Save" icon={SaveIcon} onClick={''} margin="0 10px 0 10px" />
        </div>
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Vch Sub TypeScript
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Vch Sub TypeScript"
                // onChange={handleChange}
              >
                <MenuItem value={20}>Bank Payment</MenuItem>
                <MenuItem value={10}>Cash</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Ref No
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Ref No"
                // onChange={handleChange}
              >
                <MenuItem value={20}>General Journal</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ref Date"
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField required label="Currency" size="small" placeholder="INR" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Doc ID" size="small" disabled required placeholder="Auto" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
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
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Ex-rate" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
        </div>
        <div className="col-md-8 mb-3">
          <FormControl fullWidth variant="filled">
            <TextField
              id="Narration"
              label="Remarks"
              size="small"
              multiline
              minRows={2}
              //placeholder="accountcode"
              //   inputProps={{ maxLength: 30 }}
            />
          </FormControl>
        </div>
        {/* <div className="d-flex flex-row mt-4">
          <button type="button" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Save
          </button>
          <button type="button" className="btn btn-primary">
            Cancel
          </button>
        </div> */}
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
              <Tab label="Account Particulars" value="1" />
              <Tab label="Total Summary" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div>
              <TableComponent />
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="row d-flex mt-3">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="totalDebit"
                    label="Total Debit Amount"
                    size="small"
                    //placeholder="accountcode"
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="totalCredit"
                    label="Total Credit Amount"
                    size="small"
                    //placeholder="accountcode"
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
};

export default PaymentVoucher;
