import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import TableComponent from './TableComponent';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase } from '@mui/material';
import { useRef } from 'react';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'react-tabs/style/react-tabs.css';

const Account = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const theme = useTheme();
  const anchorRef = useRef(null);

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
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
        {/* <div className="d-flex justify-content-between">
          <h1 className="text-xl font-semibold mb-3">Account</h1>
        </div> */}
        <div className="row d-flex">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Account/Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Account/Group"
                // onChange={handleChange}
              >
                <MenuItem value={10}>atype</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Branch/Location"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          {/* </div>
          <div className="row d-flex justify-content-center align-items-center"> */}
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Account Type"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Primary Group</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Group Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Group Name"
                // onChange={handleChange}
              >
                <MenuItem value={10}>groupname</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* </div>
          <div className="row d-flex justify-content-center align-items-center"> */}
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField id="account" label="Account Code" size="small" required placeholder="accountcode" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="account"
                label="Account/Group Name"
                size="small"
                required
                placeholder="accountname"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          {/* </div>
          <div className="row d-flex justify-content-center align-items-center"> */}
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Category"
                // onChange={handleChange}
              >
                <MenuItem value={10}>acategory</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Currency"
                // onChange={handleChange}
              >
                <MenuItem value={10}>acurrency</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* </div>
          <div className="row d-flex justify-content-center align-items-center"> */}
          <div className="col-md-4 mb-3">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }} />}
                label="Block/Unblock"
              />
            </FormGroup>
          </div>
          <div className="col-md-4 mb-3">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }} />}
                label="is ITC Applicable?"
              />
            </FormGroup>
          </div>
        </div>
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab>Link to Final Statements</Tab>
            <Tab>Bank Details</Tab>
            <Tab>Company</Tab>
          </TabList>

          <TabPanel>
            <div>
              <div className="row d-flex mt-4">
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="account" label="Balance Sheet" size="small" placeholder="blcategory" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Cash Flow Statement</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="Cash Flow Statement"
                      // onChange={handleChange}
                    >
                      <MenuItem value={10}>cfcategory</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="account" label="Income Statement" size="small" placeholder="plcategory" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
                <div className="col-md-5 mb-2"></div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <div className="row d-flex mt-4">
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Bank Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="Bank Type"
                      // onChange={handleChange}
                    >
                      <MenuItem value={10}>banktype</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="account"
                      label="Bank Account No"
                      size="small"
                      placeholder="bankaccountno"
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>

                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="account" label="Over draft limit" size="small" placeholder="odlimit" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
                <div className="col-md-5 mb-2"></div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <TableComponent />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default Account;
