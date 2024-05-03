import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
export const TaxMaster = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed save
  //   };

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
              <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Currency"
                // onChange={handleChange}
              >
                <MenuItem value={20}>SGST</MenuItem>
                <MenuItem value={10}>Option1</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <TextField id="outlined-textarea" label="Tax%" placeholder="Tax%" multiline variant="outlined" size="small" fullWidth />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Tax Description"
              placeholder="GST0%"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
            </FormGroup>
          </div>
        </div>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab>SGST</Tab>
          </TabList>

          <TabPanel>
            <div>
              <div className="row d-flex mt-3">
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField id="account" label="Input Account" size="small" placeholder="Input Account" inputProps={{ maxLength: 30 }} />
                  </FormControl>
                </div>
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="account"
                      label="Output Account"
                      size="small"
                      placeholder="output account"
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-4 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="account"
                      label="SGST RCM Payable"
                      size="small"
                      placeholder="sgst payable"
                      inputProps={{ maxLength: 30 }}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
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
export default TaxMaster;
