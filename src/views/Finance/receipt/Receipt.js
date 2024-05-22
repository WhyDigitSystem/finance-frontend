import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// import { AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
// import { BsListTask } from "react-icons/bs";
import TableComponent from './TableComponent';

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';

const Receipt = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="row">
          <div className="d-flex flex-wrap justify-content-start mb-4 " style={{ marginBottom: '20px' }}>
            <Tooltip title="Search" placement="top">
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SearchIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <ClearIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="List View" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Save" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SaveIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="branch_location"
                label="Branch/Location"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Receipt Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Receipt Type"
                // onChange={handleChange}
              >
                <MenuItem value={'Type-1'}>Type-1</MenuItem>
                <MenuItem value={'Type-2'}>Type-2</MenuItem>
                <MenuItem value={'Type-3'}>Type-3</MenuItem>
              </Select>
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
            <FormControl fullWidth variant="filled">
              <TextField
                id="docid"
                label="Doc ID"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="mod"
                label="Mode of Payment"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="bank_cash_ac"
                label="Bank/Cash/AC"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="currency"
                label="Currency"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="exrates"
                label="Ex.Rates"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="balance"
                label="Balance"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="recfrom"
                label="Received From"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="cheq_dd_cardbank"
                label="Cheq/DD/Card Bank"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="cheq_dd_cardno"
                label="Cheq/DD/CardNo"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Cheq/DD Date"
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
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }} />}
                label="Reconciled?"
              />
            </FormGroup>
          </div>
        </div>
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList style={{ marginBottom: 0 }}>
            <Tab>Account Particulars</Tab>
            <Tab>Summary</Tab>
          </TabList>

          <TabPanel>
            <TableComponent />
          </TabPanel>
          <TabPanel>
            <div>
              <div className="row d-flex mt-4">
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="netamt" label="Net Amount" size="small" placeholder="blcategory" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="remarks" label="Remarks" size="small" placeholder="plcategory" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Receipt;
