import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import 'react-tabs/style/react-tabs.css';

export const SetTaxRate = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed save
  //   };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        {/* <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
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
            <TextField
              id="outlined-textarea"
              label="Chapter"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Sub Chapter"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="HSN Code"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="Old Rate"
              label="Branch/Location"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="New Rate"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Excepmted</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Excepmted"
                // onChange={handleChange}
              >
                <MenuItem value="0">Yes</MenuItem>
                <MenuItem value="1">No</MenuItem>
              </Select>
            </FormControl>
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
    </>
  );
};
export default SetTaxRate;
