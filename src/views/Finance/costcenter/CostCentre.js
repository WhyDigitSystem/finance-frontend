import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import TableComponent from './TableComponent';

const CostCentre = () => {
  const buttonStyle = {
    fontSize: '20px' // Adjust the font size as needed
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
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
            <BsListTask style={buttonStyle} />
            <span className="ml-1">List View</span>
          </button>
        </div> */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Dimension Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Dimension Type"
                // onChange={handleChange}
              >
                <MenuItem value={20}>Dimension 1</MenuItem>
                <MenuItem value={10}>Dimension 2</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Value Code" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Value Description" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
        </div>
        <TableComponent />
        <div className="d-flex flex-row mt-4">
          <button type="button" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Save
          </button>
          <button type="button" className="btn btn-primary">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default CostCentre;
