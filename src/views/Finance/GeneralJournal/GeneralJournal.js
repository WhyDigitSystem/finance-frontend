import FormControl from '@mui/material/FormControl';
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
import TableComponent from './TableComponent';

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';

const GeneralJournal = () => {
  const [tabIndex, setTabIndex] = useState(0);
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
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
              <InputLabel id="demo-simple-select-label" required>
                Voucher Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Voucher Type"
                // onChange={handleChange}
              >
                <MenuItem value={20}>General Journal</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
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
            <FormControl fullWidth size="small">
              <TextField label="Doc ID" size="small" disabled required placeholder="Auto" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Template" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField required label="Currency" size="small" placeholder="INR" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Ex. Rate" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Ref No" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ref. Date"
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
                  label="Reverse On"
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
        </div>
        <div className="col-md-8 mb-3">
          <FormControl fullWidth variant="filled">
            <TextField
              id="Narration"
              label="Narration"
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
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList style={{ marginBottom: 0 }}>
            <Tab>Account Particulars</Tab>
            <Tab>Total Summary</Tab>
          </TabList>

          <TabPanel>
            <TableComponent />
          </TabPanel>
          <TabPanel>
            <div className="row d-flex mt-3">
              <div className="col-md-4 mb-3">
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
              <div className="col-md-4 mb-3">
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
        </Tabs>
      </div>
    </>
  );
};

export default GeneralJournal;
