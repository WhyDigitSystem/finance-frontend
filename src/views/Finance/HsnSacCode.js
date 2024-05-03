import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';
import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';

export const HsnSacCode = () => {
  const buttonStyle = {
    fontSize: '20px' // Adjust the font size as needed
  };

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
        <div className="row d-flex align-items-center">
          <div className="d-flex flex-wrap justify-content-start mb-3">
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineWallet style={buttonStyle} />
              <span className="ml-1">New</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineSearch style={buttonStyle} />
              <span className="ml-1">Search</span>
            </button>
            {/* <button className="btn btn-ghost btn-sm normal-case col-xs-2">
          <AiFillSave style={buttonStyle} />
          <span className="ml-1">Save</span>
        </button> */}
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <BsListTask style={buttonStyle} />
              <span className="ml-1">List View</span>
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Type"
                // onChange={handleChange}
              >
                <MenuItem value="Type-1">Type-1</MenuItem>
                <MenuItem value="Type-2">Type-2</MenuItem>
                <MenuItem value="Type-3">Type-3</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="code"
                label="Code"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="description"
                label="Description"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="chapter"
                label="Chapter"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="chapter-code"
                label="Chapter Code"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="sub-chapter-code"
                label="Sub Chapter Code"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="sub-chapter"
                label="Sub Chapter"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="rate"
                label="Rate"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Excempted (Yes/No)</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Excempted (Yes/No)"
                // onChange={handleChange}
              >
                <MenuItem value="Value-1">Value-1</MenuItem>
                <MenuItem value="Value-2">Value-2</MenuItem>
                <MenuItem value="Value-3">Value-3</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="account"
                label="Section"
                size="small"
                required
                placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="account"
                label="Section Name"
                size="small"
                required
                placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div> */}
          <div className="col-md-4 mb-2">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
            </FormGroup>
          </div>
        </div>
        <div className="d-flex flex-row mt-3">
          <button
            type="button"
            //onClick={handleCustomer}
            className="btn btn-primary"
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
  );
};
