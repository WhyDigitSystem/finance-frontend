import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TableComponent from './TableComponent';

const GlOpening = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };
  const buttonStyle = {
    fontSize: '20px' // Adjust the font size as needed
  };
  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex justify-content-center align-items-center">
          {/* <div className="d-flex flex-wrap justify-content-start">
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
