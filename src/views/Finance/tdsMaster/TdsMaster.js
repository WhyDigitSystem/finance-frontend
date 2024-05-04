import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import TableComponent from './TableComponent';

const TdsMaster = () => {
  const buttonStyle = {
    fontSize: '20px' // Adjust the font size as needed
  };

  //   const [openBankModal, setOpenBankModal] = React.useState(false);

  //   const handleBankOpen = () => {
  //     setOpenBankModal(true);
  //   };
  //   const handleBankClose = () => {
  //     setOpenBankModal(false);
  //   };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl">
        <div className="d-flex justify-content-between">{/* <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1> */}</div>
        <div className="row d-flex">
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
          <div className="col-md-4 mb-2">
            <FormControl fullWidth variant="filled">
              <TextField id="Section" label="Section" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="Section" label="Section Name" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
            </FormGroup>
          </div>
        </div>

        <TableComponent />
        <div className="d-flex flex-row mt-3">
          <button
            type="button"
            //onClick={handleCustomer}
            className="bg-blue me-5 inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            Save
          </button>
          <button
            type="button"
            //onClick={handleCustomerClose}
            className="bg-blue inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default TdsMaster;
