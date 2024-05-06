import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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

const GlOpening = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };
  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ">
          <div className="d-flex flex-wrap justify-content-start mb-2 " style={{ marginBottom: '20px' }}>
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

          <div className="row d-flex mt-3">
            <div className="col-md-4">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="branch"
                  label="Branch/Location"
                  size="small"
                  required
                  //placeholder="accountcode"
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
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
            <div className="col-md-4">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="docid"
                  label="Doc ID"
                  size="small"
                  //placeholder="accountcode"
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
          </div>
          <div className="row d-flex mt-3">
            <div className="col-md-4">
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
            <div className="col-md-4">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="exRate"
                  label="Ex. Rate"
                  size="small"
                  required
                  //placeholder="accountcode"
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="referenceNo"
                  label="Reference No"
                  size="small"
                  //placeholder="accountcode"
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
          </div>
          <div className="row d-flex mt-3">
            <div className="col-md-4">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Reference Date"
                    slotProps={{
                      textField: { size: 'small', clearable: true }
                    }}
                    //value={boDate}
                    //onChange={(newValue) => setBoDate(newValue)}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="suppRefNo"
                  label="Supp. Ref. No"
                  size="small"
                  //placeholder="accountcode"
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
            <div className="col-md-4">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Supp Ref. Date"
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
          <div className="row d-flex mt-3">
            <div className="col-md-8">
              <FormControl fullWidth variant="filled">
                <TextField
                  id="remarks"
                  label="Remarks"
                  size="small"
                  multiline
                  minRows={2}
                  //placeholder="accountcode"
                  //   inputProps={{ maxLength: 30 }}
                />
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab>Account Particulars</Tab>
            <Tab>Total Summary</Tab>
          </TabList>

          <TabPanel>
            <TableComponent />
          </TabPanel>
          <TabPanel>
            <div className="row d-flex mt-3">
              <div className="col-md-4">
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
              <div className="col-md-4">
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
    </div>
  );
};

export default GlOpening;
