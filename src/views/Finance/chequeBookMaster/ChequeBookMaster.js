import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
// import { AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
// import { BsListTask } from "react-icons/bs";
import TableComponent from '../chequeBookMaster/TableComponent';

const ChequeBookMaster = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed
  //   };

  //   const [openBankModal, setOpenBankModal] = React.useState(false);

  //   const handleBankOpen = () => {
  //     setOpenBankModal(true);
  //   };
  //   const handleBankClose = () => {
  //     setOpenBankModal(false);
  //   };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between">{/* <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1> */}</div>
        <div className="row d-flex mb-4">
          {/* <div className="d-flex flex-wrap justify-content-start mb-3">
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineWallet style={buttonStyle} />
              <span className="ml-1">New</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineSearch style={buttonStyle} />
              <span className="ml-1">Search</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiFillSave style={buttonStyle} />
              <span className="ml-1">Save</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <BsListTask style={buttonStyle} />
              <span className="ml-1">List View</span>
            </button>
          </div> */}

          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Branch/Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Branch/Location"
                // onChange={handleChange}
              >
                <MenuItem value={'Bangalore'}>Bangalore</MenuItem>
                <MenuItem value={'Chennai'}>Chennai</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-2">
            <FormControl fullWidth variant="filled">
              <TextField disabled label="Cheque Book ID" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="bank" label="Bank" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="checkprefix" label="Check Prefix" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="checkstartno" label="Check Start No" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="noofchequeleaves" label="No of Cheque Leaves" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
        </div>
        <h5 className="text-sm font-semibold mb-3">Cheque Details</h5>

        <TableComponent />
        <div className="d-flex flex-row mt-3">
          <button
            type="button"
            //onClick={handleCustomer}
            className="btn btn-primary"
            style={{ marginLeft: '10px' }}
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

export default ChequeBookMaster;
